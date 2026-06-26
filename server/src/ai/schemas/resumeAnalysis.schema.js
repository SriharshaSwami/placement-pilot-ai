export const resumeAnalysisSchema = {
  type: 'object',
  properties: {
    atsScore: { type: 'number', description: 'ATS Score out of 100 based on keyword density, structure, and impact' },
    summary: { type: 'string', description: 'A 2-3 sentence summary of the resume quality' },
    strengths: { type: 'array', items: { type: 'string' }, description: 'List of top 3-5 strengths' },
    weaknesses: { type: 'array', items: { type: 'string' }, description: 'List of 3-5 weaknesses or missing elements' },
    missingKeywords: { type: 'array', items: { type: 'string' }, description: 'Keywords that should be added to improve ATS compatibility' },
    recommendations: { type: 'array', items: { type: 'string' }, description: 'Actionable steps to improve the resume' },
    projectFeedback: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Name of the project or section' },
          feedback: { type: 'string', description: 'Specific feedback to improve this item' },
          score: { type: 'number', description: 'Score out of 100 for this item' }
        },
        required: ['title', 'feedback', 'score']
      }
    },
    educationFeedback: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          feedback: { type: 'string' },
          score: { type: 'number' }
        },
        required: ['title', 'feedback', 'score']
      }
    },
    experienceFeedback: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          feedback: { type: 'string' },
          score: { type: 'number' }
        },
        required: ['title', 'feedback', 'score']
      }
    }
  },
  required: ['atsScore', 'summary', 'strengths', 'weaknesses', 'missingKeywords', 'recommendations', 'projectFeedback', 'educationFeedback', 'experienceFeedback']
};
