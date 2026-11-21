import express from 'express';
import { login, logout, me, changePassword } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', me);
router.post('/change-password', requireAdmin, changePassword);

export default router;

