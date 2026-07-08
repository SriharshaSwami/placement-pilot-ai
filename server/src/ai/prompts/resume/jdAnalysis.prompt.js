import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite technical recruiter and hiring manager.
Your task is to perform a deep analysis of a Job Description (JD).
Extract the required skills, preferred skills, technologies, soft skills, and core responsibilities.
Additionally, read between the lines to identify the engineering priorities, ATS keywords, seniority expectations, and hidden signals (e.g., specific architectures, methodologies, or domains they care about).

Output must exactly match the provided JSON schema. Do not include any explanations.`;

export const buildJDAnalysisPrompt = (job) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### JOB DESCRIPTION ###
Company: ${job.company}
Role: ${job.role}
Text:
${job.extractedText || job.description}
  `.trim());

  builder.setTask(`
Extract structured information from the job description and output it in JSON format conforming to the schema.
  `.trim());

  return builder;
};
