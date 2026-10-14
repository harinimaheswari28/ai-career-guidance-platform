# AI Career Guidance Website

A modern, responsive, and fully functional **AI Career Guidance Platform** designed for Computer Science and Engineering college projects. Built with a **React (Vite)** frontend, **Python Flask** REST API backend, and a normalized **MySQL** database schema.

---

## 🌟 Key Features

1. **Rule-Based Python Recommendation Engine**:
   - Transparent, deterministic multi-factor algorithm calculating a **0–100% compatibility score**.
   - Evaluates 8 assessment dimensions, student skills portfolio, interests, and educational level.
   - Generates natural-language rationales, matching skills, and missing competencies.
   - Zero hallucinated or black-box AI API calls.

2. **Skills Assessment Module**:
   - Interactive 8-domain questionnaire (Technical, Logical, Communication, Problem Solving, Creativity, Work Preferences, Work Environment, Education).
   - Question counter, selectable options, step-by-step progress, review mode, and instant scoring.
   - Strengths and growth area identification with retake history.

3. **12+ Computer Science Career Pathways**:
   - *Full Stack Developer, Frontend Developer, Backend Developer, Data Analyst, Data Scientist, AI/ML Engineer, Cybersecurity Analyst, Cloud Engineer, DevOps Engineer, UI/UX Designer, Mobile App Developer, Software Tester / QA Engineer*.
   - In-depth descriptions, difficulty levels, growth outlooks, and prerequisites.

4. **Personalized Learning Roadmaps**:
   - 5 to 7 structured stages for every career with study topics, practical exercises, mini-projects, and a portfolio capstone.
   - Interactive checklist with real-time completion percentages saved in the database.

5. **Verified Course Recommendations**:
   - Genuine, verified links from Harvard edX, MIT OpenCourseWare, freeCodeCamp, Meta, Google, and Coursera.
   - Filters for difficulty, duration, and free vs paid courses with bookmarking.

6. **Side-by-Side Career Comparison**:
   - Compare up to 3 careers simultaneously across skills, difficulty, roadmap stages, and personalized skill gaps.

7. **Student Dashboard & Progress Tracker**:
   - Profile completion meter, readiness percentage, Recharts weekly learning graph, upcoming learning goals checklist, and milestone badges.

8. **Role-Based Admin Dashboard**:
   - Secure management for registered users, careers, assessment questions, and verified courses.

---

## 🏗️ Project Folder Structure

```
career-guidance-platform/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Flask Application Factory & JWT setup
│   │   ├── models/               # SQLAlchemy Relational Models
│   │   │   ├── user.py           # User & UserProfile
│   │   │   ├── career.py         # Career, Skill, Recommendations, Comparisons
│   │   │   ├── assessment.py     # Questions, Options, Attempts, Answers
│   │   │   ├── course.py         # Courses & Bookmarks
│   │   │   ├── roadmap.py        # Roadmaps, Steps & Progress
│   │   │   └── activity.py       # Goals & Notifications
│   │   ├── routes/               # REST API Endpoints
│   │   │   ├── auth_routes.py    # Register, Login, Me, Password Reset
│   │   │   ├── career_routes.py  # Careers, Recommendations, Comparisons
│   │   │   ├── assessment_routes.py # Assessment flow & history
│   │   │   ├── course_routes.py  # Courses & bookmarks
│   │   │   ├── roadmap_routes.py # Roadmaps & progress toggling
│   │   │   ├── dashboard_routes.py # Dashboard & milestone stats
│   │   │   ├── profile_routes.py # Profile & skills CRUD
│   │   │   ├── admin_routes.py   # Admin management
│   │   │   └── notification_routes.py # Goals & notifications
│   │   ├── services/
│   │   │   ├── recommendation_engine.py # Rule-based matching engine
│   │   │   └── scoring_service.py       # Assessment scoring & triggers
│   │   └── utils/
│   │       ├── auth_helpers.py   # Admin decorators & JWT helpers
│   │       └── validators.py     # Input sanitation & validation
│   ├── tests/
│   │   ├── test_auth_api.py      # Auth & password security tests
│   │   ├── test_recommendation.py # Recommendation algorithm tests
│   │   └── test_assessment.py    # Assessment & admin security tests
│   ├── config.py                 # Configuration (MySQL + SQLite fallback)
│   ├── run.py                    # Server runner & CLI commands
│   ├── requirements.txt          # Python dependencies
│   └── venv/                     # Python Virtual Environment
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Sidebar, ThemeToggle, etc.
│   │   ├── context/              # Auth, Theme, and Toast Notification Contexts
│   │   ├── layouts/              # MainLayout and DashboardLayout
│   │   ├── pages/                # Home, About, ExploreCareers, CareerDetail,
│   │   │                         # Login, Register, Dashboard, Assessment,
│   │   │                         # Courses, Compare, Profile, Progress, Admin
│   │   ├── services/             # Axios API client with JWT interceptor
│   │   ├── App.jsx               # Router & application providers
│   │   ├── index.css             # Light/Dark design system tokens
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql                # Complete MySQL DDL relational schema
│   └── seed.py                   # Complete seed script for all 12 careers
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Execution Guide (Windows 11)

### Prerequisites
- **Node.js**: v18.0 or newer
- **Python**: v3.11 or newer
- **MySQL Server** (Optional for local development; SQLite zero-config fallback is automatically included).

---

### Step 1: Database Setup (MySQL)

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or Command Line):
   ```sql
   CREATE DATABASE ai_career_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. (Optional) Run `database/schema.sql` to inspect or pre-create the normalized tables, or allow Flask to create them automatically.

