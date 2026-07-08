import React from 'react';
import { ClassicTemplate } from '../templates/ClassicTemplate/ClassicTemplate.jsx';
export const ResumeTemplateEngine = React.memo(({ structuredData }) => {
  return <ClassicTemplate data={structuredData} />;
});
