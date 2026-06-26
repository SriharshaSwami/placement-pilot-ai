import { useQuery } from '@tanstack/react-query';
import { getAnalyticsDashboard } from '@/services/analytics.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { TrendLineChart } from '../components/TrendLineChart.jsx';
import { FunnelChart } from '../components/FunnelChart.jsx';
import { Activity, Target, Zap, TrendingUp, AlertTriangle, Briefcase, Code, BookOpen } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['analyticsDashboard'],
    queryFn: () => getAnalyticsDashboard()
  });

  if (isLoading) return <LoadingSkeleton />;
  
  const analytics = analyticsRes?.data;
  if (!analytics) return <div className="text-center py-20">No analytics data found.</div>;

  const { currentScore, metrics, history, insights } = analytics;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader title="Placement Intelligence" description="Deep analytics and AI insights into your placement journey." />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-sm text-white relative overflow-hidden">
          <Activity className="absolute right-4 top-4 opacity-20 w-16 h-16" />
          <h3 className="text-indigo-100 text-sm font-medium">Readiness Score</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-bold">{currentScore}</span>
            <span className="text-indigo-200 ml-1">/100</span>
          </div>
        </div>
        
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center text-slate-500 mb-2"><Briefcase className="w-4 h-4 mr-2"/> Application Conversion</div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.applicationConversionRate}%</span>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center text-slate-500 mb-2"><Code className="w-4 h-4 mr-2"/> Coding Avg</div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.codingInterviewAvg}/100</span>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center text-slate-500 mb-2"><BookOpen className="w-4 h-4 mr-2"/> Roadmap Progress</div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.roadmapProgress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Readiness Trend (30 Days)</h3>
            <TrendLineChart data={history} />
          </div>

          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Application Pipeline Funnel</h3>
            <FunnelChart data={metrics.funnel} />
          </div>
        </div>

        {/* AI Insights Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">AI Strategy Report</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-green-600 dark:text-green-500 font-bold mb-1 flex items-center"><Target className="w-3 h-3 mr-1"/> Strongest Asset</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">{insights.strongestSkill}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-red-600 dark:text-red-500 font-bold mb-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Critical Bottleneck</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">{insights.biggestWeakness}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-500 font-bold mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> Most Improved</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">{insights.mostImprovedArea}</p>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <h4 className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold mb-2">Priority Action</h4>
                <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">{insights.suggestedNextAction}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">AI Classification</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              insights.predictedReadiness === 'Offer Ready' ? 'bg-green-100 text-green-700' :
              insights.predictedReadiness === 'Interview Ready' ? 'bg-blue-100 text-blue-700' :
              insights.predictedReadiness === 'Needs Polish' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>
              {insights.predictedReadiness}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
