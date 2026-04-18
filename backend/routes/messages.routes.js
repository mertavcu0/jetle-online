const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const messagesController = require("../controllers/messages.controller");

const router = express.Router();

router.get("/", requireAuth, messagesController.list);
router.get("/:conversationId", requireAuth, messagesController.detail);
router.post("/", requireAuth, messagesController.create);

module.exports = { messagesRouter: router };
