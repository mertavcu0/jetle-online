/**
 * Ana sayfa — API ilanları: kartlar, arama, kategori, sayfalama / daha fazla.
 */
(function () {
  "use strict";

  try {
    window.__JETLE_USE_HOME_API_LISTINGS__ = true;
  } catch (e) {}

  var API_BASE = "https://jetle-online-production.up.railway.app";
  var DEFAULT_LISTINGS_URL = API_BASE + "/api/listings";
  /** İlk yüklemede sadece 6 kart; kalanlar lazy chunk halinde gelir. */
  var HOME_INITIAL_RENDER_COUNT = 12;
  var HOME_LAZY_BATCH_SIZE = 8;
  var HOME_CACHE_KEY = "jetle_home_listings_cache_v1";
  var HOME_CACHE_TTL_MS = 2 * 60 * 1000;
  var MAX_RENDERED_CARDS = 48;
  var EST_CARD_ROW_HEIGHT = 268;
  var CARD_IMG_W = 280;
  var CARD_IMG_H = 210;
  var DESC_MAX = 140;
  var LIVE_STREAM_MAX = 10;
  var LIVE_STREAM_TICK_MS = 5000;
  var LIVE_STREAM_STORAGE_KEY = "jetle_home_live_stream_v1";

  /** Ham API satırları (filtre öncesi). */
  var apiRows = [];
  /** Son çekimde ağ/HTTP hatası (boş grid ile ayırt etmek için). */
  var homeListingsFetchFailed = false;
  /** Hata durumunda boş ekranda gösterilecek kısa teknik/insani mesaj. */
  var homeListingsLastErrorMsg = "";
  var shownCount = 0;
  var filterKeyword = "";
  var filterCategory = "";
  var filterCity = "";
  /** İlk API yanıtı gelene kadar grid güncellenmez (erken arama olayları için). */
  var listingsFetchSettled = false;
  var lazyLoadQueued = false;
  var infiniteObserver = null;
  var scrollFallbackWired = false;
  var virtualTopTrimmedRows = 0;
  var liveStreamTimer = null;

  function idKey(item) {
    if (!item || typeof item !== "object") return "";
    if (item._id != null) return String(item._id);
    if (item.id != null) return String(item.id);
    return "";
  }

  function selectFeaturedList(rows) {
    var r = rows || [];
    return r
      .slice()
      .sort(function (a, b) {
        return (parseListingDateMs(b) || 0) - (parseListingDateMs(a) || 0);
      })
      .slice(0, 6);
  }

  function featuredCardHref(item) {
    var id = idKey(item);
    if (!id) return "index.html";
    return detailPageHref(id);
  }

  function resolveListingsUrl() {
    try {
      if (window.JetleAPI && JetleAPI.API_BASE) {
        var jb = String(JetleAPI.API_BASE).trim().replace(/\/+$/, "");
        if (/^https?:\/\//i.test(jb)) return jb + "/api/listings";
      }
      var meta = document.querySelector('meta[name="jetle-api-base"]');
      var base = meta && meta.getAttribute("content");
      if (base && String(base).trim()) {
        var b = String(base).trim().replace(/\/+$/, "");
        if (/^https?:\/\//i.test(b)) return b + "/api/listings";
      }
    } catch (err) {}
    return DEFAULT_LISTINGS_URL;
  }

  function readUrlFilters() {
    try {
      var u = new URL(window.location.href);
      if (u.searchParams.has("q")) filterKeyword = u.searchParams.get("q") || "";
      if (u.searchParams.has("category")) filterCategory = (u.searchParams.get("category") || "").toLowerCase();
      else if (u.searchParams.has("cat")) filterCategory = (u.searchParams.get("cat") || "").toLowerCase();
      if (u.searchParams.has("city")) filterCity = u.searchParams.get("city") || "";
    } catch (err) {}
  }

  function pushUrlFilters() {
    try {
      var u = new URL(window.location.href);
      var q = String(filterKeyword || "").trim();
      if (q) u.searchParams.set("q", q);
      else u.searchParams.delete("q");
      if (filterCategory) {
        u.searchParams.set("cat", filterCategory);
        u.searchParams.set("category", filterCategory);
      } else {
        u.searchParams.delete("cat");
        u.searchParams.delete("category");
      }
      var c = String(filterCity || "").trim();
      if (c) u.searchParams.set("city", c);
      else u.searchParams.delete("city");
      if (history.replaceState) history.replaceState({}, "", u);
    } catch (err) {}
  }

  function syncSearchInputs() {
    var homeIn = document.getElementById("homeListingKeyword");
    var headIn = document.getElementById("headerSearchInput");
    if (homeIn) homeIn.value = filterKeyword;
    if (headIn) headIn.value = filterKeyword;
    syncHeroCategorySelect();
    syncHomeHeroCitySelect();
  }

  function syncHeroCategorySelect() {
    var sel = document.getElementById("homeHeroCategory");
    if (!sel) return;
    var v = String(filterCategory || "").toLowerCase();
    if (v === "emlak" || v === "vasita" || v === "elektronik" || v === "alisveris" || v === "hizmet") sel.value = v;
    else sel.value = "";
  }

  function syncHomeHeroCitySelect() {
    var c = document.getElementById("homeHeroCity");
    if (!c) return;
    var want = String(filterCity || "").trim();
    if (!want) {
      c.value = "";
      return;
    }
    var ok = false;
    for (var i = 0; i < c.options.length; i++) {
      if (c.options[i].value === want) {
        ok = true;
        break;
      }
    }
    c.value = ok ? want : "";
  }

  function syncHeroCityFromSidebar() {
    var src = document.getElementById("citySelect");
    var dst = document.getElementById("homeHeroCity");
    if (!src || !dst) return;
    var prev = String(filterCity || dst.value || "").trim();
    dst.innerHTML = src.innerHTML;
    if (prev) {
      var ok = false;
      for (var i = 0; i < dst.options.length; i++) {
        if (dst.options[i].value === prev) {
          ok = true;
          break;
        }
      }
      if (ok) dst.value = prev;
    }
  }

  function syncCategoryChips() {
    document.querySelectorAll(".home-cat-chip").forEach(function (btn) {
      var v = btn.getAttribute("data-home-cat") || "";
      btn.classList.toggle("is-active", v === filterCategory);
    });
    document.querySelectorAll(".home-cat-block").forEach(function (btn) {
      var v = btn.getAttribute("data-home-cat") || "";
      btn.classList.toggle("is-active", v === filterCategory);
    });
  }

  function normalizeRows(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload.data && Array.isArray(payload.data)) return payload.data;
    if (payload.ok && Array.isArray(payload.data)) return payload.data;
    return [];
  }

  function pickThumbUrl(item) {
    if (!item || typeof item !== "object") return "";
    var m = item.media && Array.isArray(item.media.images) ? item.media.images[0] : null;
    if (m && typeof m === "object") {
      var u = m.thumbUrl || m.mediumUrl || m.originalUrl || "";
      if (u) return String(u).trim();
    }
    if (item.coverImage && String(item.coverImage).trim()) return String(item.coverImage).trim();
    if (Array.isArray(item.images) && item.images[0]) return String(item.images[0]).trim();
    return "";
  }

  function toWebpCandidate(url) {
    var s = String(url || "").trim();
    if (!s) return "";
    // local/static jpg/png/jpeg uzantılarını webp olarak dene.
    if (/\.(jpe?g|png)(\?.*)?$/i.test(s)) {
      return s.replace(/\.(jpe?g|png)(\?.*)?$/i, ".webp$2");
    }
    return s;
  }

  function getImageByCategory(category) {
    var key = String(category || "").toLocaleLowerCase("tr-TR").trim();
    var label =
      key === "vasita" || key === "araba"
        ? "Vasıta"
        : key === "emlak"
          ? "Emlak"
          : key === "elektronik"
            ? "Elektronik"
            : key === "hizmet"
              ? "Hizmet"
              : key === "alisveris"
                ? "Alışveriş"
                : "Kayıt";
    return "https://placehold.co/400x300/e2e8f0/475569/png?text=" + encodeURIComponent(label);
  }

  function formatTry(n) {
    var num = Number(n);
    if (!Number.isFinite(num)) return "—";
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(num) + " ₺";
  }

  function foldTr(s) {
    return String(s || "").toLocaleLowerCase("tr-TR");
  }

  function shortDescription(text) {
    var t = String(text || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!t) return "";
    if (t.length <= DESC_MAX) return t;
    return t.slice(0, DESC_MAX - 1).trim() + "…";
  }

  function locationLine(item) {
    if (!item || typeof item !== "object") return "—";
    var d = item.district != null ? String(item.district).trim() : "";
    var c = item.city != null ? String(item.city).trim() : "";
    if (item.location && typeof item.location === "object") {
      if (!d && item.location.district) d = String(item.location.district).trim();
      if (!c && item.location.city) c = String(item.location.city).trim();
    }
    if (d && c) return d + ", " + c;
    if (c) return c;
    if (d) return d;
    return "—";
  }

  function hashStr(s) {
    var h = 0;
    s = String(s || "");
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function cityLabel(item) {
    if (!item || typeof item !== "object") return "—";
    var c = item.city != null ? String(item.city).trim() : "";
    var d = item.district != null ? String(item.district).trim() : "";
    if (item.location && typeof item.location === "object") {
      if (!c && item.location.city) c = String(item.location.city).trim();
      if (!d && item.location.district) d = String(item.location.district).trim();
    }
    var loc = [c, d].filter(Boolean).join(" / ");
    return loc || "—";
  }

  function mongoIdToDateMs(idStr) {
    var s = String(idStr || "");
    if (s.length !== 24 || !/^[a-f0-9]+$/i.test(s)) return null;
    var ts = parseInt(s.slice(0, 8), 16);
    return Number.isFinite(ts) ? ts * 1000 : null;
  }

  function parseListingDateMs(item) {
    if (!item) return null;
    var keys = ["createdAt", "updatedAt", "publishedAt", "created", "date", "listedAt"];
    for (var i = 0; i < keys.length; i++) {
      var v = item[keys[i]];
      if (v == null) continue;
      var t = new Date(v).getTime();
      if (!Number.isNaN(t)) return t;
    }
    return mongoIdToDateMs(idKey(item));
  }

  function relativeTimeTr(ms) {
    if (ms == null || Number.isNaN(ms)) return "";
    var diff = Date.now() - ms;
    if (diff < 0) diff = 0;
    var sec = Math.floor(diff / 1000);
    if (sec < 45) return "Az önce";
    var min = Math.floor(sec / 60);
    if (min < 60) return min + " dk önce";
    var hr = Math.floor(min / 60);
    if (hr < 24) return hr + " saat önce";
    var d = Math.floor(hr / 24);
    if (d === 1) return "Dün";
    if (d < 7) return d + " gün önce";
    var w = Math.floor(d / 7);
    if (w < 5) return w + " hafta önce";
    return new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
  }

  function cityAndTimeLine(item) {
    var city = cityLabel(item);
    var rel = relativeTimeTr(parseListingDateMs(item));
    if (rel && city && city !== "—") return city + " • " + rel;
    if (rel) return rel;
    return city;
  }

  function detailPageHref(id) {
    return "ilan-detay.html?id=" + encodeURIComponent(id);
  }

  function gridListingHref(id) {
    if (!id) return "index.html";
    return detailPageHref(id);
  }

  function cityMatches(item, cityNorm) {
    var want = String(cityNorm || "").trim();
    if (!want) return true;
    var c = item.city != null ? String(item.city).trim() : "";
    if (item.location && typeof item.location === "object" && item.location.city) {
      c = c || String(item.location.city).trim();
    }
    return foldTr(c) === foldTr(want);
  }

  function stableInt(seed, min, max) {
    var a = Number(min);
    var b = Number(max);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return 0;
    var key = String(seed || "");
    var span = b - a + 1;
    return a + (hashStr(key) % span);
  }

  function fakeViews(item) {
    var id = idKey(item) || item.title || "listing";
    return stableInt("views:" + id, 10, 500);
  }

  function keywordMatches(item, kw) {
    var k = String(kw || "").trim();
    if (!k) return true;
    var fk = foldTr(k);
    var title = foldTr(item.title);
    var desc = foldTr(item.description);
    return title.indexOf(fk) !== -1 || desc.indexOf(fk) !== -1;
  }

  function haystackForCategory(item) {
    var parts = [
      item.category,
      item.subcategory,
      item.categorySlug,
      item.title,
      item.description
    ];
    return foldTr(parts.filter(Boolean).join(" "));
  }

  function categoryMatches(item, key) {
    if (!key) return true;
    var h = haystackForCategory(item);
    if (key === "emlak") {
      return (
        h.indexOf("emlak") !== -1 ||
        h.indexOf("gayrimenkul") !== -1 ||
        h.indexOf("konut") !== -1 ||
        h.indexOf("arsa") !== -1 ||
        h.indexOf("daire") !== -1
      );
    }
    if (key === "vasita") {
      return (
        h.indexOf("vasıta") !== -1 ||
        h.indexOf("vasita") !== -1 ||
        h.indexOf("araç") !== -1 ||
        h.indexOf("arac") !== -1 ||
        h.indexOf("otomobil") !== -1 ||
        h.indexOf("motosiklet") !== -1 ||
        h.indexOf("oto") !== -1
      );
    }
    if (key === "elektronik") {
      return (
        h.indexOf("elektronik") !== -1 ||
        h.indexOf("telefon") !== -1 ||
        h.indexOf("bilgisayar") !== -1 ||
        h.indexOf("tablet") !== -1 ||
        h.indexOf("tv") !== -1 ||
        h.indexOf("laptop") !== -1
      );
    }
    if (key === "alisveris") {
      return h.indexOf("alışveriş") !== -1 || h.indexOf("alisveris") !== -1 || h.indexOf("mağaza") !== -1;
    }
    if (key === "hizmet") {
      return h.indexOf("hizmet") !== -1 || h.indexOf("hizmetler") !== -1;
    }
    return true;
  }

  function getBaseRows() {
    return apiRows && apiRows.slice ? apiRows.slice() : [];
  }

  function readKeywordFromUi() {
    var h = document.getElementById("headerSearchInput");
    var k = document.getElementById("homeListingKeyword");
    var fromH = h && h.value != null ? String(h.value).trim() : "";
    if (fromH) return fromH;
    return k && k.value != null ? String(k.value || "").trim() : "";
  }

  function getFilteredRows() {
    return getBaseRows().filter(function (item) {
      return (
        categoryMatches(item, filterCategory) &&
        keywordMatches(item, filterKeyword) &&
        cityMatches(item, filterCity)
      );
    });
  }

  function getGridDisplayRows() {
    return getFilteredRows();
  }

  function syncHomeSectionHeading() {
    try {
      var label = document.getElementById("allHeadingLabel");
      var t = "Yeni ilanlar";
      if (label) label.textContent = t;
    } catch (e) {}
  }

  function displayListingTitle(item) {
    var t = item && item.title != null ? String(item.title).trim() : "";
    if (!t || /^isimsiz/i.test(t)) return "Başlık belirtilmemiş";
    return t.replace(/\s+ilan\s*$/i, "").replace(/\s+ilan\.\s*$/i, "").trim() || "Başlık belirtilmemiş";
  }

  function buildFeaturedCard(item) {
    var id = idKey(item);
    var title = displayListingTitle(item);
    var loc = locationLine(item);

    var link = document.createElement("a");
    link.className = "featured-card featured-card--premium";
    link.href = featuredCardHref(item);
    if (id) link.setAttribute("data-listing-id", id);

    var wrap = document.createElement("div");
    wrap.className = "featured-card__media-wrap";

    var thumb = pickThumbUrl(item);
    var thumbWebp = toWebpCandidate(thumb);
    if (thumb) {
      var media = document.createElement("div");
      media.className = "featured-card__media";
      var img = document.createElement("img");
      img.src = thumbWebp || thumb;
      if (thumbWebp && thumbWebp !== thumb) {
        img.onerror = function () {
          img.onerror = null;
          img.src = thumb;
        };
      }
      img.alt = "";
      img.width = 480;
      img.height = 360;
      img.loading = "lazy";
      img.decoding = "async";
      img.fetchPriority = "low";
      media.appendChild(img);
      wrap.appendChild(media);
    } else {
      var ph = document.createElement("div");
      ph.className = "featured-card__media featured-card__media--placeholder";
      ph.setAttribute("aria-hidden", "true");
      wrap.appendChild(ph);
    }

    link.appendChild(wrap);

    var body = document.createElement("div");
    body.className = "featured-card__body";

    var titleEl = document.createElement("p");
    titleEl.className = "featured-card__title";
    titleEl.textContent = title;

    var priceEl = document.createElement("div");
    priceEl.className = "featured-card__price";
    priceEl.textContent = formatTry(item.price);

    var meta = document.createElement("p");
    meta.className = "featured-card__meta";
    meta.textContent = loc;

    body.appendChild(titleEl);
    body.appendChild(priceEl);
    body.appendChild(meta);
    link.appendChild(body);

    return link;
  }

  function renderFeaturedStrip(rows) {
    var grid = document.getElementById("homeFeaturedGrid");
    var rowEl = document.getElementById("homeFeaturedRow");
    var emptyEl = document.getElementById("homeFeaturedEmpty");
    var list = selectFeaturedList(rows || []);

    if (grid) {
      grid.innerHTML = "";
      if (!list.length) return;
      list.forEach(function (item) {
        grid.appendChild(buildCard(item));
      });
      syncApiFeedFavoriteUi();
      return;
    }

    if (!rowEl || !emptyEl) return;

    while (rowEl.firstChild) rowEl.removeChild(rowEl.firstChild);

    if (list.length === 0) {
      emptyEl.hidden = false;
      rowEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    rowEl.hidden = false;
    list.forEach(function (item) {
      rowEl.appendChild(buildFeaturedCard(item));
    });
  }

  function heartSvgFeed(filled) {
    if (filled) {
      return (
        '<svg class="listing-card__fav-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
      );
    }
    return (
      '<svg class="listing-card__fav-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.65" fill="none"/></svg>'
    );
  }

  function listingIsFavoriteHome(uid, lid) {
    if (!uid || !lid || !window.JetleAPI) return false;
    if (typeof JetleAPI.isFavorite === "function") return !!JetleAPI.isFavorite(uid, lid);
    if (typeof JetleAPI.getFavorites === "function") {
      var arr = JetleAPI.getFavorites(uid);
      return Array.isArray(arr) && arr.indexOf(String(lid)) !== -1;
    }
    return false;
  }

  function syncApiFeedFavoriteUi() {
    if (!window.JetleAPI) return;
    var u = window.JetleAuth && typeof JetleAuth.getCurrentUser === "function" ? JetleAuth.getCurrentUser() : null;
    var uid = u && u.id;
    document.querySelectorAll(".listing-card--api-feed button.fav[data-fav-id]").forEach(function (btn) {
      var lid = btn.getAttribute("data-fav-id");
      if (!lid) return;
      var on = listingIsFavoriteHome(uid, lid);
      btn.classList.toggle("is-fav", on);
      btn.setAttribute("aria-label", on ? "Favorilerden çıkar" : "Favorilere ekle");
      if (on) btn.innerHTML = heartSvgFeed(true);
      else btn.textContent = "\u2661";
    });
  }

  function buildCard(item) {
    var id = item._id != null ? String(item._id) : item.id != null ? String(item.id) : "";
    var title = displayListingTitle(item);

    var art = document.createElement("article");
    art.className = "listing-card listing-card--api-feed listing-card--market-v2";
    if (id) {
      art.setAttribute("data-id", id);
      art.setAttribute("data-listing-id", id);
      art.style.cursor = "pointer";
      art.setAttribute("role", "link");
      art.setAttribute("tabindex", "0");
      art.addEventListener("click", function (e) {
        if (e.target.closest(".listing-card__fav--corner")) return;
        window.location.href = gridListingHref(id);
      });
      art.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = gridListingHref(id);
        }
      });
    }

    var inner = document.createElement("div");
    inner.className = "listing-card__link listing-card__link--api";

    var thumb = pickThumbUrl(item);
    var thumbWebp = toWebpCandidate(thumb);
    var fallbackByCat = getImageByCategory(item.category);

    var mediaWrap = document.createElement("div");
    mediaWrap.className = "listing-card__media-wrap";

    var media = document.createElement("div");
    media.className = "listing-card__media";
    if (thumb) {
      var img = document.createElement("img");
      img.src = thumbWebp || thumb;
      img.alt = title;
      img.width = CARD_IMG_W;
      img.height = CARD_IMG_H;
      img.loading = "lazy";
      img.decoding = "async";
      img.fetchPriority = "low";
      if (thumbWebp && thumbWebp !== thumb) {
        img.onerror = function () {
          img.onerror = null;
          img.src = thumb;
          img.onerror = function () {
            img.onerror = null;
            img.src = fallbackByCat;
          };
        };
      } else {
        img.onerror = function () {
          img.onerror = null;
          img.src = fallbackByCat;
        };
      }
      media.appendChild(img);
    } else {
      media.setAttribute("aria-hidden", "true");
    }
    mediaWrap.appendChild(media);

    var favBtn = document.createElement("button");
    favBtn.type = "button";
    var u0 = window.JetleAuth && typeof JetleAuth.getCurrentUser === "function" ? JetleAuth.getCurrentUser() : null;
    var uid0 = u0 && u0.id;
    var favOn = !!(id && uid0 && listingIsFavoriteHome(uid0, id));
    favBtn.className =
      "btn-icon listing-card__fav listing-card__fav--heart listing-card__fav--corner" + (favOn ? " is-fav" : "");
    favBtn.setAttribute("aria-label", favOn ? "Favorilerden çıkar" : "Favorilere ekle");
    if (id) favBtn.setAttribute("data-fav-id", id);
    favBtn.innerHTML = heartSvgFeed(favOn);
    favBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    mediaWrap.appendChild(favBtn);

    inner.appendChild(mediaWrap);

    var body = document.createElement("div");
    body.className = "listing-card__body";

    var priceEl = document.createElement("div");
    priceEl.className = "listing-card__price";
    priceEl.textContent = formatTry(item.price);

    var titleEl = document.createElement("h3");
    titleEl.className = "listing-card__title";
    titleEl.textContent = title;

    var meta = document.createElement("p");
    meta.className = "listing-card__meta listing-card__meta--citytime listing-card__meta--loc";
    meta.textContent = cityAndTimeLine(item);

    body.appendChild(priceEl);
    body.appendChild(titleEl);
    body.appendChild(meta);

    inner.appendChild(body);
    art.appendChild(inner);
    return art;
  }

  function syncHomeListingsLoadingBar(busy, text) {
    var loadEl = document.getElementById("homeListingsLoading");
    var loadTxt = document.getElementById("homeListingsLoadingText");
    if (loadEl) {
      loadEl.hidden = !busy;
      loadEl.setAttribute("aria-busy", busy ? "true" : "false");
    }
    if (loadTxt && text != null && text !== "") loadTxt.textContent = text;
  }

  function syncHomeListingsRetryButton() {
    var wrap = document.getElementById("homeListingsFooterActions");
    var retryBtn = document.getElementById("homeListingsRetryBtn");
    if (!retryBtn) return;
    var show = !!(homeListingsFetchFailed && listingsFetchSettled);
    if (wrap) wrap.hidden = !show;
  }

  function updateResultsInfo(infoEl, totalFiltered, shown) {
    if (!infoEl) return;
    if (totalFiltered === 0) {
      infoEl.textContent = "";
      return;
    }
    if (shown >= totalFiltered) {
      infoEl.textContent = "Toplam " + totalFiltered + " kayıt";
    } else {
      infoEl.textContent = "Gösterilen " + shown + " / " + totalFiltered + " kayıt";
    }
  }

  function formatCompactNumber(n) {
    var val = Number(n);
    if (!Number.isFinite(val)) return "0";
    return new Intl.NumberFormat("tr-TR").format(Math.round(val));
  }

  function categoryFromItem(item) {
    var h = haystackForCategory(item);
    if (categoryMatches(item, "vasita")) return "vasita";
    if (categoryMatches(item, "emlak")) return "emlak";
    if (categoryMatches(item, "elektronik")) return "elektronik";
    if (categoryMatches(item, "alisveris")) return "alisveris";
    if (categoryMatches(item, "hizmet")) return "hizmet";
    return h.indexOf("hizmet") !== -1 ? "hizmet" : "";
  }

  function renderCategoryCounts(rows) {
    var list = Array.isArray(rows) ? rows : [];
    var map = { vasita: 0, emlak: 0, elektronik: 0, alisveris: 0, hizmet: 0 };
    list.forEach(function (item) {
      var c = categoryFromItem(item);
      if (c && map[c] != null) map[c] += 1;
    });
    function set(id, n) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = "(" + formatCompactNumber(n) + ")";
    }
    set("homeCatCountVasita", map.vasita);
    set("homeCatCountEmlak", map.emlak);
    set("homeCatCountElektronik", map.elektronik);
    set("homeCatCountAlisveris", map.alisveris);
    set("homeCatCountHizmet", map.hizmet);
  }

  function renderExtraSection(gridId, rows) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = "";
    var slice = (rows || []).slice(0, 8);
    if (!slice.length) {
      var emptyP = document.createElement("p");
      emptyP.className = "home-extra-feed-empty home-extra-feed-empty--pro text-muted text-small";
      emptyP.textContent = "Henüz ilan yok";
      grid.appendChild(emptyP);
      return;
    }
    slice.forEach(function (item) {
      grid.appendChild(buildCard(item));
    });
  }

  function renderExtraFeeds(rows) {
    void rows;
  }

  function updatePager(totalFiltered, shown) {
    var pager = document.getElementById("listingsPager");
    if (!pager) return;
    pager.hidden = totalFiltered === 0 || shown >= totalFiltered;
  }

  function appendPage(grid, rows) {
    var frag = document.createDocumentFragment();
    rows.forEach(function (item) {
      frag.appendChild(buildCard(item));
    });
    grid.appendChild(frag);
  }

  function getGridColumnsCount() {
    if (window.matchMedia("(min-width: 1200px)").matches) return 5;
    if (window.matchMedia("(min-width: 980px)").matches) return 4;
    if (window.matchMedia("(min-width: 720px)").matches) return 3;
    if (window.matchMedia("(min-width: 520px)").matches) return 2;
    return 1;
  }

  function ensureTopSpacer(grid) {
    if (!grid) return null;
    var s = grid.querySelector(".listing-grid__spacer-top");
    if (s) return s;
    s = document.createElement("div");
    s.className = "listing-grid__spacer listing-grid__spacer-top";
    s.style.height = "0px";
    grid.insertBefore(s, grid.firstChild);
    return s;
  }

  function pruneVirtualizedCards(grid) {
    if (!grid) return;
    var cards = grid.querySelectorAll(".listing-card--api-feed");
    if (cards.length <= MAX_RENDERED_CARDS) return;
    var removeCount = cards.length - MAX_RENDERED_CARDS;
    var cols = getGridColumnsCount();
    var removeRows = Math.ceil(removeCount / cols);
    var actualRemove = Math.min(removeRows * cols, cards.length);
    for (var i = 0; i < actualRemove; i++) {
      cards[i].remove();
    }
    virtualTopTrimmedRows += removeRows;
    var spacer = ensureTopSpacer(grid);
    if (spacer) spacer.style.height = String(virtualTopTrimmedRows * EST_CARD_ROW_HEIGHT) + "px";
  }

  function appendNextLazyChunk(grid, info) {
    var displayRows = getGridDisplayRows();
    if (!displayRows.length || shownCount >= displayRows.length) return;
    var next = displayRows.slice(shownCount, shownCount + HOME_LAZY_BATCH_SIZE);
    shownCount += next.length;
    appendPage(grid, next);
    pruneVirtualizedCards(grid);
    updateResultsInfo(info, displayRows.length, shownCount);
    updatePager(displayRows.length, shownCount);
    syncApiFeedFavoriteUi();
  }

  function queueLazyChunk(grid, info) {
    if (lazyLoadQueued) return;
    lazyLoadQueued = true;
    var run = function () {
      lazyLoadQueued = false;
      appendNextLazyChunk(grid, info);
    };
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(run, { timeout: 320 });
    } else {
      setTimeout(run, 140);
    }
  }

  function renderGridSkeleton(grid, count) {
    if (!grid) return;
    grid.setAttribute("aria-busy", "true");
    var n = Math.max(0, Number(count) || 0);
    if (!n) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var sk = document.createElement("article");
      sk.className = "listing-card listing-card--api-feed is-skeleton";
      sk.setAttribute("aria-hidden", "true");
      sk.innerHTML =
        '<div class="listing-img" aria-hidden="true"></div>' +
        '<div class="listing-body">' +
        '<div class="listing-skel-line listing-skel-line--price"></div>' +
        '<div class="listing-skel-line listing-skel-line--title"></div>' +
        '<div class="listing-skel-line listing-skel-line--meta"></div>' +
        "</div>";
      frag.appendChild(sk);
    }
    grid.innerHTML = "";
    var spacer = ensureTopSpacer(grid);
    if (spacer) spacer.style.height = "0px";
    grid.appendChild(frag);
  }

  function readCachedRows() {
    try {
      var raw = localStorage.getItem(HOME_CACHE_KEY);
      if (!raw) return [];
      var p = JSON.parse(raw);
      if (!p || !Array.isArray(p.rows) || !Number.isFinite(p.ts)) return [];
      if (Date.now() - p.ts > HOME_CACHE_TTL_MS) return [];
      return p.rows;
    } catch (e) {
      return [];
    }
  }

  function writeCachedRows(rows) {
    try {
      localStorage.setItem(
        HOME_CACHE_KEY,
        JSON.stringify({
          ts: Date.now(),
          rows: Array.isArray(rows) ? rows.slice(0, 240) : []
        })
      );
    } catch (e) {}
  }

  function safeSessionGet(key, fallback) {
    try {
      var raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSessionSet(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function buildLivePool(rows) {
    var list = Array.isArray(rows) ? rows.slice() : [];
    if (!list.length) return [];
    return list.sort(function (a, b) {
      return hashStr(idKey(a) + ":live") - hashStr(idKey(b) + ":live");
    });
  }

  function ensureLiveState(rows) {
    var state = safeSessionGet(LIVE_STREAM_STORAGE_KEY, null);
    var pool = buildLivePool(rows);
    var sig = pool.map(function (x) {
      return idKey(x);
    }).join("|");
    if (!state || state.signature !== sig) {
      state = {
        signature: sig,
        pointer: 0,
        ids: pool.map(function (x) {
          return idKey(x);
        })
      };
      safeSessionSet(LIVE_STREAM_STORAGE_KEY, state);
    }
    return state;
  }

  function markLiveCard(card) {
    if (!card) return card;
    card.classList.add("home-live-card");
    var body = card.querySelector(".listing-body");
    if (body && !body.querySelector(".home-live-card__badge")) {
      var badge = document.createElement("p");
      badge.className = "home-live-card__badge";
      badge.textContent = "Az önce eklendi";
      body.insertBefore(badge, body.firstChild);
    }
    if (!card.querySelector(".home-live-card__dot")) {
      var dot = document.createElement("span");
      dot.className = "home-live-card__dot";
      dot.setAttribute("aria-hidden", "true");
      card.appendChild(dot);
    }
    return card;
  }

  function animateLiveInsert(card) {
    if (!card) return;
    card.classList.add("is-entering");
    requestAnimationFrame(function () {
      card.classList.add("is-entering-active");
      card.classList.remove("is-entering");
      setTimeout(function () {
        card.classList.remove("is-entering-active");
      }, 420);
    });
  }

  function renderLiveInitial(rows) {
    var grid = document.getElementById("homeLiveStreamGrid");
    if (!grid) return;
    grid.innerHTML = "";
    var state = ensureLiveState(rows);
    var idToItem = {};
    (rows || []).forEach(function (x) {
      var k = idKey(x);
      if (k) idToItem[k] = x;
    });
    state.ids.slice(0, LIVE_STREAM_MAX).forEach(function (id) {
      if (!idToItem[id]) return;
      grid.appendChild(markLiveCard(buildCard(idToItem[id])));
    });
  }

  function startLiveTicker(rows) {
    var grid = document.getElementById("homeLiveStreamGrid");
    if (!grid) return;
    if (liveStreamTimer) {
      clearInterval(liveStreamTimer);
      liveStreamTimer = null;
    }
    if (!rows || !rows.length) return;
    liveStreamTimer = setInterval(function () {
      var state = ensureLiveState(rows);
      if (!state.ids || !state.ids.length) return;
      var id = state.ids[state.pointer % state.ids.length];
      state.pointer = (state.pointer + 1) % state.ids.length;
      safeSessionSet(LIVE_STREAM_STORAGE_KEY, state);
      var item = null;
      for (var i = 0; i < rows.length; i++) {
        if (idKey(rows[i]) === id) {
          item = rows[i];
          break;
        }
      }
      if (!item) return;
      var card = markLiveCard(buildCard(item));
      grid.insertBefore(card, grid.firstChild || null);
      animateLiveInsert(card);
      while (grid.children.length > LIVE_STREAM_MAX) {
        grid.removeChild(grid.lastElementChild);
      }
    }, LIVE_STREAM_TICK_MS);
  }

  function applyMainView(opts) {
    opts = opts || {};
    var resetShown = opts.resetShown !== false;
    if (!listingsFetchSettled) return;

    var grid = document.getElementById("listingsGrid");
    var info = document.getElementById("resultsInfo");

    if (!grid) return;

    renderFeaturedStrip(getFilteredRows());
    renderCategoryCounts(getBaseRows());
    renderExtraFeeds(apiRows);
    renderLiveInitial(apiRows);
    startLiveTicker(apiRows);
    syncHomeSectionHeading();

    var displayRows = getGridDisplayRows();

    if (displayRows.length === 0) {
      grid.setAttribute("aria-busy", "false");
      grid.innerHTML = "";
      shownCount = 0;
      updatePager(0, 0);
      if (info) info.textContent = "";
      syncHomeListingsRetryButton();
      return;
    }

    syncHomeListingsRetryButton();

    if (resetShown) {
      grid.setAttribute("aria-busy", "false");
      virtualTopTrimmedRows = 0;
      shownCount = Math.min(HOME_INITIAL_RENDER_COUNT, displayRows.length);
      grid.innerHTML = "";
      var topSpacer = ensureTopSpacer(grid);
      if (topSpacer) topSpacer.style.height = "0px";
      appendPage(grid, displayRows.slice(0, shownCount));
      syncApiFeedFavoriteUi();
    }

    updateResultsInfo(info, displayRows.length, shownCount);
    updatePager(displayRows.length, shownCount);

    try {
      window.__JETLE_HOME_LISTINGS__ = {
        total: displayRows.length,
        totalAll: apiRows.length,
        pageSize: HOME_LAZY_BATCH_SIZE,
        shown: function () {
          return shownCount;
        }
      };
    } catch (err) {}
    syncHomeListingsRetryButton();
  }

  function wireLoadMore(grid, info) {
    var btn = document.getElementById("listingsLoadMore");
    if (!btn || btn.getAttribute("data-wired") === "1") return;
    btn.setAttribute("data-wired", "1");
    btn.addEventListener("click", function () {
      queueLazyChunk(grid, info);
    });

    var pager = document.getElementById("listingsPager");
    if (pager && typeof window.IntersectionObserver === "function") {
      if (infiniteObserver) infiniteObserver.disconnect();
      infiniteObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) queueLazyChunk(grid, info);
          });
        },
        { root: null, rootMargin: "280px 0px", threshold: 0.01 }
      );
      infiniteObserver.observe(pager);
    } else if (!scrollFallbackWired) {
      scrollFallbackWired = true;
      window.addEventListener(
        "scroll",
        function () {
          var pagerEl = document.getElementById("listingsPager");
          if (!pagerEl || pagerEl.hidden) return;
          var rect = pagerEl.getBoundingClientRect();
          if (rect.top < window.innerHeight + 260) queueLazyChunk(grid, info);
        },
        { passive: true }
      );
    }
  }

  function wireMarketplaceOnce(grid, info) {
    if (!grid || grid.getAttribute("data-home-search-wired") === "1") return;
    grid.setAttribute("data-home-search-wired", "1");

    var kwInput = document.getElementById("homeListingKeyword");
    var searchBtn = document.getElementById("homeListingSearchBtn");

    function runHomeSearch() {
      var catEl = document.getElementById("homeHeroCategory");
      var cityEl = document.getElementById("homeHeroCity");
      if (catEl) filterCategory = String(catEl.value || "").toLowerCase();
      if (cityEl) filterCity = cityEl.value || "";
      filterKeyword = readKeywordFromUi();
      syncCategoryChips();
      syncSearchInputs();
      pushUrlFilters();
      if (window.JetleMarket && typeof JetleMarket.setSearchQuery === "function") {
        try {
          JetleMarket.setSearchQuery(filterKeyword);
        } catch (err) {}
      } else {
        applyMainView({ resetShown: true });
      }
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        runHomeSearch();
      });
    }
    if (kwInput) {
      kwInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          runHomeSearch();
        }
      });
    }
    var headerKw = document.getElementById("headerSearchInput");
    if (headerKw) {
      headerKw.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          runHomeSearch();
        }
      });
    }

    var catSel = document.getElementById("homeHeroCategory");
    if (catSel) {
      catSel.addEventListener("change", function () {
        filterCategory = String(catSel.value || "").toLowerCase();
        syncCategoryChips();
        pushUrlFilters();
        applyMainView({ resetShown: true });
      });
    }
    var citySel = document.getElementById("homeHeroCity");
    if (citySel) {
      citySel.addEventListener("change", function () {
        filterCity = citySel.value || "";
        pushUrlFilters();
        applyMainView({ resetShown: true });
      });
    }

    document.querySelectorAll(".home-cat-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        filterCategory = chip.getAttribute("data-home-cat") || "";
        syncCategoryChips();
        syncHeroCategorySelect();
        pushUrlFilters();
        applyMainView({ resetShown: true });
      });
    });

    document.querySelectorAll(".home-cat-block").forEach(function (blk) {
      blk.addEventListener("click", function () {
        filterCategory = blk.getAttribute("data-home-cat") || "";
        syncCategoryChips();
        syncHeroCategorySelect();
        pushUrlFilters();
        applyMainView({ resetShown: true });
      });
    });

    window.addEventListener("jetle-home-api-search", function (ev) {
      var q = ev && ev.detail && ev.detail.q != null ? String(ev.detail.q) : "";
      filterKeyword = q;
      syncSearchInputs();
      pushUrlFilters();
      syncCategoryChips();
      syncHeroCategorySelect();
      if (listingsFetchSettled) applyMainView({ resetShown: true });
    });

    wireLoadMore(grid, info);
  }

  function loadHomeListingsFromApi() {
    if (!document.body || document.body.getAttribute("data-page") !== "home") return;

    if (!window.__JETLE_HOME_FAV_LISTENER__) {
      window.__JETLE_HOME_FAV_LISTENER__ = true;
      window.addEventListener("jetle-favorites-changed", syncApiFeedFavoriteUi);
    }

    var grid = document.getElementById("listingsGrid");
    var info = document.getElementById("resultsInfo");

    if (!grid) return;

    wireHomeListingsRetryOnce();

    homeListingsLastErrorMsg = "";
    homeListingsFetchFailed = false;
    syncHomeListingsRetryButton();

    readUrlFilters();
    syncSearchInputs();
    syncCategoryChips();
    listingsFetchSettled = false;
    wireMarketplaceOnce(grid, info);
    renderGridSkeleton(grid, HOME_INITIAL_RENDER_COUNT);

    var url = resolveListingsUrl();

    syncHomeListingsLoadingBar(true, "Liste yükleniyor…");
    if (info) info.textContent = "Liste yükleniyor…";

    var cachedRows = readCachedRows();
    var hadCacheThisLoad = cachedRows.length > 0;
    if (hadCacheThisLoad) {
      apiRows = cachedRows;
      homeListingsFetchFailed = false;
      listingsFetchSettled = true;
      applyMainView({ resetShown: true });
      syncHomeListingsLoadingBar(false, "Liste yükleniyor…");
      if (info) info.textContent = "Güncel liste alınıyor…";
    }

    var fetchHeaders = { Accept: "application/json" };
    try {
      if (window.JetleAPI && typeof JetleAPI.buildFetchAuthHeaders === "function") {
        fetchHeaders = JetleAPI.buildFetchAuthHeaders({}, {});
      } else {
        var tk0 = localStorage.getItem("token") || localStorage.getItem("jetle_v2_access_token") || "";
        if (tk0) fetchHeaders.Authorization = "Bearer " + tk0;
      }
    } catch (eh) {}

    fetch(url, {
      method: "GET",
      credentials: "omit",
      cache: "force-cache",
      headers: fetchHeaders
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Sunucu yanıtı: HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        var rows = normalizeRows(json);
        shownCount = 0;
        listingsFetchSettled = true;

        syncHomeListingsLoadingBar(false, "Liste yükleniyor…");

        var fromUi = readKeywordFromUi();
        if (fromUi) filterKeyword = fromUi;

        homeListingsFetchFailed = false;
        homeListingsLastErrorMsg = "";
        if (rows.length === 0) {
          apiRows = [];
        } else {
          apiRows = rows;
          writeCachedRows(rows);
        }

        applyMainView({ resetShown: true });
        setTimeout(function () {
          syncHeroCityFromSidebar();
          syncHomeHeroCitySelect();
          var hc = document.getElementById("homeHeroCity");
          if (hc && window.JetleTrCitiesUI && typeof JetleTrCitiesUI.refresh === "function") JetleTrCitiesUI.refresh(hc);
        }, 0);
        setTimeout(function () {
          syncHeroCityFromSidebar();
          syncHomeHeroCitySelect();
          var hc2 = document.getElementById("homeHeroCity");
          if (hc2 && window.JetleTrCitiesUI && typeof JetleTrCitiesUI.refresh === "function") JetleTrCitiesUI.refresh(hc2);
        }, 650);
      })
      .catch(function (err) {
        if (window.JetleCommon && typeof JetleCommon.showToast === "function") {
          JetleCommon.showToast("Bir hata oluştu.", "error");
        }
        syncHomeListingsLoadingBar(false, "Liste yükleniyor…");
        homeListingsLastErrorMsg = err && err.message ? String(err.message) : "Ağ hatası.";
        if (hadCacheThisLoad && apiRows.length) {
          homeListingsFetchFailed = false;
          listingsFetchSettled = true;
          if (info) info.textContent = "Canlı liste alınamadı; önbellekteki kayıtlar gösteriliyor.";
          applyMainView({ resetShown: true });
          return;
        }
        apiRows = [];
        homeListingsFetchFailed = true;
        shownCount = 0;
        listingsFetchSettled = true;
        if (info) info.textContent = "";
        applyMainView({ resetShown: true });
      });
  }

  function wireHomeListingsRetryOnce() {
    var btn = document.getElementById("homeListingsRetryBtn");
    if (!btn || btn.getAttribute("data-wired") === "1") return;
    btn.setAttribute("data-wired", "1");
    btn.addEventListener("click", function () {
      homeListingsFetchFailed = false;
      homeListingsLastErrorMsg = "";
      loadHomeListingsFromApi();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHomeListingsFromApi);
  } else {
    loadHomeListingsFromApi();
  }
})();
