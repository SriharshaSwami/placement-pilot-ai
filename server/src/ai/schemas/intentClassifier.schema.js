export const intentClassifierSchema = {
  type: 'object',
  properties: {
    intent: {
      type: 'string',
      enum: [
        'RESUME_HELP',
        'INTERVIEW_PREP',
        'CODING_HELP',
        'CAREER_ADVICE',
        'JOB_SEARCH',
        'ANALYTICS_QUERY',
        'GENERAL_SUPPORT'
      ],
      description: 'The primary intent of the user query.'
    },
    confidence: {
      type: 'integer',
      description: 'Confidence rating from 1 to 10.'
    },
    suggestedAgents: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['ResumeAgent', 'InterviewAgent', 'CodingAgent', 'CareerAgent', 'JobAgent', 'AnalyticsAgent']
      },
      description: 'The sequential list of agents required to fulfill this query.'
    }
  },
  required: ['intent', 'confidence', 'suggestedAgents']
};
