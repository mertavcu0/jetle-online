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
  var HOME_INITIAL_RENDER_COUNT = 6;
  var HOME_LAZY_BATCH_SIZE = 6;
  var HOME_CACHE_KEY = "jetle_home_listings_cache_v1";
  var HOME_CACHE_TTL_MS = 2 * 60 * 1000;
  var MAX_RENDERED_CARDS = 30;
  var EST_CARD_ROW_HEIGHT = 332;
  var CARD_IMG_W = 280;
  var CARD_IMG_H = 210;
  var DESC_MAX = 140;

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

  function idKey(item) {
    if (!item || typeof item !== "object") return "";
    if (item._id != null) return String(item._id);
    if (item.id != null) return String(item.id);
    return "";
  }

  function selectFeaturedList(rows) {
    var r = rows || [];
    var promoted = r
      .filter(isPromotedListing)
      .sort(function (a, b) {
        return promotedSortKey(b) - promotedSortKey(a);
      });
    var picked = promoted.slice(0, 6);
    var used = {};
    picked.forEach(function (x) {
      used[idKey(x)] = true;
    });
    if (picked.length < 4) {
      for (var i = 0; i < r.length && picked.length < 6; i++) {
        var k = idKey(r[i]);
        if (k && used[k]) continue;
        if (k) used[k] = true;
        picked.push(r[i]);
      }
    }
    if (picked.length === 0 && r.length) {
      picked = r.slice(0, 6).map(function (x) {
        return Object.assign({ featured: true }, x);
      });
    }
    return picked.slice(0, 6);
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
      if (u.searchParams.has("cat")) filterCategory = (u.searchParams.get("cat") || "").toLowerCase();
      if (u.searchParams.has("city")) filterCity = u.searchParams.get("city") || "";
    } catch (err) {}
  }

  function pushUrlFilters() {
    try {
      var u = new URL(window.location.href);
      var q = String(filterKeyword || "").trim();
      if (q) u.searchParams.set("q", q);
      else u.searchParams.delete("q");
      if (filterCategory) u.searchParams.set("cat", filterCategory);
      else u.searchParams.delete("cat");
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
    var images = {
      araba: "images/car.jpg",
      emlak: "images/house.jpg",
      elektronik: "images/phone.jpg",
      hizmet: "images/service.jpg"
    };
    var key = String(category || "").toLocaleLowerCase("tr-TR").trim();
    return images[key] || "images/default.jpg";
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

  /** API’de kurumsal işareti varsa veya id’ye göre kararlı “rastgele” (~%25). */
  function showKurumsalBadge(item) {
    if (!item || typeof item !== "object") return false;
    var raw = item.sellerType || item.sellerProfileType || item.profileType || item.accountType || item.sellerCategory || "";
    if (raw && /kurumsal/i.test(String(raw))) return true;
    var key = idKey(item) || String(item.title || item.listingNo || "");
    return hashStr(key) % 4 === 1;
  }

  function cityLabel(item) {
    if (!item || typeof item !== "object") return "—";
    var c = item.city != null ? String(item.city).trim() : "";
    if (item.location && typeof item.location === "object" && item.location.city) {
      c = c || String(item.location.city).trim();
    }
    return c || "—";
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
    return "ilan-detail.html?id=" + encodeURIComponent(id);
  }

  function gridListingHref(id) {
    if (!id) return "index.html";
    return detailPageHref(id);
  }

  function isPromotedListing(item) {
    if (!item || typeof item !== "object") return false;
    return !!(item.featured || item.showcase || item.sponsored || item.urgent || item.highlight);
  }

  function promotedSortKey(item) {
    var s = 0;
    if (item.urgent) s += 8;
    if (item.showcase) s += 4;
    if (item.featured) s += 2;
    if (item.highlight) s += 1;
    if (item.sponsored) s += 1;
    return s;
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

  function appendPromotionBadges(host, item) {
    if (!host || !item) return;
    var hasRealBadge = !!(item.urgent || item.showcase || item.featured);
    if (item.urgent) {
      var u = document.createElement("span");
      u.className = "jetle-badge jetle-badge--acil";
      u.textContent = "Acil";
      host.appendChild(u);
    }
    if (item.showcase) {
      var v = document.createElement("span");
      v.className = "jetle-badge jetle-badge--vitrin";
      v.textContent = "Vitrin";
      host.appendChild(v);
    }
    if (item.featured) {
      var f = document.createElement("span");
      f.className = "jetle-badge jetle-badge--one";
      f.textContent = "Öne çıkan";
      host.appendChild(f);
    }
    if (!hasRealBadge) {
      // Kararlı "random": aynı ilan her yüklemede aynı etiketi alır.
      var rk = hashStr(idKey(item) || item.title || item.description || "");
      if (rk % 7 === 0) {
        var ra = document.createElement("span");
        ra.className = "jetle-badge jetle-badge--acil";
        ra.textContent = "Acil";
        host.appendChild(ra);
      } else if (rk % 7 === 1) {
        var rv = document.createElement("span");
        rv.className = "jetle-badge jetle-badge--vitrin";
        rv.textContent = "Vitrin";
        host.appendChild(rv);
      }
    }
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

  function getFilteredRows() {
    return apiRows.filter(function (item) {
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
      var h = document.getElementById("allHeading");
      var label = document.getElementById("allHeadingLabel");
      var t = "İlanlar";
      if (label) label.textContent = t;
      else if (h) h.textContent = t;
    } catch (e) {}
  }

  function buildFeaturedCard(item) {
    var id = idKey(item);
    var title = item.title != null ? String(item.title) : "İsimsiz ilan";
    var loc = locationLine(item);

    var link = document.createElement("a");
    link.className = "featured-card featured-card--premium";
    link.href = featuredCardHref(item);
    if (id) link.setAttribute("data-listing-id", id);

    var wrap = document.createElement("div");
    wrap.className = "featured-card__media-wrap";

    var badgeOne = document.createElement("span");
    badgeOne.className = "featured-card__badge-one";
    badgeOne.textContent = "Öne Çıkan";
    wrap.appendChild(badgeOne);

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
    var rowEl = document.getElementById("homeFeaturedRow");
    var emptyEl = document.getElementById("homeFeaturedEmpty");
    if (!rowEl || !emptyEl) return;

    var list = selectFeaturedList(rows || []);

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

  function buildCard(item) {
    var id = item._id != null ? String(item._id) : item.id != null ? String(item.id) : "";
    var title = item.title != null ? String(item.title) : "İsimsiz ilan";
    var descShort = shortDescription(item.description);

    var art = document.createElement("article");
    art.className = "listing-card listing-card--api-feed";
    if (id) {
      art.setAttribute("data-id", id);
      art.setAttribute("data-listing-id", id);
      art.style.cursor = "pointer";
      art.setAttribute("role", "link");
      art.setAttribute("tabindex", "0");
      art.addEventListener("click", function () {
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
    var fallbackWebp = toWebpCandidate(fallbackByCat);
    var mediaWrap = document.createElement("div");
    mediaWrap.className = "listing-card__media-wrap";
    if (showKurumsalBadge(item)) {
      var kurumsal = document.createElement("span");
      kurumsal.className = "listing-card__kurumsal-badge";
      kurumsal.textContent = "Kurumsal";
      kurumsal.setAttribute("aria-hidden", "true");
      mediaWrap.appendChild(kurumsal);
    }
    var badges = document.createElement("div");
    badges.className = "jetle-badges";
    appendPromotionBadges(badges, item);
    if (badges.firstChild) mediaWrap.appendChild(badges);

    if (thumb) {
      var media = document.createElement("div");
      media.className = "listing-card__media";
      var img = document.createElement("img");
      var primary = item.image || thumbWebp || thumb || fallbackWebp || fallbackByCat;
      var backup = item.image || thumb || fallbackByCat;
      img.src = primary;
      if (primary !== backup) {
        img.onerror = function () {
          img.onerror = null;
          img.src = backup;
        };
      }
      img.alt = title;
      img.width = CARD_IMG_W;
      img.height = CARD_IMG_H;
      img.loading = "lazy";
      img.decoding = "async";
      img.fetchPriority = "low";
      media.appendChild(img);
      mediaWrap.appendChild(media);
    } else {
      var mediaNoThumb = document.createElement("div");
      mediaNoThumb.className = "listing-card__media";
      var imgNoThumb = document.createElement("img");
      var primaryNoThumb = item.image || fallbackWebp || fallbackByCat;
      var backupNoThumb = item.image || fallbackByCat;
      imgNoThumb.src = primaryNoThumb;
      if (primaryNoThumb !== backupNoThumb) {
        imgNoThumb.onerror = function () {
          imgNoThumb.onerror = null;
          imgNoThumb.src = backupNoThumb;
        };
      }
      imgNoThumb.alt = title;
      imgNoThumb.width = CARD_IMG_W;
      imgNoThumb.height = CARD_IMG_H;
      imgNoThumb.loading = "lazy";
      imgNoThumb.decoding = "async";
      imgNoThumb.fetchPriority = "low";
      mediaNoThumb.appendChild(imgNoThumb);
      mediaWrap.appendChild(mediaNoThumb);
    }
    inner.appendChild(mediaWrap);

    var body = document.createElement("div");
    body.className = "listing-card__body";

    var titleEl = document.createElement("h3");
    titleEl.className = "listing-card__title";
    titleEl.textContent = title;

    var priceEl = document.createElement("div");
    priceEl.className = "listing-card__price";
    priceEl.textContent = formatTry(item.price);

    var meta = document.createElement("p");
    meta.className = "listing-card__meta listing-card__meta--citytime listing-card__meta--loc";
    meta.textContent = cityAndTimeLine(item);

    body.appendChild(titleEl);
    body.appendChild(priceEl);
    body.appendChild(meta);

    // DOM yükünü azaltmak için kartta açıklama satırını render etmiyoruz.

    inner.appendChild(body);
    art.appendChild(inner);
    return art;
  }

  function setEmptyState(emptyBox, titleEl, subEl, show, titleText, subText) {
    if (!emptyBox) return;
    emptyBox.hidden = !show;
    if (titleEl && titleText != null) titleEl.textContent = titleText;
    if (subEl && subText != null) subEl.textContent = subText;
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
    var retryBtn = document.getElementById("homeListingsRetryBtn");
    if (!retryBtn) return;
    var emptyBox = document.getElementById("emptyResults");
    var show = !!(emptyBox && !emptyBox.hidden && homeListingsFetchFailed);
    retryBtn.hidden = !show;
  }

  function updateResultsInfo(infoEl, totalFiltered, shown) {
    if (!infoEl) return;
    if (totalFiltered === 0) {
      infoEl.textContent = "";
      return;
    }
    if (shown >= totalFiltered) {
      infoEl.textContent = "Toplam " + totalFiltered + " ilan";
    } else {
      infoEl.textContent = "Gösterilen " + shown + " / " + totalFiltered + " ilan";
    }
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
    if (window.matchMedia("(min-width: 1100px)").matches) return 4;
    if (window.matchMedia("(min-width: 768px)").matches) return 3;
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
    var n = Math.max(0, Number(count) || 0);
    if (!n) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var sk = document.createElement("article");
      sk.className = "listing-card listing-card--api-feed is-skeleton";
      sk.setAttribute("aria-hidden", "true");
      sk.innerHTML =
        '<div class="listing-card__media"></div>' +
        '<div class="listing-card__body">' +
        '<div class="listing-skel-line listing-skel-line--title"></div>' +
        '<div class="listing-skel-line listing-skel-line--price"></div>' +
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

  function applyMainView(opts) {
    opts = opts || {};
    var resetShown = opts.resetShown !== false;
    if (!listingsFetchSettled) return;

    var grid = document.getElementById("listingsGrid");
    var emptyBox = document.getElementById("emptyResults");
    var emptyTitle = document.getElementById("emptyResultsTitle");
    var emptySub = document.getElementById("emptyResultsSub");
    var info = document.getElementById("resultsInfo");

    if (!grid) return;

    renderFeaturedStrip(apiRows);
    syncHomeSectionHeading();

    var displayRows = getGridDisplayRows();

    if (displayRows.length === 0) {
      grid.innerHTML = "";
      shownCount = 0;
      updatePager(0, 0);
      var hasRows = apiRows.length > 0;
      if (hasRows) {
        setEmptyState(
          emptyBox,
          emptyTitle,
          emptySub,
          true,
          "Sonuç bulunamadı",
          "No listings found — aramanız veya filtrelerinizle eşleşen ilan yok. Filtreleri temizleyip tekrar deneyin."
        );
      } else if (homeListingsFetchFailed) {
        setEmptyState(
          emptyBox,
          emptyTitle,
          emptySub,
          true,
          "İlanlar yüklenemedi",
          (homeListingsLastErrorMsg ? homeListingsLastErrorMsg + " " : "") +
            "Bağlantınızı kontrol edin veya «Tekrar dene» ile yenileyin."
        );
      } else {
        setEmptyState(
          emptyBox,
          emptyTitle,
          emptySub,
          true,
          "Henüz ilan yok",
          "No listings yet — yeni ilanlar eklendiğinde burada görünecek."
        );
      }
      if (info) info.textContent = "";
      syncHomeListingsRetryButton();
      return;
    }

    setEmptyState(emptyBox, emptyTitle, emptySub, false, "", "");
    syncHomeListingsRetryButton();

    if (resetShown) {
      virtualTopTrimmedRows = 0;
      shownCount = Math.min(HOME_INITIAL_RENDER_COUNT, displayRows.length);
      grid.innerHTML = "";
      var topSpacer = ensureTopSpacer(grid);
      if (topSpacer) topSpacer.style.height = "0px";
      appendPage(grid, displayRows.slice(0, shownCount));
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
    var toolbar = document.getElementById("homeMarketToolbar");
    if (!toolbar || toolbar.getAttribute("data-wired") === "1") return;
    toolbar.setAttribute("data-wired", "1");

    var kwInput = document.getElementById("homeListingKeyword");
    var searchBtn = document.getElementById("homeListingSearchBtn");

    function runHomeSearch() {
      var catEl = document.getElementById("homeHeroCategory");
      var cityEl = document.getElementById("homeHeroCity");
      if (catEl) filterCategory = String(catEl.value || "").toLowerCase();
      if (cityEl) filterCity = cityEl.value || "";
      if (kwInput) filterKeyword = kwInput.value || "";
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

    var grid = document.getElementById("listingsGrid");
    var emptyBox = document.getElementById("emptyResults");
    var emptyTitle = document.getElementById("emptyResultsTitle");
    var emptySub = document.getElementById("emptyResultsSub");
    var info = document.getElementById("resultsInfo");

    if (!grid) return;

    wireHomeListingsRetryOnce();

    homeListingsLastErrorMsg = "";
    homeListingsFetchFailed = false;
    setEmptyState(emptyBox, emptyTitle, emptySub, false, "", "");
    syncHomeListingsRetryButton();

    readUrlFilters();
    syncSearchInputs();
    syncCategoryChips();
    listingsFetchSettled = false;
    wireMarketplaceOnce(grid, info);
    renderGridSkeleton(grid, HOME_INITIAL_RENDER_COUNT);

    var url = resolveListingsUrl();

    syncHomeListingsLoadingBar(true, "İlanlar yükleniyor…");
    if (info) info.textContent = "İlanlar yükleniyor…";

    var cachedRows = readCachedRows();
    var hadCacheThisLoad = cachedRows.length > 0;
    if (hadCacheThisLoad) {
      apiRows = cachedRows;
      homeListingsFetchFailed = false;
      listingsFetchSettled = true;
      applyMainView({ resetShown: true });
      syncHomeListingsLoadingBar(false, "İlanlar yükleniyor…");
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

        syncHomeListingsLoadingBar(false, "İlanlar yükleniyor…");

        var kwInput = document.getElementById("homeListingKeyword");
        if (kwInput && String(kwInput.value || "").trim()) {
          filterKeyword = kwInput.value || "";
        }

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
        }, 0);
        setTimeout(function () {
          syncHeroCityFromSidebar();
          syncHomeHeroCitySelect();
        }, 650);
      })
      .catch(function (err) {
        if (window.console && typeof window.console.warn === "function") {
          console.warn("[JETLE][home-api-listings]", err && err.message ? err.message : err);
        }
        syncHomeListingsLoadingBar(false, "İlanlar yükleniyor…");
        homeListingsLastErrorMsg = err && err.message ? String(err.message) : "Ağ hatası.";
        if (hadCacheThisLoad && apiRows.length) {
          homeListingsFetchFailed = false;
          listingsFetchSettled = true;
          if (info) info.textContent = "Canlı liste alınamadı; önbellekteki ilanlar gösteriliyor.";
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
