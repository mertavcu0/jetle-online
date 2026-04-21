const { ApiError } = require("../utils/ApiError");
const listingsService = require("../services/listings.service");

async function list(req, res) {
  try {
    var rows = await listingsService.allPublic(req.query || {});
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error("[listings][list]", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function detail(req, res, next) {
  try {
    var row = await listingsService.byIdForViewer(req.params.id, req.auth || null);
    if (!row) return next(new ApiError(404, "Listing not found"));
    res.json({ ok: true, data: row });
  } catch (err) {
    console.error("[listings][detail]", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function create(req, res) {
  try {
    var auth = req.auth || { role: "user" };
    var ownerId;
    if (req.auth && req.auth.userId) {
      ownerId = String(req.auth.userId);
    } else {
      ownerId = String(await listingsService.getOrCreateAnonymousListingOwnerId());
    }
    var row = await listingsService.create(ownerId, req.body || {}, auth);
    res.status(201).json({ ok: true, data: row });
  } catch (err) {
    console.error("[listings][create]", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function update(req, res, next) {
  try {
    var row = await listingsService.update(req.params.id, req.body || {}, req.auth);
    if (!row) return next(new ApiError(404, "Listing not found"));
    res.json({ ok: true, data: row });
  } catch (err) {
    console.error("[listings][update]", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { list, detail, create, update };
