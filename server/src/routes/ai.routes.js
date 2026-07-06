import express from 'express';
import { analyzeResume, getResumeAnalysis } from '../controllers/ai.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);
router.use(aiLimiter);

router.post('/resume/:id/analyze', analyzeResume);
router.get('/resume/:id/analysis', getResumeAnalysis);

export default router;
