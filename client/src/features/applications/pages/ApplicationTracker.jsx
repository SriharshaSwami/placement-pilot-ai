import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApplications, createApplication } from '@/services/application.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { KanbanBoard } from '../components/KanbanBoard.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { Plus } from 'lucide-react';

export default function ApplicationTracker() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', role: '' });

  const { data: appsRes, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getApplications()
  });

  const createMutation = useMutation({
    mutationFn: (data) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsAdding(false);
      setNewApp({ company: '', role: '' });
    }
  });

  const handleAdd = (e) => {
    e.preventDefault();
    createMutation.mutate(newApp);
  };

  const applications = appsRes?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Application Tracker" description="Manage your job hunting pipeline." />
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          <Plus className="-ml-0.5 h-4 w-4" />
          Add Application
        </button>
      </div>

      {isAdding && (
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm max-w-xl">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
                <input required type="text" value={newApp.company} onChange={(e) => setNewApp({ ...newApp, company: e.target.value })} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <input required type="text" value={newApp.role} onChange={(e) => setNewApp({ ...newApp, role: e.target.value })} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:text-white" />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setIsAdding(false)} className="rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700">Cancel</button>
              <button type="submit" disabled={createMutation.isPending} className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500">Save</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <KanbanBoard applications={applications} />
      )}
    </div>
  );
}
