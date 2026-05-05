const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token" });
  }

  // "Bearer TOKEN" -> TOKEN ayir
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Invalid token format" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("role isBanned");

    if (!user) {
      return res.status(401).json({ msg: "Kullanıcı bulunamadı" });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: "Hesap banlandı" });
    }

    req.user = {
      id: String(user._id),
      role: user.role || decoded.role || "user",
    };
    next();
  } catch (e) {
    return res.status(401).json({ msg: "invalid token" });
  }
};
