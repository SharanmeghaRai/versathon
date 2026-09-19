import { Router } from "express";
import { getDb, saveDb } from "../db.js";

const router = Router();

// GET /api/messages/:chatId
router.get("/:chatId", (req, res) => {
  const db = getDb();
  const list = (db.messages || []).filter((m) => m.chatId === req.params.chatId);
  list.sort((a, b) => a.createdAt - b.createdAt);
  return res.json(list);
});

// POST /api/messages
router.post("/", (req, res) => {
  const { chatId, senderId, senderName, text } = req.body;
  if (!chatId || !senderId || !text) {
    return res.status(400).json({ error: "Missing chatId, senderId, or text." });
  }

  const db = getDb();
  const newMsg = {
    id: "msg_" + Date.now(),
    chatId,
    senderId,
    senderName: senderName || "Student",
    text: text.trim(),
    createdAt: Date.now(),
  };

  db.messages.push(newMsg);
  saveDb(db);

  return res.status(201).json(newMsg);
});

export default router;
