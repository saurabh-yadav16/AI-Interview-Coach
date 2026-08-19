# 🤖 AI Interview Coach — Smart AI-Powered Technical Mock Interview Platform

**AI Interview Coach** is a production-ready, full-stack MERN platform that helps software engineers prepare for technical interviews through personalized AI interview questions, real-time rubric scoring, ATS resume analysis, performance analytics, and custom 7-day improvement plans.

---

## 🏗️ System Architecture

AI Interview Coach is built on a high-performance architecture combining a responsive Vite + React frontend with a secure Express + Node.js REST API, an intelligent multi-metric AI Evaluation Engine, and a MongoDB persistence layer.

```text
+-------------------------------------------------------------+
|                       Vite + React.js                       |
|               (ClearRound Emerald SaaS UI)                  |
+------------------------------+------------------------------+
                               |
                               | REST API (JWT Bearer Token)
                               v
+─────────────────────────────────────────────────────────────+
|                         Express.js                          |
|                       (REST Router)                         |
+──────────────┬───────────────────────────────┬──────────────+
               │                               │
               v                               v
+─────────────────────────────+ +─────────────────────────────+
|     AI Evaluation Engine    | |    Resume Parser Service    |
| (5-Metric Rubric Evaluator) | |   (PDF/DOCX ATS Analyzer)   |
+──────────────┬──────────────+ +──────────────┬──────────────+
               │                               │
               └───────────────┬───────────────┘
                               │
                               v
                    +───────────────────+
                    |     Mongoose      |
                    |  (MongoDB Layer)  |
                    +───────────────────+
```

---

## ⚡ Data & AI Evaluation Flow

When a candidate submits an interview answer, the backend validates credentials and executes a 5-dimension rubric evaluation:

1. **Client Submission**: Candidate submits text/voice answer for a specific question.
2. **REST API Gateway**: Express verifies JWT authentication and validates session ownership.
3. **AI Evaluation Engine**: Evaluates answer across 5 weighted metrics:
   - **Correctness (30%)** — Core technical accuracy.
   - **Technical Depth (25%)** — Implementation details and edge cases.
   - **Completeness (20%)** — Addressing all parts of the question.
   - **Relevance (15%)** — Staying on-topic.
   - **Clarity (10%)** — Structure and communication.
4. **State Persistence**: Question score, detailed feedback, and ideal answer are saved in MongoDB, and live analytics radar charts are updated on the frontend.

---

## 🗄️ Database Schemas (Mongoose)

### 1. User
Stores candidate registration details, target role preferences, and extracted skills:
- `name` *(String, required)* — Candidate full name.
- `email` *(String, unique, lowercase)* — Account login identifier.
- `password` *(String, hashed via bcrypt, select: false)* — Secure password hash.
- `targetRole` *(String)* — Preferred track (e.g. `'Java Developer'`, `'Full Stack Engineer'`).
- `skills` *(Array of Strings)* — Extracted technical skills list.

### 2. Resume
Stores parsed ATS metrics and extracted resume content:
- `userId` *(ObjectId, ref to User)* — Candidate account reference.
- `fileName` *(String)* — Original PDF/DOCX file name.
- `filePath` *(String)* — File system storage path.
- `atsScore` *(Number)* — Multi-dimensional ATS match percentage (0–100%).
- `extractedText` *(String)* — Parsed raw text content.
- `skills` *(Array of Strings)* — Technical skills found.
- `strengths` *(Array of Strings)* — Parsed resume strengths.
- `weaknesses` *(Array of Strings)* — Identified keyword gaps.
- `suggestions` *(Array of Strings)* — Actionable ATS improvement tips.

### 3. Interview
Stores active and completed mock interview sessions:
- `userId` *(ObjectId, ref to User)* — Interview owner.
- `resumeId` *(ObjectId, ref to Resume)* — Associated resume analysis.
- `role` *(String)* — Target job role (e.g. `'React Frontend'`, `'Node.js Backend'`).
- `company` *(String)* — Target company style (e.g. `'Google'`, `'Amazon'`).
- `difficulty` *(String: `'Beginner'` | `'Medium'` | `'Advanced'`)* — Difficulty tier.
- `status` *(String: `'in_progress'` | `'completed'`)* — Session status.
- `questions` *(Array of Subdocuments)* — Generated questions, submitted user answers, category scores, feedback, and ideal answers.
- `finalScore` *(Number)* — Overall average session score (0–10).

---

## 🔒 Feature & Access Control Matrix

We enforce strict authentication and ownership validation gates across all platform modules:

| Platform Feature | Guest | Candidate | Admin |
|---|:---:|:---:|:---:|
| **Landing Page & Role Tracks** | ✅ | ✅ | ✅ |
| **Account Registration & Login** | ✅ | ✅ | ✅ |
| **Upload Resume & ATS Scoring** | ❌ | ✅ | ✅ |
| **Generate AI Mock Questions** | ❌ | ✅ | ✅ |
| **Submit Answer & AI Evaluation** | ❌ | ✅ | ✅ |
| **View Analytics & Radar Charts** | ❌ | ✅ | ✅ |
| **7-Day Personalized Improvement Plan** | ❌ | ✅ | ✅ |
| **24/7 AI Tutor Assistant** | ❌ | ✅ | ✅ |

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Node.js**: v18+ recommended (v24 supported)
- **npm**: v9+ recommended
- **MongoDB**: Local instance running, or MongoDB Atlas connection string

### 1. Environment Configuration
Create a `.env` file in the `backend` directory (reference `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_interview_coach
JWT_SECRET=yoursupersecurejwtsecretkey
OPENAI_API_KEY=sk-proj-your_openai_api_key
```

### 2. Dependency Installation
Install dependencies for both backend and frontend:
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Launch Development Servers
Start backend API and Vite frontend concurrently:
```bash
# Terminal 1: Start Backend Server
cd backend && node server.js

# Terminal 2: Start Frontend Application
cd frontend && npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🌐 Production Deployment Steps

### Part A: Database Provisioning (MongoDB Atlas)
1. Register a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create an **M0 Free Tier** database cluster.
3. Whitelist access IP address `0.0.0.0/0`.
4. Copy the connection URI (e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/ai_interview_coach`).

### Part B: Backend Hosting (Render or Railway)
1. Connect your GitHub repository to Render/Railway.
2. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=your_atlas_connection_string`
   - `JWT_SECRET=your_production_secret`
   - `OPENAI_API_KEY=your_llm_key`
3. Configure settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

### Part C: Frontend Hosting (Vercel or Netlify)
1. Import `frontend` directory in Vercel.
2. Configure settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`
