import CustomError from '../errors/CustomError.js';
import resumeRepository from '../repositories/resume.repository.js';
import { uploadFile, deleteFile } from '../integrations/cloudinary/uploadService.js';
import resumeParserService from './parser/resumeParser.service.js';
import fs from 'fs';

const MAX_RESUMES = 10;

class ResumesService {
  async uploadResume(userId, file, title) {
    // Check max resumes limit
    const currentCount = await resumeRepository.countByUserId(userId);
    if (currentCount >= MAX_RESUMES) {
      throw new CustomError(`Maximum limit of ${MAX_RESUMES} resumes reached. Please delete one first.`, 400, 'MAX_RESUMES_REACHED');
    }

    try {
      // 1. Parse PDF from local temp file BEFORE uploading to Cloudinary
      //    This avoids needing to download from Cloudinary later (bypasses untrusted CDN block)
      let parsedData;
      try {
        parsedData = await resumeParserService.parseFromBuffer(file.buffer);
      } catch (parseError) {
        console.error('Failed to parse PDF during upload:', parseError.message);
        parsedData = {
          rawText: '',
          cleanedText: '',
          sections: {},
          metadata: {
            parsingStatus: 'failed',
            sectionCount: 0,
            extractedCharacterCount: 0,
            parserVersion: '1.0.0',
            extractionTimestamp: new Date(),
            failureReason: parseError.message,
          },
        };
      }

      // 2. Upload to Cloudinary
      const folderPath = `placementpilot/resumes/${userId}`;
      const uploadResult = await uploadFile(file, folderPath);

      // 3. Determine if this should be the primary resume
      const primaryCount = await resumeRepository.countPrimaryByUserId(userId);
      const isPrimary = primaryCount === 0; // First resume is automatically primary

      // 4. Save to Database with parsed data already included
      const newResume = await resumeRepository.create({
        userId,
        title: title || file.originalname.split('.')[0],
        originalFilename: file.originalname,
        cloudinaryPublicId: uploadResult.publicId,
        cloudinaryUrl: uploadResult.url,
        fileSize: uploadResult.bytes || file.size,
        mimeType: file.mimetype,
        isPrimary,
        parsedData,
        uploadStatus: 'completed'
      });

      return newResume;
    } catch (error) {
      throw error;
    }
  }

  async listResumes(userId) {
    return resumeRepository.findByUserId(userId);
  }

  async getResume(userId, resumeId) {
    const resume = await resumeRepository.findByIdAndUserId(resumeId, userId);
    if (!resume) {
      throw new CustomError('Resume not found', 404, 'NOT_FOUND');
    }
    return resume;
  }

  async renameResume(userId, resumeId, newTitle) {
    const resume = await this.getResume(userId, resumeId); // Validates existence & ownership
    return resumeRepository.updateById(resume._id, { title: newTitle });
  }

  async setPrimaryResume(userId, resumeId) {
    const resume = await this.getResume(userId, resumeId);
    
    // Unset current primary resumes
    await resumeRepository.unsetPrimaryResumes(userId);
    
    // Set this one as primary
    return resumeRepository.updateById(resume._id, { isPrimary: true });
  }

  async deleteResume(userId, resumeId) {
    let resume;
    try {
      resume = await this.getResume(userId, resumeId);
    } catch (error) {
      if (error.statusCode === 404) {
        return { message: 'Resume already deleted' };
      }
      throw error;
    }
    
    // Delete the physical file from Cloudinary and local storage
    if (resume.cloudinaryPublicId) {
      try {
        await deleteFile(resume.cloudinaryPublicId);
      } catch (error) {
        console.error(`Failed to delete Cloudinary asset ${resume.cloudinaryPublicId}:`, error);
      }
    }
    
    return resumeRepository.softDelete(resume._id);
  }
}

export default new ResumesService();
