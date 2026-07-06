import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { SectionHeading } from './Header.jsx';

const font = '"Arial", "Helvetica", sans-serif';

/**
 * Generic bulleted list section — used for Achievements and Leadership/Activities.
 * Supports both { title, description } structured entries and flat { value } entries.
 */
export const Achievements = ({ data, sectionTitle = 'Achievements' }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div style={{ marginBottom: '10px' }}>
      <SectionHeading title={sectionTitle} />
      <ul style={{ margin: 0, paddingLeft: '18px' }}>
        {data.map((item, index) => {
          const titleVal = item.title?.value;
          const descVal = item.description?.value;
          const rawVal = item.value;

          return (
            <li
              key={index}
              style={{ fontFamily: font, fontSize: '9pt', color: '#1e293b', lineHeight: '1.55', marginBottom: '2px', pageBreakInside: 'avoid' }}
            >
              {rawVal ? (
                <EditableNode path={`achievements.${index}`} value={rawVal} tag="span" />
              ) : (
                <>
                  {titleVal && (
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>
                      <EditableNode path={`achievements.${index}.title`} value={titleVal} tag="span" />
                      {descVal && ': '}
                    </span>
                  )}
                  {descVal && (
                    <EditableNode path={`achievements.${index}.description`} value={descVal} tag="span" />
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
