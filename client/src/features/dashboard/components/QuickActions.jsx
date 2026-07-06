import React from 'react';
import { Upload, Sparkles, Plus, Play, FileEdit, Search, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  const actions = [
    { title: 'Upload Resume', icon: Upload, href: '/resume', color: 'text-blue-500 dark:text-blue-400' },
    { title: 'Tailor Resume', icon: FileEdit, href: '/tailor', color: 'text-emerald-500 dark:text-emerald-400' },
    { title: 'Add Job', icon: Plus, href: '/jobs', color: 'text-fuchsia-500 dark:text-fuchsia-400' },
    { title: 'Mock Interview', icon: Play, href: '/interview', color: 'text-amber-500 dark:text-amber-400' },
    { title: 'Analyze Resume', icon: Sparkles, href: '/ai', color: 'text-purple-500 dark:text-purple-400' },
    { title: 'Semantic Search', icon: Search, href: '/memory', color: 'text-rose-500 dark:text-rose-400' },
    { title: 'My Applications', icon: BriefcaseIcon, href: '/jobs', color: 'text-indigo-500 dark:text-indigo-400' },
    { title: 'Resume Versions', icon: Layers, href: '/resume', color: 'text-slate-500 dark:text-slate-400' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col shadow-sm">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
      </div>
      
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="flex flex-col items-center justify-center p-2 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 group text-center"
              >
                <Icon className={`w-5 h-5 mb-2 ${action.color} group-hover:scale-110 transition-transform duration-200`} />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{action.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function BriefcaseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
