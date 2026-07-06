import React, { useMemo } from 'react';
import { LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';

export const LayoutOptimizerPanel = ({ data, onChange }) => {
  const currentOrder = data?.layout?.sectionOrder || [];

  // Generate suggestions dynamically based on data heuristics
  const suggestions = useMemo(() => {
    if (!data) return [];
    const sugs = [];

    // 1. Fresher Check: Move Projects before Experience if no experience or short experience
    const hasProjects = data.projects && data.projects.length > 0;
    const hasExperience = data.experience && data.experience.length > 0;
    const projIdx = currentOrder.indexOf('projects');
    const expIdx = currentOrder.indexOf('experience');
    
    if (hasProjects && expIdx !== -1 && projIdx !== -1 && projIdx > expIdx) {
      if (!hasExperience || data.experience.length === 1 && (!data.experience[0].duration?.value || data.experience[0].duration.value.toLowerCase().includes('month'))) {
        sugs.push({
          id: 'fresher-projects',
          title: 'Highlight Projects',
          description: 'You have limited professional experience. Moving Projects above Experience can help highlight your technical skills.',
          action: () => {
            const newOrder = [...currentOrder];
            newOrder.splice(projIdx, 1);
            newOrder.splice(expIdx, 0, 'projects');
            onChange({ ...data, layout: { ...data.layout, sectionOrder: newOrder } });
            toast.success('Projects moved above Experience');
          }
        });
      }
    }

    // 2. Hide Empty Sections
    ['experience', 'education', 'projects', 'certifications', 'skills'].forEach(key => {
      const idx = currentOrder.indexOf(key);
      if (idx !== -1) {
        const isEmpty = !data[key] || (Array.isArray(data[key]) && data[key].length === 0) || (typeof data[key] === 'object' && !Array.isArray(data[key]) && Object.keys(data[key]).length === 0);
        if (isEmpty) {
          sugs.push({
            id: `hide-empty-${key}`,
            title: `Hide Empty ${key.charAt(0).toUpperCase() + key.slice(1)}`,
            description: `Your ${key} section is completely empty. Removing it from the layout prevents awkward blank spaces.`,
            action: () => {
              const newOrder = currentOrder.filter(item => item !== key);
              onChange({ ...data, layout: { ...data.layout, sectionOrder: newOrder } });
              toast.success(`${key} section hidden from layout`);
            }
          });
        }
      }
    });

    return sugs;
  }, [data, currentOrder, onChange]);

  if (suggestions.length === 0) {
    return null; // Don't show panel if no suggestions
  }

  return (
    <div className="mb-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <LayoutTemplate className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-semibold text-primary-900 dark:text-primary-100">Layout Optimization Suggestions</h3>
      </div>
      <div className="space-y-3">
        {suggestions.map(sug => (
          <div key={sug.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between gap-4">
            <div>
              <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1">{sug.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sug.description}</p>
            </div>
            <button
              onClick={sug.action}
              className="flex-none px-3 py-1.5 bg-primary-100 hover:bg-primary-200 text-primary-700 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800 text-xs font-medium rounded transition-colors"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
