/**
 * JETLE.online — yerleşim bazlı kampanya reklamları (hero, şerit, yan kolon, inline, footer).
 * Tıklama / gösterim sayacı: ileride POST /api/ads/:id/impression ve /click ile ayrı koleksiyonda toplanabilir.
 */
(function () {
  "use strict";

  var byPlacement = {};
  var loaded = false;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pickFirst(placement) {
    var arr = byPlacement[placement] || [];
    return arr.length ? arr[0] : null;
  }

  function reloadCache() {
    byPlacement = {};
    loaded = false;
    if (!window.JetleAPI || typeof JetleAPI.fetchPublicCampaignAds !== "function") return;
    var all = JetleAPI.fetchPublicCampaignAds(null);
    if (!Array.isArray(all)) return;
    loaded = true;
    all.forEach(function (ad) {
      var p = ad.placementType || "";
      if (!byPlacement[p]) byPlacement[p] = [];
      byPlacement[p].push(ad);
    });
    Object.keys(byPlacement).forEach(function (p) {
      byPlacement[p].sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
    });
  }

  function hideEl(el) {
    if (!el) return;
    el.hidden = true;
    el.innerHTML = "";
    el.setAttribute("aria-hidden", "true");
  }

  function showEl(el) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute("aria-hidden");
  }

  function renderHero(el, ad) {
    if (!el || !ad) {
      hideEl(el);
      return;
    }
    var tone = esc(ad.backgroundTone || "neutral");
    var img = esc(ad.imageUrl);
    var mob = ad.mobileImageUrl ? esc(ad.mobileImageUrl) : img;
    var sub = ad.subtitle || ad.description || "";
    el.className = "jetle-ad-hero jetle-ad-hero--tone-" + tone;
    el.innerHTML =
      '<a class="jetle-ad-hero__link" href="' +
      esc(ad.targetUrl) +
      '" target="_blank" rel="noopener sponsored" data-jetle-ad-id="' +
      esc(ad.id) +
      '">' +
      '<span class="jetle-ad-hero__media">' +
      '<picture>' +
      '<source media="(max-width: 640px)" srcset="' +
      mob +
      '" />' +
      '<img src="' +
      img +
      '" alt="" class="jetle-ad-hero__img" loading="lazy" width="1200" height="360" />' +
      "</picture>" +
      "</span>" +
      '<span class="jetle-ad-hero__overlay">' +
      '<span class="jetle-ad-hero__badge">' +
      esc(ad.sponsorLabel || "Sponsorlu") +
      "</span>" +
      '<span class="jetle-ad-hero__text">' +
      '<strong class="jetle-ad-hero__title">' +
      esc(ad.title) +
      "</strong>" +
      (sub ? '<span class="jetle-ad-hero__sub">' + esc(sub) + "</span>" : "") +
      '<span class="jetle-ad-hero__cta">' +
      esc(ad.ctaText || "İncele") +
      "</span>" +
      "</span>" +
      "</span>" +
      "</a>";
    showEl(el);
  }

  function renderFeaturedStrip(el, ad) {
    if (!el || !ad) {
      hideEl(el);
      return;
    }
    el.className = "jetle-ad-strip";
    el.innerHTML =
      '<a class="jetle-ad-strip__link" href="' +
      esc(ad.targetUrl) +
      '" target="_blank" rel="noopener sponsored" data-jetle-ad-id="' +
      esc(ad.id) +
      '">' +
      '<span class="jetle-ad-strip__badge">' +
      esc(ad.sponsorLabel || "Sponsorlu") +
      "</span>" +
      (ad.imageUrl
        ? '<span class="jetle-ad-strip__thumb"><img src="' + esc(ad.imageUrl) + '" alt="" loading="lazy" width="120" height="72" /></span>'
        : "") +
      '<span class="jetle-ad-strip__body">' +
      '<strong class="jetle-ad-strip__title">' +
      esc(ad.title) +
      "</strong>" +
      (ad.subtitle ? '<span class="jetle-ad-strip__sub">' + esc(ad.subtitle) + "</span>" : "") +
      "</span>" +
      '<span class="jetle-ad-strip__go">' +
      esc(ad.ctaText || "İncele") +
      " →</span>" +
      "</a>";
    showEl(el);
  }

  function renderSidebar(el, ad) {
    if (!el || !ad) {
      hideEl(el);
      return;
    }
    var tone = esc(ad.backgroundTone || "neutral");
    el.className = "jetle-ad-sidebar jetle-ad-sidebar--tone-" + tone;
    el.innerHTML =
      '<a class="jetle-ad-sidebar__link" href="' +
      esc(ad.targetUrl) +
      '" target="_blank" rel="noopener sponsored" data-jetle-ad-id="' +
      esc(ad.id) +
      '">' +
      '<span class="jetle-ad-sidebar__badge">' +
      esc(ad.sponsorLabel || "Reklam") +
      "</span>" +
      (ad.imageUrl
        ? '<span class="jetle-ad-sidebar__imgwrap"><img src="' + esc(ad.imageUrl) + '" alt="" class="jetle-ad-sidebar__img" loading="lazy" /></span>'
        : "") +
      '<strong class="jetle-ad-sidebar__title">' +
      esc(ad.title) +
      "</strong>" +
      (ad.description ? '<p class="jetle-ad-sidebar__desc">' + esc(ad.description).slice(0, 160) + "</p>" : "") +
      '<span class="jetle-ad-sidebar__cta btn btn-secondary btn-sm">' +
      esc(ad.ctaText || "İncele") +
      "</span>" +
      "</a>";
    showEl(el);
  }

  function renderFooterBanner(el, ad) {
    if (!el || !ad) {
      hideEl(el);
      return;
    }
    el.className = "jetle-ad-footer-banner-wrap jetle-ad-footer-banner";
    el.innerHTML =
      '<div class="container">' +
      '<a class="jetle-ad-footer-banner__inner panel" href="' +
      esc(ad.targetUrl) +
      '" target="_blank" rel="noopener sponsored" data-jetle-ad-id="' +
      esc(ad.id) +
      '">' +
      '<span class="jetle-ad-footer-banner__badge">' +
      esc(ad.sponsorLabel || "Sponsorlu") +
      "</span>" +
      '<div class="jetle-ad-footer-banner__grid">' +
      (ad.imageUrl
        ? '<div class="jetle-ad-footer-banner__visual"><img src="' + esc(ad.imageUrl) + '" alt="" loading="lazy" /></div>'
        : "") +
      '<div class="jetle-ad-footer-banner__copy">' +
      "<h2>" +
      esc(ad.title) +
      "</h2>" +
      "<p>" +
      esc(ad.description || ad.subtitle || "") +
      "</p>" +
      '<span class="btn btn-primary btn-sm">' +
      esc(ad.ctaText || "Keşfet") +
      "</span>" +
      "</div>" +
      "</div>" +
      "</a>" +
      "</div>";
    showEl(el);
  }

  function createInlineCard(ad) {
    if (!ad) return null;
    var art = document.createElement("article");
    art.className = "listing-card jetle-ad-inline-card jetle-ad-inline-card--native";
    art.setAttribute("data-jetle-ad-id", ad.id);
    var img = ad.imageUrl ? esc(ad.imageUrl) : "";
    art.innerHTML =
      '<span class="jetle-ad-inline-card__badge">' +
      esc(ad.sponsorLabel || "Sponsorlu") +
      "</span>" +
      '<a class="jetle-ad-inline-card__link" href="' +
      esc(ad.targetUrl) +
      '" target="_blank" rel="noopener sponsored">' +
      (img ? '<div class="listing-card__media"><img src="' + img + '" alt="" loading="lazy" /></div>' : "") +
      '<div class="listing-card__body">' +
      '<h3 class="listing-card__title">' +
      esc(ad.title) +
      "</h3>" +
      "<p class=\"listing-card__meta text-small text-muted\">" +
      esc(ad.subtitle || ad.description || "").slice(0, 120) +
      "</p>" +
      '<span class="listing-card__price jetle-ad-inline-card__cta">' +
      esc(ad.ctaText || "İncele") +
      "</span>" +
      "</div>" +
      "</a>";
    return art;
  }

  function mountHomePage() {
    reloadCache();
    renderHero(document.getElementById("jetleAdHero"), pickFirst("hero"));
    renderFeaturedStrip(document.getElementById("jetleAdFeaturedStrip"), pickFirst("featured_strip"));
    renderSidebar(document.getElementById("jetleAdSidebar"), pickFirst("sidebar"));
    renderFooterBanner(document.getElementById("jetleAdFooterBanner"), pickFirst("footer_banner"));
  }

  window.JetleAds = {
    reloadCache: reloadCache,
    mountHomePage: mountHomePage,
    getInlineAd: function () {
      if (!loaded) reloadCache();
      return pickFirst("inline_card");
    },
    createInlineCardElement: function () {
      return createInlineCard(this.getInlineAd());
    },
    invalidate: function () {
      byPlacement = {};
      loaded = false;
    }
  };

  try {
    window.addEventListener("jetle-listings-changed", function () {
      JetleAds.invalidate();
    });
  } catch (e) {}
})();
