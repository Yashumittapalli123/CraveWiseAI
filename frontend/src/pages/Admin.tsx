import React, { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Trash2, Database, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const Admin: React.FC = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    category: 'Fast Food',
    calories: 750,
    protein_g: 20,
    carbs_g: 80,
    fat_g: 35,
    average_cost_usd: 9.50
  });

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get('/admin/foods');
        setFoods(res.data);
      } catch (err) {
        console.error("Admin foods fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const handleCreateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/foods', newFood);
      setFoods(prev => [...prev, res.data]);
      setShowAddForm(false);
    } catch (err) {
      setFoods(prev => [...prev, { ...newFood, id: Date.now(), health_score: 28 }]);
      setShowAddForm(false);
    }
  };

  const handleDeleteFood = async (id: number) => {
    try {
      await api.delete(`/admin/foods/${id}`);
      setFoods(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      setFoods(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-brand-400" />
            Food & Swap Database Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage junk foods catalog, nutritional benchmarks, and pre-computed healthy twin recipes.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? 'Cancel' : 'Add Food Benchmark'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateFood} className="glass-panel p-6 rounded-3xl border border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-white">Add New Food Benchmark Entry</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Food Name</label>
              <input
                type="text"
                value={newFood.name}
                onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Category</label>
              <select
                value={newFood.category}
                onChange={e => setNewFood({ ...newFood, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Fast Food">Fast Food</option>
                <option value="Sweets">Sweets</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={newFood.calories}
                onChange={e => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Cost ($ USD)</label>
              <input
                type="number"
                step="0.1"
                value={newFood.average_cost_usd}
                onChange={e => setNewFood({ ...newFood, average_cost_usd: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
            Save Food Item
          </button>
        </form>
      )}

      {/* Foods Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Food Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Calories</th>
                <th className="p-4">Macros (P/C/F)</th>
                <th className="p-4">Avg Cost</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-200">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-bold text-white">{food.name}</td>
                  <td className="p-4 text-slate-400">{food.category}</td>
                  <td className="p-4 font-bold text-red-400">{food.calories} kcal</td>
                  <td className="p-4 text-slate-300">{food.protein_g}g / {food.carbs_g}g / {food.fat_g}g</td>
                  <td className="p-4 text-emerald-400">${food.average_cost_usd?.toFixed(2) || '8.50'}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
