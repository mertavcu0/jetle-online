const mongoose = require("mongoose");

const mediaAssetSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    kind: { type: String, enum: ["image", "video"], required: true, index: true },
    originalUrl: { type: String, default: "" },
    mediumUrl: { type: String, default: "" },
    thumbUrl: { type: String, default: "" },
    url: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
    attached: { type: Boolean, default: false, index: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = {
  MediaAsset: mongoose.model("MediaAsset", mediaAssetSchema)
};
