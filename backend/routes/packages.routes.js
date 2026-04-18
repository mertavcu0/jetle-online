const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const packagesController = require("../controllers/packages.controller");

const router = express.Router();

router.get("/", packagesController.listPackages);
router.post("/activate", requireAuth, packagesController.activatePackage);

module.exports = { packagesRouter: router };
