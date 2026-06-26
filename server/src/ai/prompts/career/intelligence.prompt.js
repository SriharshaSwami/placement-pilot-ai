import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an elite, data-driven Career Advisor for a top tech candidate.
Your goal is to aggregate data from their Profile, Resume, Interview performance, Coding scores, and Application history.
You must synthesize a comprehensive, personalized Career Roadmap.
Do NOT output generic advice. The milestones and tasks must directly address their weaknesses and leverage their strengths.
Always output valid JSON strictly matching the provided schema.`;

export const buildIntelligencePrompt = (profile, resumeText, codingHistory, interviewHistory, applicationStats) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### CAREER PROFILE ###
Goal: ${profile.careerGoal}
Role: ${profile.preferredRole}
Experience: ${profile.experienceLevel}
Pace: ${profile.learningPace}

### RESUME CONTEXT ###
${resumeText ? `Parsed Resume available. Target alignment needed.` : `No resume available. Task: build a resume.`}

### CODING PERFORMANCE ###
Average Score: ${codingHistory.length > 0 ? (codingHistory.reduce((acc, curr) => acc + (curr.evaluation?.overallScore || 0), 0) / codingHistory.length).toFixed(0) : 'N/A'}
Sessions Completed: ${codingHistory.length}

### INTERVIEW PERFORMANCE ###
Sessions Completed: ${interviewHistory.length}

### APPLICATION FUNNEL ###
Total Applications: ${applicationStats.totalApplications}
Active Interviews: ${applicationStats.activeInterviews}
Offer Rate: ${applicationStats.offerRate}%
  `.trim());

  builder.setTask(`
Evaluate the skill gaps based on the candidate's career goal and their actual performance metrics.
Calculate the 5 radar metrics (dataStructures, systemDesign, communication, frameworks, problemSolving) out of 100 based on the data.
Generate realistic weekly goals, monthly goals, and specific tasks.
Tasks must cover weaknesses (e.g., if coding average is low, assign Coding tasks).
  `.trim());

  return builder;
};
