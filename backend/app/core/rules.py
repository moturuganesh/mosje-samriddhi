from datetime import datetime, timezone
from app.models.schemas import ApplicantProfile, SchemeEvaluationResult, SchemeDetail
from app.core.schemes_db import SCHEMES_DB

def is_strictly_eligible(s, profile, cost, is_female):
    reasons = []

    # 1. State Verification
    p_state = (getattr(profile, 'state', '') or '').lower()
    s_state = s['state_applicability'].lower()
    
    if s_state != "pan-india":
        if p_state not in s_state and s_state not in p_state:
            return False, "Scheme is geographically restricted.", 0
        else:
            reasons.append(f"✓ Meets {s['state_applicability']} domicile requirement.")
    else:
        reasons.append("✓ Available Pan-India.")

    # 2. Gender Verification
    aud = s['audience']
    if 'Women' in aud and not is_female and 'All' not in aud and 'Male' not in aud:
        return False, "Scheme is restricted to female applicants.", 0
    elif 'Male' in aud and is_female and 'All' not in aud and 'Women' not in aud:
        return False, "Scheme is restricted to male applicants.", 0
    
    if is_female and 'Women' in aud:
        reasons.append("✓ Matches Female Entrepreneur Demographics.")

    # 3. Purpose / Sector Verification (Strict Rules)
    p_purpose = (getattr(profile, 'purpose', '') or '').lower()
    p_sector = (getattr(profile, 'sector', '') or 'All').lower()
    p_stage = (getattr(profile, 'business_stage', '') or '').lower()
    p_education = (getattr(profile, 'education_status', '') or '').lower()
    s_sectors = [x.lower() for x in s['sector']]
    
    if 'sanitation' in s_sectors and not ('sanitation' in p_purpose or 'waste' in p_purpose):
        return False, "Requires Sanitation/Waste Management project.", 0
    if 'healthcare' in s_sectors and 'clinic' in s['scheme_id'].lower() and not ('clinic' in p_purpose or 'pharmacy' in p_purpose or 'healthcare' in p_sector):
        return False, "Requires Clinic/Pharmacy project.", 0
    if 'transport' in s_sectors and 'taxi' in s['scheme_id'].lower() and not ('taxi' in p_purpose or 'auto' in p_purpose or 'transport' in p_sector):
        return False, "Requires Taxi/Auto Transport project.", 0
    if 'education' in s_sectors and not ('education' in p_purpose or 'b.tech' in p_education or 'medical' in p_education or 'els' in p_purpose):
        return False, "Requires Higher Education project.", 0

    reasons.append(f"✓ Sector aligned.")

    # 4. Loan Limit Check
    if cost > s['max_loan_limit']:
        return False, f"Project cost exceeds scheme maximum (₹{s['max_loan_limit']/100000}L)", 0
    else:
        reasons.append(f"✓ Project Cost within limit.")

    # SCORING ALGORITHM (SRI Score)
    score = 100  # Base score for passing strict eligibility
    
    s_target_purposes = [x.lower() for x in s.get('target_purposes', [])]
    s_target_stages = [x.lower() for x in s.get('target_stages', [])]
    s_target_education = [x.lower() for x in s.get('target_education', [])]

    # Purpose Match (+30)
    if any(tp in p_purpose or p_purpose in tp for tp in s_target_purposes if p_purpose and tp):
        score += 30
        reasons.append("⭐ High Match: Purpose aligns perfectly.")
    
    # Sector Match (+20)
    if any(ts in p_sector or p_sector in ts for ts in s_sectors if p_sector and ts and ts != 'all'):
        score += 20
        reasons.append("⭐ High Match: Sector aligns perfectly.")
        
    # Education Match (+25)
    if any(te in p_education or p_education in te for te in s_target_education if p_education and te and te != 'not applicable'):
        score += 25
        reasons.append("⭐ High Match: Education status aligns perfectly.")
        
    # Business Stage Match (+15)
    if any(ts in p_stage or p_stage in ts for ts in s_target_stages if p_stage and ts and ts != 'not applicable'):
        score += 15
        reasons.append("⭐ High Match: Business Stage aligns.")

    # State Bonus (+10 for state-specific schemes over pan-india ones if they pass)
    if s_state != "pan-india":
        score += 10
        reasons.append("⭐ Priority: State-Specific Scheme.")

    return True, reasons, score


