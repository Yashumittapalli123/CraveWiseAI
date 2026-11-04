"""
AI Service - Integrates with OpenAI API for Craving Twin Generation,
Root-Cause Psychological Analysis, and dynamic recipe creation.
Includes smart deterministic fallback engine for offline or key-less operation.
"""
import json
import logging
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings
from app.services.substitution_engine import calculate_taste_similarity

logger = logging.getLogger(__name__)

# Pre-computed rich food twins catalog for quick & realistic fallbacks
FALLBACK_TWIN_CATALOG = {
    "pizza": {
        "junk": {
            "name": "Pepperoni Deep Dish Pizza",
            "nutrition": {"calories": 950, "protein_g": 32, "carbs_g": 98, "fat_g": 48, "fiber_g": 4, "health_score": 25},
            "taste_profile": {"sweetness": 20, "savoriness": 95, "crunchiness": 75, "creaminess": 80, "spiciness": 40},
            "ingredients": ["Refined Flour Crust", "Processed Pepperoni", "Full-Fat Mozzarella", "High-Sodium Tomato Sauce", "Hydrogenated Oils"],
            "estimated_cost_usd": 14.50,
            "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
        },
        "twin": {
            "name": "Air-Fried Cauliflower Crust Turkey Pepperoni Twin",
            "nutrition": {"calories": 420, "protein_g": 45, "carbs_g": 24, "fat_g": 16, "fiber_g": 9, "health_score": 88},
            "taste_profile": {"sweetness": 20, "savoriness": 92, "crunchiness": 85, "creaminess": 75, "spiciness": 40},
            "substitutions": [
                {"original": "Refined Flour Crust", "substitute": "Almond & Cauliflower Crust", "benefit": "Cuts 60g carbs and adds fiber"},
                {"original": "Processed Pork Pepperoni", "substitute": "Turkey Pepperoni", "benefit": "Reduces saturated fat by 70%"},
                {"original": "Full-Fat Mozzarella", "substitute": "Part-Skim Mozzarella + Nutritional Yeast", "benefit": "High protein, lower calorie density"}
            ],
            "recipe_steps": [
                "Preheat air fryer to 400°F (200°C).",
                "Mix grated cauliflower, almond flour, egg white, and Italian herbs into a dough. Press into a thin crust.",
                "Air fry crust for 8 minutes until golden crisp.",
                "Spread low-sugar marinara sauce, part-skim mozzarella, and turkey pepperoni slices.",
                "Air fry for an additional 4 minutes until cheese melts."
            ],
            "grocery_list": ["Cauliflower rice", "Almond flour", "Egg whites", "Low-sugar marinara", "Part-skim mozzarella", "Turkey pepperoni"],
            "taste_similarity_score": 91.0,
            "texture_match_score": 89.0,
            "prep_time_minutes": 15,
            "estimated_cost_usd": 6.80,
            "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80"
        },
        "why": {
            "primary_trigger": "Stress & Cortisol Spike",
            "explanation": "Your brain is seeking quick comfort through high-fat, high-sodium savory foods because elevated cortisol increases appetite for calorie-dense items.",
            "physiological_reason": "Sodium and melted fat stimulate dopamine release in the reward center, briefly counteracting acute mental fatigue.",
            "actionable_tip": "Pair your healthy pizza twin with a 300ml glass of cold water and take 5 deep belly breaths to lower cortisol."
        }
    },
    "burger": {
        "junk": {
            "name": "Double Bacon Cheeseburger",
            "nutrition": {"calories": 1100, "protein_g": 48, "carbs_g": 62, "fat_g": 72, "fiber_g": 2, "health_score": 20},
            "taste_profile": {"sweetness": 15, "savoriness": 98, "crunchiness": 60, "creaminess": 85, "spiciness": 10},
            "ingredients": ["80/20 Beef Patties", "Crispy Pork Bacon", "American Processed Cheese", "Brioche Bun", "Heavy Mayo Spread"],
            "estimated_cost_usd": 12.00,
            "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
        },
        "twin": {
            "name": "Smokey Smash Turkey & Avocado Twin Burger",
            "nutrition": {"calories": 480, "protein_g": 52, "carbs_g": 28, "fat_g": 18, "fiber_g": 8, "health_score": 90},
            "taste_profile": {"sweetness": 15, "savoriness": 94, "crunchiness": 70, "creaminess": 82, "spiciness": 15},
            "substitutions": [
                {"original": "80/20 Fatty Beef", "substitute": "93/7 Lean Ground Turkey Patties", "benefit": "Saves 35g saturated fat"},
                {"original": "Brioche White Bun", "substitute": "Toasted Whole Grain or Lettuce Wrap", "benefit": "Adds complex slow-release carbs"},
                {"original": "Heavy Mayo", "substitute": "Mashed Avocado + Garlic Greek Yogurt", "benefit": "Swaps bad fat for heart-healthy Omega-9s"}
            ],
            "recipe_steps": [
                "Form lean ground turkey into thin patties and season with smoked paprika, sea salt, and black pepper.",
                "Heat a cast iron skillet over high heat and smash patties for crisp edges (3 mins per side).",
                "Toast whole grain bun and spread garlic Greek yogurt sauce.",
                "Layer turkey patty, sliced avocado, crisp romaine lettuce, and tomato."
            ],
            "grocery_list": ["93% Lean ground turkey", "Whole grain buns", "Avocado", "Non-fat Greek yogurt", "Smoked paprika", "Romaine lettuce"],
            "taste_similarity_score": 90.0,
            "texture_match_score": 92.0,
            "prep_time_minutes": 12,
            "estimated_cost_usd": 5.50,
            "image_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
        },
        "why": {
            "primary_trigger": "Protein & Iron Need or Hunger Deficit",
            "explanation": "You may be experiencing a caloric deficit or low protein intake earlier in the day, causing intense cravings for dense savory protein.",
            "physiological_reason": "Ghrelin levels peak when meal intervals are too long, driving hyper-fixation on rich fat and protein combinations.",
            "actionable_tip": "Enjoy the turkey avocado twin which provides 52g of clean protein to shut off ghrelin signals quickly."
        }
    },
    "fries": {
        "junk": {
            "name": "Large Deep-Fried French Fries",
            "nutrition": {"calories": 550, "protein_g": 6, "carbs_g": 72, "fat_g": 26, "fiber_g": 5, "health_score": 30},
            "taste_profile": {"sweetness": 10, "savoriness": 90, "crunchiness": 95, "creaminess": 30, "spiciness": 0},
            "ingredients": ["Russet Potatoes", "Hydrogenated Vegetable Oil", "Refined Sodium Chloride", "Flavor Enhancers"],
            "estimated_cost_usd": 4.50,
            "image_url": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
        },
        "twin": {
            "name": "Crispy Air-Fried Sweet Potato & Paprika Fries",
            "nutrition": {"calories": 210, "protein_g": 4, "carbs_g": 36, "fat_g": 5, "fiber_g": 7, "health_score": 92},
            "taste_profile": {"sweetness": 25, "savoriness": 88, "crunchiness": 90, "creaminess": 25, "spiciness": 10},
            "substitutions": [
                {"original": "Deep Frying in Seed Oils", "substitute": "Air frying with 1 tsp extra virgin olive oil", "benefit": "Cuts 21g of oxidized oils"},
                {"original": "White Russet Potato", "substitute": "Nutrient-Dense Sweet Potato", "benefit": "Provides 300% daily Vitamin A and lower glycemic impact"}
            ],
            "recipe_steps": [
                "Slice sweet potatoes into thin uniform sticks and soak in cold water for 10 minutes (draws out starch).",
                "Pat dry thoroughly and toss with 1 tsp olive oil, cornstarch, smoked paprika, and sea salt.",
                "Air fry at 390°F for 14 minutes, shaking halfway through."
            ],
            "grocery_list": ["Sweet potatoes", "Extra virgin olive oil", "Cornstarch", "Smoked paprika", "Sea salt"],
            "taste_similarity_score": 89.0,
            "texture_match_score": 91.0,
            "prep_time_minutes": 15,
            "estimated_cost_usd": 2.20,
            "image_url": "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80"
        },
        "why": {
            "primary_trigger": "Boredom or Electrolyte/Sodium Seeking",
            "explanation": "Crunchy salty cravings often signal boredom, sensory seeking, or slight dehydration requiring sodium balance.",
            "physiological_reason": "Mastication (chewing crunchy texture) releases muscular tension and boosts alertness when bored or fatigued.",
            "actionable_tip": "Sip a glass of mineral water with lemon while air frying your crispy sweet potato twin."
        }
    },
    "ice cream": {
        "junk": {
            "name": "Triple Chocolate Fudge Ice Cream Pint",
            "nutrition": {"calories": 1050, "protein_g": 14, "carbs_g": 125, "fat_g": 58, "fiber_g": 3, "health_score": 18},
            "taste_profile": {"sweetness": 95, "savoriness": 10, "crunchiness": 20, "creaminess": 98, "spiciness": 0},
            "ingredients": ["Heavy Cream", "Liquid Sugar", "Cocoa Butter", "High Fructose Fudge Swirl"],
            "estimated_cost_usd": 7.00,
            "image_url": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80"
        },
        "twin": {
            "name": "High-Protein Creamy Chocolate Banana 'Nice Cream'",
            "nutrition": {"calories": 280, "protein_g": 28, "carbs_g": 34, "fat_g": 4, "fiber_g": 6, "health_score": 94},
            "taste_profile": {"sweetness": 88, "savoriness": 10, "crunchiness": 30, "creaminess": 94, "spiciness": 0},
            "substitutions": [
                {"original": "Heavy Cream Base", "substitute": "Frozen Bananas & Chocolate Whey/Plant Protein", "benefit": "Cuts 54g fat and adds 28g protein"},
                {"original": "Fudge Syrup", "substitute": "Raw Unsweetened Cacao Powder", "benefit": "Rich in magnesium & natural mood-boosting flavonoids"}
            ],
            "recipe_steps": [
                "Place 2 frozen ripe bananas, 1 scoop chocolate protein powder, 2 tbsp dark cacao powder, and 50ml almond milk into a high-speed blender.",
                "Blend on high for 60 seconds until thick and velvety soft-serve texture forms.",
                "Top with 1 tsp 70% dark chocolate shavings."
            ],
            "grocery_list": ["Bananas (frozen)", "Chocolate protein powder", "Unsweetened cacao powder", "Almond milk", "Dark chocolate"],
            "taste_similarity_score": 93.0,
            "texture_match_score": 94.0,
            "prep_time_minutes": 5,
            "estimated_cost_usd": 2.50,
            "image_url": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80"
        },
        "why": {
            "primary_trigger": "Low Serotonin or Emotional Comfort",
            "explanation": "Sweet, creamy foods release endorphins and serotonin rapidly, making them a top choice when feeling low or seeking comfort.",
            "physiological_reason": "Carbohydrates combined with fats cross the blood-brain barrier efficiently, triggering tryptophan uptake.",
            "actionable_tip": "Enjoy this protein chocolate nice cream while sitting comfortably away from screens."
        }
    }
}

