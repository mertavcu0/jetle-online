function accountUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function accountToken() {
  return localStorage.getItem("token");
}

function accountHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${accountToken()}`,
  };
}

function accountImage(listing) {
  if (typeof imageOf === "function") return imageOf(listing);
  if (Array.isArray(listing.images) && listing.images.length) return listing.images[0];
  return listing.image || "https://picsum.photos/300/200";
}

function accountMoney(value) {
  if (typeof money === "function") return money(value);
  return `${Number(value || 0).toLocaleString("tr-TR")} TL`;
}

function accountListingUrl(listing) {
  if (typeof listingUrl === "function") return listingUrl(listing);
  return `/ilan-detay.html?id=${listing._id}`;
}

function accountDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function accountEmpty(text) {
  return `<div class="account-empty-state">${text}</div>`;
}

function renderAccountRow(item, options = {}) {
  const district = item.district ? ` / ${item.district}` : "";
  return `
    <article class="account-listing-row">
      <a class="account-listing-media" href="${accountListingUrl(item)}">
        <img src="${accountImage(item)}" alt="${item.title}" loading="lazy">
      </a>
      <div class="account-listing-body">
        <a href="${accountListingUrl(item)}"><strong>${item.title}</strong></a>
        <span>${item.city || "Şehir yok"}${district}</span>
        <small>${accountDate(item.createdAt)}</small>
      </div>
      <div class="account-listing-side">
        <strong>${accountMoney(item.price)}</strong>
        ${item.status ? `<span class="account-status">${item.status}</span>` : ""}
        ${options.favorite
          ? `<button class="account-light-btn" type="button" data-remove-favorite="${item._id}">Favoriden Çıkar</button>`
          : `<button class="account-danger-btn" type="button" data-delete-listing="${item._id}">Sil</button>`}
      </div>
    </article>
  `;
}

function setAccountTab(tab) {
  if (tab === "logout") {
    logout();
    return;
  }

  document.querySelectorAll(".account-menu-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.accountTab === tab);
  });
  document.querySelectorAll(".account-tab").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `account-${tab}`);
  });
  history.replaceState(null, "", `#${tab}`);

  if (tab === "listings") loadAccountListings();
  if (tab === "favorites") loadAccountFavorites();
  if (tab === "messages" && typeof loadAccountMessages === "function") loadAccountMessages();
  document.dispatchEvent(new CustomEvent("account:tab", { detail: tab }));
}

function hydrateAccountProfile() {
  const user = accountUser();
  const name = user?.name || user?.username || "Jetle Kullanıcı";
  const email = user?.email || "E-posta bilgisi yok";
  const avatar = document.getElementById("accountAvatar");

  document.getElementById("accountName").textContent = name;
  document.getElementById("accountEmail").textContent = email;
  if (avatar) avatar.textContent = name.trim().charAt(0).toLocaleUpperCase("tr-TR") || "J";
}

function setAccountStat(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function isActiveListing(item) {
  const status = String(item.status || "active").toLowerCase();
  return item.isActive !== false && !["passive", "rejected", "deleted"].includes(status);
}

async function loadAccountStats() {
  const headers = accountHeaders();

  try {
    const res = await fetch("/api/my-listings", { headers });
    const listings = await res.json();
    if (res.ok && Array.isArray(listings)) {
      setAccountStat("statTotalListings", listings.length);
      setAccountStat("statActiveListings", listings.filter(isActiveListing).length);
    }
  } catch {
    setAccountStat("statTotalListings", "-");
    setAccountStat("statActiveListings", "-");
  }

  try {
    const res = await fetch("/api/messages/conversations", { headers });
    const conversations = await res.json();
    setAccountStat("statMessageCount", res.ok && Array.isArray(conversations) ? conversations.length : "-");
  } catch {
    setAccountStat("statMessageCount", "-");
  }
}

async function loadAccountListings() {
  const container = document.getElementById("accountListings");
  if (!container) return;

  container.innerHTML = `<div class="spinner"></div>`;

  try {
    const res = await fetch("/api/my-listings", {
      headers: accountHeaders(),
    });
    const listings = await res.json();
    if (!res.ok) throw new Error(listings.message || "İlanlar alınamadı");

    container.innerHTML = listings.length
      ? listings.map((item) => renderAccountRow(item)).join("")
      : accountEmpty("Henüz ilanınız yok. İlk ilanınızı hemen yayınlayabilirsiniz.");
  } catch (error) {
    container.innerHTML = accountEmpty(error.message);
  }
}

async function loadAccountFavorites() {
  const container = document.getElementById("accountFavorites");
  if (!container) return;

  container.innerHTML = `<div class="spinner"></div>`;

  try {
    const res = await fetch("/api/favorites", {
      headers: accountHeaders(),
    });
    const favorites = await res.json();
    if (!res.ok) throw new Error(favorites.message || "Favoriler alınamadı");

    container.innerHTML = favorites.length
      ? favorites.map((item) => renderAccountRow(item, { favorite: true })).join("")
      : accountEmpty("Favoriye eklediğiniz ilan bulunmuyor.");
  } catch (error) {
    container.innerHTML = accountEmpty(error.message);
  }
}

async function deleteAccountListing(id) {
  if (!confirm("Bu ilan silinsin mi?")) return;

  const res = await fetch(`/api/listings/${id}`, {
    method: "DELETE",
    headers: accountHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.message || "İlan silinemedi");
    return;
  }

  loadAccountListings();
}

async function removeAccountFavorite(id) {
  const res = await fetch(`/api/favorites/${id}`, {
    method: "POST",
    headers: accountHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.message || "Favori kaldırılamadı");
    return;
  }

  loadAccountFavorites();
}

async function changeAccountPassword(event) {
  event.preventDefault();

  const input = document.getElementById("accountNewPassword");
  const message = document.getElementById("passwordMessage");
  const password = input.value.trim();

  if (password.length < 6) {
    message.textContent = "Yeni şifre en az 6 karakter olmalı.";
    message.className = "form-message error";
    return;
  }

  const res = await fetch("/api/auth/change-password", {
    method: "PUT",
    headers: accountHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ password }),
  });
  const data = await res.json();

  message.textContent = data.message || (res.ok ? "Şifre güncellendi." : "Şifre güncellenemedi.");
  message.className = `form-message ${res.ok ? "success" : "error"}`;
  if (res.ok) input.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".account-shell")) return;

  if (!accountToken() || !accountUser()) {
    window.location.href = "/login.html";
    return;
  }

  hydrateAccountProfile();
  loadAccountStats();

  document.querySelectorAll("[data-account-tab]").forEach((button) => {
    button.addEventListener("click", () => setAccountTab(button.dataset.accountTab));
  });

  document.getElementById("passwordForm")?.addEventListener("submit", changeAccountPassword);

  document.getElementById("accountListings")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-listing]");
    if (button) deleteAccountListing(button.dataset.deleteListing);
  });

  document.getElementById("accountFavorites")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-favorite]");
    if (button) removeAccountFavorite(button.dataset.removeFavorite);
  });

  const queryTab = new URLSearchParams(window.location.search).get("tab");
  const initialTab = queryTab || window.location.hash.replace("#", "") || "profile";
  const validTabs = ["profile", "listings", "favorites", "messages", "settings"];
  setAccountTab(validTabs.includes(initialTab) ? initialTab : "profile");
});
