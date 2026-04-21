const { ApiError } = require("../utils/ApiError");

function requireAdmin(req, res, next) {
  var role = (req.auth && req.auth.role) || (req.user && req.user.role) || "";
  if (String(role) !== "admin") return next(new ApiError(403, "Admin role required"));
  next();
}

module.exports = { requireAdmin };
