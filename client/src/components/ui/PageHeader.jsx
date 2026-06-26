export const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export const SectionHeader = ({ title, description, actions }) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};
