import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';

export const Certifications = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-slate-300 pb-1">
        Certifications
      </h2>
      <div className="space-y-3">
        {data.map((cert, index) => {
          return (
            <div key={index} className="flex justify-between items-baseline">
              <div className="flex gap-2 items-baseline">
                <h3 className="font-bold text-slate-900">
                  <EditableNode path={`certifications.${index}.name`} value={cert.name?.value} placeholder="Certification Name" tag="span" />
                </h3>
                <span className="text-sm italic text-slate-600">
                  - <EditableNode path={`certifications.${index}.issuer`} value={cert.issuer?.value} placeholder="Issuer" tag="span" />
                </span>
                {cert.url?.value && (
                  <a href={cert.url.value} target="_blank" rel="noreferrer" className="text-sm text-primary-700 underline ml-2">
                    View Credential
                  </a>
                )}
              </div>
              <div className="text-sm font-medium text-slate-600 whitespace-nowrap">
                <EditableNode path={`certifications.${index}.date`} value={cert.date?.value} placeholder="Date" tag="span" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
