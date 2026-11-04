import React from 'react';
import { motion } from 'framer-motion';

interface GaugeProps {
  score: number; // 0 to 100
  label: string;
  size?: number;
}

export const HealthScoreGauge: React.FC<GaugeProps> = ({ score, label, size = 120 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // Green
    if (s >= 50) return '#f59e0b'; // Yellow/Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-white">{Math.round(score)}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">/100</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold text-slate-300">{label}</span>
    </div>
  );
};
