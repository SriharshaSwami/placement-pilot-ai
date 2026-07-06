import CustomError from '../errors/CustomError.js';
import jobRepository from '../repositories/job.repository.js';
import resumeRepository from '../repositories/resume.repository.js';
import jobParserService from './parser/jobParser.service.js';

class JobsService {
  async createJob(userId, jobData) {
    const { company, role, location, jobType, source, description } = jobData;

    if (!company || !role || !description) {
      throw new CustomError('Company, role, and description are required', 400, 'VALIDATION_ERROR');
    }

    // Parse the description
    const parsedData = jobParserService.parseJobDescription(description);

    let embedding = null;
    let embeddingHash = null;

    try {
      const embeddingService = (await import('./embedding.service.js')).default;
      const embedResult = await embeddingService.generateEmbeddingIfChanged(parsedData.extractedText, null, {
        userId,
        sourceType: 'Job',
        sourceId: null
      });
      if (embedResult) {
        embedding = embedResult.embedding;
        embeddingHash = embedResult.hash;
      }
    } catch (err) {
      console.error('[JobsService] Failed to generate embedding for job:', err.message);
    }

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
      embedding,
      embeddingHash
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

      try {
        const embeddingService = (await import('./embedding.service.js')).default;
        const embedResult = await embeddingService.generateEmbeddingIfChanged(parsedData.extractedText, job.embeddingHash, {
          userId,
          sourceType: 'Job',
          sourceId: jobId
        });
        if (embedResult) {
          updateData.embedding = embedResult.embedding;
          updateData.embeddingHash = embedResult.hash;
        }
      } catch (err) {
        console.error('[JobsService] Failed to generate embedding for job:', err.message);
      }
    }

    return jobRepository.updateById(jobId, updateData);
  }

  async deleteJob(userId, jobId) {
    await this.getJob(userId, jobId); // verifies existence and ownership
    await jobRepository.deleteById(jobId);
  }

  async getRankedJobs(userId, resumeId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume || resume.userId.toString() !== userId.toString()) {
      throw new CustomError('Resume not found', 404);
    }
    if (!resume.embedding || resume.embedding.length === 0) {
      return this.listJobs(userId); // Return unranked if no embedding
    }

    const jobs = await this.listJobs(userId);
    const embeddingService = (await import('./embedding.service.js')).default;
    
    const rankedJobs = jobs.map(job => {
      let score = 0;
      if (job.embedding && job.embedding.length > 0) {
        score = embeddingService.calculateSimilarity(resume.embedding, job.embedding);
      }
      return { ...job.toObject(), similarityScore: score };
    });

    rankedJobs.sort((a, b) => b.similarityScore - a.similarityScore);
    return rankedJobs;
  }
}

export default new JobsService();
