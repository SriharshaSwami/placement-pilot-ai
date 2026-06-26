import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite career coach generating a comprehensive final report for a candidate who just completed a mock interview.
Your goal is to summarize their overall performance, aggregate their scores, and provide a personalized learning roadmap.
You will receive the full transcript of questions, their answers, and the individual evaluations for each answer.
Synthesize this data into a highly structured JSON report.`;

export const buildSummaryPrompt = (config, parsedResume, parsedJob, questionHistory) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### INTERVIEW CONFIGURATION ###
Type: ${config.type}
Difficulty: ${config.difficulty}

### JOB DESCRIPTION ###
${parsedJob ? `Role: ${parsedJob.role}\nCompany: ${parsedJob.company}` : 'Generic Interview (No specific job provided)'}

### INTERVIEW TRANSCRIPT ###
${questionHistory.map((q, i) => `
Q${i+1}: ${q.questionText}
Candidate Answer: ${q.candidateAnswer}
Evaluation: Comm (${q.evaluation?.communicationScore}/10), Tech (${q.evaluation?.technicalAccuracy}/10), Conf (${q.evaluation?.confidence}/10)
Strengths: ${q.evaluation?.strengths?.join(', ')}
Weaknesses: ${q.evaluation?.weaknesses?.join(', ')}
`).join('\n')}
  `.trim());

  builder.setTask(`
Generate the final Interview Summary.
Calculate overall aggregate scores out of 100 based on the individual answers.
Write a detailed 'overallPerformance' paragraph (3-4 paragraphs) summarizing how they did, if they would pass a real interview, and their general demeanor.
Identify their top global strengths and weakest global areas.
Provide topics to study and a learning roadmap.
If they contradicted their resume, note it in 'resumeIssuesObserved'.
Always output valid JSON.
  `.trim());

  return builder;
};
