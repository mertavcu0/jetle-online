/**
 * JETLE v2 — oturum ve roller (demo; şifreler yerelde düz metin — üretimde asla böyle olmamalı).
 */
(function () {
  "use strict";

  var KEYS = {
    USERS: "jetle_v2_users",
    SESSION: "jetle_v2_session",
    BACKEND_FLAG: "jetle_v2_use_backend_api"
  };

  /** Demo amaçlı basit doğrulama; gerçek uygulama sunucu tarafında hash + salt kullanmalı. */
  function hashDemo(pw) {
    return "h:" + String(pw).length + ":" + String(pw).slice(0, 1);
  }

  function readJson(key, fb) {
    try {
      var r = localStorage.getItem(key);
      return r ? JSON.parse(r) : fb;
    } catch (e) {
      return fb;
    }
  }

  function writeJson(key, v) {
    localStorage.setItem(key, JSON.stringify(v));
  }

  function backendEnabled() {
    var gw = window.JetleAPI && JetleAPI.API_GATEWAY;
    var ls = localStorage.getItem(KEYS.BACKEND_FLAG);
    if (ls === "1") return true;
    if (ls === "0") return false;
    return !!(gw && gw.useBackend);
  }

  function backendUrl(path) {
    var gw = window.JetleAPI && JetleAPI.API_GATEWAY;
    var base = (gw && gw.baseUrl) || "";
    return base ? base.replace(/\/+$/, "") + path : path;
  }

  function syncBackendRequest(method, path, body, accessToken) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open(method, backendUrl(path), false);
      xhr.setRequestHeader("Content-Type", "application/json");
      if (accessToken) xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr.withCredentials = true;
      xhr.send(body ? JSON.stringify(body) : null);
      var data = {};
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch (e) {}
      if (xhr.status >= 200 && xhr.status < 300) return { ok: true, status: xhr.status, data: data };
      var attemptedUrl = "";
      try {
        attemptedUrl = backendUrl(path);
      } catch (eu) {}
      var errMsg = (data && data.message) || "İstek başarısız.";
      if (xhr.status === 0 && !data.message) {
        errMsg =
          "Sunucuya ulaşılamadı (HTTP 0). API adresi veya CORS ayarlarını kontrol edin." +
          (attemptedUrl ? " — " + attemptedUrl : "");
      }
      return {
        ok: false,
        status: xhr.status,
        code: data && data.code ? String(data.code) : "",
        details: data && data.details ? data.details : null,
        message: errMsg
      };
    } catch (err) {
      var attempted = "";
      try {
        attempted = backendUrl(path);
      } catch (e2) {}
      var em = err && err.message ? String(err.message) : "Ağ hatası";
      return {
        ok: false,
        status: 0,
        message: "Sunucuya ulaşılamadı: " + em + (attempted ? " — " + attempted : "")
      };
    }
  }

  function getAuthStorage() {
    return window.JetleAPI && JetleAPI.authStorage ? JetleAPI.authStorage : null;
  }

  function readSessionState() {
    var storage = getAuthStorage();
    if (storage && typeof storage.read === "function") return storage.read();
    return readJson(KEYS.SESSION, null);
  }

  function saveSessionState(state, remember) {
    var storage = getAuthStorage();
    if (storage && typeof storage.write === "function") return storage.write(state, remember);
    writeJson(KEYS.SESSION, state);
    return state;
  }

  function clearSessionState() {
    var storage = getAuthStorage();
    if (storage && typeof storage.clear === "function") {
      storage.clear();
      return;
    }
    localStorage.removeItem(KEYS.SESSION);
  }

  function getUsers() {
    var list = readJson(KEYS.USERS, []);
    return Array.isArray(list) ? list : [];
  }

  function saveUsers(list) {
    writeJson(KEYS.USERS, list);
  }

  function seedUsersIfEmpty() {
    var list = getUsers();
    if (list.length > 0) return;
    list.push({
      id: "u-admin",
      name: "Sistem Yöneticisi",
      email: "admin@jetle.com",
      phone: "05001234567",
      passwordHash: hashDemo("Admin2026!"),
      passwordPlain: "Admin2026!",
      role: "admin",
      city: "Ankara",
      profileType: "Kurumsal",
      active: true,
      createdAt: new Date().toISOString()
    });
    list.push({
      id: "u-demo",
      name: "Demo Kullanıcı",
      email: "demo@jetle.com",
      phone: "05321112233",
      passwordHash: hashDemo("Demo2026!"),
      passwordPlain: "Demo2026!",
      role: "user",
      city: "İstanbul",
      profileType: "Bireysel",
      active: true,
      createdAt: new Date().toISOString()
    });
    saveUsers(list);
  }

  function getSession() {
    var s = readSessionState();
    if (!s || (!s.userId && !s.user)) return null;
    if (s.user && s.user.id) {
      return {
        userId: s.user.id,
        email: s.user.email,
        name: s.user.fullName || s.user.name,
        role: s.user.role || "user",
        accessToken: s.accessToken || "",
        refreshToken: s.refreshToken || "",
        remember: !!s.persist,
        user: s.user
      };
    }
    var users = getUsers();
    var u = users.find(function (x) {
      return x.id === s.userId;
    });
    if (!u || u.active === false) return null;
    return { userId: u.id, email: u.email, name: u.name, role: u.role };
  }

  function setSession(userId, remember) {
    saveSessionState({ userId: userId, at: new Date().toISOString() }, !!remember);
  }
  function setBackendSession(payload, remember) {
    var current = readSessionState();
    saveSessionState({
      userId: payload && payload.user ? payload.user.id : null,
      accessToken: payload ? payload.accessToken : "",
      refreshToken: payload ? payload.refreshToken || "" : "",
      user: payload ? payload.user : null,
      at: new Date().toISOString()
    }, remember == null ? !!(current && current.persist) : !!remember);
  }

  function clearSession() {
    clearSessionState();
  }

  function mapBackendMessage(res, fallback) {
    if (!res) return fallback;
    if (res.status === 0) return res.message || "Sunucuya ulaşılamadı.";
    if (res.status === 401) return "E-posta veya şifre hatalı.";
    if (res.status === 403) return "Bu işlem için yetkiniz bulunmuyor.";
    if (res.status === 409) return "Bu e-posta ile kayıt var.";
    if (res.status === 429) return "Çok fazla deneme yapıldı. Lütfen kısa süre sonra tekrar deneyin.";
    if (res.status === 400 && res.code === "VALIDATION_ERROR" && Array.isArray(res.details) && res.details.length) {
      return res.details[0].msg || res.message || fallback;
    }
    return res.message || fallback;
  }

  function normalizeBackendUser(me) {
    return {
      id: me.id,
      name: me.fullName || me.name || "",
      email: me.email || "",
      phone: me.phone || "",
      role: me.role || "user",
      city: me.city || "",
      district: me.district || "",
      profileType: me.profileType || "Bireysel"
    };
  }

  function syncCurrentUserFromBackend() {
    if (!backendEnabled()) return null;
    var s = readSessionState();
    if (!s || !s.accessToken) {
      clearSession();
      return null;
    }
    var meRes = syncBackendRequest("GET", "/api/auth/me", null, String(s.accessToken || ""));
    if (!meRes.ok || !meRes.data || !meRes.data.data) {
      if (meRes.status === 401 || meRes.status === 403) clearSession();
      return null;
    }
    var me = meRes.data.data;
    setBackendSession({
      accessToken: String(s.accessToken || ""),
      refreshToken: String(s.refreshToken || ""),
      user: me
    }, !!s.persist);
    return normalizeBackendUser(me);
  }

  function findUserByEmail(email) {
    var e = String(email).trim().toLowerCase();
    return getUsers().find(function (u) {
      return u.email.toLowerCase() === e;
    });
  }

  function login(email, password, remember) {
    if (backendEnabled()) {
      var loginRes = syncBackendRequest("POST", "/api/auth/login", {
        email: String(email || "").trim().toLowerCase(),
        password: String(password || "")
      });
      if (!loginRes.ok) return { ok: false, message: mapBackendMessage(loginRes, "Giriş başarısız.") };
      var pl = loginRes.data && loginRes.data.data;
      if (!pl || !pl.user || !pl.accessToken) return { ok: false, message: "Geçersiz backend yanıtı." };
      setBackendSession(pl, !!remember);
      return { ok: true };
    }
    seedUsersIfEmpty();
    var safeEmail = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return { ok: false, message: "Geçerli bir e-posta girin." };
    }
    if (String(password || "").length < 8) {
      return { ok: false, message: "Şifre en az 8 karakter olmalıdır." };
    }
    var u = findUserByEmail(safeEmail);
    if (!u) return { ok: false, message: "E-posta veya şifre hatalı." };
    if (String(u.passwordPlain || "") !== String(password)) {
      return { ok: false, message: "E-posta veya şifre hatalı." };
    }
    if (u.active === false) return { ok: false, message: "Hesap pasif." };
    setSession(u.id, !!remember);
    return { ok: true };
  }

  function logout() {
    if (backendEnabled()) {
      var s = getSession();
      syncBackendRequest("POST", "/api/auth/logout", null, s && s.accessToken ? s.accessToken : "");
    }
    clearSession();
  }

  function register(payload) {
    if (backendEnabled()) {
      var regRes = syncBackendRequest("POST", "/api/auth/register", {
        fullName: JetleAPI.sanitizeText(payload.name || payload.fullName || "", 120),
        email: String(payload.email || "").trim().toLowerCase(),
        phone: String(payload.phone || "").replace(/\D+/g, ""),
        password: String(payload.password || ""),
        termsAccepted: payload.termsAccepted === true || payload.termsAccepted === "true"
      });
      if (!regRes.ok) return { ok: false, message: mapBackendMessage(regRes, "Kayıt başarısız.") };
      var rd = regRes.data && regRes.data.data;
      if (!rd || !rd.user || !rd.accessToken) return { ok: false, message: "Geçersiz backend yanıtı." };
      setBackendSession(rd, payload && payload.remember !== false);
      return { ok: true };
    }
    seedUsersIfEmpty();
    if (payload.termsAccepted !== true && payload.termsAccepted !== "true") {
      return { ok: false, message: "Kullanıcı Sözleşmesi ve Gizlilik Politikası'nı kabul etmelisiniz." };
    }
    var safeEmail = String(payload.email || "").trim().toLowerCase();
    var safePhone = String(payload.phone || "").replace(/\D+/g, "");
    var safePw = String(payload.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return { ok: false, message: "Geçerli bir e-posta girin." };
    }
    if (safePhone.length < 10) {
      return { ok: false, message: "Geçerli bir telefon numarası girin." };
    }
    if (safePw.length < 8) {
      return { ok: false, message: "Şifre en az 8 karakter olmalıdır." };
    }
    if (findUserByEmail(safeEmail)) return { ok: false, message: "Bu e-posta ile kayıt var." };
    var id = "u-" + Date.now();
    var user = {
      id: id,
      name: JetleAPI.sanitizeText(payload.name, 120),
      email: safeEmail,
      phone: safePhone,
      passwordHash: hashDemo(safePw),
      passwordPlain: safePw,
      role: "user",
      city: JetleAPI.sanitizeText(payload.city || "", 60),
      profileType: "Bireysel",
      active: true,
      createdAt: new Date().toISOString()
    };
    var list = getUsers();
    list.push(user);
    saveUsers(list);
    setSession(id, payload && payload.remember !== false);
    return { ok: true };
  }

  function getCurrentUser() {
    if (backendEnabled()) {
      return syncCurrentUserFromBackend();
    }
    var s = getSession();
    if (!s) return null;
    var u = getUsers().find(function (x) {
      return x.id === s.userId;
    });
    if (!u) return null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role || "user",
      city: u.city,
      district: u.district || "",
      profileType: u.profileType
    };
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  function getFullUser() {
    if (backendEnabled()) {
      var current = getCurrentUser();
      if (!current) return null;
      var session = getSession();
      return {
        id: current.id,
        name: current.name,
        email: current.email,
        phone: current.phone,
        role: current.role || "user",
        city: current.city || "",
        district: current.district || "",
        profileType: current.profileType || "Bireysel",
        accessToken: session && session.accessToken ? session.accessToken : "",
        refreshToken: session && session.refreshToken ? session.refreshToken : ""
      };
    }
    var c = getCurrentUser();
    if (!c) return null;
    return getUsers().find(function (x) {
      return x.id === c.id;
    }) || null;
  }

  function isAdmin() {
    var u = getCurrentUser();
    return !!(u && u.role === "admin");
  }

  function requireUser() {
    if (!isLoggedIn()) {
      var page = (location.pathname && location.pathname.split("/").pop()) || "";
      if (!page || page === "") page = "index.html";
      window.location.replace("login.html?next=" + encodeURIComponent(page));
      return null;
    }
    return getCurrentUser();
  }

  function requireAdmin() {
    if (!isLoggedIn()) {
      window.location.replace("login.html?next=" + encodeURIComponent("admin-panel.html"));
      return null;
    }
    if (!isAdmin()) {
      window.location.replace("index.html");
      return null;
    }
    return getCurrentUser();
  }

  function renderHeaderBar() {
    var slot = document.getElementById("headerUserSlot");
    if (!slot) return;
    while (slot.firstChild) slot.removeChild(slot.firstChild);
    slot.className = "header-user-slot";

    function addHeaderLink(href, text) {
      var a = document.createElement("a");
      a.href = href;
      a.className = "header-link";
      a.textContent = text;
      slot.appendChild(a);
    }

    function addIlanVerButton() {
      var iv = document.createElement("a");
      iv.href = "ilan-ver.html";
      iv.className = "btn btn-primary btn-sm header-nav-ilanver";
      iv.textContent = "İlan Ver";
      slot.appendChild(iv);
    }

    var u = getCurrentUser();
    if (u) {
      addHeaderLink("dashboard.html#messages", "Mesajlar");
      addHeaderLink("dashboard.html#favorites", "Favoriler");
      if (u.role === "store") {
        addHeaderLink("dashboard.html#packages", "Mağaza paketleri");
      }
      addIlanVerButton();

      var wrap = document.createElement("div");
      wrap.className = "header-account-wrap";

      var trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "header-account-trigger";
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-controls", "headerAccountMenu");

      var nameEl = document.createElement("span");
      nameEl.className = "header-account-trigger__name";
      nameEl.textContent = u.name;
      nameEl.title = u.name;
      var caret = document.createElement("span");
      caret.className = "header-account-trigger__caret";
      caret.setAttribute("aria-hidden", "true");
      caret.textContent = "▾";
      trigger.appendChild(nameEl);
      trigger.appendChild(caret);

      var menu = document.createElement("div");
      menu.id = "headerAccountMenu";
      menu.className = "header-account-dropdown";
      menu.hidden = true;
      menu.setAttribute("role", "menu");

      function menuItem(href, label, isButton) {
        var el = isButton ? document.createElement("button") : document.createElement("a");
        el.className = "header-account-dropdown__item";
        el.setAttribute("role", "menuitem");
        if (isButton) {
          el.type = "button";
          el.textContent = label;
        } else {
          el.href = href;
          el.textContent = label;
        }
        return el;
      }

      var outsideHandler = null;
      function escHandler(ev) {
        if (ev.key === "Escape") closeMenu();
      }

      function closeMenu() {
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        wrap.classList.remove("is-open");
        if (outsideHandler) {
          document.removeEventListener("click", outsideHandler, true);
          outsideHandler = null;
        }
        document.removeEventListener("keydown", escHandler);
      }

      function openMenu() {
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        wrap.classList.add("is-open");
        document.removeEventListener("keydown", escHandler);
        document.addEventListener("keydown", escHandler);
      }

      menu.appendChild(menuItem("dashboard.html#profile", "Profilim", false));
      menu.appendChild(menuItem("dashboard.html#listings", "İlanlarım", false));
      menu.appendChild(menuItem("dashboard.html#favorites", "Favorilerim", false));
      menu.appendChild(menuItem("dashboard.html#messages", "Mesajlarım", false));

      var pageTag = document.body ? document.body.getAttribute("data-page") : "";
      var onAdminPage = pageTag === "admin" || pageTag === "admin-panel";
      if (isAdmin() && !onAdminPage) {
        var adm = menuItem("admin-panel.html", "İlan moderasyonu", false);
        adm.className = "header-account-dropdown__item header-account-dropdown__item--admin";
        menu.appendChild(adm);
        var adm2 = menuItem("admin.html", "Yönetim paneli", false);
        adm2.className = "header-account-dropdown__item header-account-dropdown__item--admin";
        menu.appendChild(adm2);
      }

      var div = document.createElement("div");
      div.className = "header-account-dropdown__sep";
      menu.appendChild(div);

      var out = menuItem("", "Çıkış", true);
      out.className = "header-account-dropdown__item header-account-dropdown__item--danger";
      out.addEventListener("click", function () {
        logout();
        location.reload();
      });
      menu.appendChild(out);

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (menu.hidden) {
          openMenu();
          setTimeout(function () {
            outsideHandler = function (ev) {
              if (!wrap.contains(ev.target)) closeMenu();
            };
            document.addEventListener("click", outsideHandler, true);
          }, 0);
        } else {
          closeMenu();
        }
      });

      menu.addEventListener("click", function (e) {
        if (e.target.tagName === "A") closeMenu();
      });

      wrap.appendChild(trigger);
      wrap.appendChild(menu);
      slot.appendChild(wrap);
    } else {
      var a = document.createElement("a");
      a.href = "login.html";
      a.className = "header-link";
      a.textContent = "Giriş";
      slot.appendChild(a);
      var r = document.createElement("a");
      r.href = "register.html";
      r.className = "btn btn-secondary btn-sm";
      r.textContent = "Kayıt ol";
      slot.appendChild(r);
      addIlanVerButton();
    }
  }

  function updateProfile(patch) {
    var u = getCurrentUser();
    if (!u) return { ok: false, message: "Oturum yok." };
    if (backendEnabled()) {
      var body = {};
      if (patch.name != null) body.fullName = JetleAPI.sanitizeText(patch.name, 120);
      if (patch.phone != null) body.phone = JetleAPI.sanitizeText(patch.phone, 20);
      if (patch.city != null) body.city = JetleAPI.sanitizeText(patch.city, 60);
      if (patch.district != null) body.district = JetleAPI.sanitizeText(patch.district, 60);
      if (patch.profileType != null) {
        var pt = JetleAPI.sanitizeText(patch.profileType, 40);
        if (pt === "Bireysel" || pt === "Kurumsal") body.profileType = pt;
      }
      if (Object.keys(body).length === 0) return { ok: true };
      var s = readSessionState();
      var res = syncBackendRequest("PATCH", "/api/me/profile", body, s && s.accessToken ? s.accessToken : "");
      if (!res.ok) return { ok: false, message: mapBackendMessage(res, "Profil güncellenemedi.") };
      syncCurrentUserFromBackend();
      return { ok: true };
    }
    var list = getUsers();
    var fu = list.find(function (x) {
      return x.id === u.id;
    });
    if (!fu) return { ok: false, message: "Kullanıcı bulunamadı." };
    if (patch.name != null) fu.name = JetleAPI.sanitizeText(patch.name, 120);
    if (patch.phone != null) fu.phone = JetleAPI.sanitizeText(patch.phone, 20);
    if (patch.city != null) fu.city = JetleAPI.sanitizeText(patch.city, 60);
    if (patch.district != null) fu.district = JetleAPI.sanitizeText(patch.district, 60);
    if (patch.profileType != null) fu.profileType = JetleAPI.sanitizeText(patch.profileType, 40);
    saveUsers(list);
    return { ok: true };
  }

  function changePassword(currentPassword, newPassword) {
    var u = getCurrentUser();
    if (!u) return { ok: false, message: "Oturum yok." };
    var np = String(newPassword || "");
    if (np.length < 8) return { ok: false, message: "Yeni şifre en az 8 karakter olmalıdır." };
    var list = getUsers();
    var fu = list.find(function (x) {
      return x.id === u.id;
    });
    if (!fu) return { ok: false, message: "Kullanıcı bulunamadı." };
    if (String(fu.passwordPlain || "") !== String(currentPassword || "")) {
      return { ok: false, message: "Mevcut şifre hatalı." };
    }
    fu.passwordPlain = np;
    fu.passwordHash = hashDemo(np);
    saveUsers(list);
    return { ok: true };
  }

  function init() {
    seedUsersIfEmpty();
    JetleAPI.init();
    if (backendEnabled()) syncCurrentUserFromBackend();
  }

  window.JetleAuth = {
    KEYS: KEYS,
    init: init,
    login: login,
    logout: logout,
    register: register,
    getSession: getSession,
    getCurrentUser: getCurrentUser,
    getFullUser: getFullUser,
    isLoggedIn: isLoggedIn,
    isAdmin: isAdmin,
    requireUser: requireUser,
    requireAdmin: requireAdmin,
    renderHeaderBar: renderHeaderBar,
    updateProfile: updateProfile,
    changePassword: changePassword
  };
})();