---

### Step 2: Backend Setup (Python Flask)

1. Open a terminal in the project root directory:
   ```powershell
   # Create a virtual environment
   python -m venv backend/venv

   # Activate the virtual environment
   .\backend\venv\Scripts\Activate.ps1
   # (Or in Command Prompt: backend\venv\Scripts\activate.bat)
   ```

2. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Configure Environment Variables:
   - Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   FLASK_ENV=development
   SECRET_KEY=dev-secret-key-career-guide-2026
   PORT=5000
   # For MySQL:
   DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/ai_career_db
   # Note: If DATABASE_URL is omitted, it defaults to SQLite (ai_career.db) for instant evaluation!
   JWT_SECRET_KEY=jwt-super-secret-key-2026
   FRONTEND_URL=http://localhost:5173
   ```

4. Seed the Database:
   ```bash
   python database/seed.py
   ```
   *This initializes the 12 tech careers, skills catalog, roadmaps, verified courses, assessment questions, default admin account, and demo student.*

5. Run Automated Tests:
   ```bash
   pytest backend/tests
   ```
   *Verifies 100% test pass rate on auth, security, assessment, and recommendation engine.*

6. Start the Flask Server:
   ```bash
   python backend/run.py
   ```
   *The backend REST API is now live on `http://127.0.0.1:5000` (Health check: `http://127.0.0.1:5000/api/health`).*

---

### Step 3: Frontend Setup (React + Vite)

1. Open a new terminal in the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```

2. Start the React development server:
   ```bash
   npm run dev
   ```
   *The frontend client is now live on `http://localhost:5173`.*

---

## 🔑 Default Evaluation Accounts

| Role | Email | Password |
|---|---|---|
| **Demo Student** | `student@example.com` | `StudentPass@2026` |
| **System Administrator** | `admin@aicareer.edu` | `AdminPass@2026` |

*(Quick-fill buttons are also available on the Login screen for 1-click evaluation).*

---

## 🧪 Automated Testing Results

Run the automated backend test suite:
```bash
backend\venv\Scripts\pytest backend\tests
```
- `test_auth_api.py`: Validates user registration, password hashing (PBKDF2), login tokens, and unauthorized rejections.
- `test_recommendation.py`: Validates multi-factor scoring (0–100%), skill gap calculation, and ranking accuracy.
- `test_assessment.py`: Validates assessment question delivery, response scoring, and role-based access restrictions.

---

## 🛡️ Security Implementation Highlights

- **Password Hashing**: PBKDF2 with SHA-256 via Werkzeug Security. Plaintext passwords are never persisted.
- **JWT Protection**: Tokens issued with 24-hour expiration; verified on protected routes.
- **SQL Injection Prevention**: SQLAlchemy parameterized statements across all queries.
- **CORS Protection**: Restricted to configured frontend origins.
- **Admin Verification**: Backend decorator (`@admin_required`) validates database user roles on every privileged endpoint.

---

## 📜 Academic Project Notice
This application is created for a Computer Science Engineering project. Career compatibility scores and assessment evaluations are educational estimates designed to guide skill acquisition and study planning.
