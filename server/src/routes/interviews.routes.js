import express from 'express';
import { setupInterview, getInterviews, getInterview, generateNextQuestion, submitAnswer, finishInterview } from '../controllers/interviews.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/setup', setupInterview);
router.get('/', getInterviews);
router.get('/:id', getInterview);
router.post('/:id/question', generateNextQuestion);
router.post('/:id/answer', submitAnswer);
router.post('/:id/finish', finishInterview);

export default router;
