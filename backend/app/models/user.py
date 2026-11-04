from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_order=True, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    
    # User profile & goals
    daily_calorie_target = Column(Integer, default=2000)
    dietary_preference = Column(String, default="Balanced")  # Vegan, Keto, Low-Carb, High-Protein, Gluten-Free, Balanced
    cravings_sensitivity = Column(String, default="Medium") # High, Medium, Low
    
    # Gamification
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_swaps_completed = Column(Integer, default=0)
    total_calories_saved = Column(Integer, default=0)
    total_money_saved = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    cravings = relationship("CravingLog", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    grocery_items = relationship("GroceryItem", back_populates="user", cascade="all, delete-orphan")
