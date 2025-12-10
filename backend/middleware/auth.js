const jwt = require("jsonwebtoken");

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { userId, email, role }

      // If no role limit specified → allow all logged-in users
      if (allowedRoles.length === 0) return next();

      // Enforce role match
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
