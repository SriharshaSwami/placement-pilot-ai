import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInterview } from '@/services/interview.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { ATSScoreCard } from '@/features/ai/components/ATSScoreCard.jsx';
import { AnalysisSection } from '@/features/ai/components/AnalysisSection.jsx';
import { Star, AlertTriangle, Lightbulb, BookOpen, ShieldAlert, HeartHandshake, TrendingUp, Loader2 } from 'lucide-react';
import React, { Suspense, lazy } from 'react';

const RadarChartMetrics = lazy(() => import('../components/RadarChartMetrics.jsx'));
const AnswerTimeline = lazy(() => import('../components/AnswerTimeline.jsx'));
const CoachingDashboard = lazy(() => import('../components/CoachingDashboard.jsx'));

export default function InterviewResults() {
  const { id } = useParams();

  const { data: sessionRes, isLoading } = useQuery({
    queryKey: ['interview', id],
    queryFn: () => getInterview(id),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!sessionRes?.data) return <ErrorState message="Results not found" />;

  const session = sessionRes.data;
  const { summary, questions, coachingReport } = session;

  if (session.status !== 'Completed' || !summary) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Interview Not Finished</h2>
        <Link to={`/interview/session/${id}`} className="bg-primary-600 text-white px-4 py-2 rounded-md">Return to Session</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <PageHeader 
        title="Mock Interview Report" 
        description={`Detailed AI analysis for your ${session.config?.type} Interview with ${session.config?.persona} (${session.config?.company}).`} 
        backTo="/interview"
      />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <ATSScoreCard score={summary.overallScore} />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Coach&apos;s Summary</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {summary.overallPerformance}
            </p>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Interview Readiness:</span>
              <span className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-bold ${
                summary.interviewReadiness === 'Strong Hire' || summary.interviewReadiness === 'Ready'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                {summary.interviewReadiness}
              </span>
            </div>
           </div>
        </div>
      </div>

      {/* Categorized Feedback Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnalysisSection title="Top Strengths" icon={Star} items={summary.topStrengths} />
        <AnalysisSection title="Hiring Signals" icon={HeartHandshake} items={summary.hiringSignals} />
        <AnalysisSection title="Excellent Answers" icon={TrendingUp} items={summary.excellentAnswers} />
        
        <AnalysisSection title="Weakest Areas" icon={AlertTriangle} items={summary.weakestAreas} />
        <AnalysisSection title="Critical Mistakes" icon={ShieldAlert} items={summary.criticalMistakes} />
        <AnalysisSection title="Missed Opportunities" icon={Lightbulb} items={summary.missedOpportunities} />
      </div>

      <Suspense fallback={<div className="mt-12"><LoadingSkeleton /></div>}>
        <div className="mt-12 mb-8">
          <RadarChartMetrics summary={summary} />
        </div>

        {/* Topics and Roadmaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalysisSection title="Topics to Study" icon={BookOpen} items={summary.topicsToStudy} />
          <AnalysisSection title="Learning Roadmap" icon={TrendingUp} items={summary.learningRoadmap} />
        </div>

        {/* Chronological Timeline */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <AnswerTimeline questions={questions} coachingReport={coachingReport} />
        </div>

        {/* AI Coaching Dashboard */}
        <CoachingDashboard coachingReport={coachingReport} />
      </Suspense>
    </div>
  );
}
