import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

export const PlacementProgressCard = ({ data }) => {
  // Dummy logic, replace with actual data
  const progressItems = [
    { label: "Resume", current: 2, total: 3, color: "bg-emerald-500" },
    { label: "Applications", current: 8, total: 20, color: "bg-blue-500" },
    { label: "Interviews", current: 2, total: 10, color: "bg-purple-500" },
    { label: "Mock Interviews", current: 3, total: 10, color: "bg-amber-500" },
    { label: "Skills Practiced", current: 6, total: 12, color: "bg-rose-500" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <Target className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Placement Progress</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your overall progress tracker</p>
          </div>
        </div>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {progressItems.map((item, index) => {
          const percentage = Math.round((item.current / item.total) * 100);
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.current}/{item.total}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${item.color} transition-all duration-500`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
