const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  listingNo: {
    type: String,
    unique: true
  },
  title: String,
  description: String,
  desc: String,
  price: Number,
  views: {
    type: Number,
    default: 0
  },
  location: String,
  city: String,
  district: String,
  category: String,
  subCategory: String,
  brand: String,
  series: String,
  model: String,
  year: Number,
  km: Number,
  fuel: String,
  gear: String,
  transmission: String,
  bodyType: String,
  color: String,
  engine: String,
  engineSize: String,
  enginePower: String,
  damage: [String],
  kaput: String,
  tavan: String,
  bagaj: String,
  sag_on_camurluk: String,
  sol_on_camurluk: String,
  sag_on_kapi: String,
  sol_on_kapi: String,
  sag_arka_kapi: String,
  sol_arka_kapi: String,
  sellerType: String,
  image: {
    type: String,
    default: "https://picsum.photos/300/200",
  },
  images: {
    type: [String],
    default: [],
  },
  features: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  damageMap: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  featuredUntil: Date,
  isBoosted: {
    type: Boolean,
    default: false
  },
  boostUntil: {
    type: Date
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  isSuspicious: {
    type: Boolean,
    default: false,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Listing", ListingSchema);
