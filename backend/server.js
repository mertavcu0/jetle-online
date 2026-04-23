const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

process.on("uncaughtException", function (err) {
  console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", function (err) {
  console.error("UNHANDLED PROMISE:", err);
});

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { env } = require("./config/env");
const { connectDb } = require("./config/db");
const { requestLogger } = require("./utils/logger");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { errorHandler } = require("./middleware/errorHandler");
const mediaService = require("./services/media.service");
const { Listing } = require("./models/Listing");
const User = require("./models/User");
const { requireAuth } = require("./middleware/requireAuth");
const { asyncHandler } = require("./utils/asyncHandler");
const { ApiError } = require("./utils/ApiError");
const apiRoutes = require("./routes");
if (typeof apiRoutes !== "function") {
  throw new Error("[jetle-api] ./routes must export Express Router (function), got: " + typeof apiRoutes);
}

const app = express();

// TRUST PROXY (Railway / reverse proxy)
app.set("trust proxy", 1);

/** CORS: canlı site + .env CLIENT_ORIGIN (virgülle çoklu). Statik barındırma URL’nizi buraya yazın. */
var corsAllowed = ["https://jetle.online", "https://www.jetle.online"].concat(
  Array.isArray(env.CLIENT_ORIGINS) ? env.CLIENT_ORIGINS : []
);
(function dedupeOrigins() {
  var seen = Object.create(null);
  corsAllowed = corsAllowed.filter(function (o) {
    var k = String(o || "").trim();
    if (!k || seen[k]) return false;
    seen[k] = true;
    return true;
  });
})();

app.use(
  cors({
    origin: corsAllowed,
    credentials: true
  })
);
app.options(/.*/, cors());
app.use(express.json({ limit: env.JSON_LIMIT || "10mb" }));

if (env.NODE_ENV !== "production") {
  console.log("[jetle-api] env ok | PORT=" + env.PORT + " | CORS origins=" + corsAllowed.length);
}

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
app.use(express.urlencoded({ extended: true, limit: env.JSON_LIMIT || "10mb" }));
app.use(requestLogger);
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300
  })
);

app.post(
  "/api/ilan",
  requireAuth,
  asyncHandler(async function postIlan(req, res) {
    var b = req.body || {};
    var title = String(b.title || "").trim();
    var description = String(b.description || "").trim();
    var category = String(b.category || "").trim();
    var city = String(b.city || "").trim();
    var price = Number(b.price);
    if (!title || title.length < 3) {
      throw new ApiError(400, "Başlık en az 3 karakter olmalıdır.");
    }
    if (!description || description.length < 10) {
      throw new ApiError(400, "Açıklama en az 10 karakter olmalıdır.");
    }
    if (!category) {
      throw new ApiError(400, "Kategori seçin.");
    }
    if (!city) {
      throw new ApiError(400, "Şehir seçin.");
    }
    if (!Number.isFinite(price) || price < 0) {
      throw new ApiError(400, "Geçerli bir fiyat girin.");
    }
    var user = await User.findById(req.auth.userId).lean();
    if (!user) {
      throw new ApiError(401, "Kullanıcı bulunamadı.");
    }
    var slug = category
      .toLowerCase()
      .replace(/[ıİğĞüÜşŞöÖçÇ]/g, function (ch) {
        var map = { ı: "i", İ: "i", ğ: "g", Ğ: "g", ü: "u", Ü: "u", ş: "s", Ş: "s", ö: "o", Ö: "o", ç: "c", Ç: "c" };
        return map[ch] || ch;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120);
    var doc = await Listing.create({
      ownerId: user._id,
      category: category,
      subcategory: category,
      categorySlug: slug || "genel",
      sellerName: user.fullName || user.email || "Kullanıcı",
      title: title,
      description: description,
      price: price,
      status: "pending",
      phone: user.phone || "",
      city: city,
      district: "",
      address: ""
    });
    res.status(201).json({
      ok: true,
      data: {
        id: String(doc._id),
        title: doc.title,
        status: doc.status,
        createdAt: doc.createdAt
      }
    });
  })
);

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "JETLE API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
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

app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "API working" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api", apiRoutes);
mediaService.ensureUploadDirs();

/** /admin → jetle-v2/admin.html (sayfa içi admin kontrolü ile korunur) */
app.get(["/admin", "/admin/"], (req, res) => {
  res.sendFile(path.resolve(__dirname, "../jetle-v2/admin.html"));
});

/** API yüklemeleri */
app.use("/uploads", express.static(path.join(__dirname, "uploads"), { fallthrough: false, maxAge: "7d" }));

// ROOT INDEX (static’ten önce — jetle-v2/index.html zorunlu)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../jetle-v2/index.html"));
});

app.get("/test", (req, res) => {
  res.send("TEST OK");
});

// STATIC — yalnızca jetle-v2 (public kökü yok; index burada)
app.use(express.static(path.join(__dirname, "../jetle-v2")));

app.use(notFoundHandler);
app.use(function logUnhandledApiError(err, req, res, next) {
  console.error("[jetle-api][error]", {
    method: req && req.method,
    path: req && req.originalUrl,
    status: err && err.statusCode ? err.statusCode : 500,
    message: err && err.message ? err.message : "Unknown error"
  });
  if (err && err.stack) {
    console.error(err.stack);
  }
  next(err);
});
app.use(errorHandler);

const PORT = env.PORT || Number(process.env.PORT) || 8080;

connectDb().catch(function onDbError(err) {
  console.error("[jetle-api] DB bağlantısı kurulamadı (sunucu dinlemeye devam ediyor):", err && err.message ? err.message : err);
  if (err && err.name) {
    console.error("[jetle-api][db] name:", err.name);
  }
  if (err && err.code) {
    console.error("[jetle-api][db] code:", err.code);
  }
  if (err && err.cause) {
    console.error("[jetle-api][db] cause:", err.cause);
  }
  if (err && err.stack) {
    console.error(err.stack);
  }
});

app.listen(PORT, "0.0.0.0", function () {
  if (env.NODE_ENV !== "production") {
    console.log("[jetle-api] listening on port", PORT);
  } else {
    console.log("[jetle-api] server started");
  }
});
