const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.post("/:listingId", auth, async (req, res) => {
  try {
    const listingId = String(req.params.listingId || "");
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ msg: "Geçersiz ilan id" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Kullanıcı bulunamadı" });

    const exists = (user.favorites || []).some((id) => String(id) === listingId);
    if (exists) {
      user.favorites = user.favorites.filter((id) => String(id) !== listingId);
    } else {
      user.favorites.push(listingId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ msg: "Kullanıcı bulunamadı" });
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
