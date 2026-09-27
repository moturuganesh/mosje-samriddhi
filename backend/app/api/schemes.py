from fastapi import APIRouter, HTTPException
from app.models.schemas import ApplicantProfile, SchemeEvaluationResult
from app.core.rules import evaluate_mosje_scheme
from app.core.schemes_db import SCHEMES_DB

router = APIRouter(prefix='/api', tags=['Scheme Matching Engine'])

@router.post('/evaluate-scheme', response_model=SchemeEvaluationResult, summary='Deterministic MoSJE/NSFDC Scheme Evaluation')
def evaluate_scheme_endpoint(profile: ApplicantProfile):
    try:
        result = evaluate_mosje_scheme(profile)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/schemes', summary='Get Full Scheme Directory')
def get_all_schemes():
    return SCHEMES_DB
