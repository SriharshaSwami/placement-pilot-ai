import React from 'react';
import { CalendarDays, Video, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InterviewOverviewCard = ({ data }) => {
  const navigate = useNavigate();
  const upcomingInterviews = data?.upcomingInterviews || [];
  const completedInterviews = data?.completedInterviews || 0;
  
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <Video className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Interview Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your interview performance summary</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/interview')}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center">
        {completedInterviews === 0 && upcomingInterviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
              <CalendarDays className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">No interviews scheduled</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-[200px]">Keep applying and practicing with mock interviews.</p>
            <button 
              onClick={() => navigate('/interview')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Schedule Mock Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Avg. Score</p>
                <p className="text-xl font-bold text-emerald-500 dark:text-emerald-400">72%</p>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Confidence</p>
                <p className="text-xl font-bold text-blue-500 dark:text-blue-400">68%</p>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Communication</p>
                <p className="text-xl font-bold text-indigo-500 dark:text-indigo-400">75%</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Upcoming Interviews</h4>
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-3">
                  {upcomingInterviews.slice(0, 2).map((interview, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm">
                        <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{interview.company || 'Company'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{interview.date || 'To be scheduled'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming interviews scheduled.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
