import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';

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
                <div className="flex gap-2 items-baseline">
                  <h3 className="font-bold text-slate-900">
                    <EditableNode path={`education.${index}.institution`} value={edu.institution?.value} placeholder="Institution" tag="span" />
                  </h3>
                  <span className="text-sm italic text-slate-600">
                    - <EditableNode path={`education.${index}.location`} value={edu.location?.value} placeholder="Location" tag="span" />
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-600 whitespace-nowrap">
                  <span>
                    <EditableNode path={`education.${index}.startDate`} value={edu.startDate?.value} placeholder="Start Date" tag="span" />
                    {" - "}
                    <EditableNode path={`education.${index}.endDate`} value={edu.endDate?.value} placeholder="Present" tag="span" />
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-sm">
                <div className="text-slate-800 font-medium">
                  <EditableNode path={`education.${index}.degree`} value={edu.degree?.value} placeholder="Degree" tag="span" />
                  {" in "}
                  <EditableNode path={`education.${index}.specialization`} value={edu.specialization?.value} placeholder="Specialization" tag="span" />
                </div>
                <div className="text-slate-600">
                  <span>CGPA: <EditableNode path={`education.${index}.cgpa`} value={edu.cgpa?.value || edu.percentage?.value} placeholder="CGPA" tag="span" /></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
