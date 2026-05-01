import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db, User
from dotenv import load_dotenv
load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY", "changethis_secret_key_in_production")
ALGORITHM  = "HS256"
EXPIRE_MIN = 60 * 24  # 24 hours

router   = APIRouter(prefix="/auth", tags=["auth"])
pwd_ctx  = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2   = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ── Schemas ──

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    class Config: from_attributes = True
class UpdateProfile(BaseModel):
    name: str

# ── Helpers ──
def hash_pw(pw): return pwd_ctx.hash(pw)
def verify_pw(plain, hashed): return pwd_ctx.verify(plain, hashed)

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None: raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Invalid token")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user: raise HTTPException(401, "User not found")
    return user

# ── Routes ──
@router.post("/register", response_model=TokenSchema)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(name=data.name, email=data.email, hashed_password=hash_pw(data.password))
    db.add(user); db.commit(); db.refresh(user)
    token = create_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=TokenSchema)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_pw(form.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password")
    token = create_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile")
def update_user_name(
    data: UpdateProfile,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    user.name = data.name
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated"}