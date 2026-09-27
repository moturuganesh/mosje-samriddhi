from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class ApplicantProfile(BaseModel):
    applicant_name: Optional[str] = Field(None, description='Full legal name of the applicant')
    annual_family_income: Optional[int] = Field(None, alias="annual_income", description='Annual family income in INR as integer')
    gender: Optional[str] = Field(None, description='Gender of applicant: M, F, or Other')
    category: Optional[str] = Field(None, description='Social category: SC, ST, OBC, General, Safai Karamchari, etc.')
    certificate_number: Optional[str] = Field(None, alias="certificate_id", description='Government Certificate / Issuance Number')
    state: Optional[str] = Field(None, description='State of issuance / residence')
    district: Optional[str] = Field(None, description='District of issuance / residence')
    project_cost: Optional[float] = Field(100000.0, description='Total project or unit cost in INR')
    latitude: Optional[float] = Field(None, description='Applicant latitude')
    longitude: Optional[float] = Field(None, description='Applicant longitude')
    age: Optional[int] = Field(30, ge=18, le=65, description='Age of applicant')
    purpose: Optional[str] = Field(None, description='Proposed enterprise activity')
    education_status: Optional[str] = Field(None, description='Education Status or Course Name (e.g. B.Tech)')
    sector: Optional[str] = Field(None, description='Business Sector (e.g. Agriculture, Manufacturing, Services, Tech, Healthcare)')
    business_stage: Optional[str] = Field('Seed / Early-Stage', description='Ideation, Seed / Early-Stage, or Growth / Scaling')

    class Config:
        populate_by_name = True

class SchemeDetail(BaseModel):
    scheme_id: str
    scheme_name: str
    ministry: str = 'Ministry of Social Justice & Empowerment (MoSJE)'
    corporation: str = 'National Scheduled Castes Finance and Development Corporation (NSFDC)'
    interest_rate_pct: float
    max_loan_pct: float = 90.0
    max_loan_limit: float = 90.0
    loan_amount: float
    promoter_contribution_pct: float = 10.0
    promoter_contribution: float = 10.0
    promoter_contribution_amount: float
    subsidy_amount: float = 0.0
    subsidy_pct: float = 0.0
    standard_moratorium_months: int
    recommended_tenure_months: int
    target_beneficiary: str
    description: str
    key_benefits: List[str]
    match_tier: str = 'Primary Recommendation'
    target_sectors: List[str] = ['All']
    target_stages: List[str] = ['Ideation', 'Seed / Early-Stage', 'Growth / Scaling']
    financial_assistance: str = ""
    documents_required: List[str] = []

class SchemeEvaluationResult(BaseModel):
    is_eligible: bool
    applicant_name: Optional[str] = None
    income_status: str
    rejection_reasons: List[str] = []
    sri_score: int = 0
    schemes: List[SchemeDetail] = []
    primary_recommended_scheme: Optional[SchemeDetail] = None
    all_eligible_schemes: List[SchemeDetail] = []
    rules_applied: List[str] = []
    evaluated_at: str

class EMICalculationRequest(BaseModel):
    loan_amount: float = Field(..., gt=0, description='Principal loan amount in INR')
    annual_interest_rate_pct: float = Field(..., gt=0, le=36, description='Annual interest rate in percentage')
    tenure_months: int = Field(..., ge=6, le=120, description='Total loan tenure in months')
    moratorium_months: int = Field(..., ge=0, le=12, description='Moratorium period in months')
    compounding_frequency: Literal['monthly', 'simple'] = 'monthly'

class AmortizationMonth(BaseModel):
    month: int
    is_moratorium: bool
    opening_balance: float
    interest_accrued: float
    interest_paid: float
    principal_paid: float
    total_installment: float
    closing_balance: float

class EMICalculationResult(BaseModel):
    original_principal: float
    annual_interest_rate_pct: float
    total_tenure_months: int
    moratorium_months: int
    repayment_months: int
    interest_accrued_during_moratorium: float
    capitalized_principal: float
    monthly_emi_post_moratorium: float
    total_interest_paid: float
    total_amount_paid: float
    amortization_schedule: List[AmortizationMonth]

class Branch(BaseModel):
    id: str
    name: str
    type: str
    state: str
    district: str
    latitude: float
    longitude: float
    npa_rate: float
    funds_available_lakhs: float
    contact_officer: str
    status: Optional[str] = None
    distance_km: Optional[float] = None
    health_score: Optional[float] = None
    routing_rationale: Optional[str] = None

class BypassedBranch(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    distance_km: float
    npa_rate: float
    funds_available_lakhs: float
    bypass_reason: str

class RouteRequest(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    user_lat: float
    user_lng: float
    loan_amount: Optional[float] = None
    scheme_name: Optional[str] = None
    applicant_state: Optional[str] = None
    scheme_name: Optional[str] = None
    loan_amount: Optional[float] = None


class RouteResponse(BaseModel):
    recommended_branch: Optional[Branch]
    alternative_branches: List[Branch] = []
    bypassed_branches: List[BypassedBranch] = []
    all_nearby_branches: List[Branch] = []
    user_location: dict
    total_branches_evaluated: int
    routing_weights: dict = {'proximity_weight': 0.40, 'financial_health_weight': 0.60}

class AdminBranchesResponse(BaseModel):
    total_branches: int
    active_branches: int
    monitored_branches: int
    blocked_branches: int
    total_funds_available_lakhs: float
    average_npa_percentage: float
    branches: List[Branch]
