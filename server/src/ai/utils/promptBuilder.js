import { agentTemplates } from '../agents/templates.js';

export class PromptBuilder {
  constructor(systemPrompt = '') {
    this.systemPrompt = systemPrompt;
    this.agentContext = '';
    this.ragContext = '';
    this.memoryContext = '';
    this.context = '';
    this.task = '';
  }

  setAgentContext(agentName, contextObj) {
    if (agentTemplates[agentName]) {
      this.agentContext = agentTemplates[agentName](contextObj);
    }
    
    if (contextObj.ragContext) {
      this.ragContext = contextObj.ragContext;
    }
    
    if (contextObj.memoryContext) {
      this.memoryContext = contextObj.memoryContext;
    }
    
    return this;
  }

  setTask(task) {
    this.task = task;
    return this;
  }

  setContext(context) {
    this.context = context;
    return this;
  }

  getSystemInstruction() {
    return this.systemPrompt;
  }

  buildContent() {
    const parts = [];
    
    if (this.context) {
      parts.push(`--- CONTEXT ---\n${this.context}`);
    }

    if (this.agentContext) {
      parts.push(`--- RELEVANT CONTEXT ---\n${this.agentContext}`);
    }
    
    if (this.ragContext) {
      parts.push(`--- KNOWLEDGE BASE (RAG) ---\n${this.ragContext}`);
    }
    
    if (this.memoryContext) {
      parts.push(`--- SEMANTIC MEMORY ---\n${this.memoryContext}`);
    }

    if (this.task) {
      parts.push(`--- TASK ---\n${this.task}`);
    }
    
    return parts.join('\n\n');
  }
}
