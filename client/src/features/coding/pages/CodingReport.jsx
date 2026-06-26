import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCodingSession } from '@/services/coding.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { ATSScoreCard } from '@/features/ai/components/ATSScoreCard.jsx';
import { AnalysisSection } from '@/features/ai/components/AnalysisSection.jsx';
import { CheckCircle, AlertTriangle, Lightbulb, Clock, Database } from 'lucide-react';
import { MonacoEditorWrapper } from '../components/MonacoEditorWrapper.jsx';

export default function CodingReport() {
  const { id } = useParams();

  const { data: sessionRes, isLoading } = useQuery({
    queryKey: ['coding', id],
    queryFn: () => getCodingSession(id)
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!sessionRes?.data) return <ErrorState message="Session not found" />;

  const session = sessionRes.data;
  const { evaluation, question, config } = session;

  if (session.status !== 'Completed' || !evaluation) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Evaluation Pending</h2>
        <Link to={`/coding/workspace/${id}`} className="bg-primary-600 text-white px-4 py-2 rounded-md">Return to Workspace</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Coding Assessment Report" 
        description={`Performance analysis for ${question.title}`}
        backTo="/coding"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <ATSScoreCard score={evaluation.overallScore} />
          
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Complexity Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Clock className="w-4 h-4 mr-2" /> Time</div>
                <div className="text-sm font-mono text-primary-600 dark:text-primary-400 font-bold">{evaluation.timeComplexity}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Database className="w-4 h-4 mr-2" /> Space</div>
                <div className="text-sm font-mono text-primary-600 dark:text-primary-400 font-bold">{evaluation.spaceComplexity}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Sub-Scores</h3>
            <div className="space-y-3">
              {[
                { label: 'Correctness', score: evaluation.correctness },
                { label: 'Efficiency', score: evaluation.complexity },
                { label: 'Readability', score: evaluation.readability },
                { label: 'Edge Cases', score: evaluation.edgeCases },
                { label: 'Communication', score: evaluation.communication },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{stat.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{stat.score}/10</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ideal Approach</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {evaluation.idealApproach}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalysisSection title="Strengths" icon={CheckCircle} items={evaluation.strengths} />
            <AnalysisSection title="Weaknesses" icon={AlertTriangle} items={evaluation.weaknesses} />
          </div>

          <AnalysisSection title="Recommended Improvements" icon={Lightbulb} items={evaluation.recommendedImprovements} />

          <div className="mt-8 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
             <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
               <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Your Submission</h3>
               <span className="text-xs uppercase font-mono font-bold text-slate-500">{config.language}</span>
             </div>
             {/* Read-only editor wrapper for review */}
             <div className="pointer-events-none opacity-90 h-[400px]">
                <MonacoEditorWrapper language={config.language} code={session.submittedCode} onChange={() => {}} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
