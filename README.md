# 🏥 HealthVault – AI-Powered Digital Health Record Locker
HealthVault is a secure, full-stack digital health record locker built to allow patients to store, organize, and share their medical history dynamically. It uses advanced Google Gemini AI to automatically classify records, generate medical summaries in plain language, and even provide a medical chatbot assistant.
---
## ✨ Key Features
- **🔐 Secure Authentication:** JWT-based user login and registration system.
- **📁 Medical Record Uploads:** Securely upload prescriptions, reports, and X-rays to Cloudinary.
- **🤖 Automatic AI Processing (Gemini 2.5 Flash):**
  - **Auto-Classification:** Intelligent detection of document/image types (e.g., Blood Test, Prescription).
  - **Auto-Summarization:** Restructures complex medical jargon into simple, patient-friendly summaries.
  - **Smart Tagging:** Automatically extracts medical keywords for easy searching.
- **💬 AI Health Assistant Chatbot:** A ubiquitous floating bubble that can answer health queries contextually based on the user's stored records.
- **🔗 Doctor Share Portal:** Generate secure, time-limited QR codes and shareable links for temporary read-only doctor access.
- **📋 Emergency Profile:** Instantly accessible profile holding blood group, critical allergies, ongoing meds, and emergency contacts.
- **📈 Health Insights & Timeline:** Dashboard featuring summarized AI health insights and chronological health timelines.
- **🎨 Modern UI/UX:** Responsive, fully animated glassmorphism design powered by Tailwind CSS & Framer Motion.
---
## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **File Storage:** Cloudinary (multer-storage-cloudinary)
- **AI Engine:** Google Generative AI (Gemini 2.5 Flash SDK)
---
## 🚀 Getting Started
### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- [Cloudinary Account](https://cloudinary.com/)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)
### 2. Clone and Install
Clone the repository and install dependencies for both sides:
```bash
# Install Server dependencies
cd server
npm install
# Install Client dependencies
cd ../client
npm install
```
### 3. Environment Configuration
Create a `.env` file inside the `server/` directory and configure the following:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_super_secret_jwt_key
# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Google Gemini setup (Requires a working key capable of accessing 2.5-flash)
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```
### 4. Run the Application
You'll need two terminal tabs.
**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
Finally, open your browser and navigate to **`http://localhost:5173`**.
---
## 📸 Core Highlights
1. **Upload Experience:** Just drag and drop an image or PDF. The server pipes it to Cloudinary utilizing `resource_type: auto` mapping, and immediately fires a background Gemini thread to append intelligent metadata before saving to MongoDB.
2. **Security:** JWT is transmitted via HTTP headers (`Bearer`). File access isn't hindered by restrictive raw ACLs because Cloudinary serves them out of image/auto pipelines. Doctor links explicitly check for expiry bounds.
3. **Resilience:** The backend wraps Gemini in fault-tolerant logic and safely cascades back to standard strings if AI quotas hit blocks or errors.
## 🤝 Contribution
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
