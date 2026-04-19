const path = require("path");
const dotenv = require("dotenv");
const { resolveMongoDbUri } = require("./mongodbUri");

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

var resolvedMongo = resolveMongoDbUri();
if (!resolvedMongo) {
  throw new Error("Missing MONGODB_URI_PRODUCTION or MONGODB_URI");
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(requiredEnv("PORT")),
  MONGODB_URI: resolvedMongo,
  CLIENT_ORIGIN: clientOrigins[0],
  CLIENT_ORIGINS: clientOrigins,
  CORS_ORIGIN: clientOrigins.length === 1 ? clientOrigins[0] : clientOrigins,
  JSON_LIMIT: process.env.JSON_LIMIT || "5mb",
  MEDIA_BASE_URL: process.env.MEDIA_BASE_URL || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "change-this-in-production",
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "change-this-too",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "30d",
  REFRESH_COOKIE_NAME: process.env.REFRESH_COOKIE_NAME || "jetle_refresh"
};

module.exports = { env };
