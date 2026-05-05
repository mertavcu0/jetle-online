const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      populate: { path: "createdBy", select: "username email" },
    });

    res.json(user?.favorites || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ilan ID" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "İlan bulunamadı" });
    }

    const user = await User.findById(req.user._id);
    const exists = user.favorites.some((favoriteId) => String(favoriteId) === String(id));

    if (exists) {
      user.favorites = user.favorites.filter((favoriteId) => String(favoriteId) !== String(id));
    } else {
      user.favorites.push(id);
    }

    await user.save();

    res.json({
      success: true,
      favorited: !exists,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
