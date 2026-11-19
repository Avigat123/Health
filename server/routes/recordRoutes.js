import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  uploadRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
  getStats,
  regenerateAI,
} from '../controllers/recordController.js';

const router = express.Router();

router.get('/stats', protect, getStats);
router.post('/upload', protect, upload.single('file'), uploadRecord);
router.get('/', protect, getRecords);
router.get('/:id', protect, getRecord);
router.put('/:id', protect, updateRecord);
router.delete('/:id', protect, deleteRecord);
router.post('/:id/regenerate-ai', protect, regenerateAI);

export default router;
