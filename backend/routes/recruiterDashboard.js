const express = require("express");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const Candidate = require("../models/candidate");

const router = express.Router();

/**
 * Get assigned candidates
 * ✅ SCOPED: Recruiter only sees candidates assigned to them
 */
router.get("/candidates", authMiddleware, authorize("HR_RECRUITER"), async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // ✅ Scoped Query: Only assigned candidates
    const candidates = await Candidate.find({
      assignedRecruiter: recruiterId
    });

    res.json({
      success: true,
      data: candidates,
      count: candidates.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get job openings for recruiter
 * ✅ SCOPED: Only jobs they're assigned to
 */
router.get("/jobs", authMiddleware, authorize("HR_RECRUITER"), async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // ✅ Scoped Query: Only their jobs
    const jobs = await Job.find({
      assignedRecruiter: recruiterId
    });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update candidate status
 * ✅ SCOPED: Only for assigned candidates
 */
router.put("/candidates/:candidateId/status", authMiddleware, authorize("HR_RECRUITER"), async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { status } = req.body;
    const recruiterId = req.user._id;

    // ✅ Verify candidate is assigned to this recruiter
    const candidate = await Candidate.findOne({
      _id: candidateId,
      assignedRecruiter: recruiterId
    });

    if (!candidate) {
      return res.status(403).json({ 
        error: "Cannot update candidates not assigned to you" 
      });
    }

    candidate.status = status;
    await candidate.save();

    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
