const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  district: {
    type: String,
    default: "",
    trim: true,
  },
  brand: {
    type: String,
    default: "",
    trim: true,
  },
  model: {
    type: String,
    default: "",
    trim: true,
  },
  series: {
    type: String,
    default: "",
    trim: true,
  },
  year: {
    type: Number,
    min: 1980,
    max: 2025,
  },
  km: {
    type: Number,
    min: 0,
    max: 1000000,
  },
  fuel: {
    type: String,
    default: "",
    trim: true,
  },
  transmission: {
    type: String,
    default: "",
    trim: true,
  },
  power: {
    type: Number,
    min: 0,
  },
  engine: {
    type: String,
    default: "",
    trim: true,
  },
  color: {
    type: String,
    default: "",
    trim: true,
  },
  body: {
    type: String,
    default: "",
    trim: true,
  },
  bodyType: {
    type: String,
    default: "",
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "active", "passive"],
    default: "approved",
    index: true,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  image: {
    type: String,
    default: "https://picsum.photos/600/400",
  },
  images: {
    type: [String],
    default: [],
  },
  video: {
    type: String,
    default: "",
    trim: true,
  },
  features: {
    type: [String],
    default: [],
  },
  carParts: {
    type: Object,
    default: {},
  },
  specs: {
    type: Object,
    default: {},
  },
  isBoosted: {
    type: Boolean,
    default: false,
    index: true,
  },
  boostUntil: {
    type: Date,
    default: null,
    index: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Listing", ListingSchema);
