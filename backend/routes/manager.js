const express = require("express");
const router = express.Router();

// ✅ Get team
router.get("/team", async (req, res) => {
  try {
    const User = require("../models/user");
    // Get team members (employees in same department)
    const team = await User.find({
      role: "EMPLOYEE",
      "scope.department": "Engineering"
    }).select("-password");

    res.json({
      status: "success",
      data: team
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get team performance
router.get("/team/performance", async (req, res) => {
  try {
    const performance = [
      {
        _id: "1",
        name: "Employee 1",
        performance: 85
      },
      {
        _id: "2",
        name: "Employee 2",
        performance: 90
      },
      {
        _id: "3",
        name: "Employee 3",
        performance: 75
      }
    ];

    res.json({
      status: "success",
      data: performance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;