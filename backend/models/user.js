const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ Role-Based Access Control (RBAC)
  role: {
    type: String,
    enum: ["EMPLOYEE", "HR_RECRUITER", "SENIOR_MANAGER", "MANAGEMENT_ADMIN"],
    required: true
  },

  // ✅ Scope-Level Access Control (Resource-level)
  scope: {
    department: String,
    region: String,
    businessUnit: String,
    team: String
  },

  // ✅ Hierarchy Information
  managerId: Schema.Types.ObjectId,  // Who is this person's direct manager?
  reportsTo: [Schema.Types.ObjectId], // Who reports to this person?
  
  // ✅ Explicit Permissions
  permissions: [String],  // e.g., ["view_team", "approve_leave", "manage_candidates"]

  // ✅ Metadata
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

module.exports = mongoose.model("User", userSchema);
