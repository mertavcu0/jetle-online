const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  type: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
