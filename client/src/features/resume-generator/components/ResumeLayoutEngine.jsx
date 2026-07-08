import React, { useRef, useEffect } from 'react';
import { ResumeTemplateEngine } from './ResumeTemplateEngine.jsx';

/**
 * ResumeLayoutEngine
 *
 * A shared wrapper that enforces exact A4 dimensions for the resume.
 * This guarantees the live preview and the PDF export use identical layouts.
 *
 * @param {Object} structuredData - The structured resume JSON.
 * @param {string} templateId - The selected template identifier.
 * @param {Function} [onOverflowChange] - Callback to report whether content exceeds one A4 page.
 */
export const ResumeLayoutEngine = ({ structuredData, templateId, onOverflowChange }) => {
  // measureRef wraps an IDENTICAL copy of the template with NO overflow:hidden
  // so we can measure the true rendered content height for the overflow indicator.
  const measureRef = useRef(null);

  useEffect(() => {
    if (!measureRef.current || !onOverflowChange) return;

    // A4 at 96 DPI = 1122.52px. Use 1122 as the exact threshold.
    const A4_HEIGHT_PX = 1122;

    const observer = new ResizeObserver(() => {
      if (measureRef.current) {
        onOverflowChange(measureRef.current.scrollHeight > A4_HEIGHT_PX);
      }
    });

    observer.observe(measureRef.current);
    return () => observer.disconnect();
  }, [structuredData, onOverflowChange]);

  return (
    <>
      {/* ── Visible A4 canvas — hard-clamped to one page ── */}
      <div
        className="resume-a4-page shadow-xl bg-white print:shadow-none"
        style={{
          width: '210mm',
          height: '297mm',
          overflow: 'hidden',
          boxSizing: 'border-box',
          position: 'relative',
          margin: '0 auto',
          colorScheme: 'light',
          forcedColorAdjust: 'none',
          WebkitPrintColorAdjust: 'exact',
        }}
      >
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <ResumeTemplateEngine structuredData={structuredData} templateId={templateId} />
        </div>
      </div>

      {/* ── Invisible measurement twin — no overflow constraint ── */}
      <div
        id="resume-measurement-twin"
        ref={measureRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
            width: '210mm',
            top: 0,
            left: '-9999px',
            overflow: 'visible',
          }}
        >
          <ResumeTemplateEngine structuredData={structuredData} templateId={templateId} />
        </div>
    </>
  );
};
