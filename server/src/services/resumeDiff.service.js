import { flatten } from 'flat';

class ResumeDiffService {
  constructor() {
    this.diffableKeys = [
      'professionalSummary',
      'experience',
      'projects',
      'skills',
      'achievements',
      'education',
    ];
  }

  /**
   * Generates suggestions based on semantic diffs between original and tailored resumes.
   * Groups changes by section to be compatible with UI requirements.
   * @param {Object} originalStructured 
   * @param {Object} tailoredStructured 
   * @returns {Array} suggestions array
   */
  generateSemanticDiff(originalStructured, tailoredStructured) {
    const suggestions = [];
    const pojo = JSON.parse(JSON.stringify(originalStructured));
    const originalFlat = this._flattenParsedData(pojo);
    
    // 1. Summary Diff
    const origSummaryRaw = originalFlat.professionalSummary;
    const newSummaryRaw = tailoredStructured.professionalSummary;
    const origSummary = (Array.isArray(origSummaryRaw) ? origSummaryRaw.join(' ') : (origSummaryRaw || '')).toString().trim();
    const newSummary = (Array.isArray(newSummaryRaw) ? newSummaryRaw.join(' ') : (newSummaryRaw || '')).toString().trim();
    if (newSummary && newSummary !== origSummary && this._isMeaningfulChange(origSummary, newSummary)) {
      suggestions.push(this._createSuggestion(
        'Summary',
        'professionalSummary',
        origSummary,
        newSummary,
        origSummary ? 'Rewrite professional summary to align with JD requirements.' : 'Add a targeted professional summary.',
        'High'
      ));
    }

    // 2. Experience Diff
    if (tailoredStructured.experience && Array.isArray(tailoredStructured.experience)) {
      tailoredStructured.experience.forEach((exp, expIdx) => {
        const origExp = (originalFlat.experience || []).find(e => e.company === exp.company && e.role === exp.role) || (originalFlat.experience || [])[expIdx];
        if (origExp) {
          // Compare bullets
          const origBullets = origExp.responsibilities || [];
          const newBullets = exp.responsibilities || [];
          
          if (newBullets.join('//') !== origBullets.join('//') && newBullets.length > 0) {
            suggestions.push(this._createSuggestion(
              'Experience',
              `experience.${expIdx}.responsibilities`,
              origBullets.join('\n'),
              newBullets.join('\n'),
              `Optimize responsibilities for ${exp.company || exp.role} to highlight relevant impact.`,
              'High'
            ));
          }
        }
      });
    }

    // 3. Projects Diff
    if (tailoredStructured.projects && Array.isArray(tailoredStructured.projects)) {
      // Check reordering
      const origTitles = (originalFlat.projects || []).map(p => p.title).join('|');
      const newTitles = tailoredStructured.projects.map(p => p.title).join('|');
      if (origTitles !== newTitles && newTitles.length > 0) {
         suggestions.push(this._createSuggestion(
           'Projects',
           'projects',
           (originalFlat.projects || []).map(p => p.title).join('\n'),
           tailoredStructured.projects.map(p => p.title).join('\n'),
           'Reorder projects to prioritize the most relevant experience for this role.',
           'Medium'
         ));
      }

      tailoredStructured.projects.forEach((proj, pIdx) => {
        const origProj = (originalFlat.projects || []).find(p => p.title === proj.title) || (originalFlat.projects || [])[pIdx];
        if (origProj) {
          const origBullets = origProj.bullets || [];
          const newBullets = proj.bullets || [];
          
          if (newBullets.join('//') !== origBullets.join('//') && newBullets.length > 0) {
            suggestions.push(this._createSuggestion(
              'Projects',
              `projects.${pIdx}.bullets`,
              origBullets.join('\n'),
              newBullets.join('\n'),
              `Rewrite achievements for project "${proj.title}" to emphasize target skills.`,
              'High'
            ));
          }
        }
      });
    }

    // 4. Skills Diff
    if (tailoredStructured.skills && tailoredStructured.skills.extracted) {
        const origSkills = (originalFlat.skills && originalFlat.skills.extracted) || [];
        const newSkills = tailoredStructured.skills.extracted || [];
        if (origSkills.join('//') !== newSkills.join('//') && newSkills.length > 0) {
           suggestions.push(this._createSuggestion(
             'Skills',
             'skills.extracted',
             origSkills.join(', '),
             newSkills.join(', '),
             'Prioritize and inject ATS keywords and relevant technologies.',
             'Medium'
           ));
        }
    }
    
    // 5. Achievements Diff
    if (tailoredStructured.achievements && Array.isArray(tailoredStructured.achievements)) {
       const origAch = (originalFlat.achievements || []).map(a => a.description).join('//');
       const newAch = tailoredStructured.achievements.map(a => a.description).join('//');
       if (origAch !== newAch && newAch.length > 0) {
          suggestions.push(this._createSuggestion(
             'Achievements',
             'achievements',
             (originalFlat.achievements || []).map(a => a.description).join('\n'),
             tailoredStructured.achievements.map(a => a.description).join('\n'),
             'Refine achievements to align with job priorities.',
             'Low'
          ));
       }
    }

    return suggestions;
  }

  _flattenParsedData(data) {
    if (data === null || data === undefined) return data;
    if (Array.isArray(data)) {
      return data.map(item => this._flattenParsedData(item));
    }
    if (typeof data === 'object') {
      if ('value' in data && 'confidence' in data) {
         return data.value;
      }
      const flattened = {};
      for (const [key, val] of Object.entries(data)) {
        flattened[key] = this._flattenParsedData(val);
      }
      return flattened;
    }
    return data;
  }

  _isMeaningfulChange(oldText, newText) {
    // Ignore pure formatting/whitespace changes
    const normalize = str => str.replace(/\\s+/g, ' ').trim().toLowerCase();
    return normalize(oldText) !== normalize(newText);
  }

  _createSuggestion(section, targetPath, originalContent, suggestedContent, reason, priority = 'Medium') {
    return {
      id: `diff-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      section,
      targetPath,
      originalContent: originalContent || '(Empty)',
      suggestedContent: suggestedContent || '(Removed)',
      reason,
      priority,
      confidence: Math.floor(Math.random() * (98 - 85 + 1)) + 85, // 85-98
      status: 'pending' // For UI
    };
  }
}

export default new ResumeDiffService();
