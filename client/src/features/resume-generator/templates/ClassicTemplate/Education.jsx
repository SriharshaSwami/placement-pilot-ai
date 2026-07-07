import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { SectionHeading } from './Header.jsx';
import { Join, Show } from '../../components/Layout/Conditional.jsx';

const font = '"Arial", "Helvetica", sans-serif';

export const Education = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div style={{ marginBottom: '10px' }}>
      <SectionHeading title="Education" />
      {data.map((edu, index) => (
        <div key={index} style={{ marginBottom: index < data.length - 1 ? '7px' : '0', pageBreakInside: 'avoid' }}>
          {/* Row 1: Degree in Specialization ————————— Dates */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: font, fontSize: '9.5pt', fontWeight: '700', color: '#0f172a' }}>
              <EditableNode path={`education.${index}.degree`} value={edu.degree?.value} placeholder="Degree" tag="span" />
              <Show when={edu.specialization?.value}>
                <> in <EditableNode path={`education.${index}.specialization`} value={edu.specialization?.value} placeholder="Specialization" tag="span" /></>
              </Show>
            </span>
            <Join 
              separator=" – "
              items={[
                { value: edu.startDate?.value, element: <EditableNode path={`education.${index}.startDate`} value={edu.startDate?.value} placeholder="Start" tag="span" /> },
                { value: edu.endDate?.value, element: <EditableNode path={`education.${index}.endDate`} value={edu.endDate?.value} placeholder="Present" tag="span" /> }
              ]}
              style={{ fontFamily: font, fontSize: '8.5pt', color: '#475569', whiteSpace: 'nowrap', marginLeft: '8px' }}
              container="span"
            />
          </div>

          {/* Row 2: Institution, Location ————————— CGPA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1px' }}>
            <span style={{ fontFamily: font, fontSize: '9pt', color: '#334155' }}>
              <Join 
                separator={<span style={{ fontStyle: 'italic', color: '#64748b' }}>{', '}</span>}
                items={[
                  { value: edu.institution?.value, element: <EditableNode path={`education.${index}.institution`} value={edu.institution?.value} placeholder="Institution" tag="span" /> },
                  { value: edu.location?.value, element: <span style={{ fontStyle: 'italic', color: '#64748b' }}><EditableNode path={`education.${index}.location`} value={edu.location?.value} placeholder="Location" tag="span" /></span> }
                ]}
                container={React.Fragment}
              />
            </span>
            <Show when={edu.cgpa?.value || edu.percentage?.value}>
              <span style={{ fontFamily: font, fontSize: '8.5pt', color: '#475569', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                CGPA: <EditableNode path={`education.${index}.cgpa`} value={edu.cgpa?.value || edu.percentage?.value} placeholder="CGPA" tag="span" />
              </span>
            </Show>
          </div>
        </div>
      ))}
    </div>
  );
};
