import puppeteer from 'puppeteer';
import ResumeRenderer from './ResumeRenderer.interface.js';

export class PuppeteerRenderer extends ResumeRenderer {
  async renderPdf(url, jsonPayload, templateId = 'classic') {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      
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
          } else {
            resolve();
          }
        });
      }, { json: jsonPayload, templateId });

      // Give a tiny buffer for styles to settle and fonts to load
      await new Promise(r => setTimeout(r, 500));

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
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
