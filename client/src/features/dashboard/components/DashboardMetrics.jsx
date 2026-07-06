import React from 'react';
import { User, FileText, Activity, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const DashboardMetrics = ({ data }) => {
  const profileCompletion = data?.profileCompletion || 65;
  const activeResume = data?.activeResume || 'None uploaded';
  const stage = data?.stage || 'Good';
  
  // Find last activity for display
  const lastActivity = data?.recentActivity?.[0];
  const lastActivityText = lastActivity ? formatDistanceToNow(new Date(lastActivity.date), { addSuffix: true }) : 'No recent activity';
  const lastActivityTitle = lastActivity ? lastActivity.title : 'Start preparing';

  const metrics = [
    {
      title: 'Profile Completion',
      value: `${profileCompletion}%`,
      subtitle: 'Almost there! Complete your profile.',
      icon: User,
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      title: 'Active Resume',
      value: activeResume,
      subtitle: 'Updated 2 days ago',
      icon: FileText,
      color: 'text-indigo-500 dark:text-indigo-400',
    },
    {
      title: 'Placement Readiness',
      value: stage,
      subtitle: "You're making steady progress!",
      icon: Activity,
      color: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      title: 'Last Activity',
      value: lastActivityText,
      subtitle: lastActivityTitle,
      icon: Clock,
      color: 'text-rose-500 dark:text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-start gap-4 h-full">
            <div className={`p-2.5 rounded-full bg-slate-50 dark:bg-slate-800/50 ${metric.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{metric.title}</h3>
              <p className="text-base font-semibold text-slate-900 dark:text-white truncate mb-1" title={metric.value}>{metric.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{metric.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
