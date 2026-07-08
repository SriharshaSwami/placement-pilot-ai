import puppeteer from 'puppeteer';

const A4_HEIGHT_PX = 1122;
const FRONTEND_URL = process.env.VITE_API_URL 
  ? process.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5173'; // Fallback for dev

class ResumeFitService {
  /**
   * Evaluates the rendered height of a resume and determines overflow.
   * @param {Object} structuredData The structured resume JSON
   * @param {string} templateId The template ID (e.g., 'classic')
   * @returns {Promise<Object>} Fit report
   */
  async evaluateFit(structuredData, templateId = 'classic') {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // We only care about height, but give it a standard A4 width viewport
      await page.setViewport({ width: 794, height: A4_HEIGHT_PX, deviceScaleFactor: 1 });
      
      const url = `${FRONTEND_URL}/resume/render-shell`;
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Inject the JSON payload
      await page.evaluate(({ json, templateId }) => {
        return new Promise((resolve) => {
          if (window.renderResume) {
            window.renderResume(json, templateId);
            const checkReady = setInterval(() => {
              if (document.getElementById('render-complete')) {
                clearInterval(checkReady);
                resolve();
              }
            }, 50);
            setTimeout(() => { clearInterval(checkReady); resolve(); }, 5000);
          } else {
            resolve();
          }
        });
      }, { json: structuredData, templateId });

      // Buffer for fonts/styles to fully settle
      await new Promise(r => setTimeout(r, 500));

      // Measure the DOM
      const fitReport = await page.evaluate(() => {
        const twin = document.getElementById('resume-measurement-twin');
        if (!twin) {
          return {
            fits: true,
            error: 'Measurement twin not found',
            totalRenderedHeight: 0,
            availableA4Height: 1122,
            overflowPixels: 0,
            remainingPixels: 1122,
            overflowSections: []
          };
        }

        const totalHeight = twin.scrollHeight;
        const availableHeight = 1122; // Hardcoded A4 at 96 DPI
        const overflowPixels = totalHeight - availableHeight;
        
        const overflowSections = [];
        
        // Find all sections wrapped with data-section inside the twin
        const sections = twin.querySelectorAll('[data-section]');
        sections.forEach(section => {
          const sectionId = section.getAttribute('data-section');
          const top = section.offsetTop;
          const bottom = top + section.clientHeight;
          
          if (bottom > availableHeight) {
            overflowSections.push({
              section: sectionId,
              top,
              bottom,
              overflowAmount: Math.max(0, bottom - availableHeight)
            });
          }
        });

        return {
          fits: totalHeight <= availableHeight,
          totalRenderedHeight: totalHeight,
          availableA4Height: availableHeight,
          overflowPixels: Math.max(0, overflowPixels),
          remainingPixels: Math.max(0, availableHeight - totalHeight),
          overflowSections
        };
      });

      return fitReport;

    } catch (error) {
      console.error('[ResumeFitService] Error evaluating fit:', error);
      throw new Error(`Fit evaluation failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

export default new ResumeFitService();
