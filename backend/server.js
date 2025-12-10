// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();

// ✅ CORS (frontend URL from env, fallback to localhost for dev)
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Body parsers (VERY IMPORTANT for req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "hrms-backend" });
});

// ✅ Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const managerRoutes = require("./routes/manager");
const recruiterRoutes = require("./routes/recruiter");
const employeeRoutes = require("./routes/employee");
const analyticsRoutes = require("./routes/analytics");
const notificationRoutes = require("./routes/notifications");

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ MongoDB connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/hrms-db";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error middleware caught:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 8200;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔗 Allowed frontend: ${allowedOrigin}`);
});

module.exports = app;
