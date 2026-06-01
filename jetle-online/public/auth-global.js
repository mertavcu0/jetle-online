(function () {
  const AUTH_AREA_ID = "authArea";
  const AUTH_EVENT = "jetle:auth-state-changed";
  const STORAGE_KEYS = [
    "token",
    "user",
    "userId",
    "userEmail",
    "userRole",
    "admin"
  ];

  function readStoredUser() {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function getAuthArea() {
    return document.getElementById(AUTH_AREA_ID);
  }

  function isLoggedIn(user) {
    return Boolean(user && (user.email || user._id || user.id));
  }

  function clearAuthStorage() {
    STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  function isProtectedPath() {
    const path = String(window.location.pathname || "").toLowerCase();
    return [
      "/dashboard",
      "/profile",
      "/account",
      "/messages",
      "/favorites",
      "/user-dashboard"
    ].some((segment) => path.includes(segment));
  }

  function renderGuestNavbar(authArea) {
    authArea.innerHTML = `
      <a href="/login.html">Giriş Yap</a>
      <a href="/register.html">Hesap Aç</a>
    `;
    console.log("NAVBAR_GUEST_RENDER");
  }

  function renderUserNavbar(authArea, user) {
    const displayName = user.name || user.username || user.email || "Hesabım";
    authArea.innerHTML = `
      <div class="auth-user">
        <span class="user-name">${displayName}</span>
        <a class="panel-link" href="/dashboard.html">Profilim</a>
        <button class="logout-btn" type="button" data-action="logout">Çıkış</button>
      </div>
    `;
  }

  function bindLogoutButton(authArea) {
    const logoutButton = authArea.querySelector('[data-action="logout"], .logout-btn');
    if (!logoutButton) return;
    logoutButton.addEventListener("click", () => {
      console.log("LOGOUT_CLICK");
      window.logout();
    });
  }

  function renderAuthArea() {
    const authArea = getAuthArea();
    if (!authArea) return;

    const user = readStoredUser();
    if (isLoggedIn(user)) {
      renderUserNavbar(authArea, user);
      bindLogoutButton(authArea);
      return;
    }

    renderGuestNavbar(authArea);
  }

  function resetAuthState() {
    clearAuthStorage();
    console.log("AUTH_STATE_RESET");
    renderAuthArea();
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, {
      detail: { user: null, loggedIn: false }
    }));
  }

  window.logout = function () {
    resetAuthState();
    console.log("LOGOUT_SUCCESS");

    if (isProtectedPath()) {
      window.location.href = "/login.html";
    }
  };

  window.addFavorite = function (id) {
    const token = String(localStorage.getItem("token") || "").trim();
    if (!token) {
      window.location.href = "/login.html";
      return;
    }

    fetch(`/api/listings/${id}/favorite`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          resetAuthState();
          window.location.href = "/login.html";
        }
        return res;
      })
      .then(() => alert("Favori işlemi tamamlandı"));
  };

  window.addEventListener("storage", (event) => {
    if (!event.key || STORAGE_KEYS.includes(event.key)) {
      renderAuthArea();
    }
  });

  window.addEventListener(AUTH_EVENT, renderAuthArea);

  renderAuthArea();
})();
