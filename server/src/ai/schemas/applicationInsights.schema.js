export const applicationInsightsSchema = {
  type: 'object',
  properties: {
    healthScore: { type: 'number', description: 'Overall health of the application (0-100)' },
    missingActions: { type: 'array', items: { type: 'string' }, description: 'Actions the user should take right now (e.g. Follow up with recruiter)' },
    interviewReadiness: { type: 'string', description: 'Evaluation of readiness based on timeline and linked data' },
    preparationSuggestions: { type: 'array', items: { type: 'string' }, description: 'What to study or prepare for next' },
    riskLevel: { type: 'string', enum: ['Low', 'Medium', 'High'], description: 'Risk of rejection or ghosting' }
  },
  required: ['healthScore', 'missingActions', 'interviewReadiness', 'preparationSuggestions', 'riskLevel']
};
