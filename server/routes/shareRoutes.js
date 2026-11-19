import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createShareLink, getMyLinks, revokeLink, accessSharedRecords } from '../controllers/shareController.js';

const router = express.Router();

// Public route - doctor access via token
router.get('/access/:token', accessSharedRecords);

// Protected routes - patient manages their links
router.post('/create', protect, createShareLink);
router.get('/my-links', protect, getMyLinks);
router.patch('/:id/revoke', protect, revokeLink);

export default router;
