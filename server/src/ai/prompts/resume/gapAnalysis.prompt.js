import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite career strategist and resume expert.
Your goal is to compare a candidate's original resume to the requirements of a target Job Description.
Identify the strong matches, missing elements, and formulate a strategy for the perfect tailored resume.
Output must exactly match the provided JSON schema. Do not include any explanations.`;

export const buildGapAnalysisPrompt = (parsedResume, jdAnalysis) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### TARGET JOB DESCRIPTION (ANALYSIS) ###
${JSON.stringify(jdAnalysis, null, 2)}

### CANDIDATE RESUME (ORIGINAL) ###
${JSON.stringify(parsedResume.structuredData, null, 2)}
  `.trim());

  builder.setTask(`
Perform a gap analysis between the candidate's resume and the job requirements.
Identify strong matches, partial matches, missing keywords, and missing emphasis.
Formulate a "strategy" for tailoring: what projects to highlight, which bullets to promote, which technologies to prioritize, and what content must be preserved as-is to remain factual.
Output the analysis in JSON format conforming to the schema.
  `.trim());

  return builder;
};
