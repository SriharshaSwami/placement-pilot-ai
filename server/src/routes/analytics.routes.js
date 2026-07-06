import express from 'express';
import { getAnalyticsDashboard, getRecommendations } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAnalyticsDashboard);
router.get('/recommendations', getRecommendations);

export default router;
