import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { SectionHeading } from './Header.jsx';
import { Join } from '../../components/Layout/Conditional.jsx';

const font = '"Arial", "Helvetica", sans-serif';

/**
 * Canonical 8-bucket semantic taxonomy.
 * Labels are recruiter-friendly and ATS-safe.
 * Buckets with no items are automatically omitted.
 */
const BUCKETS = [
  { key: 'languages',      label: 'Languages'        },
  { key: 'frontend',       label: 'Frontend'          },
  { key: 'backend',        label: 'Backend'           },
  { key: 'databases',      label: 'Databases'         },
  { key: 'aiLlm',          label: 'AI & LLM'          },
  { key: 'cloudDevOps',    label: 'Cloud & DevOps'    },
  { key: 'developerTools', label: 'Developer Tools'   },
  { key: 'coreConcepts',   label: 'Core Concepts'     },
  { key: 'technologies',   label: 'Technologies'      },
];

/**
 * Backward-compatibility polyfill.
 * Maps every legacy key (from previous taxonomy versions) into the
 * nearest correct 8-bucket target so old resumes display without re-parsing.
 */
const LEGACY_MAP = {
  // v1 keys (9-bucket)
  frameworks: 'frontend',
  libraries:  'frontend',
  cloud:      'cloudDevOps',
  devOps:     'cloudDevOps',
  aiML:       'aiLlm',
  other:      'coreConcepts',
  // v2 keys (6-bucket)
  tools:      'developerTools',
  concepts:   'coreConcepts',
  // v3 keys (6-bucket second pass) — already canonical, but kept for safety
  frontend:   'frontend',
  backend:    'backend',
  databases:  'databases',
  languages:  'languages',
};

function normalizeSkills(raw) {
  if (!raw) return {};

  // Start with empty canonical buckets
  const merged = Object.fromEntries(BUCKETS.map(b => [b.key, []]));

  // Populate canonical keys first
  for (const bucket of BUCKETS) {
    if (raw[bucket.key]?.length) {
      merged[bucket.key] = [...raw[bucket.key]];
    }
  }

  // Fold in any legacy keys that aren't already canonical
  for (const [oldKey, targetKey] of Object.entries(LEGACY_MAP)) {
    if (!BUCKETS.find(b => b.key === oldKey) && raw[oldKey]?.length) {
      merged[targetKey] = [...merged[targetKey], ...raw[oldKey]];
    }
  }

  // Deduplicate by value within each bucket
  for (const key of Object.keys(merged)) {
    const seen = new Set();
    merged[key] = merged[key].filter(item => {
      if (!item?.value || seen.has(item.value)) return false;
      seen.add(item.value);
      return true;
    });
  }

  // ── Compaction (Render-time only) ──
  // Any bucket with < 3 items gets merged into 'technologies' to save vertical space.
  const overflow = [];
  for (const bucket of BUCKETS) {
    if (bucket.key === 'technologies') continue;
    if (merged[bucket.key]?.length < 3) {
      overflow.push(...(merged[bucket.key] || []));
      merged[bucket.key] = [];
    }
  }

  if (overflow.length > 0) {
    merged.technologies = [...(merged.technologies || []), ...overflow];
  }

  return merged;
}

export const Skills = ({ data }) => {
  if (!data) return null;

  const skills = normalizeSkills(data);
  const active = BUCKETS.filter(b => skills[b.key]?.length > 0);

  if (active.length === 0) return null;

  return (
    <div style={{ marginBottom: '10px' }}>
      <SectionHeading title="Skills" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {active.map((bucket) => (
          <div key={bucket.key} style={{ fontFamily: font, fontSize: '9pt', color: '#1e293b', lineHeight: '1.5' }}>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>{bucket.label}: </span>
            <Join
              separator=", "
              items={skills[bucket.key].map((skill, idx) => ({
                value: skill.value,
                element: <EditableNode path={`skills.${bucket.key}.${idx}`} value={skill.value} tag="span" />,
              }))}
              className=""
              container="span"
              style={{ color: '#334155' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
