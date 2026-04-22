/**
 * Jetle V2 — İlan detay: GET /api/listings/:id, sekmeler (tabAc), gruplu özellikler, benzer ilanlar.
 */
(function () {
  "use strict";

  var galleryUrls = [];
  var galleryIndex = 0;

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

  function resolveListingDetailUrl(id) {
    var listUrl = resolveListingsUrl().replace(/\/+$/, "");
    return listUrl + "/" + encodeURIComponent(id);
  }

  function getQueryId() {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var raw = urlParams.get("id");
      return raw != null && String(raw).trim() !== "" ? String(raw).trim() : "";
    } catch (e) {
      return "";
    }
  }

  function unwrapPayload(json) {
    if (json && json.data !== undefined && json.data !== null) return json.data;
    return json;
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

  var TR_MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  /** Örn. 21 Nisan 2026 — createdAt / publishedAt; yoksa — */
  function formatPublishDateTr(item) {
    if (!item || typeof item !== "object") return "—";
    var raw = item.createdAt != null ? item.createdAt : item.publishedAt;
    if (raw == null) return "—";
    var d = new Date(raw);
    if (isNaN(d.getTime())) return "—";
    return d.getDate() + " " + TR_MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  /** Örnek son görülme / aktivite metni (API’de özel alan yoksa tarihe göre). */
  function sellerActivityLabel(item) {
    if (!item || typeof item !== "object") return "Bugün aktif";
    var raw = item.updatedAt != null ? item.updatedAt : item.createdAt;
    if (raw == null) return "Bugün aktif";
    var d = new Date(raw);
    if (isNaN(d.getTime())) return "Bugün aktif";
    var now = Date.now();
    var diffMs = now - d.getTime();
    var diffDays = Math.floor(diffMs / 86400000);
    if (diffDays <= 0) return "Bugün aktif";
    if (diffDays === 1) return "Dün aktifti";
    if (diffDays <= 7) return "Son 7 gün içinde aktif";
    if (diffDays <= 30) return "Son 30 gün içinde aktif";
    return "Yakın zamanda aktif";
  }

  /** wa.me: uluslararası 90 + 10 hane (TR cep). Geçersizse boş string. */
  function buildWhatsAppTurkeyUrl(phone) {
    var d = String(phone || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.indexOf("90") === 0) {
      d = d.slice(0, 12);
    } else if (d.charAt(0) === "0") {
      d = "90" + d.slice(1, 12);
    } else {
      d = "90" + d.slice(0, 10);
    }
    if (!/^905\d{9}$/.test(d)) return "";
    return "https://wa.me/" + d;
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

  function pickThumbForRow(row) {
    var urls = collectImageUrls(row);
    return urls[0] || "";
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

  /** specs nesnesinden ilk dolu değeri döndürür (Türkçe / İngilizce anahtarlar). */
  function pickSpecFromItem(item, keys) {
    if (!item || typeof item !== "object" || !keys || !keys.length) return "";
    var specs = item.specs;
    if (specs && typeof specs === "object" && !Array.isArray(specs)) {
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (!Object.prototype.hasOwnProperty.call(specs, k)) continue;
        var v = specs[k];
        if (v != null && String(v).trim() !== "") return String(v).trim();
      }
      var norm = {};
      Object.keys(specs).forEach(function (key) {
        norm[String(key).toLowerCase().replace(/\s+/g, " ").trim()] = specs[key];
      });
      for (var j = 0; j < keys.length; j++) {
        var kk = String(keys[j]).toLowerCase().replace(/\s+/g, " ").trim();
        if (!Object.prototype.hasOwnProperty.call(norm, kk)) continue;
        var v2 = norm[kk];
        if (v2 != null && String(v2).trim() !== "") return String(v2).trim();
      }
    }
    return "";
  }

  function appendQuickSpecChip(host, symbolId, label, valueText) {
    if (!host || !valueText) return;
    var chip = document.createElement("span");
    chip.className = "ilan-quick-spec";
    chip.setAttribute("role", "listitem");
    chip.setAttribute("title", label + ": " + valueText);
    chip.setAttribute("aria-label", label + ": " + valueText);
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "ilan-quick-spec__icon");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + symbolId);
    svg.appendChild(use);
    var val = document.createElement("span");
    val.className = "ilan-quick-spec__val";
    val.setAttribute("aria-hidden", "true");
    val.textContent = valueText;
    chip.appendChild(svg);
    chip.appendChild(val);
    host.appendChild(chip);
  }

  function renderQuickVehicleSpecStrip(item) {
    var host = document.getElementById("ilanQuickSpecs");
    if (!host) return;
    host.innerHTML = "";
    var yil = pickSpecFromItem(item, ["Yıl", "Model yılı", "year"]);
    var km = pickSpecFromItem(item, ["KM", "Km", "Kilometre", "kilometre"]);
    var yakit = pickSpecFromItem(item, ["Yakıt tipi", "Yakıt", "fuel"]);
    var vites = pickSpecFromItem(item, ["Vites", "Şanzıman", "transmission", "gear"]);
    var rows = [
      { sym: "iqs-cal", label: "Yıl", v: yil },
      { sym: "iqs-km", label: "KM", v: km },
      { sym: "iqs-fuel", label: "Yakıt", v: yakit },
      { sym: "iqs-gear", label: "Vites", v: vites }
    ];
    var n = 0;
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i].v) continue;
      appendQuickSpecChip(host, rows[i].sym, rows[i].label, rows[i].v);
      n++;
    }
    host.hidden = n === 0;
  }

  function setVisible(el, show) {
    if (!el) return;
    el.hidden = !show;
  }

  function setStickyContactBar(show) {
    var bar = document.getElementById("ilanStickyBar");
    if (bar) bar.hidden = !show;
  }

  function bindWhatsAppButton(btn, waUrl) {
    if (!btn) return;
    btn.onclick = null;
    if (waUrl) {
      btn.disabled = false;
      btn.setAttribute("aria-label", "WhatsApp ile yaz");
      btn.onclick = function () {
        window.location.href = waUrl;
      };
    } else {
      btn.disabled = true;
      btn.onclick = null;
      btn.setAttribute("aria-label", "Telefon numarası yok");
    }
  }

  function bindTelCallLink(a, telDigits) {
    if (!a) return;
    a.classList.remove("is-disabled");
    a.removeAttribute("aria-disabled");
    a.style.pointerEvents = "";
    a.style.opacity = "";
    if (telDigits) {
      a.href = "tel:" + telDigits;
      a.textContent = "Ara";
      a.setAttribute("aria-label", "Telefon ile ara");
    } else {
      a.href = "#";
      a.textContent = "Ara";
      a.setAttribute("aria-label", "Telefon numarası yok");
      a.setAttribute("aria-disabled", "true");
      a.classList.add("is-disabled");
    }
  }

  /**
   * API `features`: { "Grup adı": ["madde1", "madde2"], ... }
   * veya `specs`: düz nesne / dizi — gruplu yapıya çevrilir.
   */
  function normalizeGroupedFeatures(features, specs) {
    if (features && typeof features === "object" && !Array.isArray(features)) {
      var keys = Object.keys(features);
      var ok = keys.some(function (k) {
        return Array.isArray(features[k]);
      });
      if (ok) {
        var out = {};
        keys.forEach(function (k) {
          var arr = features[k];
          if (Array.isArray(arr)) {
            out[k] = arr.map(function (x) {
              return String(x != null ? x : "");
            }).filter(Boolean);
          }
        });
        if (Object.keys(out).length) return out;
      }
    }

    if (specs == null) return null;

    if (Array.isArray(specs)) {
      var items = [];
      specs.forEach(function (row) {
        if (!row || typeof row !== "object") return;
        var k = row.label || row.name || row.key || "";
        var v = row.value != null ? String(row.value) : "";
        if (k || v) items.push(k ? k + ": " + v : v);
      });
      return items.length ? { Özellikler: items } : null;
    }

    if (typeof specs === "object") {
      var flat = [];
      Object.keys(specs).forEach(function (key) {
        var val = specs[key];
        if (val != null && typeof val === "object") return;
        flat.push(key + ": " + String(val != null ? val : "—"));
      });
      return flat.length ? { Özellikler: flat } : null;
    }

    return null;
  }

  function renderFeatures(features, specs) {
    var list = document.getElementById("featuresList");
    var emptyEl = document.getElementById("featuresEmpty");
    if (!list) return;

    list.innerHTML = "";
    var grouped = normalizeGroupedFeatures(features, specs);

    if (!grouped || Object.keys(grouped).length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    Object.keys(grouped).forEach(function (group) {
      var wrap = document.createElement("div");
      wrap.className = "ilan-features__group";

      var h4 = document.createElement("h4");
      h4.textContent = group;

      var ul = document.createElement("ul");
      (grouped[group] || []).forEach(function (item) {
        var li = document.createElement("li");
        var line = String(item || "").trim();
        li.textContent = line.indexOf("✔") === 0 ? line : "✔ " + line;
        ul.appendChild(li);
      });

      wrap.appendChild(h4);
      wrap.appendChild(ul);
      list.appendChild(wrap);
    });
  }

  /** Snippet ile uyum: tüm .tab-content gizlenir, seçilen id gösterilir. */
  window.tabAc = function (name) {
    document.querySelectorAll(".tab-content").forEach(function (el) {
      el.style.display = "none";
      el.hidden = true;
    });
    var panel = document.getElementById(name);
    if (panel) {
      panel.style.display = "block";
      panel.hidden = false;
    }

    var showOz = name === "ozellik";
    var b1 = document.getElementById("tabBtnAciklama");
    var b2 = document.getElementById("tabBtnOzellik");
    if (b1) {
      b1.classList.toggle("is-active", !showOz);
      b1.setAttribute("aria-selected", showOz ? "false" : "true");
    }
    if (b2) {
      b2.classList.toggle("is-active", showOz);
      b2.setAttribute("aria-selected", showOz ? "true" : "false");
    }
  };

  function similarCardMetaLine(r) {
    var km = pickSpecFromItem(r, ["KM", "Km", "Kilometre", "kilometre"]);
    var yil = pickSpecFromItem(r, ["Yıl", "Model yılı", "year"]);
    var city = r.city != null ? String(r.city).trim() : "";
    var dist = r.district != null ? String(r.district).trim() : "";
    if (r.location && typeof r.location === "object") {
      if (!city && r.location.city) city = String(r.location.city).trim();
      if (!dist && r.location.district) dist = String(r.location.district).trim();
    }
    var loc = "";
    if (dist && city) loc = dist + ", " + city;
    else if (city) loc = city;
    else if (dist) loc = dist;
    else {
      var line = locationLine(r);
      if (line !== "—") loc = line;
    }
    var parts = [];
    if (km) parts.push(km);
    if (yil) parts.push(yil);
    if (loc) parts.push(loc);
    return parts.join(" • ");
  }

  function renderSimilar(container, rows, currentId, currentItem) {
    if (!container) return;
    container.innerHTML = "";
    var cat = currentItem && currentItem.category != null ? String(currentItem.category) : "";
    var list = rows.filter(function (r) {
      if (rowId(r) === currentId) return false;
      if (!cat) return true;
      var rc = r.category != null ? String(r.category) : "";
      return rc === cat;
    });
    if (list.length === 0) {
      list = rows.filter(function (r) {
        return rowId(r) !== currentId;
      });
    }
    list.slice(0, 6).forEach(function (r) {
      var rid = rowId(r);
      var a = document.createElement("a");
      a.className = "ilan-sim-card";
      a.href = "ilan-detail.html?id=" + encodeURIComponent(rid);
      var media = document.createElement("div");
      media.className = "ilan-sim-card__media";
      var img = document.createElement("img");
      img.className = "ilan-sim-card__img";
      img.alt = r.title != null ? String(r.title) : "İlan görseli";
      img.loading = "lazy";
      var thumb = pickThumbForRow(r);
      if (thumb) img.src = thumb;
      media.appendChild(img);
      var body = document.createElement("div");
      body.className = "ilan-sim-card__body";
      var priceEl = document.createElement("div");
      priceEl.className = "ilan-sim-card__price";
      priceEl.textContent = formatTry(r.price);
      var t = document.createElement("p");
      t.className = "ilan-sim-card__title";
      t.textContent = r.title != null ? String(r.title) : "İlan";
      var meta = document.createElement("p");
      meta.className = "ilan-sim-card__meta";
      var metaText = similarCardMetaLine(r);
      if (metaText) meta.textContent = metaText;
      else meta.hidden = true;
      body.appendChild(priceEl);
      body.appendChild(t);
      body.appendChild(meta);
      a.appendChild(media);
      a.appendChild(body);
      container.appendChild(a);
    });
    if (container.children.length === 0) {
      var p = document.createElement("p");
      p.className = "text-muted text-small";
      p.textContent = "Benzer ilan bulunamadı.";
      container.appendChild(p);
    }
  }

  function wireThumbs(mainImg, thumbRow, urls, title) {
    if (!mainImg || !thumbRow) return;
    var wrap = mainImg.closest ? mainImg.closest(".ilan-images") : null;
    galleryUrls = urls && urls.length ? urls.slice() : [];
    galleryIndex = 0;
    thumbRow.innerHTML = "";
    if (wrap) wrap.classList.toggle("has-gallery", galleryUrls.length > 0);

    if (!urls || urls.length === 0) {
      thumbRow.hidden = true;
      mainImg.removeAttribute("src");
      mainImg.alt = title || "İlan görseli";
      return;
    }
    if (urls.length <= 1) {
      thumbRow.hidden = true;
      mainImg.src = urls[0];
      mainImg.alt = title || "İlan görseli";
      return;
    }
    thumbRow.hidden = false;
    mainImg.src = urls[0];
    mainImg.alt = title || "İlan görseli";
    urls.forEach(function (src, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Görsel " + (idx + 1));
      if (idx === 0) btn.classList.add("is-active");
      var im = document.createElement("img");
      im.src = src;
      im.alt = "";
      btn.appendChild(im);
      btn.addEventListener("click", function () {
        galleryIndex = idx;
        mainImg.src = src;
        thumbRow.querySelectorAll("button").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
      });
      thumbRow.appendChild(btn);
    });
  }

  function initImageLightbox() {
    var lb = document.getElementById("ilanImageLightbox");
    var lbImg = document.getElementById("ilanLightboxImg");
    var mainImg = document.getElementById("ilanMainImage");
    var thumbRow = document.getElementById("ilanThumbRow");
    var btnPrev = document.getElementById("ilanLightboxPrev");
    var btnNext = document.getElementById("ilanLightboxNext");
    if (!lb || !lbImg) return;

    function lightboxAlt() {
      var t = document.getElementById("ilanTitle");
      return t && t.textContent ? t.textContent.trim() || "İlan görseli" : "İlan görseli";
    }

    function syncThumbRowActive() {
      if (!thumbRow || thumbRow.hidden) return;
      var buttons = thumbRow.querySelectorAll("button");
      buttons.forEach(function (b, i) {
        b.classList.toggle("is-active", i === galleryIndex);
      });
      if (mainImg && galleryUrls[galleryIndex]) mainImg.src = galleryUrls[galleryIndex];
    }

    function syncNavVisibility() {
      var multi = galleryUrls.length > 1;
      if (btnPrev) btnPrev.hidden = !multi;
      if (btnNext) btnNext.hidden = !multi;
    }

    function updateLightboxImage() {
      var u = galleryUrls[galleryIndex];
      if (u) lbImg.src = u;
      lbImg.alt = lightboxAlt();
      syncNavVisibility();
      syncThumbRowActive();
    }

    function closeLightbox() {
      lb.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      lbImg.removeAttribute("src");
    }

    function openLightbox(index) {
      if (!galleryUrls.length) return;
      galleryIndex = Math.max(0, Math.min(galleryUrls.length - 1, index == null ? 0 : index));
      updateLightboxImage();
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKeyDown);
    }

    function stepLightbox(delta) {
      if (galleryUrls.length <= 1) return;
      galleryIndex = (galleryIndex + delta + galleryUrls.length) % galleryUrls.length;
      updateLightboxImage();
    }

    function onKeyDown(ev) {
      if (lb.hidden) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        closeLightbox();
      } else if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        stepLightbox(-1);
      } else if (ev.key === "ArrowRight") {
        ev.preventDefault();
        stepLightbox(1);
      }
    }

    lb.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        closeLightbox();
      });
    });
    if (btnPrev) btnPrev.addEventListener("click", function (e) { e.stopPropagation(); stepLightbox(-1); });
    if (btnNext) btnNext.addEventListener("click", function (e) { e.stopPropagation(); stepLightbox(1); });

    if (mainImg) {
      mainImg.addEventListener("click", function () {
        if (galleryUrls.length) openLightbox(galleryIndex);
      });
    }

    if (thumbRow) {
      thumbRow.addEventListener("click", function (e) {
        var btn = e.target && e.target.closest && e.target.closest("button");
        if (!btn || !thumbRow.contains(btn)) return;
        var buttons = thumbRow.querySelectorAll("button");
        var idx = Array.prototype.indexOf.call(buttons, btn);
        if (idx < 0) return;
        openLightbox(idx);
      });
    }
  }

  function applyListingToDom(item, id) {
    var titleEl = document.getElementById("ilanTitle");
    var headNo = document.getElementById("ilanHeadMetaNo");
    var headDate = document.getElementById("ilanHeadMetaDate");
    var mainImg = document.getElementById("ilanMainImage");
    var thumbRow = document.getElementById("ilanThumbRow");
    var priceEl = document.getElementById("ilanPrice");
    var stickyPrice = document.getElementById("ilanStickyPrice");
    var stickyWa = document.getElementById("ilanStickyWhatsApp");
    var stickyCall = document.getElementById("ilanStickyCall");
    var locEl = document.getElementById("ilanLocation");
    var sellerEl = document.getElementById("sellerName");
    var descEl = document.getElementById("ilanDescription");
    var btnMsg = document.getElementById("btnMessage");
    var btnWa = document.getElementById("btnWhatsApp");
    var btnCall = document.getElementById("btnCall");
    var lastSeenEl = document.getElementById("sellerLastSeen");

    var title = item.title != null ? String(item.title) : "İsimsiz ilan";
    if (headNo) headNo.textContent = "İlan No: " + id;
    if (headDate) headDate.textContent = "Yayınlanma: " + formatPublishDateTr(item);
    if (titleEl) titleEl.textContent = title;
    renderQuickVehicleSpecStrip(item);
    if (priceEl) priceEl.textContent = formatTry(item.price);

    if (locEl) {
      var loc = locationLine(item);
      var cat = item.category != null ? String(item.category) : "";
      locEl.textContent = cat ? loc + (loc !== "—" ? " · " : "") + cat : loc;
    }

    if (sellerEl) {
      var sn =
        item.user && item.user.name != null && String(item.user.name).trim()
          ? String(item.user.name).trim()
          : item.sellerName != null && String(item.sellerName).trim()
            ? String(item.sellerName).trim()
            : "Satıcı";
      sellerEl.textContent = sn;
    }
    if (lastSeenEl) lastSeenEl.textContent = sellerActivityLabel(item);

    var imgs = collectImageUrls(item);
    if (Array.isArray(item.images) && item.images[0] && imgs.length === 0) {
      imgs = item.images.map(function (u) {
        return u != null ? String(u) : "";
      }).filter(Boolean);
    }
    wireThumbs(mainImg, thumbRow, imgs, title);

    if (descEl) {
      descEl.textContent = item.description != null ? String(item.description) : "";
    }

    renderFeatures(item.features, item.specs);

    var phone = item.phone != null ? String(item.phone).trim() : "";
    var waUrl = buildWhatsAppTurkeyUrl(phone);
    var telDigits = phone ? phone.replace(/[^\d+]/g, "") : "";

    bindWhatsAppButton(btnWa, waUrl);
    bindWhatsAppButton(stickyWa, waUrl);
    bindTelCallLink(btnCall, telDigits);
    bindTelCallLink(stickyCall, telDigits);
    if (stickyPrice) stickyPrice.textContent = formatTry(item.price);

    if (btnMsg) {
      var logged = window.JetleAuth && typeof JetleAuth.isLoggedIn === "function" && JetleAuth.isLoggedIn();
      if (logged) {
        btnMsg.href = "dashboard.html#messages";
      } else {
        btnMsg.href = "login.html?next=" + encodeURIComponent("ilan-detail.html?id=" + id);
      }
      btnMsg.textContent = "Mesaj";
      btnMsg.setAttribute("aria-label", "Mesaj gönder");
    }

    window.tabAc("aciklama");
    setStickyContactBar(true);
  }

  function loadSimilarListings(currentId, currentItem, similarEl) {
    if (!similarEl) return;
    fetch(resolveListingsUrl(), {
      method: "GET",
      credentials: "omit",
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) return [];
        return res.json();
      })
      .then(function (json) {
        var rows = normalizeRows(json);
        renderSimilar(similarEl, rows, currentId, currentItem);
      })
      .catch(function () {
        similarEl.innerHTML = "";
        var p = document.createElement("p");
        p.className = "text-muted text-small";
        p.textContent = "Benzer ilanlar yüklenemedi.";
        similarEl.appendChild(p);
      });
  }

  function loadDetail() {
    var loading = document.getElementById("detailLoading");
    var skeleton = document.getElementById("detailSkeleton");
    var errBox = document.getElementById("detailError");
    var errText = document.getElementById("detailErrorText");
    var root = document.getElementById("detailRoot");
    var similarEl = document.getElementById("similarListings");

    if (!root) return;

    var id = getQueryId();
    if (!id) {
      setVisible(loading, false);
      setVisible(skeleton, false);
      setVisible(errBox, true);
      if (errText) errText.textContent = "Geçersiz veya eksik ilan numarası (?id=).";
      return;
    }

    setVisible(loading, false);
    setVisible(errBox, false);
    setVisible(root, false);
    setVisible(skeleton, true);

    var detailUrl = resolveListingDetailUrl(id);

    fetch(detailUrl, {
      method: "GET",
      credentials: "omit",
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        setVisible(loading, false);

        if (json == null) {
          setVisible(skeleton, false);
          setStickyContactBar(false);
          setVisible(errBox, true);
          if (errText) errText.textContent = "Bu ilan bulunamadı veya görüntüleme yetkiniz yok.";
          return;
        }

        var data = unwrapPayload(json);
        if (!data || typeof data !== "object") {
          setVisible(skeleton, false);
          setStickyContactBar(false);
          setVisible(errBox, true);
          if (errText) errText.textContent = "İlan verisi alınamadı.";
          return;
        }

        setVisible(skeleton, false);
        setVisible(errBox, false);
        setVisible(root, true);

        applyListingToDom(data, id);
        loadSimilarListings(id, data, similarEl);
      })
      .catch(function (err) {
        console.error("[JETLE][ilan-detail]", err);
        setVisible(loading, false);
        setVisible(skeleton, false);
        setStickyContactBar(false);
        setVisible(errBox, true);
        if (errText) errText.textContent = "İlan yüklenirken bir hata oluştu. Daha sonra tekrar deneyin.";
      });
  }

  function boot() {
    initImageLightbox();
    loadDetail();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
