import React from 'react';
import { Activity, Clock, FileText, Briefcase, Video, Sparkles, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ActivityTimeline = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'resume': return <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      case 'job': return <Briefcase className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
      case 'interview': return <Video className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
      case 'ai': return <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
      default: return <Activity className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'resume': return 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
      case 'job': return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
      case 'interview': return 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
      case 'ai': return 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  // Dummy data if empty
  const timeline = activities.length > 0 ? activities : [
    { id: 1, type: 'resume', title: 'Resume analyzed', description: 'Your resume score is 72%', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 2, type: 'job', title: 'Applied to Frontend Developer at TCS', description: '', date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { id: 3, type: 'interview', title: 'Mock interview completed', description: 'React Developer Mock Interview', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: 4, type: 'resume', title: 'Resume updated', description: 'Software Engineer Resume.pdf', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col shadow-sm max-h-[400px]">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Activity className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
        </div>
        <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
          See all
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div className="space-y-6">
            {timeline.map((activity, index) => (
              <div key={activity.id || index} className="flex gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border z-10 ${getIconBg(activity.type)}`}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 pt-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-0.5">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{activity.title}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{activity.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
