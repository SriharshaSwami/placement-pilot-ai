import React from 'react';
import { Sparkles, ArrowRight, Target, BrainCircuit, Upload, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TodayFocusCard = ({ data }) => {
  const navigate = useNavigate();
  const hasResume = data?.activeResume != null;

  // Generate a list of recommendations
  const recommendations = hasResume ? [
    { title: "Analyze your resume", subtitle: "Get AI feedback and improve your resume score", icon: Sparkles, action: () => navigate('/ai'), buttonText: "Analyze", color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: "Practice DSA", subtitle: "Maintain your coding streak and solve problems", icon: BrainCircuit, action: () => navigate('/interview'), buttonText: "Practice", color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { title: "Apply to relevant jobs", subtitle: "You have 12 recommended jobs", icon: Briefcase, action: () => navigate('/jobs'), buttonText: "View Jobs", color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { title: "Take a mock interview", subtitle: "Improve your confidence and communication", icon: Target, action: () => navigate('/interview'), buttonText: "Start", color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ] : [
    { title: "Upload your resume", subtitle: "Start your journey by adding a resume", icon: Upload, action: () => navigate('/resume'), buttonText: "Upload", color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Today's Focus</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Recommended for you today</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 space-y-6">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div key={index} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${rec.bg}`}>
                  <Icon className={`w-5 h-5 ${rec.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{rec.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-[200px]">{rec.subtitle}</p>
                </div>
              </div>
              <button 
                onClick={rec.action}
                className="shrink-0 px-4 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                {rec.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
          View All Recommendations
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
