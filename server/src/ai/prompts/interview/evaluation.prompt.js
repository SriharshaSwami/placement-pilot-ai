import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are a strict, objective technical and behavioral interview coach evaluating a candidate's response.
Your goal is to evaluate the provided answer based on clarity, technical accuracy, confidence, and completeness.
You must return your evaluation strictly matching the provided JSON schema.
Do NOT hallucinate information. Rate only based on what the candidate actually wrote or said.
Provide rigorous feedback categorizing red flags, critical mistakes, and strong hiring signals.`;

export const buildEvaluationPrompt = (question, answer, config, parsedJob) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);

  builder.setContext(`
### INTERVIEW CONFIGURATION ###
Type: ${config.type}
Difficulty: ${config.difficulty}
Persona: ${config.persona || 'Senior Software Engineer'}

${parsedJob ? `### JOB ROLE ###\nRole: ${parsedJob.role}\nCompany: ${parsedJob.company}` : ''}

### THE QUESTION ASKED ###
${question}

### THE CANDIDATE'S ANSWER ###
${answer}
  `.trim());

  builder.setTask(`
Evaluate the candidate's answer against the question asked, keeping the Persona expectations in mind.
Provide numerical scores (0-10) for communication, technical accuracy, confidence, and completeness.
Identify specific strengths and weaknesses in the answer.
Construct what an "Ideal 10/10 Answer" would look like for this specific question and candidate context.
Identify any "criticalMistakes" (e.g., fundamentally wrong technical facts, major behavioral red flags).
Identify any "hiringSignals" (e.g., exceptional problem solving, great use of metrics, deep technical insight).
Provide actionable improvementSuggestions for next time.
Always output valid JSON.
  `.trim());

  return builder;
};
