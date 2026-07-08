import { resumeParserSchemaJSON } from './resumeParser.schema.js';

export const tailoredResumeSchema = {
  type: 'object',
  properties: {
    tailoredStructuredData: resumeParserSchemaJSON,
    validationScores: {
      type: 'object',
      properties: {
        atsKeywordCoverage: { type: 'number' },
        requiredSkillsCoverage: { type: 'number' },
        preferredSkillsCoverage: { type: 'number' },
        missingImportantConcepts: { type: 'array', items: { type: 'string' } },
        sectionRelevanceScore: { type: 'number' }
      },
      required: ['atsKeywordCoverage', 'requiredSkillsCoverage', 'sectionRelevanceScore']
    }
  },
  required: ['tailoredStructuredData', 'validationScores']
};
