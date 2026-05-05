const jwt = require("jsonwebtoken");
const User = require("../models/User");

/** Token varsa req.user doldurur; yoksa veya geçersizse 401 vermeden devam eder. */
module.exports = async function optionalAuth(req, res, next) {
  req.user = null;
  const authHeader = req.header("Authorization");
  if (!authHeader) return next();

  const token = authHeader.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("role isBanned");
    if (user && !user.isBanned) {
      req.user = { id: String(user._id), role: user.role || "user" };
    }
  } catch (e) {
    /* token geçersiz — anonim ilan */
  }
  next();
};
