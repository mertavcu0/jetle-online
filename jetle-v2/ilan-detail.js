/**
 * İlan detay — URL ?id= ile API listesinden ilanı bulur ve DOM'a yazar.
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

  function getQueryId() {
    try {
      var q = new URLSearchParams(window.location.search);
      var raw = q.get("id");
      return raw != null && String(raw).trim() !== "" ? String(raw).trim() : "";
    } catch (e) {
      return "";
    }
  }

  function normalizeRows(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload.data && Array.isArray(payload.data)) return payload.data;
    if (payload.ok && Array.isArray(payload.data)) return payload.data;
    return [];
  }

  function rowId(row) {
    if (row.id != null) return String(row.id);
    if (row._id != null) return String(row._id);
    return "";
  }

  function formatTry(n) {
    var num = Number(n);
    if (!Number.isFinite(num)) return "—";
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(num) + " ₺";
  }

  function collectImageUrls(item) {
    var urls = [];
    var seen = {};

    function add(u) {
      if (!u || typeof u !== "string") return;
      var s = u.trim();
      if (!s || seen[s]) return;
      seen[s] = true;
      urls.push(s);
    }

    if (item.coverImage) add(String(item.coverImage));

    if (Array.isArray(item.images)) {
      item.images.forEach(function (u) {
        add(u != null ? String(u) : "");
      });
    }

    var media = item.media;
    if (media && Array.isArray(media.images)) {
      media.images.forEach(function (im) {
        if (!im || typeof im !== "object") return;
        add(im.mediumUrl || im.originalUrl || im.thumbUrl || "");
      });
    }

    return urls;
  }

  function setVisible(el, show) {
    if (!el) return;
    el.hidden = !show;
  }

  function loadDetail() {
    var loading = document.getElementById("detailLoading");
    var errBox = document.getElementById("detailError");
    var errText = document.getElementById("detailErrorText");
    var root = document.getElementById("detailRoot");
    var titleEl = document.getElementById("detailTitle");
    var priceEl = document.getElementById("detailPrice");
    var cityEl = document.getElementById("detailCity");
    var descEl = document.getElementById("detailDescription");
    var imagesEl = document.getElementById("detailImages");

    if (!root || !titleEl || !priceEl || !cityEl || !descEl || !imagesEl) return;

    var id = getQueryId();
    if (!id) {
      setVisible(loading, false);
      setVisible(errBox, true);
      if (errText) errText.textContent = "Geçersiz veya eksik ilan numarası (?id=).";
      return;
    }

    var url = resolveListingsUrl();

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
        var item = null;
        for (var i = 0; i < rows.length; i++) {
          if (rowId(rows[i]) === id) {
            item = rows[i];
            break;
          }
        }

        setVisible(loading, false);

        if (!item) {
          setVisible(errBox, true);
          if (errText) errText.textContent = "Bu ilan bulunamadı veya kaldırılmış olabilir.";
          return;
        }

        setVisible(errBox, false);
        setVisible(root, true);

        titleEl.textContent = item.title != null ? String(item.title) : "İsimsiz ilan";
        priceEl.textContent = formatTry(item.price);
        var city =
          item.city != null
            ? String(item.city)
            : item.location && item.location.city
              ? String(item.location.city)
              : "—";
        cityEl.textContent = city;
        descEl.textContent = item.description != null ? String(item.description) : "";

        imagesEl.innerHTML = "";
        var imgs = collectImageUrls(item);
        imgs.forEach(function (src) {
          var img = document.createElement("img");
          img.src = src;
          img.alt = titleEl.textContent || "İlan görseli";
          img.loading = "lazy";
          img.decoding = "async";
          imagesEl.appendChild(img);
        });
      })
      .catch(function (err) {
        console.error("[JETLE][ilan-detail]", err);
        setVisible(loading, false);
        setVisible(errBox, true);
        if (errText) errText.textContent = "İlanlar yüklenirken bir hata oluştu. Daha sonra tekrar deneyin.";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadDetail);
  } else {
    loadDetail();
  }
})();
