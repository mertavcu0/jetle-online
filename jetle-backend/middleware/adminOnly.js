function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ ok: false, message: "Bu işlem için yönetici yetkisi gerekir." });
  }
  next();
}

module.exports = { adminOnly };
