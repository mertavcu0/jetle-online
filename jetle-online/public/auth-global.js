(function () {
  const AUTH_AREA_ID = "authArea";
  const AUTH_EVENT = "jetle:auth-state-changed";
  const NOTIFICATION_LIMIT = 6;
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

  function getToken() {
    return String(
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      ""
    ).trim();
  }

  function isLoggedIn(user) {
    return Boolean(user && (user.email || user._id || user.id));
  }

  function normalizeRole(user) {
    return String(
      user?.role ||
      user?.userRole ||
      localStorage.getItem("userRole") ||
      sessionStorage.getItem("userRole") ||
      ""
    ).trim().toLowerCase();
  }

  function isAdminUser(user) {
    const role = normalizeRole(user);
    return role === "admin" || role === "superadmin" || localStorage.getItem("admin") === "true";
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

  function injectNotificationStyles() {
    if (document.getElementById("jetle-notification-styles")) return;
    const style = document.createElement("style");
    style.id = "jetle-notification-styles";
    style.textContent = `
      .jetle-notification-shell {
        position: relative;
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
      }

      #authArea .jetle-notification-trigger,
      .jetle-notification-standalone .jetle-notification-trigger {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        min-width: 36px;
        height: 36px;
        padding: 0;
        border: 1px solid #dbe3ee;
        border-radius: 10px;
        background: #fff;
        color: #1f2937;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        cursor: pointer;
        transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
      }

      #authArea .jetle-notification-trigger:hover,
      .jetle-notification-standalone .jetle-notification-trigger:hover,
      #authArea .jetle-notification-trigger:focus-visible,
      .jetle-notification-standalone .jetle-notification-trigger:focus-visible {
        outline: none;
        transform: translateY(-1px);
        border-color: #bfcddd;
        background: #f8fafc;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .jetle-notification-icon {
        width: 19px;
        height: 19px;
        display: block;
      }

      .jetle-notification-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 17px;
        height: 17px;
        padding: 0 4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: #dc2626;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        line-height: 1;
        box-shadow: 0 2px 6px rgba(220, 38, 38, 0.24);
      }

      .jetle-notification-badge[hidden] {
        display: none !important;
      }

      .jetle-notification-panel {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        width: min(320px, calc(100vw - 24px));
        max-height: min(420px, 70vh);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        background: #fff;
        box-shadow: 0 24px 50px rgba(15, 23, 42, 0.16);
        z-index: 120;
      }

      .jetle-notification-panel[hidden] {
        display: none !important;
      }

      .jetle-notification-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 14px 16px 12px;
        border-bottom: 1px solid #eef2f7;
      }

      .jetle-notification-head strong {
        font-size: 14px;
        font-weight: 800;
        color: #0f172a;
      }

      .jetle-notification-subtitle {
        font-size: 11px;
        color: #64748b;
      }

      .jetle-notification-list {
        overflow-y: auto;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      #authArea .jetle-notification-panel .jetle-notification-item,
      .jetle-notification-standalone .jetle-notification-panel .jetle-notification-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 12px;
        border: 1px solid #edf2f7;
        border-radius: 10px;
        text-decoration: none;
        background: #fff;
        color: #0f172a;
        transition: background 0.18s ease, border-color 0.18s ease;
      }

      #authArea .jetle-notification-panel .jetle-notification-item:hover,
      .jetle-notification-standalone .jetle-notification-panel .jetle-notification-item:hover {
        background: #f8fafc;
        border-color: #dbe5f0;
      }

      .jetle-notification-item-title {
        font-size: 13px;
        font-weight: 700;
        line-height: 1.35;
      }

      .jetle-notification-item-meta {
        font-size: 11px;
        color: #64748b;
        line-height: 1.3;
      }

      .jetle-notification-empty {
        padding: 18px 14px;
        border: 1px dashed #dbe5f0;
        border-radius: 10px;
        text-align: center;
        font-size: 13px;
        color: #64748b;
        background: #f8fafc;
      }

      .jetle-notification-login {
        color: #475569;
      }

      .jetle-notification-standalone {
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
      }

      @media (max-width: 768px) {
        .jetle-notification-panel {
          right: auto;
          left: 0;
          width: min(320px, calc(100vw - 32px));
        }
      }

      @media (max-width: 480px) {
        #authArea .jetle-notification-trigger,
        .jetle-notification-standalone .jetle-notification-trigger {
          width: 32px;
          min-width: 32px;
          height: 32px;
          border-radius: 8px;
        }

        .jetle-notification-icon {
          width: 16px;
          height: 16px;
        }

        .jetle-notification-badge {
          min-width: 16px;
          height: 16px;
          font-size: 10px;
          top: -4px;
          right: -4px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createNavLink(href, label, className) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (className) link.className = className;
    return link;
  }

  function createLogoutButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "logout-btn";
    button.dataset.action = "logout";
    button.textContent = "Çıkış";
    return button;
  }

  function createNotificationIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("jetle-notification-icon");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M7.5 8.75a4.5 4.5 0 1 1 9 0c0 4.75 1.75 5.75 1.75 5.75h-12S7.5 13.5 7.5 8.75Z");
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M10 18a2 2 0 0 0 4 0");
    svg.append(path1, path2);
    return svg;
  }

  function createNotificationShell() {
    const shell = document.createElement("div");
    shell.className = "jetle-notification-shell";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "jetle-notification-trigger";
    trigger.setAttribute("aria-label", "Bildirimler");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");

    const badge = document.createElement("span");
    badge.className = "jetle-notification-badge";
    badge.hidden = true;

    const panel = document.createElement("div");
    panel.className = "jetle-notification-panel";
    panel.hidden = true;

    const head = document.createElement("div");
    head.className = "jetle-notification-head";
    const titleWrap = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = "Bildirimler";
    const subtitle = document.createElement("div");
    subtitle.className = "jetle-notification-subtitle";
    subtitle.textContent = "Güncel durumlarınız";
    titleWrap.append(title, subtitle);

    const list = document.createElement("div");
    list.className = "jetle-notification-list";

    head.appendChild(titleWrap);
    trigger.append(createNotificationIcon(), badge);
    panel.append(head, list);
    shell.append(trigger, panel);

    return { shell, trigger, badge, panel, list };
  }

  function formatTimestamp(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    try {
      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    } catch (_) {
      return date.toLocaleString("tr-TR");
    }
  }

  function normalizeConversationsPayload(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.conversations)) return data.conversations;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }

  function normalizeListingStatus(status, approved) {
    const normalized = String(status || "").trim().toLowerCase();
    if (normalized === "pending") return "pending";
    if (normalized === "approved" || normalized === "active") return "approved";
    if (approved === true) return "approved";
    return normalized;
  }

  function getListingDetailUrl(listing) {
    const id = String(listing?._id || listing?.id || "").trim();
    return id ? `/listing-detail.html?id=${encodeURIComponent(id)}` : "/dashboard.html";
  }

  function makeNotification(type, title, href, createdAt, count) {
    return {
      type,
      title,
      href,
      createdAt: createdAt || null,
      count: Number(count || 0) || 0
    };
  }

  async function fetchJson(url, token) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (response.status === 401 || response.status === 403) {
      throw new Error("auth_expired");
    }
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error("request_failed");
    }
    return data;
  }

  async function buildNotifications(user) {
    const token = getToken();
    if (!token || !isLoggedIn(user)) {
      return { items: [], unreadCount: 0, requiresLogin: true };
    }

    const items = [];

    const tasks = [
      fetchJson("/api/listings/my-listings", token)
        .then((listings) => {
          if (!Array.isArray(listings) || !listings.length) return;
          const pending = listings
            .filter((listing) => normalizeListingStatus(listing?.status, listing?.approved) === "pending")
            .sort((a, b) => new Date(b?.updatedAt || b?.createdAt || 0) - new Date(a?.updatedAt || a?.createdAt || 0))[0];
          const approved = listings
            .filter((listing) => normalizeListingStatus(listing?.status, listing?.approved) === "approved")
            .sort((a, b) => new Date(b?.updatedAt || b?.createdAt || 0) - new Date(a?.updatedAt || a?.createdAt || 0))[0];

          if (approved) {
            items.push(
              makeNotification(
                "listing-approved",
                "İlanınız yayına alındı",
                getListingDetailUrl(approved),
                approved.updatedAt || approved.createdAt
              )
            );
          }

          if (pending) {
            items.push(
              makeNotification(
                "listing-pending",
                "İlanınız onay bekliyor",
                "/dashboard.html",
                pending.updatedAt || pending.createdAt
              )
            );
          }
        })
        .catch((error) => {
          if (error?.message === "auth_expired") throw error;
        }),
      fetchJson("/api/messages/conversations", token)
        .then((payload) => {
          const conversations = normalizeConversationsPayload(payload);
          const unreadTotal = conversations.reduce((sum, conversation) => {
            return sum + Math.max(0, Number(conversation?.unreadCount || 0));
          }, 0);
          if (!unreadTotal) return;
          const latest = conversations
            .filter((conversation) => Number(conversation?.unreadCount || 0) > 0)
            .sort((a, b) => new Date(b?.updatedAt || 0) - new Date(a?.updatedAt || 0))[0];
          items.push(
            makeNotification(
              "new-message",
              unreadTotal > 1 ? `${unreadTotal} yeni mesajınız var` : "Yeni mesajınız var",
              latest?.conversationId
                ? `/messages.html?conversationId=${encodeURIComponent(latest.conversationId)}`
                : "/messages.html",
              latest?.updatedAt,
              unreadTotal
            )
          );
        })
        .catch((error) => {
          if (error?.message === "auth_expired") throw error;
        })
    ];

    if (isAdminUser(user)) {
      tasks.push(
        fetchJson("/api/admin/stats", token)
          .then((stats) => {
            const pendingCount = Number(stats?.pendingListings || 0);
            if (!pendingCount) return;
            items.push(
              makeNotification(
                "admin-pending",
                pendingCount > 1 ? `${pendingCount} onay bekleyen ilan var` : "Onay bekleyen ilan var",
                "/admin-dashboard.html",
                new Date().toISOString(),
                pendingCount
              )
            );
          })
          .catch((error) => {
            if (error?.message === "auth_expired") throw error;
          })
      );
    }

    try {
      await Promise.all(tasks);
    } catch (error) {
      if (error?.message === "auth_expired") {
        resetAuthState();
      }
    }

    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const limited = items.slice(0, NOTIFICATION_LIMIT);
    const unreadCount = limited.reduce((sum, item) => sum + Math.max(1, Number(item.count || 0)), 0);

    return {
      items: limited,
      unreadCount,
      requiresLogin: false
    };
  }

  function renderNotificationItems(list, items, requiresLogin) {
    list.textContent = "";

    if (requiresLogin) {
      const empty = document.createElement("div");
      empty.className = "jetle-notification-empty jetle-notification-login";
      empty.textContent = "Bildirimleri görmek için giriş yapın.";
      list.appendChild(empty);
      return;
    }

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "jetle-notification-empty";
      empty.textContent = "Yeni bildiriminiz yok";
      list.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      const link = document.createElement("a");
      link.className = "jetle-notification-item";
      link.href = item.href || "#";

      const title = document.createElement("div");
      title.className = "jetle-notification-item-title";
      title.textContent = item.title;

      const meta = document.createElement("div");
      meta.className = "jetle-notification-item-meta";
      meta.textContent = formatTimestamp(item.createdAt) || "Şimdi";

      link.append(title, meta);
      list.appendChild(link);
    });
  }

  function mountNotificationCenter(host, user) {
    if (!host || host.dataset.notificationsMounted === "true") return;
    injectNotificationStyles();

    const standalone = host.dataset.notificationHost === "" || host.hasAttribute("data-notification-host");
    if (standalone) {
      host.classList.add("jetle-notification-standalone");
    }

    const { shell, trigger, badge, panel, list } = createNotificationShell();
    host.appendChild(shell);
    host.dataset.notificationsMounted = "true";

    let panelOpen = false;

    const closePanel = () => {
      if (!panelOpen) return;
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      panelOpen = false;
    };

    const openPanel = () => {
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      panelOpen = true;
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (panelOpen) {
        closePanel();
      } else {
        openPanel();
      }
    });

    document.addEventListener("click", (event) => {
      if (!shell.contains(event.target)) {
        closePanel();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePanel();
    });

    renderNotificationItems(list, [], !isLoggedIn(user));

    buildNotifications(user).then(({ items, unreadCount, requiresLogin }) => {
      renderNotificationItems(list, items, requiresLogin);
      if (unreadCount > 0) {
        badge.hidden = false;
        badge.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
      } else {
        badge.hidden = true;
        badge.textContent = "";
      }
    });
  }

  function renderGuestNavbar(authArea) {
    authArea.textContent = "";
    authArea.append(
      createNavLink("/login.html", "Giriş Yap"),
      createNavLink("/register.html", "Hesap Aç")
    );
  }

  function renderUserNavbar(authArea, user) {
    authArea.textContent = "";
    const authUser = document.createElement("div");
    authUser.className = "auth-user";

    mountNotificationCenter(authUser, user);

    const dashboardLink = createNavLink(
      isAdminUser(user) ? "/admin-dashboard.html" : "/dashboard.html",
      isAdminUser(user) ? "Admin" : "Profilim",
      "panel-link"
    );

    authUser.append(
      dashboardLink,
      createLogoutButton()
    );

    authArea.appendChild(authUser);
  }

  function bindLogoutButton(authArea) {
    const logoutButton = authArea.querySelector('[data-action="logout"], .logout-btn');
    if (!logoutButton) return;
    logoutButton.addEventListener("click", () => {
      window.logout();
    });
  }

  function renderAuthArea() {
    const authArea = getAuthArea();
    const user = readStoredUser();

    if (authArea) {
      if (isLoggedIn(user)) {
        renderUserNavbar(authArea, user);
        bindLogoutButton(authArea);
      } else {
        renderGuestNavbar(authArea);
      }
    }

    document.querySelectorAll("[data-notification-host]").forEach((host) => {
      host.textContent = "";
      host.dataset.notificationsMounted = "false";
      if (isLoggedIn(user)) {
        mountNotificationCenter(host, user);
      }
    });
  }

  function resetAuthState() {
    clearAuthStorage();
    renderAuthArea();
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, {
      detail: { user: null, loggedIn: false }
    }));
  }

  window.logout = function () {
    resetAuthState();

    if (isProtectedPath()) {
      window.location.href = "/login.html";
    }
  };

  window.addFavorite = function (id) {
    const token = getToken();
    if (!token) {
      window.location.href = "/login.html";
      return;
    }

    fetch(`/api/listings/${id}/favorite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
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
  window.JetleHeaderNotifications = {
    mountNotificationCenter,
    readStoredUser,
    isLoggedIn
  };

  renderAuthArea();
})();
