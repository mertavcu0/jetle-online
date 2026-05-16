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

    const safeEmail = String(normalizedEmail || "").trim().toLowerCase();

    if (!safeEmail || safeEmail.includes("$") || safeEmail.includes("{")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    const existing = await User.findOne({
      email: safeEmail
    }).lean(false);

    if (existing) {
      return res.status(400).json({ success: false, message: "Zaten kayıtlı" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: safeEmail,
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
    console.error("REGISTER ERROR REAL:", err);
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
    console.log("LOGIN ATTEMPT:", {
      email,
      hasPassword: Boolean(password),
      isProduction
    });

    if (!isValidEmail(email) || !password) {
      return res.status(401).json({
        success: false,
        message: "Hatalı giriş"
      });
    }

    const safeEmail = String(email || "").trim().toLowerCase();

    if (!safeEmail || safeEmail.includes("$") || safeEmail.includes("{")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    console.log("LOGIN STEP user_lookup_start:", { email: safeEmail });
    const user = await User.findOne({
      email: safeEmail
    }).lean(false);
    console.log("LOGIN STEP user_lookup_ok:", {
      found: Boolean(user),
      role: user?.role || null,
      banned: Boolean(user?.banned),
      hasPassword: Boolean(user?.password)
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
    const hasBcryptPassword = isBcryptHash(storedPassword);
    console.log("LOGIN STEP password_mode:", {
      hasBcryptPassword,
      storedLength: storedPassword.length
    });

    if (hasBcryptPassword) {
      try {
        ok = await bcrypt.compare(password, storedPassword);
        console.log("LOGIN STEP bcrypt_compare_ok:", { ok });
      } catch (compareErr) {
        console.error("LOGIN STEP bcrypt_compare_fail:", compareErr);
        throw compareErr;
      }
    }

    const isLegacyPlaintext = !hasBcryptPassword && password === storedPassword;

    if (!ok && isLegacyPlaintext) {
      ok = true;
      console.log("LOGIN STEP legacy_plaintext_upgrade_start:", { email: safeEmail });
      try {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        console.log("LOGIN STEP legacy_plaintext_upgrade_ok:", { email: safeEmail });
      } catch (upgradeErr) {
        console.error("LOGIN STEP legacy_plaintext_upgrade_fail:", upgradeErr);
        throw upgradeErr;
      }
    }

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Hatalı giriş"
      });
    }

    const jwtSecret = String(process.env.JWT_SECRET || "jetle-dev-secret").trim();
    if (!jwtSecret) {
      throw new Error("JWT_SECRET missing during login");
    }

    console.log("LOGIN STEP token_sign_start:", {
      userId: String(user._id),
      role: user.role || "user"
    });
    let token = "";
    try {
      token = jwt.sign(
        {
          id: String(user._id),
          role: user.role || "user"
        },
        jwtSecret,
        { expiresIn: "7d" }
      );
      console.log("LOGIN STEP token_sign_ok:", { tokenLength: token.length });
    } catch (tokenErr) {
      console.error("LOGIN STEP token_sign_fail:", tokenErr);
      throw tokenErr;
    }

    res.json({
      success: true,
      token,
      user: userResponse(user)
    });
  } catch (err) {
    console.error("LOGIN ERROR REAL:", err);
    console.error("LOGIN ERROR STACK:", err?.stack || "no_stack");
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
