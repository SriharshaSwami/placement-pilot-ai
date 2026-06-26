import express from 'express';
import { getMemories, deleteMemory, resetMemories, exportMemories, manualExtract } from '../controllers/memory.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMemories);
router.delete('/:id', deleteMemory);
router.delete('/', resetMemories);
router.get('/export', exportMemories);
router.post('/extract', manualExtract); // For testing extraction via UI

export default router;
