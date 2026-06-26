import React from 'react';
import { Badge } from '@/components/ui/Badge.jsx';
import { Cpu, Shield, Award, Hourglass } from 'lucide-react';

export default function SessionHeader({ session }) {
  if (!session) return null;

  const { config, status } = session;
  const { type, difficulty, duration } = config || {};

  const getTypeColor = (type) => {
    switch (type) {
      case 'Technical': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'DSA': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'System Design': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Behavioral': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'HR': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white tracking-tight">AI Mock Interview</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 animate-pulse">
            Live Session
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Answer the questions clearly. The interviewer will guide you and ask follow-up questions naturally.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {type && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${getTypeColor(type)}`}>
            <Cpu className="w-3.5 h-3.5" />
            {type}
          </div>
        )}
        {difficulty && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${getDifficultyColor(difficulty)}`}>
            <Award className="w-3.5 h-3.5" />
            {difficulty}
          </div>
        )}
        {duration && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-800/40 text-slate-300 text-xs font-semibold">
            <Hourglass className="w-3.5 h-3.5 text-slate-400" />
            {duration} Min Limit
          </div>
        )}
      </div>
    </div>
  );
}
