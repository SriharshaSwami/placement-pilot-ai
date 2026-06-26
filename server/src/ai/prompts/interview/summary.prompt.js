import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are a Principal Technical Interview Coach. 
Your goal is to evaluate the entire completed interview session and provide a comprehensive, objective, and deeply analytical final report.
You must return your evaluation strictly matching the provided JSON schema.
Ensure your scores reflect the rigorous standards of top-tier technology companies.`;

export const buildSummaryPrompt = (config, parsedResume, parsedJob, questionHistory) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);

  builder.setContext(`
### INTERVIEW CONFIGURATION ###
Type: ${config.type}
Difficulty: ${config.difficulty}
Persona: ${config.persona || 'Senior Software Engineer'}

### CANDIDATE RESUME ###
${parsedResume ? JSON.stringify(parsedResume.sections, null, 2) : 'No resume provided.'}

### TARGET JOB ###
${parsedJob ? `Role: ${parsedJob.role}\nCompany: ${parsedJob.company}` : 'Generic Interview'}

### INTERVIEW TRANSCRIPT & EVALUATIONS ###
${questionHistory.map((q, i) => `
--- Q${i+1} ---
Question: ${q.questionText}
Candidate Answer: ${q.candidateAnswer || 'No answer provided.'}
AI Evaluation of this answer:
${q.evaluation ? JSON.stringify(q.evaluation, null, 2) : 'None'}
`).join('\n')}
  `.trim());

  builder.setTask(`
Analyze the complete interview transcript and the individual evaluations for each answer.
Generate a comprehensive final report matching the JSON schema.

Requirements:
- Calculate rigorous overall and categorical scores out of 100.
- Provide a detailed 3-4 paragraph 'overallPerformance' summary that reads like professional coach feedback.
- Extract 'topStrengths' and 'weakestAreas' based on recurring patterns in the answers.
- Extract 'redFlags' (e.g., dishonesty, extreme lack of fundamental knowledge, poor attitude).
- Extract 'criticalMistakes' across the whole interview.
- Extract 'hiringSignals' (strong indicators that the candidate is a good hire).
- Extract 'excellentAnswers' and 'missedOpportunities' referencing specific parts of the interview.
- Propose 'topicsToStudy' and a step-by-step 'learningRoadmap'.
- Assess 'resumeIssuesObserved' if the candidate contradicted their resume or failed to explain something they claimed to know.
- Assign an 'interviewReadiness' label (e.g., "Not Ready", "Needs Practice", "Ready", "Strong Hire").

Always output valid JSON.
  `.trim());

  return builder;
};
