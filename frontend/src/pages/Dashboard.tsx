import React, { useEffect, useState } from 'react';
import { Sparkles, Flame, DollarSign, Award, Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCraving } from '../context/CravingContext';
import { api } from '../services/api';
import { CravingLogOut } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { setActiveTwin } = useCraving();
  const [reminders, setReminders] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<CravingLogOut[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [remRes, historyRes] = await Promise.all([
          api.get('/coach/reminders'),
          api.get('/cravings/history')
        ]);
        setReminders(remRes.data.smart_reminders || []);
        setRecentLogs(historyRes.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-950/80 to-purple-950/60 border border-brand-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Nutrition Twin Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            Welcome back, {user?.full_name || 'Craving Crusher'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ready to satisfy your junk food cravings with healthy 90%+ taste similarity twins? Choose your craving and keep your <strong className="text-amber-400">{user?.current_streak || 5} day streak</strong> alive!
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('generator')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-brand-500/25 flex items-center space-x-2 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Healthy Twin Swap</span>
            </button>
            <button
              onClick={() => onNavigate('twin-mode')}
              className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition-all"
            >
              <span>Explore Twin Mode</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Streak</span>
            <Flame className="h-5 w-5 fill-amber-500 animate-bounce" />
          </div>
          <h3 className="text-2xl font-black text-white">{user?.current_streak || 5} Days</h3>
          <p className="text-[11px] text-slate-400">Longest: {user?.longest_streak || 12} days</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-brand-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Swaps</span>
            <ShieldCheck className="h-5 w-5 text-brand-400" />
          </div>
          <h3 className="text-2xl font-black text-white">{user?.total_swaps_completed || 14} Completed</h3>
          <p className="text-[11px] text-brand-400">High taste similarity match</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-indigo-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Calories Saved</span>
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-white">{(user?.total_calories_saved || 5840).toLocaleString()} kcal</h3>
          <p className="text-[11px] text-slate-400">Equivalent to ~1.6 lbs body fat</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Budget Saved</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-white">${(user?.total_money_saved || 84.50).toFixed(2)}</h3>
          <p className="text-[11px] text-emerald-400">Saved by choosing homemade twins</p>
        </div>
      </div>

      {/* ML Smart Reminders & Recent Craving Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Reminders (1 col) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-amber-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">ML Craving Forecast</h3>
          </div>
          <p className="text-xs text-slate-400">
            Scikit-learn model predictions based on your historical craving timestamps.
          </p>

          <div className="space-y-3">
            {reminders.length > 0 ? (
              reminders.map((rem, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>{rem.title}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-[10px]">{rem.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{rem.message}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">Loading smart predictions...</div>
            )}
          </div>
        </div>

        {/* Recent Craving Logs (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-400" /> Recent Craving Twin Swaps
            </h3>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-brand-400 font-semibold hover:underline"
            >
              View Full Analytics →
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{log.healthy_twin_name || log.craved_food}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {log.taste_similarity_score}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Original Craving: <span className="text-red-400 font-medium">{log.craved_food}</span> • Trigger: {log.craving_trigger}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-xs font-semibold">
                  <div className="text-right">
                    <span className="text-brand-400">-{Math.round(log.calories_saved)} kcal</span>
                    <div className="text-[10px] text-slate-400">${log.money_saved_usd.toFixed(2)} saved</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
