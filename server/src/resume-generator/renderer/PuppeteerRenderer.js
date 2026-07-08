import puppeteer from 'puppeteer';
import ResumeRenderer from './ResumeRenderer.interface.js';

// A4 at 96 DPI: 210mm × 297mm
const A4_WIDTH_PX  = 794;   // 210mm @ 96dpi
const A4_HEIGHT_PX = 1123;  // 297mm @ 96dpi

export class PuppeteerRenderer extends ResumeRenderer {
  async renderPdf(url, jsonPayload, templateId = 'classic') {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // Match the exact pixel dimensions the preview uses so there is
      // zero layout reflow between preview and PDF export.
      await page.setViewport({ width: A4_WIDTH_PX, height: A4_HEIGHT_PX, deviceScaleFactor: 1 });
      
      // Navigate to the shell route
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Inject the JSON payload to render the resume
      await page.evaluate(({ json, templateId }) => {
        return new Promise((resolve) => {
          // Check if the global function is exposed
          if (window.renderResume) {
            window.renderResume(json, templateId);
            
            // Wait for the shell to signal readiness
            const checkReady = setInterval(() => {
              if (document.getElementById('render-complete')) {
                clearInterval(checkReady);
                resolve();
              }
            }, 50);

            // Safety timeout after 5s
            setTimeout(() => { clearInterval(checkReady); resolve(); }, 5000);
          } else {
            resolve();
          }
        });
      }, { json: jsonPayload, templateId });

      // Buffer for fonts/styles to fully settle
      await new Promise(r => setTimeout(r, 800));

      // --- RENDERER VALIDATION STEP ---
      const validationReport = await page.evaluate((a4Height) => {
        const twin = document.getElementById('resume-measurement-twin');
        if (!twin) return { isValid: false, reason: 'Measurement twin not found. Cannot validate layout.' };

        const totalHeight = twin.scrollHeight;
        
        // 1. Check Overflow
        if (totalHeight > a4Height) {
          return { isValid: false, reason: `Layout overflows A4 page height (${totalHeight}px > ${a4Height}px).` };
        }

        // 2. Check Excessive Whitespace
        if (totalHeight < a4Height * 0.70) {
          // The user mentioned rejecting on major whitespace imbalance, but allowed a warning option.
          // Since the prompt says "Reject layouts where... major whitespace imbalance exists", we will reject it.
          // Wait, the user approved the plan where I asked if it should be a warning, but they just said "approved". 
          // Let's stick to the strict prompt: "Reject layouts where... major whitespace imbalance exists".
          return { isValid: false, reason: `Excessive whitespace detected. Resume only fills ${Math.round((totalHeight/a4Height)*100)}% of the page.` };
        }

        return { isValid: true };
      }, A4_HEIGHT_PX);

      if (!validationReport.isValid) {
        throw new Error(`Render Validation Failed: ${validationReport.reason}`);
      }
      // ---------------------------------

      const pdfBuffer = await page.pdf({
        // Use explicit pixel dimensions — do NOT use format:'A4' together with
        // preferCSSPageSize as they can conflict. We own the dimensions here.
        width:  `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
        // Clamp to exactly one page — content is already constrained by the shell
        pageRanges: '1',
      });

      return pdfBuffer;
    } catch (error) {
      console.error('[PuppeteerRenderer] Critical Error generating PDF:', error.stack || error);
      throw new Error(`PDF Generation failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async renderDocx() {
    throw new Error('DOCX rendering not implemented yet.');
  }
}

export default new PuppeteerRenderer();
