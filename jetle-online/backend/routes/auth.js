const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const isProduction = process.env.NODE_ENV === "production";

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$/.test(String(value || ""));
}

function sanitizeText(value, maxLength = 120) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizePhone(value) {
  return String(value || "")
    .replace(/[^\d+\s()-]/g, "")
    .trim()
    .slice(0, 24);
}

function sanitizeUsername(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}._-]/gu, "")
    .trim()
    .slice(0, 40);
}

function userResponse(user) {
  return {
    id: user._id,
    _id: user._id,
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    city: user.city || "",
    district: user.district || "",
    phone: user.phone || "",
    role: user.role || "user",
    isVerified: Boolean(user.isVerified),
    verifiedBadge: Boolean(user.verifiedBadge)
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

router.post("/register", async (req, res) => {
  try {
    const name = sanitizeText(req.body?.name, 80);
    const city = sanitizeText(req.body?.city, 80);
    const district = sanitizeText(req.body?.district, 80);
    const username = sanitizeUsername(req.body?.username);
    const phone = sanitizePhone(req.body?.phone);
    const password = String(req.body?.password || "");
    const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();

    if (!name || !isValidEmail(normalizedEmail) || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz kayıt bilgisi"
      });
    }

    const existing = await User.findOne({
      email: normalizedEmail
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Zaten kayıtlı" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: normalizedEmail,
      password: hashed,
      city,
      district,
      username,
      phone,
      role: "user"
    });

    await user.save();

    res.json({
      success: true,
      user: userResponse(user)
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!isValidEmail(email) || !password) {
      return res.status(401).json({
        success: false,
        message: "Hatalı giriş"
      });
    }

    const user = await User.findOne({
      email
    });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Hatalı giriş"
      });
    }

    if (user.banned) {
      return res.status(403).json({
        success: false,
        message: "Hesabınız askıya alındı"
      });
    }

    let ok = false;
    const storedPassword = String(user.password || "");
    try {
      ok = await bcrypt.compare(password, storedPassword);
    } catch (compareErr) {
      if (isProduction || isBcryptHash(storedPassword)) {
        throw compareErr;
      }
    }

    const isLegacyPlaintext = !isBcryptHash(storedPassword) && password === storedPassword;

    if (!ok && isLegacyPlaintext) {
      ok = true;
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Hatalı giriş"
      });
    }

    const jwtSecret = String(process.env.JWT_SECRET || "jetle-dev-secret").trim();
    const token = jwt.sign(
      {
        id: String(user._id),
        role: user.role || "user"
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: userResponse(user)
    });
  } catch (err) {
    console.error("LOGIN ERROR REAL:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.post("/update", authMiddleware, async (req, res) => {
  try {
    const name = sanitizeText(req.body?.name, 80);
    const city = sanitizeText(req.body?.city, 80);
    const district = sanitizeText(req.body?.district, 80);
    const username = sanitizeUsername(req.body?.username);
    const phone = sanitizePhone(req.body?.phone);
    const requestedEmail = String(req.body?.email || "").trim().toLowerCase();
    const userId = String(req.user?.id || req.user?._id || "").trim();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Yetkisiz işlem" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    if (requestedEmail && requestedEmail !== String(user.email || "").trim().toLowerCase()) {
      return res.status(400).json({ success: false, message: "E-posta değişikliği şu anda kapalı" });
    }

    if (name) user.name = name;
    if (city) user.city = city;
    if (district) user.district = district;
    if (username) user.username = username;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      user: userResponse(user)
    });
  } catch (err) {
    console.error("AUTH UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

module.exports = router;
