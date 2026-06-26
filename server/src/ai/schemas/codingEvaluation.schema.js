export const codingEvaluationSchema = {
  type: 'object',
  properties: {
    overallScore: { type: 'number', description: 'Overall score out of 100' },
    correctness: { type: 'number', description: 'Score out of 10 for logic and correctness' },
    complexity: { type: 'number', description: 'Score out of 10 for time/space efficiency' },
    readability: { type: 'number', description: 'Score out of 10 for clean, readable code and naming' },
    edgeCases: { type: 'number', description: 'Score out of 10 for handling edge cases' },
    communication: { type: 'number', description: 'Score out of 10 for comments and reasoning provided' },
    strengths: { type: 'array', items: { type: 'string' } },
    weaknesses: { type: 'array', items: { type: 'string' } },
    recommendedImprovements: { type: 'array', items: { type: 'string' }, description: 'Actionable code improvements' },
    idealApproach: { type: 'string', description: 'Description of the optimal algorithm' },
    timeComplexity: { type: 'string', description: 'e.g., O(N log N)' },
    spaceComplexity: { type: 'string', description: 'e.g., O(1)' },
  },
  required: ['overallScore', 'correctness', 'complexity', 'readability', 'edgeCases', 'communication', 'strengths', 'weaknesses', 'recommendedImprovements', 'idealApproach', 'timeComplexity', 'spaceComplexity']
};
