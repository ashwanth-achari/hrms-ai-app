const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Create test users
router.post("/create-test-users", async (req, res) => {
  try {
    // Check if users already exist
    const existingUser = await User.findOne({ email: "admin@company.com" });
    if (existingUser) {
      return res.json({ message: "Test users already exist" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    const testUsers = [
      {
        email: "admin@company.com",
        password: hashedPassword,
        role: "MANAGEMENT_ADMIN",
        scope: { department: "Admin", team: "HQ" }
      },
      {
        email: "manager@company.com",
        password: hashedPassword,
        role: "SENIOR_MANAGER",
        scope: { department: "Engineering", team: "Backend" }
      },
      {
        email: "recruiter@company.com",
        password: hashedPassword,
        role: "HR_RECRUITER",
        scope: { department: "HR", team: "Recruitment" }
      },
      {
        email: "employee@company.com",
        password: hashedPassword,
        role: "EMPLOYEE",
        scope: { department: "Engineering", team: "Backend" }
      }
    ];

    await User.insertMany(testUsers);

    res.json({
      message: "✅ Test users created successfully",
      testCredentials: [
        { email: "admin@company.com", password: "password123", role: "MANAGEMENT_ADMIN" },
        { email: "manager@company.com", password: "password123", role: "SENIOR_MANAGER" },
        { email: "recruiter@company.com", password: "password123", role: "HR_RECRUITER" },
        { email: "employee@company.com", password: "password123", role: "EMPLOYEE" }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    console.log("Login attempt:", email); // ✅ Debug log

    // Find user
    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : "Not found"); // ✅ Debug log

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid); // ✅ Debug log

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        scope: user.scope
      },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "✅ Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        scope: user.scope
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

module.exports = router;
