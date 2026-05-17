const mongoose = require("mongoose");

const SLOT_VALUES = [
  "homepage_top",
  "homepage_grid",
  "homepage_footer",
  "listing_sidebar",
  "listing_inline",
  "detail_bottom"
];

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    link: { type: String, default: "", trim: true },
    slot: { type: String, enum: SLOT_VALUES, required: true, index: true },
    active: { type: Boolean, default: true, index: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Ad", adSchema);
module.exports.SLOT_VALUES = SLOT_VALUES;
