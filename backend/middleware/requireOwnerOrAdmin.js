const { ApiError } = require("../utils/ApiError");
const { Listing } = require("../models/Listing");

function requireOwnerOrAdmin() {
  return async function ownerCheck(req, res, next) {
    try {
      var auth = req.auth || {};
      if (auth.role === "admin") return next();
      var listingId = req.params.id;
      if (!listingId) return next(new ApiError(400, "Listing id required"));
      var listing = await Listing.findById(listingId).select("_id ownerId");
      if (!listing) return next(new ApiError(404, "Listing not found"));
      if (String(listing.ownerId) !== String(auth.userId)) return next(new ApiError(403, "Forbidden"));
      req.listingOwnerId = String(listing.ownerId);
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { requireOwnerOrAdmin };
