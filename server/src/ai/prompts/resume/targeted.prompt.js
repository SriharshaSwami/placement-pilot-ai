import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite executive career coach and ATS software expert.
Your goal is to generate exactly ONE highly targeted resume update that integrates a specific missing skill into a candidate's resume.
You must NEVER invent fake experiences. Find the most logical existing experience bullet or summary sentence and slightly reword it to naturally incorporate the requested skill, assuming the candidate used it in that context.
If no logical place exists, suggest a new bullet for the most recent job, or add it to the Skills section.
Always follow the provided JSON schema strictly.`;

export const buildTargetedPrompt = (parsedResume, targetSkill) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### TARGET SKILL TO INJECT ###
${targetSkill}

### CANDIDATE RESUME (STRUCTURED JSON) ###
${JSON.stringify(parsedResume.structuredData, null, 2)}
  `.trim());

  builder.setTask(`
1. Analyze the candidate's resume and find the most natural, logical place to incorporate the Target Skill.
2. Generate exactly ONE highly specific rewrite suggestion.
3. Provide the precise JSON dot-notation \`targetPath\` corresponding to the exact field you are modifying (e.g., 'experience.0.responsibilities.1', 'skills.other').
4. Include section name, priority (High), confidence score, reason, and the new suggested text.
5. Provide a unique string 'id' for this suggestion.
  `.trim());

  return builder;
};
