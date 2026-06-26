export const codingQuestionSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short, descriptive title for the coding problem' },
    difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
    category: { type: 'string' },
    problemStatement: { type: 'string', description: 'Clear problem statement without mentioning the solution' },
    constraints: { type: 'array', items: { type: 'string' }, description: 'e.g., 1 <= N <= 10^5' },
    sampleInput: { type: 'string' },
    sampleOutput: { type: 'string' },
    hints: { type: 'array', items: { type: 'string' }, description: 'Maximum 3 progressive hints' },
    expectedConcepts: { type: 'array', items: { type: 'string' } },
  },
  required: ['title', 'difficulty', 'category', 'problemStatement', 'constraints', 'sampleInput', 'sampleOutput', 'hints', 'expectedConcepts']
};
