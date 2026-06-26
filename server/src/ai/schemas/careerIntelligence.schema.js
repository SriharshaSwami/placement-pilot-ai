export const careerIntelligenceSchema = {
  type: 'object',
  properties: {
    skillGap: {
      type: 'object',
      properties: {
        missingSkills: { type: 'array', items: { type: 'string' } },
        weakSkills: { type: 'array', items: { type: 'string' } },
        strongSkills: { type: 'array', items: { type: 'string' } },
        confidence: { type: 'string', enum: ['Low', 'Medium', 'High'] },
        radarMetrics: {
          type: 'object',
          properties: {
            dataStructures: { type: 'number', min: 0, max: 100 },
            systemDesign: { type: 'number', min: 0, max: 100 },
            communication: { type: 'number', min: 0, max: 100 },
            frameworks: { type: 'number', min: 0, max: 100 },
            problemSolving: { type: 'number', min: 0, max: 100 }
          },
          required: ['dataStructures', 'systemDesign', 'communication', 'frameworks', 'problemSolving']
        }
      },
      required: ['missingSkills', 'weakSkills', 'strongSkills', 'confidence', 'radarMetrics']
    },
    weeklyGoals: { type: 'array', items: { type: 'string' }, description: 'Actionable goals for this week' },
    monthlyGoals: { type: 'array', items: { type: 'string' }, description: 'High-level goals for the month' },
    resumeImprovements: { type: 'array', items: { type: 'string' } },
    portfolioSuggestions: { type: 'array', items: { type: 'string' } },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['Coding', 'Project', 'Interview', 'Application', 'Study'] },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          estimatedHours: { type: 'number' }
        },
        required: ['title', 'description', 'type', 'priority', 'estimatedHours']
      }
    }
  },
  required: ['skillGap', 'weeklyGoals', 'monthlyGoals', 'resumeImprovements', 'portfolioSuggestions', 'tasks']
};
