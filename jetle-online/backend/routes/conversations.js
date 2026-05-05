const router = require("express").Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    const conversations = {};

    messages.forEach((m) => {
      const other = m.sender._id.toString() === req.user.id
        ? m.receiver
        : m.sender;

      if (!conversations[other._id]) {
        conversations[other._id] = {
          user: other,
          lastMessage: m.text,
          time: m.createdAt
        };
      }
    });

    res.json(Object.values(conversations));
  } catch (err) {
    res.status(500).json({ error: "Server hatası" });
  }
});

module.exports = router;
