import { Loader2 } from 'lucide-react';

export const ResumeParsingProgress = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
      <Loader2 className="h-10 w-10 text-primary-600 animate-spin mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Analyzing Resume...</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
        We are extracting text, cleaning formatting, and detecting sections using our rule-based parsing engine. This usually takes a few seconds.
      </p>
    </div>
  );
};
