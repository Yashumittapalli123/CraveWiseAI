export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_admin: boolean;
  daily_calorie_target: number;
  dietary_preference: string;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  total_swaps_completed: number;
  total_calories_saved: number;
  total_money_saved: number;
  created_at: string;
}

export interface TasteProfile {
  sweetness: number;
  savoriness: number;
  crunchiness: number;
  creaminess: number;
  spiciness: number;
}

export interface NutritionBreakdown {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  health_score: number;
}

export interface SubstitutionItem {
  original: string;
  substitute: string;
  benefit: string;
}

export interface JunkFoodDetail {
  name: string;
  nutrition: NutritionBreakdown;
  taste_profile: TasteProfile;
  ingredients: string[];
  estimated_cost_usd: number;
  image_url?: string;
}

export interface HealthyTwinDetail {
  name: string;
  nutrition: NutritionBreakdown;
  taste_profile: TasteProfile;
  substitutions: SubstitutionItem[];
  recipe_steps: string[];
  grocery_list: string[];
  taste_similarity_score: number;
  texture_match_score: number;
  prep_time_minutes: number;
  estimated_cost_usd: number;
  image_url?: string;
}

export interface WhyCravingAnalysis {
  primary_trigger: string;
  explanation: string;
  physiological_reason: string;
  actionable_tip: string;
}

export interface CravingTwinResponse {
  id?: number;
  craved_food: string;
  junk_food: JunkFoodDetail;
  healthy_twin: HealthyTwinDetail;
  why_analysis: WhyCravingAnalysis;
  calories_saved: number;
  money_saved_usd: number;
  health_score_diff: number;
  created_at?: string;
}

export interface GroceryItem {
  id: number;
  ingredient_name: string;
  category: string;
  from_recipe?: string;
  checked: boolean;
}

export interface CravingLogOut {
  id: number;
  craved_food: string;
  healthy_twin_name?: string;
  taste_similarity_score: number;
  craving_trigger: string;
  calories_saved: number;
  money_saved_usd: number;
  created_at: string;
}

export interface Achievement {
  id: number;
  badge_key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}
