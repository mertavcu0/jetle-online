let lastListings = [];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();

  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Bugün";
  if (diff === 1) return "Dün";
  if (diff < 7) return diff + " gün önce";

  return date.toLocaleDateString("tr-TR");
}

function getListingStatusBadge(item) {
  if (item.isFeatured) {
    return `<span class="badge-featured">Vitrin</span>`;
  }

  if (item.isBoosted) {
    return `<span class="badge-boost">Vitrin</span>`;
  }

  if (item.isPremium) {
    return `<span class="badge-premium">Premium</span>`;
  }

  return "";
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (err) {
    return {};
  }
}

function getUserId(user) {
  return user?._id || user?.id || user?.userId || "";
}

function getFavoriteIdentity(user) {
  return getUserId(user) || user?.email || "";
}

function isFavoriteListing(item, user) {
  const userId = getUserId(user);
  const userEmail = user?.email || "";
  const favorites = Array.isArray(item.favorites) ? item.favorites : [];

  return favorites.some((favorite) => {
    if (!favorite) return false;
    if (typeof favorite === "object") {
      return String(favorite._id || favorite.id) === String(userId) ||
        String(favorite.email || "") === String(userEmail);
    }
    return String(favorite) === String(userId);
  });
}

function getFavoriteButton(item, user) {
  const active = isFavoriteListing(item, user);
  return `
    <button class="fav-btn ${active ? "active" : ""}" onclick="event.stopPropagation(); toggleFavorite('${item._id}')">
      ${active ? "♥" : "♡"}
    </button>
  `;
}

function renderListings(data = lastListings) {
  const container = document.getElementById("listingArea");
  if (!container) return;

  container.innerHTML = "";

  if (!Array.isArray(data)) {
    container.innerHTML = "Veri hatalı geldi";
    return;
  }

  lastListings = data;
  const user = getCurrentUser();

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = `listing-card ${item.isFeatured ? "featured-card" : ""}`;

    div.innerHTML = `
      <div class="img-wrapper">
        <img src="${item.image || item.images?.[0] || "https://picsum.photos/300/200"}" />
        ${getListingStatusBadge(item)}
        ${getFavoriteButton(item, user)}
      </div>

      <div class="card-body">
        <h3 class="title">${item.title}</h3>
        <p class="price">${item.price} TL</p>
        <div class="meta">
          <span>📍 ${item.city || item.location || ""}</span>
          <span>🚗 ${item.category || ""}</span>
        </div>
        <div class="card-footer">
          <span class="date">${formatDate(item.createdAt)}</span>
        </div>
      </div>
    `;

    div.addEventListener("click", () => {
      window.location.href = `listing-detail.html?id=${item._id}`;
    });

    container.appendChild(div);
  });
}

function getBadgeText(badge) {
  if (badge === "verified") return "Doğrulanmış";
  if (badge === "trusted") return "Güvenilir Satıcı";
  return "";
}

function getBadgeDesc(badge) {
  if (badge === "verified") return "Kimliği doğrulanmış kullanıcı";
  if (badge === "trusted") return "Güvenilir satıcı";
  return "";
}

function isLoggedIn() {
  return localStorage.getItem("token");
}

function checkAuth() {
  const token = localStorage.getItem("token");

  const loginBtn = document.getElementById("loginBtn");

  if (token && loginBtn) {
    loginBtn.innerText = "Profil";
    loginBtn.href = "profil.html";
  }
}

function showAdmin() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role === "admin") {
      const nav = document.querySelector(".nav-right");
      if (!nav) return;
      if (nav.querySelector('a[href="admin.html"]')) return;

      const link = document.createElement("a");
      link.href = "admin.html";
      link.innerText = "Admin";

      nav.appendChild(link);
    }
  } catch (e) {
    console.error("Token parse hatası:", e);
  }
}

function goToCreate() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("İlan vermek için giriş yapmalısın");
    window.location.href = "login.html";
    return;
  }

  window.location.href = "create-listing.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.reload();
}

