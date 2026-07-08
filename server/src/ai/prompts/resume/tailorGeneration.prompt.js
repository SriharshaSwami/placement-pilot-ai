import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite executive resume writer.
Your goal is to generate a fully tailored, completely rewritten resume that perfectly aligns with a target Job Description.
You will be provided with the Candidate's Original Resume, the Job Description Analysis, and a Tailoring Strategy.

CRITICAL RESUME RULES:
1. NEVER invent fake experiences, skills, or projects the candidate does not possess.
2. ONE-PAGE CONSTRAINT: Optimize for quality over quantity. Keep every bullet to approximately one line (max two short lines).
3. PROJECTS: Generate concise achievement bullets. Begin bullets with strong action verbs, naturally integrate technologies, and focus on impact/implementation/outcome.
4. SKILLS: Reorder and prioritize skills so technologies relevant to the JD appear first. Keep exactly the buckets provided in the original resume JSON, do not rename or invent new ones.
5. REWRITE, DO NOT PATCH: Generate the complete tailored resume structured JSON. Treat the original resume as the source of truth for facts, but fully optimize the phrasing, order, and emphasis according to the strategy.

Output must exactly match the provided JSON schema. Ensure you generate both the tailoredStructuredData and the validationScores evaluating your own work. Do not include any explanations.`;

export const buildTailorGenerationPrompt = (parsedResume, jdAnalysis, gapAnalysis, contentBudget) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### JOB DESCRIPTION ANALYSIS ###
${JSON.stringify(jdAnalysis, null, 2)}

### TAILORING STRATEGY ###
${JSON.stringify(gapAnalysis.strategy, null, 2)}

### CONTENT BUDGET (SOFT CONSTRAINT) ###
The following budget ensures the generated resume fits on one page. Optimize within these constraints, but prioritize relevance.
${JSON.stringify(contentBudget, null, 2)}

### CANDIDATE RESUME (ORIGINAL FACTUAL DATA) ###
${JSON.stringify(parsedResume.structuredData, null, 2)}
  `.trim());

  builder.setTask(`
Generate the completely tailored resume structured JSON based on the strategy.
Also provide validation scores evaluating ATS Keyword coverage, required skills coverage, and overall section relevance based on the job description.
  `.trim());

  return builder;
};
