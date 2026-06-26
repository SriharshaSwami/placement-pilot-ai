export class PromptBuilder {
  constructor(systemPrompt = '') {
    this.systemPrompt = systemPrompt;
    this.context = '';
    this.task = '';
  }

  setContext(context) {
    this.context = context;
    return this;
  }

  setTask(task) {
    this.task = task;
    return this;
  }

  getSystemInstruction() {
    return this.systemPrompt;
  }

  buildContent() {
    const parts = [];
    if (this.context) parts.push(`--- CONTEXT ---\n${this.context}`);
    if (this.task) parts.push(`--- TASK ---\n${this.task}`);
    return parts.join('\n\n');
  }
}
