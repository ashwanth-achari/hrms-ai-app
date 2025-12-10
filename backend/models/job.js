const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String },
    requirements: [{ type: String }],
    salary: { type: Number },
    location: { type: String },
    status: {
      type: String,
      enum: ["Open", "Closed", "On Hold"],
      default: "Open"
    },
    postedDate: { type: Date, default: Date.now },
    closingDate: { type: Date },
    applicants: { type: Number, default: 0 },
    filledPositions: { type: Number, default: 0 },
    createdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);