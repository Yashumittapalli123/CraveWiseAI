import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SubstitutionItem } from '../../types';

interface SubstitutionListProps {
  substitutions: SubstitutionItem[];
}

export const SubstitutionList: React.FC<SubstitutionListProps> = ({ substitutions }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-brand-400" />
        Ingredient-by-Ingredient Substitution Engine
      </h3>
      <div className="grid grid-cols-1 gap-2.5">
        {substitutions.map((sub, index) => (
          <div
            key={index}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-red-400 line-through flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> {sub.original}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-brand-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-400" /> {sub.substitute}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Benefit: {sub.benefit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
