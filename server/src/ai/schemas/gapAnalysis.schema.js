export const gapAnalysisSchema = {
  type: 'object',
  properties: {
    strongMatches: { type: 'array', items: { type: 'string' } },
    partialMatches: { type: 'array', items: { type: 'string' } },
    missingKeywords: { type: 'array', items: { type: 'string' } },
    missingEmphasis: { type: 'array', items: { type: 'string' } },
    experienceToPromote: { type: 'array', items: { type: 'string' } },
    experienceToDeprioritize: { type: 'array', items: { type: 'string' } },
    strategy: {
      type: 'object',
      properties: {
        emphasis: { type: 'string' },
        projectsToHighlight: { type: 'array', items: { type: 'string' } },
        bulletsToPromote: { type: 'array', items: { type: 'string' } },
        technologiesToHighlight: { type: 'array', items: { type: 'string' } },
        atsKeywordsToInject: { type: 'array', items: { type: 'string' } },
        contentToPreserve: { type: 'array', items: { type: 'string' } }
      },
      required: ['emphasis', 'projectsToHighlight', 'bulletsToPromote', 'technologiesToHighlight', 'atsKeywordsToInject', 'contentToPreserve']
    }
  },
  required: ['strongMatches', 'partialMatches', 'missingKeywords', 'missingEmphasis', 'experienceToPromote', 'experienceToDeprioritize', 'strategy']
};
