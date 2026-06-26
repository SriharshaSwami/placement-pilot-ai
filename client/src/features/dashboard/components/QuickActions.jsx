import { UploadCloud, Sparkles, PlusCircle, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Upload Resume',
      description: 'Add a new resume for tracking',
      icon: UploadCloud,
      href: '/resume',
      color: 'bg-blue-500',
    },
    {
      title: 'Analyze Resume',
      description: 'Get AI feedback on your resume',
      icon: Sparkles,
      href: '/ai',
      color: 'bg-indigo-500',
    },
    {
      title: 'Add Job',
      description: 'Track a new job application',
      icon: PlusCircle,
      href: '/jobs',
      color: 'bg-emerald-500',
    },
    {
      title: 'Start Interview',
      description: 'Practice with AI interviewer',
      icon: PlayCircle,
      href: '/interview',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg p-6 dark:border dark:border-slate-800">
      <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="relative flex items-center space-x-3 rounded-lg border border-slate-300 bg-white px-6 py-5 shadow-sm hover:border-slate-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 transition-colors"
          >
            <div className={`flex-shrink-0 p-2 rounded-lg ${action.color} bg-opacity-10 dark:bg-opacity-20`}>
              <action.icon className={`h-6 w-6 ${action.color.replace('bg-', 'text-')}`} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-900 dark:text-white">{action.title}</p>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
