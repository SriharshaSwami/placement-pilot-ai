/**
 * Template Interface
 * 
 * Defines the contract that all concrete resume templates must implement.
 * The Single Source of Truth for data is always the canonical structuredData from Resume JSON.
 */
class Template {
  constructor() {
    if (new.target === Template) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  /**
   * Defines the ID of the template.
   * @returns {string}
   */
  get id() {
    throw new Error("Method 'id' must be implemented.");
  }

  /**
   * Renders the template into a standard intermediate representation (e.g., HTML string).
   * 
   * @param {Object} resumeJson - The structuredData from the canonical Resume JSON
   * @returns {Promise<string>} The rendered string payload
   */
  async render(resumeJson) {
    throw new Error("Method 'render()' must be implemented.");
  }
}

export default Template;
