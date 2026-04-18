const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const favoritesController = require("../controllers/favorites.controller");

const router = express.Router();

router.post("/:listingId", requireAuth, favoritesController.create);
router.delete("/:listingId", requireAuth, favoritesController.remove);

module.exports = { favoritesRouter: router };
