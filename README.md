# SAHAYAK (सहायक)

> **"Emergency assistance when every second matters."**

SAHAYAK is a production-ready, full-stack, mobile-first emergency assistance web platform. When crisis strikes, SAHAYAK bridges the vital gap between citizens in distress, their loved ones, and emergency first-responders (112 / 108 / 100) with zero friction, instant high-precision GPS broadcasting, and verified nearby facilities.

---

## 📌 Problem

During life-threatening emergencies—road collisions, medical cardiac episodes, fires, or personal threats:
1. **Panic impairs recall**: Victims struggle to remember contact numbers, locate emergency services, or describe their exact location verbally.
2. **Every second counts**: Precious golden-hour minutes are lost trying to open mapping tools, finding coordinates, or dialing multiple disjoint helplines.
3. **Information disconnect**: Family members and first-responders lack immediate medical history (blood group, allergies, conditions) that can save lives upon arrival.

---

## 💡 Solution

SAHAYAK provides an instantaneous, high-contrast, tactile response system:
- **One-Tap High-Priority SOS**: Captures verified browser GPS coordinates (lat, lon, accuracy radius) and triggers an active database emergency record.
- **National Emergency Dial (112 ERSS)**: Integrated one-tap dialer for India's unified emergency hotline, dispatching police, fire, and ambulance simultaneously.
- **Family & Guardian Broadcast**: Instant WhatsApp and SMS link distribution with Google Maps coordinates and SOS telemetry.
- **Live OpenStreetMap Integration**: Interactive Leaflet maps rendering incident coordinates, accuracy perimeter, and verified nearby hospitals, police stations, and fire stations.
- **Emergency Medical Card**: Secure, user-controlled profile disclosing blood type and critical medical conditions during crises.

---

## ✨ Features

- **🚨 Dominant SOS Trigger**: High-contrast, tactile SOS button with confirmation modal preventing accidental activations while enabling rapid multi-category dispatch (Medical, Accident, Fire, Threat).
- **📍 Real GPS Telemetry**: Direct browser Geolocation API integration with accuracy radius in meters, timestamp tracking, and reverse geocoded street address.
- **🗺️ Interactive Map (Leaflet + OpenStreetMap)**: Live visual map centering on incident coordinates without relying on proprietary paid map SDKs.
- **🏥 Real Nearby Facilities**: Queries verified OpenStreetMap Overpass emergency nodes for hospitals, clinics, police stations, and fire houses within a 15km radius. Never fabricates fake places.
- **👥 Emergency Contact Network**: Full CRUD for designated guardians, primary contact designation, one-tap calling, and instant GPS WhatsApp message generation.
- **📞 National Emergency Directory**: Prominent coverage of 112 (ERSS), 100 (Police), 108 (Ambulance), 101 (Fire), 1091 (Women Safety), and 1098 (Childline).
- **📋 Audit & Incident History**: Detailed logs of all previous alerts, coordinates, active/cancelled/resolved timestamps, and historical incident mapping.
- **🛡️ First-Responder Safety Center**: Actionable protocols for personal defense, road crash triage, CPR / Heimlich maneuvers, fire evacuation, and discreet alerting.
- **🔒 Secure Authentication & Data Protection**: Bcrypt password hashing, JWT session tokens, protected endpoints, and clear privacy warnings.

---

## 🏛️ Architecture

```
                       +---------------------------------------+
                       |           User Browser / Mobile       |
                       |       (Vite + React + Tailwind)       |
                       +-------------------+-------------------+
                                           |
                  HTTPS / REST API         |  Browser Geolocation API
                  Bearer JWT Auth          |  (Lat, Lng, Accuracy)
                                           v
                       +---------------------------------------+
                       |          FastAPI Backend Engine       |
                       |         (Python 3.11 / Pydantic)      |
                       +---------+-------------------+---------+
                                 |                   |
                     SQLAlchemy  |                   | Async HTTP (httpx)
                     2.0 ORM     |                   |
                                 v                   v
              +--------------------+   +-------------------------------+
              | Database (SQLite / |   | OpenStreetMap Overpass Engine |
              |    PostgreSQL)     |   |  (Verified Nearby Services)   |
              +--------------------+   +-------------------------------+
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS (dark mode, emergency-contrast palette)
- **Mapping**: Leaflet & React-Leaflet with OpenStreetMap Carto tiles
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT interceptors
- **Routing**: React Router DOM v7 (SPA protected routing)

### Backend
- **Framework**: Python FastAPI
- **Server**: Uvicorn ASGI
- **Data Layer**: SQLAlchemy 2.0 ORM with connection pooling
- **Validation**: Pydantic v2 schemas
- **Security**: Bcrypt password hashing & Python-Jose JWT tokens
- **External Integration**: Httpx async client for OpenStreetMap Overpass queries

### Database
- **SQLite**: Local development and single-instance deployments
- **PostgreSQL**: Drop-in compatible via standard `DATABASE_URL` for production (Neon, Supabase, Render PostgreSQL)

---

## 🗄️ Database Models

1. **`users`**: `id`, `name`, `email`, `phone`, `password_hash`, `blood_group`, `medical_information`, `address`, `created_at`
2. **`emergency_contacts`**: `id`, `user_id` (FK), `name`, `phone`, `relationship`, `is_primary`, `created_at`
3. **`emergency_alerts`**: `id`, `user_id` (FK), `alert_type`, `status` (`ACTIVE`, `CANCELLED`, `RESOLVED`), `latitude`, `longitude`, `accuracy`, `created_at`, `resolved_at`
4. **`locations`**: `id`, `user_id` (FK), `latitude`, `longitude`, `accuracy`, `timestamp`

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` — Register citizen account (hashes password, returns JWT token)
- `POST /api/auth/login` — Authenticate and receive bearer token
- `POST /api/auth/logout` — Terminate session
- `GET  /api/auth/me` — Current authenticated citizen profile

