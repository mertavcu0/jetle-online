const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  },
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
