const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = String(process.env.JWT_SECRET || "jetle-dev-secret").trim();

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = String(req.header("Authorization") || "").trim();

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(decoded.id).select("_id name email role banned isBanned");
    if (!user || user.banned || user.isBanned) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = {
      id: String(user._id),
      _id: String(user._id),
      name: user.name || "",
      email: user.email || "",
      role: user.role || decoded.role || "user"
    };

    next();
  } catch (err) {
    console.error("AUTH TOKEN ERROR:", err?.name || err?.message || err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
