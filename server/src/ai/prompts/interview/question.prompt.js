import { PromptBuilder } from '../../utils/promptBuilder.js';
import { getPersonaPrompt } from './modules/persona.prompts.js';

export const buildQuestionPrompt = (config, parsedResume, parsedJob, questionHistory) => {
  const personaBase = getPersonaPrompt(config.persona || 'Senior Software Engineer');
  
  const SYSTEM_PROMPT = `${personaBase}

Your goal is to conduct a highly professional, adaptive mock interview.
You will be given the candidate's resume, the targeted job description, the interview configuration, and the history of questions and answers so far.
Your task is to generate ONLY the NEXT question to ask the candidate.
Do NOT output an evaluation. Do NOT output a conversational preamble (e.g. "Great answer, moving on..."). Just output the raw question.
Depending on the candidate's previous answer, you may decide to ask a probing Follow-Up question to dig deeper into their claim, OR you can move on to a new topic.
Always output valid JSON.`;

  const builder = new PromptBuilder(SYSTEM_PROMPT);

  builder.setContext(`
### INTERVIEW CONFIGURATION ###
Type: ${config.type}
Difficulty: ${config.difficulty}
Persona: ${config.persona || 'Senior Software Engineer'}

### JOB DESCRIPTION ###
${parsedJob ? `Role: ${parsedJob.role}\nCompany: ${parsedJob.company}\nDescription: ${parsedJob.extractedText}` : 'Generic Interview (No specific job provided)'}

### CANDIDATE RESUME ###
${parsedResume ? JSON.stringify(parsedResume.sections, null, 2) : 'No resume provided.'}

### INTERVIEW HISTORY ###
${questionHistory.length === 0 ? 'This is the very first question.' : questionHistory.map((q, i) => `Q${i+1}: ${q.questionText}\nCandidate Answer: ${q.candidateAnswer}\nAI Internal Evaluation of Answer: ${q.evaluation ? JSON.stringify(q.evaluation) : 'Pending'}`).join('\n\n')}
  `.trim());

  builder.setTask(`
Generate the NEXT interview question for the candidate based on the context and history.
If the previous answer was weak, lacked detail, or the evaluation indicated a missed concept, generate a Follow-Up question exploring that specific area.
If the previous answer was strong, move to a new topic relevant to the Resume, Job Description, and Interview Type.
If the interview just started, base the first question on the candidate's resume or the core requirements of the job.
Make the question sound natural and human, maintaining your specific Persona's tone.
  `.trim());

  return builder;
};
