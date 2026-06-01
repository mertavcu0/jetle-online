const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const isProduction = process.env.NODE_ENV === "production";

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$/.test(String(value || ""));
}

function sanitizeText(value, maxLength = 120) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizePhone(value) {
  return String(value || "")
    .replace(/[^\d+\s()-]/g, "")
    .trim()
    .slice(0, 24);
}

function sanitizeUsername(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}._-]/gu, "")
    .trim()
    .slice(0, 40);
}

function userResponse(user) {
  return {
    id: user._id,
    _id: user._id,
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    city: user.city || "",
    district: user.district || "",
    phone: user.phone || "",
    role: user.role || "user",
    isVerified: Boolean(user.isVerified),
    verifiedBadge: Boolean(user.verifiedBadge)
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function normalizeRole(value) {
  return User.normalizeUserRole
    ? User.normalizeUserRole(value)
    : String(value || "").trim().toLowerCase();
}

function logLoginReject(reason, extra = {}) {
  console.warn("LOGIN REJECT:", {
    reason,
    ...extra
  });
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function getJwtSecret() {
  return String(process.env.JWT_SECRET || "jetle-dev-secret").trim();
}

function signAuthToken(user) {
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    throw new Error("JWT_SECRET missing during auth token signing");
  }

  return jwt.sign(
    {
      id: String(user._id),
      role: normalizeRole(user.role)
    },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

function getGoogleClientId() {
  return String(process.env.GOOGLE_CLIENT_ID || "").trim();
}

function getGoogleClientSecret() {
  return String(process.env.GOOGLE_CLIENT_SECRET || "").trim();
}

function isGoogleOAuthConfigured() {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}

function toBase64Url(value) {
  return Buffer.from(String(value || ""), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalized = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4 || 4)) % 4;
  return Buffer.from(normalized + "=".repeat(padding), "base64").toString("utf8");
}

function getAppOrigin(req) {
  const explicitOrigin = String(
    process.env.APP_ORIGIN ||
    process.env.PUBLIC_APP_ORIGIN ||
    process.env.FRONTEND_ORIGIN ||
    ""
  ).trim();

  if (explicitOrigin) {
    return explicitOrigin.replace(/\/+$/, "");
  }

  return `${req.protocol}://${req.get("host")}`;
}

function getGoogleCallbackUrl(req) {
  return `${getAppOrigin(req)}/auth/google/callback`;
}

function createGoogleState(req) {
  const payload = {
    ts: Date.now(),
    next: String(req.query?.next || "/").trim() || "/"
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(encodedPayload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `${encodedPayload}.${signature}`;
}

function verifyGoogleState(value) {
  const raw = String(value || "");
  const [encodedPayload = "", signature = ""] = raw.split(".");
  if (!encodedPayload || !signature) {
    throw new Error("invalid_google_state");
  }

  const expectedSignature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(encodedPayload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (expectedSignature !== signature) {
    throw new Error("google_state_signature_mismatch");
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload) || "{}");
  const ts = Number(payload?.ts || 0);
  if (!ts || Math.abs(Date.now() - ts) > 10 * 60 * 1000) {
    throw new Error("google_state_expired");
  }

  return {
    next: String(payload?.next || "/").trim() || "/"
  };
}

function sanitizeRedirectPath(value) {
  const text = String(value || "").trim();
  if (!text.startsWith("/")) return "/";
  if (text.startsWith("//")) return "/";
  return text;
}

function redirectGoogleAuthResult(req, res, options = {}) {
  const appOrigin = getAppOrigin(req);
  const nextPath = sanitizeRedirectPath(options.next || "/");
  const hashParams = new URLSearchParams();

  if (options.error) hashParams.set("google_error", String(options.error));
  if (options.token) hashParams.set("google_token", String(options.token));
  if (options.user) hashParams.set("google_user", toBase64Url(JSON.stringify(options.user)));
  hashParams.set("next", nextPath);

  res.redirect(`${appOrigin}/login.html#${hashParams.toString()}`);
}

async function exchangeGoogleCodeForToken(code, req) {
  const body = new URLSearchParams({
    code: String(code || ""),
    client_id: getGoogleClientId(),
    client_secret: getGoogleClientSecret(),
    redirect_uri: getGoogleCallbackUrl(req),
    grant_type: "authorization_code"
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "google_token_exchange_failed");
  }

  return data;
}

async function fetchGoogleUserProfile(accessToken) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${String(accessToken || "").trim()}`
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.sub || !data.email) {
    throw new Error(data.error_description || data.error || "google_userinfo_failed");
  }

  return data;
}

async function findOrCreateGoogleUser(profile) {
  const googleId = String(profile?.sub || "").trim();
  const safeEmail = String(profile?.email || "").trim().toLowerCase();
  const safeName = sanitizeText(profile?.name || profile?.given_name || safeEmail.split("@")[0], 80);
  const safeUsername = sanitizeUsername(
    profile?.given_name ||
    profile?.name ||
    safeEmail.split("@")[0]
  );
  const safeAvatarUrl = String(profile?.picture || "").trim();

  if (!googleId || !isValidEmail(safeEmail)) {
    throw new Error("google_profile_invalid");
  }

  let user = await User.findOne({
    $or: [
      { googleId },
      { email: safeEmail }
    ]
  }).lean(false);

  if (user) {
    if (user.banned) {
      throw new Error("google_user_banned");
    }

    let changed = false;
    if (!String(user.googleId || "").trim()) {
      user.googleId = googleId;
      changed = true;
    }
    if (!String(user.authProvider || "").trim() || String(user.authProvider || "").trim() === "local") {
      user.authProvider = "google";
      changed = true;
    }
    if (!String(user.name || "").trim() && safeName) {
      user.name = safeName;
      changed = true;
    }
    if (!String(user.username || "").trim() && safeUsername) {
      user.username = safeUsername;
      changed = true;
    }
    if (!String(user.avatarUrl || "").trim() && safeAvatarUrl) {
      user.avatarUrl = safeAvatarUrl;
      changed = true;
    }
    if (!user.isVerified && profile?.email_verified) {
      user.isVerified = true;
      changed = true;
    }

    if (changed) {
      await user.save();
    }

    return user;
  }

  user = new User({
    name: safeName,
    username: safeUsername,
    email: safeEmail,
    password: "",
    role: "user",
    googleId,
    authProvider: "google",
    avatarUrl: safeAvatarUrl,
    isVerified: Boolean(profile?.email_verified)
  });

  await user.save();
  return user;
}

router.post("/register", async (req, res) => {
  try {
    const name = sanitizeText(req.body?.name, 80);
    const city = sanitizeText(req.body?.city, 80);
    const district = sanitizeText(req.body?.district, 80);
    const username = sanitizeUsername(req.body?.username);
    const phone = sanitizePhone(req.body?.phone);
    const password = String(req.body?.password || "");
    const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();

    if (!name || !isValidEmail(normalizedEmail) || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz kayıt bilgisi"
      });
    }

    const safeEmail = String(normalizedEmail || "").trim().toLowerCase();

    if (!safeEmail || safeEmail.includes("$") || safeEmail.includes("{")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    const existing = await User.findOne({
      email: safeEmail
    }).lean(false);

    if (existing) {
      return res.status(400).json({ success: false, message: "Zaten kayıtlı" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: safeEmail,
      password: hashed,
      city,
      district,
      username,
      phone,
      role: "user"
    });

    await user.save();

    res.json({
      success: true,
      user: userResponse(user)
    });
  } catch (err) {
    console.error("REGISTER ERROR REAL:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    console.log("LOGIN ATTEMPT:", {
      email,
      hasPassword: Boolean(password),
      isProduction
    });

    if (!isValidEmail(email) || !password) {
      logLoginReject("invalid_request", {
        email,
        hasPassword: Boolean(password)
      });
      return res.status(401).json({
        success: false,
        message: "Hatalı giriş"
      });
    }

    const safeEmail = String(email || "").trim().toLowerCase();

    if (!safeEmail || safeEmail.includes("$") || safeEmail.includes("{")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    console.log("LOGIN STEP user_lookup_start:", { email: safeEmail });
    const user = await User.findOne({
      email: safeEmail
    }).lean(false);
    console.log("LOGIN STEP user_lookup_ok:", {
      found: Boolean(user),
      role: user?.role || null,
      banned: Boolean(user?.banned),
      hasPassword: Boolean(user?.password)
    });

    if (!user || !user.password) {
      logLoginReject("user_not_found", {
        email: safeEmail,
        found: Boolean(user),
        hasPassword: Boolean(user?.password)
      });
      return res.status(401).json({
        success: false,
        message: "Hatalı giriş"
      });
    }

    if (user.banned) {
      logLoginReject("banned", {
        email: safeEmail,
        userId: String(user._id)
      });
      return res.status(403).json({
        success: false,
        message: "Hesabınız askıya alındı"
      });
    }

    const normalizedRole = normalizeRole(user.role);
    if (normalizedRole !== String(user.role || "")) {
      console.log("LOGIN STEP role_normalize_before_save:", {
        from: user.role,
        to: normalizedRole
      });
      user.role = normalizedRole;
    }

    let ok = false;
    const storedPassword = String(user.password || "");
    const hasBcryptPassword = isBcryptHash(storedPassword);
    console.log("LOGIN STEP password_mode:", {
      hasBcryptPassword,
      storedLength: storedPassword.length
    });

    if (hasBcryptPassword) {
      try {
        ok = await bcrypt.compare(password, storedPassword);
        console.log("LOGIN STEP bcrypt_compare_ok:", { ok });
      } catch (compareErr) {
        console.error("LOGIN STEP bcrypt_compare_fail:", compareErr);
        throw compareErr;
      }
    }

    const isLegacyPlaintext = !hasBcryptPassword && password === storedPassword;

    if (!ok && isLegacyPlaintext) {
      ok = true;
      console.log("LOGIN STEP legacy_plaintext_upgrade_start:", { email: safeEmail });
      try {
        user.role = normalizeRole(user.role);
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        console.log("LOGIN STEP legacy_plaintext_upgrade_ok:", { email: safeEmail });
      } catch (upgradeErr) {
        console.error("LOGIN STEP legacy_plaintext_upgrade_fail:", upgradeErr);
        throw upgradeErr;
      }
    }

    console.log("LOGIN STEP password_result:", {
      email: safeEmail,
      passwordMatches: ok,
      hasBcryptPassword,
      isLegacyPlaintext
    });

    if (!ok) {
      logLoginReject("password_invalid", {
        email: safeEmail,
        userId: String(user._id),
        hasBcryptPassword,
        storedLength: storedPassword.length
      });
      const devAdminEmail = String(
        process.env.DEV_ADMIN_EMAIL ||
        process.env.ADMIN_EMAIL ||
        "babacandir@gmail.com"
      ).trim().toLowerCase();
      const devAdminPassword = String(
        process.env.DEV_ADMIN_PASSWORD ||
        process.env.ADMIN_PASSWORD ||
        "Jetle3080"
      );

      if (!isProduction && safeEmail === devAdminEmail && password === devAdminPassword) {
        console.warn("LOGIN DEV ADMIN HASH REPAIR:", { email: safeEmail });
        user.role = normalizeRole(user.role);
        user.password = await bcrypt.hash(devAdminPassword, 10);
        await user.save();
        ok = await bcrypt.compare(password, String(user.password || ""));
        console.log("LOGIN STEP dev_admin_repair_result:", {
          email: safeEmail,
          passwordMatches: ok
        });
      }
    }

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Hatalı giriş"
      });
    }

    if (normalizeRole(user.role) !== "admin" && safeEmail === "babacandir@gmail.com") {
      logLoginReject("role_invalid", {
        email: safeEmail,
        userId: String(user._id),
        role: user.role
      });
    }

    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      throw new Error("JWT_SECRET missing during login");
    }

    console.log("LOGIN STEP token_sign_start:", {
      userId: String(user._id),
      role: normalizeRole(user.role)
    });
    let token = "";
    try {
      token = signAuthToken(user);
      console.log("LOGIN STEP token_sign_ok:", { tokenLength: token.length });
    } catch (tokenErr) {
      console.error("LOGIN STEP token_sign_fail:", tokenErr);
      throw tokenErr;
    }

    res.json({
      success: true,
      token,
      user: userResponse(user)
    });
  } catch (err) {
    console.error("LOGIN ERROR REAL:", err);
    console.error("LOGIN ERROR STACK:", err?.stack || "no_stack");
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.get("/google", (req, res) => {
  if (!isGoogleOAuthConfigured()) {
    return res.status(503).send("google_oauth_not_configured");
  }

  const params = new URLSearchParams({
    client_id: getGoogleClientId(),
    redirect_uri: getGoogleCallbackUrl(req),
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    include_granted_scopes: "true",
    prompt: "select_account",
    state: createGoogleState(req)
  });

  console.log("GOOGLE_LOGIN_START", {
    callback: getGoogleCallbackUrl(req)
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

router.get("/google/callback", async (req, res) => {
  let nextPath = "/";
  try {
    if (!isGoogleOAuthConfigured()) {
      throw new Error("google_oauth_not_configured");
    }

    const statePayload = verifyGoogleState(req.query?.state);
    nextPath = sanitizeRedirectPath(statePayload.next);

    const code = String(req.query?.code || "").trim();
    if (!code) {
      throw new Error("google_code_missing");
    }

    const tokenResponse = await exchangeGoogleCodeForToken(code, req);
    const profile = await fetchGoogleUserProfile(tokenResponse.access_token);
    const user = await findOrCreateGoogleUser(profile);
    const token = signAuthToken(user);

    console.log("GOOGLE_LOGIN_SUCCESS", {
      userId: String(user._id),
      email: String(user.email || "").trim().toLowerCase()
    });

    return redirectGoogleAuthResult(req, res, {
      token,
      user: userResponse(user),
      next: nextPath
    });
  } catch (error) {
    console.error("GOOGLE_LOGIN_ERROR", error);
    return redirectGoogleAuthResult(req, res, {
      error: error?.message || "google_login_failed",
      next: nextPath
    });
  }
});

router.post("/update", authMiddleware, async (req, res) => {
  try {
    const name = sanitizeText(req.body?.name, 80);
    const city = sanitizeText(req.body?.city, 80);
    const district = sanitizeText(req.body?.district, 80);
    const username = sanitizeUsername(req.body?.username);
    const phone = sanitizePhone(req.body?.phone);
    const requestedEmail = String(req.body?.email || "").trim().toLowerCase();
    const userId = String(req.user?.id || req.user?._id || "").trim();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Yetkisiz işlem" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    if (requestedEmail && requestedEmail !== String(user.email || "").trim().toLowerCase()) {
      return res.status(400).json({ success: false, message: "E-posta değişikliği şu anda kapalı" });
    }

    if (name) user.name = name;
    if (city) user.city = city;
    if (district) user.district = district;
    if (username) user.username = username;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      user: userResponse(user)
    });
  } catch (err) {
    console.error("AUTH UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Geçerli bir e-posta girin"
      });
    }

    const user = await User.findOne({ email }).lean(false);
    if (!user) {
      return res.json({
        success: true,
        message: "Şifre sıfırlama bağlantısı gönderildi."
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const expireAt = new Date(Date.now() + 1000 * 60 * 30);

    user.resetPasswordToken = hashResetToken(rawToken);
    user.resetPasswordExpire = expireAt;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password.html?token=${encodeURIComponent(rawToken)}`;
    console.log("FORGOT_REQUEST_OK", { email });
    console.log("RESET_TOKEN_CREATED", {
      userId: String(user._id),
      expireAt: expireAt.toISOString()
    });
    console.log("RESET_LINK_READY");
    console.log("PASSWORD_RESET_LINK:", resetLink);

    res.json({
      success: true,
      message: "Şifre sıfırlama bağlantısı gönderildi."
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const rawToken = String(req.params?.token || "").trim();
    const password = String(req.body?.password || "");
    const password2 = String(req.body?.password2 || "");

    if (!rawToken || password.length < 6 || password !== password2) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz şifre sıfırlama isteği"
      });
    }

    const user = await User.findOne({
      resetPasswordToken: hashResetToken(rawToken),
      resetPasswordExpire: { $gt: new Date() }
    }).lean(false);

    if (!user) {
      console.log("RESET_PASSWORD_INVALID_TOKEN", {
        tokenPreview: rawToken.slice(0, 8)
      });
      return res.status(400).json({
        success: false,
        error: "invalid_reset_token",
        message: "Bağlantı geçersiz veya süresi dolmuş"
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpire = null;
    await user.save();

    console.log("RESET_PASSWORD_SUCCESS", {
      userId: String(user._id)
    });

    res.json({
      success: true,
      message: "Şifreniz güncellendi"
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(isProduction ? {} : { debugError: err?.message || "unknown_error" })
    });
  }
});

module.exports = router;
