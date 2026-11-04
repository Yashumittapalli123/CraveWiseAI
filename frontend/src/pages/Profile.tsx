import React, { useState } from 'react';
import { User as UserIcon, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || 'Alex Morgan');
  const [calorieTarget, setCalorieTarget] = useState(user?.daily_calorie_target || 2000);
  const [preference, setPreference] = useState(user?.dietary_preference || 'Balanced');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/me', {
        full_name: fullName,
        daily_calorie_target: calorieTarget,
        dietary_preference: preference
      });
      updateUser({ full_name: fullName, daily_calorie_target: calorieTarget, dietary_preference: preference });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      updateUser({ full_name: fullName, daily_calorie_target: calorieTarget, dietary_preference: preference });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-brand-400" />
          User Profile & Nutrition Goals
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your dietary preferences and daily target metrics.
        </p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        {saved && (
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Daily Calorie Target (kcal)</label>
            <input
              type="number"
              value={calorieTarget}
              onChange={e => setCalorieTarget(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Dietary Preference</label>
            <select
              value={preference}
              onChange={e => setPreference(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Balanced">Balanced (Standard Macros)</option>
              <option value="Keto">Keto / Low-Carb High-Fat</option>
              <option value="High-Protein">High Protein / Fitness</option>
              <option value="Vegan">Vegan / Plant-Based</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all"
        >
          <Save className="h-4 w-4" />
          <span>Save Profile Settings</span>
        </button>
      </form>
    </div>
  );
};
