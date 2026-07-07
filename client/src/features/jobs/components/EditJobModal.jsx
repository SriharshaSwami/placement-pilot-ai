import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJob } from '@/services/job.service.js';
import toast from 'react-hot-toast';

export const EditJobModal = ({ isOpen, onClose, job }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ company: '', role: '', description: '' });

  useEffect(() => {
    if (job && isOpen) {
      setFormData({
        company: job.company || '',
        role: job.role || '',
        description: job.description || '',
      });
    }
  }, [job, isOpen]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateJob(job._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', job._id] });
      toast.success('Job updated successfully.');
      onClose();
    },
    onError: (err) => {
      toast.error('Failed to update job: ' + (err.response?.data?.message || err.message));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-surface-light p-6 shadow-2xl dark:bg-surface-dark border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h3 className="text-xl font-semibold leading-6 text-slate-900 dark:text-white mb-6">
          Edit Job
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
              <input
                required
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <input
                required
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              required
              rows={12}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:text-white font-mono text-sm"
            />
          </div>
          
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface-light px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-surface-dark dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
