const express = require("express");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const listingController = require("../controllers/listing.controller");
const adminController = require("../controllers/admin.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminOnly");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", authMiddleware, userController.me);

router.post("/listing", authMiddleware, listingController.create);
router.get("/listings", listingController.list);
router.get("/listing/:id", listingController.getById);

router.get("/admin/users", authMiddleware, adminOnly, adminController.users);
router.get("/admin/listings", authMiddleware, adminOnly, adminController.listings);
router.put("/admin/listing/:id/approve", authMiddleware, adminOnly, adminController.approveListing);
router.put("/admin/listing/:id/reject", authMiddleware, adminOnly, adminController.rejectListing);
router.delete("/admin/listing/:id", authMiddleware, adminOnly, adminController.deleteListing);

module.exports = router;
