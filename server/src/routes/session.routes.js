import express from 'express';
import { getSessions, revokeSession, revokeAllOtherSessions } from '../controllers/session.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSessions);
router.delete('/:sessionId', revokeSession);
router.post('/revoke-others', revokeAllOtherSessions);

export default router;
