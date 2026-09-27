import os
import re

schema_path = 'backend/app/models/schemas.py'
with open(schema_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Branch model
old_branch = re.search(r'class Branch\(BaseModel\):.*?npa_category: Optional.*?None', content, flags=re.DOTALL).group(0)
new_branch = """class Branch(BaseModel):
    id: str
    name: str
    type: str
    state: str
    district: str
    latitude: float
    longitude: float
    npa_rate: float
    fund_utilization_pct: float
    contact_officer: str
    status: Optional[str] = None
    distance_km: Optional[float] = None
    health_score: Optional[float] = None
    routing_rationale: Optional[str] = None"""
content = content.replace(old_branch, new_branch)

# Replace BypassedBranch model
old_bypassed = re.search(r'class BypassedBranch\(BaseModel\):.*?bypass_reason: str', content, flags=re.DOTALL).group(0)
new_bypassed = """class BypassedBranch(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    distance_km: float
    npa_rate: float
    fund_utilization_pct: float
    bypass_reason: str"""
content = content.replace(old_bypassed, new_bypassed)

# Replace RouteRequest
old_req = re.search(r'class RouteRequest\(BaseModel\):.*?district: Optional\[str\].*?None\)', content, flags=re.DOTALL).group(0)
new_req = """class RouteRequest(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    user_lat: float
    user_lng: float"""
content = content.replace(old_req, new_req)

with open(schema_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update router.py
router_path = 'backend/app/core/router.py'
with open(router_path, 'r', encoding='utf-8') as f:
    rcontent = f.read()

rcontent = re.sub(r'def route_applicant_to_branch\(req: RouteRequest\) -> RouteResponse:.*', 
"""def route_applicant_to_branch(req: RouteRequest) -> RouteResponse:
    raw_branches = load_branches()
    
    eligible_branches: List[Branch] = []
    bypassed_branches: List[BypassedBranch] = []
    
    for b in raw_branches:
        dist = haversine_distance_km(req.user_lat, req.user_lng, b['latitude'], b['longitude'])
        
        npa_rate = float(b['npa_rate'])
        fund_utilization_pct = float(b['fund_utilization_pct'])
        
        status = 'ELIGIBLE_ACTIVE'
        reasons = []
        if npa_rate >= 10.0:
            status = 'INELIGIBLE_HIGH_NPA'
            reasons.append(f"Bypassed: {npa_rate}% NPA exceeds MoSJE 10% threshold")
        if fund_utilization_pct >= 95.0:
            status = 'INELIGIBLE_EXHAUSTED_FUNDS'
            reasons.append(f"Bypassed: {fund_utilization_pct}% fund utilization exceeds MoSJE 95% threshold")
            
        if status != 'ELIGIBLE_ACTIVE':
            bypassed_branches.append(
                BypassedBranch(
                    id=b['id'],
                    name=b['name'],
                    latitude=b['latitude'],
                    longitude=b['longitude'],
                    distance_km=dist,
                    npa_rate=npa_rate,
                    fund_utilization_pct=fund_utilization_pct,
                    bypass_reason='; '.join(reasons)
                )
            )
            continue
            
        # Score = (0.5 * (1 / (1 + distance_km))) + (0.3 * ((100 - fund_utilization_pct) / 100)) + (0.2 * ((10 - npa_rate) / 10))
        health_score = (0.5 * (1 / (1 + dist))) + (0.3 * ((100 - fund_utilization_pct) / 100)) + (0.2 * ((10 - npa_rate) / 10))
        
        rationale = f"Distance: {round(dist, 1)} km | NPA: {npa_rate}% | Fund Util: {fund_utilization_pct}% | SIH Score: {round(health_score, 4)}"
        
        branch_obj = Branch(
            id=b['id'],
            name=b['name'],
            type=b['type'],
            state=b['state'],
            district=b['district'],
            latitude=b['latitude'],
            longitude=b['longitude'],
            npa_rate=npa_rate,
            fund_utilization_pct=fund_utilization_pct,
            contact_officer=b['contact_officer'],
            status=status,
            distance_km=dist,
            health_score=round(health_score, 4),
            routing_rationale=rationale
        )
        eligible_branches.append(branch_obj)

    eligible_branches.sort(key=lambda x: x.health_score or 0.0, reverse=True)
    bypassed_branches.sort(key=lambda x: x.distance_km)
    
    if eligible_branches:
        eligible_branches[0].status = 'PRIMARY_ROUTED_PARTNER'

    # Map visualization sorting: all active nearby
    recommended = eligible_branches[0] if eligible_branches else None
    alternatives = eligible_branches[1:10] if len(eligible_branches) > 1 else []
    bypassed_final = bypassed_branches[:10]

    return RouteResponse(
        recommended_branch=recommended,
        alternative_branches=alternatives,
        bypassed_branches=bypassed_final,
        all_nearby_branches=eligible_branches,
        user_location={'lat': req.user_lat, 'lng': req.user_lng},
        total_branches_evaluated=len(raw_branches),
        routing_weights={'proximity_weight': 0.50, 'financial_health_weight': 0.50}
    )
""", rcontent, flags=re.DOTALL)

with open(router_path, 'w', encoding='utf-8') as f:
    f.write(rcontent)
print("Updated schemas and router.")
