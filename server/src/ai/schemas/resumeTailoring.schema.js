export const resumeTailoringSchema = {
  type: 'object',
  properties: {
    matchAnalysis: {
      type: 'object',
      properties: {
        overallMatchPercent: { type: 'number' },
        matchedSkills: { type: 'array', items: { type: 'string' } },
        missingSkills: { type: 'array', items: { type: 'string' } },
        matchedKeywords: { type: 'array', items: { type: 'string' } },
        missingKeywords: { type: 'array', items: { type: 'string' } },
        educationMatch: { type: 'string' },
        experienceMatch: { type: 'string' },
        projectRelevance: { type: 'string' },
        resumeWeaknesses: { type: 'array', items: { type: 'string' } },
        priorityImprovements: { type: 'array', items: { type: 'string' } },
        hiringRiskFactors: { type: 'array', items: { type: 'string' } },
      },
      required: ['overallMatchPercent', 'matchedSkills', 'missingSkills', 'matchedKeywords', 'missingKeywords', 'resumeWeaknesses']
    },
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the suggestion (e.g. random string)' },
          section: { type: 'string', description: 'The resume section being targeted (e.g., Summary, Experience, Projects)' },
          priority: { type: 'string', enum: ['High', 'Medium', 'Low'] },
          confidence: { type: 'number', description: '0-100 confidence score that this change is factual based on context' },
          reason: { type: 'string', description: 'Why this change is suggested' },
          originalContent: { type: 'string', description: 'The exact original text being replaced, or empty if it is a net-new addition' },
          suggestedContent: { type: 'string', description: 'The new tailored text to apply' },
        },
        required: ['id', 'section', 'priority', 'confidence', 'reason', 'suggestedContent']
      }
    }
  },
  required: ['matchAnalysis', 'suggestions']
};
