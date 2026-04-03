const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const shareLinkSchema = new mongoose.Schema(
  {
    token: { type: String, default: uuidv4, unique: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recordIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Record' }],
    shareAll: { type: Boolean, default: false }, // share all records
    accessType: { type: String, default: 'view-only' },
    expiresAt: { type: Date, required: true },
    usedCount: { type: Number, default: 0 },
    maxUses: { type: Number, default: null }, // null = unlimited
    isRevoked: { type: Boolean, default: false },
    doctorNote: { type: String, default: '' }, // optional note to doctor
  },
  { timestamps: true }
);

// Auto-expire
shareLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ShareLink', shareLinkSchema);
