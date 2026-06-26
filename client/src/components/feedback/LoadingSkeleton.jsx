import { classNames } from '../../utils/formatters.js';

export const LoadingSkeleton = ({ className }) => {
  return (
    <div className={classNames('animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md', className)} />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <LoadingSkeleton className="h-10 w-48" />
        <LoadingSkeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <LoadingSkeleton className="h-10 w-10 rounded-md" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <LoadingSkeleton className="h-4 w-24 mb-2" />
                <LoadingSkeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <LoadingSkeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <LoadingSkeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
