const API = "http://localhost:3000";

function buildQuery() {
  const params = new URLSearchParams();
  const category = document.getElementById("category")?.value;
  const city = document.getElementById("cityFilter")?.value;
  const search = document.getElementById("searchInput")?.value;
  const min = document.getElementById("min")?.value;
  const max = document.getElementById("max")?.value;

  if (category) params.set("category", category);
  if (city) params.set("city", city);
  if (search) params.set("search", search);
  if (min) params.set("min", min);
  if (max) params.set("max", max);
  params.set("page", "1");
  params.set("limit", "12");

  const query = params.toString();
  return query ? `?${query}` : "";
}

function getAuthUserId() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}").id;
  } catch {
    return null;
  }
}

function imagesOf(listing) {
  if (Array.isArray(listing.images) && listing.images.length) return listing.images;
  return [imageOf(listing)];
}

let selectedCreateFiles = [];
let detailChatTimer = null;
let selectedDamagePart = null;
const carParts = {};
const partLabels = {
  hood: "Kaput",
  roof: "Tavan",
  trunk: "Bagaj",
  frontBumper: "Ön tampon",
  rearBumper: "Arka tampon",
  leftFrontFender: "Sol ön çamurluk",
  rightFrontFender: "Sağ ön çamurluk",
  leftRearFender: "Sol arka çamurluk",
  rightRearFender: "Sağ arka çamurluk",
  leftDoor: "Sol kapı",
  rightDoor: "Sağ kapı",
};

function validateStep1(showAlert = true) {
  const form = document.getElementById("listingForm");
  if (!form) return true;

  const category = form.category;
  const city = form.city;

  if (!category?.value || !city?.value) {
    if (showAlert) alert("Kategori ve şehir zorunlu");
    return false;
  }

  return true;
}

function validateStep2(showAlert = true) {
  const form = document.getElementById("listingForm");
  if (!form) return true;

  const title = form.title;
  const price = form.price;
  const description = form.description;

  if (!title?.value.trim() || !price?.value.trim() || !description?.value.trim()) {
    if (showAlert) alert("Tüm alanları doldur");
    return false;
  }

  return true;
}

function updateStepButtons() {
  const step1Next = document.querySelector(".step-1 .create-actions button:not(.ghost-btn)");
  const step2Next = document.querySelector(".step-2 .create-actions button:not(.ghost-btn)");

  if (step1Next) step1Next.disabled = !validateStep1(false);
  if (step2Next) step2Next.disabled = !validateStep2(false);
}

function nextStep(step) {
  if (Number(step) === 2 && !validateStep1()) return;
  if (Number(step) === 3 && !validateStep2()) return;

  document.querySelectorAll(".step").forEach((item) => {
    item.style.display = "none";
  });
  document.querySelector(`.step-${step}`)?.style.setProperty("display", "block");

  document.querySelectorAll("[data-step-pill]").forEach((pill) => {
    pill.classList.toggle("active", Number(pill.dataset.stepPill) === Number(step));
  });

  updateStepButtons();
}

window.nextStep = nextStep;
window.validateStep1 = validateStep1;
window.validateStep2 = validateStep2;

function statusClass(status) {
  if (status === "painted" || status === "boyali") return "painted";
  if (status === "changed" || status === "degisen") return "changed";
  if (status === "local" || status === "lokal") return "local";
  return "original";
}

function renderCarDamageMap(parts = {}, readonly = false) {
  const partClass = (key) => `car-part ${key} ${statusClass(parts[key] || "original")}`;

  return `
    <div class="car-map ${readonly ? "readonly" : ""}">
      <svg class="car-svg" viewBox="0 0 320 620" aria-label="Araç hasar şeması">
        <path class="car-shell" d="M92 44 Q160 16 228 44 L260 126 L278 314 L246 538 Q236 584 160 598 Q84 584 74 538 L42 314 L60 126 Z" />
        <path class="${partClass("frontBumper")}" data-part="frontBumper" d="M96 34 Q160 12 224 34 L238 72 Q160 54 82 72 Z"><title>Ön tampon</title></path>
        <path class="${partClass("hood")}" data-part="hood" d="M82 78 Q160 58 238 78 L224 158 Q160 140 96 158 Z"><title>Kaput</title></path>
        <path class="${partClass("roof")}" data-part="roof" d="M96 220 Q160 190 224 220 L224 356 Q160 384 96 356 Z"><title>Tavan</title></path>
        <path class="${partClass("trunk")}" data-part="trunk" d="M94 430 Q160 450 226 430 L236 522 Q160 552 84 522 Z"><title>Bagaj</title></path>
        <path class="${partClass("rearBumper")}" data-part="rearBumper" d="M84 528 Q160 558 236 528 L222 584 Q160 604 98 584 Z"><title>Arka tampon</title></path>
        <path class="${partClass("leftFrontFender")}" data-part="leftFrontFender" d="M60 116 L94 164 L88 266 L48 298 L40 190 Z"><title>Sol ön çamurluk</title></path>
        <path class="${partClass("rightFrontFender")}" data-part="rightFrontFender" d="M260 116 L226 164 L232 266 L272 298 L280 190 Z"><title>Sağ ön çamurluk</title></path>
        <path class="${partClass("leftDoor")}" data-part="leftDoor" d="M90 168 Q112 190 94 360 L58 390 L48 304 L88 270 Z"><title>Sol kapı</title></path>
        <path class="${partClass("rightDoor")}" data-part="rightDoor" d="M230 168 Q208 190 226 360 L262 390 L272 304 L232 270 Z"><title>Sağ kapı</title></path>
        <path class="${partClass("leftRearFender")}" data-part="leftRearFender" d="M58 398 L96 364 L88 518 L72 548 L48 502 Z"><title>Sol arka çamurluk</title></path>
        <path class="${partClass("rightRearFender")}" data-part="rightRearFender" d="M262 398 L224 364 L232 518 L248 548 L272 502 Z"><title>Sağ arka çamurluk</title></path>
        <path class="car-glass" d="M106 164 Q160 146 214 164 L224 214 Q160 190 96 214 Z" />
        <path class="car-glass" d="M98 362 Q160 386 222 362 L226 424 Q160 442 94 424 Z" />
      </svg>
    </div>
  `;
}

