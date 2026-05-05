const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function boostExpiryDate() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

async function clearExpiredBoosts() {
  await Listing.updateMany(
    { isBoosted: true, boostUntil: { $lte: new Date() } },
    { $set: { isBoosted: false, boostUntil: null } }
  );
}

router.post("/:listingId", authMiddleware, async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: "Geçersiz ilan ID" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "İlan bulunamadı" });
    }

    const isOwner = String(listing.createdBy) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Bu ilanı öne çıkarma yetkiniz yok" });
    }

    listing.isBoosted = true;
    listing.boostUntil = boostExpiryDate();
    await listing.save();

    res.json({
      success: true,
      listing,
      boostUntil: listing.boostUntil,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { boostRoutes: router, clearExpiredBoosts };
