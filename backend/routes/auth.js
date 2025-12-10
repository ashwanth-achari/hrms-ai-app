// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

/**
 * POST /api/auth/create-test-users
 * Create test users if they don't already exist
 */
router.post("/create-test-users", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: "admin@company.com" });
    if (existingUser) {
      return res.json({ message: "Test users already exist" });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const testUsers = [
      {
        email: "admin@company.com",
        password: hashedPassword,
        role: "MANAGEMENT_ADMIN",
        scope: { department: "Admin", team: "HQ" },
      },
      {
        email: "manager@company.com",
        password: hashedPassword,
        role: "SENIOR_MANAGER",
        scope: { department: "Engineering", team: "Backend" },
      },
      {
        email: "recruiter@company.com",
        password: hashedPassword,
        role: "HR_RECRUITER",
        scope: { department: "HR", team: "Recruitment" },
      },
      {
        email: "employee@company.com",
        password: hashedPassword,
        role: "EMPLOYEE",
        scope: { department: "Engineering", team: "Backend" },
      },
    ];

    await User.insertMany(testUsers);

    res.json({
      message: "✅ Test users created successfully",
      testCredentials: [
        { email: "admin@company.com", password: "password123", role: "MANAGEMENT_ADMIN" },
        { email: "manager@company.com", password: "password123", role: "SENIOR_MANAGER" },
        { email: "recruiter@company.com", password: "password123", role: "HR_RECRUITER" },
        { email: "employee@company.com", password: "password123", role: "EMPLOYEE" },
      ],
    });
  } catch (error) {
    console.error("❌ Error creating test users:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

/**
 * POST /api/auth/login
 * Login with email + password
 */
router.post("/login", async (req, res) => {
  try {
    // 🔍 Debug: see what body we actually received
    console.log("🔍 Login request body:", req.body);

    // ✅ Guard: ensure body exists and is an object
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Request body is missing or invalid" });
    }

    let { email, password } = req.body;

    // Normalize input
    if (typeof email === "string") email = email.trim().toLowerCase();
    if (typeof password === "string") password = password.trim();

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    console.log("🔑 Login attempt for:", email);

    // 🔍 Find user by email
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? user.email : "Not found");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔐 Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("✅ Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🎫 Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        scope: user.scope,
      },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "24h" }
    );

    // ✅ Respond with token + user
    res.json({
      message: "✅ Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        scope: user.scope,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

module.exports = router;
