const jwt = require("jsonwebtoken");
const { getAccessTokenSecret } = require("../utils/jwt");

/**
 * Bearer doğrulama — `getAccessTokenSecret()` login’deki `jwt.sign` ile birebir aynı anahtar.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("VERIFY SECRET:", process.env.JWT_ACCESS_SECRET);
    console.log("TOKEN:", "(yok)");
    return res.status(401).json({ ok: false, message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  console.log("VERIFY SECRET:", process.env.JWT_ACCESS_SECRET);
  console.log("TOKEN:", token);

  try {
    const decoded = jwt.verify(token, getAccessTokenSecret());
    req.user = decoded;
    req.auth = {
      userId: String(decoded.sub),
      role: decoded.role || "user",
      email: decoded.email || ""
    };
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

module.exports = { requireAuth };
