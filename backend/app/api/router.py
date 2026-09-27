from fastapi import APIRouter, HTTPException
from app.models.schemas import RouteRequest, RouteResponse, AdminBranchesResponse
from app.core.router import route_applicant_to_branch, get_admin_branches_overview

router = APIRouter(prefix='/api', tags=['Geo-Spatial Router & Health Allocation'])

@router.post('/branches/route', response_model=RouteResponse, summary='40/60 Distance & Health Branch Allocation')
def route_branch_endpoint(request: RouteRequest):
    try:
        return route_applicant_to_branch(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/admin/branches', response_model=AdminBranchesResponse, summary='Ministry Admin Heatmap & Branch Analytics')
def get_admin_branches():
    try:
        return get_admin_branches_overview()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
