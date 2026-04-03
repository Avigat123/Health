const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createShareLink, getMyLinks, revokeLink, accessSharedRecords } = require('../controllers/shareController');

// Public route - doctor access via token
router.get('/access/:token', accessSharedRecords);

// Protected routes - patient manages their links
router.post('/create', protect, createShareLink);
router.get('/my-links', protect, getMyLinks);
router.patch('/:id/revoke', protect, revokeLink);

module.exports = router;
