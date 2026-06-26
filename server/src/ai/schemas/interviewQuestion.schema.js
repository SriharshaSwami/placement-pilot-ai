export const interviewQuestionSchema = {
  type: 'object',
  properties: {
    questionText: { type: 'string', description: 'The text of the interview question' },
    isFollowUp: { type: 'boolean', description: 'True if this question is a direct follow-up to the candidates previous answer' }
  },
  required: ['questionText', 'isFollowUp']
};
