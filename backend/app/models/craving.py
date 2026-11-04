from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class CravingLog(Base):
    __tablename__ = "craving_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    craved_food = Column(String, nullable=False)
    input_type = Column(String, default="text") # text, voice, image
    image_url = Column(String, nullable=True)
    
    # AI Explanation & Root Cause
    craving_trigger = Column(String, default="Stress/Tiredness") # Stress, Boredom, Low Energy, Sleep Deficit, Emotional, Hunger
    why_explanation = Column(Text, nullable=True)
    mood = Column(String, default="Neutral")
    intensity = Column(Integer, default=7) # 1-10 scale
    
    # Healthy Twin Result
    healthy_twin_name = Column(String, nullable=True)
    taste_similarity_score = Column(Float, default=85.0)
    calories_saved = Column(Float, default=0.0)
    money_saved_usd = Column(Float, default=0.0)
    
    swap_accepted = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="cravings")
