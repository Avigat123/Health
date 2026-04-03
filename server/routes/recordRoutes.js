const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
  uploadRecord, getRecords, getRecord, updateRecord, deleteRecord, getStats, regenerateAI,
} = require('../controllers/recordController');

router.get('/stats', protect, getStats);
router.post('/upload', protect, upload.single('file'), uploadRecord);
router.get('/', protect, getRecords);
router.get('/:id', protect, getRecord);
router.put('/:id', protect, updateRecord);
router.delete('/:id', protect, deleteRecord);
router.post('/:id/regenerate-ai', protect, regenerateAI);

module.exports = router;
