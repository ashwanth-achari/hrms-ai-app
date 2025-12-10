const Employee = require("../models/employee");

/**
 * Check if user can access a specific resource based on scope
 * Implements Attribute-Based Access Control (ABAC)
 */
const checkScope = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const targetUserId = req.params.userId || req.body.userId;

    if (!targetUserId) {
      return next(); // No specific user targeted
    }

    const targetUser = await Employee.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // ADMIN can access everything
    if (currentUser.role === "MANAGEMENT_ADMIN") {
      return next();
    }

    // MANAGER can only access their team members
    if (currentUser.role === "SENIOR_MANAGER") {
      // Check if target is in their reporting chain
      const isTeamMember = await Employee.findOne({
        _id: targetUserId,
        managerId: currentUser._id
      });

      if (!isTeamMember) {
        return res.status(403).json({ 
          error: "Cannot access users outside your team" 
        });
      }
      return next();
    }

    // RECRUITER can only access assigned candidates
    if (currentUser.role === "HR_RECRUITER") {
      const candidate = await Employee.findOne({
        _id: targetUserId,
        assignedRecruiter: currentUser._id
      });

      if (!candidate) {
        return res.status(403).json({ 
          error: "Cannot access candidates not assigned to you" 
        });
      }
      return next();
    }

    // EMPLOYEE can only access their own profile
    if (currentUser.role === "EMPLOYEE") {
      if (targetUserId.toString() !== currentUser._id.toString()) {
        return res.status(403).json({ 
          error: "Cannot access other employee profiles" 
        });
      }
      return next();
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkScope;