import express from 'express';
import { getProfile, updateProfile, getRoadmap, updateTask } from '../controllers/career.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/roadmap', getRoadmap);
router.patch('/roadmap/tasks/:taskId', updateTask);

export default router;
