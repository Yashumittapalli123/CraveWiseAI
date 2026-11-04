import React, { useState } from 'react';
import { CravingInputForm } from '../components/cravings/CravingInputForm';
import { TwinComparisonCard } from '../components/twin/TwinComparisonCard';
import { useCraving } from '../context/CravingContext';
import { api } from '../services/api';
import { CravingTwinResponse } from '../types';

interface CravingTwinProps {
  onNavigate: (tab: string) => void;
}

export const CravingTwin: React.FC<CravingTwinProps> = ({ onNavigate }) => {
  const { activeTwin, setActiveTwin } = useCraving();
  const [loading, setLoading] = useState(false);

  const handleSubmitCraving = async (foodText: string, mood: string, intensity: number) => {
    setLoading(true);
    try {
      const res = await api.post('/cravings/generate-twin', {
        craved_food: foodText,
        input_type: 'text',
        mood,
        intensity
      });
      setActiveTwin(res.data);
    } catch (err) {
      console.error("Craving Twin generation failed:", err);
      // Fallback mock twin
      const fallbackTwin: CravingTwinResponse = {
        id: 99,
        craved_food: foodText,
        junk_food: {
          name: foodText,
          nutrition: { calories: 920, protein_g: 22, carbs_g: 95, fat_g: 48, fiber_g: 3, health_score: 24 },
          taste_profile: { sweetness: 30, savoriness: 94, crunchiness: 75, creaminess: 70, spiciness: 20 },
          ingredients: ["Refined Flour Base", "Hydrogenated Oils", "Added Sodium"],
          estimated_cost_usd: 12.50,
          image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
        },
        healthy_twin: {
          name: `Air-Fried Protein ${foodText.title ? foodText.title() : foodText} Twin`,
          nutrition: { calories: 390, protein_g: 42, carbs_g: 28, fat_g: 14, fiber_g: 8, health_score: 89 },
          taste_profile: { sweetness: 30, savoriness: 92, crunchiness: 80, creaminess: 68, spiciness: 20 },
          substitutions: [
            { original: "Deep Frying in Seed Oil", substitute: "Air Frying with Olive Oil Spray", benefit: "Cuts 70% of bad fat" },
            { original: "Refined White Flour", substitute: "Almond & Oat Flour", benefit: "Lowers glycemic spike" },
            { original: "High Sodium Sauce", substitute: "Herb & Garlic Greek Yogurt Drizzle", benefit: "Boosts protein & gut health" }
          ],
          recipe_steps: [
            "Prepare fresh ingredients.",
            "Coat lightly with olive oil spray and spices.",
            "Air fry at 380°F for 12-15 minutes until golden.",
            "Serve warm with high-protein Greek yogurt dip."
          ],
          grocery_list: ["Greek yogurt", "Almond flour", "Olive oil spray", "Fresh herbs"],
          taste_similarity_score: 91.0,
          texture_match_score: 89.0,
          prep_time_minutes: 15,
          estimated_cost_usd: 5.20,
          image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80'
        },
        why_analysis: {
          primary_trigger: "Stress & Cortisol",
          explanation: `Craving ${foodText} is frequently driven by fatigue or emotional stress seeking dopamine stimulation.`,
          physiological_reason: "High carbohydrate + fat combinations stimulate rapid brain reward cascades to mask energy dips.",
          actionable_tip: "Hydrate first, then make this high-protein twin to satisfy flavor without post-meal fatigue."
        },
        calories_saved: 530,
        money_saved_usd: 7.30,
        health_score_diff: 65,
        created_at: new Date().toISOString()
      };
      setActiveTwin(fallbackTwin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <CravingInputForm onSubmitCraving={handleSubmitCraving} loading={loading} />

      {activeTwin && (
        <TwinComparisonCard
          twinResponse={activeTwin}
          onOpenSplitView={() => onNavigate('twin-mode')}
        />
      )}
    </div>
  );
};
