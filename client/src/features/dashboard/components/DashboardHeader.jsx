import React from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const DashboardHeader = () => {
  const { user } = useAuth();
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="text-xl">👋</span> {greeting}, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Let's continue your placement journey. You're doing great!
        </p>
      </div>

      <div>
        <Link 
          to="/roadmap"
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          View Placement Roadmap
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
