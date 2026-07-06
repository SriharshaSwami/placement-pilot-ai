import express from 'express';
import { register, login, logout, getMe, refresh } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout); // Protect might not be needed if they can just clear cookie
router.post('/refresh', refresh);
router.get('/me', protect, getMe);

export default router;
