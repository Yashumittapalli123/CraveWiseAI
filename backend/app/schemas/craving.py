from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class SubstitutionItem(BaseModel):
    original: str
    substitute: str
    benefit: str

class TasteProfile(BaseModel):
    sweetness: float
    savoriness: float
    crunchiness: float
    creaminess: float
    spiciness: float

class NutritionBreakdown(BaseModel):
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    health_score: float

class JunkFoodDetail(BaseModel):
    name: str
    nutrition: NutritionBreakdown
    taste_profile: TasteProfile
    ingredients: List[str]
    estimated_cost_usd: float
    image_url: Optional[str] = None

class HealthyTwinDetail(BaseModel):
    name: str
    nutrition: NutritionBreakdown
    taste_profile: TasteProfile
    substitutions: List[SubstitutionItem]
    recipe_steps: List[str]
    grocery_list: List[str]
    taste_similarity_score: float
    texture_match_score: float
    prep_time_minutes: int
    estimated_cost_usd: float
    image_url: Optional[str] = None

class CravingRequest(BaseModel):
    craved_food: str
    input_type: Optional[str] = "text" # text, voice, image
    mood: Optional[str] = "Neutral"
    intensity: Optional[int] = 7
    image_base64: Optional[str] = None

class WhyCravingAnalysis(BaseModel):
    primary_trigger: str # Stress, Boredom, Low Energy, Sleep Deficit, Emotional, Hunger
    explanation: str
    physiological_reason: str
    actionable_tip: str

class CravingTwinResponse(BaseModel):
    id: Optional[int] = None
    craved_food: str
    junk_food: JunkFoodDetail
    healthy_twin: HealthyTwinDetail
    why_analysis: WhyCravingAnalysis
    calories_saved: float
    money_saved_usd: float
    health_score_diff: float
    created_at: Optional[datetime] = None

class CravingLogOut(BaseModel):
    id: int
    craved_food: str
    healthy_twin_name: Optional[str]
    craving_trigger: str
    why_explanation: Optional[str]
    taste_similarity_score: float
    calories_saved: float
    money_saved_usd: float
    created_at: datetime

    class Config:
        from_attributes = True
