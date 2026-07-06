import React from 'react';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AICoachCard = () => {
  const navigate = useNavigate();

  const tips = [
    { type: 'warning', text: "Your resume is missing quantifiable achievements. Add metrics to improve impact." },
    { type: 'success', text: "React roles match your profile best. Focus more on frontend opportunities." },
    { type: 'error', text: "You haven't practiced DSA this week. Consistency is the key to improvement." },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col shadow-sm">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AI Coach</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3">
        {tips.slice(0, 3).map((tip, index) => {
          const colorClass = 
            tip.type === 'warning' ? 'text-amber-500 dark:text-amber-400' : 
            tip.type === 'success' ? 'text-emerald-500 dark:text-emerald-400' : 
            'text-rose-500 dark:text-rose-400';
            
          const bgClass = 
            tip.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' : 
            tip.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 
            'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';

          return (
            <div key={index} className={`border rounded-xl p-4 flex gap-3 items-start ${bgClass}`}>
              <MessageCircle className={`w-4 h-4 shrink-0 mt-0.5 ${colorClass}`} />
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {tip.text}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => navigate('/interview')}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          Ask AI Coach
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
