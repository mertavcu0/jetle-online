const { LISTING_STATUS } = require("../models/Listing");

/**
 * Admin dışı: vitrin / öne çıkarma / acil alanları kapatılır; onay/red durumu atanamaz.
 */
function applyNonAdminListingRules(payload) {
  var p = payload && typeof payload === "object" ? Object.assign({}, payload) : {};
  p.featured = false;
  p.showcase = false;
  p.urgent = false;
  p.highlight = false;
  p.featuredUntil = null;
  p.showcaseUntil = null;
  var st = String(p.status || "").trim();
  if (st === "approved" || st === "rejected") delete p.status;
  if (st === "draft" || st === "pending" || st === "passive") p.status = st;
  return p;
}

function normalizeInitialStatus(role, status) {
  var s = String(status || "").trim();
  if (role === "admin") {
    if (LISTING_STATUS.indexOf(s) !== -1) return s;
    return "pending";
  }
  if (s === "draft") return "draft";
  return "pending";
}

/** Sahibinin PUT ile gönderebileceği durum geçişleri (moderasyon yok). */
function canOwnerSetStatus(current, next) {
  if (next === "passive") return current === "approved" || current === "pending";
  if (next === "pending") return current === "passive" || current === "rejected" || current === "draft";
  if (next === "draft") return current === "pending" || current === "rejected";
  return false;
}

module.exports = { applyNonAdminListingRules, normalizeInitialStatus, canOwnerSetStatus, LISTING_STATUS };

