# Campus Skill Exchange — Beginner Step-by-Step Guide

Welcome to **Campus Skill Exchange** — a modern peer-to-peer learning platform built specifically for college students!

Students can list skills they can teach and skills they want to learn. The platform identifies reciprocal matches (e.g. Student A teaches Python & wants UI/UX; Student B teaches UI/UX & wants Python) and allows students to connect, chat, schedule learning sessions, earn badges, and leave ratings.

---

## 📋 What is Included in this Project

All **14 pages** and core features requested have been completely built and tested:

1. **Landing Page (`/`)**: Modern hero section ("Learn a Skill. Share a Skill."), visual skill exchange flow (`I CAN TEACH → SKILL MATCH → I WANT TO LEARN`), 5-step process, and category browsing.
2. **Sign Up (`/signup`)**: Student registration with name, campus email, password, college, department, and year. Includes 1-click demo login option.
3. **Login (`/login`)**: Secure email/password authentication or 1-click test login.
4. **Dashboard (`/dashboard`)**: Personalized welcome, statistics counters, skills lists, upcoming session reminders, and "Recommended Skill Matches".
5. **Profile Setup & Edit (`/profile` & `/profile-setup`)**: Bio, skill chips with suggestions, level (Beginner/Intermediate/Advanced), availability, and learning mode (Online/Offline/Both).
6. **Discover Students (`/discover`)**: Search by skill, category pills, department, year, level, and mode with "Great Match!" highlights.
7. **Student Profile (`/student/:id`)**: Full profile view with teaching/learning tags, ratings, badges, reviews, exchange request form, and safety reporting.
8. **Skill Exchange Requests (`/requests`)**: Sent and received tabs, accept/decline actions, and direct links to chat and session scheduling upon acceptance.
9. **Chat (`/chat`)**: Real-time messaging between students whose requests are accepted.
10. **Learning Sessions (`/sessions`)**: Arrange 1-on-1 sessions with date, time, mode, and location/meeting details. Marking a session completed awards **+20 points** (teacher) and **+10 points** (learner).
11. **Notifications (`/notifications`)**: Alerts for new requests, accepted requests, session reminders, and reviews with an unread badge indicator.
12. **Reviews & Ratings (`/reviews`)**: 1–5 star ratings with written feedback. Awards **+5 points** to the teacher.
13. **Settings & Safety (`/settings`)**: Privacy controls (hide phone/email), campus-only visibility, and blocked user management.
14. **Admin Dashboard (`/admin`)**: Staff portal displaying total students, active exchanges, pending reports, student directory moderation, category manager, and 1-click sample data reload.

---

## STEP 1: What Software You Need to Install

You only need **three free tools** on your computer:

