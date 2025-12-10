const User = require("../models/user");

/**
 * Check if user has required role
 * Uses role hierarchy: ADMIN > MANAGER > RECRUITER > EMPLOYEE
 */
const authorize = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Role hierarchy
      const roleHierarchy = {
        "MANAGEMENT_ADMIN": 4,
        "SENIOR_MANAGER": 3,
        "HR_RECRUITER": 2,
        "EMPLOYEE": 1
      };

      // Check if user has sufficient role
      if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
        return res.status(403).json({ 
          error: `Requires ${requiredRole} role or higher` 
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = authorize;