class BaseAgent {
  constructor(name, capabilities) {
    this.name = name;
    this.capabilities = capabilities;
  }

  /**
   * Execute the agent's logic.
   * @param {string} query - The user's query or the output from a previous agent in the sequence.
   * @param {object} context - Consolidated context (Memory, RAG, User Profile, Analytics).
   * @returns {string} - The agent's response/output.
   */
  async execute(query, context) {
    throw new Error(`Agent ${this.name} must implement execute()`);
  }
}

export default BaseAgent;
