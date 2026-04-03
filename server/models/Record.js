const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Prescription',
        'Blood Test',
        'X-Ray',
        'MRI/CT Scan',
        'Vaccination',
        'Allergy Record',
        'Medical Certificate',
        'ECG',
        'Invoice',
        'Other',
      ],
      default: 'Other',
    },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String }, // Cloudinary public_id for deletion
    fileType: { type: String, enum: ['pdf', 'image', 'other'], default: 'other' },
    extractedText: { type: String, default: '' },
    aiSummary: { type: String, default: '' },
    aiTags: [{ type: String }],
    doctorName: { type: String, default: '' },
    hospitalName: { type: String, default: '' },
    diagnosis: { type: String, default: '' },
    recordDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for search
recordSchema.index({ title: 'text', doctorName: 'text', hospitalName: 'text', aiTags: 'text', diagnosis: 'text' });

module.exports = mongoose.model('Record', recordSchema);
