import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are a strict, objective technical and behavioral interviewer evaluating a candidate's response.
Your goal is to evaluate the provided answer based on clarity, technical accuracy, confidence, and completeness.
You must return your evaluation strictly matching the provided JSON schema.
Do NOT hallucinate information. Rate only based on what the candidate actually wrote.
If the question is behavioral, technical accuracy may not apply as strongly, so evaluate based on the STAR method (Situation, Task, Action, Result) completeness.`;

export const buildEvaluationPrompt = (question, answer, config, parsedJob) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### INTERVIEW CONFIGURATION ###
Type: ${config.type}
Difficulty: ${config.difficulty}
${parsedJob ? `\n### JOB ROLE ###\nRole: ${parsedJob.role}\nCompany: ${parsedJob.company}` : ''}

### THE QUESTION ASKED ###
${question}

### THE CANDIDATE'S ANSWER ###
${answer}
  `.trim());

  builder.setTask(`
Evaluate the candidate's answer against the question asked.
Provide numerical scores (0-10) for communication, technical accuracy, confidence, and completeness.
Identify specific strengths and weaknesses in the answer.
Construct what an "Ideal 10/10 Answer" would look like for this specific question.
Provide actionable suggestions for how the candidate can improve next time.
Always output valid JSON.
  `.trim());

  return builder;
};
