const mongoose = require("mongoose");
const Listing = require("../models/Listing");

async function create(req, res) {
  try {
    var title = String(req.body.title || "").trim();
    var price = Number(req.body.price);
    var city = String(req.body.city || "").trim();
    if (!title || !Number.isFinite(price) || price < 0 || !city) {
      return res.status(400).json({
        ok: false,
        message: "title, price ve city geçerli şekilde gerekli."
      });
    }
    var listing = await Listing.create({
      title: title,
      price: price,
      city: city,
      status: "pending",
      userId: req.user.userId
    });
    return res.status(201).json({
      ok: true,
      data: formatListing(listing)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "İlan oluşturulamadı." });
  }
}

async function list(req, res) {
  try {
    var q = { status: "approved" };
    var rows = await Listing.find(q).sort({ createdAt: -1 }).lean();
    return res.json({
      ok: true,
      data: rows.map(formatListingLean)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "İlanlar alınamadı." });
  }
}

async function getById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ ok: false, message: "Geçersiz ilan kimliği." });
    }
    var listing = await Listing.findById(req.params.id).lean();
    if (!listing) {
      return res.status(404).json({ ok: false, message: "İlan bulunamadı." });
 }
    if (listing.status !== "approved") {
      return res.status(404).json({ ok: false, message: "İlan bulunamadı veya yayında değil." });
    }
    return res.json({ ok: true, data: formatListingLean(listing) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "İlan alınamadı." });
  }
}

function formatListing(doc) {
  var o = doc.toObject ? doc.toObject() : doc;
  return formatListingLean(o);
}

function formatListingLean(o) {
  return {
    id: String(o._id),
    title: o.title,
    price: o.price,
    city: o.city,
    status: o.status,
    userId: String(o.userId),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt
  };
}

module.exports = { create, list, getById };
