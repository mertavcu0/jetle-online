const mongoose = require("mongoose");
const User = require("../models/User");
const listingsService = require("../services/listings.service");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");

const listings = asyncHandler(async function listings(req, res) {
  var data = await listingsService.listAllForAdmin();
  res.json({ ok: true, data: data });
});

const approveListing = asyncHandler(async function approveListing(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, "Geçersiz ilan kimliği."));
  var row = await listingsService.setStatusByAdmin(req.params.id, "approved");
  if (!row) return next(new ApiError(404, "İlan bulunamadı."));
  res.json({ ok: true, data: row });
});

const rejectListing = asyncHandler(async function rejectListing(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, "Geçersiz ilan kimliği."));
  var row = await listingsService.setStatusByAdmin(req.params.id, "rejected");
  if (!row) return next(new ApiError(404, "İlan bulunamadı."));
  res.json({ ok: true, data: row });
});

const deleteListing = asyncHandler(async function deleteListing(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, "Geçersiz ilan kimliği."));
  var ok = await listingsService.deleteByAdmin(req.params.id);
  if (!ok) return next(new ApiError(404, "İlan bulunamadı."));
  res.json({ ok: true, message: "İlan silindi." });
});

function dopingListing(req, res) {
  res.json({ ok: true, data: { id: req.params.id, doping: req.body || {} } });
}

const users = asyncHandler(async function users(req, res) {
  var rows = await User.find({})
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean();
  var safe = rows.map(function (u) {
    return {
      id: String(u._id),
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      city: u.city,
      district: u.district,
      role: u.role,
      profileType: u.profileType,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      storePlan: u.storePlan,
      dopingCredits: u.dopingCredits,
      featuredSlots: u.featuredSlots,
      showcaseSlots: u.showcaseSlots
    };
  });
  res.json({ ok: true, data: safe });
});

module.exports = {
  listings,
  approveListing,
  rejectListing,
  deleteListing,
  dopingListing,
  users
};
