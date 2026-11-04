from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.craving import CravingLog
from app.services.ml_predictor import predictor

router = APIRouter()

class ChatMessage(BaseModel):
    message: str

@router.post("/chat")
def coach_chat(
    msg: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = msg.message.lower()
    
    if "late night" in query or "night" in query:
        response = "Late night cravings are usually driven by fatigue or habit loops! Try sipping warm chamomile tea or making our 5-minute Chocolate Protein Nice Cream."
    elif "stress" in query or "work" in query:
        response = "When stress strikes, cortisol makes us crave sodium and fat. Doing a quick 2-minute box breathing session cuts cortisol by up to 20%!"
    elif "sweet" in query or "sugar" in query:
        response = "Sugar cravings often indicate a quick serotonin fix requirement. Try our Air-Fried Cinnamon Apple Slices or Dark Chocolate Greek Yogurt Twin!"
    elif "salty" in query or "crunch" in query:
        response = "For salty crunchy cravings, air-fried sweet potato chips or roasted spicy chickpeas deliver 90%+ texture match with a fraction of the oil."
    else:
        response = f"Great question, {current_user.full_name or current_user.username}! To manage your cravings effectively, focus on high-protein swaps that preserve texture while reducing caloric density."

    return {"response": response, "sender": "Craving Twin Coach AI"}

@router.get("/reminders")
def get_smart_reminders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cravings = db.query(CravingLog).filter(CravingLog.user_id == current_user.id).all()
    predictions = predictor.predict_high_risk_windows(cravings)
    return predictions
