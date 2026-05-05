const API = "";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getParams() {
  return new URLSearchParams(window.location.search);
}

const categoryLabels = {
  emlak: "Emlak",
  vasita: "Vasıta",
  elektronik: "Elektronik"
};

function getCategoryFromUrl() {
  return (getParams().get("category") || "").trim();
}

function setPageTitle() {
  const title = document.getElementById("pageTitle");
  if (!title) return;

  const category = getCategoryFromUrl();
  title.textContent = category
    ? `${categoryLabels[category] || category} İlanları`
    : "Tüm İlanlar";
}

function setFormFromUrl() {
  const params = getParams();

  const searchInput = document.getElementById("searchInput");
  const category = document.getElementById("filterCategory");
  const city = document.getElementById("filterCity");
  const min = document.getElementById("minPrice");
  const max = document.getElementById("maxPrice");

  if (searchInput) searchInput.value = params.get("q") || params.get("search") || "";
  if (category) category.value = params.get("category") || "";
  if (city) city.value = params.get("city") || "";
  if (min) min.value = params.get("min") || "";
  if (max) max.value = params.get("max") || "";
}

function buildQueryFromForm() {
  const params = new URLSearchParams();
  const search = document.getElementById("searchInput")?.value.trim();
  const category = document.getElementById("filterCategory")?.value;
  const city = document.getElementById("filterCity")?.value.trim();
  const min = document.getElementById("minPrice")?.value;
  const max = document.getElementById("maxPrice")?.value;

  if (search) params.set("q", search);
  if (category) params.set("category", category);
  if (city) params.set("city", city);
  if (min) params.set("min", min);
  if (max) params.set("max", max);

  return params;
}

function getListingBadges(listing) {
  const badges = Array.isArray(listing.user?.badges) ? listing.user.badges : [];
  const legacyBadge = listing.user?.badge && listing.user.badge !== "none"
    ? [listing.user.badge]
    : [];

  return [...new Set([...badges, ...legacyBadge])].filter((badge) =>
    ["verified", "premium", "corporate"].includes(badge)
  );
}

function renderBadges(listing) {
  const labels = {
    verified: "✓ Onaylı",
    premium: "★ Premium",
    corporate: "Kurumsal"
  };
  const badges = getListingBadges(listing);

  if (!badges.length) return "";

  return `
    <div class="badge-row">
      ${badges.map((badge) => `<span class="seller-badge ${badge}">${labels[badge]}</span>`).join("")}
    </div>
  `;
}

function listingImage(listing) {
  if (listing.image && String(listing.image).trim()) return listing.image;
  if (Array.isArray(listing.images) && listing.images[0]) return listing.images[0];
  return "https://picsum.photos/300/200";
}

function formatPrice(price) {
  return new Intl.NumberFormat("tr-TR").format(Number(price || 0)) + " TL";
}

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (err) {
    return {};
  }
}

function userIdentity(user) {
  return user?._id || user?.id || user?.email || "";
}

function isFavorite(listing, user) {
  const identity = userIdentity(user);
  const email = user?.email || "";
  const favorites = Array.isArray(listing.favorites) ? listing.favorites : [];

  return favorites.some((favorite) => {
    if (!favorite) return false;
    if (typeof favorite === "object") {
      return String(favorite._id || favorite.id || "") === String(identity) ||
        String(favorite.email || "") === String(email);
    }
    return String(favorite) === String(identity);
  });
}

function favoriteButton(listing, user) {
  const active = isFavorite(listing, user);
  return `
    <button class="fav-btn ${active ? "active" : ""}" onclick="event.stopPropagation(); toggleFavorite('${listing._id}')">
      ${active ? "♥" : "♡"}
    </button>
  `;
}

function renderListings(listings) {
  const container = document.getElementById("listingContainer");
  if (!container) return;

  if (!Array.isArray(listings) || !listings.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>İlan bulunamadı</h3>
        <p>Filtreleri değiştirerek tekrar arama yapabilirsiniz.</p>
      </div>
    `;
    return;
  }

  const user = currentUser();

  container.innerHTML = listings.map((listing) => {
    const src = listingImage(listing);

    return `
      <div class="listing-card" onclick="goDetail('${listing._id}')">
        <img class="card-img" src="${escapeHtml(src)}" alt="${escapeHtml(listing.title || "İlan")}" loading="lazy">
        ${favoriteButton(listing, user)}
        <div class="card-body">
          <h3>${escapeHtml(listing.title || "")}</h3>
          <p>${formatPrice(listing.price)}</p>
          <span>${escapeHtml([listing.city, listing.district].filter(Boolean).join(" / "))}</span>
          ${renderBadges(listing)}
        </div>
      </div>
    `;
  }).join("");
}

async function loadListings() {
  setPageTitle();

  const container = document.getElementById("listingContainer");
  if (container) {
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        İlanlar yükleniyor...
      </div>
    `;
  }

  const params = getParams();
  const res = await fetch(`${API}/api/listings${params.toString() ? `?${params.toString()}` : ""}`);
  const data = await res.json();

  renderListings(data);
}

async function toggleFavorite(id) {
  const user = currentUser();

  if (!user.email && !user.id && !user._id) {
    alert("Favorilere eklemek için giriş yapmalısınız");
    window.location.href = "/login.html";
    return;
  }

  const res = await fetch(`/api/listings/${id}/favorite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      userId: user.id || user._id
    })
  });

  if (!res.ok) {
    alert("Favori işlemi tamamlanamadı");
    return;
  }

  loadListings();
}

function applyFilters() {
  const params = buildQueryFromForm();
  window.history.pushState({}, "", `listings.html${params.toString() ? `?${params.toString()}` : ""}`);
  setPageTitle();
  loadListings();
}

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function goDetail(id) {
  window.location.href = `listing.html?id=${encodeURIComponent(id)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  setFormFromUrl();
  loadListings();

  document.getElementById("applyFilter")?.addEventListener("click", applyFilters);

  const debouncedApplyFilters = debounce(applyFilters, 350);

  ["filterCategory"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", applyFilters);
  });

  ["searchInput", "filterCity", "minPrice", "maxPrice"].forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener("input", debouncedApplyFilters);
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyFilters();
      }
    });
  });
});
