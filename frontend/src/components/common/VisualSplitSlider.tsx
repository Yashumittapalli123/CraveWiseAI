import React, { useState } from 'react';
import { Sparkles, Utensils } from 'lucide-react';
import { JunkFoodDetail, HealthyTwinDetail } from '../../types';

interface VisualSplitSliderProps {
  junkFood: JunkFoodDetail;
  healthyTwin: HealthyTwinDetail;
}

export const VisualSplitSlider: React.FC<VisualSplitSliderProps> = ({ junkFood, healthyTwin }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const junkImage = junkFood.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
  const twinImage = healthyTwin.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-red-400 flex items-center gap-1">
          <Utensils className="h-3.5 w-3.5" /> Original Junk Food ({junkFood.nutrition.calories} kcal)
        </span>
        <span className="text-brand-400 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" /> Healthy Twin ({healthyTwin.nutrition.calories} kcal)
        </span>
      </div>

      <div
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-800 shadow-2xl"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Healthy Twin Image (Background / Right Side) */}
        <img
          src={twinImage}
          alt={healthyTwin.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-500/30 text-brand-400 text-xs font-bold shadow-lg">
          Healthy Twin ({healthyTwin.taste_similarity_score}% Match)
        </div>

        {/* Junk Food Image (Foreground / Left Side with Clip Path) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src={junkImage}
            alt={junkFood.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30 text-red-400 text-xs font-bold shadow-lg">
            Craved Junk Food
          </div>
        </div>

        {/* Vertical Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="h-10 w-10 rounded-full bg-slate-950 border-2 border-white text-white flex items-center justify-center shadow-xl text-xs font-bold">
            ↔
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-slate-400">
        Drag slider left and right to inspect visual texture & ingredients comparison
      </p>
    </div>
  );
};
