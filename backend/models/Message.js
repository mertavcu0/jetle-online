const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.index({ listing: 1, sender: 1, receiver: 1, createdAt: 1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, seen: 1 });

module.exports = mongoose.model("Message", MessageSchema);
