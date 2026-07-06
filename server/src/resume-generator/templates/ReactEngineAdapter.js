import Template from './Template.interface.js';
import puppeteerRenderer from '../renderer/PuppeteerRenderer.js';

export class ReactEngineAdapter extends Template {
  constructor(frontendBaseUrl = 'http://localhost:5173') {
    super();
    this.frontendBaseUrl = frontendBaseUrl;
  }

  get id() {
    return 'react-engine-adapter';
  }

  /**
   * Unlike traditional backend templates that return an HTML string, 
   * this adapter delegates the actual rendering directly to Puppeteer 
   * to leverage the rich frontend React component engine.
   * 
   * @param {Object} resumeJson 
   * @param {string} templateId
   * @returns {Promise<Buffer>} The generated PDF buffer directly
   */
  async render(resumeJson, templateId = 'classic') {
    const url = `${this.frontendBaseUrl}/resume/render-shell`;
    // We bypass the abstract string step and directly return the rendered PDF 
    // because Puppeteer + React is an integrated pipeline.
    return puppeteerRenderer.renderPdf(url, resumeJson, templateId);
  }
}

export default new ReactEngineAdapter();
