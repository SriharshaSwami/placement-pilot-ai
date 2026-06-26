import CustomError from '../errors/CustomError.js';
import jobRepository from '../repositories/job.repository.js';
import jobParserService from './parser/jobParser.service.js';

class JobsService {
  async createJob(userId, jobData) {
    const { company, role, location, jobType, source, description } = jobData;

    if (!company || !role || !description) {
      throw new CustomError('Company, role, and description are required', 400, 'VALIDATION_ERROR');
    }

    // Parse the description
    const parsedData = jobParserService.parseJobDescription(description);

    const newJob = await jobRepository.create({
      userId,
      company,
      role,
      location,
      jobType,
      source,
      description,
      extractedText: parsedData.extractedText,
      parsedSections: parsedData.parsedSections,
      keywords: parsedData.keywords,
      requiredSkills: parsedData.requiredSkills,
    });

    return newJob;
  }

  async listJobs(userId) {
    return jobRepository.findByUserId(userId);
  }

  async getJob(userId, jobId) {
    const job = await jobRepository.findById(jobId);
    if (!job || job.userId.toString() !== userId.toString()) {
      throw new CustomError('Job not found', 404, 'NOT_FOUND');
    }
    return job;
  }

  async updateJob(userId, jobId, updateData) {
    const job = await this.getJob(userId, jobId);
    
    // Reparse if description changed
    if (updateData.description && updateData.description !== job.description) {
      const parsedData = jobParserService.parseJobDescription(updateData.description);
      updateData.extractedText = parsedData.extractedText;
      updateData.parsedSections = parsedData.parsedSections;
      updateData.keywords = parsedData.keywords;
      updateData.requiredSkills = parsedData.requiredSkills;
    }

    return jobRepository.updateById(jobId, updateData);
  }

  async deleteJob(userId, jobId) {
    await this.getJob(userId, jobId); // verifies existence and ownership
    await jobRepository.deleteById(jobId);
  }
}

export default new JobsService();
