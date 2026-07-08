/**
 * Centralized Resume Layout Rules Engine
 * Defines deterministic constraints and limits for different resume templates.
 * These rules are read by the Content Budget, Compression Engine, and Quality Evaluator.
 */
export const resumeRules = {
  classic: {
    summary: { 
      maxLines: 3, 
      maxLengthChars: 400,
      minLengthChars: 50
    },
    experience: {
      currentRoleMaxBullets: 4,
      previousRoleMaxBullets: 3,
      olderRoleMaxBullets: 2,
      internMaxBullets: 2
    },
    projects: { 
      maxItems: 3, 
      maxBulletsPerItem: 2,
      totalMaxBullets: 8 // used for budget string
    },
    skills: { 
      maxRows: 2, 
      maxDensity: 25 
    },
    achievements: { 
      maxItems: 3, 
      maxCharsPerItem: 100,
      totalMaxBullets: 2 // used for budget string
    },
    formatting: {
      maxBulletLength: 150,
      minBulletLength: 30
    }
  },
  modern: {
    summary: { 
      maxLines: 3, 
      maxLengthChars: 350,
      minLengthChars: 50
    },
    experience: {
      currentRoleMaxBullets: 3,
      previousRoleMaxBullets: 3,
      olderRoleMaxBullets: 2,
      internMaxBullets: 2
    },
    projects: { 
      maxItems: 2, 
      maxBulletsPerItem: 2,
      totalMaxBullets: 6
    },
    skills: { 
      maxRows: 2, 
      maxDensity: 20 
    },
    achievements: { 
      maxItems: 2, 
      maxCharsPerItem: 100,
      totalMaxBullets: 2
    },
    formatting: {
      maxBulletLength: 150,
      minBulletLength: 30
    }
  },
  professional: {
    summary: { 
      maxLines: 3, 
      maxLengthChars: 350,
      minLengthChars: 50
    },
    experience: {
      currentRoleMaxBullets: 3,
      previousRoleMaxBullets: 3,
      olderRoleMaxBullets: 2,
      internMaxBullets: 2
    },
    projects: { 
      maxItems: 2, 
      maxBulletsPerItem: 2,
      totalMaxBullets: 6
    },
    skills: { 
      maxRows: 2, 
      maxDensity: 20 
    },
    achievements: { 
      maxItems: 2, 
      maxCharsPerItem: 100,
      totalMaxBullets: 2
    },
    formatting: {
      maxBulletLength: 150,
      minBulletLength: 30
    }
  }
};
