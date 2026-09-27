import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend directory explicitly, not relative to CWD
_backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(_backend_dir / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.schemes import router as schemes_router
from app.api.calculator import router as calculator_router
from app.api.ocr import router as ocr_router
from app.api.router import router as geo_router
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.api.applications import router as apps_router

from app.db import engine, Base

app = FastAPI(
    title='MoSJE Samriddhi Channel Finance Engine',
    description='Zero-hallucination scheme matching, capitalized moratorium math, and geo-spatial routing for MoSJE/NSFDC',
    version='1.0.0'
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(ocr_router)
app.include_router(schemes_router)
app.include_router(calculator_router)
app.include_router(geo_router)
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(apps_router)

@app.get('/health', tags=['Health'])
async def health_check():
    return {
        'status': 'healthy',
        'service': 'MoSJE Samriddhi Engine',
        'framework': 'FastAPI',
        'version': '1.0.0'
    }

@app.get('/', tags=['Root'])
async def root():
    return {
        'message': 'Welcome to MoSJE Samriddhi Channel Finance Engine',
        'endpoints': {
            'extract_document': '/api/extract-document',
            'mock_extract_document': '/api/mock/extract-document',
            'evaluate_scheme': '/api/evaluate-scheme',
            'calculate_emi': '/api/calculate-emi',
            'route_branch': '/api/route-branch',
            'admin_branches': '/api/admin/branches',
            'docs': '/docs'
        }
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app.main:app', host='0.0.0.0', port=8000, reload=True)
