export const memoryExtractorSchema = {
  type: 'object',
  properties: {
    memories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['Career', 'Skill', 'Resume', 'Interview', 'Coding', 'Learning', 'Goal', 'Preference', 'Behavior', 'General'],
            description: 'The category of the memory.'
          },
          fact: {
            type: 'string',
            description: 'A concise, objective statement of fact about the user. Do not use conversational tone.'
          },
          importance: {
            type: 'integer',
            description: 'Importance rating from 1 (trivial) to 10 (critical for future placement success).'
          },
          confidence: {
            type: 'integer',
            description: 'Confidence rating from 1 (guess) to 10 (explicitly stated or proven).'
          }
        },
        required: ['category', 'fact', 'importance', 'confidence']
      }
    }
  },
  required: ['memories']
};
