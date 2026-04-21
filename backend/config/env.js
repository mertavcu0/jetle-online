const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

function requiredEnv(name) {
  var val = process.env[name];
  if (val == null || String(val).trim() === "") {
    throw new Error("Missing " + name);
  }
  return String(val).trim();
}

function parseClientOrigins() {
  var raw = process.env.CLIENT_ORIGIN || "http://localhost:5500";
  return String(raw)
    .split(",")
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
}

var clientOrigins = parseClientOrigins();
if (!clientOrigins.length) clientOrigins = ["http://localhost:5500"];

/** JSON / urlencoded gövde boyutu; .env ile ayarlanır, üst sınır ile DoS riski azaltılır. */
function clampBodyLimit(raw, maxMb) {
  var fallback = "1mb";
  var s = String(raw == null ? "" : raw).trim();
  if (!s) s = fallback;
  if (!/^(\d+(?:\.\d+)?)\s*(kb|mb|gb)$/i.test(s)) return fallback;
  var m = s.match(/^(\d+(?:\.\d+)?)\s*(kb|mb|gb)$/i);
  var val = parseFloat(m[1]);
  var unit = m[2].toLowerCase();
  if (!Number.isFinite(val) || val <= 0) return fallback;
  var mb = unit === "gb" ? val * 1024 : unit === "mb" ? val : val / 1024;
  if (!Number.isFinite(mb) || mb <= 0) return fallback;
  if (mb > maxMb) return String(maxMb) + "mb";
  return s;
}

var mongoUri = process.env.MONGODB_URI;
if (mongoUri == null || String(mongoUri).trim() === "") {
  throw new Error("Missing MONGODB_URI");
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(requiredEnv("PORT")),
  MONGODB_URI: String(mongoUri).trim(),
  CLIENT_ORIGIN: clientOrigins[0],
  CLIENT_ORIGINS: clientOrigins,
  CORS_ORIGIN: clientOrigins.length === 1 ? clientOrigins[0] : clientOrigins,
  /** Varsayılan 5mb; en fazla 10mb (ör. JSON_LIMIT=10mb). */
  JSON_LIMIT: clampBodyLimit(process.env.JSON_LIMIT || "5mb", 10),
  MEDIA_BASE_URL: process.env.MEDIA_BASE_URL || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "change-this-in-production",
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "change-this-too",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "30d",
  REFRESH_COOKIE_NAME: process.env.REFRESH_COOKIE_NAME || "jetle_refresh",
  /** Kayıtta bu e-posta ile oluşan hesap otomatik admin olur (varsayılan: admin@jetle.online). */
  ADMIN_REGISTRATION_EMAIL: String(process.env.ADMIN_REGISTRATION_EMAIL || "admin@jetle.online")
    .trim()
    .toLowerCase()
};

module.exports = { env };
