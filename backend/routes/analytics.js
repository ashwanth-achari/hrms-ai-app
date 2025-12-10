const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Employee = require("../models/employee");
const Candidate = require("../models/candidate");

router.use(auth(["MANAGEMENT_ADMIN", "SENIOR_MANAGER", "HR_RECRUITER"]));

router.get("/summary", async (req, res) => {
  const [totalEmployees, hiredThisMonth, activeHiring, applicants] =
    await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ hiredMonth: new Date().getMonth() + 1 }),
      Candidate.countDocuments({ status: "Interview" }),
      Candidate.countDocuments()
    ]);

  return res.json({
    totalEmployees,
    hiredThisMonth,
    activeHiring,
    applicants
  });
});

// Candidate and hiring funnel
router.get("/hiring-funnel", async (req, res) => {
  const stages = await Candidate.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.json(stages);
});

// Employee by department
router.get("/by-department", async (req, res) => {
  const depts = await Employee.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 } } }
  ]);
  res.json(depts);
});

// Home page
router.get("/", async (req, res) => {
  res.json({ status: "success", data: {} });
});

module.exports = router;
