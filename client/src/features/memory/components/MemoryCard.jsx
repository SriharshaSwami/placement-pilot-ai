import { Brain, Trash2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

export function MemoryCard({ memory, onDelete }) {
  const categoryColors = {
    Career: 'text-indigo-600 bg-indigo-50',
    Skill: 'text-blue-600 bg-blue-50',
    Resume: 'text-emerald-600 bg-emerald-50',
    Interview: 'text-purple-600 bg-purple-50',
    Coding: 'text-cyan-600 bg-cyan-50',
    Learning: 'text-yellow-600 bg-yellow-50',
    Preference: 'text-pink-600 bg-pink-50',
    Behavior: 'text-orange-600 bg-orange-50',
    Goal: 'text-rose-600 bg-rose-50',
    General: 'text-slate-600 bg-slate-50'
  };

  const colorClass = categoryColors[memory.category] || categoryColors.General;

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm group hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${colorClass}`}>
          {memory.category}
        </span>
        <button 
          onClick={() => onDelete(memory._id)}
          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete Fact (Permanent)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-900 dark:text-white font-medium mb-4">{memory.fact}</p>

      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 flex items-center"><Brain className="w-3 h-3 mr-1"/> Importance</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{memory.importance}/10</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(memory.importance / 10) * 100}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 flex items-center"><ShieldAlert className="w-3 h-3 mr-1"/> Confidence</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{memory.confidence}/10</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(memory.confidence / 10) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
        <span>Source: {memory.source}</span>
        <span>{format(new Date(memory.createdAt), 'MMM d, yyyy')}</span>
      </div>
    </div>
  );
}
