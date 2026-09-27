import os
import hashlib
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
import jwt

from app.db import get_db, User

SECRET_KEY = os.getenv("JWT_SECRET", "mosje-super-secret-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

router = APIRouter(prefix="/api/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def hash_pin(pin: str) -> str:
    return hashlib.sha256((pin + "MOSJE_SALT_2026").encode()).hexdigest()

def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    return hash_pin(plain_pin) == hashed_pin

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone = payload.get("sub")
        if phone is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.phone_number == phone).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

class RegisterReq(BaseModel):
    phone_number: str
    pin: str
    name: str

class LoginReq(BaseModel):
    phone_number: str
    pin: str

@router.post("/register")
def register(req: RegisterReq, db: Session = Depends(get_db)):
    if len(req.pin) != 4 or not req.pin.isdigit():
        raise HTTPException(status_code=400, detail="Security PIN must be exactly 4 digits.")
    
    existing = db.query(User).filter(User.phone_number == req.phone_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered.")
        
    new_user = User(
        phone_number=req.phone_number,
        security_pin=hash_pin(req.pin),
        name=req.name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"sub": new_user.phone_number})
    return {"access_token": token, "token_type": "bearer", "user": {"name": new_user.name, "phone": new_user.phone_number}}

@router.post("/login")
def login(req: LoginReq, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == req.phone_number).first()
    if not user or not verify_pin(req.pin, user.security_pin):
        raise HTTPException(status_code=401, detail="Invalid phone number or PIN.")
        
    token = create_access_token({"sub": user.phone_number})
    return {"access_token": token, "token_type": "bearer", "user": {"name": user.name, "phone": user.phone_number}}
