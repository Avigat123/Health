const { generateHealthInsight, chatWithAssistant, checkDrugInteractions } = require('../utils/gemini');
const Record = require('../models/Record');

// GET /api/ai/insight
const getHealthInsight = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user._id }).sort('-recordDate').limit(20);
    const insight = await generateHealthInsight(records);
    res.json({ insight });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/chat
const chat = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    const records = await Record.find({ userId: req.user._id }).sort('-recordDate').limit(30);
    const answer = await chatWithAssistant(question, records);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/drug-check
const drugCheck = async (req, res) => {
  try {
    const { medications } = req.body;
    if (!medications || !medications.length)
      return res.status(400).json({ message: 'Medications list required' });

    const result = await checkDrugInteractions(medications);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ai/timeline
const getTimeline = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user._id })
      .sort('recordDate')
      .select('title category recordDate doctorName hospitalName aiSummary');
    res.json({ timeline: records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getHealthInsight, chat, drugCheck, getTimeline };
