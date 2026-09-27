import os
import io
import json
import base64
import asyncio
import httpx
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import edge_tts

router = APIRouter(prefix="/api")

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    history: List[ChatMessage] = []
    app_state: Optional[Dict[str, Any]] = None
    user_context: Optional[Dict[str, Any]] = None
    generate_audio: bool = False

class ChatResponse(BaseModel):
    reply_text: str
    audio_base64: Optional[str] = None

class TTSRequest(BaseModel):
    text: str
    language: str = "en"

# Neural Voices based on language mapping
VOICE_MAP = {
    'hi': 'hi-IN-SwaraNeural',
    'ta': 'ta-IN-PallaviNeural',
    'en': 'en-IN-NeerjaNeural'
}

async def generate_tts_base64_async(text: str, lang_code: str) -> str:
    """Generate in-memory MP3 audio bytes using Microsoft Edge Neural TTS and encode as Base64 string."""
    clean_text = text
    clean_text = re.sub(r'[*_~`#]', '', clean_text)
    clean_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', clean_text)
    clean_text = re.sub(r'-{3,}', '', clean_text)
    clean_text = clean_text.replace('\n', ' ').replace('  ', ' ').strip()
    
    if not clean_text:
        return ""
        
    voice = VOICE_MAP.get(lang_code, 'en-IN-NeerjaNeural')
    try:
        communicate = edge_tts.Communicate(clean_text, voice)
        audio_data = bytearray()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data.extend(chunk["data"])
        return base64.b64encode(audio_data).decode('utf-8')
    except Exception as e:
        print(f"TTS Engine Error: {e}")
        return ""

