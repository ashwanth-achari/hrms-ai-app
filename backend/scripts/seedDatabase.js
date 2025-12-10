const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Import models
const User = require("../models/user");
const Employee = require("../models/employee");
const Candidate = require("../models/candidate");
const Job = require("../models/job");

// Optional: suppress strictQuery warning
mongoose.set("strictQuery", false);

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/hrms-db";

// ✅ Generate random data helpers
const departments = ["Engineering", "Sales", "HR", "Finance", "Marketing", "Operations", "Product"];
const teams = ["Backend", "Frontend", "Mobile", "QA", "DevOps", "DataScience"];
const positions = ["Senior Developer", "Junior Developer", "DevOps Engineer", "Product Manager", "UI/UX Designer", "Data Analyst"];
const candidateStatuses = ["APPLIED", "INTERVIEW", "SELECTED", "REJECTED"];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomEmail(name) {
  return `${name.toLowerCase().replace(/\s/g, ".")}@company.com`;
}

function generateRandomPhone() {
  return `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

function generateRandomSalary() {
  return Math.floor(Math.random() * 80000 + 40000);
}

// ✅ Seed Employees (200+ records)
async function seedEmployees() {
  console.log("🌱 Seeding employees...");

  const firstNames = ["John", "Jane", "Mike", "Sarah", "David", "Emma", "Robert", "Lisa", "James", "Mary", "William", "Patricia", "Richard", "Jennifer", "Thomas"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson"];

  const employees = [];

  for (let i = 0; i < 250; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = generateRandomEmail(name);
    const department = getRandomItem(departments);
    const team = getRandomItem(teams);

    employees.push({
      name,
      email,
      phone: generateRandomPhone(),
      department,
      team,
      position: getRandomItem(positions),
      salary: generateRandomSalary(),
      joiningDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      employeeId: `EMP${String(i + 1).padStart(5, "0")}`,
      status: "Active",
      reportingManager: i > 0 ? `EMP${String(Math.floor(Math.random() * i) + 1).padStart(5, "0")}` : null,
      performanceRating: Math.floor(Math.random() * 2) + 3.5,
      attendancePercentage: Math.floor(Math.random() * 20) + 80,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await Employee.insertMany(employees);
  console.log(`✅ Created ${employees.length} employees`);
}

// ✅ Seed Candidates (100+ records)
async function seedCandidates() {
  console.log("🌱 Seeding candidates...");

  const firstNames = ["Alex", "Anna", "Chris", "Diana", "Eric", "Fiona", "George", "Hannah", "Isaac", "Julia"];
  const lastNames = ["Taylor", "Anderson", "Thomas", "Moore", "Jackson", "Martin", "White", "Harris", "Clark", "Lewis"];

  const candidates = [];

  for (let i = 0; i < 120; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = generateRandomEmail(name);

    candidates.push({
      name,
      email,
      phone: generateRandomPhone(),
      position: getRandomItem(positions),
      department: getRandomItem(departments),
      status: getRandomItem(candidateStatuses),
      appliedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      resume: `https://example.com/resumes/${name.replace(/\s/g, "_")}.pdf`,
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Docker", "AWS"].slice(
        0,
        Math.floor(Math.random() * 4) + 2
      ),
      experience: Math.floor(Math.random() * 10) + 1,
      expectedSalary: generateRandomSalary(),
      interviewDate:
        Math.random() > 0.5
          ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
          : null,
      interviewRating: Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 3.5 : null,
      feedback: "Good communication skills, strong technical knowledge",
      source: getRandomItem(["LinkedIn", "JobBoard", "Referral", "Email", "AggregatorsPortal"]),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await Candidate.insertMany(candidates);
  console.log(`✅ Created ${candidates.length} candidates`);
}

// ✅ Seed Job Openings (20+ records)
async function seedJobs() {
  console.log("🌱 Seeding job openings...");

  const jobDescriptions = [
    "Looking for experienced developer with 5+ years experience",
    "Perfect opportunity for fresh graduates",
    "Lead a team of 5+ engineers",
    "Work on cutting-edge technologies",
    "Remote position available",
  ];

  const jobs = [];

  for (let i = 0; i < 25; i++) {
    jobs.push({
      title: getRandomItem(positions),
      department: getRandomItem(departments),
      description: getRandomItem(jobDescriptions),
      requirements: ["5+ years experience", "Strong communication", "Team player"],
      salary: generateRandomSalary(),
      location: getRandomItem(["New York", "San Francisco", "Austin", "Remote", "Chicago"]),
      status: getRandomItem(["Open", "Closed", "On Hold"]),
      postedDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      closingDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      applicants: Math.floor(Math.random() * 50) + 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await Job.insertMany(jobs);
  console.log(`✅ Created ${jobs.length} job openings`);
}

// ✅ Seed Users
async function seedUsers() {
  console.log("🌱 Seeding users...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      email: "admin@company.com",
      password: hashedPassword,
      role: "MANAGEMENT_ADMIN",
      scope: { department: "Admin", team: "HQ" },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "manager@company.com",
      password: hashedPassword,
      role: "SENIOR_MANAGER",
      scope: { department: "Engineering", team: "Backend" },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "recruiter@company.com",
      password: hashedPassword,
      role: "HR_RECRUITER",
      scope: { department: "HR", team: "Recruitment" },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "employee@company.com",
      password: hashedPassword,
      role: "EMPLOYEE",
      scope: { department: "Engineering", team: "Backend" },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log(`✅ Created ${users.length} users`);
}

// ✅ Main seed function
async function seedDatabase() {
  console.log("\n🚀 Starting database seeding...\n");

  console.log("🗑️  Clearing existing data...");
  await Employee.deleteMany({});
  await Candidate.deleteMany({});
  await Job.deleteMany({});

  await seedUsers();
  await seedEmployees();
  await seedCandidates();
  await seedJobs();

  console.log("\n✅ Database seeding completed successfully!\n");
  console.log("📊 Summary:");
  console.log("   - 4 Users (Admin, Manager, Recruiter, Employee)");
  console.log("   - 250 Employees");
  console.log("   - 120 Candidates");
  console.log("   - 25 Job Openings");
  console.log("   - Total: 399+ records\n");
}

// 🚀 Bootstrap
(async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    await seedDatabase();
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  }
})();
