import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { Join, Show } from '../../components/Layout/Conditional.jsx';

export const Projects = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 pb-1">
        Projects
      </h2>
      <div className="space-y-4">
        {data.map((proj, index) => {
          return (
            <div key={index} className="flex flex-col print-avoid-break">
              <div className="flex justify-between items-baseline mb-1">
                <Join 
                  separator={<span className="text-slate-400">|</span>}
                  items={[
                    { value: proj.title?.value, element: <h3 className="font-bold text-slate-900"><EditableNode path={`projects.${index}.title`} value={proj.title?.value} placeholder="Project Title" tag="span" /></h3> },
                    { value: proj.github?.value, element: <a href={proj.github?.value} target="_blank" rel="noreferrer" className="text-primary-700 text-sm"><EditableNode path={`projects.${index}.github.name`} value={proj.github?.name?.value || 'GitHub'} placeholder="GitHub" tag="span" /></a> },
                    { value: proj.liveDemo?.value, element: <a href={proj.liveDemo?.value} target="_blank" rel="noreferrer" className="text-primary-700 text-sm"><EditableNode path={`projects.${index}.liveDemo.name`} value={proj.liveDemo?.name?.value || 'Live Demo'} placeholder="Live Demo" tag="span" /></a> }
                  ]}
                  className="flex gap-2 items-baseline flex-wrap"
                  container="div"
                />
                
                {/* Tech Stack Header */}
                <Show when={proj.technologies?.length > 0}>
                  <div className="text-xs font-medium text-slate-600 italic">
                    {proj.technologies?.map(t => t.value).join(', ')}
                  </div>
                </Show>
              </div>



              {proj.achievements && Array.isArray(proj.achievements) && proj.achievements.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-1 mt-1">
                  {proj.achievements.map((ach, idx) => (
                    <li key={idx} className="text-sm text-slate-800 leading-relaxed pl-1">
                      <EditableNode path={`projects.${index}.achievements.${idx}`} value={ach.value} tag="span" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
