import { CheckCircle2 } from 'lucide-react';

export const ResumeSectionViewer = ({ sections = {} }) => {
  const sectionKeys = Object.keys(sections);

  if (sectionKeys.length === 0) {
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400 italic">
        No sections detected.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {sectionKeys.map((key) => (
          <span key={key} className="inline-flex items-center gap-x-1.5 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-900/30 capitalize">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            {key}
          </span>
        ))}
      </div>

      <div className="space-y-8">
        {sectionKeys.map((key) => (
          <div key={key}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              {key}
            </h4>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                {sections[key]}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
