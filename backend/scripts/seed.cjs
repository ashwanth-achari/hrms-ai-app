const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../models/user");
const Employee = require("../models/employee");
const Candidate = require("../models/candidate");
require("dotenv").config();

mongoose.set("strictQuery", false);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Candidate.deleteMany({})
    ]);

    console.log("Cleared existing collections");

    // --- Seed Employees (example) ---
    // --- Seed Employees ---
const employees = [];
const roles = ["MERN Developer", "Frontend Engineer", "Backend Engineer", "HR Recruiter"];
const departments = ["Engineering", "HR", "Finance", "Marketing"];

for (let i = 1; i <= 300; i++) {
  employees.push({
    name: faker.person.fullName(),
    email: `employee${i}@company.com`,
    employeeId: `EMP-${String(i).padStart(4, "0")}`,   // 🔹 UNIQUE PER EMPLOYEE
    role: faker.helpers.arrayElement(roles),
    department: faker.helpers.arrayElement(departments),
    experience: faker.number.float({ min: 0, max: 12, multipleOf: 0.5 }),
    joinedAt: faker.date.past({ years: 5 })
  });
}

await Employee.insertMany(employees);
console.log("Employees seeded:", employees.length);

    // --- Seed Candidates (Recruitment AI) ---
    const candidateRoles = ["MERN Developer", "Frontend Engineer", "Data Scientist", "DevOps Engineer"];
    const candidateStatuses = ["Applied", "Screened", "Interview", "Offered", "Hired", "Rejected"];

    const candidates = [];

    for (let i = 1; i <= 300; i++) {
      const fullName = faker.person.fullName();
      const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      candidates.push({
        name: fullName,
        role: faker.helpers.arrayElement(candidateRoles),          // 🔹 REQUIRED
        experience: faker.number.float({ min: 0, max: 10, multipleOf: 0.5 }),
        status: faker.helpers.arrayElement(candidateStatuses),
        resumeUrl: `https://example.com/resumes/${slug}-${i}.pdf` // 🔹 REQUIRED
      });
    }

    await Candidate.insertMany(candidates);
    console.log("Candidates seeded:", candidates.length);

    console.log("✅ Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
