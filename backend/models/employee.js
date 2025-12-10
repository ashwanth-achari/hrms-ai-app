const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: { type: String, required: true },
    team: { type: String },
    position: { type: String },
    salary: { type: Number },
    joiningDate: { type: Date },
    employeeId: { type: String, unique: true },
    status: { type: String, enum: ["Active", "Inactive", "On Leave"], default: "Active" },
    reportingManager: { type: String },
    performanceRating: { type: Number, min: 0, max: 5 },
    attendancePercentage: { type: Number, min: 0, max: 100 },
    address: { type: String },
    emergencyContact: { type: String },
    bankAccount: { type: String },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
