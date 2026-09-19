import { Router } from "express";
import { getDb, saveDb } from "../db.js";

const router = Router();

// GET /api/reviews/:teacherId
router.get("/:teacherId", (req, res) => {
  const db = getDb();
  const list = (db.reviews || []).filter((r) => r.teacherId === req.params.teacherId);
  return res.json(list);
});

// POST /api/reviews
router.post("/", (req, res) => {
  const { teacherId, teacherName, reviewerId, reviewerName, skill, rating, comment } = req.body;
  if (!teacherId || !reviewerId || !rating) {
    return res.status(400).json({ error: "Missing required review fields." });
  }

  const db = getDb();
  const newReview = {
    id: "rev_" + Date.now(),
    teacherId,
    teacherName: teacherName || "Teacher",
    reviewerId,
    reviewerName: reviewerName || "Student",
    skill: skill || "Skill Exchange",
    rating: Number(rating) || 5,
    comment: comment ? comment.trim() : "",
    createdAt: Date.now(),
  };

  db.reviews.push(newReview);

  // Recalculate teacher's average rating and add +5 points
  const teacher = db.students.find((s) => s.id === teacherId);
  if (teacher) {
    const teacherReviews = db.reviews.filter((r) => r.teacherId === teacherId);
    const sum = teacherReviews.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    teacher.rating = Number((sum / teacherReviews.length).toFixed(1));
    teacher.reviewCount = teacherReviews.length;
    teacher.points = (teacher.points || 0) + 5;
  }

  saveDb(db);
  return res.status(201).json(newReview);
});

export default router;
