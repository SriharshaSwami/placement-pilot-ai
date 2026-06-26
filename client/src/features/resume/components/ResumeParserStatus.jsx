import { classNames } from '../../../utils/formatters.js';

export const ResumeParserStatus = ({ status }) => {
  const isPending = status === 'pending';
  const isSuccess = status === 'success';
  const isFailed = status === 'failed';

  return (
    <span
      className={classNames(
        isPending && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        isSuccess && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
        isFailed && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
        !status && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors'
      )}
    >
      {status ? `Parsing ${status}` : 'Not Parsed'}
    </span>
  );
};
