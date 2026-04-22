const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign(
    { userId: String(user._id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function register(req, res) {
  try {
    var name = String(req.body.name || "").trim();
    var email = String(req.body.email || "").trim().toLowerCase();
    var password = String(req.body.password || "");
    if (!name || !email || password.length < 8) {
      return res.status(400).json({
        ok: false,
        message: "Ad, e-posta ve en az 8 karakter şifre gerekli."
      });
    }
    var exists = await User.findOne({ email: email });
    if (exists) {
      return res.status(409).json({ ok: false, message: "Bu e-posta zaten kayıtlı." });
    }
    var hash = await bcrypt.hash(password, 10);
    var user = await User.create({
      name: name,
      email: email,
      password: hash,
      role: "user"
    });
    var token = signToken(user);
    return res.status(201).json({
      ok: true,
      data: {
        token: token,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Kayıt sırasında hata oluştu." });
  }
}

async function login(req, res) {
  try {
    var email = String(req.body.email || "").trim().toLowerCase();
    var password = String(req.body.password || "");
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "E-posta ve şifre gerekli." });
    }
    var user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return res.status(401).json({ ok: false, message: "E-posta veya şifre hatalı." });
    }
    var match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ ok: false, message: "E-posta veya şifre hatalı." });
    }
    var token = signToken(user);
    return res.json({
      ok: true,
      data: {
        token: token,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Giriş sırasında hata oluştu." });
  }
}

module.exports = { register, login };
