const { ApiError } = require("../utils/ApiError");

function requireAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== "admin") return next(new ApiError(403, "Admin role required"));
  next();
}

module.exports = { requireAdmin };
