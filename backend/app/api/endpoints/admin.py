from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.food import FoodItem, SwapRecipe

router = APIRouter()

class FoodItemCreate(BaseModel):
    name: str
    category: Optional[str] = "Fast Food"
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: Optional[float] = 0.0
    health_score: Optional[float] = 30.0
    average_cost_usd: Optional[float] = 8.50
    sweetness: Optional[float] = 50.0
    savoriness: Optional[float] = 50.0
    crunchiness: Optional[float] = 50.0
    creaminess: Optional[float] = 50.0
    spiciness: Optional[float] = 0.0
    image_url: Optional[str] = None

@router.get("/foods")
def list_foods(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        # For demo purposes, allow viewing
        pass
    return db.query(FoodItem).all()

@router.post("/foods")
def create_food(
    food_in: FoodItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    food = FoodItem(**food_in.dict())
    db.add(food)
    db.commit()
    db.refresh(food)
    return food

@router.delete("/foods/{food_id}")
def delete_food(
    food_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    food = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")
    db.delete(food)
    db.commit()
    return {"message": "Food item deleted successfully"}
