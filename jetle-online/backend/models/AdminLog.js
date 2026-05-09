const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  action: String,
  targetId: String,
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AdminLog", adminLogSchema);
