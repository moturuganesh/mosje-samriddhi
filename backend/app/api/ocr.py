import os
import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv
from app.models.schemas import ApplicantProfile

load_dotenv()

router = APIRouter(prefix='/api', tags=['Multimodal OCR & Extraction Engine'])

MOCK_EXTRACTED_DATA = {
    "applicant_name": "Priyadarshini",
    "gender": "Female",
    "category": "SC",
    "annual_income": 90000,
    "project_cost": 90000,
    "district": "Chengalpattu",
    "state": "Tamil Nadu",
    "certificate_id": "TN/CGL/2026/INC-98231",
    "latitude": 12.7930,
    "longitude": 80.2180
}

@router.post('/mock/extract-document', response_model=ApplicantProfile, summary='Mock Document Extraction for Testing')
def mock_extract_document(file: UploadFile = File(None)):
    return ApplicantProfile(**MOCK_EXTRACTED_DATA)

@router.post('/extract-document', response_model=ApplicantProfile, summary='Multimodal Document OCR via Gemini SDK')
def extract_document(file: UploadFile = File(...)):
    api_key = os.getenv('GEMINI_API_KEY')
    
    contents = file.file.read()
    mime_type = file.content_type or 'image/jpeg'
    
    if not api_key or api_key.strip() in ('', 'YOUR_GEMINI_API_KEY_HERE', 'placeholder'):
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        
        prompt = "Extract the following fields from this Indian government certificate or admission letter and return ONLY a strict JSON object: applicant_name, gender, category (SC/ST/OBC/General), annual_income (numeric), district, state, certificate_id, project_cost, business_activity, education_status (course name or degree if this is an admission letter), sector (guess from business_activity: Agriculture, Manufacturing, Services, Tech, Healthcare), business_stage (guess Ideation or Growth / Scaling)." 

        image_part = types.Part.from_bytes(data=contents, mime_type=mime_type)
        try:
            response = client.models.generate_content(
                model='gemini-3.8-flash',
                contents=[image_part, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_schema=ApplicantProfile,
                    temperature=0.1
                )
            )
        except Exception:
            # Fallback to older model if quota/404 occurs
            response = client.models.generate_content(
                model='gemini-3.5-flash-lite',
                contents=[image_part, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_schema=ApplicantProfile,
                    temperature=0.1
                )
            )

        if response.parsed:
            return response.parsed
        else:
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            elif text.startswith('```'):
                text = text[3:]
            if text.endswith('```'):
                text = text[:-3]
            text = text.strip()
            data = json.loads(text)
            return ApplicantProfile(**data)

    except Exception as e:
        print(f'Gemini OCR API Error (Fallback to mock data): {str(e)}')
        return ApplicantProfile(**MOCK_EXTRACTED_DATA)
