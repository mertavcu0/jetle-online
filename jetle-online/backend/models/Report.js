const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", ReportSchema);
