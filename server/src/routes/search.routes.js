import express from 'express';
import { performSearch } from '../controllers/search.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', performSearch);

export default router;
