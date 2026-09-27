import pytest
from app.models.schemas import ApplicantProfile, EMICalculationRequest
from app.core.rules import evaluate_mosje_scheme
from app.core.calculator import calculate_moratorium_emi

def test_female_micro_credit_msy():
    profile = ApplicantProfile(
        applicant_name='Sunita Devi',
        annual_family_income=180000.0,
        gender='Female',
        category='SC',
        project_cost=100000.0,
        purpose='Tailoring / Textile Unit',
        business_stage='Seed / Early-Stage',
        state='Pan-India',
        age=32
    )
    result = evaluate_mosje_scheme(profile)
    assert result.is_eligible is True
    assert len(result.all_eligible_schemes) >= 1
    assert result.primary_recommended_scheme is not None
    assert result.primary_recommended_scheme.scheme_id == 'NSFDC-MSY-2026'
    assert result.primary_recommended_scheme.interest_rate_pct == 4.0
    assert result.primary_recommended_scheme.loan_amount == 90000.0
    assert result.sri_score >= 100

def test_moratorium_emi_calculation():
    req = EMICalculationRequest(
        loan_amount=100000.0,
        annual_interest_rate_pct=4.0,
        tenure_months=36,
        moratorium_months=6,
        capitalization_mode="capitalized"
    )
    res = calculate_moratorium_emi(req)
    assert res.original_principal == 100000.0
    assert res.capitalized_principal > 100000.0
    assert res.monthly_emi_post_moratorium > 0
    assert len(res.amortization_schedule) == 36
