import React from 'react';
import { Header } from './Header.jsx';
import { Summary } from './Summary.jsx';
import { Experience } from './Experience.jsx';
import { Education } from './Education.jsx';
import { Projects } from './Projects.jsx';
import { Skills } from './Skills.jsx';
import { Certifications } from './Certifications.jsx';

/**
 * ModernTemplate
 */
export const ModernTemplate = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white w-full max-w-[850px] shadow-lg print:shadow-none print:max-w-none mx-auto text-slate-800 font-sans border-t-8 border-primary-600 min-h-[1100px] print:min-h-0">
      <div className="p-10 print:px-10 print:py-0 space-y-6">
        <Header data={data.candidate} />
        
        {data.professionalSummary?.value && (
          <Summary data={data.professionalSummary} />
        )}
        
        {data.experience && data.experience.length > 0 && (
          <Experience data={data.experience} />
        )}
        
        {data.education && data.education.length > 0 && (
          <Education data={data.education} />
        )}
        
        {data.projects && data.projects.length > 0 && (
          <Projects data={data.projects} />
        )}
        
        {data.skills && Object.keys(data.skills).length > 0 && (
          <Skills data={data.skills} />
        )}
        
        {data.certifications && data.certifications.length > 0 && (
          <Certifications data={data.certifications} />
        )}
      </div>
    </div>
  );
};
