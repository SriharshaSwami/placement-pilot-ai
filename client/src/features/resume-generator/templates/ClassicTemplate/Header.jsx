import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { Join } from '../../components/Layout/Conditional.jsx';

/* ─── helpers ─── */
const isUrl = (str) =>
  str && (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('www.'));

const isEmail = (str) => str && str.includes('@') && str.includes('.');

const ExternalLink = ({ href, children, style = {} }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    style={{ color: '#1d4ed8', textDecoration: 'none', ...style }}
  >
    {children}
  </a>
);

/* ─── section heading ─── */
export const SectionHeading = ({ title }) => (
  <h2
    style={{
      fontFamily: '"Arial", "Helvetica", sans-serif',
      fontSize: '10pt',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      color: '#0f172a',
      borderBottom: '1.5px solid #0f172a',
      paddingBottom: '2px',
      marginBottom: '7px',
      marginTop: '0',
    }}
  >
    {title}
  </h2>
);

/* ─── header ─── */
export const Header = ({ data }) => {
  if (!data) return null;
  const { name, email, phone, location, linkedin, github, portfolio, links } = data;

  const contactItems = [
    { value: phone?.value, element: <EditableNode key="phone" path="candidate.phone" value={phone?.value} tag="span" placeholder="Phone" /> },
    { value: location?.value, element: <EditableNode key="location" path="candidate.location" value={location?.value} tag="span" placeholder="Location" /> },
    { value: email?.value, element: (
      <ExternalLink key="email" href={`mailto:${email?.value || ''}`}>
        <EditableNode path="candidate.email" value={email?.value} tag="span" placeholder="Email" />
      </ExternalLink>
    )},
    { value: linkedin?.value, element: (
      <ExternalLink key="linkedin" href={linkedin?.value?.startsWith('http') ? linkedin.value : `https://${linkedin?.value}`}>
        <EditableNode path="candidate.linkedin" value={linkedin?.value} tag="span" placeholder="LinkedIn URL" />
      </ExternalLink>
    )},
    { value: github?.value, element: (
      <ExternalLink key="github" href={github?.value?.startsWith('http') ? github.value : `https://${github?.value}`}>
        <EditableNode path="candidate.github" value={github?.value} tag="span" placeholder="GitHub URL" />
      </ExternalLink>
    )},
    { value: portfolio?.value, element: (
      <ExternalLink key="portfolio" href={portfolio?.value?.startsWith('http') ? portfolio.value : `https://${portfolio?.value}`}>
        <EditableNode path="candidate.portfolio" value={portfolio?.value} tag="span" placeholder="Portfolio URL" />
      </ExternalLink>
    )}
  ];

  if (links && Array.isArray(links)) {
    links.forEach((link, idx) => {
      contactItems.push({
        value: link.url,
        element: (
          <ExternalLink key={`link-${idx}`} href={link.url?.startsWith('http') ? link.url : `https://${link.url}`}>
            <EditableNode path={`candidate.links.${idx}.url`} value={link.name || link.url} tag="span" placeholder="Link" />
          </ExternalLink>
        )
      });
    });
  }

  return (
    <div style={{ textAlign: 'center', paddingBottom: '8px', marginBottom: '10px' }}>
      <h1
        style={{
          fontFamily: '"Arial", "Helvetica", sans-serif',
          fontSize: '20pt',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#0f172a',
          margin: '0 0 5px 0',
          lineHeight: '1.1',
        }}
      >
        <EditableNode path="candidate.name" value={name?.value} placeholder="Full Name" tag="span" />
      </h1>

      <Join
        separator={<span style={{ color: '#94a3b8', userSelect: 'none' }}>|</span>}
        items={contactItems}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0 6px',
          fontFamily: '"Arial", "Helvetica", sans-serif',
          fontSize: '8.5pt',
          color: '#334155',
          lineHeight: '1.6',
        }}
      />
    </div>
  );
};
