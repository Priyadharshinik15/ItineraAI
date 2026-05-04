# ✈️ ItineraAI — AI Travel Planner

ItineraAI is an AI-powered travel planner that eliminates hours of manual trip research. Instead of browsing multiple websites for hotels, attractions, visa rules, and itineraries, it generates a complete, personalized travel plan in minutes.

It uses Groq’s LLaMA 3 along with three intelligent agents—Location Expert, City Guide, and Travel Planner—powered by the DuckDuckGo Search Tool to fetch real-time web data. This ensures accurate and up-to-date recommendations for hotels, attractions, and travel insights.

The platform generates day-by-day itineraries, budget breakdowns, and travel suggestions in 20+ languages, making it ideal for users who want a ready-to-use, personalized travel plan without relying on expensive travel agents.

---

##  Project Structure

```
itineraai/
├── frontend/                   # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Hero + About + How to Use
│   │   │   ├── LoginPage.jsx        # Login form
│   │   │   ├── RegisterPage.jsx     # Register form
│   │   │   ├── InputPage.jsx        # Trip details form
│   │   │   └── ReportPage.jsx       # 3 report tabs + download
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Persistent navbar
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Login/logout state
│   │   ├── hooks/
│   │   │   └── useTravel.js
│   │   └── utils/
│   │       └── api.js               # FastAPI calls
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                    # FastAPI + Groq + SQLite
│   ├── main.py                      # FastAPI app entry
│   ├── routers/
│   │   ├── auth.py                  # Login / Register
│   │   └── travel.py                # AI plan generation
│   ├── services/
│   │   ├── ai_service.py            # Groq / LLaMA calls
│   │   ├── image_service.py         # Unsplash / Pexels
│   │   └── pdf_service.py           # ReportLab PDF
│   ├── models.py                    # SQLite models
│   ├── database.py
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

##  Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/yourname/itineraai.git
cd itineraai
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env → add your GROQ_API_KEY
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Run Both Servers

```bash
# Terminal 1 — Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open → **http://localhost:5173**

---

##  API Keys Needed

| Service | Key | Free? | Link |
|---------|-----|-------|------|
| Groq | `GROQ_API_KEY` |  Free | [console.groq.com](https://console.groq.com) |
| Unsplash | `UNSPLASH_ACCESS_KEY` |  Free | [unsplash.com/developers](https://unsplash.com/developers) |
| Pexels | `PEXELS_API_KEY` |  Free | [pexels.com/api](https://www.pexels.com/api/) |

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| AI | Groq API (LLaMA 3.3-70b) |
| Backend | FastAPI, Python 3.10+ |
| Images | Unsplash API, Pexels API |
| Database | SQLite (via SQLAlchemy) |
| PDF | ReportLab |
| Auth | JWT tokens |

---

## 🦙 Using Ollama (Offline Alternative)

If you don't want to use Groq, you can run **Ollama locally**:

```bash
# Install Ollama
https://ollama.com/download

# Pull model
ollama pull llama3.2

# In backend/.env change:
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Then in `backend/services/ai_service.py`, the provider switch handles this automatically.

---

## 📱 Android APK (Capacitor)

```bash
cd frontend
npm run build
npx cap add android
npx cap sync
npx cap open android
# Build APK in Android Studio
Appflow_dashboard:https://dashboard.ionicframework.com/app/cef1d99e/getting-started
```

---

##  Features

-  20+-language travel plans
-  Budget / Mid / Luxury hotel recommendations
-  Real city & place images (Unsplash/Pexels)
-  Day-wise personalized itinerary
-  Budget analysis (Low / Medium / High)
-  Downloadable PDF report
-  Login / Register with JWT
-  Profile settings page
  