function renderDamageLists() {
  const groups = {
    paintedList: Object.entries(carParts).filter(([, status]) => statusClass(status) === "painted"),
    changedList: Object.entries(carParts).filter(([, status]) => statusClass(status) === "changed"),
    localList: Object.entries(carParts).filter(([, status]) => statusClass(status) === "local"),
  };

  Object.entries(groups).forEach(([id, items]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.length
      ? items.map(([key]) => `<span>${partLabels[key] || key}</span>`).join("")
      : "<span>Yok</span>";
  });
}

function bindCarDamagePicker() {
  const map = document.getElementById("createCarMap");
  const panel = document.getElementById("damagePanel");
  const label = document.getElementById("selectedPartName");
  if (!map || !panel) return;

  map.innerHTML = renderCarDamageMap(carParts).trim();

  map.querySelectorAll("[data-part]").forEach((part) => {
    const key = part.dataset.part;
    part.classList.add(statusClass(carParts[key] || "original"));
    part.addEventListener("click", () => {
      selectedDamagePart = key;
      if (label) label.textContent = partLabels[key] || "Parça";
      panel.hidden = false;
      map.querySelectorAll(".car-part").forEach((item) => item.classList.remove("selected"));
      part.classList.add("selected");
    });
  });

  panel.querySelectorAll("[data-damage-status]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!selectedDamagePart) return;
      const status = button.dataset.damageStatus;
      carParts[selectedDamagePart] = status;
      const part = map.querySelector(`[data-part="${selectedDamagePart}"]`);
      part.classList.remove("original", "painted", "changed", "local");
      part.classList.add(statusClass(status));
      renderDamageLists();
    });
  });

  renderDamageLists();
}

function numericValue(value) {
  return Number(String(value || "").replace(/\D/g, ""));
}

function formattedLira(value) {
  const number = numericValue(value);
  return number ? `${number.toLocaleString("tr-TR")} ₺` : "";
}

