window.API_BASE = "http://localhost:3000";
let carData = {};
let favoriteIds = new Set();
const fallbackVehicleModels = {
  BMW: ["3 Serisi", "5 Serisi"],
  Toyota: ["Corolla", "Camry"],
  Mercedes: ["C200", "E200"],
};

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function money(value) {
  return Number(value || 0).toLocaleString("tr-TR") + " TL";
}

function imageOf(listing) {
  if (Array.isArray(listing.images) && listing.images.length) return listing.images[0];
  if (listing.image && listing.image.trim()) return listing.image;
  return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80";
}

function slugify(value = "") {
  return String(value)
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function listingUrl(listing) {
  const id = listing?._id || listing?.id;
  const slug = slugify(listing?.title || "ilan");
  return id ? `/ilan/${id}-${slug}` : "/ilanlar.html";
}

window.listingUrl = listingUrl;

function isNewListing(listing) {
  if (!listing.createdAt) return true;
  const age = Date.now() - new Date(listing.createdAt).getTime();
  return age < 7 * 24 * 60 * 60 * 1000;
}

function shuffled(listings) {
  return [...listings].sort(() => Math.random() - 0.5);
}

function listingCard(listing, options = {}) {
  const badge = listing.isBoosted ? "Öne Çıkan" : (options.badge || (isNewListing(listing) ? "Yeni" : ""));
  const isFavorite = favoriteIds.has(String(listing._id));
  const city = listing.city || "İstanbul";

  return `
    <a class="card" href="${listingUrl(listing)}">
      <div class="card-media">
        ${badge ? `<span class="badge ${listing.isBoosted ? "boost-badge" : ""}">${badge}</span>` : ""}
        <button class="favorite-btn ${isFavorite ? "active" : ""}" type="button" data-favorite-id="${listing._id}" aria-label="Favorilere ekle">♥</button>
        <img class="card-img" src="${imageOf(listing)}" alt="${listing.title}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${listing.title}</h3>
        <p class="price">${money(listing.price)}</p>
        <p class="muted">${city} / ${listing.category}</p>
      </div>
    </a>
  `;
}

function setMessage(container, text = "Henüz ilan yok, ilk ilanı sen ekle.") {
  container.innerHTML = `<div class="message">${text}</div>`;
}

async function fetchListings(params = "") {
  const res = await fetch(`${window.API_BASE}/api/listings${params}`);
  if (!res.ok) throw new Error("İlanlar yüklenemedi");
  return res.json();
}

async function loadFavoriteIds() {
  const token = localStorage.getItem("token");
  favoriteIds = new Set();
  if (!token) return favoriteIds;

  try {
    const res = await fetch(`${window.API_BASE}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const favorites = await res.json();
    if (res.ok) {
      favoriteIds = new Set(favorites.map((item) => String(item._id)));
    }
  } catch {
    favoriteIds = new Set();
  }

  return favoriteIds;
}

function renderSideListings(listings) {
  const side = qs("#sideListings");
  if (!side) return;

  const picks = shuffled(listings).slice(0, 6);
  side.innerHTML = picks.map((item) => `
    <a class="side-item" href="${listingUrl(item)}">
      <img src="${imageOf(item)}" alt="${item.title}" loading="lazy">
      <div>
        <strong>${item.title}</strong>
        <div class="muted">${money(item.price)}</div>
      </div>
    </a>
  `).join("") || `<div class="muted">Trend ilanlar hazırlanıyor.</div>`;
}

function bindFavoriteButtons(root = document) {
  root.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login.html";
        return;
      }

      const id = button.dataset.favoriteId;
      const res = await fetch(`${window.API_BASE}/api/favorites/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Favori işlemi başarısız");
        return;
      }

      if (data.favorited) favoriteIds.add(String(id));
      else favoriteIds.delete(String(id));

      document.querySelectorAll(`[data-favorite-id="${id}"]`).forEach((item) => {
        item.classList.toggle("active", data.favorited);
      });
    });
  });
}

function loadBrands() {
  const brandSelect = document.getElementById("brand");
  const seriesSelect = document.getElementById("series");
  const modelSelect = document.getElementById("model");
  if (!brandSelect) return;

  brandSelect.innerHTML = '<option value="">Marka se?</option>';
  if (seriesSelect) {
    seriesSelect.innerHTML = '<option value="">Seri se?</option>';
    seriesSelect.disabled = true;
  }
  if (modelSelect) {
    modelSelect.innerHTML = '<option value="">Model se?</option>';
    modelSelect.disabled = true;
  }

  const brands = Object.keys(carData).length ? Object.keys(carData) : Object.keys(fallbackVehicleModels);
  brands.forEach((brand) => {
    brandSelect.innerHTML += '<option value="' + brand + '">' + brand + '</option>';
  });
  brandSelect.innerHTML += '<option value="other">Di&#287;er</option>';
}

