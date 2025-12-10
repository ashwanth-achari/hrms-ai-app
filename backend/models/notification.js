const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    targetRoles: [String],  // e.g. ["HR_RECRUITER"] or ["SENIOR_MANAGER"]
    message: String,
    createdBy: String,
    readBy: [String] // emails that read the notification
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
