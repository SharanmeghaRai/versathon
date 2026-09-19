import { Router } from "express";
import { getDb, saveDb } from "../db.js";

const router = Router();

// POST /api/auth/signup
router.post("/signup", (req, res) => {
  const { name, email, password, college, department, year } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  const db = getDb();
  const existing = db.students.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const newStudent = {
    id: "student_" + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    college: college?.trim() || "Tech Institute of Engineering",
    department: department?.trim() || "Computer Science",
    year: year?.trim() || "1st Year",
    bio: "",
    teachingSkills: [],
    learningSkills: [],
    skillLevel: "Beginner",
    availability: "Flexible",
    learningMode: "Both",
    points: 10,
    badges: ["First Exchange"],
    rating: 5.0,
    reviewCount: 0,
    createdAt: Date.now(),
  };

  db.students.push(newStudent);
  saveDb(db);

  return res.status(201).json({
    message: "Student account created successfully",
    student: newStudent,
  });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const db = getDb();
  const student = db.students.find(
    (s) => s.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!student) {
    return res.status(404).json({ error: "No registered student found with that email." });
  }

  return res.json({
    message: "Login successful",
    student,
  });
});

// POST /api/auth/demo (1-click test login as Rahul)
router.post("/demo", (req, res) => {
  const db = getDb();
  const rahul = db.students.find((s) => s.id === "demo_rahul") || db.students[0];
  return res.json({
    message: "Logged in as demo student",
    student: rahul,
  });
});

export default router;
