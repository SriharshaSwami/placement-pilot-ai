import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { SectionHeading } from './Header.jsx';
import { Join, Show } from '../../components/Layout/Conditional.jsx';

const font = '"Arial", "Helvetica", sans-serif';

export const Experience = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div style={{ marginBottom: '10px' }}>
      <SectionHeading title="Professional Experience" />
      {data.map((job, index) => (
        <div
          key={index}
          style={{ marginBottom: index < data.length - 1 ? '9px' : '0', pageBreakInside: 'avoid' }}
        >
          {/* Row 1: Role — Company (Location)   [dates right] */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
              <Join 
                separator={<span style={{ color: '#94a3b8', fontFamily: font }}>—</span>}
                items={[
                  {
                    value: job.role?.value,
                    element: (
                      <span style={{ fontFamily: font, fontSize: '9.5pt', fontWeight: '700', color: '#0f172a' }}>
                        <EditableNode path={`experience.${index}.role`} value={job.role?.value} placeholder="Role" tag="span" />
                      </span>
                    )
                  },
                  {
                    value: job.company?.value,
                    element: (
                      <span style={{ fontFamily: font, fontSize: '9.5pt', fontWeight: '600', color: '#334155' }}>
                        <EditableNode path={`experience.${index}.company`} value={job.company?.value} placeholder="Company" tag="span" />
                      </span>
                    )
                  }
                ]}
                container={React.Fragment}
              />
              <Show when={job.location?.value}>
                <span style={{ fontFamily: font, fontSize: '8.5pt', color: '#64748b', fontStyle: 'italic' }}>
                  (<EditableNode path={`experience.${index}.location`} value={job.location?.value} placeholder="Location" tag="span" />)
                </span>
              </Show>
            </div>
            
            <Join 
              separator=" – "
              items={[
                { value: job.startDate?.value, element: <EditableNode path={`experience.${index}.startDate`} value={job.startDate?.value} placeholder="Start" tag="span" /> },
                { value: job.endDate?.value, element: <EditableNode path={`experience.${index}.endDate`} value={job.endDate?.value} placeholder="Present" tag="span" /> }
              ]}
              style={{ fontFamily: font, fontSize: '8.5pt', color: '#475569', whiteSpace: 'nowrap' }}
              container="span"
            />
          </div>

          {/* Bullet points */}
          {job.responsibilities?.length > 0 && (
            <ul style={{ margin: '3px 0 0 0', paddingLeft: '18px', listStyleType: 'disc' }}>
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} style={{ fontFamily: font, fontSize: '9pt', color: '#1e293b', lineHeight: '1.5', marginBottom: '1px' }}>
                  <EditableNode
                    path={`experience.${index}.responsibilities.${idx}`}
                    value={resp.value}
                    tag="span"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
