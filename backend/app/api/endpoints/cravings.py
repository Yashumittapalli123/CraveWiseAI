from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.craving import CravingLog
from app.schemas.craving import CravingRequest, CravingTwinResponse, CravingLogOut
from app.services.ai_service import generate_craving_twin

router = APIRouter()

@router.post("/generate-twin", response_model=CravingTwinResponse)
async def create_craving_twin(
    req: CravingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not req.craved_food or not req.craved_food.strip():
        raise HTTPException(status_code=400, detail="Craved food cannot be empty")
        
    ai_result = await generate_craving_twin(req.craved_food, req.mood, req.intensity)
    
    junk = ai_result["junk"]
    twin = ai_result["twin"]
    why = ai_result["why"]
    
    cals_saved = max(0.0, junk["nutrition"]["calories"] - twin["nutrition"]["calories"])
    money_saved = max(0.0, junk["estimated_cost_usd"] - twin["estimated_cost_usd"])
    health_score_diff = twin["nutrition"]["health_score"] - junk["nutrition"]["health_score"]
    
    # Save log to database
    log = CravingLog(
        user_id=current_user.id,
        craved_food=req.craved_food,
        input_type=req.input_type or "text",
        craving_trigger=why["primary_trigger"],
        why_explanation=why["explanation"],
        mood=req.mood or "Neutral",
        intensity=req.intensity or 7,
        healthy_twin_name=twin["name"],
        taste_similarity_score=twin["taste_similarity_score"],
        calories_saved=cals_saved,
        money_saved_usd=money_saved,
        swap_accepted=True
    )
    db.add(log)
    
    # Gamification updates for user
    current_user.xp += 50
    current_user.total_swaps_completed += 1
    current_user.total_calories_saved += cals_saved
    current_user.total_money_saved += money_saved
    current_user.current_streak += 1
    if current_user.current_streak > current_user.longest_streak:
        current_user.longest_streak = current_user.current_streak
    
    # Calculate Level based on XP (Every 100 XP = 1 Level)
    current_user.level = 1 + (current_user.xp // 100)
    
    db.commit()
    db.refresh(log)
    db.refresh(current_user)
    
    return {
        "id": log.id,
        "craved_food": req.craved_food,
        "junk_food": junk,
        "healthy_twin": twin,
        "why_analysis": why,
        "calories_saved": cals_saved,
        "money_saved_usd": money_saved,
        "health_score_diff": health_score_diff,
        "created_at": log.created_at
    }

@router.get("/history", response_model=List[CravingLogOut])
def get_craving_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(CravingLog).filter(CravingLog.user_id == current_user.id).order_by(CravingLog.created_at.desc()).all()
    return logs
