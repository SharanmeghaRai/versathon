import { Router } from "express";
import { getDb, saveDb, resetDb } from "../db.js";

const router = Router();

// GET /api/admin/stats
router.get("/stats", (req, res) => {
  const db = getDb();
  return res.json({
    totalStudents: (db.students || []).length,
    activeStudents: (db.students || []).length,
    totalExchanges: (db.requests || []).length,
    completedSessions: (db.sessions || []).filter((s) => s.status === "Completed").length,
    pendingReports: (db.reports || []).length,
    totalCategories: (db.categories || []).length,
  });
});

// GET /api/admin/reports
router.get("/reports", (req, res) => {
  const db = getDb();
  return res.json(db.reports || []);
});

// POST /api/admin/reports
router.post("/reports", (req, res) => {
  const { reportedUserId, reportedUserName, reporterId, reason } = req.body;
  const db = getDb();
  if (!db.reports) db.reports = [];

  const newReport = {
    id: "rep_" + Date.now(),
    reportedUserId,
    reportedUserName,
    reporterId,
    reason,
    createdAt: Date.now(),
  };

  db.reports.push(newReport);
  saveDb(db);
  return res.status(201).json(newReport);
});

// GET /api/admin/categories
router.get("/categories", (req, res) => {
  const db = getDb();
  return res.json(db.categories || []);
});

// POST /api/admin/categories
router.post("/categories", (req, res) => {
  const { category } = req.body;
  if (!category) return res.status(400).json({ error: "Category name is required" });

  const db = getDb();
  if (!db.categories) db.categories = [];
  if (!db.categories.includes(category.trim())) {
    db.categories.push(category.trim());
    saveDb(db);
  }
  return res.json(db.categories);
});

// DELETE /api/admin/students/:id
router.delete("/students/:id", (req, res) => {
  const db = getDb();
  db.students = (db.students || []).filter((s) => s.id !== req.params.id);
  saveDb(db);
  return res.json({ success: true, message: "Student removed" });
});

// POST /api/admin/reset
router.post("/reset", (req, res) => {
  const reloaded = resetDb();
  return res.json({ success: true, message: "Database reset to initial campus samples", data: reloaded });
});

export default router;