function youtubeEmbedUrl(url = "") {
  const value = String(url).trim();
  const lower = value.toLowerCase();
  if (!value || (!lower.includes("youtube") && !lower.includes("youtu.be"))) return "";

  const watchMatch = value.match(/[?&]v=([^&]+)/);
  const shortMatch = value.match(/youtu\.be\/([^?&]+)/);
  const embedMatch = value.match(/embed\/([^?&]+)/);
  const id = watchMatch?.[1] || shortMatch?.[1] || embedMatch?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

async function bindDistrictSelect() {
  const form = document.getElementById("listingForm");
  if (!form?.city || !form?.district) return;

  let districtsByCity = {};
  try {
    const res = await fetch("/data/districts.json");
    districtsByCity = await res.json();
  } catch {
    form.district.innerHTML = `<option value="">İlçeler yüklenemedi</option>`;
    return;
  }

  function updateDistricts() {
    const city = form.city.value;
    const districts = districtsByCity[city] || [];
    form.district.disabled = !districts.length;
    form.district.innerHTML = districts.length
      ? `<option value="">İlçe seç</option>${districts.map((district) => `<option>${district}</option>`).join("")}`
      : `<option value="">Önce şehir seç</option>`;
    validateCreateForm();
  }

  form.city.addEventListener("change", updateDistricts);
  updateDistricts();
}

async function loadDistrictData() {
  const res = await fetch("/data/districts.json");
  return res.json();
}

function selectedCheckboxValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function vehicleValue(form, name) {
  const select = form?.[name];
  const other = form?.[`${name}Other`];
  if (select?.value === "other") return other?.value.trim() || "";
  return select?.value || "";
}

function categoryKind(value = "") {
  const normalized = value.toLocaleLowerCase("tr-TR");
  if (["otomobil", "araç", "arac", "vasıta", "vasita"].includes(normalized)) return "vehicle";
  if (normalized === "emlak") return "estate";
  if (["elektronik", "telefon"].includes(normalized)) return "electronics";
  return "";
}

let vehicleFilterData = null;

async function loadVehicleFilterData() {
  if (vehicleFilterData) return vehicleFilterData;

  try {
    const res = await fetch("/data/cars.json");
    vehicleFilterData = await res.json();
  } catch (error) {
    vehicleFilterData = {};
  }

  return vehicleFilterData;
}

async function hydrateVehicleModelFilter(holder) {
  const brandSelect = holder.querySelector('[data-dynamic-filter="brand"]');
  const modelSelect = holder.querySelector('[data-dynamic-filter="model"]');
  if (!brandSelect || !modelSelect) return;

  const carData = await loadVehicleFilterData();

  brandSelect.addEventListener("change", () => {
    const brand = brandSelect.value;
    const models = brand && carData[brand] ? Object.keys(carData[brand]) : [];
    modelSelect.innerHTML = `<option value="">Tümü</option>${models
      .map((model) => `<option value="${model}">${model}</option>`)
      .join("")}`;
    loadListingsPage();
  });
}

function renderDynamicFilters() {
  const holder = document.getElementById("dynamicFilters");
  const category = document.getElementById("listingCategory")?.value || "";
  if (!holder) return;

  const kind = categoryKind(category);
  if (kind === "vehicle") {
    holder.innerHTML = `
      <div class="filter-group dynamic-filter-group">
        <h3>Araç Bilgileri</h3>
        <label>Marka <select data-dynamic-filter="brand"><option value="">Tümü</option><option>BMW</option><option>Mercedes-Benz</option><option>Audi</option><option>Volkswagen</option><option>Renault</option><option>Fiat</option><option>Toyota</option><option>Honda</option><option>Hyundai</option><option>Ford</option></select></label>
        <label>Model <select data-dynamic-filter="model"><option value="">Tümü</option></select></label>
        <div class="filter-row">
          <label>Yıl min <input data-dynamic-filter="yearMin" type="number" placeholder="Min"></label>
          <label>Yıl max <input data-dynamic-filter="yearMax" type="number" placeholder="Max"></label>
        </div>
        <div class="filter-row">
          <label>KM min <input data-dynamic-filter="kmMin" type="number" placeholder="Min"></label>
          <label>KM max <input data-dynamic-filter="kmMax" type="number" placeholder="Max"></label>
        </div>
        <label>Yakıt <select data-dynamic-filter="fuel"><option value="">Tümü</option><option>Benzin</option><option>Dizel</option><option>Elektrik</option></select></label>
        <label>Vites <select data-dynamic-filter="transmission"><option value="">Tümü</option><option>Manuel</option><option>Otomatik</option></select></label>
        <label>Kasa tipi <input data-dynamic-filter="body" placeholder="Sedan, SUV..."></label>
        <label>Motor hacmi <input data-dynamic-filter="engine" placeholder="1.6, 2.0..."></label>
      </div>
      <div class="filter-group dynamic-filter-group">
        <h3>Hasar Durumu</h3>
        <label><input type="checkbox" name="listingDamage" value="boyali"> Boyalı</label>
        <label><input type="checkbox" name="listingDamage" value="degisen"> Değişen</label>
        <label><input type="checkbox" name="listingDamage" value="lokal"> Lokal Boyalı</label>
      </div>
    `;
  } else if (kind === "estate") {
    holder.innerHTML = `
      <div class="filter-group dynamic-filter-group">
        <h3>Emlak Bilgileri</h3>
        <label>Oda sayısı <input data-dynamic-filter="rooms" placeholder="2+1, 3+1"></label>
        <div class="filter-row">
          <label>m² min <input data-dynamic-filter="sqmMin" type="number" placeholder="Min"></label>
          <label>m² max <input data-dynamic-filter="sqmMax" type="number" placeholder="Max"></label>
        </div>
        <label>Bina yaşı <input data-dynamic-filter="buildingAge" type="number" placeholder="Bina yaşı"></label>
        <label>Kat <input data-dynamic-filter="floor" placeholder="Kat"></label>
        <label><input type="checkbox" data-dynamic-filter="furnished" value="true"> Eşyalı</label>
        <label><input type="checkbox" data-dynamic-filter="inSite" value="true"> Site içinde</label>
      </div>
    `;
  } else if (kind === "electronics") {
    holder.innerHTML = `
      <div class="filter-group dynamic-filter-group">
        <h3>Elektronik Bilgileri</h3>
        <label>Marka <input data-dynamic-filter="brand" placeholder="Marka"></label>
        <label>Model <input data-dynamic-filter="model" placeholder="Model"></label>
        <label>Durum <select data-dynamic-filter="condition"><option value="">Tümü</option><option>Sıfır</option><option>İkinci el</option></select></label>
        <label>Garanti <select data-dynamic-filter="warranty"><option value="">Tümü</option><option>Var</option><option>Yok</option></select></label>
      </div>
    `;
  } else {
    holder.innerHTML = "";
  }

  holder.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("change", loadListingsPage);
    input.addEventListener("input", loadListingsPage);
  });

  if (kind === "vehicle") hydrateVehicleModelFilter(holder);
}

