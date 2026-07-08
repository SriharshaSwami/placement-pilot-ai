import React from 'react';
import { Header } from './Header.jsx';
import { Summary } from './Summary.jsx';
import { Experience } from './Experience.jsx';
import { Education } from './Education.jsx';
import { Projects } from './Projects.jsx';
import { Skills } from './Skills.jsx';
import { Certifications } from './Certifications.jsx';
import { Achievements } from './Achievements.jsx';

/**
 * ClassicTemplate — Polished, recruiter-quality ATS resume.
 *
 * Design principles:
 * - Arial font for identical screen/PDF rendering via Puppeteer
 * - All sizing in pt/mm so the PDF export is pixel-identical
 * - No icons, no colors, no decorative graphics — pure ATS
 * - pageBreakInside: avoid per section entry prevents orphan headings
 * - Clickable hyperlinks in both Preview and exported PDF
 */
export const ClassicTemplate = ({ data }) => {
  if (!data) return null;

  const defaultOrder = [
    'summary', 'experience', 'education',
    'projects', 'skills', 'certifications',
    'achievements', 'leadership',
  ];
  const sectionOrder = data.layout?.sectionOrder?.length
    ? data.layout.sectionOrder
    : defaultOrder;

  const compressionLevel = data.metadata?.compressionLevel || 0;
  const isCompressed = compressionLevel >= 1;

  return (
    <div
      className={`bg-white print:shadow-none mx-auto px-[15mm] print:py-0 ${isCompressed ? 'py-[8mm]' : 'py-[12mm]'}`}
      style={{
        width: '210mm',
        boxSizing: 'border-box',
        fontFamily: '"Arial", "Helvetica", sans-serif',
        fontSize: '9pt',
        color: '#1e293b',
        lineHeight: isCompressed ? '1.3' : '1.4',
      }}
    >
      {/* ── Compression Styles ── */}
      {isCompressed && (
        <style>{`
          div[style*="marginBottom: 10px"] { margin-bottom: 6px !important; }
          div[style*="marginBottom: 7px"] { margin-bottom: 4px !important; }
          h2 { margin-bottom: 2px !important; padding-bottom: 2px !important; }
        `}</style>
      )}

      {/* ── Header ── */}
      <Header data={data.candidate} />

      {/* ── Sections ── */}
      {sectionOrder.map((key) => {
        let element = null;
        switch (key) {
          case 'summary':
            if (data.professionalSummary?.value) element = <Summary key="summary" data={data.professionalSummary} />;
            break;
          case 'experience':
            if (data.experience?.length > 0) element = <Experience key="experience" data={data.experience} />;
            break;
          case 'education':
            if (data.education?.length > 0) element = <Education key="education" data={data.education} />;
            break;
          case 'projects':
            if (data.projects?.length > 0) element = <Projects key="projects" data={data.projects} />;
            break;
          case 'skills':
            if (data.skills && Object.values(data.skills).some((arr) => arr?.length > 0)) element = <Skills key="skills" data={data.skills} />;
            break;
          case 'certifications':
            if (data.certifications?.length > 0) element = <Certifications key="certifications" data={data.certifications} />;
            break;
          case 'achievements':
            if (data.achievements?.length > 0) element = <Achievements key="achievements" data={data.achievements} sectionTitle="Achievements" />;
            break;
          case 'leadership':
            if (data.leadership?.length > 0) element = <Achievements key="leadership" data={data.leadership} sectionTitle="Leadership & Activities" />;
            break;
        }
        
        return element ? <div key={key} data-section={key}>{element}</div> : null;
      })}
    </div>
  );
};
