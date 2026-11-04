import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NutritionBreakdown } from '../../types';

interface MacroComparisonChartProps {
  junkNutrition: NutritionBreakdown;
  twinNutrition: NutritionBreakdown;
}

export const MacroComparisonChart: React.FC<MacroComparisonChartProps> = ({ junkNutrition, twinNutrition }) => {
  const data = [
    { name: 'Calories (kcal)', Junk: junkNutrition.calories, Twin: twinNutrition.calories },
    { name: 'Protein (g)', Junk: junkNutrition.protein_g, Twin: twinNutrition.protein_g },
    { name: 'Carbs (g)', Junk: junkNutrition.carbs_g, Twin: twinNutrition.carbs_g },
    { name: 'Fat (g)', Junk: junkNutrition.fat_g, Twin: twinNutrition.fat_g },
    { name: 'Fiber (g)', Junk: junkNutrition.fiber_g, Twin: twinNutrition.fiber_g },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="Junk" fill="#ef4444" radius={[6, 6, 0, 0]} name="Craved Junk Food" />
          <Bar dataKey="Twin" fill="#22c55e" radius={[6, 6, 0, 0]} name="Healthy Twin" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
