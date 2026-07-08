export const emergencyCompressionSchema = {
  type: 'object',
  properties: {
    modifiedSections: {
      type: 'object',
      description: 'The aggressively shortened sections. Keys should match the original JSON keys (e.g. "experience", "projects", "professionalSummary").',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            index: {
              type: 'integer',
              description: 'The index of the item within the original array (e.g., 0 for the first job).'
            },
            description: {
              type: 'array',
              items: { type: 'string' },
              description: 'The aggressively shortened bullet points for this item.'
            },
            value: {
              type: 'string',
              description: 'Used for non-array text fields like professionalSummary.'
            }
          },
          required: []
        }
      }
    }
  },
  required: ['modifiedSections']
};
