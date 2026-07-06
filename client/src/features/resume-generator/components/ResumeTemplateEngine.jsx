import React from 'react';
import { ClassicTemplate } from '../templates/ClassicTemplate/ClassicTemplate.jsx';
import { ModernTemplate } from '../templates/ModernTemplate/ModernTemplate.jsx';
import { MinimalTemplate } from '../templates/MinimalTemplate/MinimalTemplate.jsx';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate/ProfessionalTemplate.jsx';

/**
 * ResumeTemplateEngine
 * 
 * A wrapper component that receives the structuredData JSON from the backend
 * and routes it to the appropriate template component.
 */
export const ResumeTemplateEngine = React.memo(({ structuredData, templateId = 'classic' }) => {
  switch (templateId) {
    case 'modern':
      return <ModernTemplate data={structuredData} />;
    case 'minimal':
      return <MinimalTemplate data={structuredData} />;
    case 'professional':
      return <ProfessionalTemplate data={structuredData} />;
    case 'classic':
    default:
      return <ClassicTemplate data={structuredData} />;
  }
});
