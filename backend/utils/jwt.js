const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

/**
 * Access JWT imzalama ve doğrulama için tek kaynak (login + requireAuth + verifyAccessToken aynı değer).
 * `process.env.JWT_ACCESS_SECRET` .env ile set; yoksa `config/env.js` varsayılanı.
 */
function getAccessTokenSecret() {
  return env.JWT_ACCESS_SECRET;
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, email: user.email },
    getAccessTokenSecret(),
    { expiresIn: env.JWT_ACCESS_EXPIRES }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: String(user._id), type: "refresh" },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, getAccessTokenSecret());
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  hashToken,
  getAccessTokenSecret
};
