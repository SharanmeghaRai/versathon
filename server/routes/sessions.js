import { Router } from "express";
import { getDb, saveDb } from "../db.js";

const router = Router();

// GET /api/sessions?userId=...
router.get("/", (req, res) => {
  const { userId } = req.query;
  const db = getDb();
  let list = db.sessions || [];

  if (userId) {
    list = list.filter((s) => s.teacherId === userId || s.learnerId === userId);
  }

  return res.json(list);
});

// POST /api/sessions
router.post("/", (req, res) => {
  const {
    skill,
    teacherId,
    teacherName,
    learnerId,
    learnerName,
    date,
    time,
    mode,
    location,
    notes
  } = req.body;

  if (!skill || !teacherId || !learnerId || !date) {
    return res.status(400).json({ error: "Missing required session details." });
  }

  const db = getDb();
  const newSession = {
    id: "sess_" + Date.now(),
    skill: skill.trim(),
    teacherId,
    teacherName: teacherName || "Teacher",
    learnerId,
    learnerName: learnerName || "Learner",
    date,
    time: time || "16:00",
    mode: mode || "Online",
    location: location || "",
    notes: notes || "",
    status: "Scheduled",
    createdAt: Date.now(),
  };

  db.sessions.push(newSession);

  // Notify the learner or teacher
  db.notifications.unshift({
    id: "notif_" + Date.now(),
    userId: learnerId,
    title: "New Learning Session Scheduled",
    message: `A session for "${skill}" was arranged on ${date} at ${time || "16:00"}.`,
    type: "session",
    read: false,
    createdAt: Date.now(),
    link: "/sessions",
  });

  saveDb(db);
  return res.status(201).json(newSession);
});

// PATCH /api/sessions/:id
router.patch("/:id", (req, res) => {
  const { status, currentUserId } = req.body;
  const db = getDb();
  const session = db.sessions.find((s) => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  session.status = status;

  // Gamification: award points on completion (+20 to teacher, +10 to learner)
  if (status === "Completed") {
    const teacher = db.students.find((s) => s.id === session.teacherId);
    const learner = db.students.find((s) => s.id === session.learnerId);

    if (teacher) {
      teacher.points = (teacher.points || 0) + 20;
      if (!teacher.badges) teacher.badges = [];
      if (!teacher.badges.includes("Skill Mentor") && teacher.points >= 60) {
        teacher.badges.push("Skill Mentor");
      }
    }

    if (learner) {
      learner.points = (learner.points || 0) + 10;
      if (!learner.badges) learner.badges = [];
      if (!learner.badges.includes("First Exchange")) {
        learner.badges.push("First Exchange");
      }
    }
  }

  saveDb(db);
  return res.json(session);
});

export default router;
