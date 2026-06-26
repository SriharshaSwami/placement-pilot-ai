export const KeywordCoverage = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white">Missing Keywords</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Consider adding these terms to improve ATS visibility for your likely target roles.
        </p>
      </div>
      <div className="px-6 py-5 flex flex-wrap gap-2">
        {keywords.map((kw, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/20 px-2.5 py-1 text-sm font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10 dark:ring-red-500/20"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
};
