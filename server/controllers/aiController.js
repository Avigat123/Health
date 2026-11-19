import { generateHealthInsight, chatWithAssistant, checkDrugInteractions } from '../utils/gemini.js';
import Record from '../models/Record.js';

// GET /api/ai/insight
export const getHealthInsight = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user._id }).sort('-recordDate').limit(20);
    const insight = await generateHealthInsight(records);
    res.json({ insight });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/chat
export const chat = async (req, res) => {
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
export const drugCheck = async (req, res) => {
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
export const getTimeline = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user._id })
      .sort('recordDate')
      .select('title category recordDate doctorName hospitalName aiSummary');
    res.json({ timeline: records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
