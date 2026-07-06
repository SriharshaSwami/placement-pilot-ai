import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Undo, Info } from 'lucide-react';
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
  });

  const { activePath, setActivePath } = useEditorContext();
  const suggestionsContainerRef = React.useRef(null);

  // Sync Scroll: When activePath changes (e.g. user clicked Canvas), 
  // scroll the corresponding AI suggestion into view
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
    // 1. Update status in backend
    updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'accepted' });
    
    // 2. Apply to editor state immediately
    onApplySuggestion(sug);
    
    toast.success('Suggestion applied to editor!');
  };

  const handleReject = (sug) => {
    updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'rejected' });
  };

  const handleUndo = (sug) => {
    updateStatusMutation.mutate({ sessionId: session._id, suggestionId: sug.id, status: 'pending' });
    // Note: Reverting the editor state is complex because they might have made manual edits after.
    // The user can just use the global Undo button in the editor.
    toast.success('Status reset. Use Editor Undo to revert changes.');
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

  const { suggestions } = session;
  const pendingCount = suggestions.filter(s => s.status === 'pending').length;

  return (
    <div ref={suggestionsContainerRef} className="h-full overflow-y-auto pr-2 pb-20 custom-scrollbar p-4 space-y-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">AI Suggestions Queue</h3>
        <p className="text-xs text-slate-500">{pendingCount} pending suggestions</p>
      </div>

      {suggestions.map((sug) => {
        const isSelected = activePath === sug.targetPath;
        return (
        <div 
          key={sug.id} 
          data-path={sug.targetPath}
          onClick={() => setActivePath(sug.targetPath)}
          className={`cursor-pointer transition-all bg-white dark:bg-slate-800 border ${isSelected ? 'ring-2 ring-primary-500 shadow-md border-transparent' : sug.status === 'accepted' ? 'border-green-500' : sug.status === 'rejected' ? 'border-red-500 opacity-50' : 'border-slate-200 dark:border-slate-700'} rounded-xl shadow-sm overflow-hidden`}
        >
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                {sug.section}
              </span>
            </div>
            <div className="flex space-x-1">
              {sug.status === 'pending' && (
                <>
                  <button onClick={() => handleReject(sug)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded" title="Reject">
                    <XCircle className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleAccept(sug)} className="p-1 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded" title="Accept & Apply">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </>
              )}
              {sug.status !== 'pending' && (
                <button
                  onClick={() => handleUndo(sug)}
                  className="flex items-center gap-1 text-[10px] font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded"
                >
                  <Undo className="w-3 h-3" /> Undo {sug.status}
                </button>
              )}
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Reason: {sug.reason}</p>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-700 text-xs font-mono mb-2 text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
              Target: {sug.targetPath}
            </div>

            <div className="mt-2 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-100 dark:border-green-800 text-xs">
              <span className="font-semibold text-green-700 dark:text-green-500 block mb-1">Suggested Change:</span>
              <span className="text-slate-700 dark:text-slate-300 italic">"{sug.suggestedContent}"</span>
            </div>
          </div>
        </div>
      )})}
    </div>
  );
};
