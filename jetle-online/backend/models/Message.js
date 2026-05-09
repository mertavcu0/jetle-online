const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    senderEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },
    receiverEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },
    conversationId: {
      type: String,
      trim: true,
      default: "",
      index: true
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    edited: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

messageSchema.index({ conversationId: 1, senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ listingId: 1, senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1, listingId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
