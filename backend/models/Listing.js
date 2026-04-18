const mongoose = require("mongoose");

const LISTING_STATUS = ["draft", "pending", "approved", "rejected", "passive"];

const listingSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** API yanıtında `userId` ile aynı anlam (sahip). */
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    subcategory: { type: String, required: true, trim: true, maxlength: 80, index: true },
    categorySlug: { type: String, default: "", trim: true, maxlength: 120, index: true },
    sellerName: { type: String, default: "", trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 8000 },
    price: { type: Number, required: true, min: 0 },
    status: { type: String, enum: LISTING_STATUS, default: "pending", index: true },
    phone: { type: String, default: "", trim: true, maxlength: 30 },
    city: { type: String, default: "", trim: true, maxlength: 80 },
    district: { type: String, default: "", trim: true, maxlength: 80 },
    address: { type: String, default: "", trim: true, maxlength: 400 },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    media: {
      images: [
        {
          assetId: { type: String, default: "" },
          originalUrl: { type: String, default: "" },
          mediumUrl: { type: String, default: "" },
          thumbUrl: { type: String, default: "" },
          isCover: { type: Boolean, default: false },
          order: { type: Number, default: 0 }
        }
      ],
      coverImage: { type: String, default: "" },
      video: {
        assetId: { type: String, default: "" },
        url: { type: String, default: "" },
        type: { type: String, default: "" },
        size: { type: Number, default: 0 }
      }
    },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    featured: { type: Boolean, default: false, index: true },
    showcase: { type: Boolean, default: false, index: true },
    urgent: { type: Boolean, default: false },
    highlight: { type: Boolean, default: false },
    featuredUntil: { type: Date, default: null },
    showcaseUntil: { type: Date, default: null }
  },
  { timestamps: true }
);

listingSchema.index({ ownerId: 1, updatedAt: -1 });
listingSchema.index({ status: 1, showcase: -1, featured: -1, createdAt: -1 });

module.exports = {
  Listing: mongoose.model("Listing", listingSchema),
  LISTING_STATUS
};
