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

  return (
    <div
      className="bg-white print:shadow-none mx-auto px-[15mm] py-[12mm] print:py-0"
      style={{
        width: '210mm',
        boxSizing: 'border-box',
        fontFamily: '"Arial", "Helvetica", sans-serif',
        fontSize: '9pt',
        color: '#1e293b',
        lineHeight: '1.4',
      }}
    >
      {/* ── Header ── */}
      <Header data={data.candidate} />

      {/* ── Sections ── */}
      {sectionOrder.map((key) => {
        switch (key) {
          case 'summary':
            return data.professionalSummary?.value
              ? <Summary key="summary" data={data.professionalSummary} />
              : null;

          case 'experience':
            return data.experience?.length > 0
              ? <Experience key="experience" data={data.experience} />
              : null;

          case 'education':
            return data.education?.length > 0
              ? <Education key="education" data={data.education} />
              : null;

          case 'projects':
            return data.projects?.length > 0
              ? <Projects key="projects" data={data.projects} />
              : null;

          case 'skills':
            return data.skills &&
              Object.values(data.skills).some((arr) => arr?.length > 0)
              ? <Skills key="skills" data={data.skills} />
              : null;

          case 'certifications':
            return data.certifications?.length > 0
              ? <Certifications key="certifications" data={data.certifications} />
              : null;

          case 'achievements':
            return data.achievements?.length > 0
              ? <Achievements key="achievements" data={data.achievements} sectionTitle="Achievements" />
              : null;

          case 'leadership':
            return data.leadership?.length > 0
              ? <Achievements key="leadership" data={data.leadership} sectionTitle="Leadership & Activities" />
              : null;

          default:
            return null;
        }
      })}
    </div>
  );
};
