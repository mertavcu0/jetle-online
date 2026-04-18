const mongoose = require("mongoose");

const authTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    tokenType: { type: String, enum: ["refresh"], default: "refresh" },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuthToken", authTokenSchema);
