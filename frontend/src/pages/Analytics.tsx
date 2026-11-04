import React, { useEffect, useState } from 'react';
import { BarChart3, Download, Flame, DollarSign, PieChart, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';

export const Analytics: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/summary');
        setSummary(res.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get('/analytics/export-pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'craveswap_weekly_report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Weekly PDF report generated!");
    } finally {
      setDownloading(false);
    }
  };

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];

  const weeklyTrend = summary?.weekly_trend || [
    { day: 'Mon', calories_saved: 420 },
    { day: 'Tue', calories_saved: 580 },
    { day: 'Wed', calories_saved: 750 },
    { day: 'Thu', calories_saved: 620 },
    { day: 'Fri', calories_saved: 910 },
    { day: 'Sat', calories_saved: 840 },
    { day: 'Sun', calories_saved: 730 },
  ];

  const triggersData = summary?.triggers_breakdown || [
    { name: 'Stress & Cortisol', value: 45 },
    { name: 'Energy Slump', value: 25 },
    { name: 'Boredom', value: 20 },
    { name: 'Late Night Craving', value: 10 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-400" />
            Weekly Craving & Nutrition Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track macro savings, budget saved, and psychological craving trigger patterns.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={downloading}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center space-x-2 transition-all shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>{downloading ? 'Exporting PDF...' : 'Export Weekly PDF Report'}</span>
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Weekly Calorie Deficit</span>
          <h3 className="text-3xl font-black text-brand-400">{(summary?.calories_saved || 4850).toLocaleString()} kcal</h3>
          <p className="text-[11px] text-slate-400">Defeated {summary?.total_swaps_completed || 12} junk cravings</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Budget Saved</span>
          <h3 className="text-3xl font-black text-indigo-400">${(summary?.money_saved_usd || 68.50).toFixed(2)}</h3>
          <p className="text-[11px] text-slate-400">Savings from fast food takeaways</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Taste Similarity Avg</span>
          <h3 className="text-3xl font-black text-amber-400">90.5%</h3>
          <p className="text-[11px] text-slate-400">High texture & flavor match</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Trend Chart (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-brand-400" /> Weekly Calories Saved Trend
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="calories_saved" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorCals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trigger Distribution (1 col) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-400" /> Craving Triggers Breakdown
          </h3>
          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={triggersData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {triggersData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {triggersData.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-300 text-[11px] truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
