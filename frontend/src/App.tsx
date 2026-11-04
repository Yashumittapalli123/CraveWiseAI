import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CravingProvider } from './context/CravingContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CravingTwin } from './pages/CravingTwin';
import { TwinMode } from './pages/TwinMode';
import { Analytics } from './pages/Analytics';
import { Coach } from './pages/Coach';
import { Grocery } from './pages/Grocery';
import { Gamification } from './pages/Gamification';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';

const MainContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-brand-400 font-bold text-sm">
        Loading CraveSwap AI...
      </div>
    );
  }

  if (!user) {
    return <Login onSwitchRegister={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === 'generator' && <CravingTwin onNavigate={setActiveTab} />}
          {activeTab === 'twin-mode' && <TwinMode onNavigate={setActiveTab} />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'coach' && <Coach />}
          {activeTab === 'grocery' && <Grocery />}
          {activeTab === 'gamification' && <Gamification />}
          {activeTab === 'admin' && <Admin />}
          {activeTab === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CravingProvider>
          <MainContent />
        </CravingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
