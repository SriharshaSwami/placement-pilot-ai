import BaseAgent from './BaseAgent.js';
import geminiAdapter from '../adapters/gemini.adapter.js';
import { PromptBuilder } from '../utils/promptBuilder.js';
import { aiCache } from '../utils/aiCache.js';

class GenericDomainAgent extends BaseAgent {
  constructor(name, description, roleSystemPrompt) {
    super(name, [description]);
    this.roleSystemPrompt = roleSystemPrompt;
  }

  async execute(query, context = {}, requiresAi = true, userId) {
    // 1. Context check: Check if required context was provided but failed
    if (this.name === 'ResumeAgent') {
      if (context.resume && context.resume.message === 'No resume found.') {
        return {
          reply: "I noticed you haven't uploaded a resume yet. Please upload your resume in the dashboard so I can assist you better!",
          source: 'Internal Data'
        };
      }
    }

    // 2. Decision Engine: Check if AI is required
    if (!requiresAi) {
      return {
        reply: `Data retrieved successfully by ${this.name}:\n\n${JSON.stringify(context, null, 2)}`,
        source: 'Internal Data'
      };
    }

    // 3. Check Cache before calling Gemini
    const cacheKey = aiCache.generateKey(this.name, query, context);
    const cachedResponse = await aiCache.get(cacheKey);
    
    if (cachedResponse) {
      return {
        reply: cachedResponse,
        source: 'Cached Response'
      };
    }

    // 4. Gemini: Reason over the data
    const builder = new PromptBuilder(this.roleSystemPrompt);
    
    // Inject Multi-Agent Context securely and dynamically
    builder.setAgentContext(this.name, context);
    builder.setTask(`User Query: ${query}`);

    // Since these are conversational outputs (not strict JSON data extraction), we use standard text generation
    const responseText = await geminiAdapter.generateContent(
      builder.buildContent(),
      builder.getSystemInstruction()
    );

    // 5. Save the generated response to cache
    await aiCache.set(cacheKey, responseText);

    return {
      reply: responseText,
      source: 'Gemini AI'
    };
  }
}

export const ResumeAgent = new GenericDomainAgent(
  'ResumeAgent', 
  'Reviews and improves resumes.', 
  'You are the Resume Agent. Analyze the user query and provide specific, actionable resume feedback based on the provided RAG context and Memory.'
);

export const InterviewAgent = new GenericDomainAgent(
  'InterviewAgent', 
  'Handles interview prep and mock questions.', 
  'You are the Interview Agent. Provide mock interview questions, behavioral feedback, or technical communication coaching.'
);

export const CodingAgent = new GenericDomainAgent(
  'CodingAgent', 
  'Provides coding hints and complexity analysis.', 
  'You are the Coding Agent. Review algorithms, provide hints (never raw solutions), and analyze Big-O complexity.'
);

export const CareerAgent = new GenericDomainAgent(
  'CareerAgent', 
  'Provides general career advice and roadmapping.', 
  'You are the Career Agent. Give strategic career advice, roadmap adjustments, and general guidance.'
);

export const JobAgent = new GenericDomainAgent(
  'JobAgent', 
  'Matches candidates to jobs and provides application insights.', 
  'You are the Job Agent. Provide strategies for job applications, company-specific advice, and role-matching.'
);

export const AnalyticsAgent = new GenericDomainAgent(
  'AnalyticsAgent', 
  'Interprets placement readiness and progress data.', 
  'You are the Analytics Agent. Synthesize user progress data into motivational or corrective insights.'
);
