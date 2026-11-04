import React, { useState } from 'react';
import { Sparkles, Flame, Smile, Frown, AlertCircle, Loader2 } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { VisionUploader } from './VisionUploader';

interface CravingInputFormProps {
  onSubmitCraving: (food: string, mood: string, intensity: number) => void;
  loading: boolean;
}

export const CravingInputForm: React.FC<CravingInputFormProps> = ({ onSubmitCraving, loading }) => {
  const [foodText, setFoodText] = useState('');
  const [mood, setMood] = useState('Stressed');
  const [intensity, setIntensity] = useState(7);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  const popularCravings = ['Pepperoni Pizza', 'Double Cheeseburger', 'French Fries', 'Chocolate Fudge Ice Cream', 'Spicy Tacos', 'Glazed Donuts'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodText.trim()) return;
    onSubmitCraving(foodText, mood, intensity);
  };

  return (
    <div className="w-full glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-400" />
            What Junk Food are you Craving right now?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your craving to analyze root causes and generate your 90%+ taste similarity healthy twin!
          </p>
        </div>

        {/* Input Type Selector */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'text' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Text / Voice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'image' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Camera AI
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'text' ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={foodText}
                onChange={(e) => setFoodText(e.target.value)}
                placeholder="e.g. Pepperoni Pizza, Cheeseburger, Chocolate Ice Cream..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>
            <VoiceRecorder onTranscript={(text) => setFoodText(text)} />
          </div>
        ) : (
          <VisionUploader onDetectedFood={(foodName) => setFoodText(foodName)} />
        )}

        {/* Quick Suggestions Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium py-1">Quick Picks:</span>
          {popularCravings.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFoodText(item)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-brand-500/50 hover:text-brand-400 transition-colors"
            >
              + {item}
            </button>
          ))}
        </div>

        {/* Mood & Intensity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Mood / State
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="Stressed">😫 Stressed / Work Overload</option>
              <option value="Tired">🥱 Tired / Lack of Sleep</option>
              <option value="Bored">🥱 Bored / Sensory Seeking</option>
              <option value="Sad">😢 Emotional / Low Mood</option>
              <option value="Hungry">🤤 Intense Physical Hunger</option>
              <option value="Neutral">😐 Neutral</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Craving Intensity (1 - 10)
              </label>
              <span className="text-xs font-bold text-amber-400">{intensity}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !foodText.trim()}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-amber-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-brand-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing Craving Triggers & Cooking Twin...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Generate My Junk Food Twin Swap</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
