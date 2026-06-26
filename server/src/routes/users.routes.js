import express from 'express';
import { scaffoldUsers } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', scaffoldUsers);

export default router;
