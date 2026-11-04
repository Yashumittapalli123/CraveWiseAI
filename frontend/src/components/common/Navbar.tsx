import React from 'react';
import { Flame, Award, Sun, Moon, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 py-3 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-brand-500/20">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-brand-500 animate-pulse" />
          </div>
        </div>
        <div>
          <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
            CraveSwap AI
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
            Junk Food Twin
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <>
            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold shadow-inner">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{user.current_streak} Day Streak</span>
            </div>

            {/* XP Level */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
              <Award className="h-4 w-4 text-indigo-400" />
              <span>Lvl {user.level} ({user.xp} XP)</span>
            </div>
          </>
        )}

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
            {user?.full_name ? user.full_name.charAt(0) : 'A'}
          </div>
          <span className="hidden lg:inline-block text-xs font-medium text-slate-300">
            {user?.full_name || 'Demo User'}
          </span>
        </div>
      </div>
    </nav>
  );
};
