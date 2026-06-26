import { classNames } from '../../../utils/formatters.js';

export const ResumeBadge = ({ isPrimary }) => {
  return (
    <span
      className={classNames(
        isPrimary 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors'
      )}
    >
      {isPrimary ? 'Primary' : 'Draft'}
    </span>
  );
};
