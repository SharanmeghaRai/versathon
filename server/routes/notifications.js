import { Router } from "express";
import { getDb, saveDb } from "../db.js";

const router = Router();

// GET /api/notifications?userId=...
router.get("/", (req, res) => {
  const { userId } = req.query;
  const db = getDb();
  let list = db.notifications || [];

  if (userId) {
    list = list.filter((n) => n.userId === userId);
  }

  list.sort((a, b) => b.createdAt - a.createdAt);
  return res.json(list);
});

// PATCH /api/notifications/:id/read
router.patch("/:id/read", (req, res) => {
  const db = getDb();
  const notif = (db.notifications || []).find((n) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDb(db);
  }
  return res.json({ success: true });
});

// PATCH /api/notifications/read-all?userId=...
router.patch("/read-all", (req, res) => {
  const { userId } = req.body;
  const db = getDb();
  if (userId && db.notifications) {
    db.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    saveDb(db);
  }
  return res.json({ success: true });
});

export default router;
