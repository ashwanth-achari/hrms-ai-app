const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


// ✅ Create app FIRST
const app = express();

// ✅ Middleware BEFORE routes
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());


// ✅ Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "hrms-backend" });
});

// ✅ Import and register routes AFTER middleware
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

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hrms-db")
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
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
  console.log(`🔗 Frontend URL: http://localhost:5173`);
});

module.exports = app;
