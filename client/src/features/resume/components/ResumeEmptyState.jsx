import { FileUp } from 'lucide-react';

export const ResumeEmptyState = () => {
  return (
    <div className="text-center bg-surface-light dark:bg-surface-dark rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-12">
      <FileUp className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
      <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No resumes uploaded</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Get started by uploading your first resume. We&apos;ll extract the text and analyze it for you.
      </p>
    </div>
  );
};
