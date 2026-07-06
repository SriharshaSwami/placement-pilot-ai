import CustomError from '../../errors/CustomError.js';

/**
 * Generator Service
 * 
 * Orchestrates the selection of a Template and a Renderer to build resumes from canonical JSON.
 */
class GeneratorService {
  /**
   * Generates a resume document.
   * 
   * @param {Object} resumeJson - Canonical structuredData from the resume
   * @param {Template} template - An instance of a concrete Template
   * @param {ResumeRenderer} renderer - An instance of a concrete ResumeRenderer
   * @param {string} format - The desired output format ('html', 'pdf', 'docx')
   * @returns {Promise<Buffer|string>} The rendered document
   */
  async generate(resumeJson, template, renderer, format = 'pdf', templateId = 'classic') {
    if (!resumeJson) {
      throw new CustomError('Resume JSON data is required for generation', 400, 'BAD_REQUEST');
    }

    try {
      // If using the React Engine Adapter, it handles the end-to-end PDF generation internally via Puppeteer.
      if (template.id === 'react-engine-adapter') {
        if (format.toLowerCase() !== 'pdf') {
          throw new CustomError('React engine adapter currently only supports PDF generation', 400, 'BAD_REQUEST');
        }
        return await template.render(resumeJson, templateId); // Returns PDF Buffer
      }

      // Fallback for traditional string-based templates
      const templateContent = await template.render(resumeJson);

      switch (format.toLowerCase()) {
        case 'html':
          return templateContent;
        case 'pdf':
          return await renderer.renderPdf(templateContent);
        case 'docx':
          return await renderer.renderDocx(templateContent);
        default:
          throw new CustomError(`Unsupported rendering format: ${format}`, 400, 'BAD_REQUEST');
      }
    } catch (error) {
      console.error(`[GeneratorService] Generation failed: ${error.message}`);
      throw new CustomError('Failed to generate resume', 500, 'GENERATION_FAILED');
    }
  }
}

export default new GeneratorService();
