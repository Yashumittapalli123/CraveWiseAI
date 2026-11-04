import React, { useEffect, useState } from 'react';
import { ShoppingBag, Check, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { GroceryItem } from '../types';

export const Grocery: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const fetchGrocery = async () => {
      try {
        const res = await api.get('/grocery/');
        setItems(res.data);
      } catch (err) {
        console.error("Grocery fetch error:", err);
      }
    };
    fetchGrocery();
  }, []);

  const handleToggle = async (id: number) => {
    try {
      const res = await api.put(`/grocery/${id}/toggle`);
      setItems(prev => prev.map(item => item.id === id ? res.data : item));
    } catch (err) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const res = await api.post('/grocery/', { ingredient_name: newItemName, category: 'Custom' });
      setItems(prev => [...prev, res.data]);
      setNewItemName('');
    } catch (err) {
      const customItem: GroceryItem = {
        id: Date.now(),
        ingredient_name: newItemName,
        category: 'Custom',
        checked: false
      };
      setItems(prev => [...prev, customItem]);
      setNewItemName('');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/grocery/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-brand-400" />
          Healthy Twin Grocery Checklist
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Auto-populated ingredient checklist for your generated healthy twin recipes.
        </p>
      </div>

      {/* Add custom item form */}
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add custom ingredient (e.g. Almond Milk, Greek Yogurt)..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </form>

      {/* Items List */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No grocery items yet. Generate a healthy twin recipe to add ingredients!
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                item.checked
                  ? 'bg-slate-950/40 border-slate-850 opacity-60'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                onClick={() => handleToggle(item.id)}
                className="flex items-center space-x-3 cursor-pointer flex-1"
              >
                <div className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-colors ${
                  item.checked ? 'bg-brand-500 border-brand-500 text-slate-950' : 'border-slate-600'
                }`}>
                  {item.checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>

                <div>
                  <span className={`text-xs font-semibold ${item.checked ? 'line-through text-slate-400' : 'text-white'}`}>
                    {item.ingredient_name}
                  </span>
                  {item.from_recipe && (
                    <div className="text-[10px] text-brand-400">From: {item.from_recipe}</div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
