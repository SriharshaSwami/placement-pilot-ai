import { Loader2 } from 'lucide-react';

export const AnalysisSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
        <Loader2 className="h-16 w-16 text-primary-600 dark:text-primary-400 animate-spin relative z-10" />
      </div>
      <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">Analyzing Resume...</h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400 text-center max-w-md animate-pulse">
        Our AI is evaluating formatting, keyword density, and overall impact. This may take up to 30 seconds.
      </p>
    </div>
  );
};
