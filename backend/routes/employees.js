const router = require("express").Router();
const Employee = require("../models/employee");
const auth = require("../middleware/auth");

// Admin + Senior Manager → can fetch employees
router.get("/", auth(["MANAGEMENT_ADMIN", "SENIOR_MANAGER"]), async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Employee → can fetch only his own profile
router.get("/me", auth(["EMPLOYEE", "SENIOR_MANAGER", "MANAGEMENT_ADMIN"]), async (req, res) => {
  const employee = await Employee.findOne({ email: req.user.email });
  res.json(employee);
});

module.exports=router;
