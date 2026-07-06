import { dataFetchTools } from '../tools/dataFetchTools.js';
import logger from '../../utils/logger.js';

class ContextBuilder {
  /**
   * Build minimal required context for the requested agent and user intent.
   * @param {string} userId
   * @param {string} agentName
   * @param {string} intent
   * @param {string} query
   * @returns {Object} Context object to be passed to the agent
   */
  async buildContext(userId, agentName, intent, query) {
    logger.info(`[ContextBuilder] Assembling context for ${agentName} (Intent: ${intent})`);
    
    const context = {};

    try {
      if (agentName === 'Resume') {
        context.resume = await dataFetchTools.fetchLatestResume(userId, query);
      } 
      else if (agentName === 'Interview') {
        context.interviews = await dataFetchTools.fetchInterviewHistory(userId, 3);
      } 
      else if (agentName === 'Job') {
        context.applications = await dataFetchTools.fetchApplications(userId, 5);
        context.jobs = await dataFetchTools.fetchJobs(userId, 5);
      } 
      else if (agentName === 'Coding') {
        // Fallback for Coding agent since tools don't explicitly have coding data fetcher yet
        // A placeholder for now
        context.codingHistory = []; 
      }
      else {
        // Career or generic agent
        context.profile = await dataFetchTools.fetchProfileInformation(userId);
      }
    } catch (error) {
      logger.error(`[ContextBuilder] Error fetching context for ${agentName}: ${error.message}`);
      context.error = 'Failed to load some required context.';
    }

    return context;
  }
}

export const contextBuilder = new ContextBuilder();
