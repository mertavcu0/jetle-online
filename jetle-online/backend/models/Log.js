const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Log", LogSchema);
