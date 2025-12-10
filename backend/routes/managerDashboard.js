const express = require("express");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Employee = require("../models/employee");

const router = express.Router();

/**
 * Get team members
 * ✅ SCOPED: Manager only sees their direct reports
 */
router.get("/team", authMiddleware, authorize("SENIOR_MANAGER"), async (req, res) => {
  try {
    const managerId = req.user._id;

    // ✅ Scoped Query: Only their team
    const team = await Employee.find({ managerId });

    res.json({
      success: true,
      data: team,
      message: `Retrieved ${team.length} team members`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get team performance metrics
 * ✅ SCOPED: Only their department's data
 */
router.get("/team/performance", authMiddleware, authorize("SENIOR_MANAGER"), async (req, res) => {
  try {
    const managerId = req.user._id;
    const department = req.user.scope.department;

    // ✅ Scoped Query: Only their department
    const metrics = await Employee.find({
      managerId,
      department
    }).select("name performance department");

    res.json({
      success: true,
      data: metrics,
      department
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Approve leave request
 * ✅ SCOPED: Only for their team members
 */
router.post("/leave/approve", authMiddleware, authorize("SENIOR_MANAGER"), async (req, res) => {
  try {
    const { leaveRequestId, employeeId } = req.body;
    const managerId = req.user._id;

    // ✅ Verify employee is in manager's team
    const employee = await Employee.findOne({
      _id: employeeId,
      managerId
    });

    if (!employee) {
      return res.status(403).json({ 
        error: "Cannot approve leave for employees outside your team" 
      });
    }

    // Update leave request
    // ... your leave approval logic

    res.json({ success: true, message: "Leave approved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
