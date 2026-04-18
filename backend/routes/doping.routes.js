const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const packagesController = require("../controllers/packages.controller");

const router = express.Router();

router.post("/activate", requireAuth, packagesController.activateDoping);

module.exports = { dopingRouter: router };
