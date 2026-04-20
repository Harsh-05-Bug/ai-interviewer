# AI Interviewer — Full Stack Mock Interview Platform

> **Single zip. One project. Everything included.**

React frontend + Node.js/Express backend + MongoDB — all in one folder.

---

## Project Structure

```
ai-interviewer/
├── server.js              ← Express server + all API routes + MongoDB
├── package.json           ← Backend dependencies + scripts
├── .env.example           ← Environment variable template
└── client/                ← React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx    ← Home page
    │   │   ├── Setup.jsx      ← 3-step interview configurator + resume upload
    │   │   ├── Interview.jsx  ← AI chat simulator
    │   │   ├── Report.jsx     ← Score report with ring chart
    │   │   └── History.jsx    ← All past sessions from MongoDB
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/index.html
    ├── package.json       ← Frontend dependencies
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## Quick Start

### Step 1 — Install everything

```bash
# Install backend dependencies
npm install

# Install frontend dependencies  
cd client && npm install && cd ..
```

### Step 2 — Set up environment

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here       # from console.anthropic.com
MONGODB_URI=mongodb://localhost:27017/ai-interviewer  # or MongoDB Atlas URI
PORT=5000
NODE_ENV=development
```

### Step 3 — Start MongoDB

**Option A — Local MongoDB:**
```bash
mongod
```

**Option B — MongoDB Atlas (cloud, free tier):**
1. Go to mongodb.com/atlas → create free cluster
2. Get your connection string
3. Paste it as `MONGODB_URI` in `.env`

### Step 4 — Run everything

```bash
# Run BOTH backend + frontend together
npm run dev:full

# OR run separately:
npm run dev        # backend on port 5000
npm run client     # frontend on port 3000
```

Open: **http://localhost:3000**

---

## API Endpoints (all in server.js)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Server health check |
| POST | `/api/interview/start` | Start new interview, creates MongoDB session |
| POST | `/api/interview/message` | Send answer, get next question |
| GET | `/api/interview/session/:id` | Get session by ID |
| GET | `/api/interview/history` | All completed sessions |
| GET | `/api/interview/stats` | Aggregate stats |
| DELETE | `/api/interview/session/:id` | Delete a session |
| POST | `/api/interview/upload-resume` | Upload resume file |

---

## Features

- **Landing Page** — Hero, features, how-it-works, stats
- **Setup Wizard** — 3 steps: role/exp → interview config → resume upload
- **AI Interview** — Live chat with Claude (DSA, Technical, System Design, Behavioral)
- **Score Report** — Animated ring chart, verdict, strengths/weaknesses, ideal answers
- **History Page** — All past sessions pulled from MongoDB with stats dashboard

---

## Production Deployment

### Build frontend for production:
```bash
npm run build
```
This builds React into `client/build/`. The Express server automatically serves it.

### Deploy to Railway / Render:
1. Push to GitHub
2. Connect repo → set environment variables
3. Start command: `npm start`

### Environment variables for production:
```env
ANTHROPIC_API_KEY=sk-ant-...
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-interviewer
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| AI | Anthropic Claude (claude-sonnet-4) |
| Security | Helmet, CORS, Rate Limiting |
| Dev | Nodemon, Concurrently |
