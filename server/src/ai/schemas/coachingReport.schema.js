export const coachingReportSchema = {
  type: 'object',
  properties: {
    questionAnalysis: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sequenceNumber: { type: 'number' },
          communicationFeedback: {
            type: 'object',
            properties: {
              clarity: { type: 'number', description: 'Score out of 10' },
              structure: { type: 'number', description: 'Score out of 10' },
              confidence: { type: 'number', description: 'Score out of 10' },
              brevity: { type: 'number', description: 'Score out of 10' },
              professionalism: { type: 'number', description: 'Score out of 10' },
              fillerWords: { type: 'array', items: { type: 'string' } },
              fillerDensity: { type: 'string', description: 'e.g., Low, Medium, High' },
              speakingPace: { type: 'string', description: 'e.g., Too Fast, Ideal, Too Slow' },
              starDetection: {
                type: 'object',
                properties: {
                  usedStar: { type: 'boolean' },
                  missingComponents: { type: 'array', items: { type: 'string' } }
                },
                required: ['usedStar', 'missingComponents']
              },
              feedback: { type: 'string' }
            },
            required: ['clarity', 'structure', 'confidence', 'brevity', 'professionalism', 'fillerWords', 'fillerDensity', 'speakingPace', 'starDetection', 'feedback']
          },
          technicalFeedback: {
            type: 'object',
            properties: {
              technicalDepth: { type: 'string', description: 'Surface Level, Moderate, Deep, Expert' },
              precision: { type: 'number', description: 'Score out of 10' },
              feedback: { type: 'string' }
            },
            required: ['technicalDepth', 'precision', 'feedback']
          },
          suggestedBetterAnswer: { type: 'string' },
          learningResources: { type: 'array', items: { type: 'string' } }
        },
        required: ['sequenceNumber', 'communicationFeedback', 'technicalFeedback', 'suggestedBetterAnswer', 'learningResources']
      }
    },
    overallCommunication: {
      type: 'object',
      properties: {
        strengths: { type: 'array', items: { type: 'string' } },
        weaknesses: { type: 'array', items: { type: 'string' } },
        recurringPatterns: { type: 'array', items: { type: 'string' } },
        positiveHabits: { type: 'array', items: { type: 'string' } },
        areasToImprove: { type: 'array', items: { type: 'string' } },
        communicationScore: { type: 'number' },
        professionalismScore: { type: 'number' },
        confidenceScore: { type: 'number' }
      },
      required: ['strengths', 'weaknesses', 'recurringPatterns', 'positiveHabits', 'areasToImprove', 'communicationScore', 'professionalismScore', 'confidenceScore']
    },
    learningPlan: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          week: { type: 'number' },
          focus: { type: 'string' },
          tasks: { type: 'array', items: { type: 'string' } }
        },
        required: ['week', 'focus', 'tasks']
      }
    },
    visualAnalytics: {
      type: 'object',
      properties: {
        communicationRadar: {
          type: 'object',
          properties: {
            clarity: { type: 'number' },
            structure: { type: 'number' },
            vocabulary: { type: 'number' },
            brevity: { type: 'number' },
            logic: { type: 'number' }
          },
          required: ['clarity', 'structure', 'vocabulary', 'brevity', 'logic']
        },
        technicalRadar: {
          type: 'object',
          properties: {
            depth: { type: 'number' },
            precision: { type: 'number' },
            completeness: { type: 'number' },
            terminology: { type: 'number' }
          },
          required: ['depth', 'precision', 'completeness', 'terminology']
        },
        confidenceTrend: { type: 'array', items: { type: 'number' } },
        topicCoverage: { type: 'object', additionalProperties: { type: 'number' } },
        strengthDistribution: { type: 'object', additionalProperties: { type: 'number' } },
        weaknessDistribution: { type: 'object', additionalProperties: { type: 'number' } }
      },
      required: ['communicationRadar', 'technicalRadar', 'confidenceTrend', 'topicCoverage', 'strengthDistribution', 'weaknessDistribution']
    }
  },
  required: ['questionAnalysis', 'overallCommunication', 'learningPlan', 'visualAnalytics']
};
