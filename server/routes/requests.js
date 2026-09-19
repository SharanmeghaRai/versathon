import { Router } from "express";
import { getDb, saveDb } from "../db.js";

const router = Router();

// GET /api/requests?userId=...
router.get("/", (req, res) => {
  const { userId } = req.query;
  const db = getDb();
  let allRequests = db.requests || [];

  if (userId) {
    return res.json({
      received: allRequests.filter((r) => r.toId === userId),
      sent: allRequests.filter((r) => r.fromId === userId),
    });
  }

  return res.json(allRequests);
});

// POST /api/requests
router.post("/", (req, res) => {
  const { fromId, fromName, toId, toName, skillWanted, skillOffered, message } = req.body;
  if (!fromId || !toId || !skillWanted || !skillOffered) {
    return res.status(400).json({ error: "Missing required request fields." });
  }

  const db = getDb();
  const newRequest = {
    id: "req_" + Date.now(),
    fromId,
    fromName: fromName || "Peer",
    toId,
    toName: toName || "Peer",
    skillWanted,
    skillOffered,
    message: message || "",
    status: "pending",
    createdAt: Date.now(),
  };

  db.requests.unshift(newRequest);

  // Trigger a notification for the recipient
  db.notifications.unshift({
    id: "notif_" + Date.now(),
    userId: toId,
    title: "New Skill Exchange Request",
    message: `${fromName || "A student"} wants to learn ${skillWanted} and offered ${skillOffered}.`,
    type: "request",
    read: false,
    createdAt: Date.now(),
    link: "/requests",
  });

  saveDb(db);
  return res.status(201).json(newRequest);
});

// PATCH /api/requests/:id
router.patch("/:id", (req, res) => {
  const { status } = req.body;
  const db = getDb();
  const request = db.requests.find((r) => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  request.status = status;

  // If accepted, notify the sender
  if (status === "accepted") {
    db.notifications.unshift({
      id: "notif_" + Date.now(),
      userId: request.fromId,
      title: "Request Accepted! 🎉",
      message: `${request.toName} accepted your exchange request for ${request.skillWanted}!`,
      type: "accepted",
      read: false,
      createdAt: Date.now(),
      link: `/chat?requestId=${request.id}`,
    });
  }

  saveDb(db);
  return res.json(request);
});

export default router;
