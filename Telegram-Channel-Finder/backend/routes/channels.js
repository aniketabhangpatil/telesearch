import express from 'express';
import { searchChannels, getCategories, submitChannel } from '../controllers/channelController.js';
import { uploadLogo } from '../middleware/uploadMiddleware.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/search', searchChannels);
router.get('/categories', getCategories);
router.post('/submit', submissionLimiter, uploadLogo.single('logo'), submitChannel);

export default router;

