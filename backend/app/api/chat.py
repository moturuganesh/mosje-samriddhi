
import os
import io
import json
import base64
import asyncio
import httpx
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

class ChatResponse(BaseModel):
    reply_text: str
    audio_base64: str

# Neural Voices based on language mapping
VOICE_MAP = {
    'hi': 'hi-IN-SwaraNeural',
    'ta': 'ta-IN-PallaviNeural',
    'en': 'en-IN-NeerjaNeural'
}

async def generate_tts_base64_async(text: str, lang_code: str) -> str:
    """Generate in-memory MP3 audio bytes using Microsoft Edge Neural TTS and encode as Base64 string."""
    clean_text = text.replace('*', '').replace('#', '').strip()
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
    """Direct REST API call to Gemini 3.8 Flash, bypassing the buggy SDK, with 3 retries."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={api_key}"
    
    payload = {
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3
        }
    }
    
    last_error = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, json=payload, timeout=12.0)
                
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if not candidates:
                        raise Exception("Empty candidates array from Gemini.")
                    
                    return candidates[0]["content"]["parts"][0]["text"].strip()
                
                # If 503, retry!
                elif resp.status_code == 503:
                    last_error = Exception(f"503 UNAVAILABLE on attempt {attempt+1}")
                    await asyncio.sleep(1.0)
                    continue
                    
                else:
                    # Some other error (400, 403, 404), log it and break (no point retrying)
                    raise Exception(f"HTTP {resp.status_code}: {resp.text}")
                    
        except httpx.ReadTimeout:
            last_error = Exception(f"ReadTimeout on attempt {attempt+1}")
            await asyncio.sleep(0.5)
            continue
        except Exception as e:
            last_error = e
            await asyncio.sleep(0.5)
            continue
            
    raise last_error or Exception("Gemini API overloaded after 3 attempts.")


@router.post('/chat', response_model=ChatResponse, summary='Direct REST API Gemini with Native Retry and Edge TTS')
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

    system_instruction = (
        "You are Samriddhi, a highly intelligent, empathetic, and professional Financial Advisor for the Ministry of Social Justice & Empowerment (MoSJE) and NSFDC.\n"
        "Your goal is to guide marginalized citizens (SC/OBC/Safai Karamcharis) through the 'Zero-Hallucination Channel Finance Platform'.\n"
        f"You have realtime access to the user's current application state and data: {state_json}\n\n"
        "CORE CAPABILITIES & RULES:\n"
        "1. BE COMPREHENSIVE YET ACCESSIBLE: Break down complex financial terms (like Moratorium, EMI, Interest Subvention) into simple, easy-to-understand concepts.\n"
        "2. ACTIVE CALCULATION: If the user asks about loan amounts or EMI, use the state_json to give them exact numbers. (e.g., 'Your approved loan is 1.5 Lakhs at 4%').\n"
        "3. KNOWLEDGE BASE: You know that MSY (Mahila Samriddhi Yojana) is for women at 4% interest up to 1.4 Lakhs. MCF (Micro Credit Finance) is for general up to 1.25 Lakhs at 5%. Term Loans go up to 30 Lakhs at 6-8%.\n"
        "4. FORMATTING: Use Markdown (bolding, bullet points) to structure your text response so it is easy to read on screen.\n"
        "5. TONE: Warm, encouraging, and authoritative. Do not sound like a generic bot. Sound like a dedicated government officer who truly wants to help them succeed.\n"
        f"6. LANGUAGE STRICTNESS: You MUST respond purely in the requested language ({lang_code}). Never mix languages.\n"
    )

    try:
        formatted_contents = []
        for item in payload.history:
            # REST API expects role to be 'user' or 'model'
            role = 'user' if item.role in ('user', 'human') else 'model'
            formatted_contents.append({
                "role": role,
                "parts": [{"text": item.text}]
            })

        formatted_contents.append({
            "role": "user", 
            "parts": [{"text": payload.message}]
        })

        # Run direct REST API with native retry loop
        reply_text = await generate_gemini_direct(api_key, formatted_contents, system_instruction)
        
        # Run Neural TTS Generation
        audio_base64 = await generate_tts_base64_async(reply_text, lang_code)

        return ChatResponse(
            reply_text=reply_text,
            audio_base64=audio_base64
        )

    except Exception as e:
        print(f"FATAL Gemini API Execution Error: {e}")
        # As an absolute last resort if all 3 REST retries fail:
        fallback = "Our AI servers are currently processing a massive volume of applications across India. However, your application is securely saved in your Citizen Dashboard. Please check there for your assigned branch and official MoSJE PDF Docket."
        audio_base64 = await generate_tts_base64_async(fallback, lang_code)
        return ChatResponse(reply_text=fallback, audio_base64=audio_base64)