function onBrandChange() {
  const brand = document.getElementById("brand")?.value;
  const seriesSelect = document.getElementById("series");
  const modelSelect = document.getElementById("model");
  const brandOther = document.getElementById("brandOther");
  const modelOther = document.getElementById("modelOther");
  const seriesOther = document.getElementById("seriesOther");
  if (!seriesSelect || !modelSelect) return;

  if (brandOther) brandOther.hidden = brand !== "other";
  if (modelOther) modelOther.hidden = true;
  if (seriesOther) seriesOther.hidden = true;

  seriesSelect.innerHTML = '<option value="">Seri se?</option>';
  modelSelect.innerHTML = '<option value="">Model se?</option>';
  seriesSelect.disabled = !brand;
  modelSelect.disabled = true;

  if (brand === "other") {
    seriesSelect.innerHTML += '<option value="other">Di&#287;er</option>';
    seriesSelect.disabled = false;
    document.getElementById("listingForm")?.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  const seriesList = carData[brand] ? Object.keys(carData[brand]) : (fallbackVehicleModels[brand] || []);
  seriesList.forEach((series) => {
    seriesSelect.innerHTML += '<option value="' + series + '">' + series + '</option>';
  });
  seriesSelect.innerHTML += '<option value="other">Di&#287;er</option>';
  document.getElementById("listingForm")?.dispatchEvent(new Event("input", { bubbles: true }));
}

function onSeriesChange() {
  const brand = document.getElementById("brand")?.value;
  const series = document.getElementById("series")?.value;
  const modelSelect = document.getElementById("model");
  const modelOther = document.getElementById("modelOther");
  const seriesOther = document.getElementById("seriesOther");
  if (!modelSelect) return;

  if (seriesOther) seriesOther.hidden = series !== "other";
  if (modelOther) modelOther.hidden = true;
  modelSelect.innerHTML = '<option value="">Model se?</option>';
  modelSelect.disabled = !series;

  if (series === "other") {
    modelSelect.innerHTML += '<option value="other">Di&#287;er</option>';
    modelSelect.disabled = false;
    document.getElementById("listingForm")?.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  if (!brand || !series || !carData[brand]?.[series]) return;

  Object.keys(carData[brand][series]).forEach((model) => {
    modelSelect.innerHTML += '<option value="' + model + '">' + model + '</option>';
  });
  modelSelect.innerHTML += '<option value="other">Di&#287;er</option>';
  document.getElementById("listingForm")?.dispatchEvent(new Event("input", { bubbles: true }));
}

function onModelChange() {
  const brand = document.getElementById("brand")?.value;
  const series = document.getElementById("series")?.value;
  const model = document.getElementById("model")?.value;
  const modelOther = document.getElementById("modelOther");

  if (modelOther) modelOther.hidden = model !== "other";
  if (model === "other") {
    document.getElementById("listingForm")?.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  const spec = carData[brand]?.[series]?.[model];
  if (!spec) return;

  const fuel = document.getElementById("fuel");
  const transmission = document.getElementById("transmission");
  const body = document.getElementById("body");
  const engine = document.getElementById("engine");
  const power = document.getElementById("power");

  if (fuel) fuel.value = spec.fuel || "";
  if (transmission) transmission.value = spec.transmission || "";
  if (body) body.value = spec.body || "";
  if (engine) engine.value = spec.engine || "";
  if (power) power.value = spec.power || "";

  document.getElementById("listingForm")?.dispatchEvent(new Event("input", { bubbles: true }));
}

function toggleVehicleFields() {
  const form = document.getElementById("listingForm");
  const holder = document.getElementById("vehicleFields");
  if (!form || !holder) return;

  const category = String(form.category?.value || "").toLocaleLowerCase("tr-TR");
  const isVehicle = ["otomobil", "araç", "arac", "vasıta", "vasita"].includes(category);
  holder.hidden = !isVehicle;
}

async function loadCarData() {
  if (!document.getElementById("brand")) return;

  try {
    const res = await fetch("/data/cars.json");
    carData = await res.json();
  } catch (error) {
    console.error("Araç verisi alınamadı:", error.message);
  }

  loadBrands();
  toggleVehicleFields();
}

async function loadHomeListings() {
  const latest = qs("#listingGrid");
  const featured = qs("#featuredGrid");
  if (!latest) return;

  latest.innerHTML = `<div class="spinner"></div>`;
  if (featured) featured.innerHTML = `<div class="spinner"></div>`;

  try {
    await loadFavoriteIds();
    const listings = await fetchListings("?page=1&limit=6");
    if (!listings.length) {
      setMessage(latest);
      if (featured) setMessage(featured, "Henüz öne çıkan ilan yok, ilk ilanı sen ekle.");
      renderSideListings([]);
      return;
    }

    if (featured) {
      featured.innerHTML = shuffled(listings)
        .slice(0, 6)
        .map((item) => listingCard(item, { badge: "Öne Çıkan" }))
        .join("");
    }

    latest.innerHTML = listings.slice(0, 6).map((item) => listingCard(item)).join("");
    renderSideListings(listings);
    bindFavoriteButtons();
  } catch (error) {
    setMessage(latest, error.message);
    if (featured) setMessage(featured, error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadHomeListings();
  loadCarData();
  document.getElementById("listingForm")?.category?.addEventListener("change", toggleVehicleFields);
});
