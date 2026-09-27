from fastapi import APIRouter, HTTPException
from app.models.schemas import EMICalculationRequest, EMICalculationResult
from app.core.calculator import calculate_moratorium_emi

router = APIRouter(prefix='/api', tags=['Financial Math & Moratorium Calculator'])

@router.post('/calculate-emi', response_model=EMICalculationResult, summary='Calculate EMI with Moratorium Interest Capitalization')
def calculate_emi_endpoint(request: EMICalculationRequest):
    try:
        result = calculate_moratorium_emi(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
