import React, { useEffect, useState } from 'react';
import { Trophy, Award, Flame, Zap, ShieldCheck, DollarSign, Star, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Gamification: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/gamification/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Gamification fetch error:", err);
      }
    };
    fetchStats();
  }, []);

  const achievementsList = stats?.achievements || [
    { badge_key: "FIRST_SWAP", title: "First Swap", description: "Completed your first healthy twin swap!", icon: "Zap", unlocked: true },
    { badge_key: "STREAK_5", title: "5-Day Warrior", description: "Maintained a 5-day healthy swap streak!", icon: "Flame", unlocked: true },
    { badge_key: "CALORIES_5000", title: "Calorie Crusher", description: "Saved over 5,000 junk food calories!", icon: "ShieldCheck", unlocked: true },
    { badge_key: "BUDGET_SAVER", title: "Wallet Saver", description: "Saved $50+ by choosing homemade twins!", icon: "DollarSign", unlocked: true },
    { badge_key: "TWIN_MASTER", title: "Twin Master", description: "Tried 10 unique junk food twin recipes!", icon: "Trophy", unlocked: false }
  ];

  const currentLevel = user ? 1 + Math.floor(user.xp / 100) : 3;
  const xpInLevel = user ? user.xp % 100 : 50;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-400" />
          Healthy Swap Achievements & Levels
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Earn XP, level up, maintain your swap streak, and unlock exclusive culinary badges!
        </p>
      </div>

      {/* Level & XP Progress Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-amber-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 p-0.5 shadow-xl">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl text-amber-400">
                Lvl {currentLevel}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Master Swapper</h2>
              <p className="text-xs text-slate-400">{user?.xp || 350} Total Experience Points (XP)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
            <Flame className="h-4 w-4 fill-amber-500" />
            <span>{user?.current_streak || 5} Day Streak Active!</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Level {currentLevel} Progress</span>
            <span className="text-amber-400">{xpInLevel} / 100 XP</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-amber-500 rounded-full transition-all duration-1000"
              style={{ width: `${(xpInLevel / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-400" /> Unlocked Badges & Milestones
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievementsList.map((badge: any, idx: number) => (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-2xl border transition-all flex items-start space-x-4 ${
                badge.unlocked
                  ? 'border-brand-500/30 bg-slate-900/90 shadow-lg shadow-brand-500/10'
                  : 'border-slate-850 bg-slate-950/40 opacity-50'
              }`}
            >
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {badge.unlocked ? <Star className="h-6 w-6 fill-white" /> : <Lock className="h-5 w-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                  {badge.unlocked && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 font-semibold">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
