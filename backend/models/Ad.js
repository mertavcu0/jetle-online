const mongoose = require("mongoose");

const PLACEMENT_TYPES = ["hero", "featured_strip", "sidebar", "inline_card", "footer_banner"];

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subtitle: { type: String, default: "", trim: true, maxlength: 300 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    imageUrl: { type: String, required: true, trim: true, maxlength: 2000 },
    mobileImageUrl: { type: String, default: "", trim: true, maxlength: 2000 },
    ctaText: { type: String, default: "İncele", trim: true, maxlength: 80 },
    targetUrl: { type: String, required: true, trim: true, maxlength: 2000 },
    placementType: { type: String, enum: PLACEMENT_TYPES, required: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    sponsorLabel: { type: String, default: "Sponsorlu", trim: true, maxlength: 40 },
    backgroundTone: { type: String, default: "neutral", trim: true, maxlength: 40 }
  },
  { timestamps: true }
);

adSchema.index({ placementType: 1, isActive: 1, order: 1 });

module.exports = {
  Ad: mongoose.model("Ad", adSchema),
  PLACEMENT_TYPES
};
