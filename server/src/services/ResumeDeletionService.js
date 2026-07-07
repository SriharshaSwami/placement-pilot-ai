import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import TailoringSession from '../models/TailoringSession.js';
import InterviewSession from '../models/InterviewSession.js';
import Application from '../models/Application.js';
import { deleteFile } from '../integrations/cloudinary/uploadService.js';
import CustomError from '../errors/CustomError.js';

class ResumeDeletionService {
  async deleteCompleteResumeCascade(userId, resumeId) {
    // 1. Fetch target resume
    const targetResume = await Resume.findOne({ _id: resumeId, userId });
    if (!targetResume) {
      throw new CustomError('Resume not found', 404, 'NOT_FOUND');
    }

    let resumeIdsToDelete = [targetResume._id];
    let resumesToDelete = [targetResume];

    // 2. Identify if it's a parent resume and find all children
    if (!targetResume.parentResumeId) {
      const children = await Resume.find({ parentResumeId: targetResume._id, userId });
      children.forEach(child => {
        resumeIdsToDelete.push(child._id);
        resumesToDelete.push(child);
      });
    }

    // 3. Extract all unique Cloudinary Public IDs
    const cloudinaryIds = [...new Set(
      resumesToDelete
        .map(r => r.cloudinaryPublicId)
        .filter(id => id != null)
    )];

    // 4. Delete from Cloudinary (with grace, do not fail DB cascade if CDN fails)
    const cloudinaryPromises = cloudinaryIds.map(async (publicId) => {
      try {
        await deleteFile(publicId);
      } catch (err) {
        console.error(`[ResumeDeletionService] Failed to delete Cloudinary asset ${publicId}:`, err);
      }
    });
    await Promise.allSettled(cloudinaryPromises);

    // 5. Atomic-ish database cascade deletions
    await Promise.all([
      // Delete Tailoring Sessions
      TailoringSession.deleteMany({ resumeId: { $in: resumeIdsToDelete } }),
      
      // Delete ATS Analyses
      ResumeAnalysis.deleteMany({ resumeId: { $in: resumeIdsToDelete } }),
      
      // Unlink from Applications
      Application.updateMany(
        { resumeId: { $in: resumeIdsToDelete } },
        { $unset: { resumeId: "" } }
      ),
      
      // Unlink from Interview Sessions
      InterviewSession.updateMany(
        { resumeId: { $in: resumeIdsToDelete } },
        { $unset: { resumeId: "" } }
      ),
      
      // Hard delete the Resumes themselves
      Resume.deleteMany({ _id: { $in: resumeIdsToDelete } })
    ]);

    // Note: Future embeddings/vector indexes would be hooked in here:
    // await VectorStore.deleteEmbeddings({ metadata: { resumeId: { $in: resumeIdsToDelete } } })

    return { 
      message: 'Resume and all associated resources successfully deleted', 
      deletedCount: resumeIdsToDelete.length 
    };
  }
}

export default new ResumeDeletionService();
