const mongoose = require("mongoose");
const User = require("../models/User");
const Listing = require("../models/Listing");

async function users(req, res) {
  try {
    var rows = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({
      ok: true,
      data: rows.map(function (u) {
        return {
          id: String(u._id),
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt
        };
      })
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Kullanıcı listesi alınamadı." });
  }
}

async function listings(req, res) {
  try {
    var rows = await Listing.find({}).sort({ createdAt: -1 }).lean();
    return res.json({
      ok: true,
      data: rows.map(formatListing)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "İlan listesi alınamadı." });
  }
}

async function approveListing(req, res) {
  return setStatus(req, res, "approved");
}

async function rejectListing(req, res) {
  return setStatus(req, res, "rejected");
}

async function setStatus(req, res, status) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ ok: false, message: "Geçersiz ilan kimliği." });
    }
    var listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status } },
      { new: true }
    ).lean();
    if (!listing) {
      return res.status(404).json({ ok: false, message: "İlan bulunamadı." });
    }
    return res.json({ ok: true, data: formatListing(listing) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "İlan güncellenemedi." });
  }
}

async function deleteListing(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ ok: false, message: "Geçersiz ilan kimliği." });
    }
    var result = await Listing.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ ok: false, message: "İlan bulunamadı." });
    }
    return res.json({ ok: true, message: "İlan silindi." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "İlan silinemedi." });
  }
}

function formatListing(o) {
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

module.exports = {
  users,
  listings,
  approveListing,
  rejectListing,
  deleteListing
};
