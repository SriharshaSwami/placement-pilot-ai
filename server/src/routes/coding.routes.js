import express from 'express';
import { setupSession, getSessions, getSession, requestHint, submitCode } from '../controllers/coding.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/setup', setupSession);
router.get('/', getSessions);
router.get('/:id', getSession);
router.post('/:id/hint', requestHint);
router.post('/:id/submit', submitCode);

export default router;
