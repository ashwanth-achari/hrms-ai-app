const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    position: { type: String, required: true },
    department: { type: String },
    status: {
      type: String,
      enum: ["APPLIED", "INTERVIEW", "SELECTED", "REJECTED"],
      default: "APPLIED"
    },
    appliedDate: { type: Date, default: Date.now },
    resume: { type: String },
    skills: [{ type: String }],
    experience: { type: Number },
    expectedSalary: { type: Number },
    interviewDate: { type: Date },
    interviewRating: { type: Number, min: 0, max: 5 },
    feedback: { type: String },
    source: { type: String },
    assignedRecruiter: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
