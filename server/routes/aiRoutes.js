const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getHealthInsight, chat, drugCheck, getTimeline } = require('../controllers/aiController');

router.get('/insight', protect, getHealthInsight);
router.post('/chat', protect, chat);
router.post('/drug-check', protect, drugCheck);
router.get('/timeline', protect, getTimeline);

module.exports = router;
