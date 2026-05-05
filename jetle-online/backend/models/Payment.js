const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  type: { type: String, enum: ["featured", "premium"], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
