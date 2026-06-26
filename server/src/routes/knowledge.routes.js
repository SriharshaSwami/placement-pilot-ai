import express from 'express';
import { getKnowledgeBase, manualIndex } from '../controllers/knowledge.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getKnowledgeBase);
router.post('/index', manualIndex);

export default router;
