import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { SectionHeading } from './Header.jsx';

const font = '"Arial", "Helvetica", sans-serif';

const isUrl = (str) =>
  str && (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('www.'));

export const Certifications = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div style={{ marginBottom: '10px' }}>
      <SectionHeading title="Certifications" />
      <ul style={{ margin: 0, paddingLeft: '18px' }}>
        {data.map((cert, index) => (
          <li
            key={index}
            style={{ fontFamily: font, fontSize: '9pt', color: '#1e293b', lineHeight: '1.55', marginBottom: '2px', pageBreakInside: 'avoid' }}
          >
            <span style={{ fontWeight: '600', color: '#0f172a' }}>
              <EditableNode path={`certifications.${index}.name`} value={cert.name?.value} placeholder="Certification Name" tag="span" />
            </span>
            {cert.issuer?.value && (
              <span style={{ color: '#475569' }}>
                {' — '}
                <EditableNode path={`certifications.${index}.issuer`} value={cert.issuer?.value} placeholder="Issuer" tag="span" />
              </span>
            )}
            {cert.date?.value && (
              <span style={{ color: '#64748b', fontStyle: 'italic' }}>
                {' ('}
                <EditableNode path={`certifications.${index}.date`} value={cert.date?.value} placeholder="Date" tag="span" />
                {')'}
              </span>
            )}
            {cert.url?.value && isUrl(cert.url.value) && (
              <a
                href={cert.url.value.startsWith('http') ? cert.url.value : `https://${cert.url.value}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: font, fontSize: '8.5pt', color: '#1d4ed8', textDecoration: 'underline', marginLeft: '6px' }}
              >
                View
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
