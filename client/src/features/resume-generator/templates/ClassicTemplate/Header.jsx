import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';

/* ─── helpers ─── */
const isUrl = (str) =>
  str && (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('www.'));

const isEmail = (str) => str && str.includes('@') && str.includes('.');

const ExternalLink = ({ href, children, style = {} }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    style={{ color: '#1d4ed8', textDecoration: 'underline', ...style }}
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

  const contactParts = [];

  if (phone?.value)
    contactParts.push(
      <EditableNode key="phone" path="candidate.phone" value={phone.value} tag="span" />
    );

  if (location?.value)
    contactParts.push(
      <EditableNode key="location" path="candidate.location" value={location.value} tag="span" />
    );

  if (email?.value)
    contactParts.push(
      <ExternalLink key="email" href={`mailto:${email.value}`}>
        <EditableNode path="candidate.email" value={email.value} tag="span" />
      </ExternalLink>
    );

  if (linkedin?.value)
    contactParts.push(
      <ExternalLink
        key="linkedin"
        href={linkedin.value.startsWith('http') ? linkedin.value : `https://${linkedin.value}`}
      >
        LinkedIn
      </ExternalLink>
    );

  if (github?.value)
    contactParts.push(
      <ExternalLink
        key="github"
        href={github.value.startsWith('http') ? github.value : `https://${github.value}`}
      >
        GitHub
      </ExternalLink>
    );

  if (portfolio?.value)
    contactParts.push(
      <ExternalLink
        key="portfolio"
        href={portfolio.value.startsWith('http') ? portfolio.value : `https://${portfolio.value}`}
      >
        Portfolio
      </ExternalLink>
    );

  if (links && Array.isArray(links)) {
    links.forEach((link, idx) => {
      if (link.url)
        contactParts.push(
          <ExternalLink
            key={`link-${idx}`}
            href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
          >
            <EditableNode path={`candidate.links.${idx}.url`} value={link.name || link.url} tag="span" />
          </ExternalLink>
        );
    });
  }

  return (
    <div style={{ textAlign: 'center', paddingBottom: '8px', borderBottom: '2px solid #0f172a', marginBottom: '10px' }}>
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

      {contactParts.length > 0 && (
        <div
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
        >
          {contactParts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < contactParts.length - 1 && (
                <span style={{ color: '#94a3b8', userSelect: 'none' }}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