function dynamicFilterValues() {
  const values = {};
  document.querySelectorAll("[data-dynamic-filter]").forEach((input) => {
    const key = input.dataset.dynamicFilter;
    if (input.type === "checkbox") {
      if (input.checked) values[key] = input.value || "true";
    } else if (input.value) {
      values[key] = input.value;
    }
  });
  return values;
}

async function initHomeSearchHero() {
  const form = document.getElementById("homeSearchForm");
  if (!form) return;

  const citySelect = document.getElementById("homeSearchCity");
  const districtSelect = document.getElementById("homeSearchDistrict");
  let districts = {};

  try {
    districts = await loadDistrictData();
    if (citySelect) {
      citySelect.innerHTML = `<option value="">Şehir</option>${Object.keys(districts)
        .map((city) => `<option>${city}</option>`)
        .join("")}`;
    }
  } catch {
    if (citySelect) citySelect.innerHTML = `<option value="">Şehirler yüklenemedi</option>`;
  }

  citySelect?.addEventListener("change", () => {
    const list = districts[citySelect.value] || [];
    if (!districtSelect) return;
    districtSelect.disabled = !list.length;
    districtSelect.innerHTML = list.length
      ? `<option value="">İlçe</option>${list.map((district) => `<option>${district}</option>`).join("")}`
      : `<option value="">İlçe</option>`;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const values = {
      q: document.getElementById("homeSearchQ")?.value,
      category: document.getElementById("homeSearchCategory")?.value,
      city: citySelect?.value,
      district: districtSelect?.value,
    };

    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    window.location.href = `/ilanlar.html${params.toString() ? `?${params.toString()}` : ""}`;
  });
}

function listingCatalogCard(listing) {
  const features = Array.isArray(listing.features) ? listing.features.slice(0, 4) : [];
  const place = [listing.city, listing.district].filter(Boolean).join(" / ") || "Konum belirtilmedi";
  const date = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
    : "Bugün";

  return `
    <a class="listing-catalog-card" href="${listingUrl(listing)}">
      <div class="listing-catalog-media">
        <img src="${imageOf(listing)}" alt="${listing.title}" loading="lazy">
        <strong>${money(listing.price)}</strong>
      </div>
      <div class="listing-catalog-body">
        <h3>${listing.title}</h3>
        <p>${place}</p>
        <div class="listing-badges">
          ${features.length ? features.map((item) => `<span>${item}</span>`).join("") : `<span>Standart ilan</span>`}
        </div>
        <small>${date}</small>
      </div>
    </a>
  `;
}

async function loadListingsPage() {
  const grid = document.getElementById("listingCatalogGrid");
  const count = document.getElementById("listingResultCount");
  if (!grid) return;

  const params = new URLSearchParams();
  const fields = {
    category: document.getElementById("listingCategory")?.value,
    city: document.getElementById("listingCity")?.value,
    district: document.getElementById("listingDistrict")?.value,
    minPrice: document.getElementById("listingMinPrice")?.value,
    maxPrice: document.getElementById("listingMaxPrice")?.value,
    q: document.getElementById("listingSearch")?.value,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  Object.entries(dynamicFilterValues()).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const damage = selectedCheckboxValues("listingDamage");
  if (damage.length) params.set("damage", damage.join(","));
  params.set("page", "1");
  params.set("limit", "30");

  grid.innerHTML = `<div class="spinner"></div>`;
  if (count) count.textContent = "İlanlar yükleniyor...";

  try {
    await loadFavoriteIds();
    const res = await fetch(`${API}/api/listings?${params.toString()}`);
    const listings = await res.json();
    if (!res.ok) throw new Error(listings.message || "İlanlar yüklenemedi");

    if (count) count.textContent = `${listings.length} ilan gösteriliyor`;
    grid.innerHTML = listings.length
      ? listings.map(listingCatalogCard).join("")
      : `<div class="message">İlan bulunamadı. Filtreleri değiştirerek tekrar deneyebilirsin.</div>`;
  } catch (error) {
    if (count) count.textContent = "Sonuç alınamadı";
    grid.innerHTML = `<div class="message">${error.message}</div>`;
  }
}

window.loadListingsPage = loadListingsPage;

async function initListingsPage() {
  const grid = document.getElementById("listingCatalogGrid");
  if (!grid) return;

  const citySelect = document.getElementById("listingCity");
  const districtSelect = document.getElementById("listingDistrict");
  const urlParams = new URLSearchParams(window.location.search);
  let districts = {};

  try {
    districts = await loadDistrictData();
    if (citySelect) {
      citySelect.innerHTML = `<option value="">Tüm şehirler</option>${Object.keys(districts)
        .map((city) => `<option>${city}</option>`)
        .join("")}`;
    }
  } catch {
    if (citySelect) citySelect.innerHTML = `<option value="">Şehirler yüklenemedi</option>`;
  }

  function updateDistrictFilter() {
    const city = citySelect?.value;
    const list = districts[city] || [];
    if (!districtSelect) return;
    districtSelect.disabled = !list.length;
    districtSelect.innerHTML = list.length
      ? `<option value="">Tüm ilçeler</option>${list.map((district) => `<option>${district}</option>`).join("")}`
      : `<option value="">Önce şehir seç</option>`;
    loadListingsPage();
  }

  citySelect?.addEventListener("change", updateDistrictFilter);
  document.getElementById("listingCategory")?.addEventListener("change", () => {
    renderDynamicFilters();
    loadListingsPage();
  });
  [
    "listingDistrict",
    "listingMinPrice",
    "listingMaxPrice",
    "listingSearch",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(id === "listingSearch" ? "input" : "change", loadListingsPage);
  });

  document.getElementById("clearListingFilters")?.addEventListener("click", () => {
    document.querySelectorAll(".listing-filter-panel input").forEach((input) => {
      if (input.type === "checkbox") input.checked = false;
      else input.value = "";
    });
    document.querySelectorAll(".listing-filter-panel select").forEach((select) => {
      select.value = "";
    });
    if (districtSelect) {
      districtSelect.disabled = true;
      districtSelect.innerHTML = `<option value="">Önce şehir seç</option>`;
    }
    renderDynamicFilters();
    loadListingsPage();
  });

  const q = urlParams.get("q");
  const category = urlParams.get("category");
  const city = urlParams.get("city");
  const district = urlParams.get("district");
  if (q) document.getElementById("listingSearch").value = q;
  if (category) document.getElementById("listingCategory").value = category;
  renderDynamicFilters();
  if (city && citySelect) {
    citySelect.value = city;
    const list = districts[city] || [];
    if (districtSelect) {
      districtSelect.disabled = !list.length;
      districtSelect.innerHTML = list.length
        ? `<option value="">Tüm ilçeler</option>${list.map((item) => `<option>${item}</option>`).join("")}`
        : `<option value="">Önce şehir seç</option>`;
      if (district) districtSelect.value = district;
    }
  }

  loadListingsPage();
}

