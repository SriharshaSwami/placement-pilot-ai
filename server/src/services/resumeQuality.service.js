import { resumeRules } from '../config/resumeRules.js';

/**
 * Resume Quality Evaluation Engine
 * Deterministically evaluates the generated resume's quality, completeness, and ATS compatibility without AI calls.
 */
class ResumeQualityService {
  constructor() {
    this.strongVerbs = new Set([
      'architected', 'spearheaded', 'engineered', 'orchestrated', 'pioneered', 
      'directed', 'led', 'transformed', 'optimized', 'developed', 'designed',
      'implemented', 'launched', 'delivered', 'managed', 'executed', 'built',
      'created', 'integrated', 'streamlined', 'improved', 'increased', 'reduced'
    ]);
  }

  /**
   * Evaluates the resume and generates a comprehensive quality report.
   * @param {Object} structuredData The tailored resume structured data
   * @param {Object} jdAnalysis The original job description analysis
   * @param {Object} fitReport The layout fit report from resumeFitService
   * @param {string} templateId The selected template id
   * @returns {Object} Quality report containing scores, metrics, and warnings
   */
  evaluate(structuredData, jdAnalysis, fitReport, templateId = 'classic') {
    const report = {
      warnings: [],
      metrics: {
        atsKeywordCoverage: 0,
        requiredSkillsMatched: 0,
        preferredSkillsMatched: 0,
        quantifiedMetricsCount: 0,
        strongActionVerbCount: 0,
        duplicateKeywordsDetected: false,
        summaryLength: 0,
        skillsDensity: 0
      },
      completeness: {
        missingMandatorySections: []
      },
      fitStatus: fitReport?.fits ? 'Optimal' : 'Overflowing',
      overallScore: 0
    };

    const activeRules = resumeRules[templateId] || resumeRules.classic;

    const allText = this.extractAllText(structuredData);
    const textLower = allText.toLowerCase();

    // 1. ATS Keyword & Skills Coverage
    const requiredSkills = jdAnalysis?.requiredSkills || [];
    const preferredSkills = jdAnalysis?.preferredSkills || [];
    
    let reqMatched = 0;
    requiredSkills.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) reqMatched++;
    });
    report.metrics.requiredSkillsMatched = requiredSkills.length ? Math.round((reqMatched / requiredSkills.length) * 100) : 100;

    let prefMatched = 0;
    preferredSkills.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) prefMatched++;
    });
    report.metrics.preferredSkillsMatched = preferredSkills.length ? Math.round((prefMatched / preferredSkills.length) * 100) : 100;

    // Aggregate coverage
    report.metrics.atsKeywordCoverage = Math.round((report.metrics.requiredSkillsMatched * 0.7) + (report.metrics.preferredSkillsMatched * 0.3));

    // 2. Action Verbs & Metrics Count
    let metricsCount = 0;
    let verbsCount = 0;
    let bulletLengthViolations = 0;

    const analyzeBullets = (items) => {
      if (!items) return;
      items.forEach(item => {
        if (item.description && Array.isArray(item.description.value)) {
          item.description.value.forEach(bulletText => {
            const bullet = (bulletText.value || bulletText || '').trim();
            if (!bullet) return;

            // Metrics: match numbers, %, $
            const numbers = bullet.match(/\d+|%|\$/g);
            if (numbers) metricsCount += numbers.length;

            // Action Verbs
            const firstWord = bullet.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
            if (this.strongVerbs.has(firstWord)) verbsCount++;

            // Length
            if (bullet.length > activeRules.formatting.maxBulletLength) bulletLengthViolations++;
            if (bullet.length < activeRules.formatting.minBulletLength) bulletLengthViolations++;
          });
        }
      });
    };

    analyzeBullets(structuredData.experience);
    analyzeBullets(structuredData.projects);

    report.metrics.quantifiedMetricsCount = metricsCount;
    report.metrics.strongActionVerbCount = verbsCount;

    if (bulletLengthViolations > 0) {
      report.warnings.push(`⚠ ${bulletLengthViolations} bullet(s) exceed maximum length or are too short.`);
    }

    // 3. Content Length Analysis
    const summary = structuredData.professionalSummary?.value || '';
    report.metrics.summaryLength = summary.length;
    if (summary.length > activeRules.summary.maxLengthChars) {
      report.warnings.push('⚠ Summary is longer than recommended.');
    } else if (summary.length < activeRules.summary.minLengthChars && summary.length > 0) {
      report.warnings.push('⚠ Summary is too short to be impactful.');
    }

    // Skills Density
    let totalSkills = 0;
    if (structuredData.skills) {
      Object.values(structuredData.skills).forEach(cat => {
        if (Array.isArray(cat)) totalSkills += cat.length;
      });
    }
    report.metrics.skillsDensity = totalSkills;
    if (totalSkills > activeRules.skills.maxDensity) {
      report.warnings.push('⚠ Skills section is too dense.');
    }

    // 4. Completeness
    if (!structuredData.experience || structuredData.experience.length === 0) {
      report.completeness.missingMandatorySections.push('Experience');
      report.warnings.push('⚠ Mandatory Experience section is missing.');
    }
    if (!structuredData.education || structuredData.education.length === 0) {
      report.completeness.missingMandatorySections.push('Education');
      report.warnings.push('⚠ Mandatory Education section is missing.');
    }

    // 5. Fit Status
    if (fitReport) {
      if (fitReport.remainingPixels !== undefined && fitReport.remainingPixels < 20 && fitReport.remainingPixels >= 0) {
        report.warnings.push('⚠ Resume is close to overflowing.');
      }
      if (!fitReport.fits) {
        report.warnings.push('⚠ Resume overflows past one page.');
      }
    }

    // Scoring Algorithm (0-100)
    let score = 0;
    score += (report.metrics.requiredSkillsMatched * 0.4);
    score += (report.metrics.preferredSkillsMatched * 0.2);
    
    // Metrics score (max 20 points, 4 points per metric up to 5)
    score += Math.min(20, metricsCount * 4);
    
    // Verbs score (max 10 points, 1 point per verb)
    score += Math.min(10, verbsCount);
    
    // Base formatting score 10, minus 2 for each warning
    let formattingScore = 10 - (report.warnings.length * 2);
    score += Math.max(0, formattingScore);

    report.overallScore = Math.round(score);

    return report;
  }

  extractAllText(data) {
    if (!data) return '';
    let text = '';

    if (data.professionalSummary?.value) text += data.professionalSummary.value + ' ';
    
    const extractArray = (arr) => {
      if (!arr) return;
      arr.forEach(item => {
        if (item.title?.value) text += item.title.value + ' ';
        if (item.company?.value) text += item.company.value + ' ';
        if (item.description && Array.isArray(item.description.value)) {
          item.description.value.forEach(b => {
            text += (b.value || b) + ' ';
          });
        }
      });
    };

    extractArray(data.experience);
    extractArray(data.projects);

    if (data.skills) {
      Object.values(data.skills).forEach(cat => {
        if (Array.isArray(cat)) {
          cat.forEach(s => text += (s.value || s) + ' ');
        }
      });
    }

    return text;
  }
}

export default new ResumeQualityService();
