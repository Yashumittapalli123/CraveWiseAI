from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    daily_calorie_target: Optional[int] = 2000
    dietary_preference: Optional[str] = "Balanced"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    xp: int
    level: int
    current_streak: int
    longest_streak: int
    total_swaps_completed: int
    total_calories_saved: float
    total_money_saved: float
    created_at: datetime

    class Config:
        from_attributes = True

Token.update_forward_refs()
