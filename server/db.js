import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Initial data seeded into the database
const INITIAL_DATA = {
  students: [
    {
      id: "sample_aarav",
      name: "Aarav Sharma",
      email: "aarav.sharma@campus.edu",
      college: "Tech Institute of Engineering",
      department: "Computer Science",
      year: "3rd Year",
      bio: "Working on Django backends and competitive programming. Happy to help with Python scripting and DSA prep; trying to learn React for semester project.",
      profileImage: "",
      teachingSkills: ["Python", "Data Structures", "Figma", "Git"],
      learningSkills: ["React", "Photography", "Tailwind CSS"],
      skillLevel: "Advanced",
      availability: "Weekday evenings & Saturday afternoons",
      learningMode: "Both",
      points: 125,
      badges: ["First Exchange", "Skill Mentor", "Top Contributor"],
      rating: 4.9,
      reviewCount: 8,
      isSample: true,
    },
    {
      id: "sample_riya",
      name: "Riya Patel",
      email: "riya.patel@campus.edu",
      college: "Tech Institute of Engineering",
      department: "Information Technology",
      year: "2nd Year",
      bio: "Frontend focused. I spend most of my time building React interfaces and designing in Figma. Looking to get comfortable with Python backend and APIs.",
      profileImage: "",
      teachingSkills: ["React", "UI/UX", "JavaScript", "Tailwind CSS"],
      learningSkills: ["Python", "Video Editing", "Machine Learning"],
      skillLevel: "Intermediate",
      availability: "Weekends & Tuesday/Thursday afternoons",
      learningMode: "Both",
      points: 140,
      badges: ["First Exchange", "Community Builder", "Skill Mentor"],
      rating: 5.0,
      reviewCount: 11,
      isSample: true,
    },
    {
      id: "sample_rohan",
      name: "Rohan Verma",
      email: "rohan.verma@campus.edu",
      college: "Tech Institute of Engineering",
      department: "AI & Data Science",
      year: "4th Year",
      bio: "Senior year working on CV projects and PyTorch. Can walk anyone through Python fundamentals, NumPy, and SQL. Want practice with presentation skills.",
      profileImage: "",
      teachingSkills: ["AI & Machine Learning", "Python", "SQL", "Statistics"],
      learningSkills: ["Communication", "Public Speaking", "UI/UX"],
      skillLevel: "Advanced",
      availability: "Flexible on weekdays after 5 PM",
      learningMode: "Online",
      points: 210,
      badges: ["10 Sessions", "Skill Mentor", "Top Contributor"],
      rating: 4.8,
      reviewCount: 15,
      isSample: true,
    },
    {
      id: "sample_ananya",
      name: "Ananya Iyer",
      email: "ananya.iyer@campus.edu",
      college: "Tech Institute of Engineering",
      department: "Design & Media Arts",
      year: "2nd Year",
      bio: "Campus club media lead. I do video edits in Premiere Pro, poster designs, and event photography. Looking to learn modern web design and marketing.",
      profileImage: "",
      teachingSkills: ["Photography", "Video Editing", "Graphic Design"],
      learningSkills: ["Marketing", "Communication", "React"],
      skillLevel: "Intermediate",
      availability: "Fridays and Sunday mornings",
      learningMode: "Offline",
      points: 80,
      badges: ["First Exchange", "Community Builder"],
      rating: 4.7,
      reviewCount: 5,
      isSample: true,
    },
    {
      id: "sample_vikram",
      name: "Vikram Malhotra",
      email: "vikram.m@campus.edu",
      college: "Tech Institute of Engineering",
      department: "Mechanical Engineering",
      year: "3rd Year",
      bio: "Robotics lab enthusiast. Comfortable with SolidWorks/Fusion 360, 3D printing, and basic C++. Looking for help with Python scripting for ROS.",
      profileImage: "",
      teachingSkills: ["Engineering", "CAD Modeling", "3D Printing", "Mathematics"],
      learningSkills: ["Python", "C++", "Robotics"],
      skillLevel: "Advanced",
      availability: "Weekdays 4 PM - 7 PM",
      learningMode: "Both",
      points: 95,
      badges: ["First Exchange", "Skill Mentor"],
      rating: 4.9,
      reviewCount: 6,
      isSample: true,
    },
    {
      id: "sample_priya",
      name: "Priya Das",
      email: "priya.das@campus.edu",
      college: "Tech Institute of Engineering",
      department: "Business & Management",
      year: "1st Year",
      bio: "Fresher exploring digital branding and events. Can teach basic acoustic guitar chords and public speaking. Looking to learn Figma basics.",
      profileImage: "",
      teachingSkills: ["Music", "Marketing", "Communication"],
      learningSkills: ["UI/UX", "Figma", "Web Development"],
      skillLevel: "Beginner",
      availability: "Saturday whole day",
      learningMode: "Offline",
      points: 45,
      badges: ["First Exchange"],
      rating: 5.0,
      reviewCount: 3,
      isSample: true,
    },
    {
      id: "demo_rahul",
      name: "Rahul Sharma",
      email: "rahul.sharma@campus.edu",
      college: "Tech Institute of Engineering",
      department: "Computer Science",
      year: "3rd Year",
      bio: "Curious student passionate about Python scripting and Data Analysis. Looking to learn modern UI/UX design and React web development!",
      profileImage: "",
      teachingSkills: ["Python", "C++", "Data Structures"],
      learningSkills: ["UI/UX", "React", "Figma"],
      skillLevel: "Intermediate",
      availability: "Evenings after 6 PM & Weekends",
      learningMode: "Both",
      points: 65,
      badges: ["First Exchange", "Skill Mentor"],
      rating: 4.8,
      reviewCount: 4,
      isSample: false,
    }
  ],
  requests: [
    {
      id: "req_1",
      fromId: "sample_riya",
      fromName: "Riya Patel",
      toId: "demo_rahul",
      toName: "Rahul Sharma",
      skillWanted: "Python",
      skillOffered: "UI/UX",
      message: "Hey Rahul! Saw you can teach Python. I can help you with Figma and UI/UX design in return!",
      status: "pending",
      createdAt: Date.now() - 3600000 * 4,
    },
    {
      id: "req_2",
      fromId: "demo_rahul",
      fromName: "Rahul Sharma",
      toId: "sample_aarav",
      toName: "Aarav Sharma",
      skillWanted: "React",
      skillOffered: "Data Structures",
      message: "Hi Aarav, would love to collaborate and learn React fundamentals.",
      status: "accepted",
      createdAt: Date.now() - 86400000 * 2,
    }
  ],
  sessions: [
    {
      id: "sess_1",
      skill: "React Component Architecture",
      teacherId: "sample_aarav",
      teacherName: "Aarav Sharma",
      learnerId: "demo_rahul",
      learnerName: "Rahul Sharma",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "17:00",
      mode: "Online",
      location: "Google Meet: meet.google.com/cse-demo-room",
      notes: "Bring a code editor with Node.js installed.",
      status: "Scheduled",
      createdAt: Date.now() - 86400000,
    }
  ],
  messages: [
    {
      id: "msg_1",
      chatId: "req_2",
      senderId: "sample_aarav",
      senderName: "Aarav Sharma",
      text: "Hey Rahul! Excited to teach React component architecture!",
      createdAt: Date.now() - 7200000,
    },
    {
      id: "msg_2",
      chatId: "req_2",
      senderId: "demo_rahul",
      senderName: "Rahul Sharma",
      text: "Awesome Aarav, thanks! Looking forward to our session tomorrow.",
      createdAt: Date.now() - 3600000,
    }
  ],
  reviews: [
    {
      id: "rev_1",
      teacherId: "demo_rahul",
      teacherName: "Rahul Sharma",
      reviewerId: "sample_vikram",
      reviewerName: "Vikram Malhotra",
      skill: "Python",
      rating: 5,
      comment: "Rahul explained Python loops and data structures with super clear examples. Highly recommend learning from him!",
      createdAt: Date.now() - 86400000 * 5,
    }
  ],
  notifications: [
    {
      id: "notif_1",
      userId: "demo_rahul",
      title: "New Skill Exchange Request",
      message: "Riya Patel sent you an exchange request for Python ↔ UI/UX.",
      type: "request",
      read: false,
      createdAt: Date.now() - 3600000 * 4,
      link: "/requests",
    },
    {
      id: "notif_2",
      userId: "demo_rahul",
      title: "Request Accepted!",
      message: "Aarav Sharma accepted your request to learn React.",
      type: "accepted",
      read: true,
      createdAt: Date.now() - 86400000 * 2,
      link: "/requests",
    }
  ],
  reports: [],
  categories: [
    "Programming",
    "AI & Machine Learning",
    "UI/UX",
    "Photography",
    "Video Editing",
    "Music",
    "Communication",
    "Marketing",
    "Engineering",
    "Academics",
    "Sports",
    "Other"
  ]
};

// Ensure data folder and db.json exist
function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf8");
  }
}

export function getDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, reinitializing:", err);
    return INITIAL_DATA;
  }
}

export function saveDb(data) {
  ensureDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing to database file:", err);
    return false;
  }
}

export function resetDb() {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf8");
  return INITIAL_DATA;
}
