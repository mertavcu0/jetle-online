/**
 * JETLE v2 — oturum ve roller (demo; şifreler yerelde düz metin — üretimde asla böyle olmamalı).
 */
(function () {
  "use strict";

  try {
    window.currentUser = null;
  } catch (e0root) {}

  var KEYS = {
    USERS: "jetle_v2_users",
    SESSION: "jetle_v2_session",
    BACKEND_FLAG: "jetle_v2_use_backend_api",
    /** jetle-backend ve frontend ortak: Bearer token (localStorage) */
    ACCESS_TOKEN: "jetle_v2_access_token"
  };
  var LEGACY_TOKEN_KEY = "token";
  /** Üretim API kökü — göreli `/api/...` yok; tüm istekler mutlak URL. */
  var API_BASE = "https://jetle-online-production.up.railway.app";

  /** Yerel (backend kapalı) kayıtta bu e-posta ile hesap admin rolü alır; backend için `ADMIN_REGISTRATION_EMAIL`. */
  var LOCAL_ADMIN_REGISTRATION_EMAIL = "admin@jetle.online";

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
    var base = (gw && gw.baseUrl) ? String(gw.baseUrl).trim() : "";
    if (!base || /^\/\//.test(base)) base = API_BASE;
    var b = base.replace(/\/+$/, "");
    var p = String(path || "").indexOf("/") === 0 ? path : "/" + path;
    return b + p;
  }

  function resolveBackendRequestUrl(path) {
    var pathStr = String(path || "");
    if (/^https?:\/\//i.test(pathStr)) return pathStr;
    return backendUrl(pathStr);
  }

  function syncBackendRequest(method, path, body, accessToken) {
    try {
      var xhr = new XMLHttpRequest();
      var resolvedUrl = resolveBackendRequestUrl(path);
      xhr.open(method, resolvedUrl, false);
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
        attemptedUrl = resolvedUrl;
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
        attempted = resolveBackendRequestUrl(path);
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
    try {
      localStorage.removeItem(KEYS.ACCESS_TOKEN);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    } catch (e0) {}
    var storage = getAuthStorage();
    if (storage && typeof storage.clear === "function") {
      storage.clear();
      return;
    }
    localStorage.removeItem(KEYS.SESSION);
  }

  /** JWT: önce kalıcı `token`, sonra oturum içi accessToken (sayfa yenilemede tutarlı). */
  function getRawAccessToken() {
    try {
      var lsTok = localStorage.getItem(LEGACY_TOKEN_KEY) || localStorage.getItem(KEYS.ACCESS_TOKEN) || "";
      if (lsTok) return String(lsTok);
    } catch (e0) {}
    var s = readSessionState();
    if (s && s.accessToken) return String(s.accessToken);
    return "";
  }

  /** JWT payload (role, userId) — imza doğrulaması sunucuda; istemci sadece okur. */
  function decodeJwtPayload(token) {
    try {
      var parts = String(token || "").split(".");
      if (parts.length < 2) return null;
      var b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      var pad = b64.length % 4;
      if (pad) b64 += new Array(5 - pad).join("=");
      var json = typeof atob !== "undefined" ? atob(b64) : "";
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
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
        accessToken: getRawAccessToken(),
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
    var tok = payload && (payload.accessToken || payload.token) ? String(payload.accessToken || payload.token) : "";
    saveSessionState(
      {
        userId: payload && payload.user ? payload.user.id : null,
        accessToken: tok,
        refreshToken: payload ? payload.refreshToken || "" : "",
        user: payload ? payload.user : null,
        at: new Date().toISOString()
      },
      remember == null ? !!(current && current.persist) : !!remember
    );
    if (tok) {
      try {
        localStorage.setItem(LEGACY_TOKEN_KEY, tok);
        localStorage.setItem(KEYS.ACCESS_TOKEN, tok);
      } catch (e) {}
    }
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
    var jwtRole = null;
    var tok = getRawAccessToken();
    if (tok) {
      var pl = decodeJwtPayload(tok);
      if (pl && pl.role) jwtRole = String(pl.role);
    }
    return {
      id: me.id,
      name: me.fullName || me.name || "",
      email: me.email || "",
      phone: me.phone || "",
      role: me.role || jwtRole || "user",
      city: me.city || "",
      district: me.district || "",
      profileType: me.profileType || "Bireysel"
    };
  }

  function userFromJwtOnly() {
    var tok = getRawAccessToken();
    if (!tok) return null;
    var pl = decodeJwtPayload(tok);
    var uid = pl && (pl.sub != null ? pl.sub : pl.userId);
    if (!pl || uid == null || String(uid).trim() === "") return null;
    var role = pl.role ? String(pl.role) : "user";
    return {
      id: String(uid),
      name: "",
      email: "",
      phone: "",
      role: role,
      city: "",
      district: "",
      profileType: "Bireysel"
    };
  }

  /** Sunucudan oturum doğrulama (async); window.currentUser güncellenir. */
  function syncCurrentUserFromBackendAsync() {
    if (!backendEnabled()) return Promise.resolve(null);
    var tok = getRawAccessToken();
    if (!tok) {
      clearSession();
      try {
        window.currentUser = null;
      } catch (eTok) {}
      return Promise.resolve(null);
    }
    console.log("CALLING:", API_BASE + "/api/auth/me");
    var bearerLs = "";
    try {
      bearerLs = localStorage.getItem("token") || "";
    } catch (eLs) {}
    return fetch(API_BASE + "/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: { Authorization: "Bearer " + String(bearerLs), Accept: "application/json" }
    })
      .then(function (res) {
        return res.text().then(function (txt) {
          var j = null;
          try {
            j = txt ? JSON.parse(txt) : null;
          } catch (e) {
            j = null;
          }
          return { res: res, j: j };
        });
      })
      .then(function (op) {
        var res = op.res;
        var j = op.j;
        if (res.status === 401 || res.status === 403) {
          clearSession();
          try {
            window.currentUser = null;
          } catch (e401) {}
          return null;
        }
        var me = j && j.data != null ? j.data : null;
        if (res.ok && me && typeof me === "object") {
          var s = readSessionState();
          setBackendSession(
            {
              accessToken: String(tok),
              refreshToken: s && s.refreshToken ? String(s.refreshToken) : "",
              user: me
            },
            !!(s && s.persist)
          );
          var norm = normalizeBackendUser(me);
          try {
            window.currentUser = norm;
          } catch (eOk) {}
          return norm;
        }
        var fallback = userFromJwtOnly();
        var out = fallback ? normalizeBackendUser(fallback) : null;
        try {
          window.currentUser = out;
        } catch (eFb) {}
        return out;
      })
      .catch(function () {
        var fallback = userFromJwtOnly();
        var out = fallback ? normalizeBackendUser(fallback) : null;
        try {
          window.currentUser = out;
        } catch (eCatch) {}
        return out;
      });
  }

  function syncCurrentUserFromBackend() {
    if (!backendEnabled()) return null;
    var tok = getRawAccessToken();
    if (!tok) {
      clearSession();
      try {
        window.currentUser = null;
      } catch (e) {}
      return null;
    }
    var s = readSessionState();
    console.log("CALLING:", API_BASE + "/api/auth/me");
    var meUrlSync = API_BASE.replace(/\/+$/, "") + "/api/auth/me";
    var bearerSync = "";
    try {
      bearerSync = localStorage.getItem("token") || "";
    } catch (eLs2) {}
    var meRes = syncBackendRequest("GET", meUrlSync, null, String(bearerSync));
    if (!meRes.ok || !meRes.data || !meRes.data.data) {
      if (meRes.status === 401 || meRes.status === 403) {
        clearSession();
        try {
          window.currentUser = null;
        } catch (e2) {}
        return null;
      }
      var fallback = userFromJwtOnly();
      var out = fallback ? normalizeBackendUser(fallback) : null;
      try {
        window.currentUser = out;
      } catch (e3) {}
      return out;
    }
    var me = meRes.data.data;
    setBackendSession(
      {
        accessToken: String(tok),
        refreshToken: s && s.refreshToken ? String(s.refreshToken) : "",
        user: me
      },
      !!(s && s.persist)
    );
    var norm = normalizeBackendUser(me);
    try {
      window.currentUser = norm;
    } catch (e4) {}
    return norm;
  }

  function findUserByEmail(email) {
    var e = String(email).trim().toLowerCase();
    return getUsers().find(function (u) {
      return u.email.toLowerCase() === e;
    });
  }

  function login(email, password, remember) {
    if (backendEnabled()) {
      console.log("LOGIN FETCH URL:", API_BASE + "/api/auth/login");
      var loginRes = syncBackendRequest("POST", "/api/auth/login", {
        email: String(email || "").trim().toLowerCase(),
        password: String(password || "")
      });
      if (!loginRes.ok) return { ok: false, message: mapBackendMessage(loginRes, "Giriş başarısız.") };
      var body = loginRes.data || {};
      console.log("LOGIN RESPONSE:", body);
      var pl = body.data;
      if (!pl || !pl.user) return { ok: false, message: "Geçersiz backend yanıtı." };
      var token = pl.token || pl.accessToken;
      if (!token) return { ok: false, message: "Geçersiz backend yanıtı (token yok)." };
      try {
        if (pl.token) {
          localStorage.setItem("token", String(pl.token));
        } else if (pl.accessToken) {
          localStorage.setItem("token", String(pl.accessToken));
        }
        localStorage.setItem(KEYS.ACCESS_TOKEN, String(token));
      } catch (eTok) {}
      console.log("SAVED TOKEN:", (function () {
        try {
          return localStorage.getItem("token");
        } catch (eSt) {
          return "";
        }
      })());
      var u = pl.user;
      var disp = (u && (u.fullName || u.name)) || "";
      setBackendSession(
        {
          accessToken: String(token),
          refreshToken: pl.refreshToken || "",
          user: {
            id: u.id,
            fullName: disp,
            name: disp,
            email: u.email || "",
            role: u.role || "user",
            phone: u.phone || "",
            city: u.city || "",
            district: u.district || "",
            profileType: u.profileType || "Bireysel"
          }
        },
        !!remember
      );
      try {
        window.currentUser = normalizeBackendUser(u);
      } catch (eLogin) {}
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
    try {
      window.currentUser = getCurrentUserLocalFromSession();
    } catch (eLocLogin) {}
    return { ok: true };
  }

  function getCurrentUserLocalFromSession() {
    var s = getSession();
    if (!s) return null;
    var u = getUsers().find(function (x) {
      return x.id === s.userId;
    });
    if (!u || u.active === false) return null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role || "user",
      city: u.city || "",
      district: u.district || "",
      profileType: u.profileType || "Bireysel"
    };
  }

  function logout() {
    if (backendEnabled()) {
      var tok = getRawAccessToken();
      if (tok) {
        try {
          syncBackendRequest("POST", "/api/auth/logout", null, tok);
        } catch (e) {}
      }
    }
    clearSession();
    try {
      window.currentUser = null;
    } catch (eLo) {}
    invalidateAuthBootstrap();
  }

  /**
   * Eski token/JWT temizliği: sunucu çıkışı (mümkünse) + `localStorage.clear()` + `sessionStorage.clear()`,
   * ardından sayfa yenileme. Sonra yeniden giriş yapıp `API_BASE + "/api/auth/me"` test edin.
   * @param {{ reload?: boolean }} opts reload false ise yenileme yapmaz (varsayılan true).
   */
  function forceHardLogoutClear(opts) {
    opts = opts || {};
    var reload = opts.reload !== false;
    try {
      logout();
    } catch (eOut) {}
    try {
      localStorage.clear();
    } catch (e1) {}
    try {
      sessionStorage.clear();
    } catch (e2) {}
    try {
      window.currentUser = null;
    } catch (e3) {}
    invalidateAuthBootstrap();
    if (reload) {
      try {
        location.reload();
      } catch (e4) {}
    }
  }

  function register(payload) {
    if (backendEnabled()) {
      var regRes = syncBackendRequest("POST", "/api/auth/register", {
        fullName: JetleAPI.sanitizeText(payload.name || payload.fullName || "", 120),
        email: String(payload.email || "").trim().toLowerCase(),
        password: String(payload.password || ""),
        phone: String(payload.phone || "").replace(/\D+/g, ""),
        city: JetleAPI.sanitizeText(payload.city || "", 60),
        district: JetleAPI.sanitizeText(payload.district || "", 60),
        profileType: JetleAPI.sanitizeText(payload.profileType || "Bireysel", 40) || "Bireysel",
        termsAccepted: payload.termsAccepted === true || payload.termsAccepted === "true"
      });
      if (!regRes.ok) return { ok: false, message: mapBackendMessage(regRes, "Kayıt başarısız.") };
      var regBody = regRes.data || {};
      console.log("REGISTER RESPONSE:", regBody);
      var rd = regBody.data;
      if (!rd || !rd.user) return { ok: false, message: "Geçersiz backend yanıtı." };
      var token = rd.token || rd.accessToken;
      if (!token) return { ok: false, message: "Geçersiz backend yanıtı (token yok)." };
      try {
        if (rd.token) {
          localStorage.setItem("token", String(rd.token));
        } else if (rd.accessToken) {
          localStorage.setItem("token", String(rd.accessToken));
        }
        localStorage.setItem(KEYS.ACCESS_TOKEN, String(token));
      } catch (eTokR) {}
      console.log("SAVED TOKEN:", (function () {
        try {
          return localStorage.getItem("token");
        } catch (eSr) {
          return "";
        }
      })());
      var u = rd.user;
      var dispR = (u && (u.fullName || u.name)) || "";
      setBackendSession(
        {
          accessToken: String(token),
          refreshToken: rd.refreshToken || "",
          user: {
            id: u.id,
            fullName: dispR,
            name: dispR,
            email: u.email || "",
            role: u.role || "user",
            phone: u.phone || "",
            city: u.city || "",
            district: u.district || "",
            profileType: u.profileType || "Bireysel"
          }
        },
        payload && payload.remember !== false
      );
      try {
        window.currentUser = normalizeBackendUser(u);
      } catch (eRegB) {}
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
    var regRole = safeEmail === LOCAL_ADMIN_REGISTRATION_EMAIL ? "admin" : "user";
    var user = {
      id: id,
      name: JetleAPI.sanitizeText(payload.name, 120),
      email: safeEmail,
      phone: safePhone,
      passwordHash: hashDemo(safePw),
      passwordPlain: safePw,
      role: regRole,
      city: JetleAPI.sanitizeText(payload.city || "", 60),
      profileType: "Bireysel",
      active: true,
      createdAt: new Date().toISOString()
    };
    var list = getUsers();
    list.push(user);
    saveUsers(list);
    setSession(id, payload && payload.remember !== false);
    try {
      window.currentUser = getCurrentUserLocalFromSession();
    } catch (eLocReg) {}
    return { ok: true };
  }

  function getCurrentUser() {
    if (backendEnabled()) {
      try {
        return window.currentUser != null ? window.currentUser : null;
      } catch (eGc) {
        return null;
      }
    }
    try {
      if (window.currentUser != null) return window.currentUser;
    } catch (eGc2) {}
    return getCurrentUserLocalFromSession();
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
        accessToken: getRawAccessToken(),
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
    if (u && u.role === "admin") return true;
    var tok = getRawAccessToken();
    if (!tok) return false;
    var pl = decodeJwtPayload(tok);
    return !!(pl && pl.role === "admin");
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

  function renderNavbar(user) {
    var slot = document.getElementById("headerUserSlot");
    if (!slot) return;
    while (slot.firstChild) slot.removeChild(slot.firstChild);
    slot.className = "header-user-slot";

    function addHeaderLink(href, text, extraClass) {
      var a = document.createElement("a");
      a.href = href;
      a.className = "header-link" + (extraClass ? " " + extraClass : "");
      a.textContent = text;
      slot.appendChild(a);
    }

    function addIlanVerButton() {
      var iv = document.createElement("a");
      iv.href = "ilan-ver.html";
      iv.className = "header-btn-ilan-ver header-nav-ilanver";
      iv.textContent = "İlan Ver";
      slot.appendChild(iv);
    }

    var u = arguments.length >= 1 ? user : window.currentUser;
    if (u) {
      addHeaderLink("dashboard.html#profile", "Profil", "header-link--auth");
      var out = document.createElement("button");
      out.type = "button";
      out.className = "header-link header-link--auth";
      out.style.cssText = "background:none;border:none;cursor:pointer;font:inherit;padding:0;color:inherit;text-decoration:inherit;";
      out.textContent = "Çıkış Yap";
      out.setAttribute("aria-label", "Çıkış Yap");
      out.addEventListener("click", function () {
        logout();
        location.reload();
      });
      slot.appendChild(out);

      addIlanVerButton();
    } else {
      addHeaderLink("login.html", "Giriş", "header-link--auth");
      addHeaderLink("register.html", "Kayıt ol", "header-link--auth");
      addIlanVerButton();
    }
  }

  function renderHeaderBar() {
    renderNavbar(window.currentUser);
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
      var res = syncBackendRequest("PATCH", "/api/auth/me/profile", body, getRawAccessToken());
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
    try {
      window.currentUser = getCurrentUserLocalFromSession();
    } catch (eUpLoc) {}
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

  var _bootstrapPromise = null;

  function showAuthBootstrapLoading() {
    try {
      if (document.documentElement) document.documentElement.setAttribute("data-jetle-auth-loading", "1");
    } catch (eL1) {}
    var host = document.body || document.documentElement;
    if (!host || document.getElementById("jetle-auth-bootstrap-loading")) return;
    var el = document.createElement("div");
    el.id = "jetle-auth-bootstrap-loading";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-busy", "true");
    el.style.cssText =
      "position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;" +
      "background:rgba(255,255,255,.92);font:600 15px system-ui,sans-serif;color:#111827;";
    el.textContent = "Yükleniyor…";
    host.appendChild(el);
  }

  function hideAuthBootstrapLoading() {
    try {
      if (document.documentElement) document.documentElement.removeAttribute("data-jetle-auth-loading");
    } catch (eH1) {}
    var el = document.getElementById("jetle-auth-bootstrap-loading");
    if (el) el.remove();
  }

  function init() {
    seedUsersIfEmpty();
    if (window.JetleAPI && typeof JetleAPI.init === "function") JetleAPI.init();
    if (backendEnabled()) {
      var tok = getRawAccessToken();
      if (!tok) {
        try {
          window.currentUser = null;
        } catch (eIn1) {}
        return Promise.resolve(null);
      }
      return syncCurrentUserFromBackendAsync();
    }
    try {
      window.currentUser = getCurrentUserLocalFromSession();
    } catch (eIn2) {
      try {
        window.currentUser = null;
      } catch (eIn3) {}
    }
    return Promise.resolve(window.currentUser);
  }

  function bootstrap() {
    if (_bootstrapPromise) return _bootstrapPromise;
    showAuthBootstrapLoading();
    _bootstrapPromise = init()
      .then(function () {
        renderNavbar(window.currentUser);
      })
      .catch(function () {
        try {
          window.currentUser = null;
        } catch (eB1) {}
        renderNavbar(null);
      })
      .finally(function () {
        hideAuthBootstrapLoading();
      });
    return _bootstrapPromise;
  }

  function invalidateAuthBootstrap() {
    _bootstrapPromise = null;
  }

  /** Konsoldan: `JetleAuth.debugAuth()` — token + GET `/api/auth/me` yanıtını loglar. */
  function debugAuth() {
    var token = "";
    try {
      token = localStorage.getItem("token") || "";
    } catch (eT) {}
    console.log("TOKEN:", token || "(yok)");
    console.log("CALLING:", API_BASE + "/api/auth/me");
    return fetch(API_BASE + "/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + String(localStorage.getItem("token") || "")
      }
    })
      .then(function (res) {
        return res.text().then(function (txt) {
          var data;
          try {
            data = txt ? JSON.parse(txt) : {};
          } catch (eJ) {
            data = { _parseError: true, _raw: txt };
          }
          console.log("ME STATUS:", res.status);
          console.log("ME RESPONSE:", data);
          return { ok: res.ok, status: res.status, data: data };
        });
      })
      .catch(function (err) {
        console.error("ME ERROR:", err && err.message ? err.message : err);
        throw err;
      });
  }

  /**
   * Konsol: `JetleAuth.fetchMeConsole()` — `API_BASE + "/api/auth/me"` + `Authorization: Bearer` + `token`,
   * ardından `r.json()` ve `console.log` (sizin fetch zinciriyle aynı mantık).
   */
  function fetchMeConsole() {
    console.log("CALLING:", API_BASE + "/api/auth/me");
    return fetch(API_BASE + "/api/auth/me", {
      headers: {
        Authorization: "Bearer " + String(localStorage.getItem("token") || "")
      }
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        console.log(data);
        return data;
      });
  }

  window.JetleAuth = {
    KEYS: KEYS,
    getRawAccessToken: getRawAccessToken,
    decodeJwtPayload: decodeJwtPayload,
    init: init,
    bootstrap: bootstrap,
    invalidateAuthBootstrap: invalidateAuthBootstrap,
    renderNavbar: renderNavbar,
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
    changePassword: changePassword,
    debugAuth: debugAuth,
    fetchMeConsole: fetchMeConsole,
    forceHardLogoutClear: forceHardLogoutClear
  };
})();
