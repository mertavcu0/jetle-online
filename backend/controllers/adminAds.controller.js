const mongoose = require("mongoose");
const adsService = require("../services/ads.service");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");

const list = asyncHandler(async function list(req, res) {
  var data = await adsService.listAllAdmin();
  res.json({ ok: true, data: data });
});

const create = asyncHandler(async function create(req, res) {
  var row = await adsService.createAdmin(req.body || {});
  res.status(201).json({ ok: true, data: row });
});

const update = asyncHandler(async function update(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, "Geçersiz kimlik."));
  var row = await adsService.updateAdmin(req.params.id, req.body || {});
  if (!row) return next(new ApiError(404, "Reklam bulunamadı."));
  res.json({ ok: true, data: row });
});

const remove = asyncHandler(async function remove(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, "Geçersiz kimlik."));
  var ok = await adsService.removeAdmin(req.params.id);
  if (!ok) return next(new ApiError(404, "Reklam bulunamadı."));
  res.json({ ok: true, message: "Silindi." });
});

const toggle = asyncHandler(async function toggle(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, "Geçersiz kimlik."));
  var row = await adsService.toggleAdmin(req.params.id);
  if (!row) return next(new ApiError(404, "Reklam bulunamadı."));
  res.json({ ok: true, data: row });
});

module.exports = { list, create, update, remove, toggle };
