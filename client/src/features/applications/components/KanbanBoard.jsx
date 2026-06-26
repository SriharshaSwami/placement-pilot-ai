import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplication } from '@/services/application.service.js';
import { Building2 } from 'lucide-react';

const STAGES = ['Saved', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'];

export function KanbanBoard({ applications }) {
  const queryClient = useQueryClient();

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }) => updateApplication(id, { stage }),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });
      const previousApps = queryClient.getQueryData(['applications']);
      
      queryClient.setQueryData(['applications'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(app => app._id === id ? { ...app, stage } : app)
        };
      });

      return { previousApps };
    },
    onError: (err, newApp, context) => {
      queryClient.setQueryData(['applications'], context.previousApps);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('appId', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('appId');
    if (id) {
      updateStageMutation.mutate({ id, stage: targetStage });
    }
  };

  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = applications.filter(app => app.stage === stage);
    return acc;
  }, {});

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
      {STAGES.map(stage => (
        <div
          key={stage}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage)}
          className="flex-shrink-0 w-80 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 snap-center border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{stage}</h3>
            <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs py-1 px-2 rounded-full font-medium">
              {grouped[stage].length}
            </span>
          </div>

          <div className="space-y-3 min-h-[500px]">
            {grouped[stage].map(app => (
              <div
                key={app._id}
                draggable
                onDragStart={(e) => handleDragStart(e, app._id)}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:border-primary-500 transition-colors group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {app.role}
                  </h4>
                </div>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <Building2 className="h-3.5 w-3.5 mr-1" />
                  <span className="truncate">{app.company}</span>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-slate-400">{new Date(app.updatedAt).toLocaleDateString()}</span>
                  <a href={`/applications/${app._id}`} className="text-xs font-medium text-primary-600 hover:text-primary-500">View</a>
                </div>
              </div>
            ))}
            {grouped[stage].length === 0 && (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 text-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Drop here</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