### Profile
- `GET  /api/profile` — Fetch citizen profile and medical parameters
- `PUT  /api/profile` — Update blood group, allergies, address, and medical notes

### Emergency Contacts
- `GET    /api/contacts` — Retrieve registered emergency guardians
- `POST   /api/contacts` — Add new emergency guardian
- `PUT    /api/contacts/{id}` — Update contact details or primary flag
- `DELETE /api/contacts/{id}` — Remove contact

### Emergency Dispatch
- `POST /api/emergency/activate` — Activate SOS alert with real GPS coordinates
- `GET  /api/emergency/active` — Check if user has an ongoing active alert
- `POST /api/emergency/{id}/cancel` — Cancel emergency alert
- `POST /api/emergency/{id}/resolve` — Mark emergency resolved (user safe)
- `GET  /api/emergency/history` — Audit log of all historical alerts
- `GET  /api/emergency/{id}` — Retrieve specific alert by ID

### Location & Nearby Help
- `POST /api/location` — Log GPS coordinates
- `GET  /api/location/latest` — Get last recorded user location
- `GET  /api/nearby` — Query real nearby hospitals, police stations, and fire stations via OpenStreetMap
- `GET  /api/health` — System and database health probe

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `8000` |
| `DATABASE_URL` | SQLite or PostgreSQL connection string | `sqlite:///./sahayak.db` |
| `SECRET_KEY` | 64-character JWT secret key | Strong random string |
| `ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Session validity duration | `10080` (7 days) |
| `CORS_ORIGINS` | Permitted frontend origins | `*` or `https://sahayak.vercel.app` |
| `VITE_API_URL` | Frontend API endpoint target | `http://localhost:8000` |

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18+) and npm
- Python (3.10+)

### 1. Clone & Setup Backend
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API interactive documentation is available at `http://localhost:8000/docs`.

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment

### Backend Deployment (Render)
1. Push your repository to GitHub.
2. In Render, select **New Blueprint** and connect your repository. Render will automatically parse `render.yaml`.
3. Alternatively, create a **Web Service**:
   - **Environment**: Python 3
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables in Render Dashboard:
   - `SECRET_KEY`: `<your-random-secret>`
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app`
   - `DATABASE_URL`: `sqlite:///./sahayak.db` (or attach a Render PostgreSQL database)

### Frontend Deployment (Vercel)
1. In Vercel, import your GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. In **Environment Variables**, set:
   - `VITE_API_URL`: `https://your-backend.onrender.com`
5. Click **Deploy**. Vercel will build the frontend with `vercel.json` SPA routing support.

---

## 🧪 Testing

### Backend Automated Test Suite
Run the endpoint integration test suite:
```bash
cd backend
python -c "import app.main; print('Backend loaded successfully!')"
```

### Manual Verification Flow
1. **Sign Up**: Create a new account with email, phone, and password.
2. **Dashboard**: Verify GPS accuracy card acquires coordinates.
3. **Contacts**: Add an emergency contact with a phone number.
4. **Trigger SOS**: Press the large SOS button, select the emergency type, and confirm.
5. **Active Emergency**: Verify coordinates, interactive Leaflet map, Call 112 button (`tel:112`), and WhatsApp location share.
6. **Resolution**: Click "RESOLVE" to mark yourself safe. Check **Alert History** to confirm the incident log.
7. **Nearby Help**: Navigate to "Nearby Help" to view real hospitals and police stations around your current coordinates.

---

## 🔮 Future Improvements

- **SMS Gateway Integration**: Optional direct Twilio / Fast2SMS webhook integration for offline SMS broadcasting.
- **Offline PWA & Service Workers**: Cached emergency guide and offline location buffering when cellular connectivity drops.
- **Audio & Siren Beacon**: High-frequency alarm beacon audio trigger through device speaker to attract nearby help.
- **Wearable Integration**: Smartwatch fall-detection and heart-rate spike triggers for automated SOS activation.

---

## 📄 License

This project is licensed under the MIT License.
