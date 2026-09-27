from app.models.schemas import ApplicantProfile, EMICalculationRequest
from app.core.rules import evaluate_mosje_scheme, parse_is_female, calculate_sri_score
from app.core.calculator import calculate_moratorium_emi

def test_female_micro_credit_msy():
    profile = ApplicantProfile(
        applicant_name='Sunita Devi',
        annual_family_income=180000.0,
        gender='Female (Eligible for MSY 4% Rate)',
        category='SC',
        project_cost=100000.0,
        age=32
    )
    result = evaluate_mosje_scheme(profile)
    assert result.is_eligible is True, 'Expected eligible'
    assert len(result.schemes) == 1
    assert result.schemes[0].scheme_id == 'NSFDC-MSY-2026'
    assert result.schemes[0].interest_rate_pct == 4.0
    assert result.schemes[0].loan_amount == 90000.0
    assert result.schemes[0].promoter_contribution_amount == 10000.0
    assert result.schemes[0].match_tier == 'Primary Recommendation'
    assert result.schemes[0].max_loan_limit == 90.0
    assert result.schemes[0].promoter_contribution == 10.0
    # SRI calculation: Base 65 + Female 10 = 75
    assert result.sri_score == 75
    print('PASS: test_female_micro_credit_msy')

def test_male_micro_credit_mcf():
    profile = ApplicantProfile(
        applicant_name='Ramesh Kumar',
        annual_family_income=210000.0,
        gender='Male (MCF 6.5% Rate)',
        category='SC',
        project_cost=120000.0,
        age=28
    )
    result = evaluate_mosje_scheme(profile)
    assert result.is_eligible is True
    assert len(result.schemes) == 1
    assert result.schemes[0].scheme_id == 'NSFDC-MCF-2026'
    assert result.schemes[0].interest_rate_pct == 6.5
    assert result.schemes[0].loan_amount == 108000.0
    assert result.schemes[0].match_tier == 'Primary Recommendation'
    # SRI calculation: Base 65
    assert result.sri_score == 65
    print('PASS: test_male_micro_credit_mcf')

def test_tier2_female_waterfall_and_alternative():
    # Female with project cost 3 Lakhs (1.4L < cost <= 5L)
    profile = ApplicantProfile(
        applicant_name='Meena Kumari',
        annual_family_income=140000.0,
        gender='F',
        category='SC',
        project_cost=300000.0,
        age=35
    )
    result = evaluate_mosje_scheme(profile)
    assert result.is_eligible is True
    assert len(result.schemes) == 2, f'Expected 2 schemes (Primary LUY + Alternative MSY), got {len(result.schemes)}'
    
    # Primary scheme: LUY @ 6.0%
    primary = result.schemes[0]
    assert primary.scheme_id == 'NSFDC-LUY-2026'
    assert primary.interest_rate_pct == 6.0
    assert primary.loan_amount == 270000.0
    assert primary.match_tier == 'Primary Recommendation'
    
    # Alternative scheme: MSY @ 4.0% suggesting ₹1.4L cap
    alt = result.schemes[1]
    assert alt.scheme_id == 'NSFDC-MSY-ALT-2026'
    assert alt.interest_rate_pct == 4.0
    assert alt.loan_amount == 126000.0
    assert alt.match_tier == 'Alternative'
    assert alt.max_loan_limit == 90.0
    assert alt.promoter_contribution == 10.0
    
    # SRI score: Base 65 + Female 10 + Income<=1.5L 15 = 90
    assert result.sri_score == 90
    print('PASS: test_tier2_female_waterfall_and_alternative')

def test_tier3_term_loan():
    profile = ApplicantProfile(
        applicant_name='Anil Kumar',
        annual_family_income=250000.0,
        gender='M',
        category='SC',
        project_cost=800000.0, # 5L < cost <= 15L
        age=40
    )
    result = evaluate_mosje_scheme(profile)
    assert result.is_eligible is True
    assert len(result.schemes) == 1
    assert result.schemes[0].scheme_id == 'NSFDC-TLS-2026'
    assert result.schemes[0].interest_rate_pct == 8.0
    assert result.schemes[0].loan_amount == 720000.0
    assert result.schemes[0].match_tier == 'Primary Recommendation'
    assert result.sri_score == 65
    print('PASS: test_tier3_term_loan')

