import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInterview } from '@/services/interview.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { ATSScoreCard } from '@/features/ai/components/ATSScoreCard.jsx';
import { AnalysisSection } from '@/features/ai/components/AnalysisSection.jsx';
import { Star, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react';

export default function InterviewResults() {
  const { id } = useParams();

  const { data: sessionRes, isLoading } = useQuery({
    queryKey: ['interview', id],
    queryFn: () => getInterview(id),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!sessionRes?.data) return <ErrorState message="Results not found" />;

  const session = sessionRes.data;
  const { summary } = session;

  if (session.status !== 'Completed' || !summary) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Interview Not Finished</h2>
        <Link to={`/interview/session/${id}`} className="bg-primary-600 text-white px-4 py-2 rounded-md">Return to Session</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader title="Mock Interview Results" description="Detailed analysis of your performance." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ATSScoreCard score={summary.overallScore} />
        </div>
        <div className="lg:col-span-2">
           <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Summary</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {summary.overallPerformance}
            </p>
            <div className="mt-6 flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Readiness:</span>
              <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-sm font-medium text-blue-700 dark:text-blue-400">
                {summary.interviewReadiness}
              </span>
            </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnalysisSection title="Top Strengths" icon={Star} items={summary.topStrengths} />
        <AnalysisSection title="Weakest Areas" icon={AlertTriangle} items={summary.weakestAreas} />
      </div>

      <AnalysisSection title="Topics to Study" icon={BookOpen} items={summary.topicsToStudy} />
      <AnalysisSection title="Actionable Recommendations" icon={Lightbulb} items={summary.personalizedRecommendations} />
    </div>
  );
}