function shortTime(value) {
  return new Date(value).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function applyFilters() {
  const container = document.getElementById("listingGrid");
  if (!container) return;

  container.innerHTML = `<div class="spinner"></div>`;

  try {
    const listings = await fetchListings(buildQuery());
    container.innerHTML = listings.length
      ? listings.map(listingCard).join("")
      : `<div class="message">Henüz ilan yok, ilk ilanı sen ekle.</div>`;
    bindFavoriteButtons?.(container);
  } catch (error) {
    container.innerHTML = `<div class="message">${error.message}</div>`;
  }
}

function renderGallery(listing) {
  const images = imagesOf(listing);
  return `
    <div class="detail-card">
      <img class="detail-image" id="mainImage" src="${images[0]}" alt="${listing.title}">
      <div class="thumbs">
        ${images.map((img, index) => `<img class="${index === 0 ? "active" : ""}" src="${img}" alt="${listing.title} küçük görsel">`).join("")}
      </div>
      <h1>${listing.title}</h1>
      <p>${listing.description || "Açıklama eklenmemiş."}</p>
    </div>
  `;
}

function renderListingExtras(listing) {
  const features = Array.isArray(listing.features) ? listing.features : [];
  const featureGroups = [
    ["Güvenlik", ["ABS", "ESP", "Airbag", "ISOFIX", "Yokuş kalkış"]],
    ["İç Donanım", ["Klima", "Deri koltuk", "Deri Koltuk", "Sunroof", "Isıtmalı koltuk", "Multimedya"]],
    ["Dış Donanım", ["Park sensörü", "Far sensörü", "Yağmur sensörü", "Jant"]],
    ["Multimedya", ["Bluetooth", "Apple CarPlay", "Android Auto"]],
  ];
  const tags = (items) => items.length
    ? `<div class="feature-tags">${items.map((item) => `<span>${item}</span>`).join("")}</div>`
    : `<p class="muted">Bu bölüm için özellik seçilmemiş.</p>`;

  return `
    <div class="detail-card">
      ${featureGroups.map(([title, allowed]) => {
        const selected = features.filter((item) => allowed.includes(item));
        const normalized = title === "İç Donanım"
          ? selected.map((item) => item === "Deri Koltuk" ? "Deri koltuk" : item)
          : selected;
        return `
          <div class="features-box detail-features">
            <h3>${title}</h3>
            ${tags([...new Set(normalized)])}
          </div>
        `;
      }).join("")}
      <div class="damage-box detail-damage">
        <h3>Araç Hasar Durumu</h3>
        ${renderCarDamageMap(listing.carParts || {}, true)}
      </div>
    </div>
  `;
}

function bindGallery() {
  const main = document.getElementById("mainImage");
  if (!main) return;

  document.querySelectorAll(".thumbs img").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".thumbs img").forEach((item) => item.classList.remove("active"));
      thumb.classList.add("active");
      main.src = thumb.src;
    });
  });
}

function setSeoMeta(name, content, property = false) {
  if (!content) return;
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function updateListingSeo(listing) {
  const title = `${listing.title} - Jetle`;
  const description = listing.description || `${listing.title} ilanı Jetle'de.`;
  const image = imageOf(listing);
  document.title = title;
  setSeoMeta("description", description);
  setSeoMeta("keywords", `${listing.title}, ${listing.category || "ilan"}, ${listing.city || ""}, Jetle`);
  setSeoMeta("og:title", title, true);
  setSeoMeta("og:description", description, true);
  setSeoMeta("og:image", image, true);

  let schema = document.getElementById("listingSchema");
  if (!schema) {
    schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "listingSchema";
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    image,
    description,
    offers: {
      "@type": "Offer",
      price: Number(listing.price || 0),
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
    },
  });
}

