module.exports = function authAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (String(req.user.role || "").trim().toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};
