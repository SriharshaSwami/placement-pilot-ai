import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import resumesService from '../services/resumes.service.js';
import resumeParserService from '../services/parser/resumeParser.service.js';
import CustomError from '../errors/CustomError.js';
import Resume from '../models/Resume.js';

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new CustomError('Please upload a PDF file', 400, 'NO_FILE_PROVIDED');
  }

  const resume = await resumesService.uploadResume(req.user._id, req.file, req.body.title);
  res.status(201).json(successResponse(resume, 'Resume uploaded successfully'));
});

export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await resumesService.listResumes(req.user._id);
  res.status(200).json(successResponse(resumes, 'Resumes fetched successfully'));
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await resumesService.getResume(req.user._id, req.params.id);
  res.status(200).json(successResponse(resume, 'Resume fetched successfully'));
});

export const renameResume = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new CustomError('Title is required', 400, 'VALIDATION_ERROR');
  }
  const resume = await resumesService.renameResume(req.user._id, req.params.id, title);
  res.status(200).json(successResponse(resume, 'Resume renamed successfully'));
});

export const setPrimaryResume = asyncHandler(async (req, res) => {
  const resume = await resumesService.setPrimaryResume(req.user._id, req.params.id);
  res.status(200).json(successResponse(resume, 'Primary resume updated successfully'));
});

export const deleteResume = asyncHandler(async (req, res) => {
  await resumesService.deleteResume(req.user._id, req.params.id);
  res.status(200).json(successResponse(null, 'Resume deleted successfully'));
});

export const parseResume = asyncHandler(async (req, res) => {
  // Validate ownership first
  await resumesService.getResume(req.user._id, req.params.id);
  
  // Trigger parsing pipeline
  const parsedData = await resumeParserService.createStructuredResume(req.params.id);
  
  res.status(200).json(successResponse(parsedData.metadata, 'Resume parsed successfully'));
});

export const getVersions = asyncHandler(async (req, res) => {
  const versions = await resumesService.listVersions(req.user._id, req.params.id);
  res.status(200).json(successResponse(versions, 'Versions fetched successfully'));
});

export const restoreVersion = asyncHandler(async (req, res) => {
  const resume = await resumesService.restoreVersion(req.user._id, req.params.id, req.body.versionId);
  res.status(200).json(successResponse(resume, 'Version restored as primary successfully'));
});

export const generatePdf = asyncHandler(async (req, res) => {
  const resume = await resumesService.getResume(req.user._id, req.params.id);
  
  if (!resume.parsedData || !resume.parsedData.structuredData) {
    throw new CustomError('Resume must be parsed first to generate a PDF', 400, 'BAD_REQUEST');
  }

  // Import generator service and adapter dynamically or at top level (assuming top level for now, let's inject it)
  const generatorService = (await import('../resume-generator/services/generator.service.js')).default;
  const reactEngineAdapter = (await import('../resume-generator/templates/ReactEngineAdapter.js')).default;
  
  const pdfBuffer = await generatorService.generate(
    resume.parsedData.structuredData,
    reactEngineAdapter,
    null, // renderer is unused since adapter delegates to Puppeteer internally
    'pdf',
    resume.selectedTemplate
  );

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
  res.send(pdfBuffer);
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.body;
  if (!['classic', 'modern', 'minimal', 'professional'].includes(templateId)) {
    throw new CustomError('Invalid template ID', 400, 'BAD_REQUEST');
  }

  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: { selectedTemplate: templateId } },
    { new: true }
  );

  if (!resume) {
    throw new CustomError('Resume not found', 404, 'NOT_FOUND');
  }

  res.status(200).json(successResponse(resume, 'Template updated successfully'));
});

export const saveManualEdits = asyncHandler(async (req, res) => {
  const { structuredData } = req.body;
  if (!structuredData) {
    throw new CustomError('Structured data is required to save edits', 400, 'BAD_REQUEST');
  }

  const newVersion = await resumesService.saveManualEdits(req.user._id, req.params.id, structuredData);
  res.status(201).json(successResponse(newVersion, 'Manual edits saved as a new version successfully'));
});

export const updateResumeData = asyncHandler(async (req, res) => {
  const { structuredData } = req.body;
  if (!structuredData) {
    throw new CustomError('Structured data is required to update resume', 400, 'BAD_REQUEST');
  }

  const updatedResume = await resumesService.updateResumeData(req.user._id, req.params.id, structuredData);
  res.status(200).json(successResponse(updatedResume, 'Resume data updated successfully'));
});
