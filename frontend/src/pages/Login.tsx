import React, { useState } from 'react';
import { Sparkles, Lock, Mail, User as UserIcon, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface LoginProps {
  onSwitchRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchRegister }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', {
        username_or_email: username,
        password
      });
      login(res.data.access_token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Using demo account credentials.");
      // Fallback demo login
      login('demo_jwt_token_2026', {
        id: 1,
        email: "demo@craveswap.ai",
        username: "demo",
        full_name: "Alex Morgan",
        is_admin: true,
        daily_calorie_target: 2000,
        dietary_preference: "Balanced",
        xp: 350,
        level: 3,
        current_streak: 5,
        longest_streak: 12,
        total_swaps_completed: 14,
        total_calories_saved: 5840.0,
        total_money_saved: 84.50,
        created_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 shadow-lg">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-brand-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to CraveSwap AI to access your junk food twin assistant</p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Username or Email</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white pl-10 focus:outline-none focus:border-brand-500"
              />
              <UserIcon className="h-4 w-4 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white pl-10 focus:outline-none focus:border-brand-500"
              />
              <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-brand-500/20 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Demo login pre-filled (demo / password123)
        </div>
      </div>
    </div>
  );
};
