from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User
from app.models.food import FoodItem, SwapRecipe
from app.models.craving import CravingLog
from app.models.achievement import UserAchievement, GroceryItem
from datetime import datetime, timedelta

def seed_database(db: Session):
    # 1. Create Demo User
    demo_user = db.query(User).filter(User.username == "demo").first()
    if not demo_user:
        demo_user = User(
            email="demo@craveswap.ai",
            username="demo",
            full_name="Alex Morgan",
            hashed_password=get_password_hash("password123"),
            is_admin=True,
            daily_calorie_target=2100,
            dietary_preference="Balanced",
            xp=350,
            level=3,
            current_streak=5,
            longest_streak=12,
            total_swaps_completed=14,
            total_calories_saved=5840.0,
            total_money_saved=84.50
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    # 2. Seed Junk Foods & Swap Recipes
    if db.query(FoodItem).count() == 0:
        foods = [
            FoodItem(
                name="Pepperoni Deep Dish Pizza",
                category="Fast Food",
                calories=950, protein_g=32, carbs_g=98, fat_g=48, fiber_g=4, health_score=25,
                average_cost_usd=14.50, sweetness=20, savoriness=95, crunchiness=75, creaminess=80, spiciness=40,
                ingredients=["Refined Crust", "Pepperoni", "Mozzarella", "Tomato Sauce"],
                image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
            ),
            FoodItem(
                name="Double Bacon Cheeseburger",
                category="Fast Food",
                calories=1100, protein_g=48, carbs_g=62, fat_g=72, fiber_g=2, health_score=20,
                average_cost_usd=12.00, sweetness=15, savoriness=98, crunchiness=60, creaminess=85, spiciness=10,
                ingredients=["Beef Patties", "Bacon", "American Cheese", "Brioche Bun"],
                image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
            ),
            FoodItem(
                name="Large French Fries",
                category="Fast Food",
                calories=550, protein_g=6, carbs_g=72, fat_g=26, fiber_g=5, health_score=30,
                average_cost_usd=4.50, sweetness=10, savoriness=90, crunchiness=95, creaminess=30, spiciness=0,
                ingredients=["Potatoes", "Refined Oil", "Salt"],
                image_url="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
            ),
            FoodItem(
                name="Chocolate Fudge Brownie Ice Cream",
                category="Sweets",
                calories=1050, protein_g=14, carbs_g=125, fat_g=58, fiber_g=3, health_score=18,
                average_cost_usd=7.00, sweetness=95, savoriness=10, crunchiness=20, creaminess=98, spiciness=0,
                ingredients=["Heavy Cream", "Sugar", "Brownie Bites", "Cocoa"],
                image_url="https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80"
            )
        ]
        db.add_all(foods)

        swaps = [
            SwapRecipe(
                junk_food_name="Pepperoni Deep Dish Pizza",
                healthy_twin_name="Air-Fried Cauliflower Crust Turkey Pepperoni Twin",
                calories=420, protein_g=45, carbs_g=24, fat_g=16, fiber_g=9, health_score=88,
                estimated_cost_usd=6.80, taste_similarity_score=91.0, texture_match_score=89.0, prep_time_minutes=15,
                substitutions=[
                    {"original": "Refined Flour Crust", "substitute": "Cauliflower & Almond Crust", "benefit": "Cuts 60g carbs and adds fiber"},
                    {"original": "Pork Pepperoni", "substitute": "Turkey Pepperoni", "benefit": "Reduces saturated fat by 70%"}
                ],
                recipe_steps=["Preheat air fryer to 400°F.", "Mix cauliflower rice, almond flour, and egg white.", "Bake 8 mins.", "Add toppings and melt."],
                grocery_list=["Cauliflower rice", "Almond flour", "Part-skim mozzarella", "Turkey pepperoni"],
                image_url="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80"
            )
        ]
        db.add_all(swaps)
        db.commit()

    # 3. Seed Achievements
    if db.query(UserAchievement).filter(UserAchievement.user_id == demo_user.id).count() == 0:
        achievements = [
            UserAchievement(user_id=demo_user.id, badge_key="FIRST_SWAP", title="First Swap", description="Completed your first healthy twin swap!", icon="Zap", unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=5)),
            UserAchievement(user_id=demo_user.id, badge_key="STREAK_5", title="5-Day Warrior", description="Maintained a 5-day healthy swap streak!", icon="Flame", unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=1)),
            UserAchievement(user_id=demo_user.id, badge_key="CALORIES_5000", title="Calorie Crusher", description="Saved over 5,000 junk food calories!", icon="ShieldCheck", unlocked=True, unlocked_at=datetime.utcnow()),
            UserAchievement(user_id=demo_user.id, badge_key="BUDGET_SAVER", title="Wallet Saver", description="Saved $50+ by choosing homemade twins!", icon="DollarSign", unlocked=True, unlocked_at=datetime.utcnow() - timedelta(days=2)),
            UserAchievement(user_id=demo_user.id, badge_key="TWIN_MASTER", title="Twin Master", description="Tried 10 unique junk food twin recipes!", icon="Trophy", unlocked=False)
        ]
        db.add_all(achievements)

    # 4. Seed Cravings Log History for Analytics
    if db.query(CravingLog).filter(CravingLog.user_id == demo_user.id).count() == 0:
        past_logs = [
            CravingLog(user_id=demo_user.id, craved_food="Pepperoni Pizza", input_type="text", craving_trigger="Stress & Tiredness", why_explanation="Elevated cortisol driving high-calorie salty craving.", mood="Stressed", intensity=8, healthy_twin_name="Air-Fried Cauliflower Crust Turkey Pepperoni Twin", taste_similarity_score=91.0, calories_saved=530, money_saved_usd=7.70, created_at=datetime.utcnow() - timedelta(days=4)),
            CravingLog(user_id=demo_user.id, craved_food="Double Cheeseburger", input_type="text", craving_trigger="Low Energy", why_explanation="Protein deficit in afternoon causing ghrelin spike.", mood="Tired", intensity=7, healthy_twin_name="Smokey Smash Turkey & Avocado Twin Burger", taste_similarity_score=90.0, calories_saved=620, money_saved_usd=6.50, created_at=datetime.utcnow() - timedelta(days=3)),
            CravingLog(user_id=demo_user.id, craved_food="Large French Fries", input_type="image", craving_trigger="Boredom", why_explanation="Mastication & crunch seeking during work fatigue.", mood="Bored", intensity=6, healthy_twin_name="Crispy Air-Fried Sweet Potato Fries", taste_similarity_score=89.0, calories_saved=340, money_saved_usd=2.30, created_at=datetime.utcnow() - timedelta(days=2)),
            CravingLog(user_id=demo_user.id, craved_food="Chocolate Ice Cream", input_type="voice", craving_trigger="Emotional Comfort", why_explanation="Serotonin boost seeking late at night.", mood="Relaxed", intensity=7, healthy_twin_name="High-Protein Chocolate Banana Nice Cream", taste_similarity_score=93.0, calories_saved=770, money_saved_usd=4.50, created_at=datetime.utcnow() - timedelta(days=1)),
        ]
        db.add_all(past_logs)
        db.commit()
