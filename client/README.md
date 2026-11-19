# HealthVault Frontend

The modern React 19 single-page application for the **HealthVault** Personal Health Record platform.

## 🛠️ Tech Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React Router DOM v7**
- **Axios** (API communication with request/response interceptors)
- **Lucide React** (Icons)
- **Framer Motion** (Animations & Transitions)
- **Recharts** (Health analytics & category breakdown charts)
- **React Dropzone** (Drag-and-drop document & report upload)
- **QRCode.react** (Generating QR codes for doctor sharing)
- **React Hot Toast** (User notifications)

## 📁 Application Structure

```
client/src/
├── assets/          # Static images & icons
├── components/      # Reusable UI components
│   ├── ChatBot.jsx      # Gemini AI conversational assistant
│   ├── Navbar.jsx       # Global responsive navigation
│   ├── RecordCard.jsx   # Medical record card preview
│   └── ShareModal.jsx   # QR code & share link generator
├── context/
│   └── AuthContext.jsx  # Authentication state & session provider
├── pages/
│   ├── AuthPage.jsx     # Login & registration
│   ├── Dashboard.jsx    # Health overview & quick actions
│   ├── DoctorView.jsx   # Public view for doctors accessing via QR / token
│   ├── EmergencyPage.jsx# Emergency medical info & contacts
│   ├── LandingPage.jsx  # Marketing & feature showcase
│   ├── RecordDetail.jsx # Detailed view with AI summary & tags
│   ├── RecordsPage.jsx  # Filterable & searchable records repository
│   ├── TimelinePage.jsx # Chronological health history
│   └── UploadPage.jsx   # Medical document dropzone & AI auto-classification
├── services/
│   └── api.js          # Axios client with JWT bearer interceptor
├── App.jsx             # Route definitions & layout
└── main.jsx            # React root mount
```

## 🚀 Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The app will run at `http://localhost:5173`.
   API requests to `/api/*` are automatically proxied to `http://localhost:5000` via [vite.config.js](file:///E:/HealthVault/client/vite.config.js).

3. Build for production:
   ```bash
   npm run build
   ```
