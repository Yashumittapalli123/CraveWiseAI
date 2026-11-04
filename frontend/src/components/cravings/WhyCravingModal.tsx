import React from 'react';
import { Brain, Heart, Activity, Lightbulb, X } from 'lucide-react';
import { WhyCravingAnalysis } from '../../types';

interface WhyCravingModalProps {
  why: WhyCravingAnalysis;
  foodName: string;
  onClose: () => void;
}

export const WhyCravingModal: React.FC<WhyCravingModalProps> = ({ why, foodName, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Why Are You Craving {foodName}?
            </h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
              Root Cause: {why.primary_trigger}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
            <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-red-400" /> Psychological Driver
            </div>
            {why.explanation}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
            <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-indigo-400" /> Physiological Mechanism
            </div>
            {why.physiological_reason}
          </div>

          <div className="p-3.5 rounded-2xl bg-brand-950/30 border border-brand-500/30 text-xs leading-relaxed text-brand-300">
            <div className="font-semibold text-brand-400 mb-1 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-brand-400" /> Actionable AI Coach Tip
            </div>
            {why.actionable_tip}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
        >
          Got It, Show Me My Healthy Twin Swap!
        </button>
      </div>
    </div>
  );
};