async function loadMessages(listingId, userId) {
  const token = localStorage.getItem("token");
  const box = document.getElementById("chatMessages");
  if (!token || !box || !listingId || !userId) return;

  try {
    const res = await fetch(`${API}/api/messages/${listingId}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const messages = await res.json();
    if (!res.ok) throw new Error(messages.message || "Mesajlar alınamadı");
    const me = getAuthUserId();
    box.innerHTML = messages.map((msg) => `
      <div class="chat-message ${String(msg.sender?._id || msg.sender) === String(me) ? "mine" : ""} ${msg.seen ? "seen" : ""}" id="msg-${msg._id}">
        <p>${msg.text}</p>
        <small>${shortTime(msg.createdAt)}</small>
        ${String(msg.sender?._id || msg.sender) === String(me) ? `<button class="msg-delete" type="button" onclick="deleteMsg('${msg._id}')">Sil</button>` : ""}
      </div>
    `).join("") || `<div class="muted">Henüz mesaj yok.</div>`;
    box.scrollTop = box.scrollHeight;
    if (messages.some((msg) => String(msg.receiver?._id || msg.receiver) === String(me) && !msg.seen)) {
      markMessagesSeen(listingId, userId);
    }
  } catch (error) {
    box.innerHTML = `<div class="muted">${error.message}</div>`;
  }
}

async function markMessagesSeen(listingId, otherUserId) {
  const token = localStorage.getItem("token");
  const me = getAuthUserId();
  if (!token || !me || !listingId || !otherUserId) return;

  try {
    await fetch(`${API}/api/messages/seen/${listingId}/${me}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    emitSeen?.({ listingId, userId: otherUserId });
    loadUnread?.();
  } catch {
    // Seen state is a UX enhancement; chat should keep working if this fails.
  }
}

async function deleteMsg(id) {
  const token = localStorage.getItem("token");
  if (!token || !id) {
    window.location.href = "/login.html";
    return;
  }

  const otherUser = window.currentChatUser;
  const res = await fetch(`${API}/api/messages/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert(data.message || "Mesaj silinemedi");
    return;
  }

  emitDeleteMessage?.({ messageId: id, to: otherUser });
  document.getElementById(`msg-${id}`)?.remove();
}

window.deleteMsg = deleteMsg;

function bindChat(listing) {
  const form = document.getElementById("chatForm");
  if (!form) return;

  const sellerId = listing.createdBy?._id || listing.createdBy;
  window.currentChatUser = sellerId;
  window.currentListingId = listing._id;
  if (detailChatTimer) clearInterval(detailChatTimer);
  loadMessages(listing._id, sellerId);
  detailChatTimer = setInterval(() => loadMessages(listing._id, sellerId), 3000);
  setChatPresence?.(sellerId);

  document.addEventListener("onlineUsers:update", () => setChatPresence?.(sellerId));
  document.addEventListener("socket:newMessage", (event) => {
    const msg = event.detail;
    if (String(msg.listing) === String(listing._id)) {
      loadMessages(listing._id, sellerId);
    }
  });
  document.addEventListener("socket:typing", (event) => {
    if (String(event.detail) === String(sellerId)) showTyping?.(sellerId);
  });
  document.addEventListener("socket:seen", (event) => {
    if (String(event.detail) === String(listing._id)) {
      document.querySelectorAll("#chatMessages .chat-message.mine").forEach((el) => {
        el.classList.add("seen");
      });
    }
  });

  form.text?.addEventListener("input", () => emitTyping?.(sellerId));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login.html";
      return;
    }

    const text = form.text.value.trim();
    if (!text) return;

    const res = await fetch(`${API}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver: sellerId,
        listing: listing._id,
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Mesaj gönderilemedi");
      return;
    }

    form.reset();
    emitSocketMessage?.({
      sender: getAuthUserId(),
      receiver: sellerId,
      text,
      listing: listing._id,
      createdAt: data.createdAt || new Date(),
    });
    loadMessages(listing._id, sellerId);
    loadUnread?.();
  });
}

