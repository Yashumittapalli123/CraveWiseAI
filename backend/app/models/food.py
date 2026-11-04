from sqlalchemy import Column, Integer, String, Float, Text, JSON, Boolean, DateTime
from datetime import datetime
from app.core.database import Base

class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(String, default="Fast Food") # Fast Food, Sweets, Snacks, Beverages, Bakery
    is_junk = Column(Boolean, default=True)
    
    # Nutrition per serving
    calories = Column(Float, nullable=False)
    protein_g = Column(Float, nullable=False)
    carbs_g = Column(Float, nullable=False)
    fat_g = Column(Float, nullable=False)
    fiber_g = Column(Float, default=0.0)
    health_score = Column(Float, default=30.0) # 0 to 100
    average_cost_usd = Column(Float, default=8.50)
    
    # Taste Profile (0 to 100)
    sweetness = Column(Float, default=50.0)
    savoriness = Column(Float, default=50.0)
    crunchiness = Column(Float, default=50.0)
    creaminess = Column(Float, default=50.0)
    spiciness = Column(Float, default=0.0)
    
    # Visuals & Ingredients
    image_url = Column(String, nullable=True)
    ingredients = Column(JSON, default=list) # List of strings
    
    created_at = Column(DateTime, default=datetime.utcnow)

class SwapRecipe(Base):
    __tablename__ = "swap_recipes"

    id = Column(Integer, primary_key=True, index=True)
    junk_food_name = Column(String, index=True, nullable=False)
    healthy_twin_name = Column(String, nullable=False)
    
    # Nutrition comparison for healthy twin
    calories = Column(Float, nullable=False)
    protein_g = Column(Float, nullable=False)
    carbs_g = Column(Float, nullable=False)
    fat_g = Column(Float, nullable=False)
    fiber_g = Column(Float, default=0.0)
    health_score = Column(Float, default=85.0) # 0 to 100
    estimated_cost_usd = Column(Float, default=3.50)
    
    # Similarity Metrics
    taste_similarity_score = Column(Float, default=88.0) # 0 to 100% match
    texture_match_score = Column(Float, default=90.0)
    
    # Preparation & Ingredients
    prep_time_minutes = Column(Integer, default=15)
    image_url = Column(String, nullable=True)
    substitutions = Column(JSON, default=list) # List of {original, substitute, benefit}
    recipe_steps = Column(JSON, default=list) # List of step strings
    grocery_list = Column(JSON, default=list) # List of ingredient strings
    
    created_at = Column(DateTime, default=datetime.utcnow)
