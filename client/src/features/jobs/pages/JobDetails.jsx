import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJob, deleteJob, createJob } from '@/services/job.service.js';
import { useModal } from '@/contexts/ModalContext.jsx';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { EditJobModal } from '../components/EditJobModal.jsx';
import { ArrowLeft, Building2, MapPin, Briefcase, Calendar, Trash2, Edit, Copy, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { confirm } = useModal();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: jobResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    retry: 1, // Only retry once, if it's 404 it will fail fast
  });

  const job = jobResponse?.data;

  // Handle case where Job was deleted elsewhere
  useEffect(() => {
    if (isError && error?.response?.status === 404) {
      toast.error('Job no longer exists.');
      navigate('/jobs');
    }
  }, [isError, error, navigate]);

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.removeQueries({ queryKey: ['job', id] });
      toast.success('Job deleted successfully.');
      navigate('/jobs');
    },
    onError: (err) => toast.error('Delete failed: ' + (err.response?.data?.message || err.message))
  });

  const duplicateMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job duplicated successfully.');
      navigate(`/jobs/${res.data._id}`);
    },
    onError: (err) => toast.error('Failed to duplicate: ' + (err.response?.data?.message || err.message))
  });

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Job?',
      description: `Are you sure you want to delete the job for "${job?.role}" at ${job?.company}? Only the Job and its related temporary tailoring artifacts will be removed. Your resumes will remain completely untouched.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      isDestructive: true,
    });
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = () => {
    if (!job) return;
    const duplicatedJob = {
      company: job.company,
      role: `${job.role} (Copy)`,
      description: job.description,
      location: job.location,
      jobType: job.jobType
    };
    duplicateMutation.mutate(duplicatedJob);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-24 w-full" />
        <LoadingSkeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return <ErrorState message={error?.message || 'Failed to load job details'} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate('/jobs')}
            className="flex items-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Jobs
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            {job.role}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center"><Building2 className="w-4 h-4 mr-1.5 opacity-70"/> {job.company}</span>
            {job.location && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 opacity-70"/> {job.location}</span>}
            {job.jobType && <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 opacity-70"/> {job.jobType}</span>}
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 opacity-70"/> Added {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => navigate(`/tailoring/job/${job._id}`)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Tailor Resume
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button 
            onClick={handleDuplicate}
            disabled={duplicateMutation.isPending}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm font-semibold text-red-700 dark:text-red-400 shadow-sm ring-1 ring-inset ring-red-200 dark:ring-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main JD */}
        <div className="lg:col-span-2">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Job Description
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">
              {job.description}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-md font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Extracted Keywords
            </h3>
            {job.keywords && job.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.keywords.map(kw => (
                  <span key={kw} className="inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-900/20 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300 ring-1 ring-inset ring-primary-700/10 dark:ring-primary-900/30">
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No keywords extracted yet.</p>
            )}
          </div>

          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-md font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Required Skills
            </h3>
            {job.requiredSkills && job.requiredSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No specific skills extracted.</p>
            )}
          </div>
        </div>
      </div>

      <EditJobModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        job={job} 
      />
    </div>
  );
}
