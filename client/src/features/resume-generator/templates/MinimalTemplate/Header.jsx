import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';

export const Header = ({ data }) => {
  if (!data) return null;

  const { name, email, phone, location, linkedin, github, portfolio, links } = data;

  const contactItems = [];
  if (email?.value) contactItems.push({ path: 'candidate.email', value: email.value });
  if (phone?.value) contactItems.push({ path: 'candidate.phone', value: phone.value });
  if (location?.value) contactItems.push({ path: 'candidate.location', value: location.value });
  if (linkedin?.value) contactItems.push({ path: 'candidate.linkedin', value: linkedin.value });
  if (github?.value) contactItems.push({ path: 'candidate.github', value: github.value });
  if (portfolio?.value) contactItems.push({ path: 'candidate.portfolio', value: portfolio.value });

  // Add any generic links
  if (links && Array.isArray(links)) {
    links.forEach((link, idx) => {
      if (link.url) contactItems.push({ path: `candidate.links.${idx}.url`, value: link.url });
    });
  }

  return (
    <div className="text-center pb-4 border-b-2 border-slate-800">
      <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
        <EditableNode path="candidate.name" value={name?.value} placeholder="Full Name" tag="span" />
      </h1>
      
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-slate-700">
        {contactItems.map((item, index) => (
          <React.Fragment key={index}>
            <EditableNode path={item.path} value={item.value} tag="span" />
            {index < contactItems.length - 1 && <span className="text-slate-400">•</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
