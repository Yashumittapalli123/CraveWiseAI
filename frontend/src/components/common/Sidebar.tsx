import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Split, 
  BarChart3, 
  Bot, 
  ShoppingBag, 
  Trophy, 
  ShieldCheck, 
  User as UserIcon 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'Craving Twin AI', icon: Sparkles, highlight: true },
    { id: 'twin-mode', label: 'Twin Mode Split', icon: Split },
    { id: 'analytics', label: 'Weekly Analytics', icon: BarChart3 },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'grocery', label: 'Grocery List', icon: ShoppingBag },
    { id: 'gamification', label: 'Achievements', icon: Trophy },
    { id: 'admin', label: 'Food Admin', icon: ShieldCheck },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-950/60 p-4 shrink-0">
      <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.highlight ? 'text-brand-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-brand-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