def test_sri_score_capping_and_safai_karamchari():
    # Female (10) + Income <= 1.5L (15) + Safai Karamchari (10) + Base (65) = 100 -> Capped at 98
    profile = ApplicantProfile(
        applicant_name='Radha Rani',
        annual_family_income=120000.0,
        gender='female',
        category='Safai Karamchari',
        project_cost=100000.0,
        age=29
    )
    result = evaluate_mosje_scheme(profile)
    assert result.is_eligible is True
    assert result.sri_score == 98, f'Expected 98 (capped), got {result.sri_score}'
    print('PASS: test_sri_score_capping_and_safai_karamchari')

def test_income_exceeds_ceiling():
    profile = ApplicantProfile(
        applicant_name='Vijay Sharma',
        annual_family_income=350000.0, # Exceeds 3 Lakh limit
        gender='male',
        category='SC',
        project_cost=100000.0,
        age=30
    )
    result = evaluate_mosje_scheme(profile)
    assert result.is_eligible is False
    assert any('exceeds the statutory MoSJE/NSFDC ceiling' in r for r in result.rejection_reasons)
    print('PASS: test_income_exceeds_ceiling')

def test_moratorium_capitalized_interest():
    # Rs 1,00,000 at 4.0% p.a. for 36 months with 6 months moratorium
    req = EMICalculationRequest(
        loan_amount=100000.0,
        annual_interest_rate_pct=4.0,
        tenure_months=36,
        moratorium_months=6,
        compounding_frequency='monthly'
    )
    res = calculate_moratorium_emi(req)
    assert res.moratorium_months == 6
    assert res.repayment_months == 30
    assert res.capitalized_principal > 100000.0
    assert 2000.0 < res.interest_accrued_during_moratorium < 2050.0
    assert len(res.amortization_schedule) == 36
    # Moratorium months must have 0 installment
    for m in res.amortization_schedule[:6]:
        assert m.is_moratorium is True
        assert m.total_installment == 0.0
    # Final month closing balance must be 0
    assert res.amortization_schedule[-1].closing_balance == 0.0
    assert res.amortization_schedule[-1].is_moratorium is False
    print('PASS: test_moratorium_capitalized_interest')

def test_evaluate_scheme_api_endpoint():
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    
    # Test Tier 2 Female API call
    payload = {
        'applicant_name': 'Sunita Devi',
        'annual_family_income': 140000,
        'gender': 'Female (Eligible for MSY 4% Rate)',
        'category': 'SC',
        'project_cost': 250000,
        'age': 30
    }
    response = client.post('/api/evaluate-scheme', json=payload)
    assert response.status_code == 200, f'Expected 200, got {response.status_code}'
    data = response.json()
    assert data['is_eligible'] is True
    assert data['sri_score'] == 90 # 65 + 10 + 15
    assert 'schemes' in data
    assert len(data['schemes']) == 2
    assert data['schemes'][0]['scheme_name'] == 'Laghu Udyami Yojana (LUY)'
    assert data['schemes'][0]['match_tier'] == 'Primary Recommendation'
    assert data['schemes'][0]['interest_rate_pct'] == 6.0
    assert data['schemes'][1]['scheme_name'] == 'Mahila Samriddhi Yojana (MSY) - Concessional Alternative'
    assert data['schemes'][1]['match_tier'] == 'Alternative'
    assert data['schemes'][1]['interest_rate_pct'] == 4.0
    print('PASS: test_evaluate_scheme_api_endpoint')

if __name__ == '__main__':
    test_female_micro_credit_msy()
    test_male_micro_credit_mcf()
    test_tier2_female_waterfall_and_alternative()
    test_tier3_term_loan()
    test_sri_score_capping_and_safai_karamchari()
    test_income_exceeds_ceiling()
    test_moratorium_capitalized_interest()
    test_evaluate_scheme_api_endpoint()
    print('ALL PHASE 1 UPGRADED TESTS PASSED!')
