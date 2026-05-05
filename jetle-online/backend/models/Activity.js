const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: {
    type: String,
    enum: ["login", "create_listing", "view_listing"],
    required: true
  },
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", ActivitySchema);
