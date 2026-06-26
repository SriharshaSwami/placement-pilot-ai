import { formatDate } from '@/utils/formatters.js';

export const ActivityCard = ({ activities = [] }) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg dark:border dark:border-slate-800">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white">Recent Activity</h3>
      </div>
      <div className="px-6 py-5">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No recent activity found.</p>
        ) : (
          <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
            {activities.map((activity, index) => (
              <li key={index} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">{activity.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(activity.date)}</p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{activity.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
