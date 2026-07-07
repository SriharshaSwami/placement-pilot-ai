import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { Join, Show } from '../../components/Layout/Conditional.jsx';

export const Education = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 pb-1">
        Education
      </h2>
      <div className="space-y-3">
        {data.map((edu, index) => {
          return (
            <div key={index} className="flex flex-col print-avoid-break">
              <div className="flex justify-between items-baseline mb-0.5">
                <Join 
                  separator={<span className="text-sm italic text-slate-600 ml-2">-</span>}
                  items={[
                    { value: edu.institution?.value, element: <h3 className="font-bold text-slate-900"><EditableNode path={`education.${index}.institution`} value={edu.institution?.value} placeholder="Institution" tag="span" /></h3> },
                    { value: edu.location?.value, element: <span className="text-sm italic text-slate-600"><EditableNode path={`education.${index}.location`} value={edu.location?.value} placeholder="Location" tag="span" /></span> }
                  ]}
                  className="flex gap-2 items-baseline"
                  container="div"
                />
                <div className="text-sm font-medium text-slate-600 whitespace-nowrap">
                  <Join 
                    separator=" - "
                    items={[
                      { value: edu.startDate?.value, element: <EditableNode path={`education.${index}.startDate`} value={edu.startDate?.value} placeholder="Start Date" tag="span" /> },
                      { value: edu.endDate?.value, element: <EditableNode path={`education.${index}.endDate`} value={edu.endDate?.value} placeholder="Present" tag="span" /> }
                    ]}
                    container="span"
                  />
                </div>
              </div>

              <div className="flex justify-between items-baseline text-sm">
                <div className="text-slate-800 font-medium">
                  <EditableNode path={`education.${index}.degree`} value={edu.degree?.value} placeholder="Degree" tag="span" />
                  <Show when={edu.specialization?.value}>
                    <span>{" in "}</span>
                    <EditableNode path={`education.${index}.specialization`} value={edu.specialization?.value} placeholder="Specialization" tag="span" />
                  </Show>
                </div>
                <Show when={edu.cgpa?.value || edu.percentage?.value}>
                  <div className="text-slate-600">
                    <span>CGPA: <EditableNode path={`education.${index}.cgpa`} value={edu.cgpa?.value || edu.percentage?.value} placeholder="CGPA" tag="span" /></span>
                  </div>
                </Show>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
