const authService = require("../services/auth.service");
const { env } = require("../config/env");
const { asyncHandler } = require("../utils/asyncHandler");

const register = asyncHandler(async function register(req, res) {
  var data = await authService.register(req.body || {});
  console.log("LOGIN SECRET:", process.env.JWT_ACCESS_SECRET);
  res.cookie(env.REFRESH_COOKIE_NAME, data.refreshToken, authService.refreshCookieOptions());
  res.status(201).json({ ok: true, data: data });
});

const login = asyncHandler(async function login(req, res) {
  var data = await authService.login(req.body || {});
  console.log("LOGIN SECRET:", process.env.JWT_ACCESS_SECRET);
  res.cookie(env.REFRESH_COOKIE_NAME, data.refreshToken, authService.refreshCookieOptions());
  res.json({ ok: true, data: data });
});

const logout = asyncHandler(async function logout(req, res) {
  var refresh = req.cookies ? req.cookies[env.REFRESH_COOKIE_NAME] : "";
  if (refresh) await authService.revokeRefreshToken(refresh);
  res.clearCookie(env.REFRESH_COOKIE_NAME);
  res.json({ ok: true, message: "Çıkış yapıldı." });
});

const me = asyncHandler(async function me(req, res) {
  var data = await authService.me(req.auth);
  res.json({ ok: true, data: data });
});

module.exports = { register, login, logout, me };
