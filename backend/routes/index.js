const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { validateRequest } = require("../middleware/validateRequest");
const { loginValidator } = require("../utils/validators");
const { listingsRouter } = require("./listings.routes");
const { favoritesRouter } = require("./favorites.routes");
const { messagesRouter } = require("./messages.routes");
const { complaintsRouter } = require("./complaints.routes");
const { adminRouter } = require("./admin.routes");
const { packagesRouter } = require("./packages.routes");
const { dopingRouter } = require("./doping.routes");
const { mediaRouter } = require("./media.routes");
const { adsPublicRouter } = require("./ads.routes");

/** Frontend uyumu: /api/login -> authController.login */
router.post("/login", loginValidator, validateRequest(), authController.login);
router.use("/listings", listingsRouter);
router.use("/favorites", favoritesRouter);
router.use("/messages", messagesRouter);
router.use("/complaints", complaintsRouter);
router.use("/admin", adminRouter);
router.use("/packages", packagesRouter);
router.use("/doping", dopingRouter);
router.use("/media", mediaRouter);
router.use("/ads", adsPublicRouter);

router.get("/test", (req, res) => {
  res.send("API OK");
});

module.exports = router;
