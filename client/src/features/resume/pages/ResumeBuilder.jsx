import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/PageHeader.jsx';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { UploadZone } from '../components/UploadZone.jsx';
import { UploadProgress } from '../components/UploadProgress.jsx';
import { ResumeList } from '../components/ResumeList.jsx';
import { useModal } from '@/contexts/ModalContext.jsx';
import toast from 'react-hot-toast';
import {
  getResumes,
  uploadResume,
  deleteResume,
  setPrimaryResume,
  renameResume,
} from '@/services/resume.service.js';

const ResumeBuilder = () => {
  const queryClient = useQueryClient();
  const { confirm, prompt } = useModal();
  const [uploadState, setUploadState] = useState(null); // { progress, error, fileName }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['resumes'],
    queryFn: getResumes,
  });

  const uploadMutation = useMutation({
    mutationFn: (file) =>
      uploadResume(file, null, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadState((prev) => ({ ...prev, progress: percentCompleted }));
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume uploaded successfully.');
      setTimeout(() => setUploadState(null), 3000); // Clear after 3s
    },
    onError: (err) => {
      setUploadState((prev) => ({
        ...prev,
        error: err.response?.data?.message || err.message,
      }));
      toast.error('Upload failed: ' + (err.response?.data?.message || err.message));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted successfully.');
    },
    onError: (err) => toast.error('Delete failed: ' + (err.response?.data?.message || err.message))
  });

  const primaryMutation = useMutation({
    mutationFn: setPrimaryResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Primary resume updated.');
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }) => renameResume(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume renamed successfully.');
    },
    onError: (err) => toast.error('Rename failed: ' + (err.response?.data?.message || err.message))
  });

  const handleFileSelected = (file) => {
    setUploadState({ progress: 0, error: null, fileName: file.name });
    uploadMutation.mutate(file);
  };

  const handleRename = async (resume) => {
    const newTitle = await prompt({
      title: 'Rename Resume',
      description: 'Enter a new title for your resume:',
      defaultValue: resume.title,
      confirmLabel: 'Save',
      cancelLabel: 'Cancel',
    });
    if (newTitle && newTitle.trim() !== resume.title) {
      renameMutation.mutate({ id: resume._id, title: newTitle.trim() });
    }
  };

  const handleMakePrimary = (resume) => {
    primaryMutation.mutate(resume._id);
  };

  const handleDelete = async (resume) => {
    const confirmed = await confirm({
      title: 'Delete Resume',
      description: `Are you sure you want to delete "${resume.title}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      isDestructive: true,
    });
    if (confirmed) {
      deleteMutation.mutate(resume._id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Resume Library"
        description="Manage your resumes. Upload a new PDF to get started with AI analysis."
      />

      <section aria-labelledby="upload-heading">
        <h2 id="upload-heading" className="sr-only">Upload Resume</h2>
        <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg p-6 dark:border dark:border-slate-800">
          <UploadZone 
            onFileSelected={handleFileSelected} 
            isUploading={uploadMutation.isPending} 
          />
          {uploadState && (
            <UploadProgress
              progress={uploadState.progress}
              error={uploadState.error}
              fileName={uploadState.fileName}
            />
          )}
        </div>
      </section>

      <section aria-labelledby="library-heading" className="pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <h2 id="library-heading" className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
            Your Resumes
          </h2>
          <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-900/30">
            {data?.data?.length || 0} / 10 limit
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            <LoadingSkeleton className="h-48 w-full" />
            <LoadingSkeleton className="h-48 w-full" />
            <LoadingSkeleton className="h-48 w-full" />
          </div>
        ) : isError ? (
          <div className="mt-6">
            <ErrorState message={error?.message || 'Failed to fetch resumes'} onRetry={refetch} />
          </div>
        ) : (
          <ResumeList
            resumes={data.data}
            onRename={handleRename}
            onMakePrimary={handleMakePrimary}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
};

export default ResumeBuilder;
