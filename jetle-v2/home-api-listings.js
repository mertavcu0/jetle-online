/**
 * Ana sayfa — API ilanları: ilk ekranda sınırlı sayı, küçük görsel, sayfalama / daha fazla.
 */
(function () {
  "use strict";

  var DEFAULT_LISTINGS_URL = "https://jetle-online-production.up.railway.app/api/listings";
  var HOME_PAGE_SIZE = 16;
  var CARD_IMG_W = 320;
  var CARD_IMG_H = 240;

  var cachedRows = null;
  var shownCount = 0;

  function resolveListingsUrl() {
    try {
      var meta = document.querySelector('meta[name="jetle-api-base"]');
      var base = meta && meta.getAttribute("content");
      if (base && String(base).trim()) {
        return String(base).trim().replace(/\/+$/, "") + "/api/listings";
      }
    } catch (e) {}
    return DEFAULT_LISTINGS_URL;
  }

  function normalizeRows(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload.data && Array.isArray(payload.data)) return payload.data;
    if (payload.ok && Array.isArray(payload.data)) return payload.data;
    return [];
  }

  /** Kart için küçük görsel URL (detayda tam boy kullanılır). */
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

  function formatTry(n) {
    var num = Number(n);
    if (!Number.isFinite(num)) return "—";
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(num) + " ₺";
  }

  function detailPageHref(id) {
    return "ilan-detail.html?id=" + encodeURIComponent(id);
  }

  function isPromotedListing(item) {
    if (!item || typeof item !== "object") return false;
    return !!(item.featured || item.showcase || item.sponsored);
  }

  function promotedSortKey(item) {
    var s = 0;
    if (item.showcase) s += 4;
    if (item.featured) s += 2;
    if (item.sponsored) s += 1;
    return s;
  }

  function buildFeaturedCard(item) {
    var id = item._id != null ? String(item._id) : item.id != null ? String(item.id) : "";
    var title = item.title != null ? String(item.title) : "İsimsiz ilan";
    var city =
      item.city != null
        ? String(item.city)
        : item.location && item.location.city
          ? String(item.location.city)
          : "—";

    var link = document.createElement("a");
    link.className = "featured-card";
    link.href = detailPageHref(id);
    if (id) link.setAttribute("data-listing-id", id);

    var badge = document.createElement("span");
    badge.className = "badge-doping";
    badge.textContent = "Doping";
    link.appendChild(badge);

    var thumb = pickThumbUrl(item);
    if (thumb) {
      var media = document.createElement("div");
      media.className = "featured-card__media";
      var img = document.createElement("img");
      img.src = thumb;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);
      link.appendChild(media);
    } else {
      var ph = document.createElement("div");
      ph.className = "featured-card__media";
      ph.setAttribute("aria-hidden", "true");
      link.appendChild(ph);
    }

    var body = document.createElement("div");
    body.className = "featured-card__body";

    var priceEl = document.createElement("div");
    priceEl.className = "featured-card__price";
    priceEl.textContent = formatTry(item.price);

    var titleEl = document.createElement("p");
    titleEl.className = "featured-card__title";
    titleEl.textContent = title;

    var meta = document.createElement("p");
    meta.className = "featured-card__meta";
    meta.textContent = city;

    body.appendChild(priceEl);
    body.appendChild(titleEl);
    body.appendChild(meta);
    link.appendChild(body);

    return link;
  }

  function renderFeaturedStrip(rows) {
    var rowEl = document.getElementById("homeFeaturedRow");
    var emptyEl = document.getElementById("homeFeaturedEmpty");
    if (!rowEl || !emptyEl) return;

    var list = (rows || [])
      .filter(isPromotedListing)
      .sort(function (a, b) {
        return promotedSortKey(b) - promotedSortKey(a);
      })
      .slice(0, 24);

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
    var city =
      item.city != null
        ? String(item.city)
        : item.location && item.location.city
          ? String(item.location.city)
          : "—";

    var art = document.createElement("article");
    art.className = "listing-card listing-card--api-feed";
    if (id) {
      art.setAttribute("data-id", id);
      art.setAttribute("data-listing-id", id);
      art.style.cursor = "pointer";
      art.setAttribute("role", "link");
      art.setAttribute("tabindex", "0");
      art.addEventListener("click", function () {
        window.location.href = detailPageHref(id);
      });
      art.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = detailPageHref(id);
        }
      });
    }

    var inner = document.createElement("div");
    inner.className = "listing-card__link listing-card__link--api";

    var thumb = pickThumbUrl(item);
    if (thumb) {
      var media = document.createElement("div");
      media.className = "listing-card__media";
      var img = document.createElement("img");
      img.src = thumb;
      img.alt = title;
      img.width = CARD_IMG_W;
      img.height = CARD_IMG_H;
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);
      inner.appendChild(media);
    }

    var body = document.createElement("div");
    body.className = "listing-card__body";

    var priceEl = document.createElement("div");
    priceEl.className = "listing-card__price";
    priceEl.textContent = formatTry(item.price);

    var titleEl = document.createElement("h3");
    titleEl.className = "listing-card__title";
    titleEl.textContent = title;

    var meta = document.createElement("p");
    meta.className = "listing-card__meta listing-card__meta--city";
    meta.textContent = city;

    body.appendChild(priceEl);
    body.appendChild(titleEl);
    body.appendChild(meta);
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

  function updateResultsInfo(infoEl, total, shown) {
    if (!infoEl) return;
    if (total === 0) return;
    if (shown >= total) {
      infoEl.textContent = "Toplam " + total + " ilan";
    } else {
      infoEl.textContent = "Gösterilen " + shown + " / " + total + " ilan";
    }
  }

  function updatePager(total, shown) {
    var pager = document.getElementById("listingsPager");
    if (!pager) return;
    pager.hidden = total === 0 || shown >= total;
  }

  function appendPage(grid, rows) {
    rows.forEach(function (item) {
      grid.appendChild(buildCard(item));
    });
  }

  function wireLoadMore(grid, info) {
    var btn = document.getElementById("listingsLoadMore");
    if (!btn || btn.getAttribute("data-wired") === "1") return;
    btn.setAttribute("data-wired", "1");
    btn.addEventListener("click", function () {
      if (!cachedRows || shownCount >= cachedRows.length) return;
      var next = cachedRows.slice(shownCount, shownCount + HOME_PAGE_SIZE);
      shownCount += next.length;
      appendPage(grid, next);
      updateResultsInfo(info, cachedRows.length, shownCount);
      updatePager(cachedRows.length, shownCount);
    });
  }

  function loadHomeListingsFromApi() {
    if (!document.body || document.body.getAttribute("data-page") !== "home") return;

    var grid = document.getElementById("listingsGrid");
    var emptyBox = document.getElementById("emptyResults");
    var emptyTitle = document.getElementById("emptyResultsTitle");
    var emptySub = document.getElementById("emptyResultsSub");
    var info = document.getElementById("resultsInfo");
    var loadEl = document.getElementById("homeListingsLoading");

    if (!grid) return;

    var url = resolveListingsUrl();

    if (info) info.textContent = "İlanlar yükleniyor…";

    fetch(url, {
      method: "GET",
      credentials: "omit",
      cache: "force-cache",
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        var rows = normalizeRows(json);
        cachedRows = rows;
        shownCount = 0;

        if (loadEl) loadEl.hidden = true;

        if (rows.length === 0) {
          grid.innerHTML = "";
          updatePager(0, 0);
          renderFeaturedStrip([]);
          setEmptyState(
            emptyBox,
            emptyTitle,
            emptySub,
            true,
            "Henüz ilan yok",
            "API şu an boş döndü veya onaylı ilan bulunmuyor."
          );
          return;
        }

        renderFeaturedStrip(rows);

        setEmptyState(emptyBox, emptyTitle, emptySub, false, "", "");

        var first = rows.slice(0, HOME_PAGE_SIZE);
        shownCount = first.length;
        grid.innerHTML = "";
        appendPage(grid, first);

        updateResultsInfo(info, rows.length, shownCount);
        updatePager(rows.length, shownCount);
        wireLoadMore(grid, info);

        try {
          window.__JETLE_HOME_LISTINGS__ = {
            total: rows.length,
            pageSize: HOME_PAGE_SIZE,
            shown: function () {
              return shownCount;
            }
          };
        } catch (e) {}
      })
      .catch(function (err) {
        console.log("[JETLE][home-api-listings]", err);
        grid.innerHTML = "";
        if (loadEl) loadEl.hidden = true;
        cachedRows = null;
        renderFeaturedStrip([]);
        if (info) info.textContent = "İlanlar yüklenemedi";
        updatePager(0, 0);
        setEmptyState(
          emptyBox,
          emptyTitle,
          emptySub,
          true,
          "İlan bulunamadı",
          "API'ye bağlanırken sorun oluştu. Konsolu kontrol edin veya daha sonra tekrar deneyin."
        );
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHomeListingsFromApi);
  } else {
    loadHomeListingsFromApi();
  }
})();