async def generate_craving_twin(craved_food: str, mood: str = "Neutral", intensity: int = 7) -> Dict[str, Any]:
    """
    Generates a complete Junk Food vs Healthy Twin analysis.
    Uses OpenAI API if configured, otherwise falls back to smart match engine.
    """
    food_key = craved_food.lower()
    
    # Try matching known key or partial match in fallback catalog
    matched_catalog_item = None
    for k, v in FALLBACK_TWIN_CATALOG.items():
        if k in food_key or food_key in k:
            matched_catalog_item = v
            break
            
    # If OpenAI key exists, try API request first
    if settings.OPENAI_API_KEY:
        try:
            prompt = f"""
            Analyze the junk food craving for: "{craved_food}". User mood: {mood}, intensity: {intensity}/10.
            Return ONLY a valid JSON object matching this structure:
            {{
                "junk": {{
                    "name": "{craved_food}",
                    "nutrition": {{"calories": 800, "protein_g": 20, "carbs_g": 85, "fat_g": 40, "fiber_g": 3, "health_score": 25}},
                    "taste_profile": {{"sweetness": 30, "savoriness": 90, "crunchiness": 70, "creaminess": 60, "spiciness": 20}},
                    "ingredients": ["ingredient1", "ingredient2"],
                    "estimated_cost_usd": 10.0,
                    "image_url": null
                }},
                "twin": {{
                    "name": "Healthier Twin Recipe Name",
                    "nutrition": {{"calories": 380, "protein_g": 35, "carbs_g": 30, "fat_g": 12, "fiber_g": 8, "health_score": 88}},
                    "taste_profile": {{"sweetness": 30, "savoriness": 88, "crunchiness": 72, "creaminess": 58, "spiciness": 20}},
                    "substitutions": [{{"original": "bad ingredient", "substitute": "good swap", "benefit": "health benefit"}}],
                    "recipe_steps": ["step 1", "step 2"],
                    "grocery_list": ["item 1", "item 2"],
                    "taste_similarity_score": 88.0,
                    "texture_match_score": 90.0,
                    "prep_time_minutes": 15,
                    "estimated_cost_usd": 4.5,
                    "image_url": null
                }},
                "why": {{
                    "primary_trigger": "Stress/Tiredness",
                    "explanation": "Psychological breakdown...",
                    "physiological_reason": "Biological mechanism...",
                    "actionable_tip": "Specific behavioral tip..."
                }}
            }}
            """
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": settings.OPENAI_MODEL,
                        "messages": [{"role": "user", "content": prompt}],
                        "response_format": {"type": "json_object"}
                    }
                )
                if resp.status_code == 200:
                    content = resp.json()["choices"][0]["message"]["content"]
                    data = json.loads(content)
                    return data
        except Exception as e:
            logger.warning(f"OpenAI API call failed, falling back to internal engine: {e}")

    # Fallback / Default Generator
    if matched_catalog_item:
        return matched_catalog_item

    # Generic smart generator if item is novel
    junk_cals = 750.0
    twin_cals = 320.0
    return {
        "junk": {
            "name": craved_food.title(),
            "nutrition": {"calories": junk_cals, "protein_g": 18.0, "carbs_g": 75.0, "fat_g": 42.0, "fiber_g": 2.0, "health_score": 28.0},
            "taste_profile": {"sweetness": 40.0, "savoriness": 85.0, "crunchiness": 65.0, "creaminess": 60.0, "spiciness": 15.0},
            "ingredients": ["Refined Oils", "Processed Sugars", "Refined Grains", "Added Flavorings"],
            "estimated_cost_usd": 9.50,
            "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
        },
        "twin": {
            "name": f"Air-Fried Protein {craved_food.title()} Twin",
            "nutrition": {"calories": twin_cals, "protein_g": 38.0, "carbs_g": 26.0, "fat_g": 10.0, "fiber_g": 7.0, "health_score": 89.0},
            "taste_profile": {"sweetness": 40.0, "savoriness": 84.0, "crunchiness": 70.0, "creaminess": 58.0, "spiciness": 15.0},
            "substitutions": [
                {"original": "Deep Frying in Seed Oil", "substitute": "Air Frying with Olive Oil Spray", "benefit": "Cuts 70% of bad fat"},
                {"original": "Refined White Flour", "substitute": "Almond & Oat Flour", "benefit": "Lowers glycemic spike"},
                {"original": "High Sodium Sauce", "substitute": "Herb & Garlic Greek Yogurt Drizzle", "benefit": "Boosts protein & gut microbiome health"}
            ],
            "recipe_steps": [
                f"Prepare fresh ingredients for healthy {craved_food.title()} twin.",
                "Coat lightly with avocado/olive oil spray and season with natural spices.",
                "Air fry at 380°F for 12-15 minutes until golden and crispy.",
                "Serve warm with high-protein Greek yogurt dip."
            ],
            "grocery_list": ["Greek yogurt", "Almond flour", "Olive oil spray", "Fresh herbs", "Lean protein base"],
            "taste_similarity_score": 88.0,
            "texture_match_score": 90.0,
            "prep_time_minutes": 15,
            "estimated_cost_usd": 4.20,
            "image_url": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80"
        },
        "why": {
            "primary_trigger": "Stress & Tiredness",
            "explanation": f"Craving {craved_food} is frequently driven by fatigue or emotional stress seeking dopamine stimulation.",
            "physiological_reason": "High carbohydrate + fat combinations stimulate rapid brain reward cascades to mask energy dips.",
            "actionable_tip": "Hydrate first, then make this high-protein twin to satisfy flavor without post-meal fatigue."
        }
    }
