const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isProduction = process.env.NODE_ENV === "production";

function sanitizeText(value, maxLength = 120) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

router.post("/register", async (req, res) => {
  try {
    const name = sanitizeText(req.body?.name, 80);
    const city = sanitizeText(req.body?.city, 80);
    const password = String(req.body?.password || "");
    const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();

    if (!name || !isValidEmail(normalizedEmail) || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz kayıt bilgisi"
      });
    }

    const existing = await User.findOne({
      email: { $regex: `^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
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
      role: "user"
    });

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role
      }
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

    const safeEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({
      email: { $regex: `^${safeEmail}$`, $options: "i" }
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
    try {
      ok = await bcrypt.compare(password, user.password);
    } catch (compareErr) {
      if (isProduction) {
        throw compareErr;
      }
    }

    if (!ok && !isProduction && password === user.password) {
      ok = true;
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
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role || "user"
      }
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

router.post("/update", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const name = sanitizeText(req.body?.name, 80);
  const city = sanitizeText(req.body?.city, 80);

  if (!isValidEmail(email) || !name) {
    return res.status(400).json({ success: false, message: "Geçersiz bilgi" });
  }

  const user = await User.findOneAndUpdate(
    { email },
    { name, city },
    { new: true }
  );

  res.json(user);
});

module.exports = router;
