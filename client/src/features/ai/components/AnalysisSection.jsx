export const AnalysisSection = ({ title, icon: Icon, items, type = 'bullet' }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-800/30">
        {Icon && <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />}
        <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="px-6 py-5">
        {type === 'bullet' && (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-primary-500 mt-2 mr-3" />
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {type === 'feedback' && (
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                  {item.title}
                  {item.score && (
                    <span className={`ml-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      item.score >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.score}/100
                    </span>
                  )}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
