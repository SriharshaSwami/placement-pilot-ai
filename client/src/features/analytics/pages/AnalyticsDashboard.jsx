import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalyticsDashboard, getRecommendations } from '@/services/analytics.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { TrendLineChart, BasicBarChart, BasicPieChart } from '../components/DashboardCharts.jsx';
import { Filter, BarChart2, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/feedback/EmptyState.jsx';

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30d');
  const navigate = useNavigate();

  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['analyticsDashboard', timeframe],
    queryFn: () => getAnalyticsDashboard(timeframe)
  });

  const { data: recommendationsRes } = useQuery({
    queryKey: ['analyticsRecommendations'],
    queryFn: getRecommendations
  });

  if (isLoading) return <LoadingSkeleton />;
  
  const analytics = analyticsRes?.data;
  if (!analytics || (
    !analytics.interviewTrend?.length && 
    !analytics.atsTrend?.length && 
    !analytics.resumeVersions?.length && 
    !analytics.interviewsByCompany?.length && 
    !analytics.skillsNeedingImprovement?.length && 
    !analytics.applicationsByStatus?.length
  )) {
    return (
      <div className="space-y-8 pb-12">
        <PageHeader title="Placement Analytics" description="Track your progress with real-time data insights." />
        <EmptyState
          icon={BarChart2}
          title="No analytics data available"
          description="Complete your first interview or upload a resume to generate insights."
          action={{ label: "Start Interview", onClick: () => navigate('/interview') }}
        />
      </div>
    );
  }

  const { 
    interviewTrend, 
    atsTrend, 
    resumeVersions, 
    interviewsByCompany, 
    skillsNeedingImprovement, 
    applicationsByStatus 
  } = analytics;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <PageHeader title="Placement Analytics" description="Track your progress with real-time data insights." />
        
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
          <Filter className="w-4 h-4 text-slate-500 ml-2" />
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none py-1 pr-2 cursor-pointer dark:text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recommendations Section */}
        {recommendationsRes?.data && recommendationsRes.data.length > 0 && (
          <div className="col-span-1 lg:col-span-2 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 flex items-center mb-4">
              <Lightbulb className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              AI Insights
            </h3>
            <ul className="space-y-3">
              {recommendationsRes.data.map((rec, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold mr-3 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Interview Score Trend */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Interview Score Trend</h3>
          {interviewTrend && interviewTrend.length > 0 ? (
            <TrendLineChart data={interviewTrend} dataKey="score" name="Avg Score" color="#8884d8" />
          ) : (
            <p className="text-slate-500 text-center py-10">No interview data available.</p>
          )}
        </div>

        {/* ATS Score Trend */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">ATS Score Trend</h3>
          {atsTrend && atsTrend.length > 0 ? (
            <TrendLineChart data={atsTrend} dataKey="score" name="Avg ATS Score" color="#82ca9d" />
          ) : (
            <p className="text-slate-500 text-center py-10">No ATS data available.</p>
          )}
        </div>

        {/* Resume Versions Over Time */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Resume Versions Uploaded</h3>
          {resumeVersions && resumeVersions.length > 0 ? (
            <BasicBarChart data={resumeVersions} xKey="date" yKey="count" name="Versions" color="#FFBB28" />
          ) : (
            <p className="text-slate-500 text-center py-10">No resume data available.</p>
          )}
        </div>

        {/* Job Applications by Status */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Job Applications by Status</h3>
          {applicationsByStatus && applicationsByStatus.length > 0 ? (
            <BasicPieChart data={applicationsByStatus} nameKey="status" dataKey="count" />
          ) : (
            <p className="text-slate-500 text-center py-10">No applications data available.</p>
          )}
        </div>

        {/* Interview Count by Company */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Interviews by Company</h3>
          {interviewsByCompany && interviewsByCompany.length > 0 ? (
            <BasicBarChart data={interviewsByCompany} xKey="company" yKey="count" name="Interviews" color="#FF8042" />
          ) : (
            <p className="text-slate-500 text-center py-10">No company interview data available.</p>
          )}
        </div>

        {/* Skills Needing Improvement */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Skills Needing Improvement</h3>
          {skillsNeedingImprovement && skillsNeedingImprovement.length > 0 ? (
            <BasicBarChart data={skillsNeedingImprovement} xKey="skill" yKey="count" name="Occurrences" color="#0088FE" />
          ) : (
            <p className="text-slate-500 text-center py-10">No skills data available.</p>
          )}
        </div>

      </div>
    </div>
  );
}