async function loadDetail() {
  const detail = document.getElementById("detail");
  if (!detail) return;

  const pathMatch = window.location.pathname.match(/^\/ilan\/([a-f0-9]{24})/i);
  const id = pathMatch?.[1] || new URLSearchParams(window.location.search).get("id");
  if (!id) {
    detail.innerHTML = `<div class="message">İlan ID bulunamadı.</div>`;
    return;
  }

  try {
    const res = await fetch(`${API}/api/listings/${id}`);
    const listing = await res.json();
    if (!res.ok) throw new Error(listing.message || "İlan bulunamadı");
    updateListingSeo(listing);

    detail.innerHTML = `
      <div class="detail-layout">
        <div>
          ${renderGallery(listing)}
          ${renderListingExtras(listing)}
        </div>
        <aside>
          <div class="detail-card">
            <h2 class="detail-price">${money(listing.price)}</h2>
            <div class="info-box">
              <p><b>Şehir:</b> ${listing.city || "İstanbul"}</p>
              <p><b>İlçe:</b> ${listing.district || "-"}</p>
              <p><b>Kategori:</b> ${listing.category}</p>
            </div>
            <div class="seller-card">
              <h3>Satıcı</h3>
              <p>${listing.createdBy?.username || "Jetle Kullanıcı"}</p>
              <button class="btn-primary" type="button" onclick="document.getElementById('chatText')?.focus()">Mesaj Gönder</button>
            </div>
            <div class="chat-box">
              <h3>Mesajlaşma <span id="status" class="chat-status offline">Offline</span></h3>
              <div class="typing-line" id="typing"></div>
              <div class="chat-messages" id="chatMessages"></div>
              <form class="chat-form" id="chatForm">
                <input id="chatText" name="text" placeholder="Mesaj yaz">
                <button class="btn-primary" type="submit">Gönder</button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    `;
    bindGallery();
    bindChat(listing);
  } catch (error) {
    detail.innerHTML = `<div class="message">${error.message}</div>`;
  }
}

async function createListing(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const message = document.getElementById("listingMessage");

  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  if (!validateCreateForm()) return;

  const form = event.currentTarget;
  const formData = new FormData();
  formData.append("title", form.title.value);
  formData.append("price", numericValue(form.price.value));
  formData.append("category", form.category.value);
  formData.append("city", form.city.value);
  formData.append("district", form.district?.value || "");
  formData.append("brand", vehicleValue(form, "brand"));
  formData.append("model", vehicleValue(form, "model"));
  formData.append("series", vehicleValue(form, "series"));
  formData.append("year", form.year?.value || "");
  formData.append("km", form.km?.value || "");
  formData.append("fuel", form.fuel?.value || "");
  formData.append("transmission", form.transmission?.value || "");
  formData.append("body", form.body?.value || "");
  formData.append("bodyType", form.body?.value || "");
  formData.append("engine", form.engine?.value || "");
  formData.append("power", form.power?.value || "");
  formData.append("description", form.description.value);
  formData.append("image", form.image?.value || "");
  formData.append("video", form.video?.value || "");
  const selectedFeatures = [...form.querySelectorAll('input[name="features"]:checked')].map((input) => input.value);
  formData.append("features", JSON.stringify(selectedFeatures));
  formData.append("carParts", JSON.stringify(carParts));

  const publishBtn = document.getElementById("publishBtn");
  if (publishBtn) {
    publishBtn.disabled = true;
    publishBtn.textContent = "Yükleniyor...";
  }

  selectedCreateFiles.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const res = await fetch(`${API}/api/listings`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "İlan eklenemedi");
    window.location.href = listingUrl(data);
  } catch (error) {
    if (message) message.textContent = error.message;
    if (publishBtn) {
      publishBtn.textContent = "İlanı Yayınla";
      validateCreateForm();
    }
  }
}

function validateCreateForm() {
  const form = document.getElementById("listingForm");
  if (!form) return true;

  const publishBtn = document.getElementById("publishBtn");
  const year = Number(form.year?.value || 0);
  const km = Number(form.km?.value || 0);
  const yearError = document.getElementById("yearError");
  const kmError = document.getElementById("kmError");
  let valid = true;

  function setInvalid(input, error, message) {
    input?.classList.add("invalid");
    if (error) error.textContent = message;
    valid = false;
  }

  function clearInvalid(input, error) {
    input?.classList.remove("invalid");
    if (error) error.textContent = "";
  }

  clearInvalid(form.year, yearError);
  clearInvalid(form.km, kmError);

  if (form.year?.value && (year < 1980 || year > 2025)) {
    setInvalid(form.year, yearError, "Yıl 1980 - 2025 arasında olmalı.");
  }

  if (form.km?.value && (km < 0 || km > 1000000)) {
    setInvalid(form.km, kmError, "KM en fazla 1.000.000 olabilir.");
  }

  const required = [
    form.title?.value.trim(),
    numericValue(form.price?.value),
    form.description?.value.trim(),
    form.city?.value,
    form.district?.value,
    form.category?.value,
  ];

  if (form.brand && !document.getElementById("vehicleFields")?.hidden) required.push(vehicleValue(form, "brand"));
  if (form.series && !document.getElementById("vehicleFields")?.hidden) required.push(vehicleValue(form, "series"));
  if (form.model && !document.getElementById("vehicleFields")?.hidden) required.push(vehicleValue(form, "model"));

  if (required.some((value) => !value)) valid = false;
  if (publishBtn) publishBtn.disabled = !valid;
  updateStepButtons();
  return valid;
}

