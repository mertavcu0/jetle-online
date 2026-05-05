function adminAuthHeaders() {
  return { Authorization: localStorage.getItem("token") };
}

function isAdminUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return Boolean(localStorage.getItem("token") && user.role === "admin");
  } catch {
    return false;
  }
}

function showAdminShell(show) {
  document.getElementById("adminLoginBox")?.toggleAttribute("hidden", show);
  document.getElementById("adminShell")?.toggleAttribute("hidden", !show);
}

function requireAdminPage() {
  const ok = isAdminUser();
  showAdminShell(ok);
  return ok;
}

async function adminFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...adminAuthHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Admin işlemi başarısız");
  return data;
}

function statusText(status) {
  return {
    pending: "Onay bekliyor",
    approved: "Onaylı",
    active: "Aktif",
    passive: "Pasif",
    rejected: "Reddedildi",
  }[status] || "Onaylı";
}

async function adminLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById("adminLoginMessage");
  if (message) message.textContent = "Giriş kontrol ediliyor...";

  try {
    const res = await fetch("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ username: form.username.value, role: "admin" }));
      window.location.href = "/admin-dashboard.html";
      return;
    }

    throw new Error(data.message || "Hatalı giriş");
  } catch (error) {
    if (message) message.textContent = error.message;
  }
}

async function loadAdminStats() {
  const stats = await adminFetch("/api/admin/stats");
  document.getElementById("statUsers").textContent = stats.totalUsers || 0;
  document.getElementById("statListings").textContent = stats.totalListings || 0;
  document.getElementById("statTodayListings").textContent = stats.todayListings || 0;
}

async function loadAdminUsers() {
  const container = document.getElementById("adminUsers");
  if (!container) return;
  container.innerHTML = `<div class="spinner"></div>`;
  const users = await adminFetch("/api/admin/users");

  container.innerHTML = users.map((user) => `
    <div class="admin-row admin-user-row">
      <div class="admin-avatar">${(user.username || "J").slice(0, 1).toUpperCase()}</div>
      <div>
        <strong>${user.username}</strong>
        <div class="muted">${user.email} - ${user.role}${user.isBanned ? " - Banlı" : ""}</div>
      </div>
      <div class="row-actions">
        ${user.isBanned
          ? `<button class="boost-btn" data-unban-user="${user._id}" type="button">Ban Kaldır</button>`
          : `<button class="admin-delete" data-ban-user="${user._id}" type="button">Banla</button>`}
        <button class="admin-delete" data-delete-user="${user._id}" type="button">Sil</button>
      </div>
    </div>
  `).join("") || `<div class="message">Kullanıcı yok.</div>`;
}

async function loadAdminListings() {
  const container = document.getElementById("adminListingsPanel");
  if (!container) return;
  container.innerHTML = `<div class="spinner"></div>`;
  const listings = await adminFetch("/api/admin/listings");

  container.innerHTML = listings.map((item) => `
    <div class="admin-row admin-listing-row">
      <img src="${imageOf(item)}" alt="${item.title}">
      <div>
        <a href="${listingUrl(item)}"><strong>${item.title}</strong></a>
        <div class="muted">
          ${money(item.price)} - ${item.city || "-"}${item.district ? ` / ${item.district}` : ""} - ${statusText(item.status)}
          ${item.isBoosted ? " - Boost aktif" : ""}
        </div>
        <div class="muted">Sahip: ${item.createdBy?.username || "Bilinmiyor"} - Görüntülenme: ${item.views || 0}</div>
      </div>
      <div class="row-actions admin-actions">
        <button class="boost-btn" data-approve-listing="${item._id}" type="button">Onayla</button>
        <button class="ghost-btn" data-reject-listing="${item._id}" type="button">Reddet</button>
        <button class="ghost-btn" data-passive-listing="${item._id}" type="button">Pasif yap</button>
        <button class="boost-btn" data-boost-listing="${item._id}" type="button">Boost ver</button>
        <button class="admin-delete" data-delete-listing="${item._id}" type="button">Sil</button>
      </div>
    </div>
  `).join("") || `<div class="message">İlan yok.</div>`;
}

async function loadAdminPanel() {
  if (!requireAdminPage()) return;

  try {
    await Promise.all([loadAdminStats(), loadAdminUsers(), loadAdminListings()]);
  } catch (error) {
    document.querySelector(".admin-shell")?.insertAdjacentHTML(
      "afterbegin",
      `<div class="message">${error.message}</div>`
    );
  }
}

async function handleAdminClick(event) {
  const target = event.target;

  try {
    const ban = target.closest("[data-ban-user]");
    if (ban) {
      await adminFetch(`/api/admin/users/${ban.dataset.banUser}/ban`, { method: "PUT" });
      loadAdminPanel();
      return;
    }

    const unban = target.closest("[data-unban-user]");
    if (unban) {
      await adminFetch(`/api/admin/users/${unban.dataset.unbanUser}/unban`, { method: "PUT" });
      loadAdminPanel();
      return;
    }

    const deleteUser = target.closest("[data-delete-user]");
    if (deleteUser && confirm("Bu kullanıcı silinsin mi?")) {
      await adminFetch(`/api/admin/users/${deleteUser.dataset.deleteUser}`, { method: "DELETE" });
      loadAdminPanel();
      return;
    }

    const approve = target.closest("[data-approve-listing]");
    if (approve) {
      await adminFetch(`/api/admin/listings/${approve.dataset.approveListing}/approve`, { method: "PUT" });
      loadAdminPanel();
      return;
    }

    const reject = target.closest("[data-reject-listing]");
    if (reject) {
      await adminFetch(`/api/admin/listings/${reject.dataset.rejectListing}/reject`, { method: "PUT" });
      loadAdminPanel();
      return;
    }

    const passive = target.closest("[data-passive-listing]");
    if (passive) {
      await adminFetch(`/api/admin/listing/${passive.dataset.passiveListing}/passive`, { method: "PUT" });
      loadAdminPanel();
      return;
    }

    const boost = target.closest("[data-boost-listing]");
    if (boost) {
      await adminFetch(`/api/admin/listings/${boost.dataset.boostListing}/boost`, { method: "POST" });
      loadAdminPanel();
      return;
    }

    const del = target.closest("[data-delete-listing]");
    if (del && confirm("Bu ilan silinsin mi?")) {
      await adminFetch(`/api/admin/listing/${del.dataset.deleteListing}`, { method: "DELETE" });
      loadAdminPanel();
    }
  } catch (error) {
    alert(error.message);
  }
}

function bindAdminTabs() {
  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.adminTab;
      document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".admin-tab-panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(`adminTab${tab[0].toUpperCase()}${tab.slice(1)}`)?.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("adminLoginForm")?.addEventListener("submit", adminLogin);
  document.getElementById("adminRefresh")?.addEventListener("click", loadAdminPanel);
  document.querySelector(".admin-page")?.addEventListener("click", handleAdminClick);
  bindAdminTabs();
  loadAdminPanel();
});
