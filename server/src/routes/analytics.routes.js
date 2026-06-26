import express from 'express';
import { getAnalyticsDashboard } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAnalyticsDashboard);

export default router;
