import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { analyzeResume, getResumeAnalysis } from '@/services/ai.service.js';
import { getResume } from '@/services/resume.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { ATSScoreCard } from '../components/ATSScoreCard.jsx';
import { AnalysisSection } from '../components/AnalysisSection.jsx';
import { KeywordCoverage } from '../components/KeywordCoverage.jsx';
import { AnalysisSkeleton } from '../components/AnalysisSkeleton.jsx';
import { ArrowLeft, Star, AlertTriangle, Lightbulb, Briefcase, GraduationCap, FolderDot } from 'lucide-react';

const ResumeAnalysisDashboard = () => {
  const { id: resumeId } = useParams();

  // Fetch the resume to make sure it's parsed
  const { data: resumeData, isLoading: isLoadingResume } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId),
  });

  const resume = resumeData?.data;
  const isParsed = resume?.parsedData?.metadata?.parsingStatus === 'success';

  // Fetch existing analysis if any
  const { data: analysisData, isLoading: isLoadingAnalysis, refetch } = useQuery({
    queryKey: ['resumeAnalysis', resumeId],
    queryFn: () => getResumeAnalysis(resumeId),
    retry: false, // Don't retry if 404
  });

  const analysisMutation = useMutation({
    mutationFn: () => analyzeResume(resumeId),
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    // If we have a parsed resume but NO analysis, and we aren't currently loading or mutating, trigger it
    if (resume && isParsed && !analysisData && !isLoadingAnalysis && !analysisMutation.isPending && !analysisMutation.isError) {
      analysisMutation.mutate();
    }
  }, [resume, isParsed, analysisData, isLoadingAnalysis, analysisMutation]);

  if (isLoadingResume) return <AnalysisSkeleton />;
  if (!resume) return <ErrorState message="Resume not found" />;

  if (!isParsed) {
    return (
      <div className="py-12 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Resume Needs Parsing</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          This resume has not been parsed into structured data yet. AI analysis requires structured data.
        </p>
        <Link
          to={`/resume/${resumeId}`}
          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          Go to Parser
        </Link>
      </div>
    );
  }

  if (analysisMutation.isPending || isLoadingAnalysis) {
    return <AnalysisSkeleton />;
  }

  if (analysisMutation.isError) {
    return (
      <ErrorState 
        message={analysisMutation.error?.response?.data?.message || 'Failed to analyze resume'} 
        onRetry={() => analysisMutation.mutate()} 
      />
    );
  }

  const analysis = analysisData?.data;
  if (!analysis) return null;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center space-x-4 mb-2">
        <PageHeader 
          title="Resume Analysis" 
          description="Detailed AI analysis of your resume formatting and content."
          backTo={`/resume/${resumeId}`}
        />
      </div>

      {/* Top Section: Score and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ATSScoreCard score={analysis.atsScore} />
        </div>
        <div className="lg:col-span-2 flex flex-col justify-center">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Executive Summary</h3>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Strengths, Weaknesses, Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnalysisSection title="Top Strengths" icon={Star} items={analysis.strengths} />
        <AnalysisSection title="Critical Weaknesses" icon={AlertTriangle} items={analysis.weaknesses} />
      </div>

      <KeywordCoverage keywords={analysis.missingKeywords} />

      {/* Recommendations */}
      <AnalysisSection title="Actionable Recommendations" icon={Lightbulb} items={analysis.recommendations} />

      {/* Detailed Section Feedback */}
      <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Section Feedback</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalysisSection title="Experience Feedback" icon={Briefcase} items={analysis.experienceFeedback} type="feedback" />
          <AnalysisSection title="Project Feedback" icon={FolderDot} items={analysis.projectFeedback} type="feedback" />
          <div className="lg:col-span-2">
            <AnalysisSection title="Education Feedback" icon={GraduationCap} items={analysis.educationFeedback} type="feedback" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisDashboard;