def evaluate_mosje_scheme(profile: ApplicantProfile) -> SchemeEvaluationResult:
    rejection_reasons = []
    rules_applied = []
    
    cost = float(profile.project_cost) if profile.project_cost else 100000.0
    is_female = True if profile.gender and profile.gender.upper() in ['F', 'FEMALE'] else False
    
    rules_applied.append(f'Extracted Project Cost: ₹{cost}')
    rules_applied.append(f"Profile: Sector={profile.sector}, Purpose={profile.purpose}, Stage={profile.business_stage}, Edu={profile.education_status}")

    category_upper = str(profile.category).upper() if profile.category else ""
    is_target_category = 'SC' in category_upper or 'SAFAI' in category_upper or 'DNT' in category_upper or 'SCHEDULED CASTE' in category_upper
    
    if not is_target_category and any(x in category_upper for x in ['OBC', 'GENERAL', 'EWS', 'MBC', 'ST', 'SCHEDULED TRIBE']):
        # Note: TAHDCO allows ST, NSFDC strictly SC. But we handle basic filtering here. Let's not strict reject ST, as TAHDCO allows it.
        pass # Let individual rules handle it if necessary

    income = float(profile.annual_family_income) if profile.annual_family_income else 0.0
    if income > 500000.0:
        rejection_reasons.append(f'Annual family income (₹{income}) exceeds statutory ceiling.')
        
    if rejection_reasons:
        return SchemeEvaluationResult(
            is_eligible=False,
            applicant_name=profile.applicant_name,
            income_status='INELIGIBLE_ABOVE_CEILING',
            rejection_reasons=rejection_reasons,
            sri_score=0,
            schemes=[],
            primary_recommended_scheme=None,
            all_eligible_schemes=[],
            rules_applied=rules_applied,
            evaluated_at=datetime.now(timezone.utc).isoformat()
        )

    final_schemes = []
    
    for s in SCHEMES_DB:
        is_eligible, details_or_fail_reason, sri_score = is_strictly_eligible(s, profile, cost, is_female)
        
        if not is_eligible:
            continue
            
        loan_share = min(cost * 0.90, s['max_loan_limit'])
        promoter_amt = cost - loan_share
        
        sd = SchemeDetail(
            scheme_id=s['scheme_id'],
            scheme_name=s['scheme_name'],
            ministry=s['ministry'],
            corporation=s['corporation'],
            interest_rate_pct=s['interest_rate_pct'],
            max_loan_pct=90.0,
            max_loan_limit=s['max_loan_limit'],
            loan_amount=round(loan_share, 2),
            promoter_contribution_pct=round((promoter_amt / cost) * 100, 2) if cost > 0 else 10.0,
            promoter_contribution=10.0,
            promoter_contribution_amount=round(promoter_amt, 2),
            subsidy_amount=0.0,
            subsidy_pct=0.0,
            standard_moratorium_months=12 if 'ELS' in s['scheme_id'] or 'MKY' in s['scheme_id'] else 6,
            recommended_tenure_months=60,
            target_beneficiary=', '.join(s['audience']),
            description=s['description'],
            key_benefits=details_or_fail_reason, 
            eligibility_criteria=s.get('eligibility_criteria', []),
            financial_assistance=s.get('financial_assistance', ''),
            documents_required=s.get('documents_required', []),
            state_applicability=s.get('state_applicability', 'Pan-India'),
            match_tier=f"Score: {sri_score}" # We will use this in the UI
        )
        
        # We attach the raw score temporarily to the object to sort it
        sd._raw_score = sri_score
        final_schemes.append(sd)
        
    # Sort mathematically descending by the SRI score!
    final_schemes.sort(key=lambda x: getattr(x, '_raw_score', 0), reverse=True)
    
    # Extract highest score before cleanup
    highest_score = final_schemes[0]._raw_score if final_schemes and hasattr(final_schemes[0], '_raw_score') else 100

    # Clean up the raw score before returning
    for scheme in final_schemes:
        if hasattr(scheme, '_raw_score'):
            delattr(scheme, '_raw_score')

    return SchemeEvaluationResult(
        is_eligible=True,
        applicant_name=profile.applicant_name,
        income_status='ELIGIBLE_BELOW_CEILING',
        rejection_reasons=[],
        sri_score=highest_score if final_schemes else 0,
        schemes=final_schemes, 
        primary_recommended_scheme=final_schemes[0] if final_schemes else None,
        all_eligible_schemes=final_schemes,
        rules_applied=rules_applied,
        evaluated_at=datetime.now(timezone.utc).isoformat()
    )
