const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    var hdr = req.headers.authorization || "";
    var token = "";
    if (hdr.indexOf("Bearer ") === 0) token = hdr.slice(7).trim();
    if (!token) {
      return res.status(401).json({ ok: false, message: "Yetkilendirme gerekli." });
    }
    var secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ ok: false, message: "Sunucu yapılandırması eksik." });
    }
    var decoded = jwt.verify(token, secret);
    req.user = {
      userId: decoded.userId,
      role: decoded.role || "user"
    };
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, message: "Geçersiz veya süresi dolmuş token." });
  }
}

module.exports = { authMiddleware };
