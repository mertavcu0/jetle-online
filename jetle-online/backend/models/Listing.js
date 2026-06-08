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
  neighborhood: String,
  contactPhone: String,
  category: String,
  mainCategory: String,
  subCategory: String,
  housingType: String,
  estateType: String,
  estateListingIntent: String,
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
  m2: Number,
  unitPrice: Number,
  grossM2: Number,
  netM2: Number,
  rooms: String,
  age: Number,
  floor: String,
  totalFloors: Number,
  openAreaM2: Number,
  landShareM2: Number,
  sectionCount: Number,
  wcCount: Number,
  heatingType: String,
  kitchenType: String,
  elevator: String,
  parkingType: String,
  energyCertificate: String,
  residenceUsageStatus: String,
  usageStatus: String,
  isFurnished: String,
  isInSite: String,
  dues: Number,
  deposit: Number,
  residenceTitleDeedStatus: String,
  titleDeedStatus: String,
  balconyCount: Number,
  bathrooms: Number,
  facade: String,
  isMortgageEligible: String,
  isSwapEligible: String,
  zoningStatus: String,
  arsaStatus: String,
  kaks: String,
  gabari: String,
  adaNo: String,
  parselNo: String,
  paftaNo: String,
  roadFrontage: String,
  roadOpened: String,
  flatExchangeEligible: String,
  flatExchangeRatio: String,
  constructionFloorCount: Number,
  constructionRight: String,
  contractorOfferOpen: String,
  electricInfrastructure: String,
  waterInfrastructure: String,
  sewerageInfrastructure: String,
  naturalGasInfrastructure: String,
  parcelQueryLink: String,
  workplaceType: String,
  workplaceTitleDeedStatus: String,
  workplaceParking: String,
  workplaceElevator: String,
  workplaceGenerator: String,
  usageSuitability: String,
  showcaseMeters: Number,
  videoUrl: String,
  image: {
    type: String,
    default: "",
  },
  coverImage: {
    type: String,
    default: "",
  },
  mainImage: {
    type: String,
    default: "",
  },
  images: {
    type: [String],
    default: [],
  },
  gallery: {
    type: [String],
    default: [],
  },
  photos: {
    type: [String],
    default: [],
  },
  imagePublicIds: {
    type: [String],
    default: [],
  },
  uploadProvider: {
    type: String,
    default: "local",
  },
  features: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  damageMap: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  approved: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "active", "rejected"],
    default: "pending",
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isShowcase: {
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

ListingSchema.index({ status: 1, isDeleted: 1 });
ListingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Listing", ListingSchema);
