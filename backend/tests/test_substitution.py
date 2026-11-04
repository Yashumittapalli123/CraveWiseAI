from app.services.substitution_engine import calculate_taste_similarity, INGREDIENT_SWAPS

def test_taste_similarity_calculation():
    orig_taste = {"sweetness": 20, "savoriness": 90, "crunchiness": 80, "creaminess": 70, "spiciness": 10}
    twin_taste = {"sweetness": 20, "savoriness": 88, "crunchiness": 78, "creaminess": 68, "spiciness": 10}
    
    result = calculate_taste_similarity(orig_taste, twin_taste)
    assert result["overall_similarity"] >= 85.0
    assert result["texture_match"] >= 85.0

def test_ingredient_swaps_dictionary():
    assert "deep frying" in INGREDIENT_SWAPS
    assert INGREDIENT_SWAPS["deep frying"]["substitute"].startswith("Air frying")
