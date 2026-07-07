import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { Join } from '../../components/Layout/Conditional.jsx';

export const Skills = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  // Render order for skills
  const categories = [
    { key: 'languages', label: 'Languages' },
    { key: 'frameworks', label: 'Frameworks' },
    { key: 'libraries', label: 'Libraries' },
    { key: 'databases', label: 'Databases' },
    { key: 'cloud', label: 'Cloud' },
    { key: 'devOps', label: 'DevOps' },
    { key: 'tools', label: 'Tools' },
    { key: 'aiML', label: 'AI/ML' },
    { key: 'other', label: 'Other Skills' }
  ];

  const renderedCategories = categories.filter(cat => {
    return data[cat.key] && Array.isArray(data[cat.key]) && data[cat.key].length > 0;
  });

  if (renderedCategories.length === 0) return null;

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 pb-1">
        Skills
      </h2>
      <div className="space-y-1.5">
        {renderedCategories.map((cat, index) => (
          <div key={index} className="text-sm">
            <span className="font-bold text-slate-900 mr-2">{cat.label}:</span>
            <Join 
              separator=", "
              items={data[cat.key].map((skill, idx) => ({
                value: skill.value,
                element: <EditableNode path={`skills.${cat.key}.${idx}`} value={skill.value} tag="span" />
              }))}
              className="text-slate-800 leading-relaxed"
              container="span"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
