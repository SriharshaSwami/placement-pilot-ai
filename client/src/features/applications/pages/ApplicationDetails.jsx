import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApplication, generateInsights } from '@/services/application.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { Sparkles, Activity, AlertTriangle, Lightbulb } from 'lucide-react';

export default function ApplicationDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: appRes, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplication(id)
  });

  const insightsMutation = useMutation({
    mutationFn: () => generateInsights(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    }
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!appRes?.data) return <ErrorState message="Application not found" />;

  const app = appRes.data;
  const { aiInsights, statusHistory } = app;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <PageHeader 
          title={app.role} 
          description={app.company} 
          backTo="/applications"
        />
        <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-400">
          {app.stage}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Application Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Location:</span> <span className="text-slate-900 dark:text-white font-medium">{app.location || 'N/A'}</span></div>
              <div><span className="text-slate-500">Priority:</span> <span className="text-slate-900 dark:text-white font-medium">{app.priority}</span></div>
              <div><span className="text-slate-500">Applied On:</span> <span className="text-slate-900 dark:text-white font-medium">{app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'Unknown'}</span></div>
              <div><span className="text-slate-500">Deadline:</span> <span className="text-slate-900 dark:text-white font-medium">{app.deadline ? new Date(app.deadline).toLocaleDateString() : 'None'}</span></div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Status Timeline</h3>
              <div className="space-y-4">
                {statusHistory.map((status, idx) => (
                  <div key={idx} className="flex space-x-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 bg-primary-500 rounded-full mt-1.5"></div>
                      {idx !== statusHistory.length - 1 && <div className="h-full w-px bg-slate-200 dark:bg-slate-700 mt-2"></div>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{status.stage}</p>
                      <p className="text-xs text-slate-500">{new Date(status.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl p-6 shadow-sm text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center"><Sparkles className="w-5 h-5 mr-2" /> AI Insights</h3>
              <button
                onClick={() => insightsMutation.mutate()}
                disabled={insightsMutation.isPending}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
              >
                {insightsMutation.isPending ? 'Generating...' : 'Refresh'}
              </button>
            </div>
            
            {!aiInsights ? (
              <p className="text-sm text-primary-100">Click refresh to generate AI insights for this application.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-primary-100">Health Score</span>
                  <div className="text-3xl font-bold">{aiInsights.healthScore}/100</div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="text-xs font-semibold uppercase tracking-wider flex items-center mb-2"><Activity className="w-3 h-3 mr-1" /> Missing Actions</span>
                  <ul className="text-sm space-y-1">
                    {aiInsights.missingActions.map((action, i) => <li key={i}>• {action}</li>)}
                  </ul>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="text-xs font-semibold uppercase tracking-wider flex items-center mb-2"><Lightbulb className="w-3 h-3 mr-1" /> Suggestions</span>
                  <ul className="text-sm space-y-1">
                    {aiInsights.preparationSuggestions.map((sug, i) => <li key={i}>• {sug}</li>)}
                  </ul>
                </div>

                <div className="flex items-center space-x-2 text-sm mt-4 pt-4 border-t border-white/20">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Risk Level: <strong>{aiInsights.riskLevel}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
