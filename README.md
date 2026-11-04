# CraveSwap AI – Your Junk Food Twin 🍔➡️🥗

**CraveSwap AI** is a production-ready, full-stack AI nutrition assistant designed to solve junk food cravings. Rather than forcing generic diet meals, CraveSwap AI analyzes your exact craving via **Text, Voice Speech-to-Text, or Computer Vision Food Recognition** and generates a **Healthier Twin Recipe with 90%+ Taste & Texture Similarity**.

---

## 🌟 Key Features

### 1. Multi-Modal Craving Input & AI Recognition
- **Text Craving Input**: Fast search across popular fast foods.
- **Voice Input**: Web Speech API integration for instant hands-free speech input.
- **Computer Vision (YOLOv8 + OpenCV)**: Upload photos of junk food (pizza, fries, burgers, donuts) for real-time item detection and macro profiling.

### 2. "Your Junk Food Twin" Engine & Taste Profile
- **90%+ Taste Similarity**: Matches Sweetness, Savoriness (Umami), Crunchiness, Creaminess, and Spiciness vectors using interactive radar charts.
- **Ingredient-by-Ingredient Substitution Engine**: Swaps deep frying for air frying, refined flour for almond/cauliflower flour, and heavy cream for protein Greek yogurt.
- **Macro & Micronutrient Comparison**: Visual side-by-side Recharts comparison for Calories, Protein, Carbs, Fat, and Fiber.

### 3. "Why You Crave This" Root Cause Analyzer
- Psychological and physiological explanation of cravings (Cortisol/Stress, Fatigue, Boredom, Low Serotonin, Protein Deficit) with actionable behavior modification tips.

### 4. Interactive "Twin Mode" Split Slider
- Side-by-side visual image slider comparing craved junk food against its healthy twin.

### 5. Gamification & XP System
- Streak counters, Level progression (XP), unlocked achievement badges (First Swap, 5-Day Warrior, Calorie Crusher, Wallet Saver), and confetti celebration.

### 6. Analytics Dashboard & PDF Report Export
- Weekly macro savings, budget saved estimator, craving trigger distribution pie charts, and downloadable PDF summary reports via ReportLab.

### 7. AI Coach & Smart Reminders
- Machine Learning (Scikit-Learn/XGBoost) model forecasting peak craving hours and dispatching proactive reminders.
- Conversational AI Coach for custom nutrition Q&A.

### 8. Interactive Grocery List & Admin CRUD Panel
- Auto-populate ingredient checklists from recipes.
- Admin dashboard to manage food database benchmarks.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Canvas Confetti.
- **Backend**: Python, FastAPI, SQLAlchemy ORM, Pydantic v2, PyJWT, Passlib (Bcrypt), ReportLab.
- **AI / Computer Vision**: OpenAI API (configurable with smart offline fallback), OpenCV, YOLOv8 model pipeline.
- **Machine Learning**: Scikit-Learn / XGBoost Craving Pattern Predictor.
- **Database**: PostgreSQL / SQLite dynamic auto-fallback.
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD pipeline.

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/craveswap-ai.git
   cd craveswap-ai
   ```

2. Start the full stack with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Open your browser:
   - **Frontend UI**: `http://localhost:3000`
   - **FastAPI Swagger API Docs**: `http://localhost:8000/docs`

---

### Option 2: Local Development Setup

#### Backend Setup:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m app.db.init_db
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

---

## 🔑 Demo Account Credentials

- **Username**: `demo`
- **Password**: `password123`

---

## 🧪 Running Unit Tests

To run the backend Pytest test suite:
```bash
cd backend
pytest
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