1. **Node.js** (version 18 or 20 LTS): Lets your computer run JavaScript and comes with `npm`, the package installer.
2. **A Code Editor**: [VS Code (Visual Studio Code)](https://code.visualstudio.com/) — free and easy to use.
3. **A Modern Web Browser**: Google Chrome, Microsoft Edge, or Firefox.

> ℹ️ *Note: You do NOT need to install Firebase software on your machine. Firebase runs in the cloud and the code library is already included in this project.*

---

## STEP 2: How to Install Node.js

1. Open your web browser and navigate to **https://nodejs.org**.
2. Click on the button that says **LTS (Recommended for Most Users)** to download the installer for Windows/Mac.
3. Once downloaded, double-click the installer file:
   - Click **Next** through all the screens.
   - Accept the license agreement.
   - Keep the default installation directory and click **Install**.
4. To verify Node.js is ready:
   - **Windows:** Press `Win + R`, type `cmd`, and press **Enter**.
   - **Mac:** Press `Cmd + Space`, type `Terminal`, and press **Enter**.
5. In the black terminal window, type:
   ```bash
   node -v
   ```
   *Expected result:* A version number such as `v20.18.0`.
6. Now type:
   ```bash
   npm -v
   ```
   *Expected result:* An npm version number such as `10.8.2`.

---

## STEP 3: How to Create / Open the React Project

If you already have this folder (`versathon`):

1. Open **VS Code**.
2. Click **File → Open Folder...** from the top menu.
3. Select this folder (`e:\versathon`).
4. In VS Code, open the built-in terminal by pressing **Ctrl + `** (backtick) or going to **Terminal → New Terminal**.
5. Run this command to install all project libraries:
   ```bash
   npm install
   ```
   *What this does:* Reads `package.json` and downloads React, Firebase, Tailwind CSS, and Vite into the `node_modules` folder.
   *Expected result:* You will see `added 217 packages` and the command will finish without errors.

---

## STEP 4: Project File & Folder Structure

Here is how the project files are organized:

```
campus-skill-exchange/
├── index.html               # Main HTML entry page
├── package.json             # Dependencies (React, Firebase, Tailwind)
├── tailwind.config.js       # Design system (colors: ink, coral, sand, sun, mist)
├── firestore.rules          # Security rules for Firebase Firestore
├── .env.example             # Template for your Firebase credentials
├── src/
│   ├── main.jsx             # React root mount
│   ├── App.jsx              # Routing for all 14 pages
│   ├── index.css            # Tailwind & global font styling
│   ├── firebase.js          # Firebase configuration & safety fallback
│   ├── data/
│   │   └── sampleStudents.js # Realistic campus profiles (Aarav, Riya, Rohan...)
│   ├── context/
│   │   └── AuthContext.jsx  # Handles user session & dual demo/live mode
│   ├── utils/
│   │   ├── matching.js      # Smart reciprocal matching logic
│   │   └── dataService.js   # Unified data handler (Firestore + Demo storage)
│   ├── components/
│   │   ├── Navbar.jsx       # Responsive header with notification badge
│   │   ├── StudentCard.jsx  # Student card with match highlights & ratings
│   │   ├── RequestCard.jsx  # Request card with chat & schedule buttons
│   │   ├── SkillTag.jsx     # Visual chips for teaching/learning skills
│   │   ├── Icons.jsx        # Lightweight SVG icon collection
│   │   └── ProtectedRoute.jsx # Redirects unauthenticated users
│   └── pages/
│       ├── Landing.jsx      # Page 1: Hero & visual matching explanation
│       ├── Signup.jsx       # Page 2: Student registration & demo login
│       ├── Login.jsx        # Page 3: Student login
│       ├── Dashboard.jsx    # Page 4: User dashboard & recommended matches
│       ├── ProfileSetup.jsx # Page 5: Create/edit skills & availability
│       ├── Discover.jsx     # Page 6: Student search & multi-filter
│       ├── StudentProfile.jsx # Page 7: Profile, reviews & request form
│       ├── Requests.jsx     # Page 8: Received & sent exchange requests
│       ├── Chat.jsx         # Page 9: Real-time peer messaging
│       ├── Sessions.jsx     # Page 10: Learning session scheduler (+20/+10 pts)
│       ├── Notifications.jsx# Page 11: Notification center with unread counter
│       ├── Reviews.jsx      # Page 12: 5-star ratings & peer feedback (+5 pts)
│       ├── Settings.jsx     # Page 13: Privacy, moderation & safety
│       └── Admin.jsx        # Page 14: Campus staff administration portal
```

---

## STEP 5: Where to Paste Code (Already Completed!)

All 14 pages, components, and utilities are already written and assembled in this workspace.
- To modify or add a **Page**: look in `src/pages/` and check `src/App.jsx`.
- To modify a **Reusable Element**: look in `src/components/`.
- To adjust **Matching Logic**: check `src/utils/matching.js`.
- To edit **Sample Students**: check `src/data/sampleStudents.js`.

---

## STEP 6: How to Create a Firebase Project

1. Go to **https://console.firebase.google.com** in your browser.
2. Sign in with your Google account.
3. Click **Add project** (or **Create a project**).
4. Enter your project name: `campus-skill-exchange`.
5. Click **Continue**.
6. When asked about Google Analytics, you can toggle it **Off** (to keep things simple) and click **Create Project**.
7. Wait 30 seconds for Firebase to prepare your project, then click **Continue**.

---

## STEP 7: How to Connect Firebase to the React Project

1. In your Firebase Console project overview, click the **Web icon (`</>`)** to add a web app.
2. Enter an App nickname: `campus-web`. Click **Register app**.
3. Firebase will show a snippet with your keys:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "campus-skill-exchange.firebaseapp.com",
     projectId: "campus-skill-exchange",
     storageBucket: "campus-skill-exchange.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
4. In VS Code, in the project root folder, create a new file named `.env` (copy from `.env.example`).
5. Paste your keys into `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=campus-skill-exchange.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=campus-skill-exchange
   VITE_FIREBASE_STORAGE_BUCKET=campus-skill-exchange.appspot.com
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```
6. Save the file.
> 💡 *Note: If you run the project without `.env`, the application will automatically run in **Local Demo Mode** so you can preview and test every feature without getting stuck!*

---

## STEP 8: How to Enable Firebase Authentication

1. In the Firebase console left menu, click **Build → Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Enable the first toggle: **Email/Password** (leave Email link disabled).
5. Click **Save**.

---

## STEP 9: How to Enable Firestore Database

1. In the Firebase console left menu, click **Build → Firestore Database**.
2. Click **Create database**.
3. Select **Start in test mode** (this allows read/write while testing).
4. Choose a Cloud Firestore location (e.g. `us-central1` or one close to you) and click **Enable**.
5. Once your database is created, click the **Rules** tab at the top.
6. Copy the rules from `firestore.rules` in this project and paste them in, then click **Publish**.

---

## STEP 10: How to Run the Website Locally

In VS Code terminal (or Command Prompt in the project folder), run:

```bash
npm run dev
```

*What this command does:* Launches the Vite development server.
*Expected output:*
```
  VITE v5.4.21  ready in 400 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.76:5173/
```

Open your browser and navigate to:
👉 **http://localhost:5173/**

---

## STEP 11: How to Test Each Feature

Follow this checklist to test the entire application:

1. **Landing Page**: Check the hero section, flow diagram, and click **"Get Started"** or **"Explore Skills"**.
2. **Login / Sign Up**:
   - Use the **"One-Click Demo Login (as Rahul)"** or create a new student account.
3. **Dashboard**:
   - Observe your stats: Skills taught, skills wanted, pending requests, and upcoming sessions.
   - Notice the **"Recommended Skill Matches"** highlighting peers like Riya Patel!
4. **Discover Page**:
   - Click category pills (e.g. *Programming*, *UI/UX*, *Photography*).
   - Filter by Department, Skill Level, or Learning Mode.
   - See reciprocal matches highlighted with the **"⚡ Great Match!"** badge.
5. **Student Profile**:
   - Click on **Riya Patel**'s profile.
   - View her reviews, badges, and rating.
   - Click **"Send Skill Exchange Request"**, select skills, and submit.
6. **Requests Page**:
   - Open **Requests** to view received and sent proposals.
   - Click **"Accept"** on an incoming request.
   - Notice the new action buttons: **"Open Chat"** and **"Schedule Session"**!
7. **Chat Page**:
   - Open **Chat** to message your accepted exchange partner in real time.
8. **Learning Sessions**:
   - Schedule a practice session with date, time, and meeting link.
   - Click **"Mark Completed"** to earn **+20 teaching points** or **+10 learning points**!
9. **Reviews**:
   - Submit a 1–5 star rating and written review for a teacher (+5 points awarded).
10. **Notifications**:
    - Notice the notification bell with the unread badge count updating automatically.
11. **Admin Portal**:
    - Click **Admin** in the top navigation to view campus KPIs, moderate students, add skill categories, or reload sample data with 1 click.

---

## STEP 12: How to Deploy the Website Live to the Internet

When you are ready to make the website public for other students to use:

1. Install the Firebase CLI tool globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log into Firebase from your terminal:
   ```bash
   firebase login
   ```
   *(A browser window will open — select your Google account and click Allow).*
3. In your project folder, initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   Answer the questions as follows:
   - **Select an option:** Choose `Use an existing project` and select `campus-skill-exchange`.
   - **What do you want to use as your public directory?** Type `dist` and press Enter.
   - **Configure as a single-page app?** Type `Yes` (or `y`).
   - **Set up automatic builds with GitHub?** Type `No` (or `N`).
   - **Overwrite dist/index.html?** Type `No`.
4. Build the production React app:
   ```bash
   npm run build
   ```
5. Deploy your application to the internet:
   ```bash
   firebase deploy
   ```
6. In ~60 seconds, Firebase will output your live URL:
   ```
   Hosting URL: https://campus-skill-exchange.web.app
   ```
   Anyone with this link can now visit and use your website!
