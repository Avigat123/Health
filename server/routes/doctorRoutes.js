const express = require('express');
const router = express.Router();

// Doctor portal - redirect to share access route
// Doctors access records via /api/share/access/:token
// This route is a placeholder for future doctor-specific features
router.get('/ping', (req, res) => {
  res.json({ message: 'Doctor portal route active. Use /api/share/access/:token to view patient records.' });
});

module.exports = router;
