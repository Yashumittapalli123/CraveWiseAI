import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TasteProfile } from '../../types';

interface TasteRadarChartProps {
  junkTaste: TasteProfile;
  twinTaste: TasteProfile;
}

export const TasteRadarChart: React.FC<TasteRadarChartProps> = ({ junkTaste, twinTaste }) => {
  const data = [
    { subject: 'Sweetness', Junk: junkTaste.sweetness, Twin: twinTaste.sweetness },
    { subject: 'Savoriness', Junk: junkTaste.savoriness, Twin: twinTaste.savoriness },
    { subject: 'Crunchiness', Junk: junkTaste.crunchiness, Twin: twinTaste.crunchiness },
    { subject: 'Creaminess', Junk: junkTaste.creaminess, Twin: twinTaste.creaminess },
    { subject: 'Spiciness', Junk: junkTaste.spiciness, Twin: twinTaste.spiciness },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.15)" />
          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
          <Radar name="Junk Craving" dataKey="Junk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.35} />
          <Radar name="Healthy Twin" dataKey="Twin" stroke="#22c55e" fill="#22c55e" fillOpacity={0.45} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
