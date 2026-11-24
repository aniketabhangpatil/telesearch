import express from 'express';
import {
  getDashboardStats,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  getAllChannels,
  updateChannel,
  deleteChannel,
  getSponsoredList,
  addSponsoredChannel,
  updateSponsoredChannel,
  removeSponsoredChannel,
  reorderSponsoredChannels,
  getFeaturedList,
  setFeaturedChannel,
  removeFeaturedChannel,
  reorderFeaturedChannels,
  getSettings,
  updateSettings
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { uploadLogo } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply requireAdmin to all admin endpoints
router.use(requireAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// Submissions
router.get('/submissions/pending', getPendingSubmissions);
router.post('/submissions/:id/approve', approveSubmission);
router.post('/submissions/:id/reject', rejectSubmission);

// Channels
router.get('/channels', getAllChannels);
router.put('/channels/:id', uploadLogo.single('logo'), updateChannel);
router.delete('/channels/:id', deleteChannel);

// Sponsored Directory (Top 100)
router.get('/sponsored', getSponsoredList);
router.post('/sponsored', addSponsoredChannel);
router.put('/sponsored/reorder', reorderSponsoredChannels);
router.put('/sponsored/:id', updateSponsoredChannel);
router.delete('/sponsored/:id', removeSponsoredChannel);

// Top 10 Featured Orbit
router.get('/featured', getFeaturedList);
router.post('/featured/:id', setFeaturedChannel);
router.put('/featured/reorder', reorderFeaturedChannels);
router.delete('/featured/:id', removeFeaturedChannel);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;

