/**
 * JSDoc Type Definitions for Resume Generation
 * This ensures templates consume a strictly typed Resume JSON.
 */

/**
 * @typedef {Object} ValueWithConfidence
 * @property {string} value
 * @property {number} confidence
 */

/**
 * @typedef {Object} CandidateLinks
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {Object} CandidateData
 * @property {ValueWithConfidence} [name]
 * @property {ValueWithConfidence} [email]
 * @property {ValueWithConfidence} [phone]
 * @property {ValueWithConfidence} [linkedin]
 * @property {ValueWithConfidence} [github]
 * @property {ValueWithConfidence} [portfolio]
 * @property {ValueWithConfidence} [location]
 * @property {CandidateLinks[]} [links]
 */

/**
 * @typedef {Object} EducationData
 * @property {ValueWithConfidence} [institution]
 * @property {ValueWithConfidence} [degree]
 * @property {ValueWithConfidence} [specialization]
 * @property {ValueWithConfidence} [startDate]
 * @property {ValueWithConfidence} [endDate]
 * @property {ValueWithConfidence} [cgpa]
 * @property {ValueWithConfidence} [percentage]
 * @property {ValueWithConfidence} [location]
 */

/**
 * @typedef {Object} ExperienceData
 * @property {ValueWithConfidence} [company]
 * @property {ValueWithConfidence} [role]
 * @property {ValueWithConfidence} [employmentType]
 * @property {ValueWithConfidence} [startDate]
 * @property {ValueWithConfidence} [endDate]
 * @property {ValueWithConfidence} [duration]
 * @property {ValueWithConfidence} [location]
 * @property {ValueWithConfidence[]} [responsibilities]
 * @property {ValueWithConfidence[]} [technologies]
 */

/**
 * @typedef {Object} SkillsData
 * @property {ValueWithConfidence[]} [languages]
 * @property {ValueWithConfidence[]} [frameworks]
 * @property {ValueWithConfidence[]} [libraries]
 * @property {ValueWithConfidence[]} [databases]
 * @property {ValueWithConfidence[]} [cloud]
 * @property {ValueWithConfidence[]} [devOps]
 * @property {ValueWithConfidence[]} [tools]
 * @property {ValueWithConfidence[]} [aiML]
 * @property {ValueWithConfidence[]} [other]
 */

/**
 * @typedef {Object} StructuredResumeData
 * @property {CandidateData} [candidate]
 * @property {ValueWithConfidence} [professionalSummary]
 * @property {SkillsData} [skills]
 * @property {EducationData[]} [education]
 * @property {ExperienceData[]} [experience]
 * @property {Object[]} [projects]
 * @property {Object[]} [certifications]
 * @property {Object[]} [achievements]
 * @property {Object[]} [leadership]
 * @property {Object[]} [publications]
 * @property {Object[]} [openSource]
 * @property {Object[]} [hackathons]
 * @property {Object[]} [codingProfiles]
 * @property {Object[]} [languagesSpoken]
 */
