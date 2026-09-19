import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./prismaClient.js";

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import requestRoutes from "./routes/requests.js";
import messageRoutes from "./routes/messages.js";
import sessionRoutes from "./routes/sessions.js";
import reviewRoutes from "./routes/reviews.js";
import notificationRoutes from "./routes/notifications.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", async (req, res) => {
  let dbStatus = "unknown";
  let dbUsersCount = 0;
  try {
    await prisma.$queryRaw`SELECT 1 as connected`;
    dbUsersCount = await prisma.user.count();
    dbStatus = "connected: Supabase PostgreSQL via Prisma";
  } catch (err) {
    dbStatus = `disconnected: ${err.message}`;
  }

  res.json({
    status: "ok",
    service: "Campus Skill Exchange Node.js Backend",
    port: PORT,
    database: {
      status: dbStatus,
      provider: "Supabase (PostgreSQL)",
      usersCount: dbUsersCount,
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🎓 Campus Skill Exchange Backend running at: http://localhost:${PORT}`);
  console.log(`👉 API Health Check: http://localhost:${PORT}/api/health\n`);
});
