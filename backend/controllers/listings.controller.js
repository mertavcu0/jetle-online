const { ApiError } = require("../utils/ApiError");

const listingsService = require("../services/listings.service");

const { asyncHandler } = require("../utils/asyncHandler");



const list = asyncHandler(async function list(req, res) {

  var rows = await listingsService.allPublic(req.query || {});

  res.json({ ok: true, data: rows });

});



const detail = asyncHandler(async function detail(req, res, next) {

  var row = await listingsService.byIdForViewer(req.params.id, req.auth || null);

  if (!row) return next(new ApiError(404, "Listing not found"));

  res.json({ ok: true, data: row });

});



const create = asyncHandler(async function create(req, res) {

  var row = await listingsService.create(req.auth.userId, req.body || {}, req.auth);

  res.status(201).json({ ok: true, data: row });

});



const update = asyncHandler(async function update(req, res, next) {

  var row = await listingsService.update(req.params.id, req.body || {}, req.auth);

  if (!row) return next(new ApiError(404, "Listing not found"));

  res.json({ ok: true, data: row });

});



module.exports = { list, detail, create, update };


