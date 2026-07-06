import React, { useState, useEffect } from 'react';
import { ResumeTemplateEngine } from '../components/ResumeTemplateEngine.jsx';

/**
 * ResumeRenderShell
 * 
 * A hidden route meant specifically for Puppeteer. It exposes `window.renderResume`
 * which the backend injects to render a resume synchronously.
 */
const ResumeRenderShell = () => {
  const [structuredData, setStructuredData] = useState(null);
  const [templateId, setTemplateId] = useState('classic');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Expose a global function for Puppeteer to call
    window.renderResume = (json, selectedTemplate = 'classic') => {
      setStructuredData(json);
      setTemplateId(selectedTemplate);
      // Give React a tick to mount the DOM before marking ready
      setTimeout(() => {
        setIsReady(true);
        // We can add a DOM element that Puppeteer waits for
        const div = document.createElement('div');
        div.id = 'render-complete';
        document.body.appendChild(div);
      }, 100);
    };

    return () => {
      delete window.renderResume;
    };
  }, []);

  if (!structuredData) {
    return <div id="waiting-for-data">Waiting for data injection...</div>;
  }

  return (
    <div className="bg-white" style={{ width: '100%', height: '100%' }}>
      {/* 
        This div wraps the engine. 
        It ensures there are no margins/padding that would mess up the A4 print.
      */}
      <div id="resume-canvas" className={isReady ? 'ready' : 'rendering'}>
        <ResumeTemplateEngine structuredData={structuredData} templateId={templateId} />
      </div>
    </div>
  );
};

export default ResumeRenderShell;
