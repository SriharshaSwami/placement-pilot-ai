export const interviewSummarySchema = {
  type: 'object',
  properties: {
    overallScore: { type: 'number', description: 'Overall aggregate score out of 100' },
    communicationScore: { type: 'number', description: 'Score out of 100' },
    technicalKnowledge: { type: 'number', description: 'Score out of 100' },
    confidence: { type: 'number', description: 'Score out of 100' },
    problemSolving: { type: 'number', description: 'Score out of 100' },
    resumeAlignment: { type: 'number', description: 'Score out of 100 based on consistency with resume' },
    behavioralSkills: { type: 'number', description: 'Score out of 100' },
    overallPerformance: { type: 'string', description: 'A detailed 3-4 paragraph summary of the interview' },
    topStrengths: { type: 'array', items: { type: 'string' } },
    weakestAreas: { type: 'array', items: { type: 'string' } },
    topicsToStudy: { type: 'array', items: { type: 'string' } },
    resumeIssuesObserved: { type: 'array', items: { type: 'string' }, description: 'If the candidate contradicted their resume or struggled to explain it' },
    interviewReadiness: { type: 'string', description: 'e.g., Needs Work, Good, Excellent' },
    personalizedRecommendations: { type: 'array', items: { type: 'string' } },
    learningRoadmap: { type: 'array', items: { type: 'string' } },
    criticalMistakes: { type: 'array', items: { type: 'string' } },
    hiringSignals: { type: 'array', items: { type: 'string' } },
    redFlags: { type: 'array', items: { type: 'string' } },
    excellentAnswers: { type: 'array', items: { type: 'string' } },
    missedOpportunities: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'overallScore', 'communicationScore', 'technicalKnowledge', 'confidence', 
    'problemSolving', 'resumeAlignment', 'behavioralSkills', 'overallPerformance',
    'topStrengths', 'weakestAreas', 'topicsToStudy', 'resumeIssuesObserved',
    'interviewReadiness', 'personalizedRecommendations', 'learningRoadmap',
    'criticalMistakes', 'hiringSignals', 'redFlags', 'excellentAnswers', 'missedOpportunities'
  ]
};
