const express = require("express");
const complaintsController = require("../controllers/complaints.controller");
const { requireAuth } = require("../middleware/requireAuth");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/", requireAuth, complaintsController.create);
router.get("/admin", requireAuth, requireAdmin, complaintsController.listForAdmin);
router.patch("/admin/:id", requireAuth, requireAdmin, complaintsController.updateForAdmin);

module.exports = { complaintsRouter: router };