function bindCreatePreview() {
  const form = document.getElementById("listingForm");
  const card = document.querySelector(".create-preview-card");
  if (!form || !card) return;

  const title = document.getElementById("createPreviewTitle");
  const price = document.getElementById("createPreviewPrice");
  const meta = document.getElementById("createPreviewMeta");
  const vehicle = document.getElementById("createPreviewVehicle");
  const image = document.getElementById("createPreviewImage");
  const list = document.getElementById("miniPreviewList");
  const videoPreview = document.getElementById("videoPreview");

  function updateText() {
    if (title) title.textContent = form.title?.value || "İlan başlığı";
    if (price) price.textContent = formattedLira(form.price?.value) || "0 TL";
    if (meta) {
      const city = form.city?.value || "Şehir";
      const district = form.district?.value;
      const category = form.category?.value || "Kategori";
      meta.textContent = `${city}${district ? ` / ${district}` : ""} / ${category}`;
    }
    if (vehicle) {
      const brand = vehicleValue(form, "brand") || "Marka";
      const model = vehicleValue(form, "model") || "Model";
      const series = vehicleValue(form, "series") || "";
      vehicle.textContent = `${brand} / ${model}${series ? ` / ${series}` : ""}`;
    }
    if (videoPreview) {
      const embed = youtubeEmbedUrl(form.video?.value);
      videoPreview.innerHTML = embed
        ? `<iframe src="${embed}" title="Video önizleme" allowfullscreen></iframe>`
        : "";
    }
  }

  function updateImages() {
    const files = selectedCreateFiles;
    if (!files.length) {
      if (image) {
        image.textContent = "Görsel";
        image.style.backgroundImage = "";
      }
      if (list) list.innerHTML = "";
      return;
    }

    const urls = files.slice(0, 6).map((file) => URL.createObjectURL(file));
    if (image) {
      image.textContent = "";
      image.style.backgroundImage = `url("${urls[0]}")`;
    }
    if (list) {
      list.innerHTML = urls.map((url, index) => `
        <div class="photo-preview-item">
          <img src="${url}" alt="Önizleme">
          <button type="button" data-remove-photo="${index}">Sil</button>
        </div>
      `).join("");
    }
  }

  ["input", "change"].forEach((eventName) => {
    form.addEventListener(eventName, () => {
      updateText();
      validateCreateForm();
    });
  });

  form.price?.addEventListener("input", () => {
    const raw = numericValue(form.price.value);
    form.price.value = raw ? `${raw.toLocaleString("tr-TR")} ₺` : "";
  });

  form.images?.addEventListener("change", () => {
    selectedCreateFiles = Array.from(form.images.files || []);
    updateImages();
  });

  const drop = document.getElementById("photoDrop");
  if (drop && form.images) {
    ["dragenter", "dragover"].forEach((eventName) => {
      drop.addEventListener(eventName, (event) => {
        event.preventDefault();
        drop.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      drop.addEventListener(eventName, (event) => {
        event.preventDefault();
        drop.classList.remove("drag-over");
      });
    });

    drop.addEventListener("drop", (event) => {
      const files = Array.from(event.dataTransfer?.files || []).filter((file) => file.type.startsWith("image/"));
      if (!files.length) return;
      selectedCreateFiles = files;
      updateImages();
    });
  }

  list?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-photo]");
    if (!button) return;
    selectedCreateFiles.splice(Number(button.dataset.removePhoto), 1);
    form.images.value = "";
    updateImages();
  });

  updateText();
  validateCreateForm();
  updateStepButtons();
  bindCarDamagePicker();
  bindDistrictSelect();
}

async function loadAdmin() {
  const adminList = document.getElementById("adminListings");
  if (!adminList) return;

  adminList.innerHTML = `<div class="spinner"></div>`;
  try {
    const listings = await fetchListings();
    adminList.innerHTML = listings.map((item) => `
      <div class="admin-row">
        <img src="${imageOf(item)}" alt="${item.title}">
        <div>
          <strong>${item.title}</strong>
          <div class="muted">${money(item.price)} - ${item.city || "İstanbul"}</div>
        </div>
        <button class="admin-delete" data-id="${item._id}">Sil</button>
      </div>
    `).join("") || `<div class="message">İlan yok.</div>`;
  } catch (error) {
    adminList.innerHTML = `<div class="message">${error.message}</div>`;
  }
}

async function deleteListing(id, reload = loadAdmin) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  if (!confirm("Bu ilan silinsin mi?")) return;

  const res = await fetch(`${API}/api/listings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.message || "Silme başarısız");
    return;
  }

  reload();
}

function closeSidebar() {
  document.getElementById("sidebarPanel")?.classList.remove("open");
  document.getElementById("sidebarBackdrop")?.classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("filterBtn")?.addEventListener("click", applyFilters);
  ["category", "city", "min", "max"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", applyFilters);
  });

  document.querySelectorAll(".category-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelectorAll(".category-link").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      document.getElementById("category").value = link.dataset.category || "";
      closeSidebar();
      applyFilters();
    });
  });

  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    document.getElementById("sidebarPanel")?.classList.add("open");
    document.getElementById("sidebarBackdrop")?.classList.add("open");
  });
  document.getElementById("sidebarBackdrop")?.addEventListener("click", closeSidebar);

  document.getElementById("listingForm")?.addEventListener("submit", createListing);
  bindCreatePreview();
  initHomeSearchHero();
  initListingsPage();
  document.getElementById("adminListings")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (button) deleteListing(button.dataset.id);
  });

  loadDetail();
  loadAdmin();
});
