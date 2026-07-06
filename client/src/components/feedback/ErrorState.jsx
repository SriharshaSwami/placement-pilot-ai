import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
        {message || 'An unexpected error occurred. Please try again later.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
};
