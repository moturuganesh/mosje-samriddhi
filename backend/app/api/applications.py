import uuid
import random
import string
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.core.pdf_generator import generate_sanction_docket_pdf
from app.db import User
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, List

from app.db import get_db, Application
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/applications", tags=["Applications"])

class SubmitApplicationReq(BaseModel):
    scheme_data: Dict[str, Any]
    branch_data: Dict[str, Any]
    sri_score: float

@router.post("/submit")
def submit_application(req: SubmitApplicationReq, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Generate ARN: MOSJE-TN-2026-XXXXXX
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    arn = f"MOSJE-TN-2026-{random_suffix}"
    
    app = Application(
        user_id=current_user.id,
        arn=arn,
        scheme_data=req.scheme_data,
        branch_data=req.branch_data,
        sri_score=req.sri_score,
        status="Routed to Branch"
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return {"message": "Application submitted successfully", "arn": arn}

@router.get("/me")
def get_my_applications(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    apps = db.query(Application).filter(Application.user_id == current_user.id).order_by(Application.id.desc()).all()
    result = []
    for a in apps:
        result.append({
            "id": a.id,
            "arn": a.arn,
            "scheme_data": a.scheme_data,
            "branch_data": a.branch_data,
            "sri_score": a.sri_score,
            "status": a.status
        })
    return result

@router.get("/{arn}/pdf")
def download_application_pdf(arn: str, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.arn == arn).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    user = db.query(User).filter(User.id == app.user_id).first()
    user_data = {"name": user.name, "phone_number": user.phone_number} if user else {}
    
    app_data = {
        "arn": app.arn,
        "scheme_data": app.scheme_data,
        "branch_data": app.branch_data,
        "status": app.status
    }
    
    pdf_buffer = generate_sanction_docket_pdf(app_data, user_data)
    
    headers = {
        'Content-Disposition': f'attachment; filename="MoSJE_Sanction_{arn}.pdf"'
    }
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)


class UpdateStatusReq(BaseModel):
    status: str

@router.patch("/{arn}/status")
def update_application_status(arn: str, req: UpdateStatusReq, db: Session = Depends(get_db)):
    import json
    import os
    
    app = db.query(Application).filter(Application.arn == arn).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # If transitioning to Disbursed, deduct the funds from the branch's corpus
    if "Disbursed" in req.status and "Disbursed" not in app.status:
        try:
            branch_id = app.branch_data.get("id")
            loan_amount_lakhs = float(app.scheme_data.get("loan_amount", 0)) / 100000.0
            
            data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'branches.json')
            with open(data_path, 'r', encoding='utf-8') as f:
                branches = json.load(f)
                
            for b in branches:
                if b.get("id") == branch_id:
                    # Deduct the loan amount from the branch's available funds
                    current_funds = float(b.get("funds_available_lakhs", 0))
                    b["funds_available_lakhs"] = round(max(0.0, current_funds - loan_amount_lakhs), 2)
                    break
                    
            with open(data_path, 'w', encoding='utf-8') as f:
                json.dump(branches, f, indent=4)
        except Exception as e:
            print(f"Failed to deduct funds: {e}")
    
    app.status = req.status
    db.commit()
    return {"message": "Status updated successfully", "status": req.status}

@router.get("/all")
def get_all_applications(db: Session = Depends(get_db)):
    # In a real app this would be protected by an Admin guard
    apps = db.query(Application).order_by(Application.id.desc()).all()
    result = []
    for a in apps:
        # Fetch user details as well
        user = db.query(User).filter(User.id == a.user_id).first()
        user_data = {"name": user.name, "phone_number": user.phone_number} if user else {}
        result.append({
            "id": a.id,
            "arn": a.arn,
            "user": user_data,
            "scheme_data": a.scheme_data,
            "branch_data": a.branch_data,
            "sri_score": a.sri_score,
            "status": a.status
        })
    return result
