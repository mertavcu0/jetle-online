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
const { Listing } = require("./models/Listing");
const User = require("./models/User");
const { requireAuth } = require("./middleware/requireAuth");
const { asyncHandler } = require("./utils/asyncHandler");
const { ApiError } = require("./utils/ApiError");

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