async function loadListings() {
  try {
    const container = document.getElementById("listingArea");
    if (!container) return;
    container.innerHTML = "";

    const res = await fetch("/api/listings");
    const data = await res.json();

    if (!Array.isArray(data)) {
      container.innerHTML = "Veri hatalı geldi";
      return;
    }

    lastListings = data;
    const user = getCurrentUser();

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = `listing-card ${item.isFeatured ? "featured-card" : ""}`;

      div.innerHTML = `
    <div class="img-wrapper">
      <img src="${item.image || item.images?.[0] || "https://picsum.photos/300/200"}" />
      ${getListingStatusBadge(item)}
      ${getFavoriteButton(item, user)}
    </div>
    <div class="card-body">
      <h3 class="title">${item.title}</h3>
      <p class="price">${item.price} TL</p>
      <div class="meta">
        <span>📍 ${item.city || item.location || ""}</span>
        <span>🚗 ${item.category || ""}</span>
      </div>
      <div class="card-footer">
        <span class="date">${formatDate(item.createdAt)}</span>
      </div>
    </div>
  `;

      div.addEventListener("click", () => {
        window.location.href = `listing-detail.html?id=${item._id}`;
      });

      container.appendChild(div);
    });
  } catch (err) {
    console.error("HATA:", err);
  }
}

async function loadFeatured() {
  const res = await fetch("/api/listings");
  const data = await res.json();

  const featured = data.filter(i => i.isFeatured);

  const container = document.getElementById("featured-slider");
  if (!container) return;

  container.innerHTML = featured.map(item => `
    <div class="featured-card">
      <strong>${item.title}</strong>
      <p>${item.city} - ${item.price} TL</p>
    </div>
  `).join("");
}

async function filtrele() {
  const search = document.getElementById("searchInput").value;
  const min = document.getElementById("minPrice").value;
  const max = document.getElementById("maxPrice").value;
  const location = document.getElementById("locationInput").value;

  const res = await fetch(`/api/listings?search=${encodeURIComponent(search)}&min=${encodeURIComponent(min)}&max=${encodeURIComponent(max)}&location=${encodeURIComponent(location)}`);
  const data = await res.json();

  renderListings(data); // mevcut kart render fonksiyonunu kullan
}

function applyFilters() {
  const search = document.getElementById("searchInput").value;
  const category = document.getElementById("categoryFilter").value;
  const city = document.getElementById("cityFilter").value;
  const min = document.getElementById("minPrice").value;
  const max = document.getElementById("maxPrice").value;

  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (city) params.set("city", city);
  if (min) params.set("min", min);
  if (max) params.set("max", max);

  window.location.search = params.toString();
}

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);

  document.getElementById("searchInput").value = params.get("search") || "";
  document.getElementById("categoryFilter").value = params.get("category") || "";
  document.getElementById("cityFilter").value = params.get("city") || "";
  document.getElementById("minPrice").value = params.get("min") || "";
  document.getElementById("maxPrice").value = params.get("max") || "";

  return {
    search: params.get("search") || "",
    category: params.get("category") || "",
    city: params.get("city") || "",
    min: params.get("min") || "",
    max: params.get("max") || ""
  };
}

async function loadAll() {
  getFiltersFromURL();
  const params = window.location.search;

  const res = await fetch("/api/listings" + params);
  const data = await res.json();

  renderListings(data);
}

function fav(id, event) {
  if (event) event.stopPropagation();

  fetch("/api/favorites/" + id, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });
}

function addFavorite(id) {
  toggleFavorite(id);
}

function goCategory(category) {
  if (!category) return;
  window.location.href = `/listings.html?category=${encodeURIComponent(category)}`;
}

async function toggleFavorite(id) {
  const user = getCurrentUser();

  if (!user.email && !getUserId(user)) {
    alert("Favorilere eklemek için giriş yapmalısınız");
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch(`/api/listings/${id}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        userId: getUserId(user)
      })
    });

    if (!res.ok) {
      throw new Error("Favori işlemi başarısız");
    }

    const data = await res.json();
    const favoriteIdentity = getFavoriteIdentity(user);

    lastListings = lastListings.map((item) => {
      if (String(item._id) !== String(id)) return item;

      const currentFavorites = Array.isArray(item.favorites) ? item.favorites : [];
      const withoutUser = currentFavorites.filter((favorite) => {
        const favoriteId = typeof favorite === "object" ? favorite._id || favorite.id : favorite;
        const favoriteEmail = typeof favorite === "object" ? favorite.email : "";

        return String(favoriteId) !== String(favoriteIdentity) &&
          String(favoriteEmail) !== String(favoriteIdentity);
      });

      return {
        ...item,
        favorites: data.favorited ? [...withoutUser, favoriteIdentity] : withoutUser
      };
    });

    renderListings(lastListings);
  } catch (err) {
    console.error("FAVORITE ERROR:", err);
    alert("Favori işlemi tamamlanamadı");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-category], .category").forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.dataset.category || item.textContent.trim();
      goCategory(category);
    });
  });

  checkAuth();
  showAdmin();
  loadAll();
  loadFeatured();
});


