const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Listing = require("../models/Listing");
const authMiddleware = require("../middleware/auth");
const isProduction = process.env.NODE_ENV === "production";

const router = express.Router();

function isAllowedUser(req, id) {
  const userId = String(req.user?.id || req.user?._id || "");
  return req.user?.role === "admin" || userId === String(id || "");
}

router.use(authMiddleware);

router.param("id", (req, res, next, value) => {
  if (!mongoose.Types.ObjectId.isValid(String(value || ""))) {
    return res.status(400).json({ error: "invalid_id" });
  }
  next();
});

router.get("/:id/favorites", async (req, res) => {
  try {
    if (!isAllowedUser(req, req.params.id)) {
      return res.status(403).json({ error: "forbidden" });
    }

    const user = await User.findById(req.params.id).populate({
      path: "favorites",
      match: { isDeleted: false }
    });

    res.json(Array.isArray(user?.favorites) ? user.favorites : []);
  } catch (err) {
    res.status(500).json({
      error: "server_error",
      ...(isProduction ? {} : { debugError: err.message })
    });
  }
});

router.get("/:id/listings", async (req, res) => {
  try {
    if (!isAllowedUser(req, req.params.id)) {
      return res.status(403).json({ error: "forbidden" });
    }

    const listings = await Listing.find({
      user: req.params.id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({
      error: "server_error",
      ...(isProduction ? {} : { debugError: err.message })
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!isAllowedUser(req, req.params.id)) {
      return res.status(403).json({ error: "forbidden" });
    }

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
    res.status(500).json({
      error: "server_error",
      ...(isProduction ? {} : { debugError: err.message })
    });
  }
});

module.exports = router;
