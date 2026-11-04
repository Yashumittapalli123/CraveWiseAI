from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, Token, UserLogin
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter((User.email == user_in.email) | (User.username == user_in.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email or username already exists"
        )
    
    user = User(
        email=user_in.email,
        username=user_in.username,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        daily_calorie_target=user_in.daily_calorie_target or 2000,
        dietary_preference=user_in.dietary_preference or "Balanced"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    access_token = create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == login_data.username_or_email) | (User.email == login_data.username_or_email)
    ).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password"
        )
    
    access_token = create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if "full_name" in profile_data:
        current_user.full_name = profile_data["full_name"]
    if "daily_calorie_target" in profile_data:
        current_user.daily_calorie_target = profile_data["daily_calorie_target"]
    if "dietary_preference" in profile_data:
        current_user.dietary_preference = profile_data["dietary_preference"]
    
    db.commit()
    db.refresh(current_user)
    return current_user
