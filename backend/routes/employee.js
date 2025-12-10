const express = require("express");
const router = express.Router();
const Employee = require("../models/employee");
// const Attendance = require("../models/Attendance");
// const LeaveBalance = require("../models/LeaveBalance");
// const Performance = require("../models/Performance");
// const Payroll = require("../models/Payroll");
// const Job = require("../models/job");

// ✅ Helper: get current user's email
//    - Uses req.user.email if auth middleware sets it
//    - Falls back to seeded demo user for local testing
function getCurrentUserEmail(req) {
  if (req.user && req.user.email) return req.user.email;
  if (req.authUser && req.authUser.email) return req.authUser.email;
  return "employee@company.com";
}

// ✅ Small helper: fetch employee or 404
async function findEmployeeByRequest(req, res) {
  const email = getCurrentUserEmail(req);
  const employee = await Employee.findOne({ email });

  if (!employee) {
    res.status(404).json({ error: "Employee not found for " + email });
    return null;
  }

  return employee;
}

/**
 * GET /api/employee/profile
 * Returns the logged-in employee's profile from MongoDB
 */
router.get("/profile", async (req, res) => {
  try {
    const employee = await findEmployeeByRequest(req, res);
    if (!employee) return;

    // send full employee doc (frontend uses name/email/department/team/etc.)
    res.json({
      status: "success",
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * GET /api/employee/attendance
 * Returns attendance summary + recent records
 */
router.get("/attendance", async (req, res) => {
  try {
    const employee = await findEmployeeByRequest(req, res);
    if (!employee) return;

    // last 30 days attendance
    const records = await Attendance.find({ employee: employee._id })
      .sort({ date: -1 })
      .limit(30);

    const total = records.length || 1;
    const presentDays = records.filter((r) => r.status === "Present").length;
    const rate = Math.round((presentDays / total) * 100);

    res.json({
      status: "success",
      data: {
        rate, // used in dashboard quick card
        lastCheckIn: records[0]?.checkIn || "09:00",
        records,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/**
 * GET /api/employee/leave-balance
 * Returns leave balance for the employee
 */
router.get("/leave-balance", async (req, res) => {
  try {
    const employee = await findEmployeeByRequest(req, res);
    if (!employee) return;

    let balance = await LeaveBalance.findOne({ employee: employee._id });

    // fallback if not seeded
    if (!balance) {
      balance = {
        annualLeave: 18,
        sickLeave: 10,
        casualLeave: 6,
      };
    }

    res.json({
      status: "success",
      data: {
        annualLeave: balance.annualLeave,
        sickLeave: balance.sickLeave,
        casualLeave: balance.casualLeave,
      },
    });
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    res.status(500).json({ error: "Failed to fetch leave balance" });
  }
});

/**
 * GET /api/employee/performance
 * Returns performance metrics from Performance collection
 */
router.get("/performance", async (req, res) => {
  try {
    const employee = await findEmployeeByRequest(req, res);
    if (!employee) return;

    let perf = await Performance.findOne({ employee: employee._id });

    // fallback defaults if not found
    const rating = perf?.rating ?? employee.performanceRating ?? 4.0;
    const activeProjects = perf?.activeProjects ?? 3;
    const lastReviewDate = perf?.lastReviewDate ?? employee.updatedAt ?? new Date();

    res.json({
      status: "success",
      data: {
        rating,
        attendance: employee.attendancePercentage ?? 90,
        activeProjects,
        lastReviewDate,
      },
    });
  } catch (error) {
    console.error("Error fetching performance:", error);
    res.status(500).json({ error: "Failed to fetch performance" });
  }
});

/**
 * GET /api/employee/payroll
 * Returns payroll info from Payroll collection
 */
router.get("/payroll", async (req, res) => {
  try {
    const employee = await findEmployeeByRequest(req, res);
    if (!employee) return;

    let payroll = await Payroll.findOne({ employee: employee._id });

    res.json({
      status: "success",
      data: {
        latestCycle: payroll?.latestCycle || "Current month salary processed",
        baseSalary: payroll?.baseSalary || employee.salary || 0,
        currency: payroll?.currency || "USD",
      },
    });
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({ error: "Failed to fetch payroll" });
  }
});

/**
 * POST /api/employee/leave-request
 * Basic leave request endpoint (currently logs + echoes back)
 */
router.post("/leave-request", async (req, res) => {
  try {
    const employee = await findEmployeeByRequest(req, res);
    if (!employee) return;

    const leaveData = req.body;

    console.log("📩 Leave request from", employee.email, leaveData);

    // TODO: save to LeaveRequest model later
    res.status(201).json({
      status: "success",
      message: "Leave request submitted successfully",
      data: {
        ...leaveData,
        employee: employee._id,
        status: "PENDING",
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error requesting leave:", error);
    res.status(500).json({ error: "Failed to submit leave request" });
  }
});

/**
 * GET /api/employee/internal-jobs
 * Returns open job postings as internal opportunities
 */
router.get("/internal-jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" })
      .sort({ postedDate: -1 })
      .limit(10);

    const formatted = jobs.map((job) => ({
      id: job._id,
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description,
      postedDate: job.postedDate,
      status: job.status,
    }));

    res.json({
      status: "success",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching internal jobs:", error);
    res.status(500).json({ error: "Failed to fetch internal jobs" });
  }
});

module.exports = router;
