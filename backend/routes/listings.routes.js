const express = require("express");
const listingsController = require("../controllers/listings.controller");
const { requireAuth } = require("../middleware/requireAuth");
const { optionalAuth } = require("../middleware/optionalAuth");
const { requireOwnerOrAdmin } = require("../middleware/requireOwnerOrAdmin");
const { validateRequest } = require("../middleware/validateRequest");
const { listingWriteValidator } = require("../utils/validators");

const router = express.Router();

router.get("/", listingsController.list);
router.get("/:id", optionalAuth, listingsController.detail);
router.post("/", requireAuth, listingWriteValidator, validateRequest(), listingsController.create);
router.put("/:id", requireAuth, requireOwnerOrAdmin(), listingWriteValidator, validateRequest(), listingsController.update);

module.exports = { listingsRouter: router };
