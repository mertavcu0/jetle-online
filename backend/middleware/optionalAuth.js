const { verifyAccessToken } = require("../utils/jwt");

/**
 * Bearer varsa req.auth doldurur; yoksa devam eder (misafir).
 */
function optionalAuth(req, res, next) {
  try {
    var hdr = req.headers.authorization || "";
    var token = "";
    if (hdr && hdr.indexOf("Bearer ") === 0) token = hdr.slice(7).trim();
    if (!token) return next();
    var decoded = verifyAccessToken(token);
    req.auth = {
      userId: String(decoded.sub),
      role: decoded.role || "user",
      email: decoded.email || ""
    };
  } catch (err) {
    req.auth = null;
  }
  return next();
}

module.exports = { optionalAuth };

