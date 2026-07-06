import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { SectionHeading } from './Header.jsx';

const font = '"Arial", "Helvetica", sans-serif';

const toHref = (url) =>
  url && !url.startsWith('http') ? `https://${url}` : url;

export const Projects = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div style={{ marginBottom: '10px' }}>
      <SectionHeading title="Projects" />
      {data.map((proj, index) => {
        const primaryUrl = proj.github?.value || proj.liveDemo?.value;
        const titleHref = primaryUrl ? toHref(primaryUrl) : null;

        return (
          <div
            key={index}
            style={{ marginBottom: index < data.length - 1 ? '9px' : '0', pageBreakInside: 'avoid' }}
          >
            {/* Row 1: Title | GitHub | Live Demo ————————— Tech Stack */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 8px' }}>

              {/* Left group: title + links */}
              <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>

                {/* Project title — clickable if a URL exists */}
                {titleHref ? (
                  <a
                    href={titleHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: font, fontSize: '9.5pt', fontWeight: '700', color: '#0f172a', textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                  >
                    <EditableNode
                      path={`projects.${index}.title`}
                      value={proj.title?.value}
                      placeholder="Project Title"
                      tag="span"
                    />
                  </a>
                ) : (
                  <span style={{ fontFamily: font, fontSize: '9.5pt', fontWeight: '700', color: '#0f172a' }}>
                    <EditableNode
                      path={`projects.${index}.title`}
                      value={proj.title?.value}
                      placeholder="Project Title"
                      tag="span"
                    />
                  </span>
                )}

                {/* GitHub link */}
                {proj.github?.value && (
                  <a
                    href={toHref(proj.github.value)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: font, fontSize: '8.5pt', color: '#1d4ed8', textDecoration: 'underline' }}
                  >
                    GitHub
                  </a>
                )}

                {/* Live Demo link */}
                {proj.liveDemo?.value && (
                  <a
                    href={toHref(proj.liveDemo.value)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: font, fontSize: '8.5pt', color: '#1d4ed8', textDecoration: 'underline' }}
                  >
                    Live Demo
                  </a>
                )}

              </div>

              {/* Right: tech stack */}
              {proj.technologies?.length > 0 && (
                <span style={{ fontFamily: font, fontSize: '8.5pt', color: '#475569', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                  {proj.technologies.map((t) => t.value).join(', ')}
                </span>
              )}

            </div>

            {/* Description — split into bullet lines */}
            {proj.description?.value && (
              <ul style={{ margin: '3px 0 0 0', paddingLeft: '18px' }}>
                {proj.description.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0)
                  .map((line, li) => (
                    <li key={li} style={{ fontFamily: font, fontSize: '9pt', color: '#1e293b', lineHeight: '1.5', marginBottom: '1px' }}>
                      {line}
                    </li>
                  ))}
              </ul>
            )}

            {/* Explicit achievements bullets */}
            {proj.achievements?.length > 0 && (
              <ul style={{ margin: proj.description?.value ? '2px 0 0 0' : '3px 0 0 0', paddingLeft: '18px' }}>
                {proj.achievements.map((ach, idx) => (
                  <li key={idx} style={{ fontFamily: font, fontSize: '9pt', color: '#1e293b', lineHeight: '1.5', marginBottom: '1px' }}>
                    <EditableNode
                      path={`projects.${index}.achievements.${idx}`}
                      value={ach.value}
                      tag="span"
                    />
                  </li>
                ))}
              </ul>
            )}

          </div>
        );
      })}
    </div>
  );
};
