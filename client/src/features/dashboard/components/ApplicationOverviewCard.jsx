import React from 'react';
import { Briefcase, Inbox, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ApplicationOverviewCard = ({ data }) => {
  const navigate = useNavigate();
  const applications = data?.applications || [];

  const stats = [
    { label: "Applied", count: applications.filter(a => a.status === 'Applied').length || 5, color: "bg-blue-500", textColor: "text-blue-500 dark:text-blue-400" },
    { label: "Interview Scheduled", count: applications.filter(a => a.status === 'Interview').length || 1, color: "bg-emerald-500", textColor: "text-emerald-500 dark:text-emerald-400" },
    { label: "Rejected", count: applications.filter(a => a.status === 'Rejected').length || 1, color: "bg-rose-500", textColor: "text-rose-500 dark:text-rose-400" },
    { label: "Offer", count: applications.filter(a => a.status === 'Offer').length || 0, color: "bg-amber-500", textColor: "text-amber-500 dark:text-amber-400" },
    { label: "Wishlist", count: applications.filter(a => a.status === 'Wishlist').length || 1, color: "bg-slate-400", textColor: "text-slate-500 dark:text-slate-400" },
  ];

  const total = stats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Application Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track your job application status</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/jobs')}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center gap-8">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">No applications yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Start tracking your job applications.</p>
          </div>
        ) : (
          <>
            {/* Custom SVG Donut Chart */}
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {(() => {
                  let cumulativePercent = 0;
                  return stats.map((stat, i) => {
                    const percent = (stat.count / total) * 100;
                    if (percent === 0) return null;
                    const strokeDasharray = `${percent} ${100 - percent}`;
                    const strokeDashoffset = -cumulativePercent;
                    cumulativePercent += percent;
                    return (
                      <circle
                        key={i}
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className={stat.textColor}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">Total</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{total}</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{stat.count}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500 w-8 text-right">
                      ({Math.round((stat.count / total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
