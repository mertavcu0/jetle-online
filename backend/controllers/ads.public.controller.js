const adsService = require("../services/ads.service");
const { asyncHandler } = require("../utils/asyncHandler");

/**
 * Genel reklam listesi. İleride ücretli satış için: impression/click sayaçları ayrı koleksiyonda
 * tutulabilir; burada yalnızca yaratıcı içerik döner (ör. POST /api/ads/:id/click ayrı uç).
 */
const listPublic = asyncHandler(async function listPublic(req, res) {
  var placement = req.query.placementType ? String(req.query.placementType).trim() : "";
  var data = await adsService.listPublic(placement || null);
  res.json({ ok: true, data: data });
});

module.exports = { listPublic };
