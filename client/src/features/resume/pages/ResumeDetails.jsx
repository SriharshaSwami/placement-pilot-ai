import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { ResumeParserStatus } from '../components/ResumeParserStatus.jsx';
import { ResumeParsingProgress } from '../components/ResumeParsingProgress.jsx';
import { ParsingErrorCard } from '../components/ParsingErrorCard.jsx';
import { ParsingSummary } from '../components/ParsingSummary.jsx';
import { ResumeSectionViewer } from '../components/ResumeSectionViewer.jsx';
import { ResumeVersionsHistory } from '../components/ResumeVersionsHistory.jsx';
import { getResume, parseResume } from '@/services/resume.service.js';
import { ArrowLeft, Play } from 'lucide-react';

const ResumeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => getResume(id),
  });

  const parseMutation = useMutation({
    mutationFn: () => parseResume(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
    },
  });

  const resume = data?.data;
  const parsedData = resume?.parsedData;
  const metadata = parsedData?.metadata;
  const isPending = metadata?.parsingStatus === 'pending' || !parsedData;

  useEffect(() => {
    // Auto-trigger parsing if it's pending, but don't retry continuously on error
    if (resume && isPending && !parseMutation.isPending && !parseMutation.isError && !parseMutation.isSuccess) {
      parseMutation.mutate();
    }
  }, [resume, isPending, parseMutation.isPending, parseMutation.isError, parseMutation.isSuccess, parseMutation]);

  if (isLoading) return <LoadingSkeleton className="h-64 w-full" />;
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;
  if (!resume) return <ErrorState message="Resume not found" />;

  const handleManualParse = () => parseMutation.mutate();

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title={resume.title || "Untitled Resume"} 
        description={`Last updated on ${new Date(resume.updatedAt).toLocaleDateString()}`}
        backTo="/resume"
        actions={
          <ResumeParserStatus status={metadata?.parsingStatus} />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {parseMutation.isPending || (isPending && !metadata?.failureReason) ? (
            <ResumeParsingProgress />
          ) : metadata?.parsingStatus === 'failed' ? (
            <ParsingErrorCard errorReason={metadata.failureReason} onRetry={handleManualParse} />
          ) : (
            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Structured Resume Data</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleManualParse}
                    disabled={parseMutation.isPending}
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-white dark:bg-slate-800 px-2.5 py-1.5 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    <Play className="-ml-0.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                    Reparse
                  </button>
                  <Link
                    to={`/resume/${id}/preview`}
                    className="inline-flex items-center rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Preview ATS Layout
                  </Link>
                  <Link
                    to={`/resume/${id}/analysis`}
                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
                  >
                    View AI Analysis
                  </Link>
                </div>
              </div>
              <ResumeSectionViewer sections={parsedData?.sections} />
            </div>
          )}

          {/* Version History Component */}
          <ResumeVersionsHistory 
            resumeId={resume._id || id} 
            currentVersionId={resume._id || id} 
          />
        </div>

        <div className="space-y-8">
          <ParsingSummary metadata={metadata} />
          
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Original PDF</h3>
            {resume.cloudinaryUrl && (
              <a
                href={resume.cloudinaryUrl.replace('/upload/', '/upload/f_jpg,pg_1,w_1600,q_auto/')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
              >
                View Original Doc
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
