import { CheckCircle2, XCircle } from 'lucide-react';

export const UploadProgress = ({ progress, error, fileName }) => {
  return (
    <div className="mt-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-900 dark:text-white truncate pr-4">
          {fileName}
        </span>
        {error ? (
          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        ) : progress === 100 ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
        ) : (
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            {progress}%
          </span>
        )}
      </div>
      
      {!error && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
