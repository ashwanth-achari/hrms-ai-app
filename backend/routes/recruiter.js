const express = require("express");
const router = express.Router();

// ✅ Get candidates
router.get("/candidates", async (req, res) => {
  try {
    const candidates = [
      {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        position: "Senior Developer",
        status: "INTERVIEW"
      },
      {
        _id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        position: "UI/UX Designer",
        status: "APPLIED"
      },
      {
        _id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        position: "DevOps Engineer",
        status: "SELECTED"
      }
    ];

    res.json({
      status: "success",
      data: candidates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = [
      {
        _id: "1",
        title: "Senior Backend Developer",
        department: "Engineering",
        status: "Open"
      },
      {
        _id: "2",
        title: "Frontend Developer",
        department: "Engineering",
        status: "Open"
      },
      {
        _id: "3",
        title: "Product Manager",
        department: "Product",
        status: "Open"
      }
    ];

    res.json({
      status: "success",
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;