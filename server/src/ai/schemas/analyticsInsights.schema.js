export const analyticsInsightsSchema = {
  type: 'object',
  properties: {
    strongestSkill: { type: 'string', description: 'The absolute strongest aspect of the candidate currently.' },
    biggestWeakness: { type: 'string', description: 'The critical bottleneck holding back their placement.' },
    mostImprovedArea: { type: 'string', description: 'The area where they have shown the most historical growth.' },
    suggestedNextAction: { type: 'string', description: 'One extremely specific, high-priority task to do immediately.' },
    predictedReadiness: { 
      type: 'string', 
      enum: ['Not Ready', 'Needs Polish', 'Interview Ready', 'Offer Ready'],
      description: 'Overall classification of their placement readiness.'
    }
  },
  required: ['strongestSkill', 'biggestWeakness', 'mostImprovedArea', 'suggestedNextAction', 'predictedReadiness']
};
