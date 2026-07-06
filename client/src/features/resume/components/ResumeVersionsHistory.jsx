import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResumeVersions, restoreResumeVersion } from '@/services/resume.service.js';
import { formatDistanceToNow } from 'date-fns';
import { History, CheckCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResumeVersionsHistory = ({ resumeId, currentVersionId }) => {
  const queryClient = useQueryClient();
  const [restoringId, setRestoringId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['resume-versions', resumeId],
    queryFn: () => getResumeVersions(resumeId),
  });

  const restoreMutation = useMutation({
    mutationFn: (versionId) => restoreResumeVersion(resumeId, versionId),
    onSuccess: () => {
      toast.success('Version restored successfully');
      queryClient.invalidateQueries({ queryKey: ['resume-versions', resumeId] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      // Invalidate the current resume query to refresh the primary state
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
      setRestoringId(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to restore version');
      setRestoringId(null);
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>;
  }

  const versions = data?.data || [];
  if (versions.length <= 1) return null; // No history to show if only 1 version

  const handleRestore = (versionId) => {
    setRestoringId(versionId);
    restoreMutation.mutate(versionId);
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-slate-500" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Version History</h3>
      </div>
      
      <div className="space-y-4">
        {versions.map((version) => {
          const isCurrent = version.isPrimary;
          
          return (
            <div 
              key={version._id}
              className={`p-4 rounded-lg border text-sm transition-colors ${
                isCurrent 
                  ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800' 
                  : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">
                      Version {version.version}
                    </span>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        <CheckCircle className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                  </div>
                  {version.jobId && version.jobId.company && (
                    <div className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                      Tailored for: {version.jobId.company}
                    </div>
                  )}
                  {version.tailoringSummary && (
                    <div className="text-slate-500 dark:text-slate-400 mt-1 italic text-xs">
                      {version.tailoringSummary}
                    </div>
                  )}
                </div>
                
                {!isCurrent && (
                  <button
                    onClick={() => handleRestore(version._id)}
                    disabled={restoringId === version._id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {restoringId === version._id ? 'Restoring...' : 'Restore'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
