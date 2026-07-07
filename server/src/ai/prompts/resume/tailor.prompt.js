import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite executive career coach and ATS software expert.
Your goal is to compare a candidate's resume to a specific job description and provide structured, objective analysis followed by actionable tailoring suggestions.
You must NEVER invent fake experiences or hallucinate skills the candidate does not possess.
You should rewrite existing bullet points or summaries to better align with the job's terminology and priorities, using ONLY the facts provided in the candidate's resume.
If a required skill is entirely missing from the resume, note it in the analysis but DO NOT fake it in the suggestions.

CRITICAL RESUME RULES:
1. ONE-PAGE CONSTRAINT: Optimize for quality over quantity. Keep every bullet to approximately one line (max two short lines). Prioritize impact and NEVER increase the number of bullets unless absolutely necessary.
2. PROJECTS: Never generate a project description paragraph. Each project MUST be driven by concise achievement bullets. By default, generate exactly 3 high-impact bullets per project in the \`bullets\` array (min 2 if content is limited, never more than 4). Begin bullets with strong action verbs, naturally integrate technologies, preserve ATS keywords, focus on impact/implementation/outcome, and avoid filler or repetition.
3. SKILLS: Preserve the candidate's engineering stack. Do NOT aggressively delete valid technologies. 
   - Reorder and prioritize skills within their existing 8 semantic buckets (languages, frontend, backend, databases, aiLlm, cloudDevOps, developerTools, coreConcepts) so that technologies relevant to the JD appear first.
   - You may only drop skills if they are completely irrelevant to the target job or if they are meaningless marketing phrases.
   - Never invent new skills the candidate doesn't have.
   - Do NOT create new buckets or modify the bucket names. Keep the exact 8 keys provided in the resume JSON.

Always follow the provided JSON schema strictly. Ensure project modifications target the \`bullets\` array.`;

const stripUnnecessaryData = (data) => {
  if (!data) return {};
  const { personalInfo, ...rest } = data;
  
  // Clean out long arrays of generic skills if needed, or just remove personalInfo to save tokens
  // Remove IDs and metadata
  const cleanData = JSON.parse(JSON.stringify(rest));
  
  if (cleanData.experience) {
    cleanData.experience = cleanData.experience.map(e => ({
      title: e.title,
      company: e.company,
      responsibilities: e.responsibilities
    }));
  }
  
  if (cleanData.projects) {
    cleanData.projects = cleanData.projects.map(p => ({
      title: p.title,
      technologies: p.technologies,
      bullets: p.bullets
    }));
  }
  
  if (cleanData.education) {
    cleanData.education = cleanData.education.map(e => ({
      degree: e.degree,
      major: e.major
    }));
  }

  return cleanData;
};

export const buildTailoringPrompt = (parsedResume, parsedJob) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  const optimizedResumeData = stripUnnecessaryData(parsedResume.structuredData);

  builder.setContext(`
### JOB DESCRIPTION ###
${JSON.stringify({
  company: parsedJob.company,
  role: parsedJob.role,
  extractedText: parsedJob.extractedText,
}, null, 2)}

### CANDIDATE RESUME (STRUCTURED JSON) ###
${JSON.stringify(optimizedResumeData, null, 2)}
  `.trim());

  builder.setTask(`
1. Analyze the match between the candidate's resume and the job description.
2. Generate an overall match percentage, identifying matched and missing skills/keywords.
3. Generate specific, targeted rewrite suggestions to tailor the resume to this specific job, strictly following the One-Page Constraint (concise, high-impact, max 1-2 lines per bullet).
4. For each suggestion, provide the precise JSON dot-notation \`targetPath\` corresponding to the exact field you are modifying (e.g., 'experience.0.responsibilities.1', 'professionalSummary', 'skills.languages').
5. Include section name, priority, confidence score, reason, and the new suggested text.
5. Provide a unique string 'id' for each suggestion.
  `.trim());

  return builder;
};
