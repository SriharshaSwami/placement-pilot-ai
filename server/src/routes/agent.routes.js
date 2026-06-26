import express from 'express';
import { chatWithAgents, getExecutionHistory } from '../controllers/agent.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);

router.post('/chat', aiLimiter, chatWithAgents);
router.get('/history', getExecutionHistory);

export default router;
