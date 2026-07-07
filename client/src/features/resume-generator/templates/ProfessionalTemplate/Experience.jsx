import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { Join, Show } from '../../components/Layout/Conditional.jsx';

export const Experience = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 pb-1">
        Professional Experience
      </h2>
      <div className="space-y-4">
        {data.map((job, index) => {
          return (
            <div key={index} className="flex flex-col print-avoid-break">
              <div className="flex justify-between items-baseline mb-1">
                <Join 
                  separator={<span className="text-slate-500">|</span>}
                  items={[
                    { value: job.role?.value, element: <h3 className="font-bold text-slate-900"><EditableNode path={`experience.${index}.role`} value={job.role?.value} placeholder="Role" tag="span" /></h3> },
                    { value: job.company?.value, element: <span className="font-semibold text-slate-800"><EditableNode path={`experience.${index}.company`} value={job.company?.value} placeholder="Company" tag="span" /></span> }
                  ]}
                  className="flex gap-2 items-baseline"
                  container="div"
                />
                <div className="text-sm font-medium text-slate-600 whitespace-nowrap">
                  <Join 
                    separator=" - "
                    items={[
                      { value: job.startDate?.value, element: <EditableNode path={`experience.${index}.startDate`} value={job.startDate?.value} placeholder="Start" tag="span" /> },
                      { value: job.endDate?.value, element: <EditableNode path={`experience.${index}.endDate`} value={job.endDate?.value} placeholder="Present" tag="span" /> }
                    ]}
                    container="span"
                  />
                  <Show when={job.location?.value}>
                    <span className="ml-2 italic text-slate-500">(<EditableNode path={`experience.${index}.location`} value={job.location?.value} placeholder="Location" tag="span" />)</span>
                  </Show>
                </div>
              </div>

              {job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                <ul className="list-disc list-outside ml-4 mt-1 space-y-1">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-sm text-slate-800 leading-relaxed pl-1">
                      <EditableNode path={`experience.${index}.responsibilities.${idx}`} value={resp.value} tag="span" />
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
