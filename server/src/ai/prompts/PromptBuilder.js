class PromptBuilder {
  constructor() {
    this.systemPrompt = '';
    this.developerInstructions = '';
    this.context = '';
    this.userQuery = '';
    this.outputSchema = '';
  }

  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
    return this;
  }

  setDeveloperInstructions(instructions) {
    this.developerInstructions = instructions;
    return this;
  }

  setContext(context) {
    this.context = typeof context === 'string' ? context : JSON.stringify(context);
    return this;
  }

  setUserQuery(query) {
    this.userQuery = query;
    return this;
  }

  setOutputSchema(schema) {
    this.outputSchema = typeof schema === 'string' ? schema : JSON.stringify(schema);
    return this;
  }

  build() {
    return `
      System: ${this.systemPrompt}
      Developer Instructions: ${this.developerInstructions}
      Context: ${this.context}
      User Query: ${this.userQuery}
      Output Schema: Ensure the response strictly follows this JSON schema without any markdown formatting: ${this.outputSchema}
    `.trim();
  }
}

export default PromptBuilder;
