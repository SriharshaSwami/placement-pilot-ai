import express from 'express';
import multer from 'multer';
import {
  uploadResume,
  getResumes,
  getResume,
  renameResume,
  setPrimaryResume,
  deleteResume,
  parseResume,
} from '../controllers/resumes.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import CustomError from '../errors/CustomError.js';

// Multer config
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new CustomError('Only PDF files are allowed', 400, 'INVALID_FILE_TYPE'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

const router = express.Router();

router.use(protect); // All resume routes require authentication

router.post('/', upload.single('file'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.patch('/:id', renameResume);
router.patch('/:id/primary', setPrimaryResume);
router.delete('/:id', deleteResume);
router.post('/:id/parse', parseResume);

export default router;
