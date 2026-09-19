import { Router } from "express";
import { getDb, saveDb } from "../db.js";

const router = Router();

// GET /api/students
router.get("/", (req, res) => {
  const { q, category, department, level, mode, excludeId } = req.query;
  const db = getDb();
  let list = db.students || [];

  if (excludeId) {
    list = list.filter((s) => s.id !== excludeId);
  }

  if (q) {
    const queryStr = q.toLowerCase();
    list = list.filter((s) => {
      const haystack = [
        s.name,
        s.college,
        s.department,
        s.year,
        s.skillLevel,
        s.learningMode,
        ...(s.teachingSkills || []),
        ...(s.learningSkills || []),
      ].join(" ").toLowerCase();
      return haystack.includes(queryStr);
    });
  }

  if (category && category !== "All") {
    const cat = category.toLowerCase();
    const categoryKeywords = {
      "programming": ["python", "react", "javascript", "c++", "data structures", "git", "coding", "django", "sql", "web development"],
      "ai & machine learning": ["ai", "machine learning", "pytorch", "statistics", "sql", "data science"],
      "ui/ux": ["ui", "ux", "figma", "design", "prototyping"],
      "photography": ["photo", "photography", "camera"],
      "video editing": ["video", "premiere", "editing"],
      "music": ["music", "guitar", "acoustic"],
      "communication": ["communication", "public speaking"],
      "marketing": ["marketing", "branding", "social media"],
      "engineering": ["engineering", "cad", "3d printing", "robotics", "mathematics"],
      "academics": ["mathematics", "data structures", "statistics"],
    };

    const keywords = categoryKeywords[cat] || [cat];

    list = list.filter((s) => {
      const allSkills = [
        ...(s.teachingSkills || []),
        ...(s.learningSkills || []),
      ].map((sk) => sk.toLowerCase());

      return allSkills.some((skill) =>
        keywords.some((kw) => skill.includes(kw) || kw.includes(skill))
      );
    });
  }

  if (department && department !== "All") {
    list = list.filter((s) => s.department === department);
  }

  if (level && level !== "All") {
    list = list.filter((s) => s.skillLevel === level);
  }

  if (mode && mode !== "All") {
    list = list.filter((s) => s.learningMode === "Both" || s.learningMode === mode);
  }

  return res.json(list);
});

// GET /api/students/:id
router.get("/:id", (req, res) => {
  const db = getDb();
  const student = db.students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  return res.json(student);
});

// PUT /api/students/:id
router.put("/:id", (req, res) => {
  const db = getDb();
  const index = db.students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  const updated = {
    ...db.students[index],
    ...req.body,
    id: req.params.id, // prevent overwriting ID
  };

  db.students[index] = updated;
  saveDb(db);
  return res.json(updated);
});

export default router;
