/**
 * JWT doğrulama + admin rolü (requireAuth → requireAdmin).
 * Express: router.use(adminOnly) — dizi olarak kayıtlı middleware zinciri.
 */
const { requireAuth } = require("./requireAuth");
const { requireAdmin } = require("./requireAdmin");

const adminOnly = [requireAuth, requireAdmin];

module.exports = { adminOnly };
