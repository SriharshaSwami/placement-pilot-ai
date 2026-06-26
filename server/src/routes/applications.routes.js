import express from 'express';
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  generateInsights,
  getDashboardStats
} from '../controllers/applications.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats); // Specific route before :id
router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplication);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.post('/:id/insights', generateInsights);

export default router;
