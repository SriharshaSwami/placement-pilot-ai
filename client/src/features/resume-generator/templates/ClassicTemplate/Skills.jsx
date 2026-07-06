import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { SectionHeading } from './Header.jsx';

const font = '"Arial", "Helvetica", sans-serif';

const CATEGORIES = [
  { key: 'languages',  label: 'Languages'  },
  { key: 'frameworks', label: 'Frontend'   },
  { key: 'libraries',  label: 'Libraries'  },
  { key: 'databases',  label: 'Databases'  },
  { key: 'cloud',      label: 'Cloud'      },
  { key: 'devOps',     label: 'DevOps'     },
  { key: 'tools',      label: 'Tools'      },
  { key: 'aiML',       label: 'AI/ML'      },
  { key: 'other',      label: 'Other'      },
];

export const Skills = ({ data }) => {
  if (!data) return null;

  const active = CATEGORIES.filter(
    (cat) => data[cat.key]?.length > 0
  );

  if (active.length === 0) return null;

  return (
    <div style={{ marginBottom: '10px' }}>
      <SectionHeading title="Skills" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {active.map((cat) => (
          <div key={cat.key} style={{ fontFamily: font, fontSize: '9pt', color: '#1e293b', lineHeight: '1.5' }}>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>{cat.label}: </span>
            <span style={{ color: '#334155' }}>
              {data[cat.key].map((skill, idx) => (
                <React.Fragment key={idx}>
                  <EditableNode path={`skills.${cat.key}.${idx}`} value={skill.value} tag="span" />
                  {idx < data[cat.key].length - 1 && ', '}
                </React.Fragment>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
