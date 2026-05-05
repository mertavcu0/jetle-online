const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function userPayload(user) {
  return {
    id: user._id,
    name: user.username,
    username: user.username,
    email: user.email,
    role: user.role,
    isBanned: user.isBanned,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const userName = username || name;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunlu" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Bu e-posta zaten kayıtlı" });
    }

    const user = await User.create({ username: userName, email, password });
    const token = createToken(user);

    res.status(201).json({
      token,
      user: userPayload(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-posta ve şifre zorunlu" });
    }

    const user = await User.findOne({ email });
    if (user?.isBanned) {
      return res.status(403).json({ message: "Hesabınız askıya alınmış" });
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "E-posta veya şifre hatalı" });
    }

    const token = createToken(user);

    res.json({
      token,
      user: userPayload(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Yeni şifre en az 6 karakter olmalı" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    user.password = password;
    await user.save();

    res.json({ success: true, message: "Şifre güncellendi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
