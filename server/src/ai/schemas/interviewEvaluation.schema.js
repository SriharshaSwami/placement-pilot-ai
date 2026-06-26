export const interviewEvaluationSchema = {
  type: 'object',
  properties: {
    communicationScore: { type: 'number', description: 'Score out of 10 for communication clarity and structure' },
    technicalAccuracy: { type: 'number', description: 'Score out of 10 for factual and technical correctness' },
    confidence: { type: 'number', description: 'Score out of 10 for confident delivery evident in the text' },
    completeness: { type: 'number', description: 'Score out of 10 for answering all parts of the question' },
    strengths: { type: 'array', items: { type: 'string' }, description: 'Positive aspects of the answer' },
    weaknesses: { type: 'array', items: { type: 'string' }, description: 'Flaws or missing information in the answer' },
    idealAnswer: { type: 'string', description: 'What a perfect 10/10 answer would look like for this specific candidate' },
    improvementSuggestions: { type: 'array', items: { type: 'string' }, description: 'Actionable tips for next time' },
  },
  required: ['communicationScore', 'technicalAccuracy', 'confidence', 'completeness', 'strengths', 'weaknesses', 'idealAnswer', 'improvementSuggestions']
};
