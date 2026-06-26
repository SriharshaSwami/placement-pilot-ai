import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createJob } from '@/services/job.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { EmptyState } from '@/components/feedback/EmptyState.jsx';
import { Plus, Briefcase } from 'lucide-react';
import { classNames } from '@/utils/formatters.js';

export default function JobBoard() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', role: '', description: '' });

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  });

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsAdding(false);
      setNewJob({ company: '', role: '', description: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(newJob);
  };

  const jobs = jobsResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Job Library" description="Manage job descriptions and tailor your resume" />
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          <Plus className="-ml-0.5 h-4 w-4" />
          Add Job
        </button>
      </div>

      {isAdding && (
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Add New Job Description</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
                <input
                  required
                  type="text"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <input
                  required
                  type="text"
                  value={newJob.role}
                  onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                required
                rows={8}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:text-white"
                placeholder="Paste the full job description here..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>)}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs added yet"
          description="Add a job description to start tailoring your resume."
          action={{ label: "Add Job", onClick: () => setIsAdding(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{job.role}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{job.company}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.keywords?.slice(0, 5).map(kw => (
                  <span key={kw} className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {kw}
                  </span>
                ))}
                {job.keywords?.length > 5 && (
                  <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    +{job.keywords.length - 5}
                  </span>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500">Added {new Date(job.createdAt).toLocaleDateString()}</span>
                {/* Note: In a real flow, you'd navigate to a Job Details page and then pick a resume to tailor. For now, we will add the button in the Job details or allow direct tailoring if they have a primary resume */}
                <a href={`/tailoring/job/${job._id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                  Tailor Resume &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
