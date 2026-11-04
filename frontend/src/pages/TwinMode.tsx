import React from 'react';
import { Sparkles, Utensils, CheckCircle2, Split } from 'lucide-react';
import { VisualSplitSlider } from '../components/common/VisualSplitSlider';
import { useCraving } from '../context/CravingContext';

interface TwinModeProps {
  onNavigate: (tab: string) => void;
}

export const TwinMode: React.FC<TwinModeProps> = ({ onNavigate }) => {
  const { activeTwin } = useCraving();

  if (!activeTwin) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-800">
        <div className="h-16 w-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
          <Split className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Twin Generated Yet</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please input a junk food craving in the Craving Twin AI tab first to unlock side-by-side Twin Mode visual comparison!
        </p>
        <button
          onClick={() => onNavigate('generator')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20"
        >
          Go to Craving Twin AI →
        </button>
      </div>
    );
  }

  const { junk_food, healthy_twin } = activeTwin;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Split className="h-6 w-6 text-brand-400" />
            Twin Mode – Visual & Macro Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare texture, visual aesthetics, and micro/macro nutrients side by side.
          </p>
        </div>
        <button
          onClick={() => onNavigate('generator')}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
        >
          ← Back to Generator
        </button>
      </div>

      {/* Visual Interactive Split Slider */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <VisualSplitSlider junkFood={junk_food} healthyTwin={healthy_twin} />
      </div>

      {/* Side-by-Side Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Junk Food Card */}
        <div className="glass-panel p-6 rounded-3xl border border-red-500/30 space-y-4 bg-red-950/10">
          <div className="flex justify-between items-center border-b border-red-500/20 pb-3">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <Utensils className="h-5 w-5" /> Craved Junk Food
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
              Health Score: {junk_food.nutrition.health_score}/100
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Name:</span>
              <strong className="text-white">{junk_food.name}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Calories:</span>
              <strong className="text-red-400">{junk_food.nutrition.calories} kcal</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Protein:</span>
              <strong className="text-white">{junk_food.nutrition.protein_g}g</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Carbs:</span>
              <strong className="text-white">{junk_food.nutrition.carbs_g}g</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Fat:</span>
              <strong className="text-red-400">{junk_food.nutrition.fat_g}g</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Cost:</span>
              <strong className="text-white">${junk_food.estimated_cost_usd.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Healthy Twin Card */}
        <div className="glass-panel p-6 rounded-3xl border border-brand-500/30 space-y-4 bg-brand-950/10">
          <div className="flex justify-between items-center border-b border-brand-500/20 pb-3">
            <h3 className="text-lg font-bold text-brand-400 flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Healthy Twin Swap
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold">
              Health Score: {healthy_twin.nutrition.health_score}/100
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Name:</span>
              <strong className="text-white">{healthy_twin.name}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Calories:</span>
              <strong className="text-brand-400">{healthy_twin.nutrition.calories} kcal (-{Math.round(activeTwin.calories_saved)})</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Protein:</span>
              <strong className="text-brand-400 font-bold">{healthy_twin.nutrition.protein_g}g (+{Math.round(healthy_twin.nutrition.protein_g - junk_food.nutrition.protein_g)}g)</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Carbs:</span>
              <strong className="text-white">{healthy_twin.nutrition.carbs_g}g</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Fat:</span>
              <strong className="text-brand-400">{healthy_twin.nutrition.fat_g}g</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Cost:</span>
              <strong className="text-indigo-400">${healthy_twin.estimated_cost_usd.toFixed(2)} (-${activeTwin.money_saved_usd.toFixed(2)})</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
