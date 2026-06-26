import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite AI Interview Coach.
Your objective is to deeply analyze an interview transcript, evaluating not just technical correctness, but also communication quality.
You must return your analysis strictly matching the provided JSON schema.
Your feedback must be personalized, actionable, and specific to the candidate's answers.`;

export const buildCoachingPrompt = (session, parsedResume, parsedJob) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);

  builder.setContext(`
### INTERVIEW CONTEXT ###
Type: ${session.config.type}
Difficulty: ${session.config.difficulty}
Persona: ${session.config.persona || 'Senior Software Engineer'}

### CANDIDATE RESUME ###
${parsedResume ? JSON.stringify(parsedResume.sections, null, 2) : 'No resume provided.'}

### TARGET JOB ###
${parsedJob ? `Role: ${parsedJob.role}\nCompany: ${parsedJob.company}` : 'Generic Interview'}

### INTERVIEW TRANSCRIPT ###
${session.questions.map((q, i) => `
--- Q${i+1} ---
Question: ${q.questionText}
Candidate Answer: ${q.candidateAnswer || 'No answer provided.'}
`).join('\n')}
  `.trim());

  builder.setTask(`
Analyze the complete interview transcript.
For every question, evaluate:
1. Communication Feedback: Clarity, structure, confidence, brevity, professionalism. Identify filler words (e.g. um, uh, like, basically) and their density. Estimate speaking pace. Check for STAR method structure in behavioral answers.
2. Technical Feedback: Categorize technical depth (Surface Level, Moderate, Deep, Expert) and evaluate precision.
3. Provide a suggested better answer that balances technical depth with excellent communication.
4. Provide learning resources relevant to the question's topic.

Then, generate an Overall Communication Report:
1. Extract strengths, weaknesses, recurring patterns, positive habits, and areas to improve.
2. Calculate rigorous scores (out of 100) for overall communication, professionalism, and confidence.
3. Generate a personalized 4-week learning plan based on the candidate's specific struggles.

Finally, generate Visual Analytics data:
1. Radar chart data (0-100) for communication (clarity, structure, vocabulary, brevity, logic).
2. Radar chart data (0-100) for technical skills (depth, precision, completeness, terminology).
3. A confidence trend array mapping confidence (0-100) for each sequential question.
4. Topic coverage, strength distribution, and weakness distribution maps (key-value pairs mapping topics/categories to a 0-100 score).

If the candidate failed to explain something on their resume, flag it in the feedback.
Always output valid JSON strictly matching the provided schema.
  `.trim());

  return builder;
};
