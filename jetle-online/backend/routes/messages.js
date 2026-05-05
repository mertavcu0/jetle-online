const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

function normalizeMessage(item) {
  return {
    ...item,
    sender: item.sender || item.from,
    receiver: item.receiver || item.to,
    message: item.message || item.text
  };
}

// POST /api/messages
router.post("/", async (req, res) => {
  try {
    const {
      sender,
      receiver,
      listingId,
      message,
      from,
      to,
      text,
      fromEmail,
      toId
    } = req.body;

    const finalSender = sender || from || fromEmail;
    const finalReceiver = receiver || to || toId;
    const finalMessage = message || text;

    if (!finalSender || !finalReceiver || !finalMessage) {
      return res.status(400).json({ error: "Eksik mesaj bilgisi" });
    }

    const saved = await Message.create({
      sender: finalSender,
      receiver: finalReceiver,
      listingId,
      message: finalMessage
    });

    res.json({ success: true, message: saved });
  } catch (err) {
    console.error("MESSAGE CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.query.email || req.query.userId;

    if (!userId) {
      return res.json([]);
    }

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
        { from: userId },
        { to: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("listingId", "title price city image images")
      .lean();

    res.json(messages.map(normalizeMessage));
  } catch (err) {
    console.error("MESSAGE LIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages/:userId
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
        { from: userId },
        { to: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("listingId", "title price city image images")
      .lean();

    res.json(messages.map(normalizeMessage));
  } catch (err) {
    console.error("MESSAGE LIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
