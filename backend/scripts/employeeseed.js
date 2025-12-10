// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Employee from "../models/employee.js";
// import Attendance from "../models/Attendance.js";
// import LeaveBalance from "../models/LeaveBalance.js";
// import Performance from "../models/Performance.js";
// import Payroll from "../models/Payroll.js";

// dotenv.config();

// const seed = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("🟢 Connected to MongoDB");

//     // Clear collections (optional for clean seeding)
//     await Employee.deleteMany();
//     await Attendance.deleteMany();
//     await LeaveBalance.deleteMany();
//     await Performance.deleteMany();
//     await Payroll.deleteMany();

//     // Insert employee
//     const employee = await Employee.create({
//       employeeId: "EMP001",
//       fullName: "John Doe",
//       email: "john@company.com",
//       department: "Engineering",
//       team: "Web",
//       designation: "Frontend Developer",
//       role: "EMPLOYEE",
//     });

//     // Insert attendance
//     await Attendance.create({
//       employee: employee._id,
//       rate: 95,
//       lastCheckIn: "09:00 AM",
//     });

//     // Insert leave balance
//     await LeaveBalance.create({
//       employee: employee._id,
//       annualLeave: 18,
//       sickLeave: 10,
//       casualLeave: 6,
//     });

//     // Insert performance
//     await Performance.create({
//       employee: employee._id,
//       rating: 4.5,
//       lastReviewDate: "2025-01-10",
//       activeProjects: 3,
//     });

//     // Insert payroll
//     await Payroll.create({
//       employee: employee._id,
//       latestCycle: "Jan 2025 salary processed",
//     });

//     console.log("✨ Seeding complete");
//     process.exit();
//   } catch (error) {
//     console.error("🔴 Seeding failed:", error);
//     process.exit(1);
//   }
// };

// seed();
