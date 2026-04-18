const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { env } = require("./config/env");
const { connectDb } = require("./config/db");
const { requestLogger } = require("./utils/logger");
const { apiRouter } = require("./routes");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { errorHandler } = require("./middleware/errorHandler");
const mediaService = require("./services/media.service");

const app = express();

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "JETLE API" });
});

const isProduction = process.env.NODE_ENV === "production";
const corsAllowedOrigins = isProduction
  ? ["https://jetle.online", "https://www.jetle.online"]
  : [
      "http://localhost:3000",
      "http://localhost:5500",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5500"
    ];

console.log(
  "[jetle-api] env loaded: PORT=" + (env.PORT ? "yes" : "no") + ", MONGODB_URI=" + (env.MONGODB_URI ? "yes" : "no")
);

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(
  cors({
    origin: function corsOrigin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (corsAllowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json({ limit: env.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.JSON_LIMIT }));
app.use(requestLogger);
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300
  })
);

app.get("/", function root(req, res) {
  res.json({
    ok: true,
    service: "JETLE API",
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "JETLE API" });
});

app.use("/api", apiRouter);
mediaService.ensureUploadDirs();
app.use("/uploads", express.static(path.resolve(__dirname, "uploads"), { fallthrough: false, maxAge: "7d" }));
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDb()
  .then(function onDbReady() {
    app.listen(PORT, function onListen() {
      console.log("Server çalışıyor:", PORT);
    });
  })
  .catch(function onDbError(err) {
    console.error("[jetle-api] Veritabanı bağlantısı kurulamadı:", err && err.message ? err.message : err);
    if (err && err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  });
