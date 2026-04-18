const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const dashboardController = require("../controllers/dashboard.controller");
const { validateRequest } = require("../middleware/validateRequest");
const { profilePatchValidator, myListingStatusValidator } = require("../utils/validators");

const router = express.Router();

router.get("/listings", requireAuth, dashboardController.myListings);
router.patch("/listings/:id/status", requireAuth, myListingStatusValidator, validateRequest(), dashboardController.patchMyListingStatus);
router.delete("/listings/:id", requireAuth, dashboardController.deleteMyListing);
router.patch("/profile", requireAuth, profilePatchValidator, validateRequest(), dashboardController.patchProfile);
router.get("/favorites", requireAuth, dashboardController.myFavorites);
router.get("/messages", requireAuth, dashboardController.myMessages);
router.get("/packages", requireAuth, dashboardController.myPackages);

module.exports = { dashboardRouter: router };
