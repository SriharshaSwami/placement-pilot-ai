import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite executive career coach and ATS software expert.
Your goal is to compare a candidate's resume to a specific job description and provide structured, objective analysis followed by actionable tailoring suggestions.
You must NEVER invent fake experiences or hallucinate skills the candidate does not possess.
You should rewrite existing bullet points or summaries to better align with the job's terminology and priorities, using ONLY the facts provided in the candidate's resume.
If a required skill is entirely missing from the resume, note it in the analysis but DO NOT fake it in the suggestions.
Always follow the provided JSON schema strictly.`;

export const buildTailoringPrompt = (parsedResume, parsedJob) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### JOB DESCRIPTION ###
${JSON.stringify({
  company: parsedJob.company,
  role: parsedJob.role,
  extractedText: parsedJob.extractedText,
}, null, 2)}

### CANDIDATE RESUME (STRUCTURED JSON) ###
${JSON.stringify(parsedResume.structuredData, null, 2)}
  `.trim());

  builder.setTask(`
1. Analyze the match between the candidate's resume and the job description.
2. Generate an overall match percentage, identifying matched and missing skills/keywords.
3. Generate specific, targeted rewrite suggestions to tailor the resume to this specific job.
4. For each suggestion, provide the precise JSON dot-notation \`targetPath\` corresponding to the exact field you are modifying (e.g., 'experience.0.responsibilities.1', 'professionalSummary', 'skills.languages').
5. Include section name, priority, confidence score, reason, and the new suggested text.
5. Provide a unique string 'id' for each suggestion.
  `.trim());

  return builder;
};
