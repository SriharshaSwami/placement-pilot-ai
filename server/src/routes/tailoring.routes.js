import express from 'express';
import { initiateTailoring, getSession, getSessionByParams, updateSuggestionStatus } from '../controllers/tailoring.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', initiateTailoring);
router.get('/lookup', getSessionByParams);
router.post('/:sessionId/save', (req, res, next) => {
  // We'll import and map it from controller
  import('../controllers/tailoring.controller.js').then(c => c.saveTailoredResume(req, res, next));
});
router.post('/:sessionId/targeted', (req, res, next) => {
  import('../controllers/tailoring.controller.js').then(c => c.generateTargetedSuggestion(req, res, next));
});
router.patch('/:sessionId/suggestions', (req, res, next) => {
  import('../controllers/tailoring.controller.js').then(c => c.batchUpdateSuggestions(req, res, next));
});
router.get('/:sessionId', getSession);
router.patch('/:sessionId/suggestions/:suggestionId', updateSuggestionStatus);

export default router;
