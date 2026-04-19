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

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

console.log(
  "[jetle-api] env loaded: PORT=" + (env.PORT ? "yes" : "no") + ", MONGODB_URI=" + (env.MONGODB_URI ? "yes" : "no")
);

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    originAgentCluster: false,
    referrerPolicy: false,
    hsts: false,
    noSniff: false,
    ieNoOpen: false,
    frameguard: false,
    permittedCrossDomainPolicies: false,
    hidePoweredBy: false,
    xssFilter: false,
    dnsPrefetchControl: false
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: env.JSON_LIMIT }));
app.use(requestLogger);
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300
  })
);

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "JETLE API" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  res.json({
    success: true,
    message: "login çalışıyor",
    email,
    token: "123abc"
  });
});

app.use("/api", apiRouter);
mediaService.ensureUploadDirs();
app.use("/uploads", express.static(path.resolve(__dirname, "uploads"), { fallthrough: false, maxAge: "7d" }));

app.use(express.static(path.resolve(__dirname, "../jetle-v2")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../jetle-v2/index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDb()
  .then(function onDbReady() {
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch(function onDbError(err) {
    console.error("[jetle-api] Veritabanı bağlantısı kurulamadı:", err && err.message ? err.message : err);
    if (err && err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  });
