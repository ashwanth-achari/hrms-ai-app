const express = require("express");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Employee = require("../models/employee");

const router = express.Router();

/**
 * Get employee's own profile
 * ✅ SCOPED: Employees only see their own data
 */
router.get("/profile", authMiddleware, authorize("EMPLOYEE"), async (req, res) => {
  try {
    const employeeId = req.user._id;

    // ✅ Scoped Query: Only their own profile
    const profile = await Employee.findById(employeeId);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get employee's leave balance
 * ✅ SCOPED: Employees only see their own leave data
 */
router.get("/leave-balance", authMiddleware, authorize("EMPLOYEE"), async (req, res) => {
  try {
    const employeeId = req.user._id;

    // ✅ Scoped Query: Only their leave data
    const leaveData = await Leave.findOne({ employeeId });

    res.json({
      success: true,
      data: leaveData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Request leave
 * ✅ SCOPED: Employees can only request leave for themselves
 */
router.post("/leave-request", authMiddleware, authorize("EMPLOYEE"), async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { startDate, endDate, reason } = req.body;

    // ✅ Scoped creation: Always for current user
    const leaveRequest = new Leave({
      employeeId,
      startDate,
      endDate,
      reason,
      status: "PENDING"
    });

    await leaveRequest.save();

    res.json({ 
      success: true, 
      data: leaveRequest,
      message: "Leave request submitted"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
