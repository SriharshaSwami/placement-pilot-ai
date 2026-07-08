export const jdAnalysisSchema = {
  type: 'object',
  properties: {
    requiredSkills: { type: 'array', items: { type: 'string' } },
    preferredSkills: { type: 'array', items: { type: 'string' } },
    technologies: { type: 'array', items: { type: 'string' } },
    softSkills: { type: 'array', items: { type: 'string' } },
    responsibilities: { type: 'array', items: { type: 'string' } },
    engineeringPriorities: { type: 'array', items: { type: 'string' } },
    atsKeywords: { type: 'array', items: { type: 'string' } },
    seniorityExpectations: { type: 'string' },
    hiddenSignals: { type: 'array', items: { type: 'string' } }
  },
  required: ['requiredSkills', 'preferredSkills', 'technologies', 'softSkills', 'responsibilities', 'engineeringPriorities', 'atsKeywords', 'seniorityExpectations', 'hiddenSignals']
};