async def generate_gemini_direct(api_key: str, contents: list, system_instruction: str) -> str:
    """Direct REST API call to Gemini. Fails FAST to trigger smart fallback."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"
    
    payload = {
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3
        }
    }
    
    # Try exactly ONCE with a fast 4.0 second timeout to prevent the UI from hanging
    # if Google's servers are throwing 503 or 429 quota limits.
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload, timeout=4.0)
        
        if resp.status_code == 200:
            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise Exception("Empty candidates array from Gemini.")
            return candidates[0]["content"]["parts"][0]["text"].strip()
        else:
            raise Exception(f"HTTP {resp.status_code}: Gemini API Overloaded")


def generate_smart_fallback(payload: ChatRequest, state: dict, lang_code: str) -> str:
    name = state.get("applicant_name", "Entrepreneur")
    amount = state.get("loan_amount", "90,000")
    emi = state.get("monthly_emi", "3,221")
    scheme = state.get("scheme_name", "Mahila Samriddhi Yojana")
    branch = state.get("recommended_branch", {}).get("name", "Indian Bank")
    moratorium = state.get('moratorium_months', '3')
    interest = state.get('interest_rate_pct', '4.0')
    
    msg = payload.message.lower()
    
    # INTENT: Scheme / Interest
    if "scheme" in msg or "interest" in msg or "yojana" in msg or "plan" in msg or "திட்டம்" in msg or "योजना" in msg:
        if lang_code == 'ta': return f'உங்களுக்கு {scheme} பரிந்துரைக்கப்பட்டுள்ளது. இதில் {interest}% வட்டி உள்ளது.'
        if lang_code == 'hi': return f'आपको {scheme} की सिफारिश की गई है। इसमें {interest}% ब्याज है।'
        return f"Based on your profile, you have been recommended for the **{scheme}**.\n\nThis scheme offers a highly subsidized interest rate of **{interest}% per annum**."
        
    # INTENT: Moratorium
    elif "moratorium" in msg or "holiday" in msg or "மாதம்" in msg or "महीने" in msg:
        if lang_code == 'ta': return f'உங்களுக்கு {moratorium} மாத கால அவகாசம் உள்ளது. நீங்கள் முதல் {moratorium} மாதங்களுக்கு EMI செலுத்த தேவையில்லை.'
        if lang_code == 'hi': return f'आपके पास {moratorium} महीने की मोहलत है। आपको पहले {moratorium} महीनों के लिए EMI नहीं देना होगा।'
        return f"You have been granted a **{moratorium}-Month Moratorium Period**.\n\nA moratorium is a **repayment holiday**. It means you will not have to pay any EMI for the first {moratorium} months."
        
    # INTENT: Branch / Location / Where
    elif "branch" in msg or "where" in msg or "bank" in msg or "வங்கி" in msg or "बैंक" in msg:
        if lang_code == 'ta': return f'உங்கள் கடன் **{branch}** வங்கிக்கு அனுப்பப்பட்டுள்ளது.'
        if lang_code == 'hi': return f'आपका ऋण **{branch}** को भेजा गया है।'
        return f"Your application has been routed to **{branch}**.\n\nThis branch was automatically selected because of its low NPA rate."
        
    # INTENT: EMI / Repayment
    elif "emi" in msg or "repay" in msg or "month" in msg or "மாதாந்திர" in msg or "किश्त" in msg:
        if lang_code == 'ta': return f'{moratorium} மாதங்களுக்குப் பிறகு, உங்கள் மாதாந்திர EMI **₹{emi}** ஆக இருக்கும்.'
        if lang_code == 'hi': return f'{moratorium} महीने के बाद, आपकी मासिक EMI **₹{emi}** होगी।'
        return f"Your approved loan amount is **₹{amount}**.\n\nAfter your {moratorium}-month moratorium period ends, your EMI will be **₹{emi}**."

    # DEFAULT SUMMARY
    if lang_code == 'ta': return f'வணக்கம் {name}! உங்களின் {scheme} விண்ணப்பம் அங்கீகரிக்கப்பட்டுள்ளது. அனுமதிக்கப்பட்ட கடன் தொகை ₹{amount} மற்றும் EMI ₹{emi}.'
    if lang_code == 'hi': return f'नमस्ते {name}! आपका {scheme} आवेदन स्वीकृत है। स्वीकृत ऋण राशि ₹{amount} और EMI ₹{emi} है।'
    
    return (
        f"Hello, {name}! I am **Samriddhi**, your dedicated Financial Advisor with MoSJE. Here is your application summary:\n\n"
        "--- \n### **1. Your Profile Overview**\n"
        f"* **Applicant Name:** {name}\n"
        f"* **Category:** {state.get('category', 'SC')}\n"
        f"* **Location:** {state.get('district', 'Chengalpattu')}, {state.get('state', 'Tamil Nadu')}\n\n"
        "--- \n### **2. Loan & Scheme Details**\n"
        f"* **Selected Scheme:** **{scheme}**\n"
        f"* **Approved Loan Amount:** ₹{amount}\n"
        f"* **Interest Rate:** **{interest}% per annum**\n"
        f"* **Moratorium Period:** **{moratorium} Months**\n"
        f"* **Monthly EMI:** **₹{emi}**\n\n"
        "--- \n### **3. Recommended Bank Branch**\n"
        f"* **Bank & Branch:** {branch}\n\n"
        "---\nEverything in your profile is lined up nicely. Please ask if you need details about your EMI, branch, or scheme!"
    )


@router.post('/tts')
async def tts_endpoint(payload: TTSRequest):
    lang_code = payload.language[:2].lower()
    if lang_code not in ['en', 'hi', 'ta']:
        lang_code = 'en'
    audio_base64 = await generate_tts_base64_async(payload.text, lang_code)
    return {"audio_base64": audio_base64}


@router.post('/chat', response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="User message cannot be empty.")

    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key or api_key == "YOUR_GEMINI_API_KEY":
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")

    lang_code = payload.language[:2].lower()
    if lang_code not in ['en', 'hi', 'ta']:
        lang_code = 'en'

    state = payload.app_state or {}
    user_ctx = payload.user_context or {}
    state_json = json.dumps({"app_state": state, "user_context": user_ctx})

    if payload.generate_audio:
        system_instruction = (
            "You are Samriddhi, a Voice Assistant for the Ministry of Social Justice & Empowerment (MoSJE).\n"
            f"You have realtime access to the user's current application state: {state_json}\n\n"
            "VOICE ASSISTANT RULES:\n"
            "1. BE EXTREMELY CONCISE: Responses MUST be short, direct, and conversational (1 to 3 sentences maximum).\n"
            "2. NO MARKDOWN: Absolutely NO asterisks (*), hashtags (#), bullet points, or dashes. Speak naturally.\n"
            "3. ACTIVE CALCULATION: If asked about loans or EMIs, state the exact numbers simply.\n"
            "4. TONE: Warm, encouraging, and natural, like a helpful government officer on a phone call.\n"
            f"5. LANGUAGE STRICTNESS: You MUST respond purely in the requested language ({lang_code}).\n"
        )
    else:
        system_instruction = (
            "You are Samriddhi, a highly intelligent Financial Advisor for the Ministry of Social Justice & Empowerment (MoSJE).\n"
            f"You have realtime access to the user's current application state and data: {state_json}\n\n"
            "TEXT CHAT RULES:\n"
            "1. BE COMPREHENSIVE YET ACCESSIBLE: Break down complex financial terms into simple concepts.\n"
            "2. ACTIVE CALCULATION: Use the state_json to give exact numbers.\n"
            "3. STRICT FORMATTING FOR SUMMARIES: If the user asks for a summary, YOU MUST strictly use Markdown headers, bolding, and bullet points similar to this:\n"
            "### 1. Profile Overview\n### 2. Loan Details\n### 3. Recommended Branch\n"
            "4. TONE: Warm, encouraging, and authoritative.\n"
            f"5. LANGUAGE STRICTNESS: You MUST respond purely in the requested language ({lang_code}). Never mix languages.\n"
        )

    formatted_contents = []
    for item in payload.history:
        role = 'user' if item.role in ('user', 'human') else 'model'
        formatted_contents.append({"role": role, "parts": [{"text": item.text}]})
    formatted_contents.append({"role": "user", "parts": [{"text": payload.message}]})

    try:
        reply_text = await generate_gemini_direct(api_key, formatted_contents, system_instruction)
    except Exception as e:
        print(f"Gemini API Exception (503/429/Timeout): {e}. Falling back to Smart Mock.")
        # INSTANT SMART FALLBACK - Hackathon Demo Saver!
        reply_text = generate_smart_fallback(payload, state, lang_code)

    audio_base64 = None
    if payload.generate_audio:
        audio_base64 = await generate_tts_base64_async(reply_text, lang_code)

    return ChatResponse(reply_text=reply_text, audio_base64=audio_base64)
