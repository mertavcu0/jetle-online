const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AuthToken = require("../models/AuthToken");
const { ApiError } = require("../utils/ApiError");
const { hashToken, signAccessToken, signRefreshToken } = require("../utils/jwt");
const { env } = require("../config/env");

function sanitizeUser(userDoc) {
  return {
    id: String(userDoc._id),
    fullName: userDoc.fullName,
    email: userDoc.email,
    phone: userDoc.phone || "",
    city: userDoc.city || "",
    district: userDoc.district || "",
    role: userDoc.role,
    profileType: userDoc.profileType,
    isActive: !!userDoc.isActive,
    dopingCredits: typeof userDoc.dopingCredits === "number" ? userDoc.dopingCredits : 0,
    featuredSlots: typeof userDoc.featuredSlots === "number" ? userDoc.featuredSlots : 0,
    showcaseSlots: typeof userDoc.showcaseSlots === "number" ? userDoc.showcaseSlots : 0,
    bumpCredits: typeof userDoc.bumpCredits === "number" ? userDoc.bumpCredits : 0,
    extraListingSlots: typeof userDoc.extraListingSlots === "number" ? userDoc.extraListingSlots : 0,
    storePlan: userDoc.storePlan || "",
    storeActiveUntil: userDoc.storeActiveUntil || null,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt
  };
}

async function persistRefreshToken(userId, refreshToken) {
  var decodedExp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await AuthToken.create({
    userId: userId,
    tokenHash: hashToken(refreshToken),
    tokenType: "refresh",
    expiresAt: decodedExp
  });
}

async function buildTokenPair(userDoc) {
  const accessToken = signAccessToken(userDoc);
  const refreshToken = signRefreshToken(userDoc);
  await persistRefreshToken(userDoc._id, refreshToken);
  return {
    accessToken: accessToken,
    /** İstemciler `data.token` bekleyebilir — `accessToken` ile aynı JWT. */
    token: accessToken,
    refreshToken: refreshToken,
    tokenType: "Bearer",
    expiresInSec: 900,
    user: sanitizeUser(userDoc)
  };
}

function termsAcceptedOk(value) {
  return value === true || value === "true";
}

async function register(payload) {
  if (!termsAcceptedOk(payload && payload.termsAccepted)) {
    throw new ApiError(400, "Kullanıcı Sözleşmesi ve Gizlilik Politikası'nı kabul etmelisiniz.");
  }
  const email = String(payload.email || "").trim().toLowerCase();
  const exists = await User.findOne({ email: email }).select("_id");
  if (exists) throw new ApiError(409, "Bu e-posta ile kayıt var.");
  const passwordHash = await bcrypt.hash(String(payload.password), 10);
  var initialRole = email === env.ADMIN_REGISTRATION_EMAIL ? "admin" : "user";
  const doc = await User.create({
    fullName: String(payload.fullName || "").trim(),
    email: email,
    passwordHash: passwordHash,
    phone: String(payload.phone || "").trim(),
    city: String(payload.city || "").trim(),
    district: String(payload.district || "").trim(),
    role: initialRole,
    profileType: String(payload.profileType || "Bireysel").trim() || "Bireysel",
    isActive: true
  });
  return buildTokenPair(doc);
}

async function login(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  const user = await User.findOne({ email: email });
  if (!user) throw new ApiError(401, "E-posta veya şifre hatalı.");
  if (!user.isActive) throw new ApiError(403, "Hesap pasif.");
  const ok = await bcrypt.compare(String(payload.password || ""), String(user.passwordHash || ""));
  if (!ok) throw new ApiError(401, "E-posta veya şifre hatalı.");
  return buildTokenPair(user);
}

async function revokeRefreshToken(refreshToken) {
  if (!refreshToken) return;
  await AuthToken.updateOne(
    { tokenHash: hashToken(refreshToken), revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}

async function me(auth) {
  const user = await User.findById(auth.userId);
  if (!user) throw new ApiError(404, "Kullanıcı bulunamadı.");
  return sanitizeUser(user);
}

/**
 * Kendi profilini güncelle. Rol değişimi yalnızca admin tarafından (ileride ayrı endpoint) yapılabilir.
 */
async function updateMe(auth, patch) {
  const user = await User.findById(auth.userId);
  if (!user) throw new ApiError(404, "Kullanıcı bulunamadı.");
  if (patch.fullName != null) user.fullName = String(patch.fullName).trim().slice(0, 120);
  if (patch.phone != null) user.phone = String(patch.phone || "").trim().slice(0, 24);
  if (patch.city != null) user.city = String(patch.city || "").trim().slice(0, 80);
  if (patch.district != null) user.district = String(patch.district || "").trim().slice(0, 80);
  if (patch.profileType != null) {
    var pt = String(patch.profileType || "").trim();
    if (pt === "Bireysel" || pt === "Kurumsal") user.profileType = pt;
  }
  if (patch.role != null && auth.role === "admin") {
    var r = String(patch.role || "").trim();
    if (r === "user" || r === "store" || r === "admin") user.role = r;
  }
  await user.save();
  return sanitizeUser(user);
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000
  };
}

module.exports = {
  register,
  login,
  me,
  updateMe,
  revokeRefreshToken,
  refreshCookieOptions
};
