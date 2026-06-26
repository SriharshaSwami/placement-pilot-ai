import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are a Senior Career Analyst evaluating a software engineering candidate.
You will be provided with their aggregated placement statistics (resume, applications, coding, interviews, roadmap).
Your job is to synthesize these numbers into actionable human insights.
Output strictly in JSON matching the provided schema. Do not output anything else.`;

export const buildAnalyticsPrompt = (metrics) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### CANDIDATE AGGREGATED METRICS ###
Placement Readiness Score: ${metrics.readinessScore}/100
Resume Average ATS: ${metrics.resumeAvg}/100
Mock Interview Avg: ${metrics.mockInterviewAvg}/100
Coding Interview Avg: ${metrics.codingInterviewAvg}/100

### APPLICATION PIPELINE ###
Total Applications: ${metrics.funnel.total}
Interviews Secured: ${metrics.funnel.interviews}
Offers: ${metrics.funnel.offers}
Conversion Rate: ${metrics.applicationConversionRate}%

### ROADMAP COMPLETION ###
Progress: ${metrics.roadmapProgress}% tasks completed.
  `.trim());

  builder.setTask(`
Evaluate the metrics deeply. If coding scores are high but resume ATS is low, identify resume as the biggest weakness.
If application conversion is 0%, identify job hunt strategy as the weakness.
Be objective, specific, and hyper-actionable.
Determine the predictedReadiness based on the Readiness Score (e.g. >80 is Offer Ready, <50 is Not Ready).
  `.trim());

  return builder;
};
