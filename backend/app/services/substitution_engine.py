"""
Substitution Engine - Maps common junk food ingredients & techniques to healthier alternatives
with taste similarity score calculation.
"""
from typing import Dict, List, Any

# Curated ingredient substitution database
INGREDIENT_SWAPS = {
    "deep frying": {
        "substitute": "Air frying with olive oil spray",
        "benefit": "Cuts trans fats by 80% and reduces calories while maintaining crunchiness",
        "category": "Cooking Method",
        "texture_preservation": 92.0
    },
    "refined white flour": {
        "substitute": "Almond flour & oat flour blend",
        "benefit": "Adds fiber, healthy fats, protein and lowers glycemic index",
        "category": "Baking/Base",
        "texture_preservation": 88.0
    },
    "heavy cream": {
        "substitute": "Blended Greek yogurt with unsweetened almond milk",
        "benefit": "Dramatically boosts protein while cutting saturated fats by 75%",
        "category": "Dairy",
        "texture_preservation": 85.0
    },
    "processed cheddar cheese": {
        "substitute": "Nutritional yeast & light sharp cheddar",
        "benefit": "Reduces sodium & saturated fat while delivering rich umami savory flavor",
        "category": "Dairy",
        "texture_preservation": 90.0
    },
    "high fructose corn syrup": {
        "substitute": "Pure maple syrup or monk fruit sweetener",
        "benefit": "Avoids blood sugar spikes and provides natural antioxidants",
        "category": "Sweetener",
        "texture_preservation": 95.0
    },
    "processed pork pepperoni": {
        "substitute": "Seasoned turkey pepperoni or spicy sun-dried tomato strips",
        "benefit": "Reduces grease and saturated fat by 60% with equal savory heat",
        "category": "Meat",
        "texture_preservation": 87.0
    },
    "mayonnaise": {
        "substitute": "Avocado mayonnaise or whipped garlic Greek yogurt",
        "benefit": "Swaps unhealthy vegetable oils for heart-healthy monounsaturated fats",
        "category": "Sauce",
        "texture_preservation": 91.0
    },
    "milk chocolate chips": {
        "substitute": "70% dark chocolate chunks",
        "benefit": "Packed with polyphenols and significantly lower sugar content",
        "category": "Sweets",
        "texture_preservation": 94.0
    },
    "white potato chips": {
        "substitute": "Baked kale or thinly sliced baked sweet potato chips",
        "benefit": "Rich in Vitamin A & fiber with a fraction of the oil",
        "category": "Snack Base",
        "texture_preservation": 86.0
    }
}

def calculate_taste_similarity(orig_taste: Dict[str, float], twin_taste: Dict[str, float]) -> Dict[str, float]:
    """
    Calculates overall taste similarity percentage based on 5 taste vectors:
    Sweetness, Savoriness, Crunchiness, Creaminess, Spiciness.
    """
    keys = ["sweetness", "savoriness", "crunchiness", "creaminess", "spiciness"]
    diffs = []
    for k in keys:
        o = orig_taste.get(k, 50.0)
        t = twin_taste.get(k, 50.0)
        diff = abs(o - t)
        diffs.append(diff)
    
    avg_diff = sum(diffs) / len(diffs)
    similarity = max(0.0, min(100.0, 100.0 - (avg_diff * 0.8)))
    return {
        "overall_similarity": round(similarity, 1),
        "texture_match": round(max(80.0, 100.0 - abs(orig_taste.get("crunchiness", 50) - twin_taste.get("crunchiness", 50)) * 0.5), 1)
    }
