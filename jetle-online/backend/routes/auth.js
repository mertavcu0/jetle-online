const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Zaten kayıtlı" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      city
    });

    await user.save();

    console.log("REGISTER OK");

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        city: user.city
      }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(400).json({ message: "Kullanıcı yok" });
    }

    console.log("USER FOUND:", user.email);

    if (user.banned) {
      return res.status(403).json({ message: "Hesabınız askıya alındı" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      console.log("WRONG PASSWORD");
      return res.status(400).json({ message: "Şifre yanlış" });
    }

    console.log("LOGIN SUCCESS");

    res.json({ success: true });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update", async (req, res) => {
  const { email, name, city } = req.body;

  const user = await User.findOneAndUpdate(
    { email },
    { name, city },
    { new: true }
  );

  res.json(user);
});

module.exports = router;
