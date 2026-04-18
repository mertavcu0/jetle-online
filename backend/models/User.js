const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 180 },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "", trim: true, maxlength: 24 },
    city: { type: String, default: "", trim: true, maxlength: 80 },
    district: { type: String, default: "", trim: true, maxlength: 80 },
    role: { type: String, enum: ["user", "admin", "store"], default: "user", index: true },
    profileType: { type: String, default: "Bireysel", trim: true, maxlength: 40 },
    isActive: { type: Boolean, default: true, index: true },
    /** Doping / vitrin hakları (satın alma sonrası artırılır) */
    dopingCredits: { type: Number, default: 0, min: 0 },
    featuredSlots: { type: Number, default: 0, min: 0 },
    showcaseSlots: { type: Number, default: 0, min: 0 },
    bumpCredits: { type: Number, default: 0, min: 0 },
    extraListingSlots: { type: Number, default: 0, min: 0 },
    storePlan: { type: String, default: "", trim: true, maxlength: 40 },
    storeActiveUntil: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
