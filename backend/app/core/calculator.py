import math
from typing import List
from app.models.schemas import EMICalculationRequest, EMICalculationResult, AmortizationMonth

def calculate_moratorium_emi(req: EMICalculationRequest) -> EMICalculationResult:
    principal = float(req.loan_amount)
    annual_rate = float(req.annual_interest_rate_pct)
    r = (annual_rate / 100.0) / 12.0 # Monthly interest rate
    total_tenure = req.tenure_months
    moratorium = req.moratorium_months
    
    # Ensure repayment months are positive
    if total_tenure <= moratorium:
        repayment_months = 12
        total_tenure = moratorium + repayment_months
    else:
        repayment_months = total_tenure - moratorium

    schedule: List[AmortizationMonth] = []
    current_balance = principal
    total_moratorium_interest = 0.0
    
    # Phase A: Moratorium Period (Months 1 to m)
    for m in range(1, moratorium + 1):
        opening = current_balance
        if req.compounding_frequency == 'monthly':
            interest_accrued = opening * r
            closing = opening + interest_accrued # Capitalized into principal
        else:
            # Simple interest capitalization
            interest_accrued = principal * r
            closing = opening + interest_accrued
            
        total_moratorium_interest += interest_accrued
        schedule.append(
            AmortizationMonth(
                month=m,
                is_moratorium=True,
                opening_balance=round(opening, 2),
                interest_accrued=round(interest_accrued, 2),
                interest_paid=0.0,
                principal_paid=0.0,
                total_installment=0.0,
                closing_balance=round(closing, 2)
            )
        )
        current_balance = closing

    capitalized_principal = current_balance
    
    # Phase B: Calculate Post-Moratorium Reducing Balance EMI
    if r == 0:
        monthly_emi = capitalized_principal / repayment_months
    else:
        emi_factor = math.pow(1.0 + r, repayment_months)
        monthly_emi = capitalized_principal * (r * emi_factor) / (emi_factor - 1.0)
    
    total_interest_paid = 0.0
    total_amount_paid = 0.0
    
    # Phase C: Repayment Period (Months m+1 to total_tenure)
    for m in range(moratorium + 1, total_tenure + 1):
        opening = current_balance
        interest_month = opening * r
        
        # Last month precision rounding
        if m == total_tenure:
            principal_month = opening
            installment = principal_month + interest_month
            closing = 0.0
        else:
            principal_month = monthly_emi - interest_month
            closing = opening - principal_month
            installment = monthly_emi
            
        total_interest_paid += interest_month
        total_amount_paid += installment
        
        schedule.append(
            AmortizationMonth(
                month=m,
                is_moratorium=False,
                opening_balance=round(opening, 2),
                interest_accrued=round(interest_month, 2),
                interest_paid=round(interest_month, 2),
                principal_paid=round(principal_month, 2),
                total_installment=round(installment, 2),
                closing_balance=round(max(0.0, closing), 2)
            )
        )
        current_balance = closing

    return EMICalculationResult(
        original_principal=round(principal, 2),
        annual_interest_rate_pct=annual_rate,
        total_tenure_months=total_tenure,
        moratorium_months=moratorium,
        repayment_months=repayment_months,
        interest_accrued_during_moratorium=round(total_moratorium_interest, 2),
        capitalized_principal=round(capitalized_principal, 2),
        monthly_emi_post_moratorium=round(monthly_emi, 2),
        total_interest_paid=round(total_interest_paid + total_moratorium_interest, 2),
        total_amount_paid=round(total_amount_paid, 2),
        amortization_schedule=schedule
    )
