import React from 'react';
import { FileSearch, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResumeInsightsCard = ({ data }) => {
  const navigate = useNavigate();
  const hasResume = data?.activeResume != null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <FileSearch className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Resume Insights</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI-powered suggestions</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/tailor')}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center">
        {!hasResume ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
              <FileSearch className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">No resume uploaded</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-[200px]">Upload your resume to get AI-powered insights and improvements.</p>
            <button 
              onClick={() => navigate('/resume')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-start gap-3 border border-slate-100 dark:border-slate-700/50">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">Missing measurable achievements</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add numbers to your experience section to increase impact.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-start gap-3 border border-slate-100 dark:border-slate-700/50">
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">ATS improvements available</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Optimize your keywords for Software Engineering roles.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
