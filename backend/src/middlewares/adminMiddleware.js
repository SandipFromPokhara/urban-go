const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authorization required" });
    }

    // Allow both admin and superadmin to access admin routes
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAdmin;
