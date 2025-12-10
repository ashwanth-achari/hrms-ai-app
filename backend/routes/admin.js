const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Employee = require("../models/employee");
const Candidate = require("../models/candidate");
const Job = require("../models/job");

// ✅ Get all employees with pagination
router.get("/all-employees", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const employees = await Employee.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments();

    res.json({
      status: "success",
      data: employees,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get analytics from real data
router.get("/analytics", async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeDepartments = await Employee.distinct("department");
    const totalCandidates = await Candidate.countDocuments();
    const openJobs = await Job.countDocuments({ status: "Open" });
    const totalUsers = await User.countDocuments();

    res.json({
      status: "success",
      data: {
        totalEmployees,
        totalDepartments: activeDepartments.length,
        totalManagers: await User.countDocuments({ role: "SENIOR_MANAGER" }),
        totalRecruiters: await User.countDocuments({ role: "HR_RECRUITER" }),
        totalCandidates,
        openJobs,
        totalUsers,
        departments: activeDepartments
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Search employees
router.get("/employees/search", async (req, res) => {
  try {
    const { query, department, team } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { employeeId: { $regex: query, $options: "i" } }
      ];
    }

    if (department) filter.department = department;
    if (team) filter.team = team;

    const results = await Employee.find(filter).limit(20);

    res.json({
      status: "success",
      data: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update employee (Admin only)
router.put("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({
      status: "success",
      message: "Employee updated successfully",
      data: employee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete employee (Admin only)
router.delete("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({
      status: "success",
      message: "Employee deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get candidates with filters
router.get("/candidates", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    let filter = {};
    if (status) filter.status = status;

    const candidates = await Candidate.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ appliedDate: -1 });

    const total = await Candidate.countDocuments(filter);

    res.json({
      status: "success",
      data: candidates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get job openings
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });

    res.json({
      status: "success",
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
