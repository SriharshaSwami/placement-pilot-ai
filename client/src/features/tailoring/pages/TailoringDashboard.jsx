import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  initiateTailoring,
  lookupSession,
  updateSuggestionStatus,
  batchUpdateSuggestions,
  saveTailoredResume
} from '@/services/tailoring.service.js';
import { getResumes } from '@/services/resume.service.js';
import { getJob } from '@/services/job.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { ATSScoreCard } from '@/features/ai/components/ATSScoreCard.jsx';
import { KeywordCoverage } from '@/features/ai/components/KeywordCoverage.jsx';
import { AnalysisSkeleton } from '@/features/ai/components/AnalysisSkeleton.jsx';
import { Tooltip } from '@/components/ui/Tooltip.jsx';
import { useModal } from '@/contexts/ModalContext.jsx';
import { diffText, diffList } from '@/utils/diff.js';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Info,
  Check,
  Undo,
  Save,
  CheckCheck,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TailoringDashboard() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { prompt } = useModal();
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' | 'preview'

  const { data: resumesResponse, isLoading: isLoadingResumes } = useQuery({ queryKey: ['resumes'], queryFn: getResumes });
  const { data: jobResponse, isLoading: isLoadingJob } = useQuery({ queryKey: ['job', jobId], queryFn: () => getJob(jobId) });

  const resumes = resumesResponse?.data || [];
  const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];
  const job = jobResponse?.data;

  // Attempt to lookup an existing session
  const { data: sessionResponse, isLoading: isLoadingLookup, refetch } = useQuery({
    queryKey: ['tailoringSession', jobId, primaryResume?._id],
    queryFn: () => lookupSession(jobId, primaryResume._id),
    enabled: !!primaryResume && !!jobId,
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: () => initiateTailoring(jobId, primaryResume._id),
    onSuccess: () => refetch(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ sessionId, suggestionId, status }) => updateSuggestionStatus(sessionId, suggestionId, status),
    onSuccess: () => {
      refetch();
      toast.success('Suggestion updated.');
    },
  });

  const batchStatusMutation = useMutation({
    mutationFn: ({ status }) => batchUpdateSuggestions(session._id, status),
    onSuccess: (_, variables) => {
      refetch();
      if (variables.status === 'pending') {
        toast.success('Draft reset successfully.');
      } else {
        toast.success(`All suggestions ${variables.status}.`);
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ title }) => saveTailoredResume(session._id, title),
    onSuccess: () => {
      toast.success('Tailored resume saved as new version.');
      navigate('/resumes');
    },
    onError: (err) => {
      toast.error('Failed to save version: ' + (err.response?.data?.message || err.message));
    }
  });

  useEffect(() => {
    if (primaryResume && job && !isLoadingLookup && sessionResponse && !sessionResponse.data && !generateMutation.isPending && !generateMutation.isError) {
      generateMutation.mutate();
    }
  }, [primaryResume, job, isLoadingLookup, sessionResponse, generateMutation]);

  if (isLoadingResumes || isLoadingJob) {
    return <AnalysisSkeleton />;
  }

  if (!primaryResume) {
    return <ErrorState message="No resumes found. Please upload a resume first." />;
  }

  if (generateMutation.isPending || isLoadingLookup) {
    return <AnalysisSkeleton />;
  }

  if (generateMutation.isError) {
    return <ErrorState message="Failed to generate tailoring suggestions. Ensure resume is parsed." onRetry={() => generateMutation.mutate()} />;
  }

  const session = sessionResponse?.data;
  if (!session) return <AnalysisSkeleton />;

  const { matchAnalysis, suggestions } = session;
  const originalSections = primaryResume?.parsedData?.sections || {};

  // Compute tailored sections based on accepted suggestions
  const getTailoredSections = () => {
    const sections = { ...originalSections };
    const acceptedSuggestions = suggestions.filter(s => s.status === 'accepted');

    for (const sug of acceptedSuggestions) {
      let matchedKey = null;
      for (const key of Object.keys(sections)) {
        if (key.toLowerCase().replace(/[^a-z]/g, '') === sug.section.toLowerCase().replace(/[^a-z]/g, '')) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        let currentText = sections[matchedKey] || '';
        if (sug.originalContent) {
          currentText = currentText.replace(sug.originalContent, sug.suggestedContent);
        } else {
          currentText += '\n' + sug.suggestedContent;
        }
        sections[matchedKey] = currentText;
      }
    }
    return sections;
  };

  const tailoredSections = getTailoredSections();
  const acceptedCount = suggestions.filter(s => s.status === 'accepted').length;

  const handleSaveVersion = async () => {
    const defaultTitle = `${primaryResume.title} (Tailored for ${job.company})`;
    const titleInput = await prompt({
      title: 'Save Tailored Resume',
      description: 'Enter a name for the new resume version:',
      defaultValue: defaultTitle,
      confirmLabel: 'Save Version',
      cancelLabel: 'Cancel'
    });
    if (titleInput) {
      saveMutation.mutate({ title: titleInput.trim() });
    }
  };

  const renderDiffContent = (sectionName, original, suggested) => {
    const isSkills = sectionName.toLowerCase().includes('skill');
    if (isSkills) {
      const { diffResult } = diffList(original, suggested);
      return (
        <div className="flex flex-wrap gap-1 text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          {diffResult.map((part, index) => {
            if (part.type === 'added') {
              return (
                <span key={index} className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 px-1.5 py-0.5 rounded font-medium">
                  + {part.value}
                </span>
              );
            } else if (part.type === 'removed') {
              return (
                <span key={index} className="bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 px-1.5 py-0.5 rounded opacity-80">
                  - {part.value}
                </span>
              );
            }
            return (
              <span key={index} className="text-slate-700 dark:text-slate-300 px-1.5 py-0.5">
                {part.value}
              </span>
            );
          })}
        </div>
      );
    } else {
      const diffResult = diffText(original, suggested);
      return (
        <div className="text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-wrap leading-relaxed">
          {diffResult.map((part, index) => {
            if (part.type === 'added') {
              return (
                <span key={index} className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 px-1 rounded font-medium">
                  {part.value}
                </span>
              );
            } else if (part.type === 'removed') {
              return (
                <span key={index} className="bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 rounded opacity-80">
                  {part.value}
                </span>
              );
            }
            return <span key={index} className="text-slate-700 dark:text-slate-300">{part.value}</span>;
          })}
        </div>
      );
    }
  };

  const confidenceExplanation = (
    <div className="space-y-1 text-left">
      <p className="font-semibold text-slate-200">What does Confidence mean?</p>
      <p className="text-[10px] text-slate-400">
        Confidence estimates how strongly PlacementPilot AI believes this suggestion will improve your resume for this specific job description. It is calculated using multiple factors including semantic similarity, keyword relevance, ATS impact, resume context, and AI certainty. It is not a guarantee of interview success.
      </p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/jobs')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <PageHeader title="AI Tailoring Workbench" description={`Tailoring ${primaryResume.title} for ${job.role} at ${job.company}`} />
        </div>
        {acceptedCount > 0 && (
          <button
            onClick={handleSaveVersion}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            Save as New Version ({acceptedCount})
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex space-x-6">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'suggestions' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-250'}`}
        >
          AI Suggestions ({suggestions.filter(s => s.status === 'pending').length} pending)
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'preview' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-250'}`}
        >
          Preview Tailored Resume ({acceptedCount} accepted)
        </button>
      </div>

      {activeTab === 'suggestions' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ATSScoreCard score={matchAnalysis.overallMatchPercent} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Risk Factors & Weaknesses</h3>
                <ul className="space-y-2">
                  {[...matchAnalysis.resumeWeaknesses, ...matchAnalysis.hiringRiskFactors].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <KeywordCoverage keywords={matchAnalysis.missingKeywords} />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Suggestions Queue</h2>
              
              {/* Batch Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => batchStatusMutation.mutate({ status: 'accepted' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Accept All
                </button>
                <button
                  onClick={() => batchStatusMutation.mutate({ status: 'rejected' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject All
                </button>
                <button
                  onClick={() => batchStatusMutation.mutate({ status: 'pending' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {suggestions.map((sug) => (
                <div key={sug.id} className={`bg-surface-light dark:bg-surface-dark border ${sug.status === 'accepted' ? 'border-green-500' : sug.status === 'rejected' ? 'border-red-500 opacity-50' : 'border-slate-200 dark:border-slate-800'} rounded-xl shadow-sm overflow-hidden`}>
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        {sug.section}
                      </span>
                      <span className="ml-3 text-sm font-semibold text-slate-900 dark:text-white">Priority: {sug.priority}</span>
                      <span className="ml-3 text-sm text-slate-500 inline-flex items-center gap-1">
                        Confidence: {sug.confidence}%
                        <Tooltip content={confidenceExplanation}>
                          <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                        </Tooltip>
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {sug.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'rejected' })} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md">
                            <XCircle className="h-5 w-5" />
                          </button>
                          <button onClick={() => updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'accepted' })} className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-md">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {sug.status !== 'pending' && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'pending' })}
                          className="flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded-md"
                        >
                          <Undo className="w-3.5 h-3.5" /> Undo {sug.status}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-4">Reason: {sug.reason}</p>
                    {renderDiffContent(sug.section, sug.originalContent, sug.suggestedContent)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-8">
          {Object.entries(originalSections).map(([sectionKey, origText]) => {
            const tailoredText = tailoredSections[sectionKey] || '';
            const hasChanges = origText !== tailoredText;
            return (
              <div key={sectionKey} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{sectionKey}</h3>
                  {hasChanges && (
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold">
                      Modified
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Original</h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg min-h-[60px]">
                      {origText}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tailored Preview</h4>
                    {hasChanges ? (
                      renderDiffContent(sectionKey, origText, tailoredText)
                    ) : (
                      <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg min-h-[60px]">
                        {origText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
