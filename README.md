# Campus Skill Exchange

A peer-to-peer knowledge sharing and barter learning platform designed for university campuses. Students list skills they can teach and skills they want to learn, connect through reciprocal matching, coordinate sessions, and earn platform reputation through verified peer reviews.

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS
- **Backend**: Node.js & Express (`server/`)
- **Database**: Local JSON File Database (`server/data/db.json`) with zero external DB software required
- **Cloud Option**: Compatible with Firebase Auth & Cloud Firestore if configured in `.env`

---

## Project Structure

```
versathon/
├── server/
│   ├── index.js          # Express app entry point (port 5000)
│   ├── db.js             # JSON database manager (reads/writes server/data/db.json)
│   ├── data/
│   │   └── db.json       # Local database file storing students, requests, sessions, reviews
│   └── routes/
│       ├── auth.js       # /api/auth (signup, login, demo)
│       ├── students.js   # /api/students (listing, search, filters, profile edit)
│       ├── requests.js   # /api/requests (propose, accept, decline)
│       ├── messages.js   # /api/messages (real-time chat)
│       ├── sessions.js   # /api/sessions (scheduling, status, +20/+10 points)
│       ├── reviews.js    # /api/reviews (1-5 stars, feedback, +5 points)
│       ├── notifications.js # /api/notifications (alerts, unread count)
│       └── admin.js      # /api/admin (KPIs, moderation, reset)
├── src/
│   ├── components/       # Reusable UI components (Navbar, Cards, Tags, Icons)
│   ├── context/          # Auth & Session state provider
│   ├── data/             # Campus initial data & taxonomies
│   ├── pages/            # 14 core views (Dashboard, Discover, Chat, Admin, etc.)
│   ├── utils/            # Matching algorithm & Unified Data Service
│   └── firebase.js       # Optional Firebase client initialization
├── vite.config.js        # Vite config with /api proxy to Node.js backend (port 5000)
├── package.json          # Dependencies and scripts
└── firestore.rules       # Security rules for optional Firestore deployment
```

---

## Getting Started

### 1. Installation
In your project directory, install all frontend and backend dependencies:
```bash
npm install
```

---

### 2. Running the Application

You have two convenient options:

#### Option A: Run Both Frontend and Backend Together (Recommended)
```bash
npm run dev:all
```
This runs the **Node.js Express backend** on `http://localhost:5000` and the **React Vite frontend** on `http://localhost:5173` simultaneously.

#### Option B: Run in Separate Terminals
- **Terminal 1 (Backend Server):**
  ```bash
  npm run server
  ```
- **Terminal 2 (Frontend Dev Server):**
  ```bash
  npm run dev
  ```

---

### 3. Open in Your Browser
Visit:
👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## Backend API Endpoints (Node.js & Express)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server status and health check |
| `POST` | `/api/auth/signup` | Create new student account |
| `POST` | `/api/auth/login` | Login with email and password |
| `POST` | `/api/auth/demo` | 1-click test login as Rahul Sharma |
| `GET` | `/api/students` | List students with search and filter queries |
| `GET` | `/api/students/:id` | Get student profile details |
| `PUT` | `/api/students/:id` | Update profile, bio, skills, and availability |
| `GET` | `/api/requests?userId=...` | Get received and sent skill exchange proposals |
| `POST` | `/api/requests` | Propose an exchange request |
| `PATCH`| `/api/requests/:id` | Accept or decline request |
| `GET` | `/api/messages/:chatId` | Get conversation history |
| `POST` | `/api/messages` | Send chat message |
| `GET` | `/api/sessions?userId=...` | Get learning sessions |
| `POST` | `/api/sessions` | Schedule new learning session |
| `PATCH`| `/api/sessions/:id` | Mark session Completed (+20/+10 points) or Cancelled |
| `GET` | `/api/reviews/:teacherId` | Get student reviews |
| `POST` | `/api/reviews` | Submit star rating and written review (+5 points) |
| `GET` | `/api/notifications?userId=...` | Get notification alerts |
| `PATCH`| `/api/notifications/:id/read` | Mark notification as read |
| `GET` | `/api/admin/stats` | Campus analytics and KPI stats |
| `POST` | `/api/admin/reset` | Reset database to initial sample students |
