/**
 * ResumeRenderer Interface
 * 
 * Defines the contract for taking rendered template output (like HTML) 
 * and transforming it into the final destination format (PDF, DOCX, etc).
 */
class ResumeRenderer {
  constructor() {
    if (new.target === ResumeRenderer) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  /**
   * Generates a PDF Buffer from the template content.
   * 
   * @param {string} content - The processed template content (e.g. HTML)
   * @returns {Promise<Buffer>} The PDF Buffer
   */
  async renderPdf(content) {
    throw new Error("Method 'renderPdf()' must be implemented.");
  }

  /**
   * Generates a DOCX Buffer from the template content.
   * 
   * @param {string} content - The processed template content
   * @returns {Promise<Buffer>} The DOCX Buffer
   */
  async renderDocx(content) {
    throw new Error("Method 'renderDocx()' must be implemented.");
  }
}

export default ResumeRenderer;
