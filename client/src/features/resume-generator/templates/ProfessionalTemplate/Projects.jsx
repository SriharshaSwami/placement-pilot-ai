import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';

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
                <div className="flex gap-2 items-baseline">
                  <h3 className="font-bold text-slate-900">
                    <EditableNode path={`projects.${index}.title`} value={proj.title?.value} placeholder="Project Title" tag="span" />
                  </h3>
                  
                  {/* Links */}
                  <div className="flex gap-2 text-sm">
                    {proj.github?.value && (
                      <a href={proj.github.value} target="_blank" rel="noreferrer" className="text-primary-700 underline">
                        GitHub
                      </a>
                    )}
                    {proj.liveDemo?.value && (
                      <a href={proj.liveDemo.value} target="_blank" rel="noreferrer" className="text-primary-700 underline">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Tech Stack Header */}
                {proj.technologies && Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                  <div className="text-xs font-medium text-slate-600 italic">
                    {proj.technologies.map(t => t.value).join(', ')}
                  </div>
                )}
              </div>

              <EditableNode 
                path={`projects.${index}.description`} 
                value={proj.description?.value} 
                multiline={true} 
                tag="p"
                className="text-sm text-slate-800 leading-relaxed mb-1 whitespace-pre-wrap"
                placeholder="Description..."
              />

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
