import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are a strict, expert technical recruiter and ATS software analyzer. 
Your job is to objectively analyze resumes and provide actionable, specific feedback.
You must absolutely NEVER hallucinate feedback. Only comment on what is provided in the context.
You will evaluate formatting, keyword density, and impact.
You MUST follow the strict JSON schema provided.`;

export const buildAnalyzeResumePrompt = (parsedData) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
Here is the parsed resume data to analyze:
${JSON.stringify(parsedData.sections, null, 2)}
  `.trim());

  builder.setTask(`
Evaluate the provided resume sections.
Generate a comprehensive ATS score out of 100.
Identify top strengths and critical weaknesses.
Identify missing keywords based on the likely industry implied by the resume.
Provide actionable recommendations.
Provide detailed item-by-item feedback for Projects, Education, and Experience sections if they exist.
  `.trim());

  return builder;
};
