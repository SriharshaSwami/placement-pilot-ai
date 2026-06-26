import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are a strategic career advisor AI.
Your goal is to evaluate a candidate's job application and provide structured insights.
You will receive the application details, its timeline, the target job description (if available), and the candidate's primary resume (if available).
Evaluate the 'healthScore' based on momentum (how recently it was updated) and stage.
Provide actionable 'missingActions' and 'preparationSuggestions'.
Always output valid JSON according to the schema.`;

export const buildInsightsPrompt = (applicationData) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### APPLICATION DETAILS ###
Company: ${applicationData.company}
Role: ${applicationData.role}
Current Stage: ${applicationData.stage}
Application Date: ${applicationData.applicationDate || 'Unknown'}
Deadline: ${applicationData.deadline || 'Unknown'}
Priority: ${applicationData.priority}

### TIMELINE ###
${applicationData.statusHistory.map(h => `- Moved to ${h.stage} on ${new Date(h.date).toLocaleDateString()}`).join('\n')}

### JOB DESCRIPTION ###
${applicationData.jobId ? `Role: ${applicationData.jobId.role}\nCompany: ${applicationData.jobId.company}` : 'Generic Application'}

### LINKED ASSETS ###
Resume Attached: ${applicationData.resumeId ? 'Yes' : 'No'}
Tailoring Session: ${applicationData.tailoringSessionId ? 'Yes' : 'No'}
Interviews Conducted: ${applicationData.interviewSessionIds.length}
  `.trim());

  builder.setTask(`
Evaluate the application and generate strategic insights.
Determine the health score, missing actions, and risk level.
  `.trim());

  return builder;
};
