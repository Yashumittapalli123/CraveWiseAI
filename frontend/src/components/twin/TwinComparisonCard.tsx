import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, DollarSign, Flame, Clock, ShoppingBag, Brain, Check, Split } from 'lucide-react';
import { CravingTwinResponse } from '../../types';
import { HealthScoreGauge } from '../common/HealthScoreGauge';
import { TasteRadarChart } from '../common/TasteRadarChart';
import { MacroComparisonChart } from '../common/MacroComparisonChart';
import { SubstitutionList } from './SubstitutionList';
import { WhyCravingModal } from '../cravings/WhyCravingModal';
import { api } from '../../services/api';

interface TwinComparisonCardProps {
  twinResponse: CravingTwinResponse;
  onOpenSplitView?: () => void;
}

export const TwinComparisonCard: React.FC<TwinComparisonCardProps> = ({ twinResponse, onOpenSplitView }) => {
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [addedGrocery, setAddedGrocery] = useState(false);

  const { junk_food, healthy_twin, why_analysis, calories_saved, money_saved_usd } = twinResponse;

  const handleAddToGrocery = async () => {
    try {
      await api.post('/grocery/bulk-add', {
        items: healthy_twin.grocery_list,
        from_recipe: healthy_twin.name
      });
      setAddedGrocery(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error("Grocery add error:", err);
      setAddedGrocery(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="w-full glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {healthy_twin.taste_similarity_score}% Taste Similarity Match
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {healthy_twin.prep_time_minutes} Min Prep Time
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {healthy_twin.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Healthy twin for craved <strong className="text-red-400">{junk_food.name}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowWhyModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-xs border border-indigo-500/30 flex items-center space-x-1.5 transition-colors"
          >
            <Brain className="h-4 w-4 text-indigo-400" />
            <span>Why Crave This?</span>
          </button>

          {onOpenSplitView && (
            <button
              onClick={onOpenSplitView}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <Split className="h-4 w-4 text-amber-400" />
              <span>Split Visual View</span>
            </button>
          )}

          <button
            onClick={handleAddToGrocery}
            disabled={addedGrocery}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 flex items-center space-x-1.5 transition-all"
          >
            {addedGrocery ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            <span>{addedGrocery ? 'Added to Grocery!' : 'Add Ingredients to Grocery'}</span>
          </button>
        </div>
      </div>

      {/* Top Highlights Grid (Calories Saved, Money Saved, Health Score) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-950/40 to-slate-900 border border-brand-500/20 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400">
            <Flame className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Calories Saved</span>
            <h4 className="text-xl font-black text-brand-400">-{Math.round(calories_saved)} kcal</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <DollarSign className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Est. Money Saved</span>
            <h4 className="text-xl font-black text-indigo-400">${money_saved_usd.toFixed(2)}</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-around">
          <HealthScoreGauge score={junk_food.nutrition.health_score} label="Junk Score" size={80} />
          <div className="text-xl font-bold text-slate-600">→</div>
          <HealthScoreGauge score={healthy_twin.nutrition.health_score} label="Twin Score" size={80} />
        </div>
      </div>

      {/* Radar & Macro Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-400" /> Taste Profile Comparison (Radar)
          </h3>
          <p className="text-[11px] text-slate-400">Matches crunchiness, sweetness, savory umami, and creaminess</p>
          <TasteRadarChart junkTaste={junk_food.taste_profile} twinTaste={healthy_twin.taste_profile} />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="h-4 w-4 text-red-400" /> Nutrition & Macros Comparison (g)
          </h3>
          <p className="text-[11px] text-slate-400">Reduces carbs & bad fats while boosting muscle-building protein</p>
          <MacroComparisonChart junkNutrition={junk_food.nutrition} twinNutrition={healthy_twin.nutrition} />
        </div>
      </div>

      {/* Substitutions Engine */}
      <SubstitutionList substitutions={healthy_twin.substitutions} />

      {/* Recipe Steps & Grocery Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" /> Recipe Instructions ({healthy_twin.prep_time_minutes} mins)
          </h3>
          <ol className="space-y-2 text-xs text-slate-300">
            {healthy_twin.recipe_steps.map((step, idx) => (
              <li key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-2.5">
                <span className="h-5 w-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-indigo-400" /> Required Twin Ingredients
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {healthy_twin.grocery_list.map((ing, idx) => (
              <li key={idx} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2">
                <Check className="h-3.5 w-3.5 text-brand-400" />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showWhyModal && (
        <WhyCravingModal
          why={why_analysis}
          foodName={junk_food.name}
          onClose={() => setShowWhyModal(false)}
        />
      )}
    </div>
  );
};
