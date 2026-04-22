const express = require("express");
const adminController = require("../controllers/admin.controller");
const adminAdsController = require("../controllers/adminAds.controller");
const complaintsController = require("../controllers/complaints.controller");
const { adminOnly } = require("../middleware/adminOnly");

const router = express.Router();

router.use(adminOnly);

/** REST: /api/admin/users */
router.get("/users", adminController.users);

/** REST (tekil path): /api/admin/listing/:id — mevcut çoğul yollarla aynı işlev */
router.delete("/listing/:id", adminController.deleteListing);
router.put("/listing/:id/approve", adminController.approveListing);

router.get("/ads", adminAdsController.list);
router.post("/ads", adminAdsController.create);
router.put("/ads/:id", adminAdsController.update);
router.delete("/ads/:id", adminAdsController.remove);
router.patch("/ads/:id/toggle", adminAdsController.toggle);
router.get("/listings", adminController.listings);
router.patch("/listings/:id/approve", adminController.approveListing);
router.patch("/listings/:id/reject", adminController.rejectListing);
router.delete("/listings/:id", adminController.deleteListing);
router.patch("/listings/:id/doping", adminController.dopingListing);
router.get("/complaints", complaintsController.listForAdmin);
router.patch("/complaints/:id", complaintsController.updateForAdmin);

module.exports = { adminRouter: router };
