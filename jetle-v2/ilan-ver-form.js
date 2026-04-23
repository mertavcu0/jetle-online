/**
 * jetle-v2 — İlan ver: 6 adımlı sihirbaz, kategoriye göre alanlar, önizleme, POST /api/listings + Bearer, fotoğraf /api/media/upload-images.
 */
(function () {
  "use strict";

  var API_BASE = "https://jetle-online-production.up.railway.app";
  var TOTAL_STEPS = 3;
  var currentStep = 1;

  var SUBCATEGORIES = {
    Emlak: ["Satılık konut", "Kiralık konut", "Arsa", "İşyeri", "Projeler", "Diğer"],
    Vasıta: ["Otomobil", "Arazi, SUV & Pickup", "Motosiklet", "Deniz araçları", "Hasarlı / parça", "Diğer"],
    Elektronik: ["Cep telefonu", "Bilgisayar", "Tablet", "TV & ses", "Foto & kamera", "Diğer"],
    Alışveriş: ["Giyim & aksesuar", "Ev & yaşam", "Spor & outdoor", "Anne & bebek", "Diğer"],
    Hizmet: ["Tamir & bakım", "Taşımacılık", "Danışmanlık", "Temizlik", "Eğitim", "Diğer"]
  };

  /** Kategoriye özel specs alanları (sunucu: specs objesi). */
  var DYNAMIC_FIELDS = {
    Emlak: [
      { key: "listingType", label: "İlan tipi", type: "select", options: ["Satılık", "Kiralık"] },
      { key: "roomCount", label: "Oda sayısı", type: "select", options: ["Stüdyo", "1+1", "2+1", "3+1", "4+1", "5+"] },
      { key: "squareMeters", label: "Brüt m²", type: "number", min: 1, max: 50000, placeholder: "120" }
    ],
    Vasıta: [{ key: "fuelType", label: "Yakıt", type: "select", options: ["Benzin", "Dizel", "Hibrit", "Elektrik", "LPG"] }],
    Elektronik: [{ key: "warranty", label: "Garanti", type: "select", options: ["Var", "Yok", "Belirsiz"] }],
    Alışveriş: [],
    Hizmet: [
      { key: "serviceArea", label: "Hizmet bölgesi", type: "text", max: 120, placeholder: "Örn: İstanbul Anadolu yakası" },
      { key: "experienceYears", label: "Deneyim (yıl)", type: "number", min: 0, max: 80, placeholder: "5" }
    ]
  };

  /**
   * tr-cities.js yüklenince global: TR_CITIES / JETLE_TR_CITIES (ESM `import { TR_CITIES }` yerine).
   */
  function getTrCities() {
    if (typeof window !== "undefined" && window.TR_CITIES && window.TR_CITIES.length) return window.TR_CITIES;
    if (typeof window !== "undefined" && window.JETLE_TR_CITIES && window.JETLE_TR_CITIES.length) return window.JETLE_TR_CITIES;
    return [];
  }

  function fillIlanVerDistrictOptions(cityName) {
    var districtSelect = document.getElementById("districtSelect");
    if (!districtSelect || districtSelect.tagName !== "SELECT") return;
    var keep = districtSelect.value;
    while (districtSelect.firstChild) districtSelect.removeChild(districtSelect.firstChild);
    var p = document.createElement("option");
    p.value = "";
    p.textContent = cityName ? "İlçe seçin" : "Önce il seçin";
    districtSelect.appendChild(p);
    var TR_CITIES = getTrCities();
    var selected = null;
    for (var ri = 0; ri < TR_CITIES.length; ri++) {
      if (TR_CITIES[ri].name === cityName) {
        selected = TR_CITIES[ri];
        break;
      }
    }
    if (selected && selected.districts && selected.districts.length) {
      selected.districts.forEach(function (d) {
        var opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
      });
    }
    districtSelect.disabled = !cityName;
    var keepValid = false;
    if (keep) {
      for (var i = 0; i < districtSelect.options.length; i++) {
        if (districtSelect.options[i].value === keep) {
          keepValid = true;
          break;
        }
      }
    }
    districtSelect.value = keepValid ? keep : "";
    if (window.JetleTrCitiesUI && typeof JetleTrCitiesUI.refresh === "function") {
      JetleTrCitiesUI.refresh(districtSelect);
    }
  }

  function fillIlanVerCityOptions() {
    var citySelect = document.getElementById("citySelect");
    if (!citySelect || citySelect.tagName !== "SELECT") return;
    var keepCity = citySelect.value;
    while (citySelect.firstChild) citySelect.removeChild(citySelect.firstChild);
    var o0 = document.createElement("option");
    o0.value = "";
    o0.textContent = "İl seçin";
    citySelect.appendChild(o0);
    var names = getTrCities()
      .map(function (c) {
        return c.name;
      })
      .sort(function (a, b) {
        return a.localeCompare(b, "tr-TR", { sensitivity: "base" });
      });
    names.forEach(function (n) {
      var o = document.createElement("option");
      o.value = n;
      o.textContent = n;
      citySelect.appendChild(o);
    });
    var cityOk = false;
    if (keepCity) {
      for (var j = 0; j < citySelect.options.length; j++) {
        if (citySelect.options[j].value === keepCity) {
          cityOk = true;
          break;
        }
      }
    }
    citySelect.value = cityOk ? keepCity : "";
    fillIlanVerDistrictOptions(citySelect.value);
    if (window.JetleTrCitiesUI && typeof JetleTrCitiesUI.refresh === "function") {
      JetleTrCitiesUI.refresh(citySelect);
    }
  }

  var previewUrls = [];

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function apiBase() {
    try {
      if (window.JetleAPI && JetleAPI.API_BASE) {
        var ab = String(JetleAPI.API_BASE).trim().replace(/\/+$/, "");
        if (/^https?:\/\//i.test(ab)) return ab;
      }
      var m = document.querySelector('meta[name="jetle-api-base"]');
      var b = m && m.getAttribute("content");
      if (b && String(b).trim()) {
        var mb = String(b).trim().replace(/\/+$/, "");
        if (/^https?:\/\//i.test(mb)) return mb;
      }
      var gw = window.JetleAPI && JetleAPI.API_GATEWAY;
      if (gw && gw.baseUrl) {
        var bu = String(gw.baseUrl).trim().replace(/\/+$/, "");
        if (/^https?:\/\//i.test(bu)) return bu;
      }
    } catch (e) {}
    return API_BASE;
  }

  function revokePreviewUrls() {
    previewUrls.forEach(function (u) {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    previewUrls = [];
  }

  function mergeIntoFileInput(input, fileList) {
    if (!input || !fileList || !fileList.length) return;
    try {
      var dt = new DataTransfer();
      if (input.files && input.files.length) {
        for (var i = 0; i < input.files.length; i++) {
          dt.items.add(input.files[i]);
        }
      }
      for (var j = 0; j < fileList.length; j++) {
        dt.items.add(fileList[j]);
      }
      input.files = dt.files;
    } catch (err) {
      if (window.console && console.warn) console.warn("[ilan-ver] DataTransfer", err);
    }
  }

  function updatePhotoLabel(photoInput, labelEl) {
    if (!labelEl) return;
    var n = photoInput && photoInput.files ? photoInput.files.length : 0;
    if (!n) {
      labelEl.hidden = true;
      labelEl.textContent = "";
      return;
    }
    labelEl.hidden = false;
    labelEl.textContent = n === 1 ? "1 dosya seçildi" : n + " dosya seçildi";
  }

  function renderPhotoPreviews(photoInput, mount) {
    revokePreviewUrls();
    if (!mount) return;
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    if (!photoInput || !photoInput.files || !photoInput.files.length) {
      syncAsidePhotoStripFromPreviews();
      return;
    }
    var max = 16;
    var n = Math.min(photoInput.files.length, max);
    for (var i = 0; i < n; i++) {
      var f = photoInput.files[i];
      if (!f || !f.type || f.type.indexOf("image/") !== 0) continue;
      var url = URL.createObjectURL(f);
      previewUrls.push(url);
      var wrap = document.createElement("div");
      wrap.className = "ilan-wizard__preview-thumb";
      var img = document.createElement("img");
      img.src = url;
      img.alt = f.name || "Önizleme";
      wrap.appendChild(img);
      mount.appendChild(wrap);
    }
    syncAsidePhotoStripFromPreviews();
  }

  function getToken() {
    var t = "";
    try {
      t = localStorage.getItem("token") || localStorage.getItem("jetle_v2_access_token") || "";
    } catch (eLs) {}
    if (!t) {
      try {
        t = (window.JetleAPI && JetleAPI.getAccessToken && JetleAPI.getAccessToken()) || "";
      } catch (e) {}
    }
    return String(t || "");
  }

  function validateAuthTokenAsync(token) {
    if (!token) return Promise.resolve(false);
    console.log("CALLING:", API_BASE + "/api/auth/me");
    return fetch(API_BASE + "/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + String(localStorage.getItem("token") || ""),
        Accept: "application/json"
      },
      credentials: "include"
    })
      .then(function (res) {
        return res.json().catch(function () {
          return {};
        });
      })
      .then(function (data) {
        return data && data.ok === true;
      })
      .catch(function () {
        return false;
      });
  }

  function showMsg(el, text) {
    if (!el) return;
    if (text) {
      el.textContent = text;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  function hideAllFieldErrors() {
    document.querySelectorAll(".ilan-wizard__field-msg").forEach(function (n) {
      showMsg(n, "");
    });
  }

  function getCategory() {
    var el = document.getElementById("ilanCategory");
    return el ? String(el.value || "").trim() : "";
  }

  function fillSubcategoryOptions(cat) {
    var sel = document.getElementById("ilanSubcategory");
    if (!sel) return;
    while (sel.options.length) sel.remove(0);
    var opts = SUBCATEGORIES[cat];
    if (!opts || !opts.length) {
      var o0 = document.createElement("option");
      o0.value = "";
      o0.textContent = "Önce sol menüden kategori seçin";
      sel.appendChild(o0);
      return;
    }
    var ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Alt kategori seçin";
    sel.appendChild(ph);
    opts.forEach(function (label) {
      var o = document.createElement("option");
      o.value = label;
      o.textContent = label;
      sel.appendChild(o);
    });
  }

  function renderDynamicFields(cat) {
    var mount = document.getElementById("ilanDynamicFields");
    if (!mount) return;
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    var defs = DYNAMIC_FIELDS[cat];
    if (!defs || !defs.length) return;
    defs.forEach(function (def) {
      var wrap = document.createElement("div");
      wrap.className = "ilan-wizard__field ilan-wizard__field--stack-pro";
      var id = "ilanSpec_" + def.key;
      var lab = document.createElement("label");
      lab.className = "ilan-wizard__label ilan-wizard__label--pro";
      lab.setAttribute("for", id);
      lab.appendChild(document.createTextNode(def.label + " "));
      if (def.optional) {
        var opt = document.createElement("span");
        opt.className = "ilan-wizard__optional";
        opt.textContent = "(isteğe bağlı)";
        lab.appendChild(opt);
      } else {
        var ab = document.createElement("abbr");
        ab.title = "zorunlu";
        ab.textContent = "*";
        lab.appendChild(ab);
      }
      wrap.appendChild(lab);
      if (def.type === "select") {
        var s = document.createElement("select");
        s.id = id;
        s.className = "ilan-wizard__input ilan-wizard__select ilan-wizard__input--pro";
        s.setAttribute("data-spec-key", def.key);
        if (!def.optional) s.required = true;
        var ph = document.createElement("option");
        ph.value = "";
        ph.textContent = "Seçin";
        s.appendChild(ph);
        def.options.forEach(function (opt) {
          var o = document.createElement("option");
          o.value = opt;
          o.textContent = opt;
          s.appendChild(o);
        });
        wrap.appendChild(s);
      } else if (def.type === "number") {
        var inp = document.createElement("input");
        inp.type = "number";
        inp.id = id;
        inp.className = "ilan-wizard__input ilan-wizard__input--pro";
        inp.setAttribute("data-spec-key", def.key);
        if (def.min != null) inp.min = String(def.min);
        if (def.max != null) inp.max = String(def.max);
        if (def.placeholder) inp.placeholder = def.placeholder;
        if (!def.optional) inp.required = true;
        wrap.appendChild(inp);
      } else {
        var t = document.createElement("input");
        t.type = "text";
        t.id = id;
        t.className = "ilan-wizard__input ilan-wizard__input--pro";
        t.setAttribute("data-spec-key", def.key);
        if (def.max) t.maxLength = def.max;
        if (def.placeholder) t.placeholder = def.placeholder;
        if (!def.optional) t.required = true;
        wrap.appendChild(t);
      }
      var err = document.createElement("p");
      err.className = "ilan-wizard__field-msg";
      err.id = id + "_err";
      err.hidden = true;
      wrap.appendChild(err);
      mount.appendChild(wrap);
    });
  }

  function collectManualListingSpecs() {
    var out = {};
    var pairs = [
      ["ilanBrand", "vehicleBrand"],
      ["ilanModel", "vehicleModel"],
      ["ilanVehicleYear", "vehicleYear"],
      ["ilanOdometerKm", "odometerKm"],
      ["ilanListingCondition", "listingCondition"]
    ];
    pairs.forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (el && String(el.value || "").trim() !== "") out[pair[1]] = String(el.value).trim();
    });
    return out;
  }

  function collectSpecs() {
    var out = {};
    var mount = document.getElementById("ilanDynamicFields");
    if (mount) {
      mount.querySelectorAll("[data-spec-key]").forEach(function (el) {
        var k = el.getAttribute("data-spec-key");
        if (!k) return;
        var v = el.value != null ? String(el.value).trim() : "";
        if (v !== "") out[k] = v;
      });
    }
    var manual = collectManualListingSpecs();
    Object.keys(manual).forEach(function (k) {
      out[k] = manual[k];
    });
    return out;
  }

  function syncLivePreview() {
    var catEl = document.getElementById("ilanPvCat");
    var cat = getCategory();
    if (catEl) catEl.textContent = cat || "Kategori seçilmedi";
    var titleIn = document.getElementById("ilanTitle");
    var tit = document.getElementById("preview-title") || document.getElementById("ilanPvTitle");
    if (tit) {
      var tv = titleIn && String(titleIn.value || "").trim();
      tit.textContent = tv || "İlan başlığı";
    }
    var pr = document.getElementById("ilanPrice");
    var pv = document.getElementById("preview-price") || document.getElementById("ilanPvPrice");
    if (pv) {
      var pRaw = pr && String(pr.value || "").trim();
      var p = pRaw === "" ? NaN : Number(pr && pr.value);
      if (pRaw === "") {
        pv.textContent = "0 ₺";
      } else {
        pv.textContent = Number.isFinite(p) ? p.toLocaleString("tr-TR") + " ₺" : pRaw + " ₺";
      }
    }
    var descIn = document.getElementById("ilanDesc");
    var descOut = document.getElementById("preview-desc") || document.getElementById("ilanPvDesc");
    if (descOut) {
      var d = descIn && String(descIn.value || "").trim();
      descOut.textContent = d || "Açıklama burada görünecek";
    }
    var city = document.getElementById("citySelect");
    var dist = document.getElementById("districtSelect");
    var loc = document.getElementById("ilanPvLoc");
    if (loc) {
      var c = city && city.value ? city.value : "";
      var di = dist && dist.value ? String(dist.value).trim() : "";
      loc.textContent = c || di ? (c + (di ? " / " + di : "")) : "Konum —";
    }
    var sub = document.getElementById("ilanSubcategory");
    var extras = document.getElementById("ilanPvExtras");
    if (extras) {
      var bits = [];
      if (sub && sub.value) bits.push("Alt kategori: " + sub.value);
      var br = document.getElementById("ilanBrand");
      var mo = document.getElementById("ilanModel");
      var yr = document.getElementById("ilanVehicleYear");
      var km = document.getElementById("ilanOdometerKm");
      var st = document.getElementById("ilanListingCondition");
      if (br && br.value.trim()) bits.push("Marka: " + br.value.trim());
      if (mo && mo.value.trim()) bits.push("Model: " + mo.value.trim());
      if (yr && String(yr.value || "").trim()) bits.push("Yıl: " + yr.value);
      if (km && String(km.value || "").trim()) bits.push("Km: " + Number(km.value).toLocaleString("tr-TR"));
      if (st && st.value) bits.push("Durum: " + st.value);
      if (bits.length) {
        extras.textContent = bits.join(" · ");
        extras.hidden = false;
      } else {
        extras.textContent = "";
        extras.hidden = true;
      }
    }
  }

  function syncAsidePhotoStripFromPreviews() {
    var src = document.getElementById("ilanPhotoPreviews");
    var strip = document.getElementById("ilanPvPhotos");
    if (!strip) return;
    while (strip.firstChild) strip.removeChild(strip.firstChild);
    if (!src) return;
    src.querySelectorAll("img").forEach(function (img) {
      var n = document.createElement("img");
      n.src = img.src;
      n.alt = img.alt || "";
      strip.appendChild(n);
    });
  }

  function validateDynamicFields() {
    var cat = getCategory();
    var defs = DYNAMIC_FIELDS[cat] || [];
    var ok = true;
    defs.forEach(function (def) {
      var el = document.getElementById("ilanSpec_" + def.key);
      var errEl = document.getElementById("ilanSpec_" + def.key + "_err");
      if (!el) return;
      var v = String(el.value || "").trim();
      if (def.optional) {
        showMsg(errEl, "");
        return;
      }
      if (!v) {
        showMsg(errEl, "Bu alan zorunludur.");
        ok = false;
        return;
      }
      if (def.type === "number") {
        var n = Number(v);
        if (!Number.isFinite(n)) {
          showMsg(errEl, "Geçerli bir sayı girin.");
          ok = false;
          return;
        }
        if (def.min != null && n < def.min) {
          showMsg(errEl, "Değer çok küçük.");
          ok = false;
          return;
        }
        if (def.max != null && n > def.max) {
          showMsg(errEl, "Değer çok büyük.");
          ok = false;
          return;
        }
      }
      showMsg(errEl, "");
    });
    return ok;
  }

  function validateStep(step) {
    hideAllFieldErrors();
    if (step === 1) {
      var c = getCategory();
      if (!c) {
        showMsg(document.getElementById("ilanErrStep1"), "Lütfen sol menüden bir kategori seçin.");
        return false;
      }
      showMsg(document.getElementById("ilanErrStep1"), "");
      var title = document.getElementById("ilanTitle");
      var desc = document.getElementById("ilanDesc");
      var t = title && String(title.value || "").trim();
      var d = desc && String(desc.value || "").trim();
      var ok = true;
      if (!t || t.length < 3) {
        showMsg(document.getElementById("ilanErrTitle"), "Başlık en az 3 karakter olmalıdır.");
        ok = false;
      }
      if (!d || d.length < 10) {
        showMsg(document.getElementById("ilanErrDesc"), "Açıklama en az 10 karakter olmalıdır.");
        ok = false;
      }
      var sub = document.getElementById("ilanSubcategory");
      var price = document.getElementById("ilanPrice");
      if (!sub || !String(sub.value || "").trim()) {
        showMsg(document.getElementById("ilanErrSubcat"), "Alt kategori seçin.");
        ok = false;
      }
      var pRaw = price && String(price.value || "").trim();
      var p = pRaw === "" ? NaN : Number(price && price.value);
      if (!Number.isFinite(p) || p < 0) {
        showMsg(document.getElementById("ilanErrPrice"), "Geçerli bir fiyat girin.");
        ok = false;
      }
      if (!validateDynamicFields()) ok = false;
      var city = document.getElementById("citySelect");
      var dist = document.getElementById("districtSelect");
      if (!city || !String(city.value || "").trim()) {
        showMsg(document.getElementById("ilanErrCity"), "İl seçin.");
        ok = false;
      }
      var di = dist && String(dist.value || "").trim();
      if (!di) {
        showMsg(document.getElementById("ilanErrDistrict"), "İlçe seçin.");
        ok = false;
      }
      return ok;
    }
    if (step === 2) {
      return true;
    }
    return true;
  }

  function setStepPanels(step) {
    document.querySelectorAll(".ilan-wizard__panel").forEach(function (panel) {
      var s = Number(panel.getAttribute("data-wizard-step"));
      var active = s === step;
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  function updateProgressMarkers(step) {
    var fill = document.getElementById("ilanWizardProgressFill");
    if (fill) fill.style.width = (100 * step) / TOTAL_STEPS + "%";
    document.querySelectorAll(".ilan-wizard__progress-step").forEach(function (li) {
      var m = Number(li.getAttribute("data-wizard-step-marker"));
      li.classList.toggle("is-active", m === step);
      li.classList.toggle("is-done", m < step);
    });
  }

  function syncNavButtons(step) {
    var back = document.getElementById("ilanWizardBack");
    var next = document.getElementById("ilanWizardNext");
    if (back) {
      back.disabled = step <= 1;
      back.setAttribute("aria-disabled", step <= 1 ? "true" : "false");
    }
    if (next) {
      next.hidden = step >= TOTAL_STEPS;
      if (step === 1) next.textContent = "Fotoğraflar";
      else if (step === 2) next.textContent = "Yayınla";
      else next.textContent = "İleri";
    }
  }

  function buildPreview() {
    var dl = document.getElementById("ilanPreviewList");
    if (!dl) return;
    while (dl.firstChild) dl.removeChild(dl.firstChild);
    function row(label, value) {
      var dt = document.createElement("dt");
      dt.className = "ilan-wizard__preview-k";
      dt.textContent = label;
      var dd = document.createElement("dd");
      dd.className = "ilan-wizard__preview-v";
      dd.textContent = value || "—";
      dl.appendChild(dt);
      dl.appendChild(dd);
    }
    row("Kategori", getCategory());
    var sub = document.getElementById("ilanSubcategory");
    row("Alt kategori", sub && sub.value ? sub.value : "");
    row("Başlık", document.getElementById("ilanTitle") && document.getElementById("ilanTitle").value);
    var desc = document.getElementById("ilanDesc") && document.getElementById("ilanDesc").value;
    row("Açıklama", desc && desc.length > 160 ? desc.slice(0, 160) + "…" : desc);
    var pr = document.getElementById("ilanPrice");
    var pv = pr && pr.value !== "" ? Number(pr.value) : NaN;
    row("Fiyat", Number.isFinite(pv) ? pv.toLocaleString("tr-TR") + " ₺" : "");
    var city = document.getElementById("citySelect");
    var dist = document.getElementById("districtSelect");
    row("Konum", (city && city.value ? city.value : "") + (dist && dist.value ? " / " + dist.value : ""));
    var ph = document.getElementById("ilanPhone");
    row("Telefon", ph && ph.value ? ph.value : "—");
    var specs = collectSpecs();
    var specStr = Object.keys(specs).length ? JSON.stringify(specs, null, 0) : "—";
    row("Ek özellikler", specStr.length > 200 ? specStr.slice(0, 200) + "…" : specStr);
    var pho = document.getElementById("ilanPhotos");
    var n = pho && pho.files ? pho.files.length : 0;
    row("Fotoğraf sayısı", n ? String(n) : "Yok");
  }

  function goToStep(step) {
    if (step < 1) step = 1;
    if (step > TOTAL_STEPS) step = TOTAL_STEPS;
    currentStep = step;
    setStepPanels(step);
    updateProgressMarkers(step);
    syncNavButtons(step);
    if (step === 1) {
      fillSubcategoryOptions(getCategory());
      renderDynamicFields(getCategory());
    }
    if (step === 3) buildPreview();
    syncLivePreview();
  }

  function uploadListingImages(token, photoInput) {
    if (!photoInput || !photoInput.files || !photoInput.files.length) {
      return Promise.resolve({ ok: true, status: 200, json: { data: { images: [] } } });
    }
    var fd = new FormData();
    var max = Math.min(photoInput.files.length, 16);
    for (var i = 0; i < max; i++) {
      fd.append("images", photoInput.files[i]);
    }
    return fetch(apiBase() + "/api/media/upload-images", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, Accept: "application/json" },
      body: fd,
      credentials: "omit"
    }).then(function (res) {
      return res.json().then(function (json) {
        return { ok: res.ok, status: res.status, json: json };
      });
    });
  }

  function mapUploadedToMedia(imagesArr) {
    if (!imagesArr || !imagesArr.length) return { images: [], coverImage: "", video: null };
    var mapped = imagesArr.map(function (img, i) {
      return {
        assetId: String(img.id || img.assetId || ""),
        originalUrl: String(img.originalUrl || "").trim(),
        mediumUrl: String(img.mediumUrl || img.originalUrl || "").trim(),
        thumbUrl: String(img.thumbUrl || img.mediumUrl || img.originalUrl || "").trim(),
        isCover: i === 0,
        order: i
      };
    });
    return {
      images: mapped,
      coverImage: mapped[0] ? mapped[0].mediumUrl || mapped[0].originalUrl : "",
      video: null
    };
  }

  function postListing(token, body) {
    return fetch(apiBase() + "/api/listings", {
      method: "POST",
      headers: Object.assign(
        { "Content-Type": "application/json", Accept: "application/json" },
        token ? { Authorization: "Bearer " + token } : {}
      ),
      credentials: "omit",
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (json) {
        return { ok: res.ok, status: res.status, json: json };
      });
    });
  }

  ready(function () {
    if (!window.JetleAPI) return;
    JetleAPI.init();

    var form = document.getElementById("ilanVerForm");
    var citySel = document.getElementById("citySelect");
    var catHidden = document.getElementById("ilanCategory");
    var submitBtn = document.getElementById("ilanVerSubmit");
    var photoInput = document.getElementById("ilanPhotos");
    var dropzone = document.getElementById("ilanPhotoDropzone");
    var filesLabel = document.getElementById("ilanPhotoFilesLabel");
    var previewsEl = document.getElementById("ilanPhotoPreviews");
    var catCards = document.querySelectorAll(".ilan-wizard__cat-card[data-ilan-cat]");
    var btnNext = document.getElementById("ilanWizardNext");
    var btnBack = document.getElementById("ilanWizardBack");
    var authNote = document.getElementById("ilanWizardAuthNote");
    var formError = document.getElementById("ilanWizardFormError");
    var successBox = document.getElementById("ilanWizardSuccess");
    var formShell = document.getElementById("ilanWizardFormShell");

    if (citySel) {
      fillIlanVerCityOptions();
      var distSel = document.getElementById("districtSelect");
      if (window.JetleTrCitiesUI && typeof JetleTrCitiesUI.enhanceSelect === "function") {
        JetleTrCitiesUI.enhanceSelect(citySel, { wrapClass: "ilan-wizard-tr-combo" });
        if (distSel) JetleTrCitiesUI.enhanceSelect(distSel, { wrapClass: "ilan-wizard-tr-combo" });
      }
      /* İl değişince ilçeler: getTrCities() ≈ import { TR_CITIES } from "./tr-cities.js" */
      citySel.addEventListener("change", function () {
        fillIlanVerDistrictOptions(citySel.value);
        syncLivePreview();
      });
    }

    if (!form) return;

    function showFormError(msg) {
      if (!formError) return;
      if (msg) {
        formError.textContent = msg;
        formError.hidden = false;
      } else {
        formError.textContent = "";
        formError.hidden = true;
      }
    }

    catCards.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var prev = catHidden ? String(catHidden.value || "") : "";
        var val = btn.getAttribute("data-ilan-cat") || "";
        if (catHidden) catHidden.value = val;
        catCards.forEach(function (b) {
          b.classList.toggle("is-selected", b === btn);
        });
        if (prev !== val && currentStep >= 1) {
          var sub = document.getElementById("ilanSubcategory");
          if (sub) sub.value = "";
        }
        showMsg(document.getElementById("ilanErrStep1"), "");
        syncLivePreview();
      });
    });

    form.addEventListener(
      "input",
      function () {
        syncLivePreview();
      },
      true
    );
    form.addEventListener(
      "change",
      function () {
        syncLivePreview();
      },
      true
    );

    (function wirePreviewTitlePriceDesc() {
      var titleInput =
        document.querySelector('[name="baslik"]') ||
        document.querySelector('[name="title"]');
      var priceInput =
        document.querySelector('[name="fiyat"]') ||
        document.querySelector('[name="price"]');
      var descInput =
        document.querySelector('[name="aciklama"]') ||
        document.querySelector('[name="description"]');
      var previewTitle =
        document.getElementById("preview-title") || document.getElementById("ilanPvTitle");
      var previewPrice =
        document.getElementById("preview-price") || document.getElementById("ilanPvPrice");
      var previewDesc =
        document.getElementById("preview-desc") || document.getElementById("ilanPvDesc");
      if (titleInput && previewTitle) {
        titleInput.addEventListener("input", function () {
          previewTitle.textContent = titleInput.value || "İlan başlığı";
        });
      }
      if (priceInput && previewPrice) {
        priceInput.addEventListener("input", function () {
          var raw = String(priceInput.value || "").trim();
          if (raw === "") {
            previewPrice.textContent = "0 ₺";
            return;
          }
          var n = Number(priceInput.value);
          previewPrice.textContent = Number.isFinite(n) ? n.toLocaleString("tr-TR") + " ₺" : raw + " ₺";
        });
      }
      if (descInput && previewDesc) {
        descInput.addEventListener("input", function () {
          previewDesc.textContent = descInput.value || "Açıklama burada görünecek";
        });
      }
    })();

    function onPhotosUpdated() {
      updatePhotoLabel(photoInput, filesLabel);
      renderPhotoPreviews(photoInput, previewsEl);
    }

    if (photoInput) {
      photoInput.addEventListener("change", onPhotosUpdated);
    }

    if (dropzone && photoInput) {
      var dropInner = dropzone.querySelector(".ilan-wizard__drop-inner");
      if (dropInner) {
        dropInner.addEventListener("click", function (e) {
          if (e.target === photoInput) return;
          try {
            photoInput.click();
          } catch (eC) {}
        });
      }
      var dragDepth = 0;
      dropzone.addEventListener("dragenter", function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragDepth++;
        dropzone.classList.add("is-dragover");
      });
      dropzone.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("is-dragover");
      });
      dropzone.addEventListener("dragleave", function (e) {
        e.preventDefault();
        dragDepth = Math.max(0, dragDepth - 1);
        if (dragDepth === 0) dropzone.classList.remove("is-dragover");
      });
      dropzone.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragDepth = 0;
        dropzone.classList.remove("is-dragover");
        var files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length) mergeIntoFileInput(photoInput, files);
        updatePhotoLabel(photoInput, filesLabel);
        renderPhotoPreviews(photoInput, previewsEl);
        photoInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        showFormError("");
        if (!validateStep(currentStep)) return;
        if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
      });
    }

    if (btnBack) {
      btnBack.addEventListener("click", function () {
        showFormError("");
        if (currentStep > 1) goToStep(currentStep - 1);
      });
    }

    goToStep(1);
    syncLivePreview();

    setTimeout(function () {
      var tokenNow = getToken();
      if (!authNote) return;
      if (!tokenNow) {
        authNote.textContent = "İlan göndermek ve fotoğraf yüklemek için giriş yapmanız gerekir.";
        authNote.hidden = false;
        return;
      }
      validateAuthTokenAsync(tokenNow).then(function (ok) {
        authNote.textContent = ok ? "" : "Oturum doğrulanamadı; gönderimde sorun yaşanabilir.";
        authNote.hidden = ok;
      });
    }, 0);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (currentStep !== TOTAL_STEPS) {
        goToStep(TOTAL_STEPS);
        return;
      }
      showFormError("");
      if (!validateStep(1)) {
        showFormError("Lütfen tüm zorunlu alanları kontrol edin.");
        goToStep(1);
        return;
      }
      if (!window.JetleAPI || !JetleAPI.backendEnabled || !JetleAPI.backendEnabled()) {
        window.alert("Canlı API kapalı. Ayarlardan backend kullanımını açın.");
        return;
      }
      var token = getToken();
      if (!token) {
        window.alert("İlan göndermek için giriş yapmalısınız.");
        return;
      }
      validateAuthTokenAsync(token).then(function (tokOk) {
        if (!tokOk) {
          window.alert("Oturum doğrulanamadı. Lütfen tekrar giriş yapın.");
          return;
        }
        try {
          localStorage.setItem("token", token);
        } catch (e3) {}

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Gönderiliyor…";
        }

        var subEl = document.getElementById("ilanSubcategory");
        var bodyBase = {
          category: getCategory(),
          subcategory: subEl && String(subEl.value || "").trim(),
          title: (document.getElementById("ilanTitle") && document.getElementById("ilanTitle").value) || "",
          description: (document.getElementById("ilanDesc") && document.getElementById("ilanDesc").value) || "",
          price: Number((document.getElementById("ilanPrice") && document.getElementById("ilanPrice").value) || 0),
          status: "pending",
          phone: (document.getElementById("ilanPhone") && document.getElementById("ilanPhone").value) || "",
          city: (document.getElementById("citySelect") && document.getElementById("citySelect").value) || "",
          district: (document.getElementById("districtSelect") && document.getElementById("districtSelect").value) || "",
          address: "",
          specs: collectSpecs()
        };

        uploadListingImages(token, photoInput)
          .then(function (up) {
            if (!up.ok) {
              var d0 = up.json && up.json.details && up.json.details[0];
              var em =
                (up.json && up.json.message) ||
                (d0 && d0.msg) ||
                (up.json && up.json.errors && up.json.errors[0] && up.json.errors[0].msg) ||
                "Fotoğraflar yüklenemedi.";
              throw new Error(em);
            }
            var imgs = (up.json && up.json.data && up.json.data.images) || [];
            if (photoInput && photoInput.files && photoInput.files.length) {
              if (!Array.isArray(imgs) || !imgs.length) {
                throw new Error("Sunucudan görsel yanıtı alınamadı.");
              }
            }
            bodyBase.media = mapUploadedToMedia(imgs);
            return postListing(token, bodyBase);
          })
          .then(function (res) {
            if (!res.ok) {
              var d1 = res.json && res.json.details && res.json.details[0];
              var msg =
                (res.json && res.json.message) ||
                (d1 && d1.msg) ||
                (res.json && res.json.errors && res.json.errors[0] && res.json.errors[0].msg) ||
                "İlan kaydedilemedi (HTTP " + res.status + ").";
              throw new Error(msg);
            }
            var createdId = "";
            if (res && res.json) {
              createdId =
                (res.json.data && (res.json.data.id || res.json.data.listingId)) ||
                (res.json.listing && res.json.listing.id) ||
                res.json.id ||
                "";
            }
            if (formShell) formShell.hidden = true;
            var asideEl = document.querySelector(".ilan-lp-aside");
            if (asideEl) asideEl.hidden = true;
            var railEl = document.querySelector(".ilan-wizard__rail");
            if (railEl) railEl.hidden = true;
            if (successBox) successBox.hidden = false;
            form.reset();
            if (catHidden) catHidden.value = "";
            catCards.forEach(function (b) {
              b.classList.remove("is-selected");
            });
            revokePreviewUrls();
            if (previewsEl) while (previewsEl.firstChild) previewsEl.removeChild(previewsEl.firstChild);
            updatePhotoLabel(photoInput, filesLabel);
            syncAsidePhotoStripFromPreviews();
            currentStep = 1;
            updateProgressMarkers(1);
            syncLivePreview();
            if (createdId) {
              window.setTimeout(function () {
                window.location.href = "ilan-detay.html?id=" + encodeURIComponent(createdId);
              }, 700);
            }
          })
          .catch(function (err) {
            var m = err && err.message ? err.message : "Bilinmeyen hata.";
            showFormError(m);
            window.alert(m);
          })
          .then(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "İlanı gönder";
            }
          });
      });
    });
  });
})();
