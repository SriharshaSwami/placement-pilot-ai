import User from '../../models/User.js';
import Resume from '../../models/Resume.js';
import InterviewSession from '../../models/InterviewSession.js';
import Application from '../../models/Application.js';
import Job from '../../models/Job.js';
import logger from '../../utils/logger.js';

export const dataFetchTools = {
  /**
   * Fetch the latest resume for a user
   */
  fetchLatestResume: async (userId, query = '') => {
    try {
      logger.info(`[Tools] Fetching latest resume for user: ${userId}`);
      const resume = await Resume.findOne({ userId: userId, deletedAt: null })
        .sort({ isPrimary: -1, createdAt: -1 });
        
      if (!resume) {
        return { message: 'No resume found.' };
      }

      const lowerQuery = query.toLowerCase();
      let result = {};
      let includeAll = false;

      // Determine what to include based on keywords
      const wantsSkills = lowerQuery.includes('skill') || lowerQuery.includes('missing') || lowerQuery.includes('technolog');
      const wantsExperience = lowerQuery.includes('experience') || lowerQuery.includes('work') || lowerQuery.includes('job');
      const wantsEducation = lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('college');
      const wantsProjects = lowerQuery.includes('project');
      const wantsAnalysis = lowerQuery.includes('improve') || lowerQuery.includes('weakness') || lowerQuery.includes('feedback') || lowerQuery.includes('ats') || lowerQuery.includes('score') || lowerQuery.includes('good for');

      if (!wantsSkills && !wantsExperience && !wantsEducation && !wantsProjects && !wantsAnalysis) {
        includeAll = true; // Fallback if no specific intent is found
      }

      if (includeAll || wantsSkills) result.skills = resume.parsedData?.structuredData?.skills || {};
      if (includeAll || wantsExperience) result.experience = resume.parsedData?.structuredData?.experience || [];
      if (includeAll || wantsEducation) result.education = resume.parsedData?.structuredData?.education || [];
      if (includeAll || wantsProjects) result.projects = resume.parsedData?.structuredData?.projects || [];
      if (includeAll) result.summary = resume.parsedData?.structuredData?.professionalSummary?.value || '';

      if (wantsAnalysis) {
        // Dynamically import to avoid circular dependencies or import at top
        const { default: ResumeAnalysis } = await import('../../models/ResumeAnalysis.js');
        const analysis = await ResumeAnalysis.findOne({ resumeId: resume._id }).sort({ createdAt: -1 });
        if (analysis) {
          result.atsData = {
            atsScore: analysis.atsScore,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            missingKeywords: analysis.missingKeywords,
            recommendations: analysis.recommendations
          };
        }
      }

      return result;
    } catch (error) {
      logger.error(`[Tools] Error fetching resume: ${error.message}`);
      return { error: 'Failed to fetch resume.' };
    }
  },

  /**
   * Fetch interview history for a user
   */
  fetchInterviewHistory: async (userId, limit = 5) => {
    try {
      logger.info(`[Tools] Fetching interview history for user: ${userId}`);
      const interviews = await InterviewSession.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      
      if (!interviews.length) return { message: 'No interview history found.' };
      
      return interviews.map(i => ({
        role: i.role,
        status: i.status,
        overallScore: i.feedback?.overallScore,
        strengths: i.feedback?.strengths,
        weakAreas: i.feedback?.areasForImprovement,
        date: i.createdAt
      }));
    } catch (error) {
      logger.error(`[Tools] Error fetching interviews: ${error.message}`);
      return { error: 'Failed to fetch interview history.' };
    }
  },

  /**
   * Fetch user profile information
   */
  fetchProfileInformation: async (userId) => {
    try {
      logger.info(`[Tools] Fetching profile info for user: ${userId}`);
      const profile = await User.findById(userId).select('-password').lean();
      if (!profile) return { message: 'Profile not found.' };

      return {
        name: profile.name,
        email: profile.email,
        careerGoals: profile.careerGoals,
        skills: profile.skills
      };
    } catch (error) {
      logger.error(`[Tools] Error fetching profile: ${error.message}`);
      return { error: 'Failed to fetch profile information.' };
    }
  },

  /**
   * Fetch applications for a user
   */
  fetchApplications: async (userId, limit = 5) => {
    try {
      logger.info(`[Tools] Fetching applications for user: ${userId}`);
      const applications = await Application.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
        
      if (!applications.length) return { message: 'No applications found.' };
      
      return applications.map(a => ({
        company: a.company,
        role: a.role,
        status: a.status,
        dateApplied: a.createdAt
      }));
    } catch (error) {
      logger.error(`[Tools] Error fetching applications: ${error.message}`);
      return { error: 'Failed to fetch applications.' };
    }
  },

  /**
   * Fetch jobs saved or applied by a user, or relevant jobs
   */
  fetchJobs: async (userId, limit = 5) => {
    try {
      logger.info(`[Tools] Fetching jobs context for user: ${userId}`);
      // Assuming a simple fetch of recent jobs for context, or user-specific if mapped
      const jobs = await Job.find().sort({ createdAt: -1 }).limit(limit).lean();
      if (!jobs.length) return { message: 'No jobs found.' };

      return jobs.map(j => ({
        title: j.title,
        company: j.company,
        location: j.location,
        requirements: j.requirements,
        skills: j.skills
      }));
    } catch (error) {
      logger.error(`[Tools] Error fetching jobs: ${error.message}`);
      return { error: 'Failed to fetch jobs.' };
    }
  }
};
