const express = require("express");
const { authRouter } = require("./auth.routes");
const { listingsRouter } = require("./listings.routes");
const { dashboardRouter } = require("./dashboard.routes");
const { favoritesRouter } = require("./favorites.routes");
const { messagesRouter } = require("./messages.routes");
const { complaintsRouter } = require("./complaints.routes");
const { adminRouter } = require("./admin.routes");
const { packagesRouter } = require("./packages.routes");
const { dopingRouter } = require("./doping.routes");
const { mediaRouter } = require("./media.routes");
const { adsPublicRouter } = require("./ads.routes");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/listings", listingsRouter);
router.use("/me", dashboardRouter);
router.use("/favorites", favoritesRouter);
router.use("/messages", messagesRouter);
router.use("/complaints", complaintsRouter);
router.use("/admin", adminRouter);
router.use("/packages", packagesRouter);
router.use("/doping", dopingRouter);
router.use("/media", mediaRouter);
router.use("/ads", adsPublicRouter);

module.exports = { apiRouter: router };
