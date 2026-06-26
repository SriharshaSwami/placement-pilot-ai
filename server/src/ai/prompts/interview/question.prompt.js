import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an expert interviewer for a top-tier company.
Your goal is to conduct a highly professional, adaptive mock interview.
You must behave like a human interviewer.
You will be given the candidate's resume, the targeted job description, the interview configuration, and the history of questions and answers so far.
Your task is to generate ONLY the NEXT question to ask the candidate.
Do NOT output an evaluation. Do NOT output a conversational preamble (e.g. "Great answer, moving on..."). Just output the raw question.
Depending on the candidate's previous answer, you may decide to ask a probing Follow-Up question to dig deeper into their claim, OR you can move on to a new topic.
The difficulty of the question must match the requested Difficulty level.
The topic must align with the Interview Type (HR, Technical, Behavioral, Mixed).
Always output valid JSON.`;

export const buildQuestionPrompt = (config, parsedResume, parsedJob, questionHistory) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### INTERVIEW CONFIGURATION ###
Type: ${config.type}
Difficulty: ${config.difficulty}

### JOB DESCRIPTION ###
${parsedJob ? `Role: ${parsedJob.role}\nCompany: ${parsedJob.company}\nDescription: ${parsedJob.extractedText}` : 'Generic Interview (No specific job provided)'}

### CANDIDATE RESUME ###
${parsedResume ? JSON.stringify(parsedResume.sections, null, 2) : 'No resume provided.'}

### INTERVIEW HISTORY ###
${questionHistory.length === 0 ? 'This is the very first question.' : questionHistory.map((q, i) => `Q${i+1}: ${q.questionText}\nCandidate Answer: ${q.candidateAnswer}`).join('\n\n')}
  `.trim());

  builder.setTask(`
Generate the NEXT interview question for the candidate based on the context and history.
If the previous answer was weak or lacked detail, generate a Follow-Up question.
If the previous answer was good, move to a new topic relevant to the Resume, Job Description, and Interview Type.
Make the question sound natural and human.
  `.trim());

  return builder;
};
