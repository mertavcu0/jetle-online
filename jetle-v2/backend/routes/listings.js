const express = require("express");
const Listing = require("../models/Listing");

const router = express.Router();

router.get("/", async function getAllListings(req, res, next) {
  try {
    const rows = await Listing.find().sort({ createdAt: -1 }).lean();
    res.json({ ok: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/", async function createListing(req, res, next) {
  try {
    const body = req.body || {};
    const doc = await Listing.create({
      title: body.title,
      price: body.price,
      category: body.category,
      city: body.city,
      description: body.description != null ? body.description : "",
      images: Array.isArray(body.images) ? body.images : [],
      status: body.status || "pending"
    });
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
