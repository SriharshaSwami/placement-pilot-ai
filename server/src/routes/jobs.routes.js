import express from 'express';
import { createJob, getJobs, getJob, updateJob, deleteJob } from '../controllers/jobs.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createJob);
router.get('/', getJobs);
router.get('/:id', getJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
