const mongoose = require("mongoose");
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

function users(req, res) {
  res.json({ ok: true, data: [] });
}

module.exports = {
  listings,
  approveListing,
  rejectListing,
  deleteListing,
  dopingListing,
  users
};
