const { ApiError } = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  try {
    var hdr = req.headers.authorization || "";
    var token = "";
    if (hdr && hdr.indexOf("Bearer ") === 0) token = hdr.slice(7).trim();
    if (!token) return next(new ApiError(401, "Unauthorized"));
    var decoded = verifyAccessToken(token);
    req.auth = {
      userId: String(decoded.sub),
      role: decoded.role || "user",
      email: decoded.email || ""
    };
    return next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = { requireAuth };
