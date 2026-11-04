from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    badge_key = Column(String, nullable=False) # FIRST_SWAP, STREAK_3, STREAK_7, CALORIES_1000, BUDGET_SAVER
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, default="Award")
    unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="achievements")

class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    ingredient_name = Column(String, nullable=False)
    category = Column(String, default="Pantry") # Produce, Dairy/Alternatives, Pantry, Spices
    from_recipe = Column(String, nullable=True)
    checked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="grocery_items")
