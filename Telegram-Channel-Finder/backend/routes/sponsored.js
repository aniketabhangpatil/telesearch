import express from 'express';
import { getTop100Sponsored, getTop10Featured } from '../controllers/sponsoredController.js';

const router = express.Router();

router.get('/top100', getTop100Sponsored);
router.get('/featured', getTop10Featured);

export default router;

