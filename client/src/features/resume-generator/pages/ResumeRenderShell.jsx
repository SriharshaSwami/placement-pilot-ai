import React, { useState, useEffect, useCallback } from 'react';
import { ResumeLayoutEngine } from '../components/ResumeLayoutEngine.jsx';

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
    // Ensure we render in Light mode for PDF Generation
    document.documentElement.classList.remove('dark');
    
    // Expose a global function for Puppeteer to call
    window.renderResume = (json, selectedTemplate = 'classic', resumeTitle = 'Resume') => {
      setStructuredData(json);
      setTemplateId(selectedTemplate);
      
      // Inject metadata for the PDF
      const candidateName = json?.candidate?.name?.value || 'Candidate';
      document.title = `${candidateName} - ${resumeTitle}`;
      
      let metaAuthor = document.querySelector('meta[name="author"]');
      if (!metaAuthor) {
        metaAuthor = document.createElement('meta');
        metaAuthor.name = 'author';
        document.head.appendChild(metaAuthor);
      }
      metaAuthor.content = candidateName;

      // Give React a tick to mount the DOM before triggering optimization
      setTimeout(() => {
        setIsReady(true);
      }, 100);
    };

    return () => {
      delete window.renderResume;
    };
  }, []);

  const handleOptimizationComplete = useCallback((finalLevel) => {
    // Puppeteer waits for this element
    if (!document.getElementById('render-complete')) {
      const div = document.createElement('div');
      div.id = 'render-complete';
      // finalLevel is always 0 now, as optimization is removed
      div.setAttribute('data-fit-level', 0);
      document.body.appendChild(div);
    }
  }, []);

  useEffect(() => {
    if (isReady) {
      handleOptimizationComplete(0);
    }
  }, [isReady, handleOptimizationComplete]);

  if (!structuredData) {
    return <div id="waiting-for-data">Waiting for data injection...</div>;
  }

  return (
    // Hard-constrain to exactly one A4 page (794×1123px @ 96dpi).
    // overflow:hidden ensures Puppeteer CANNOT paginate anything onto a second page.
    <div
      id="resume-canvas"
      className={isReady ? 'ready' : 'rendering'}
      style={{
        width:  794,
        height: 1123,
        overflow: 'hidden',
        background: '#fff',
        position: 'relative',
      }}
    >
      <ResumeLayoutEngine structuredData={structuredData} templateId={templateId} />
    </div>
  );
};

export default ResumeRenderShell;
