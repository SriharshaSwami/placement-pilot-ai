import intentClassifier from './intentClassifier.js';
import agentRegistry from './agentRegistry.js';
import memoryService from '../../services/memory.service.js';
import retriever from '../rag/retriever.js';
import { ContextBuilder } from '../rag/contextBuilder.js';
import AgentExecution from '../../models/AgentExecution.js';

class Orchestrator {
  async handleQuery(userId, query) {
    const startTime = Date.now();
    let executionRecord = {
      userId,
      query,
      intent: 'UNKNOWN',
      agentsUsed: [],
      status: 'Failed'
    };

    try {
      // 1. Detect Intent & Select Agents
      const classification = await intentClassifier.classify(query);
      executionRecord.intent = classification.intent;
      executionRecord.agentsUsed = classification.suggestedAgents;

      if (!classification.suggestedAgents || classification.suggestedAgents.length === 0) {
        throw new Error('No agents suggested by classifier.');
      }

      // 2. Build Multi-Modal Context (RAG + Semantic Memory)
      // We retrieve RAG chunks related to the query
      const ragChunks = await retriever.retrieve(query, userId, 5);
      const ragContext = ContextBuilder.buildContextString(ragChunks);

      // We retrieve all active semantic memory facts
      const memories = await memoryService.getAllMemories(userId);
      const memoryContext = memories.map(m => `- [${m.category}] ${m.fact} (Confidence: ${m.confidence}/10)`).join('\n');

      const sharedContext = {
        ragContext,
        memoryContext,
        previousAgentOutput: null
      };

      // 3. Sequential Multi-Agent Execution
      let finalOutput = '';
      let currentQuery = query;

      for (const agentName of classification.suggestedAgents) {
        const agent = agentRegistry.getAgent(agentName);
        if (!agent) {
          console.warn(`[Orchestrator] Requested agent ${agentName} not found in registry. Skipping.`);
          continue;
        }

        // Execute the agent. If it's the second agent in the chain, it gets the output of the first agent as context.
        const output = await agent.execute(currentQuery, sharedContext);
        
        sharedContext.previousAgentOutput = output; // Pass chain
        finalOutput = output; // The final agent's output is what the user sees
      }

      // 4. Log Observability Metrics
      const latencyMs = Date.now() - startTime;
      executionRecord.result = finalOutput;
      executionRecord.latencyMs = latencyMs;
      executionRecord.status = 'Success';
      
      await AgentExecution.create(executionRecord);

      return {
        reply: finalOutput,
        metadata: {
          intent: classification.intent,
          agentsUsed: classification.suggestedAgents,
          latencyMs
        }
      };

    } catch (error) {
      console.error('Orchestrator Error:', error);
      executionRecord.errorMessage = error.message;
      executionRecord.latencyMs = Date.now() - startTime;
      await AgentExecution.create(executionRecord);
      
      return {
        reply: "I'm sorry, I encountered an internal error while processing your request. My diagnostic logs have been updated.",
        metadata: { error: true }
      };
    }
  }
}

export default new Orchestrator();
