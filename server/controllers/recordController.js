const Record = require('../models/Record');
const { cloudinary } = require('../middleware/uploadMiddleware');
const { classifyRecord, summarizeRecord, extractTags } = require('../utils/gemini');

// POST /api/records/upload
const uploadRecord = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { title, category, doctorName, hospitalName, recordDate, notes, diagnosis } = req.body;
    const fileUrl = req.file.path;
    const filePublicId = req.file.filename;
    const originalName = req.file.originalname || '';
    const mime = req.file.mimetype || '';
    const isImageMime = mime.startsWith('image/');
    const isImageExt = /\.(jpg|jpeg|png|webp|gif)$/i.test(originalName);
    const isPdfMime = mime === 'application/pdf';
    const isPdfExt = /\.pdf$/i.test(originalName);
    const fileType = (isPdfMime || isPdfExt) ? 'pdf' : (isImageMime || isImageExt) ? 'image' : 'other';

    // Auto-classify using AI if no category provided
    let finalCategory = category || 'Other';
    let aiSummary = '';
    let aiTags = [];

    try {
      if (!category || category === 'Other') {
        finalCategory = await classifyRecord('', req.file.originalname);
      }
      aiSummary = await summarizeRecord('', finalCategory);
      aiTags = await extractTags('', finalCategory);
    } catch (aiErr) {
      console.error('AI processing error:', aiErr.message);
    }

    const record = await Record.create({
      userId: req.user._id,
      title: title || req.file.originalname,
      category: finalCategory,
      fileUrl,
      filePublicId,
      fileType,
      aiSummary,
      aiTags,
      doctorName: doctorName || '',
      hospitalName: hospitalName || '',
      diagnosis: diagnosis || '',
      recordDate: recordDate || Date.now(),
      notes: notes || '',
    });

    res.status(201).json(record);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/records
const getRecords = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, sort = '-recordDate' } = req.query;
    const query = { userId: req.user._id };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { doctorName: { $regex: search, $options: 'i' } },
        { hospitalName: { $regex: search, $options: 'i' } },
        { aiTags: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Record.countDocuments(query);
    const records = await Record.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ records, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/records/:id
const getRecord = async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/records/:id
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/records/:id
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    // Delete from Cloudinary
    if (record.filePublicId) {
      try {
        await cloudinary.uploader.destroy(record.filePublicId, {
          resource_type: record.fileType === 'image' ? 'image' : 'raw',
        });
      } catch (cloudErr) {
        console.error('Cloudinary delete error:', cloudErr.message);
      }
    }

    await record.deleteOne();
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/records/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Record.countDocuments({ userId });
    const byCategory = await Record.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const recent = await Record.find({ userId }).sort('-createdAt').limit(5);
    res.json({ total, byCategory, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/records/:id/regenerate-ai
const regenerateAI = async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    // Use extractedText if available, otherwise build context from metadata
    const context = record.extractedText ||
      `Title: ${record.title}\nCategory: ${record.category}\nDoctor: ${record.doctorName || 'Unknown'}\nHospital: ${record.hospitalName || 'Unknown'}\nDiagnosis: ${record.diagnosis || 'Not specified'}`;

    const aiSummary = await summarizeRecord(context, record.category);
    const aiTags = await extractTags(context, record.category);

    record.aiSummary = aiSummary;
    record.aiTags = aiTags;
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadRecord, getRecords, getRecord, updateRecord, deleteRecord, getStats, regenerateAI };
