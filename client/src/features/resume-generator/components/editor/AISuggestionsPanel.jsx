import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Undo, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { lookupSession, updateSuggestionStatus } from '@/services/tailoring.service.js';
import { useEditorContext } from '../../contexts/EditorContext.jsx';
import { Tooltip } from '@/components/ui/Tooltip.jsx';
import toast from 'react-hot-toast';

export const AISuggestionsPanel = ({ resume, onApplySuggestion }) => {
  const queryClient = useQueryClient();
  const jobId = resume?.jobId;
  const resumeId = resume?._id;

  const { data: sessionResponse, isLoading, isError } = useQuery({
    queryKey: ['tailoringSession', jobId, resumeId],
    queryFn: () => lookupSession(jobId, resumeId),
    enabled: !!jobId && !!resumeId,
    refetchInterval: (data) => {
      // Poll every 3 seconds if not completed/failed
      const status = data?.data?.generationStatus;
      if (status && status !== 'completed' && status !== 'failed') return 3000;
      return false;
    }
  });

  const { activePath, setActivePath } = useEditorContext();
  const suggestionsContainerRef = React.useRef(null);
  
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  React.useEffect(() => {
    if (activePath && suggestionsContainerRef.current) {
      const activeElement = suggestionsContainerRef.current.querySelector(`[data-path="${activePath}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activePath]);

  const session = sessionResponse?.data;
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ sessionId, suggestionId, status }) => updateSuggestionStatus(sessionId, suggestionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['tailoringSession', jobId, resumeId]);
    },
    onError: () => {
      toast.error('Failed to update suggestion status');
    }
  });

  const handleAccept = (sug) => {
    updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'accepted' });
    onApplySuggestion(sug);
    toast.success('Suggestion applied to editor!');
  };

  const handleReject = (sug) => {
    updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'rejected' });
  };

  const handleUndo = (sug) => {
    updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'pending' });
    toast.success('Status reset. Use Editor Undo to revert changes.');
  };

  const handleAcceptSection = (section, suggestions) => {
    const pending = suggestions.filter(s => s.status === 'pending');
    pending.forEach(sug => {
      updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'accepted' });
      onApplySuggestion(sug);
    });
    if (pending.length > 0) toast.success(`Applied ${pending.length} suggestions in ${section}!`);
  };

  const handleRejectSection = (section, suggestions) => {
    const pending = suggestions.filter(s => s.status === 'pending');
    pending.forEach(sug => {
      updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'rejected' });
    });
    if (pending.length > 0) toast.success(`Rejected ${pending.length} suggestions in ${section}.`);
  };

  if (!jobId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500">
        <p>No active tailoring session found.</p>
        <p className="text-xs mt-2">Tailor this resume to a job to see AI suggestions here.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4 text-slate-500 text-sm animate-pulse">Loading AI suggestions...</div>;
  }

  if (!session && !isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500">
        <p>No active tailoring session found.</p>
        <p className="text-xs mt-2">Generate a session from the Dashboard to see AI suggestions here.</p>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500 text-sm">Could not load suggestions.</div>;
  }

  // Handle generation progress
  if (session.generationStatus && session.generationStatus !== 'completed' && session.generationStatus !== 'failed') {
    const stages = [
      { id: 'analyzing_jd', label: 'Analyzing Job Description...' },
      { id: 'extracting_profile', label: 'Building Candidate Profile...' },
      { id: 'gap_analysis', label: 'Performing Gap Analysis...' },
      { id: 'generating_resume', label: 'Creating Tailored Resume...' },
      { id: 'validating', label: 'Validating Resume...' },
      { id: 'comparing_diff', label: 'Comparing With Original Resume...' },
      { id: 'preparing_suggestions', label: 'Preparing Suggestions...' }
    ];
    
    let currentIndex = stages.findIndex(s => s.id === session.generationStatus);
    if (currentIndex === -1) currentIndex = 0; // fallback

    return (
      <div className="flex flex-col p-6 h-full text-slate-800 dark:text-slate-200">
        <h3 className="text-lg font-bold mb-6">Tailoring in Progress</h3>
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isPast = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={stage.id} className={`flex items-center space-x-3 text-sm font-medium transition-colors ${isPast ? 'text-green-600 dark:text-green-400' : isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-600'}`}>
                {isPast ? (
                  <CheckCircle className="w-5 h-5" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-current opacity-50" />
                )}
                <span>{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  if (session.generationStatus === 'failed') {
    return (
      <div className="p-6 text-red-500 text-sm text-center">
        Tailoring failed. Please try generating again.
      </div>
    );
  }

  const { suggestions } = session;
  const pendingCount = suggestions.filter(s => s.status === 'pending').length;

  // Group suggestions by section
  const groupedSuggestions = suggestions.reduce((acc, sug) => {
    if (!acc[sug.section]) acc[sug.section] = [];
    acc[sug.section].push(sug);
    return acc;
  }, {});

  return (
    <div ref={suggestionsContainerRef} className="h-full overflow-y-auto pr-2 pb-20 custom-scrollbar p-4 space-y-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">AI Suggestions</h3>
        <p className="text-xs text-slate-500">{pendingCount} pending suggestions</p>
      </div>

      {Object.entries(groupedSuggestions).map(([section, sugs]) => {
        const isExpanded = expandedSections[section] !== false; // default true
        const sectionPending = sugs.filter(s => s.status === 'pending').length;

        return (
          <div key={section} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
            {/* Section Header */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
              <button onClick={() => toggleSection(section)} className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{section}</span>
                {sectionPending > 0 && (
                  <span className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 text-[10px] px-2 py-0.5 rounded-full">
                    {sectionPending} pending
                  </span>
                )}
              </button>
              
              {sectionPending > 0 && (
                <div className="flex space-x-2">
                  <button onClick={() => handleRejectSection(section, sugs)} className="text-[10px] font-semibold bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 px-2 py-1 rounded">
                    Reject All
                  </button>
                  <button onClick={() => handleAcceptSection(section, sugs)} className="text-[10px] font-semibold bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 px-2 py-1 rounded">
                    Accept All
                  </button>
                </div>
              )}
            </div>

            {/* Section Content */}
            {isExpanded && (
              <div className="p-3 space-y-3 bg-slate-50/50 dark:bg-slate-800/50">
                {sugs.map((sug) => {
                  const isSelected = activePath === sug.targetPath;
                  return (
                    <div 
                      key={sug.id} 
                      data-path={sug.targetPath}
                      onClick={() => setActivePath(sug.targetPath)}
                      className={`cursor-pointer transition-all bg-white dark:bg-slate-800 border ${isSelected ? 'ring-2 ring-primary-500 shadow-md border-transparent' : sug.status === 'accepted' ? 'border-green-500' : sug.status === 'rejected' ? 'border-red-500 opacity-50' : 'border-slate-200 dark:border-slate-700'} rounded-lg shadow-sm overflow-hidden`}
                    >
                      <div className="px-3 py-2 flex justify-between items-start border-b border-slate-100 dark:border-slate-700/50">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 pr-4 mt-1 leading-relaxed">
                          {sug.reason}
                        </p>
                        <div className="flex space-x-1 shrink-0">
                          {sug.status === 'pending' && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); handleReject(sug); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition-colors" title="Reject">
                                <XCircle className="h-4 w-4" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleAccept(sug); }} className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-slate-700 rounded transition-colors" title="Accept & Apply">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {sug.status !== 'pending' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUndo(sug); }}
                              className="flex items-center gap-1 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 px-2 py-1 rounded transition-colors"
                            >
                              <Undo className="w-3 h-3" /> Undo
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="px-3 py-2">
                        <div className="bg-green-50/50 dark:bg-green-900/10 p-2 rounded border border-green-100 dark:border-green-800/50 text-xs">
                          <span className="text-slate-800 dark:text-slate-200">{sug.suggestedContent}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
