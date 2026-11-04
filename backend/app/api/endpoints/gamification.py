from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.achievement import UserAchievement

router = APIRouter()

@router.get("/stats")
def get_gamification_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    achievements = db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    
    # Calculate XP to next level (Each level takes 100 XP)
    current_level = 1 + (current_user.xp // 100)
    xp_in_current_level = current_user.xp % 100
    xp_target = 100

    return {
        "xp": current_user.xp,
        "level": current_level,
        "xp_in_current_level": xp_in_current_level,
        "xp_target": xp_target,
        "current_streak": current_user.current_streak,
        "longest_streak": current_user.longest_streak,
        "total_swaps_completed": current_user.total_swaps_completed,
        "total_calories_saved": current_user.total_calories_saved,
        "total_money_saved": current_user.total_money_saved,
        "achievements": achievements
    }
