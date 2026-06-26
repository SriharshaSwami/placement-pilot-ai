import { useState } from 'react';

export const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-xs font-normal leading-relaxed text-white shadow-xl dark:bg-slate-950 border border-slate-700/50">
          <div className="relative">
            {content}
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1 rotate-45 bg-slate-900 dark:bg-slate-950 border-r border-b border-slate-700/50" />
          </div>
        </div>
      )}
    </div>
  );
};
