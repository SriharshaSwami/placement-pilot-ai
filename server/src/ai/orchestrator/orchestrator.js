import logger from '../../utils/logger.js';
import { decisionEngine } from './decisionEngine.js';
import agentRegistry from './agentRegistry.js';
import { contextBuilder } from './contextBuilder.js';

class Orchestrator {
  /**
   * Determine the user's intent using lightweight rule-based intent detection.
   */
  detectIntent(query) {
    const text = query.toLowerCase();
    
    if (text.includes('resume') || text.includes('cv') || text.includes('cover letter')) {
      return { agent: 'Resume', action: 'tailor_or_review' };
    }
    
    if (text.includes('interview') || text.includes('mock') || text.includes('questions')) {
      return { agent: 'Interview', action: 'practice_or_prep' };
    }
    
    if (text.includes('job') || text.includes('application') || text.includes('apply') || text.includes('role')) {
      return { agent: 'Job', action: 'search_or_track' };
    }
    
    if (text.includes('code') || text.includes('coding') || text.includes('algorithm') || text.includes('leetcode')) {
      return { agent: 'Coding', action: 'practice_or_debug' };
    }
    
    if (text.includes('career') || text.includes('path') || text.includes('roadmap') || text.includes('skills')) {
      return { agent: 'Career', action: 'plan_or_advise' };
    }
    
    // Default fallback
    return { agent: 'Career', action: 'general_advice' };
  }

  async handleQuery(userId, query) {
    logger.info(`[Orchestrator] Received query from user ${userId}: "${query}"`);

    // 1. Determine Intent
    const { agent, action } = this.detectIntent(query);
    
    logger.info(`[Orchestrator] Intent detected -> Selected Agent: ${agent}, Action: ${action}`);

    // 2. Decide if AI is required
    const requiresAi = decisionEngine.requiresAi(query);

    // 3. Build Context using Context Builder
    const context = await contextBuilder.buildContext(userId, agent, action, query);

    // 4. Execute the selected Agent
    const targetAgent = agentRegistry.getAgent(`${agent}Agent`);
    let agentResult = { reply: '', source: 'Unknown' };
    
    if (targetAgent) {
      // Execute the agent, passing requiresAi and userId
      agentResult = await targetAgent.execute(query, context, requiresAi, userId);
    } else {
      agentResult.reply = `I'm sorry, the ${agent} Agent is currently unavailable.`;
    }

    // 4. Return the response
    const response = {
      reply: agentResult.reply,
      metadata: {
        intent: action,
        agentsUsed: [`${agent}Agent`],
        requiresAi: requiresAi,
        source: agentResult.source
      }
    };

    return response;
  }
}

export default new Orchestrator();
