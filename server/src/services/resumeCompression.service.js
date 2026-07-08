import { resumeRules } from '../config/resumeRules.js';

/**
 * Resume Compression Engine
 * Deterministically compresses structured resume JSON across 5 levels to reduce rendered height without AI.
 */
class ResumeCompressionService {
  
  /**
   * Compresses the structured resume data to a target level.
   * Modifies the object directly and returns it.
   */
  compress(structuredData, level, templateId = 'classic') {
    if (level < 1) return structuredData;

    const data = JSON.parse(JSON.stringify(structuredData));
    if (!data.metadata) data.metadata = {};

    const activeRules = resumeRules[templateId] || resumeRules.classic;

    // --- LEVEL 1: Whitespace ---
    if (level >= 1) {
      data.metadata.compressionLevel = level;
    }

    // --- LEVEL 2: Compress Summary ---
    if (level >= 2 && data.professionalSummary?.value) {
      data.professionalSummary.value = this.compressSummary(data.professionalSummary.value);
    }

    // --- LEVEL 3: Shorten Bullets ---
    if (level >= 3) {
      if (data.experience) {
        data.experience.forEach(exp => {
          if (exp.description && Array.isArray(exp.description.value)) {
            exp.description.value = exp.description.value.map(b => this.shortenBullet(b));
          }
        });
      }
      if (data.projects) {
        data.projects.forEach(proj => {
          if (proj.description && Array.isArray(proj.description.value)) {
            proj.description.value = proj.description.value.map(b => this.shortenBullet(b));
          }
        });
      }
    }

    // --- LEVEL 4: Limit Bullet Counts ---
    if (level >= 4) {
      if (data.experience) {
        data.experience.forEach((exp, index) => {
          if (exp.description && Array.isArray(exp.description.value)) {
            const isIntern = exp.title?.value?.toLowerCase().includes('intern');
            let maxBullets = activeRules.experience.olderRoleMaxBullets;
            
            if (isIntern) {
              maxBullets = activeRules.experience.internMaxBullets;
            } else if (index === 0) {
              maxBullets = activeRules.experience.currentRoleMaxBullets;
            } else if (index === 1) {
              maxBullets = activeRules.experience.previousRoleMaxBullets;
            }
            exp.description.value = exp.description.value.slice(0, maxBullets);
          }
        });
      }
      if (data.projects) {
        data.projects.forEach(proj => {
          if (proj.description && Array.isArray(proj.description.value)) {
            proj.description.value = proj.description.value.slice(0, activeRules.projects.maxBulletsPerItem);
          }
        });
        if (data.projects.length > activeRules.projects.maxItems) {
          data.projects = data.projects.slice(0, activeRules.projects.maxItems);
        }
      }
    }

    // --- LEVEL 5: Condense Achievements ---
    if (level >= 5) {
      if (data.achievements) {
        data.achievements.forEach(ach => {
          if (ach.description && ach.description.value) {
            ach.description.value = this.condenseAchievement(ach.description.value, activeRules.achievements.maxCharsPerItem);
          }
        });
        if (data.achievements.length > activeRules.achievements.maxItems) {
          data.achievements = data.achievements.slice(0, activeRules.achievements.maxItems);
        }
      }
    }

    return data;
  }

  compressSummary(text) {
    if (!text) return text;
    let compressed = text;
    
    // Remove filler phrases
    const fillers = [
      /proven track record of\s+/gi,
      /highly motivated\s+/gi,
      /results-driven\s+/gi,
      /result-oriented\s+/gi,
      /responsible for\s+/gi,
      /in charge of\s+/gi,
      /successfully\s+/gi,
      /effectively\s+/gi,
      /passion for\s+/gi,
      /passionate about\s+/gi,
      /dedicated and\s+/gi,
      /hardworking\s+/gi
    ];
    
    fillers.forEach(regex => {
      compressed = compressed.replace(regex, '');
    });

    // Capitalize first letter if it was removed
    compressed = compressed.charAt(0).toUpperCase() + compressed.slice(1);
    return compressed.trim();
  }

  shortenBullet(text) {
    if (!text) return text;
    let compressed = text;
    
    const fillers = [
      /responsible for\s+/gi,
      /in charge of\s+/gi,
      /tasked with\s+/gi,
      /successfully\s+/gi,
      /effectively\s+/gi,
      /efficiently\s+/gi,
      /worked on a team to\s+/gi,
      /collaborated with a team to\s+/gi,
      /duties included\s+/gi,
      /was responsible for\s+/gi
    ];
    
    fillers.forEach(regex => {
      compressed = compressed.replace(regex, '');
    });

    // Ensure it still reads well by capitalizing the first letter
    compressed = compressed.charAt(0).toUpperCase() + compressed.slice(1);
    return compressed.trim();
  }

  condenseAchievement(text, maxChars = 100) {
    if (!text) return text;
    // Extract just the first sentence if it exceeds maxChars
    if (text.length > maxChars && text.includes('.')) {
      return text.split('.')[0] + '.';
    }
    return text;
  }
}

export default new ResumeCompressionService();
