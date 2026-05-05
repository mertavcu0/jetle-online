function renderListings(data) {
  const container = document.getElementById("listingArea");
  if (!container) return;

  container.innerHTML = "";

  if (!Array.isArray(data)) {
    container.innerHTML = "Veri hatalı geldi";
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "listing-card";

    div.innerHTML = `
      <div class="listing-image-wrapper">
        <div class="listing-image"></div>
        <span class="badge ${item.user?.badge || ""}" title="${getBadgeDesc(item.user?.badge)}">
          ${getBadgeText(item.user?.badge)}
        </span>
      </div>

      <div class="listing-info">
        <div class="listing-title">${item.title}</div>
        <div class="listing-desc">${item.description}</div>
        <div class="listing-price">${item.price} ₺</div>
        <div class="listing-location">${item.location}</div>
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

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "listing-card";

      div.innerHTML = `
    <div class="listing-image-wrapper">
      <div class="listing-image"></div>
      <span class="badge ${item.user?.badge || ""}" title="${getBadgeDesc(item.user?.badge)}">
        ${getBadgeText(item.user?.badge)}
      </span>
    </div>
    <div class="listing-info">
      <div class="listing-title">${item.title}</div>
      <div class="listing-price">${item.price} ₺</div>
      <div class="listing-location">${item.location}</div>
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

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  showAdmin();
  loadAll();
});


