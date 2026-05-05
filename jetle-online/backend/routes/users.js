const express = require("express");
const User = require("../models/User");
const Listing = require("../models/Listing");

const router = express.Router();

router.get("/:id/favorites", async (req, res) => {
  try {
    const listings = await Listing.find({
      favorites: req.params.id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/listings", async (req, res) => {
  try {
    const listings = await Listing.find({
      user: req.params.id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const totalListings = await Listing.countDocuments({
      user: user._id,
      isDeleted: false
    });
    const activeListings = await Listing.countDocuments({
      user: user._id,
      isDeleted: false,
      isActive: true
    });

    res.json({
      ...user.toObject(),
      totalListings,
      activeListings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
