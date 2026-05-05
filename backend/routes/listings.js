const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

// TEST İÇİN BASİT GET
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().limit(20);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
