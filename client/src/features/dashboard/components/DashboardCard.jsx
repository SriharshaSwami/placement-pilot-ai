import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { classNames } from '@/utils/formatters.js';

export const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, trendLabel }) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-surface-light px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 dark:bg-surface-dark dark:border dark:border-slate-800">
      <dt>
        <div className="absolute rounded-md bg-primary-500 p-3">
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
        
        {trend && (
          <p
            className={classNames(
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
              'ml-2 flex items-baseline text-sm font-semibold'
            )}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 shrink-0 self-center text-green-500" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="h-4 w-4 shrink-0 self-center text-red-500" aria-hidden="true" />
            )}
            <span className="sr-only"> {trend === 'up' ? 'Increased' : 'Decreased'} by </span>
            {trendValue}
          </p>
        )}
        {trendLabel && (
          <div className="absolute inset-x-0 bottom-0 bg-slate-50 px-4 py-4 sm:px-6 dark:bg-slate-800/50">
            <div className="text-sm">
              <span className="font-medium text-slate-500 dark:text-slate-400">{trendLabel}</span>
            </div>
          </div>
        )}
      </dd>
    </div>
  );
};
