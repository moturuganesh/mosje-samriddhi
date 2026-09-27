import json
import math
import os
from typing import List, Tuple, Optional
from app.models.schemas import Branch, BypassedBranch, RouteRequest, RouteResponse, AdminBranchesResponse

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'branches.json')

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)

def load_branches() -> List[dict]:
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def route_applicant_to_branch(req: RouteRequest) -> RouteResponse:
    raw_branches = load_branches()
    
    eligible_branches: List[Branch] = []
    bypassed_branches: List[BypassedBranch] = []
    
        
    # SIH Real-World Constraint: SCAs and RRBs are strictly state-bound. 
    # We must restrict routing to the applicant's state if we have branches there.
    target_branches = [b for b in raw_branches if b.get('state', '').lower() == (req.state or '').lower()]
    if not target_branches:
        target_branches = raw_branches # Fallback if state has no seeded data
        
    for b in target_branches:
        # Schema uses user_lng now in RouteRequest
        dist = haversine_distance_km(req.user_lat, req.user_lng, b['latitude'], b['longitude'])
        
        npa_rate = float(b['npa_rate'])
        funds_available_lakhs = float(b['funds_available_lakhs'])
        
        status = 'ELIGIBLE_ACTIVE'
        reasons = []
        if npa_rate >= 10.0:
            status = 'INELIGIBLE_HIGH_NPA'
            reasons.append("Bypassed: " + str(npa_rate) + "% NPA exceeds MoSJE 10% threshold")
        if funds_available_lakhs <= 50.0:
            status = 'INELIGIBLE_EXHAUSTED_FUNDS'
            reasons.append(f"Bypassed: {funds_available_lakhs}L available falls below 50L safety reserve limit")
            
        if status != 'ELIGIBLE_ACTIVE':
            bypassed_branches.append(
                BypassedBranch(
                    id=b['id'],
                    name=b['name'],
                    latitude=b['latitude'],
                    longitude=b['longitude'],
                    distance_km=dist,
                    npa_rate=npa_rate,
                    funds_available_lakhs=funds_available_lakhs,
                    bypass_reason='; '.join(reasons)
                )
            )
            continue
            
        # Normalize funds available (assuming 1000L is roughly the max) for scoring
        s_funds = min(1.0, funds_available_lakhs / 1000.0)
        s_dist = max(0.0, 1.0 - (dist / 500.0))
        health_score = (0.5 * s_dist) + (0.3 * s_funds) + (0.2 * ((10 - npa_rate) / 10))
        
        # Scheme-to-Partner Type Matching Matrix (SIH Innovation)
        scheme_boost = 0.0
        match_reason = ""
        if req.loan_amount is not None:
            if req.loan_amount <= 150000 and b['type'] in ['NBFC-MFI', 'RRB']:
                scheme_boost = 0.25
                match_reason = " [Boost: Micro-Finance Matrix Match]"
            elif req.loan_amount >= 1000000 and b['type'] in ['SCA', 'PSB']:
                scheme_boost = 0.25
                match_reason = " [Boost: Heavy Term Loan Matrix Match]"
        
        if req.scheme_name and ('Mahila' in req.scheme_name or 'Samriddhi' in req.scheme_name) and b['type'] == 'NBFC-MFI':
            scheme_boost += 0.15
            match_reason += " [Boost: Women Empowerment Scheme Match]"
            
        health_score += scheme_boost
        
        rationale = f"Distance: {round(dist, 1)} km | NPA: {npa_rate}% | Available Funds: {funds_available_lakhs}L{match_reason} | Score: {round(health_score, 4)}" 
        
        branch_obj = Branch(
            id=b['id'],
            name=b['name'],
            type=b['type'],
            state=b['state'],
            district=b['district'],
            latitude=b['latitude'],
            longitude=b['longitude'],
            npa_rate=npa_rate,
            funds_available_lakhs=funds_available_lakhs,
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

def get_admin_branches_overview() -> AdminBranchesResponse:
    raw = load_branches()
    branches = []
    
    active_cnt = 0
    monitored_cnt = 0
    blocked_cnt = 0
    total_util = 0.0
    total_npa = 0.0
    
    for b in raw:
        npa = float(b['npa_rate'])
        util = float(b['funds_available_lakhs'])
        
        status = 'ACTIVE'
        if npa >= 10.0 or util <= 50.0:
            status = 'BLOCKED'
            blocked_cnt += 1
        elif npa >= 6.0 or util <= 200.0:
            status = 'MONITORED'
            monitored_cnt += 1
        else:
            active_cnt += 1
            
        total_util += util
        total_npa += npa
        
        npa_cat = 'LOW_NPA_GREEN'
        if npa >= 8.0:
            npa_cat = 'HIGH_NPA_RED'
        elif npa >= 4.0:
            npa_cat = 'MODERATE_NPA_YELLOW'
            
        branches.append(
            Branch(
                id=b['id'],
                name=b['name'],
                type=b['type'],
                latitude=b['latitude'],
                longitude=b['longitude'],
                district=b['district'],
                state=b['state'],
                npa_rate=npa,
                funds_available_lakhs=util,
                contact_officer=b['contact_officer'],
                status=status,
                distance_km=0.0,
                health_score=0.0,
                routing_rationale="",
                npa_category=npa_cat
            )
        )
        
    avg_npa = round(total_npa / len(raw), 2) if raw else 0.0
    
    return AdminBranchesResponse(
        total_branches=len(raw),
        active_branches=active_cnt,
        monitored_branches=monitored_cnt,
        blocked_branches=blocked_cnt,
        total_funds_available_lakhs=round(total_util, 2),
        average_npa_percentage=avg_npa,
        branches=branches
    )
