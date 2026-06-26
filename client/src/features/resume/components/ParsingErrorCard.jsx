import { AlertTriangle, RefreshCcw } from 'lucide-react';

export const ParsingErrorCard = ({ errorReason, onRetry }) => {
  return (
    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Parsing Failed</h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-400">
            <p>
              The parsing engine encountered an error: {errorReason || 'Unknown extraction error.'}
            </p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-800 shadow-sm hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 transition-colors"
              >
                <RefreshCcw className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                Retry Parsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
