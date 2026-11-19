import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getHealthInsight, chat, drugCheck, getTimeline } from '../controllers/aiController.js';

const router = express.Router();

router.get('/insight', protect, getHealthInsight);
router.post('/chat', protect, chat);
router.post('/drug-check', protect, drugCheck);
router.get('/timeline', protect, getTimeline);

export default router;
