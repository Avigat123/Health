const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const classifyRecord = async (text, filename) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a medical document classifier. Based on the filename and extracted text below, classify this document into exactly ONE of these categories:
Prescription, Blood Test, X-Ray, MRI/CT Scan, Vaccination, Allergy Record, Medical Certificate, ECG, Invoice, Other.

Filename: ${filename}
Text excerpt: ${text ? text.substring(0, 500) : 'No text extracted'}

Respond with ONLY the category name, nothing else.`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim();
    const validCategories = ['Prescription', 'Blood Test', 'X-Ray', 'MRI/CT Scan', 'Vaccination', 'Allergy Record', 'Medical Certificate', 'ECG', 'Invoice', 'Other'];
    return validCategories.includes(category) ? category : 'Other';
  } catch (err) {
    console.error('Gemini classify error:', err.message);
    return 'Other';
  }
};

const summarizeRecord = async (text, category) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a helpful medical assistant. Summarize the following ${category} medical document in simple, easy-to-understand language for a patient. 
Keep it concise (2-4 sentences). Highlight key findings, values, or instructions.

Document text: ${text ? text.substring(0, 2000) : 'No text available'}

If no text is available, provide a generic helpful message about this type of document.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini summarize error:', err.message);
    return 'AI summary unavailable at this time.';
  }
};

const extractTags = async (text, category) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Extract 3-5 important medical tags/keywords from this ${category} document. 
Return ONLY a JSON array of strings like: ["tag1", "tag2", "tag3"]

Text: ${text ? text.substring(0, 1000) : 'No text available'}`;

    const result = await model.generateContent(prompt);
    let raw = result.response.text().trim();
    // Clean markdown code blocks if present
    raw = raw.replace(/```json\n?|\n?```/g, '').trim();
    const tags = JSON.parse(raw);
    return Array.isArray(tags) ? tags.slice(0, 5) : [];
  } catch (err) {
    console.error('Gemini tags error:', err.message);
    return [];
  }
};

const generateHealthInsight = async (records) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const recordsSummary = records.map(r => `${r.category} on ${new Date(r.recordDate).toLocaleDateString()}: ${r.title}`).join('\n');

    const prompt = `You are a patient-friendly health assistant. Based on these medical records, provide a brief health insight summary (3-5 sentences) that helps the patient understand their health journey. Be encouraging and clear.

Medical History:
${recordsSummary}

Focus on patterns, frequency of visits, and general health trends.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini insight error:', err.message);
    return 'Unable to generate health insight at this time.';
  }
};

const chatWithAssistant = async (question, records) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const context = records.map(r =>
      `[${r.category}] ${r.title} (${new Date(r.recordDate).toLocaleDateString()}) - ${r.aiSummary || r.doctorName || ''}`
    ).join('\n');

    const prompt = `You are HealthVault's AI assistant. Answer patient questions based on their stored medical records.
Be helpful, accurate, and always recommend consulting a doctor for medical decisions.

Patient's Medical Records:
${context || 'No records available yet.'}

Patient Question: ${question}

Provide a helpful, concise answer.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    return "I'm sorry, I couldn't process your question right now. Please try again.";
  }
};

const checkDrugInteractions = async (medications) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a pharmacist assistant. Check for potential drug interactions or concerns with these medications:
${medications.join(', ')}

Provide a brief, clear summary of any notable interactions or safety notes. If no significant interactions, say so.
Format: Keep it under 100 words and patient-friendly.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    return 'Drug interaction check unavailable.';
  }
};

module.exports = { classifyRecord, summarizeRecord, extractTags, generateHealthInsight, chatWithAssistant, checkDrugInteractions };
