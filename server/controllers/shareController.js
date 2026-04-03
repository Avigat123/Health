const ShareLink = require('../models/ShareLink');
const Record = require('../models/Record');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// POST /api/share/create
const createShareLink = async (req, res) => {
  try {
    const { recordIds, shareAll, expiresInHours = 24, maxUses, doctorNote } = req.body;

    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const share = await ShareLink.create({
      token: uuidv4(),
      ownerId: req.user._id,
      recordIds: recordIds || [],
      shareAll: shareAll || false,
      expiresAt,
      maxUses: maxUses || null,
      doctorNote: doctorNote || '',
    });

    const shareUrl = `${process.env.CLIENT_URL}/share/${share.token}`;

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(shareUrl, {
      width: 300,
      color: { dark: '#0f172a', light: '#ffffff' },
    });

    res.status(201).json({ share, shareUrl, qrCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/share/my-links
const getMyLinks = async (req, res) => {
  try {
    const links = await ShareLink.find({ ownerId: req.user._id }).sort('-createdAt');
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/share/:id/revoke
const revokeLink = async (req, res) => {
  try {
    const link = await ShareLink.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      { isRevoked: true },
      { new: true }
    );
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json({ message: 'Link revoked', link });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/share/access/:token  (public - doctor accesses this)
const accessSharedRecords = async (req, res) => {
  try {
    const { token } = req.params;
    const share = await ShareLink.findOne({ token });

    if (!share) return res.status(404).json({ message: 'Share link not found or expired' });
    if (share.isRevoked) return res.status(403).json({ message: 'This link has been revoked' });
    if (new Date() > share.expiresAt) return res.status(410).json({ message: 'This link has expired' });
    if (share.maxUses && share.usedCount >= share.maxUses)
      return res.status(429).json({ message: 'Maximum access limit reached' });

    // Increment usage count
    share.usedCount += 1;
    await share.save();

    let records;
    if (share.shareAll) {
      records = await Record.find({ userId: share.ownerId }).sort('-recordDate');
    } else {
      records = await Record.find({ _id: { $in: share.recordIds } }).sort('-recordDate');
    }

    const User = require('../models/User');
    const owner = await User.findById(share.ownerId).select('name bloodGroup allergies currentMedications emergencyContacts');

    res.json({
      records,
      patient: owner,
      share: {
        doctorNote: share.doctorNote,
        expiresAt: share.expiresAt,
        shareAll: share.shareAll,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createShareLink, getMyLinks, revokeLink, accessSharedRecords };
