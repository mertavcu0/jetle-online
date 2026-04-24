(function () {
  "use strict";

  var TOAST_ROOT_ID = "jetle-toast-root";
  var SKELETON_ID = "jetle-page-skeleton";

  function jetleScrollToTop() {
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
    try {
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch (e2) {}
  }

  function jetleShouldSkipShellSkeleton() {
    try {
      var b = document.body;
      if (!b) return false;
      if (b.getAttribute("data-jetle-skip-shell-skeleton") === "1") return true;
      if (b.getAttribute("data-page") === "detail") return true;
    } catch (e) {}
    return false;
  }

  /**
   * Basit SEO: canonical, og:url, robots, theme-color, twitter:card.
   * file:// veya origin yoksa canonical yazılmaz.
   */
  function jetleApplySeoBasics() {
    try {
      var path = (location.pathname && location.pathname.split("/").pop()) || "index.html";
      if (!path || path === "/") path = "index.html";
      var pathOnly = path.split("?")[0].split("#")[0] || "index.html";

      var origin = "";
      try {
        if (location.protocol === "http:" || location.protocol === "https:") origin = String(location.origin || "").replace(/\/+$/, "");
      } catch (eo) {}
      if (!origin || /^file:/i.test(String(location.href || ""))) return;

      var basePath = pathOnly.replace(/^\//, "");
      var href = origin + "/" + basePath;
      try {
        if (/^ilan-detail\.html$/i.test(basePath) || /^ilan-detay\.html$/i.test(basePath)) {
          if (location.search) href += location.search;
        }
      } catch (eq) {}
      var link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = href;

      var ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement("meta");
        ogUrl.setAttribute("property", "og:url");
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute("content", href);

      function ensureMetaName(name, content) {
        var m = document.querySelector('meta[name="' + name.replace(/"/g, "") + '"]');
        if (!m) {
          m = document.createElement("meta");
          m.setAttribute("name", name);
          document.head.appendChild(m);
        }
        m.setAttribute("content", content);
      }

      ensureMetaName("robots", "index, follow");
      ensureMetaName("theme-color", "#ffffff");
      ensureMetaName("twitter:card", "summary_large_image");

      var ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle && document.title) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        ogTitle.setAttribute("content", document.title);
        document.head.appendChild(ogTitle);
      }
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        var d = document.querySelector('meta[name="description"]');
        var dc = d && d.getAttribute("content") ? String(d.getAttribute("content")).trim() : "";
        if (dc) {
          ogDesc = document.createElement("meta");
          ogDesc.setAttribute("property", "og:description");
          ogDesc.setAttribute("content", dc);
          document.head.appendChild(ogDesc);
        }
      }
    } catch (eSeo) {}
  }

  function ensureStyles() {
    if (document.getElementById("jetle-common-style")) return;
    var st = document.createElement("style");
    st.id = "jetle-common-style";
    st.textContent =
      "#"+TOAST_ROOT_ID+"{position:fixed;right:14px;bottom:14px;z-index:9999;display:flex;flex-direction:column;gap:8px}" +
      ".jetle-toast{background:#0f172a;color:#fff;padding:10px 12px;border-radius:10px;font-size:13px;box-shadow:0 8px 24px rgba(0,0,0,.2)}" +
      ".jetle-toast--error{background:#b91c1c}.jetle-toast--success{background:#166534}" +
      "#"+SKELETON_ID+"{position:fixed;inset:0;background:linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9);background-size:200% 100%;animation:jetleSk 1.2s linear infinite;z-index:9998}" +
      "@keyframes jetleSk{0%{background-position:0 0}100%{background-position:200% 0}}";
    document.head.appendChild(st);
  }

  function ensureToastRoot() {
    var root = document.getElementById(TOAST_ROOT_ID);
    if (root) return root;
    root = document.createElement("div");
    root.id = TOAST_ROOT_ID;
    document.body.appendChild(root);
    return root;
  }

  function showToast(message, type) {
    try {
      ensureStyles();
      var root = ensureToastRoot();
      var el = document.createElement("div");
      el.className = "jetle-toast jetle-toast--" + (type || "error");
      el.textContent = String(message || "Bir hata oluştu.");
      root.appendChild(el);
      setTimeout(function () {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }, 2800);
    } catch (e) {}
  }

  function showSkeleton() {
    ensureStyles();
    if (document.getElementById(SKELETON_ID)) return;
    var sk = document.createElement("div");
    sk.id = SKELETON_ID;
    document.body.appendChild(sk);
  }

  function hideSkeleton() {
    var sk = document.getElementById(SKELETON_ID);
    if (!sk) return;
    sk.remove();
  }

  function safeRun(fn, fallbackMessage) {
    try {
      return fn();
    } catch (e) {
      showToast(fallbackMessage || "Islem basarisiz.");
      return null;
    }
  }

  function applyNavbarState() {
    try {
      if (window.JetleAuth && typeof JetleAuth.renderHeaderBar === "function") {
        JetleAuth.renderHeaderBar();
      }
    } catch (e) {
      showToast("Ust menu yuklenemedi.");
    }
  }

  function authGuard() {
    try {
      var body = document.body;
      if (!body) return;
      var needAuth = body.getAttribute("data-auth-required") === "1";
      if (!needAuth) return;
      if (window.JetleAuth && typeof JetleAuth.checkAuth === "function") {
        JetleAuth.checkAuth();
        return;
      }
      var ok = window.JetleAuth && JetleAuth.isLoggedIn && JetleAuth.isLoggedIn();
      if (!ok) {
        var next = (location.pathname && location.pathname.split("/").pop()) || "index.html";
        location.replace("login.html?next=" + encodeURIComponent(next));
      }
    } catch (e) {
      showToast("Oturum kontrolu yapilamadi.");
    }
  }

  window.JetleCommon = {
    showToast: showToast,
    safeRun: safeRun,
    showSkeleton: showSkeleton,
    hideSkeleton: hideSkeleton,
    applyNavbarState: applyNavbarState,
    authGuard: authGuard,
    scrollToPageTop: jetleScrollToTop,
    applySeoBasics: jetleApplySeoBasics
  };

  document.addEventListener("DOMContentLoaded", function () {
    jetleApplySeoBasics();
    var skipShell = jetleShouldSkipShellSkeleton();
    if (!skipShell) showSkeleton();
    try {
      if (window.JetleAuth && typeof JetleAuth.bootstrap === "function") {
        JetleAuth.bootstrap().then(function () {
          applyNavbarState();
          authGuard();
          hideSkeleton();
        }).catch(function () {
          showToast("Oturum yuklenemedi.");
          hideSkeleton();
        });
      } else {
        hideSkeleton();
      }
    } catch (e) {
      hideSkeleton();
    }
  });

  window.addEventListener("error", function () {
    showToast("Beklenmeyen bir hata olustu.");
  });
  window.addEventListener("unhandledrejection", function () {
    showToast("Islem tamamlanamadi.");
  });
})();
