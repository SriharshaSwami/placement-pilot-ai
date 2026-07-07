import Job from '../models/Job.js';
import TailoringSession from '../models/TailoringSession.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import Application from '../models/Application.js';
import InterviewSession from '../models/InterviewSession.js';
import CustomError from '../errors/CustomError.js';

class JobDeletionService {
  async deleteCompleteJobCascade(userId, jobId) {
    // 1. Fetch target job
    const targetJob = await Job.findOne({ _id: jobId, userId });
    if (!targetJob) {
      throw new CustomError('Job not found', 404, 'NOT_FOUND');
    }

    // 2. Atomic-ish database cascade deletions
    await Promise.all([
      // Delete Tailoring Sessions tied to this job
      TailoringSession.deleteMany({ jobId: targetJob._id }),
      
      // Delete ATS Analyses tied to this job
      ResumeAnalysis.deleteMany({ jobId: targetJob._id }),
      
      // Unlink from Applications
      Application.updateMany(
        { jobId: targetJob._id },
        { $unset: { jobId: "" } }
      ),
      
      // Unlink from Interview Sessions
      InterviewSession.updateMany(
        { jobId: targetJob._id },
        { $unset: { jobId: "" } }
      ),
      
      // Hard delete the Job itself
      Job.deleteOne({ _id: targetJob._id })
    ]);

    // Note: Future embeddings/vector indexes would be hooked in here:
    // await VectorStore.deleteEmbeddings({ metadata: { jobId: targetJob._id } })

    return { 
      message: 'Job and all associated temporary resources successfully deleted'
    };
  }
}

export default new JobDeletionService();
