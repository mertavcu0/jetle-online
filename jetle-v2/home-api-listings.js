/**
 * Ana sayfa — Railway /api/listings ile ilanları çeker, "Tüm ilanlar" grid'ini doldurur.
 */
(function () {
  "use strict";

  var DEFAULT_LISTINGS_URL = "https://jetle-online-production.up.railway.app/api/listings";

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

  function escHtml(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatTry(n) {
    var num = Number(n);
    if (!Number.isFinite(num)) return "—";
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(num) + " ₺";
  }

  function slugifyTitle(t) {
    return String(t || "")
      .toLowerCase()
      .trim()
      .replace(/[ıİğĞüÜşŞöÖçÇ]/g, function (ch) {
        var m = { ı: "i", İ: "i", ğ: "g", Ğ: "g", ü: "u", Ü: "u", ş: "s", Ş: "s", ö: "o", Ö: "o", ç: "c", Ç: "c" };
        return m[ch] || ch;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function detailUrl(id, title) {
    var slug = slugifyTitle(title);
    return "ilan-detay.html?id=" + encodeURIComponent(id) + (slug ? "&slug=" + encodeURIComponent(slug) : "");
  }

  function normalizeRows(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload.data && Array.isArray(payload.data)) return payload.data;
    if (payload.ok && Array.isArray(payload.data)) return payload.data;
    return [];
  }

  function renderCards(grid, rows) {
    grid.innerHTML = "";
    rows.forEach(function (item) {
      var id = item.id != null ? String(item.id) : item._id != null ? String(item._id) : "";
      var title = item.title != null ? String(item.title) : "İsimsiz ilan";
      var city =
        item.city != null
          ? String(item.city)
          : item.location && item.location.city
            ? String(item.location.city)
            : "—";

      var art = document.createElement("article");
      art.className = "listing-card listing-card--api-feed";
      art.setAttribute("data-listing-id", id || "");

      var link = document.createElement("a");
      link.className = "listing-card__link listing-card__link--api";
      link.href = id ? detailUrl(id, title) : "#";

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
      link.appendChild(body);
      art.appendChild(link);
      grid.appendChild(art);
    });
  }

  function setEmptyState(emptyBox, titleEl, subEl, show, titleText, subText) {
    if (!emptyBox) return;
    emptyBox.hidden = !show;
    if (titleEl && titleText != null) titleEl.textContent = titleText;
    if (subEl && subText != null) subEl.textContent = subText;
  }

  function loadHomeListingsFromApi() {
    if (!document.body || document.body.getAttribute("data-page") !== "home") return;

    var grid = document.getElementById("listingsGrid");
    var emptyBox = document.getElementById("emptyResults");
    var emptyTitle = document.getElementById("emptyResultsTitle");
    var emptySub = document.getElementById("emptyResultsSub");
    var info = document.getElementById("resultsInfo");

    if (!grid) return;

    var url = resolveListingsUrl();

    if (info) info.textContent = "İlanlar yükleniyor…";

    fetch(url, {
      method: "GET",
      credentials: "omit",
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        var rows = normalizeRows(json);
        if (info) info.textContent = "Toplam " + rows.length + " ilan";

        if (rows.length === 0) {
          grid.innerHTML = "";
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

        setEmptyState(emptyBox, emptyTitle, emptySub, false, "", "");
        renderCards(grid, rows);
      })
      .catch(function (err) {
        console.log("[JETLE][home-api-listings]", err);
        grid.innerHTML = "";
        if (info) info.textContent = "İlanlar yüklenemedi";
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
