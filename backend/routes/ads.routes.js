const express = require("express");
const adsPublicController = require("../controllers/ads.public.controller");

const router = express.Router();

router.get("/public", adsPublicController.listPublic);

module.exports = { adsPublicRouter: router };
