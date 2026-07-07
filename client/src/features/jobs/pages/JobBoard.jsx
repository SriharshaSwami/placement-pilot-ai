import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createJob, deleteJob } from '@/services/job.service.js';
import { getResumes } from '@/services/resume.service.js';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { EmptyState } from '@/components/feedback/EmptyState.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { Plus, Briefcase, Zap, MoreVertical, Edit, Copy, Trash2, Eye } from 'lucide-react';
import { classNames } from '@/utils/formatters.js';
import { useModal } from '@/contexts/ModalContext.jsx';
import toast from 'react-hot-toast';
import { EditJobModal } from '../components/EditJobModal.jsx';

export default function JobBoard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { confirm } = useModal();
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', role: '', description: '' });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const { data: resumesResponse, isLoading: isLoadingResumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: getResumes,
  });

  const resumes = resumesResponse?.data || [];
  const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];

  const { data: jobsResponse, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['jobs', primaryResume?._id],
    queryFn: () => getJobs(primaryResume?._id),
  });

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsAdding(false);
      setNewJob({ company: '', role: '', description: '' });
      toast.success('Job saved successfully.');
    },
    onError: (err) => toast.error('Failed to save job: ' + (err.response?.data?.message || err.message))
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.removeQueries({ queryKey: ['job', deletedId] });
      toast.success('Job deleted successfully.');
    },
    onError: (err) => toast.error('Failed to delete job: ' + (err.response?.data?.message || err.message))
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(newJob);
  };

  const handleDelete = async (e, job) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const confirmed = await confirm({
      title: 'Delete Job?',
      description: `Are you sure you want to delete the job for "${job.role}" at ${job.company}? Only the Job and its related temporary tailoring artifacts will be removed. Your resumes will remain completely untouched.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      isDestructive: true,
    });
    if (confirmed) {
      deleteMutation.mutate(job._id);
    }
  };

  const handleDuplicate = (e, job) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const duplicatedJob = {
      company: job.company,
      role: `${job.role} (Copy)`,
      description: job.description,
      location: job.location,
      jobType: job.jobType
    };
    createMutation.mutate(duplicatedJob);
  };

  const jobs = jobsResponse?.data || [];
  const isLoading = isLoadingJobs || isLoadingResumes;

  const renderMatchBadge = (score) => {
    if (score === undefined || score === null || score === 0) return null;
    let color = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    let label = 'Analyzed';
    if (score >= 0.7) {
      color = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400';
      label = 'Best Match';
    } else if (score >= 0.5) {
      color = 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400';
      label = 'Good Match';
    } else {
      color = 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400';
      label = 'Weak Match';
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${color}`}>
        <Zap className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

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
        <div className="space-y-4">
          {[1, 2, 3].map(i => <LoadingSkeleton key={i} />)}
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
                <div className="cursor-pointer flex-1" onClick={() => navigate(`/jobs/${job._id}`)}>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{job.role}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{job.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  {renderMatchBadge(job.similarityScore)}
                  
                  {/* Overflow Menu */}
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === job._id ? null : job._id); }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenuId === job._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 py-1 overflow-hidden">
                        <button 
                          onClick={() => navigate(`/jobs/${job._id}`)} 
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-slate-400" /> View Details
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setJobToEdit(job); setOpenMenuId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4 text-slate-400" /> Edit Job
                        </button>
                        <button 
                          onClick={(e) => handleDuplicate(e, job)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4 text-slate-400" /> Duplicate Job
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, job)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4 text-red-500/80" /> Delete Job
                        </button>
                      </div>
                    )}
                  </div>
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
      
      <EditJobModal 
        isOpen={!!jobToEdit} 
        onClose={() => setJobToEdit(null)} 
        job={jobToEdit} 
      />
    </div>
  );
}
