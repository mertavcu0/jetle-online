/**
 * JETLE v2 — ortak kabuk ve ana sayfa etkileşimleri
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    if (window.JetleAPI && window.JetleAuth) JetleAuth.init();
    if (window.JetleAuth) JetleAuth.renderHeaderBar();

    (function wireHeaderPanelOrAdminLink() {
      if (!window.JetleAuth) return;

      var SESSION_KEY = "jetle_v2_session";

      function readRoleFromStoredSession() {
        try {
          var raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
          if (raw) {
            var s = JSON.parse(raw);
            if (s && s.user && s.user.role != null) return String(s.user.role).toLowerCase();
            if (s && typeof s.role === "string") return s.role.toLowerCase();
          }
        } catch (e) {}
        try {
          var u = JetleAuth.getCurrentUser && JetleAuth.getCurrentUser();
          if (u && u.role != null) return String(u.role).toLowerCase();
        } catch (e2) {}
        return null;
      }

      function applyHeaderPanelOrAdminLink() {
        var slot = document.getElementById("headerUserSlot");
        if (!slot) return;
        var prev = document.getElementById("adminPanelBtn");
        if (prev) prev.remove();

        var u = JetleAuth.getCurrentUser && JetleAuth.getCurrentUser();
        if (!u) return;

        var role = readRoleFromStoredSession();
        if (role == null && u.role) role = String(u.role).toLowerCase();
        var isAdmin = role === "admin";

        if (!isAdmin) return;
        var a = document.createElement("a");
        a.id = "adminPanelBtn";
        a.className = "btn btn-outline btn-sm";
        a.href = "dashboard.html";
        a.textContent = "Admin Paneli";
        a.setAttribute("data-jetle-header-link", "admin-panel");
        slot.insertBefore(a, slot.firstChild);
      }

      if (!JetleAuth._jetlePanelLinkWrapped) {
        JetleAuth._jetlePanelLinkWrapped = true;
        var origRender = JetleAuth.renderHeaderBar;
        JetleAuth.renderHeaderBar = function () {
          origRender.apply(JetleAuth, arguments);
          applyHeaderPanelOrAdminLink();
        };
      }
      applyHeaderPanelOrAdminLink();
    })();

    var footerYearEl = document.getElementById("footerYear");
    if (footerYearEl) footerYearEl.textContent = String(new Date().getFullYear());

    (function wireIlanVerLoginGuard() {
      if (!window.JetleAuth) return;
      var modalRoot = null;

      function ensureModal() {
        if (modalRoot) return modalRoot;
        var wrap = document.createElement("div");
        wrap.id = "jetleIlanVerLoginModal";
        wrap.className = "detail-msg-modal";
        wrap.hidden = true;
        wrap.setAttribute("role", "dialog");
        wrap.setAttribute("aria-modal", "true");
        wrap.setAttribute("aria-labelledby", "jetleIlanVerLoginTitle");
        wrap.innerHTML =
          '<div class="detail-msg-modal__card panel">' +
          '<div class="detail-msg-modal__head">' +
          '<h2 id="jetleIlanVerLoginTitle" class="auth-title" style="margin:0;font-size:1.15rem">Giriş yapın</h2>' +
          '<button type="button" class="btn btn-secondary btn-sm" data-jetle-ilanver-close>Kapat</button>' +
          "</div>" +
          '<p class="text-small text-muted">İlan vermek için hesabınıza giriş yapın.</p>' +
          '<div id="jetleIlanVerLoginErr" class="form-error" hidden></div>' +
          '<form id="jetleIlanVerLoginForm">' +
          '<div class="field"><label for="jetleIlanVerEmail">E-posta</label><input type="email" id="jetleIlanVerEmail" autocomplete="username" required /></div>' +
          '<div class="field"><label for="jetleIlanVerPw">Şifre</label><input type="password" id="jetleIlanVerPw" autocomplete="current-password" required /></div>' +
          '<div class="detail-msg-modal__actions" style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:10px">' +
          '<a href="register.html" class="btn btn-outline btn-sm">Kayıt ol</a>' +
          '<button type="submit" class="btn btn-primary btn-sm">Giriş yap</button>' +
          "</div></form></div>";
        document.body.appendChild(wrap);
        modalRoot = wrap;

        var form = document.getElementById("jetleIlanVerLoginForm");
        var err = document.getElementById("jetleIlanVerLoginErr");

        function close() {
          wrap.hidden = true;
          document.body.classList.remove("modal-open");
        }

        wrap.addEventListener("click", function (ev) {
          if (ev.target === wrap) close();
        });
        var closeBtn = wrap.querySelector("[data-jetle-ilanver-close]");
        if (closeBtn) closeBtn.addEventListener("click", close);

        document.addEventListener("keydown", function (ev) {
          if (!modalRoot || modalRoot.hidden) return;
          if (ev.key === "Escape") close();
        });

        form.addEventListener("submit", function (ev) {
          ev.preventDefault();
          err.hidden = true;
          var emailEl = document.getElementById("jetleIlanVerEmail");
          var pwEl = document.getElementById("jetleIlanVerPw");
          var email = emailEl ? String(emailEl.value || "").trim() : "";
          var pw = pwEl ? String(pwEl.value || "") : "";
          var res = JetleAuth.login(email, pw, false);
          if (!res.ok) {
            err.textContent = res.message || "Giriş başarısız.";
            err.hidden = false;
            return;
          }
          close();
          window.location.href = "ilan-ver.html";
        });

        return wrap;
      }

      function openModal() {
        var m = ensureModal();
        m.hidden = false;
        document.body.classList.add("modal-open");
        var em = document.getElementById("jetleIlanVerEmail");
        if (em) {
          window.setTimeout(function () {
            try {
              em.focus();
            } catch (e1) {}
          }, 50);
        }
      }

      document.addEventListener(
        "click",
        function (e) {
          var a = e.target.closest && e.target.closest("a.header-nav-ilanver");
          if (!a) return;
          if (e.defaultPrevented) return;
          if (e.button !== 0) return;
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
          if (JetleAuth.isLoggedIn()) return;
          var href = a.getAttribute("href") || "";
          if (href.indexOf("ilan-ver") === -1) return;
          e.preventDefault();
          openModal();
        },
        true
      );
    })();

    var page = document.body.getAttribute("data-page") || "";
    function escHtml(v) {
      return String(v == null ? "" : v)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
    function formatTry(n) {
      return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n) + " ₺";
    }
    /**
     * @param {HTMLElement} mount
     * @param {{ userId: string|null, readOnly?: boolean, onPurchased?: function(): void }} opts
     */
    function renderPricingCatalogInto(mount, opts) {
      if (!mount || !window.JetleAPI || typeof JetleAPI.getPricingCatalog !== "function") return;
      var uid = opts && opts.userId ? opts.userId : null;
      var readOnly = !!(opts && opts.readOnly);
      var onPurchased = opts && typeof opts.onPurchased === "function" ? opts.onPurchased : null;
      mount.innerHTML = "";
      var cat = JetleAPI.getPricingCatalog();
      function sectionTitle(text, anchorId) {
        var h = document.createElement("h2");
        h.className = "pricing-section-title";
        if (anchorId) h.id = anchorId;
        h.textContent = text;
        mount.appendChild(h);
      }
      function card(row, subtitle) {
        var popular = !!row.popular;
        var article = document.createElement("article");
        article.className = "pricing-card panel" + (popular ? " pricing-card--popular" : "");
        var ul = (row.perks || []).map(function (t) { return "<li>" + escHtml(t) + "</li>"; }).join("");
        var priceLine = formatTry(row.price);
        if (row.period) priceLine += " <span class=\"pricing-card__period\">/ " + escHtml(row.period) + "</span>";
        if (row.unit && !row.period) priceLine += " <span class=\"pricing-card__period\">· " + escHtml(row.unit) + "</span>";
        article.innerHTML =
          (popular ? "<span class=\"pricing-card__badge\">En popüler</span>" : "") +
          "<h3 class=\"pricing-card__title\">" + escHtml(row.name) + "</h3>" +
          (subtitle ? "<p class=\"pricing-card__sub\">" + escHtml(subtitle) + "</p>" : "") +
          "<p class=\"pricing-card__price\">" + priceLine + "</p>" +
          "<ul class=\"pricing-card__perks\">" + ul + "</ul>";
        var b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-primary btn-sm pricing-card__cta";
        if (readOnly) {
          b.textContent = "Liste fiyatı";
          b.disabled = true;
          b.title = "Satın alma kullanıcı panelinden yapılır";
        } else if (!uid) {
          b.textContent = "Seç";
          b.addEventListener("click", function () {
            window.location.href = "login.html?next=" + encodeURIComponent("dashboard.html#packages");
          });
        } else {
          b.textContent = "Seç";
          b.addEventListener("click", function () {
            var res = JetleAPI.purchasePricingProduct(uid, row.id);
            window.alert(res.ok ? res.message : res.message);
            if (onPurchased) onPurchased();
          });
        }
        article.appendChild(b);
        return article;
      }
      function grid(rows, sub) {
        var g = document.createElement("div");
        g.className = "pricing-card-grid";
        rows.forEach(function (row) {
          g.appendChild(card(row, sub));
        });
        mount.appendChild(g);
      }
      sectionTitle("Doping ürünleri", "pack-doping");
      grid(cat.dopings, "Yayın güçlendirme");
      sectionTitle("Mağaza / kurumsal paketler", "pack-magaza");
      grid(cat.stores, "Aylık abonelik");
      sectionTitle("Ek ilan hakları", "pack-ekilan");
      grid(cat.extras, "Kota aşımı");
      sectionTitle("Doping kredisi", "pack-kredi");
      grid(cat.credits, "Kredi kullanımı panelde tanımlıdır");
    }

    if (page === "home" && window.JetleMarket) {
      var homeLoad = document.getElementById("homeListingsLoading");
      try {
        if (homeLoad) homeLoad.hidden = false;
        JetleMarket.initHome();
      } finally {
        if (homeLoad) homeLoad.hidden = true;
      }
      window.addEventListener("jetle-listings-changed", function () {
        JetleMarket.refreshAll();
      });
      window.addEventListener("storage", function (e) {
        if (e.key === JetleAPI.KEYS.LISTINGS && window.JetleMarket) {
          JetleMarket.refreshAll();
        }
      });

      document.addEventListener("click", function (e) {
        var favBtn = e.target.closest("[data-fav-id]");
        if (favBtn) {
          e.preventDefault();
          e.stopPropagation();
          var id = favBtn.getAttribute("data-fav-id");
          if (id) {
            favBtn.classList.remove("listing-card__fav--pulse");
            void favBtn.offsetWidth;
            favBtn.classList.add("listing-card__fav--pulse");
            window.setTimeout(function () {
              try {
                favBtn.classList.remove("listing-card__fav--pulse");
              } catch (err) {}
            }, 450);
            JetleMarket.onFavClick(id);
          }
          return;
        }
        var tgl = e.target.closest("#categoryNav .cat-tree__toggle");
        if (tgl) {
          e.preventDefault();
          var node = tgl.closest(".cat-tree__node");
          if (node) {
            var open = !node.classList.contains("is-open");
            node.classList.toggle("is-open", open);
            tgl.setAttribute("aria-expanded", open ? "true" : "false");
          }
        }
      });

      var filterForm = document.getElementById("filterForm");
      if (filterForm) {
        filterForm.addEventListener("change", function (e) {
          var id = (e.target && e.target.id) || "";
          if (id) JetleMarket.handleFilterControlChange(id);
        });
      }

      var homeFilterMobileQuery = window.matchMedia("(max-width: 900px)");

      function setHomeFilterDrawer(open) {
        var wantOpen = !!open;
        document.body.classList.toggle("home-filter-drawer-is-open", wantOpen);
        var bd = document.getElementById("homeFilterBackdrop");
        var op = document.getElementById("homeFilterOpenBtn");
        var pan = document.getElementById("homeFilterPanel");
        if (bd) {
          if (wantOpen) bd.removeAttribute("hidden");
          else bd.setAttribute("hidden", "");
          bd.setAttribute("aria-hidden", wantOpen ? "false" : "true");
        }
        if (op) op.setAttribute("aria-expanded", wantOpen ? "true" : "false");
        if (pan) {
          if (homeFilterMobileQuery.matches) {
            pan.setAttribute("aria-modal", wantOpen ? "true" : "false");
            pan.setAttribute("aria-hidden", wantOpen ? "false" : "true");
          } else {
            pan.removeAttribute("aria-modal");
            pan.removeAttribute("aria-hidden");
          }
        }
        if (homeFilterMobileQuery.matches) document.body.style.overflow = wantOpen ? "hidden" : "";
        else document.body.style.overflow = "";
      }

      function syncHomeFilterDrawerLayout() {
        if (!homeFilterMobileQuery.matches) setHomeFilterDrawer(false);
      }
      if (homeFilterMobileQuery.addEventListener) {
        homeFilterMobileQuery.addEventListener("change", syncHomeFilterDrawerLayout);
      } else if (homeFilterMobileQuery.addListener) {
        homeFilterMobileQuery.addListener(syncHomeFilterDrawerLayout);
      }

      setHomeFilterDrawer(false);

      var hfb = document.getElementById("homeFilterBackdrop");
      var hfo = document.getElementById("homeFilterOpenBtn");
      var hfc = document.getElementById("homeFilterCloseBtn");
      if (hfo) hfo.addEventListener("click", function () { setHomeFilterDrawer(true); });
      if (hfc) hfc.addEventListener("click", function () { setHomeFilterDrawer(false); });
      if (hfb) hfb.addEventListener("click", function () { setHomeFilterDrawer(false); });
      document.addEventListener("keydown", function (ev) {
        if (ev.key !== "Escape") return;
        if (!document.body.classList.contains("home-filter-drawer-is-open")) return;
        setHomeFilterDrawer(false);
      });

      var homeFilterTags = document.getElementById("homeFilterActiveTags");
      if (homeFilterTags) {
        homeFilterTags.addEventListener("click", function (e) {
          var btn = e.target.closest(".home-filter-tag__remove");
          if (!btn || !window.JetleMarket) return;
          var tag = btn.closest(".home-filter-tag");
          if (!tag) return;
          var id = tag.getAttribute("data-filter-chip");
          if (id) JetleMarket.removeFilterChip(id);
        });
      }

      var applyBtn = document.getElementById("filterApply");
      if (applyBtn) {
        applyBtn.addEventListener("click", function () {
          JetleMarket.applyFilters();
          setHomeFilterDrawer(false);
        });
      }

      var resetBtn = document.getElementById("filterReset");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          var filterFormEl = document.getElementById("filterForm");
          if (filterFormEl) {
            filterFormEl.querySelectorAll("input, select").forEach(function (el) {
              if (el.tagName === "SELECT") {
                if (el.id === "dateFilter") el.value = "all";
                else el.value = "";
              } else {
                el.value = "";
              }
            });
          }
          JetleMarket.clearSellerFilter();
          JetleMarket.resetFilters();
          setHomeFilterDrawer(false);
        });
      }

      var emptyResetBtn = document.getElementById("emptyResetBtn");
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener("click", function () {
          JetleMarket.resetFilters();
        });
      }

      var searchForm = document.getElementById("headerSearchForm");
      var searchInput = document.getElementById("headerSearchInput");
      if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (e) {
          e.preventDefault();
          JetleMarket.setSearchQuery(searchInput.value);
        });
      }
    }

    if (page === "detail" && window.JetleMarket) {
      JetleMarket.initDetailPage();
      document.addEventListener("click", function (e) {
        var favBtn = e.target.closest("[data-fav-id]");
        if (favBtn) {
          e.preventDefault();
          e.stopPropagation();
          var id = favBtn.getAttribute("data-fav-id");
          if (id) {
            JetleMarket.onFavClick(id);
            JetleMarket.initDetailPage();
          }
        }
      });
    }

    if (page === "form" && window.JetleMarket && typeof JetleMarket.initListingWizard === "function") {
      JetleMarket.initListingWizard();
    }

    if (page === "dashboard" && window.JetleAPI && window.JetleAuth && window.JetleMarket) {
      var user = JetleAuth.requireUser();
      if (!user) return;
      var listingFilterStatus = "all";
      var selectedConversation = null;
      function d$(id) {
        return document.getElementById(id);
      }
      function setHashTab(name) {
        var h = "#" + name;
        if (location.hash !== h) {
          if (history.replaceState) history.replaceState(null, "", h);
          else location.hash = name;
        }
      }
      function showTab(name) {
        document.querySelectorAll(".dash-tab").forEach(function (t) {
          var on = t.getAttribute("data-tab") === name;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        document.querySelectorAll(".dash-panel").forEach(function (p) {
          p.hidden = p.getAttribute("data-panel") !== name;
        });
      }
      function applyHash() {
        var raw = (location.hash || "").replace(/^#/, "");
        var parts = raw.split("--");
        var tabKey = (parts[0] || "").split("&")[0];
        var map = { listings: "listings", favorites: "favorites", messages: "messages", packages: "packages", profile: "profile" };
        var target = map[tabKey] ? tabKey : "listings";
        showTab(map[target] || "listings");
        if (tabKey === "packages" && parts[1]) {
          setTimeout(function () {
            var el = document.getElementById("pack-" + parts[1]);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 80);
        }
      }
      function sanitizePkg(pkg) {
        var s = String(pkg == null ? "basic" : pkg).replace(/[^\w\-]/g, "");
        return s.slice(0, 48) || "basic";
      }
      function storePlanLabel(plan) {
        if (!plan) return "—";
        var m = { baslangic: "Başlangıç", standart: "Standart", pro: "Pro", kurumsal_plus: "Kurumsal Plus" };
        return m[plan] || plan;
      }
      function listingDateStr(L) {
        var iso = L.updatedAt || L.createdAt;
        if (!iso) return "—";
        try {
          return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
        } catch (e) {
          return "—";
        }
      }
      function daysLeftText(iso) {
        if (!iso) return "";
        var ms = new Date(iso).getTime() - Date.now();
        if (!isFinite(ms)) return "";
        if (ms <= 0) return "Süresi doldu";
        var days = Math.ceil(ms / 86400000);
        return days + " gün";
      }
      function activateDopingForListing(listingId, type) {
        var kind = String(type || "");
        if (kind === "featured" && !JetleAPI.userCanFeatured(user.id)) {
          return { ok: false, message: "Öne çıkarma için paket, slot veya kredi gerekir. Paketler sekmesinden satın alın." };
        }
        if (kind === "showcase" && !JetleAPI.userCanShowcase(user.id)) {
          return { ok: false, message: "Vitrin için paket, slot veya en az 2 kredi gerekir. Paketler sekmesinden satın alın." };
        }
        if ((kind === "urgent" || kind === "highlight") && !JetleAPI.userCanFeatured(user.id)) {
          return { ok: false, message: "ACİL / renkli vitrin için kredi veya uygun paket gerekir. Paketler sekmesinden satın alın." };
        }
        if (typeof JetleAPI.activateDoping === "function") {
          return JetleAPI.activateDoping(listingId, user.id, type);
        }
        var patch = {};
        if (type === "featured") {
          patch.featured = true;
          patch.featuredUntil = new Date(Date.now() + 7 * 864e5).toISOString();
        } else if (type === "showcase") {
          patch.showcase = true;
          patch.showcaseUntil = new Date(Date.now() + 7 * 864e5).toISOString();
        } else if (type === "urgent") {
          patch.urgent = true;
        } else if (type === "highlight") {
          patch.highlight = true;
        }
        var L = JetleAPI.updateListingFields(listingId, patch);
        if (!L) return { ok: false, message: "Doping aktif edilemedi." };
        return { ok: true, listing: L, message: "Paket aktif edildi." };
      }
      function renderPackageSummary() {
        var sum = d$("packageSummaryMount");
        if (!sum) return;
        var e = JetleAPI.getEntitlements(user.id);
        var until = e.storeActiveUntil ? new Date(e.storeActiveUntil).toLocaleDateString("tr-TR") : "—";
        var hasPlan = !!e.storePlan;
        var hasExtras =
          (e.featuredSlots || 0) > 0 ||
          (e.showcaseSlots || 0) > 0 ||
          (e.dopingCredits || 0) > 0 ||
          (e.bumpCredits || 0) > 0 ||
          (e.extraListingSlots || 0) > 0;
        if (!hasPlan && !hasExtras) {
          sum.innerHTML =
            '<div class="dash-empty dash-empty--compact">' +
            '<p class="dash-empty__title">Henüz aktif paket veya doping yok</p>' +
            '<p class="dash-empty__text text-small text-muted">Yayınınızı güçlendirmek için aşağıdan ürün seçebilirsiniz.</p>' +
            '<a class="btn btn-primary btn-sm" href="#packages">Ürünlere göz at</a>' +
            "</div>";
          return;
        }
        sum.innerHTML =
          '<div class="panel pricing-dash-summary__inner">' +
          '<h2 class="pricing-dash-summary__h">Aktif haklarınız</h2>' +
          "<ul class=\"pricing-dash-summary__list\">" +
          "<li><strong>Mağaza paketi:</strong> " +
          escHtml(storePlanLabel(e.storePlan)) +
          " · Bitiş: " +
          escHtml(until) +
          "</li>" +
          "<li><strong>Öne çıkarma:</strong> " +
          (JetleAPI.userCanFeatured(user.id) && (e.storePlan === "standart" || e.storePlan === "pro" || e.storePlan === "kurumsal_plus")
            ? "paket kapsamında"
            : escHtml(String(e.featuredSlots)) + " slot · " + escHtml(String(e.dopingCredits)) + " kredi") +
          "</li>" +
          "<li><strong>Vitrin:</strong> " +
          escHtml(String(e.showcaseSlots)) +
          " slot (" +
          (JetleAPI.userCanShowcase(user.id) && (e.storePlan === "pro" || e.storePlan === "kurumsal_plus") ? "paketle uyumlu" : "ek ürün gerekebilir") +
          ")</li>" +
          "<li><strong>Güncelleme (Güncelim):</strong> " +
          escHtml(String(e.bumpCredits)) +
          " · <strong>Ek ilan slotu:</strong> " +
          escHtml(String(e.extraListingSlots)) +
          "</li>" +
          "</ul></div>";
      }
      function statusBadgeClass(s) {
        if (s === "draft") return "status-badge status-badge--draft";
        if (s === "approved") return "status-badge status-badge--ok";
        if (s === "pending") return "status-badge status-badge--wait";
        if (s === "rejected") return "status-badge status-badge--no";
        if (s === "passive") return "status-badge status-badge--off";
        return "status-badge";
      }
      function statusLabel(s) {
        if (s === "draft") return "Taslak";
        if (s === "approved") return "Yayında";
        if (s === "pending") return "Onay Bekliyor";
        if (s === "rejected") return "Reddedildi";
        if (s === "passive") return "Pasif";
        return s;
      }
      function updateOwnerStatus(listingId, status) {
        if (typeof JetleAPI.setListingStatusByOwner === "function") {
          return JetleAPI.setListingStatusByOwner(listingId, user.id, status);
        }
        var next = JetleAPI.updateListingStatus(listingId, status);
        if (!next) return { ok: false, message: "Durum güncellenemedi." };
        return { ok: true, listing: next };
      }
      function renderMyListings() {
        var mount = d$("myListingsMount");
        if (!mount) return;
        mount.innerHTML = "";
        var mine = JetleAPI.getListingsByUser(user.id);
        if (!mine.length) {
          mount.innerHTML =
            '<div class="empty-box">' +
            "<p>Henüz ilan vermedin</p>" +
            '<a href="ilan-ver.html">İlan Ver</a>' +
            "</div>";
          return;
        }
        var rows = mine.filter(function (L) {
          return listingFilterStatus === "all" ? true : L.status === listingFilterStatus;
        });
        if (!rows.length) {
          mount.innerHTML =
            '<div class="dash-empty dash-empty--compact">' +
            '<p class="dash-empty__title">Bu filtrede ilan yok</p>' +
            '<p class="dash-empty__text text-small text-muted">Farklı bir durum seçin veya yeni ilan ekleyin.</p>' +
            "</div>";
          return;
        }
        var wrap = document.createElement("div");
        wrap.className = "dash-listing-table";
        rows.forEach(function (L) {
          var imgUrl = L.coverImage || (L.images && L.images[0]) || "";
          var row = document.createElement("article");
          row.className = "dash-lrow panel panel--flat";
          row.innerHTML =
            '<div class="dash-lrow__main">' +
            '<a class="dash-lrow__thumb" href="ilan-detay.html?id=' +
            encodeURIComponent(L.id) +
            '">' +
            (imgUrl
              ? '<img src="' + escHtml(imgUrl) + '" alt="" loading="lazy" />'
              : '<span class="dash-lrow__noimg">Fotoğraf yok</span>') +
            "</a>" +
            '<div class="dash-lrow__body">' +
            '<div class="dash-lrow__title-row">' +
            '<a class="dash-lrow__title" href="ilan-detay.html?id=' +
            encodeURIComponent(L.id) +
            '">' +
            escHtml(L.title) +
            "</a>" +
            '<span class="' +
            statusBadgeClass(L.status) +
            '">' +
            escHtml(statusLabel(L.status)) +
            "</span>" +
            "</div>" +
            '<div class="dash-lrow__meta text-small text-muted">' +
            escHtml(L.listingNo || L.id) +
            " · " +
            escHtml(JetleMarket.formatPrice(L.price)) +
            " · " +
            escHtml(L.city || "—") +
            (L.district ? " / " + escHtml(L.district) : "") +
            " · " +
            escHtml(listingDateStr(L)) +
            "</div>" +
            '<div class="dash-lrow__flags text-small">' +
            (L.featured ? '<span class="dash-flag dash-flag--feat">Öne çıkan' + (L.featuredUntil ? " · " + escHtml(daysLeftText(L.featuredUntil)) : "") + "</span>" : "") +
            (L.showcase ? '<span class="dash-flag dash-flag--show">Vitrin' + (L.showcaseUntil ? " · " + escHtml(daysLeftText(L.showcaseUntil)) : "") + "</span>" : "") +
            (L.urgent ? '<span class="dash-flag dash-flag--urgent">ACİL</span>' : "") +
            (L.highlight ? '<span class="dash-flag dash-flag--highlight">Renkli vitrin</span>' : "") +
            (L.status === "rejected" && L.rejectionReason ? '<span class="dash-flag dash-flag--no">Red nedeni: ' + escHtml(L.rejectionReason) + "</span>" : "") +
            (!L.featured && !L.showcase && !L.urgent && !L.highlight ? '<span class="text-muted">Standart yayın</span>' : "") +
            "</div>" +
            "</div>" +
            "</div>" +
            '<div class="dash-lrow__actions"></div>';
          var act = row.querySelector(".dash-lrow__actions");
          function addBtn(label, cls, onClick, disabled, title) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "btn btn-secondary btn-sm" + (cls ? " " + cls : "");
            b.textContent = label;
            if (disabled) b.disabled = true;
            if (title) b.title = title;
            b.addEventListener("click", onClick);
            act.appendChild(b);
          }
          function addLink(label, href) {
            var a = document.createElement("a");
            a.className = "btn btn-secondary btn-sm";
            a.href = href;
            a.textContent = label;
            act.appendChild(a);
          }
          if (L.status === "draft") {
            addLink("Devam Et", "ilan-ver.html?edit=" + encodeURIComponent(L.id));
          } else if (L.status === "rejected") {
            addLink("Düzenle ve Tekrar Gönder", "ilan-ver.html?edit=" + encodeURIComponent(L.id));
          } else {
            addLink("Düzenle", "ilan-ver.html?edit=" + encodeURIComponent(L.id));
          }
          if (L.status === "pending" || L.status === "approved") {
            addBtn("Pasife Al", "", function () {
              if (!window.confirm("İlan pasife alınsın mı?")) return;
              var resPassive = updateOwnerStatus(L.id, "passive");
              if (!resPassive.ok) {
                window.alert(resPassive.message || "İşlem başarısız.");
                return;
              }
              renderMyListings();
              if (window.JetleMarket && JetleMarket.refreshAll) JetleMarket.refreshAll();
            });
          }
          if (L.status === "passive") {
            addBtn("Yeniden Yayınla", "", function () {
              if (!window.confirm("İlan yeniden incelemeye gönderilsin mi?")) return;
              var republished = typeof JetleAPI.republishListing === "function"
                ? JetleAPI.republishListing(L.id, user.id)
                : updateOwnerStatus(L.id, "pending");
              if (!republished || !republished.ok) {
                window.alert((republished && republished.message) || "Yeniden yayınlama başarısız.");
                return;
              }
              window.alert("İlanınız incelemeye alındı.");
              renderMyListings();
              if (window.JetleMarket && JetleMarket.refreshAll) JetleMarket.refreshAll();
            });
          }
          if (L.status === "draft" || L.status === "passive" || L.status === "rejected") {
            addBtn("Sil", "btn--danger-soft", function () {
              if (!window.confirm("İlan kalıcı olarak silinsin mi?")) return;
              var delRes = JetleAPI.deleteListing(L.id);
              if (delRes && delRes.ok === false) {
                window.alert(delRes.message || "Silinemedi.");
                return;
              }
              renderMyListings();
              if (window.JetleMarket && JetleMarket.refreshAll) JetleMarket.refreshAll();
            });
          }
          var canFeatured = JetleAPI.userCanFeatured(user.id);
          var canShowcase = JetleAPI.userCanShowcase(user.id);
          addBtn(
            L.featured ? "Öne çıkarıldı" : "Öne Çıkar",
            "",
            function () {
              if (L.status !== "approved") {
                window.alert("Öne çıkarma yalnızca yayındaki ilanlar için geçerlidir.");
                return;
              }
              if (!canFeatured) {
                if (window.confirm("Öne çıkarma için paket veya kredi gerekir. Paketler sekmesine geçilsin mi?")) {
                  setHashTab("packages");
                  applyHash();
                }
                return;
              }
              var resFeatured = activateDopingForListing(L.id, "featured");
              if (!resFeatured.ok) {
                window.alert(resFeatured.message || "Paket aktif edilemedi.");
                return;
              }
              window.alert("Paket aktif edildi.");
              renderMyListings();
              renderPackageSummary();
              if (window.JetleMarket && JetleMarket.refreshAll) JetleMarket.refreshAll();
            },
            L.featured,
            L.featured ? "Aktif" : !canFeatured ? "Kredi veya paket gerekir; tıklayınca paketlere yönlendirilebilirsiniz." : ""
          );
          addBtn(
            L.showcase ? "Vitrinde" : "Vitrine Al",
            "",
            function () {
              if (L.status !== "approved") {
                window.alert("Vitrin yalnızca yayındaki ilanlar için geçerlidir.");
                return;
              }
              if (!canShowcase) {
                if (window.confirm("Vitrin için paket, slot veya kredi gerekir. Paketler sekmesine geçilsin mi?")) {
                  setHashTab("packages");
                  applyHash();
                }
                return;
              }
              var resShowcase = activateDopingForListing(L.id, "showcase");
              if (!resShowcase.ok) {
                window.alert(resShowcase.message || "Paket aktif edilemedi.");
                return;
              }
              window.alert("Paket aktif edildi.");
              renderMyListings();
              renderPackageSummary();
              if (window.JetleMarket && JetleMarket.refreshAll) JetleMarket.refreshAll();
            },
            L.showcase,
            L.showcase ? "Aktif" : !canShowcase ? "Vitrin için hak gerekir; tıklayınca paketlere yönlendirilebilirsiniz." : ""
          );
          addBtn(
            L.urgent ? "ACİL" : "ACİL Yap",
            "",
            function () {
              if (L.status !== "approved") {
                window.alert("ACİL etiketi yalnızca yayındaki ilanlar için geçerlidir.");
                return;
              }
              if (!canFeatured) {
                if (window.confirm("ACİL için kredi veya paket gerekir. Paketler sekmesine geçilsin mi?")) {
                  setHashTab("packages");
                  applyHash();
                }
                return;
              }
              var resUrgent = activateDopingForListing(L.id, "urgent");
              if (!resUrgent.ok) {
                window.alert(resUrgent.message || "Paket aktif edilemedi.");
                return;
              }
              window.alert("Paket aktif edildi.");
              renderMyListings();
              if (window.JetleMarket && JetleMarket.refreshAll) JetleMarket.refreshAll();
            },
            L.urgent,
            L.urgent ? "Aktif" : !canFeatured ? "Kredi veya paket gerekir; tıklayınca paketlere yönlendirilebilirsiniz." : ""
          );
          wrap.appendChild(row);
        });
        mount.appendChild(wrap);
      }
      function renderFavorites() {
        var grid = d$("favGrid");
        if (!grid) return;
        grid.innerHTML = "";
        var rows = JetleAPI.getFavoriteListings(user.id).filter(function (L) {
          return L && L.status === "approved";
        });
        if (!rows.length) {
          grid.innerHTML =
            '<div class="dash-empty">' +
            '<p class="dash-empty__title">Favori ilanınız yok</p>' +
            '<p class="dash-empty__text text-small text-muted">İlan kartlarındaki yıldızdan favorilere ekleyebilirsiniz.</p>' +
            '<a class="btn btn-secondary btn-sm" href="index.html">İlanlara göz at</a>' +
            "</div>";
          return;
        }
        rows.forEach(function (L) {
          var imgUrl = L.coverImage || (L.images && L.images[0]) || "";
          var card = document.createElement("article");
          card.className = "dash-fav-card panel panel--flat";
          card.innerHTML =
            '<div class="dash-fav-card__media">' +
            (imgUrl ? '<img src="' + escHtml(imgUrl) + '" alt="" loading="lazy" />' : '<span class="dash-fav-card__noimg">Görsel yok</span>') +
            "</div>" +
            '<div class="dash-fav-card__body">' +
            '<a class="dash-fav-card__title" href="ilan-detay.html?id=' +
            encodeURIComponent(L.id) +
            '">' +
            escHtml(L.title) +
            "</a>" +
            '<p class="dash-fav-card__price">' +
            escHtml(JetleMarket.formatPrice(L.price)) +
            "</p>" +
            '<p class="text-small text-muted">' +
            escHtml(L.city || "") +
            (L.district ? " · " + escHtml(L.district) : "") +
            " · " +
            escHtml(L.subcategory || L.category || "") +
            "</p>" +
            '<div class="dash-fav-card__actions">' +
            '<a class="btn btn-primary btn-sm" href="ilan-detay.html?id=' +
            encodeURIComponent(L.id) +
            '">İlana git</a>' +
            "</div>" +
            "</div>";
          var btnRm = document.createElement("button");
          btnRm.type = "button";
          btnRm.className = "dash-fav-card__remove";
          btnRm.setAttribute("aria-label", "Favoriden çıkar");
          btnRm.textContent = "×";
          btnRm.addEventListener("click", function () {
            JetleAPI.removeFavorite(user.id, L.id);
            renderFavorites();
          });
          card.querySelector(".dash-fav-card__media").appendChild(btnRm);
          grid.appendChild(card);
        });
      }
      function renderThreads() {
        var mount = d$("dashThreads");
        if (!mount) return;
        mount.innerHTML = "";
        var items = JetleAPI.getConversations(user.id);
        if (!items.length) {
          selectedConversation = null;
          mount.innerHTML =
            '<div class="dash-empty dash-empty--compact">' +
            '<p class="dash-empty__title">Mesajınız yok</p>' +
            '<p class="dash-empty__text text-small text-muted">İlan detayından satıcıya yazarak konuşma başlatabilirsiniz.</p>' +
            "</div>";
          if (d$("dashChatHead")) d$("dashChatHead").textContent = "Konuşma seçin";
          if (d$("dashChatBody")) {
            d$("dashChatBody").innerHTML =
              '<div class="dash-empty dash-empty--compact"><p class="text-small text-muted">Sol listeden bir konuşma seçin.</p></div>';
          }
          return;
        }
        items.forEach(function (it) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "dash-thread" + (selectedConversation && selectedConversation.key === it.key ? " is-active" : "");
          b.innerHTML =
            '<span class="dash-thread__top">' +
            "<strong>" +
            escHtml(it.peerName) +
            "</strong>" +
            (it.unreadCount
              ? '<span class="dash-thread__badge">' + escHtml(String(it.unreadCount)) + "</span>"
              : "") +
            "</span>" +
            '<span class="dash-thread__listing">' +
            escHtml(it.listingTitle) +
            "</span>" +
            '<span class="dash-thread__preview text-small text-muted">' +
            escHtml(it.lastMessage) +
            "</span>" +
            '<span class="dash-thread__date text-small text-muted">' +
            escHtml(new Date(it.lastAt).toLocaleString("tr-TR")) +
            "</span>";
          b.addEventListener("click", function () {
            selectedConversation = it;
            JetleAPI.markConversationRead(user.id, it.listingId, it.peerId);
            renderThreads();
            renderChat();
          });
          mount.appendChild(b);
        });
        var still = selectedConversation && items.some(function (x) {
          return x.key === selectedConversation.key;
        });
        if (!still) selectedConversation = items[0];
        renderChat();
      }
      function renderChat() {
        var head = d$("dashChatHead");
        var body = d$("dashChatBody");
        if (!head || !body) return;
        if (!selectedConversation) {
          head.textContent = "Konuşma seçin";
          body.innerHTML =
            '<div class="dash-empty dash-empty--compact"><p class="text-small text-muted">Sol taraftan bir konuşma seçin.</p></div>';
          return;
        }
        head.textContent = selectedConversation.peerName + " · " + selectedConversation.listingTitle;
        var msgs = JetleAPI.getConversationMessages(user.id, selectedConversation.listingId, selectedConversation.peerId);
        body.innerHTML = "";
        if (!msgs.length) {
          body.innerHTML =
            '<div class="dash-empty dash-empty--compact"><p class="text-small text-muted">Bu konuşmada henüz mesaj yok.</p></div>';
          return;
        }
        msgs.forEach(function (m) {
          var item = document.createElement("div");
          item.className = "chat-msg" + (m.fromUserId === user.id ? " chat-msg--mine" : "");
          item.innerHTML = "<p>" + escHtml(m.message) + "</p><span>" + escHtml(new Date(m.createdAt).toLocaleString("tr-TR")) + "</span>";
          body.appendChild(item);
        });
        body.scrollTop = body.scrollHeight;
      }
      function loadProfile() {
        var full = JetleAuth.getFullUser();
        if (!full) return;
        d$("profName").value = full.name || "";
        var em = d$("profEmail");
        if (em) em.value = full.email || "";
        d$("profPhone").value = full.phone || "";
        d$("profCity").value = full.city || "";
        var dist = d$("profDistrict");
        if (dist) dist.value = full.district || "";
        var pt = d$("profProfileType");
        if (pt) pt.value = full.profileType === "Kurumsal" ? "Kurumsal" : "Bireysel";
        var rl = d$("profRoleLine");
        if (rl) {
          rl.value =
            full.role === "admin" ? "Yönetici" : full.role === "store" ? "Mağaza hesabı" : "Standart kullanıcı";
        }
      }
      function renderPackages() {
        renderPackageSummary();
        var listSel = d$("dopingListingSelect");
        var quickMsg = d$("dopingQuickMsg");
        function setQuickMsg(msg, ok) {
          if (!quickMsg) return;
          quickMsg.hidden = false;
          quickMsg.textContent = msg || "";
          quickMsg.className = "text-small " + (ok ? "dash-doping-msg dash-doping-msg--ok" : "dash-doping-msg dash-doping-msg--err");
        }
        function getSelectedListingId() {
          return listSel && listSel.value ? listSel.value : "";
        }
        function wireQuick(btnId, type) {
          var btn = d$(btnId);
          if (!btn) return;
          btn.onclick = function () {
            var listingId = getSelectedListingId();
            if (!listingId) {
              setQuickMsg("Önce bir ilan seçin.", false);
              return;
            }
            var res = activateDopingForListing(listingId, type);
            if (!res.ok) {
              setQuickMsg(res.message || "Paket aktif edilemedi.", false);
              return;
            }
            setQuickMsg("Paket aktif edildi.", true);
            renderMyListings();
            renderPackageSummary();
            renderPackages();
            if (window.JetleMarket && JetleMarket.refreshAll) JetleMarket.refreshAll();
          };
        }
        if (listSel) {
          var keep = listSel.value;
          listSel.innerHTML = '<option value="">İlan seçin</option>';
          JetleAPI.getListingsByUser(user.id)
            .filter(function (L) { return L.status === "approved"; })
            .forEach(function (L) {
              var o = document.createElement("option");
              o.value = L.id;
              o.textContent = (L.listingNo || L.id) + " · " + L.title;
              listSel.appendChild(o);
            });
          if (keep) listSel.value = keep;
        }
        wireQuick("btnDopingFeatured", "featured");
        wireQuick("btnDopingShowcase", "showcase");
        wireQuick("btnDopingUrgent", "urgent");
        wireQuick("btnDopingHighlight", "highlight");
        function gateDashDopingBtn(btnId, canFn) {
          var b = d$(btnId);
          if (!b) return;
          var ok = canFn();
          b.disabled = !ok;
          b.title = ok ? "" : "Yetersiz paket/kredi. Paketler sekmesinden satın alın.";
        }
        gateDashDopingBtn("btnDopingFeatured", function () {
          return JetleAPI.userCanFeatured(user.id);
        });
        gateDashDopingBtn("btnDopingShowcase", function () {
          return JetleAPI.userCanShowcase(user.id);
        });
        gateDashDopingBtn("btnDopingUrgent", function () {
          return JetleAPI.userCanFeatured(user.id);
        });
        gateDashDopingBtn("btnDopingHighlight", function () {
          return JetleAPI.userCanFeatured(user.id);
        });
        var mount = d$("packageGrid");
        if (!mount) return;
        renderPricingCatalogInto(mount, {
          userId: user.id,
          readOnly: false,
          onPurchased: function () {
            renderPackageSummary();
            renderMyListings();
          }
        });
      }
      document.querySelectorAll(".dash-tab").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var name = btn.getAttribute("data-tab");
          showTab(name);
          setHashTab(name);
        });
      });
      document.querySelectorAll(".listing-filter").forEach(function (b) {
        b.addEventListener("click", function () {
          listingFilterStatus = b.getAttribute("data-status") || "all";
          document.querySelectorAll(".listing-filter").forEach(function (x) {
            x.classList.toggle("is-active", x === b);
          });
          renderMyListings();
        });
      });
      var chatForm = d$("dashChatForm");
      if (chatForm) {
        chatForm.addEventListener("submit", function (e) {
          e.preventDefault();
          if (!selectedConversation) return;
          var input = d$("dashChatInput");
          var txt = String((input && input.value) || "").trim();
          if (!txt) return;
          JetleAPI.sendMessage({
            listingId: selectedConversation.listingId,
            fromUserId: user.id,
            toUserId: selectedConversation.peerId,
            message: txt
          });
          input.value = "";
          renderThreads();
        });
      }
      d$("profSave").addEventListener("click", function () {
        var res = JetleAuth.updateProfile({
          name: d$("profName").value,
          phone: d$("profPhone").value,
          city: d$("profCity").value,
          district: d$("profDistrict") ? d$("profDistrict").value : "",
          profileType: d$("profProfileType") ? d$("profProfileType").value : ""
        });
        var msg = d$("profMsg");
        msg.hidden = false;
        msg.textContent = res.ok ? "Profil güncellendi." : res.message;
        JetleAuth.renderHeaderBar();
      });
      var pwBtn = d$("profPwBtn");
      if (pwBtn) {
        pwBtn.addEventListener("click", function () {
          var cur = d$("profPwCurrent") ? d$("profPwCurrent").value : "";
          var n1 = d$("profPwNew") ? d$("profPwNew").value : "";
          var n2 = d$("profPwNew2") ? d$("profPwNew2").value : "";
          var pm = d$("profPwMsg");
          if (n1 !== n2) {
            pm.hidden = false;
            pm.textContent = "Yeni şifreler eşleşmiyor.";
            return;
          }
          var res = JetleAuth.changePassword(cur, n1);
          pm.hidden = false;
          pm.textContent = res.ok ? "Şifre güncellendi." : res.message;
          if (res.ok && d$("profPwCurrent")) d$("profPwCurrent").value = "";
          if (res.ok && d$("profPwNew")) d$("profPwNew").value = "";
          if (res.ok && d$("profPwNew2")) d$("profPwNew2").value = "";
        });
      }
      window.addEventListener("hashchange", applyHash);
      window.addEventListener("jetle-listings-changed", function () {
        renderMyListings();
        renderFavorites();
      });
      renderMyListings();
      renderFavorites();
      renderThreads();
      renderPackages();
      loadProfile();
      applyHash();
    }

    if (page === "seller" && window.JetleAPI && window.JetleAuth && window.JetleMarket) {
      var params = new URLSearchParams(window.location.search);
      var sellerId = params.get("id") || "";
      var seller = JetleAPI.getPublicUserProfile(sellerId);
      var listings = sellerId ? JetleAPI.getApprovedListingsByUser(sellerId) : [];
      var info = document.getElementById("sellerInfo");
      var grid = document.getElementById("sellerListingGrid");
      if (!seller) {
        if (info) info.innerHTML = '<div class="empty-panel">Satıcı bulunamadı.</div>';
      } else if (info) {
        var sellerBadge = seller.profileType === "Kurumsal" ? "Kurumsal Üye" : "Onaylı Kullanıcı";
        info.innerHTML =
          "<h1 class='page-title'>" + escHtml(seller.name) + "</h1>" +
          "<p><span class='detail-verified-badge'>" + escHtml(sellerBadge) + "</span></p>" +
          "<p class='text-small text-muted'>" + escHtml(seller.profileType) + " · " + escHtml(seller.city || "Şehir belirtilmemiş") + "</p>" +
          "<div class='seller-kv'><span>Üyelik:</span><strong>" + escHtml(new Date(seller.createdAt || Date.now()).toLocaleDateString("tr-TR")) + "</strong></div>" +
          "<div class='seller-kv'><span>Aktif ilan:</span><strong>" + escHtml(listings.length) + "</strong></div>";
      }
      if (grid) {
        grid.innerHTML = "";
        if (!listings.length) grid.innerHTML = '<div class="panel empty-panel">Satıcının yayında ilanı bulunmuyor.</div>';
        else listings.forEach(function (L) { grid.appendChild(JetleMarket.createListingCard(JetleAPI.toMarketCard(L))); });
      }
      var phoneBtn = document.getElementById("sellerPhoneBtn");
      var phoneText = document.getElementById("sellerPhoneText");
      var phoneShown = false;
      var sellerPhone = seller && seller.phone ? String(seller.phone) : "";
      var sellerPhoneDial = sellerPhone.replace(/\D+/g, "");
      if (phoneBtn && phoneText) {
        phoneBtn.addEventListener("click", function () {
          if (!sellerPhoneDial) {
            phoneText.hidden = false;
            phoneText.textContent = "Telefon bilgisi bulunamadı";
            phoneBtn.textContent = "Telefon bilgisi";
            return;
          }
          if (!phoneShown) {
            phoneShown = true;
            phoneText.hidden = false;
            phoneText.textContent = sellerPhone;
            phoneBtn.textContent = "Ara";
          } else {
            window.location.href = "tel:" + sellerPhoneDial;
          }
        });
      }
      var msgBtn = document.getElementById("sellerMsgBtn");
      if (msgBtn) {
        msgBtn.addEventListener("click", function () {
          var u = JetleAuth.getCurrentUser();
          if (!u) {
            window.location.href = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search);
            return;
          }
          window.location.href = "dashboard.html#messages";
        });
      }
      var shareBtn = document.getElementById("sellerShareBtn");
      if (shareBtn) {
        shareBtn.addEventListener("click", function () {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(location.href);
          window.alert("Satıcı bağlantısı kopyalandı.");
        });
      }
    }

    if (page === "admin" && window.JetleAPI && window.JetleAuth && window.JetleMarket) {
      var adminState = {
        listing: { q: "", status: "all", category: "all", subcategory: "all", city: "all", user: "", featured: "all", date: "all" },
        users: { q: "", role: "all", status: "all" },
        complaints: { q: "", status: "all" }
      };
      function aid(id) { return document.getElementById(id); }
      function s(x) { return String(x || "").toLowerCase(); }
      function usersRaw() {
        var list = JSON.parse(localStorage.getItem(JetleAuth.KEYS.USERS) || "[]");
        list.forEach(function (u) {
          if (!u.status) u.status = u.active === false ? "passive" : "active";
          if (!u.role) u.role = "user";
        });
        return list;
      }
      function saveUsersRaw(list) { localStorage.setItem(JetleAuth.KEYS.USERS, JSON.stringify(list)); }
      function badge(status) {
        var c = "status-badge status-badge--wait";
        if (status === "approved" || status === "active" || status === "featured") c = "status-badge status-badge--ok";
        if (status === "rejected" || status === "blocked" || status === "dismissed") c = "status-badge status-badge--no";
        if (status === "passive" || status === "closed" || status === "resolved") c = "status-badge status-badge--off";
        return '<span class="' + c + '">' + status + "</span>";
      }
      function rCell(vals) {
        var tr = document.createElement("tr");
        vals.forEach(function (v) {
          var td = document.createElement("td");
          if (v && v.nodeType) td.appendChild(v);
          else td.innerHTML = escHtml(v == null ? "" : String(v));
          tr.appendChild(td);
        });
        return tr;
      }
      function showSection(id) {
        document.querySelectorAll(".admin-nav-item").forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-section") === id);
        });
        document.querySelectorAll(".admin-section").forEach(function (sec) {
          sec.hidden = sec.id !== "sec-" + id;
        });
      }
      function panelRefresh() {
        renderStats();
        renderRecentListings();
        renderRecentComplaints();
        renderListings();
        renderUsers();
        renderComplaints();
        renderAds();
        renderCampaignAds();
        renderFeatured();
        renderCategories();
        renderAdminPricing();
      }
      function listingDateMatch(L, preset) {
        if (preset === "all") return true;
        var t = new Date(L.createdAt).getTime();
        var day = 86400000;
        var diff = Date.now() - t;
        if (preset === "day") return diff <= day;
        if (preset === "3days") return diff <= 3 * day;
        if (preset === "week") return diff <= 7 * day;
        if (preset === "month") return diff <= 30 * day;
        return true;
      }
      function renderStats() {
        var root = aid("adminStats");
        if (!root) return;
        root.innerHTML = "";
        var listings = JetleAPI.getAllListings();
        var users = usersRaw();
        var complaints = JetleAPI.getComplaints();
        var ads = JetleAPI.getAds();
        [
          ["Toplam ilan", listings.length],
          ["Bekleyen ilan", listings.filter(function (x) { return x.status === "pending"; }).length],
          ["Yayındaki ilan", listings.filter(function (x) { return x.status === "approved"; }).length],
          ["Pasif ilan", listings.filter(function (x) { return x.status === "passive"; }).length],
          ["Toplam kullanıcı", users.length],
          ["Şikayet sayısı", complaints.length],
          ["Premium / vitrin ilan", listings.filter(function (x) { return !!x.featured || !!x.showcase || !!x.sponsored; }).length],
          ["Aktif reklam", ads.filter(function (x) { return !!x.active; }).length]
        ].forEach(function (it) {
          var el = document.createElement("div");
          el.className = "stat-card panel";
          el.innerHTML = '<span class="stat-label">' + escHtml(it[0]) + '</span><strong class="stat-value">' + escHtml(it[1]) + "</strong>";
          root.appendChild(el);
        });
      }
      function renderRecentListings() {
        var root = aid("adminRecentListings");
        if (!root) return;
        root.innerHTML = "";
        var tb = document.createElement("table");
        tb.className = "data-table";
        tb.innerHTML = "<thead><tr><th>İlan No</th><th>Başlık</th><th>Durum</th><th>Tarih</th></tr></thead>";
        var body = document.createElement("tbody");
        JetleAPI.getAllListings().slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }).slice(0, 8).forEach(function (L) {
          body.appendChild(rCell([L.listingNo, L.title, badge(L.status), new Date(L.createdAt).toLocaleString("tr-TR")]));
        });
        tb.appendChild(body);
        root.appendChild(tb);
      }
      function renderRecentComplaints() {
        var root = aid("adminRecentComplaints");
        if (!root) return;
        root.innerHTML = "";
        var tb = document.createElement("table");
        tb.className = "data-table";
        tb.innerHTML = "<thead><tr><th>İlan</th><th>Neden</th><th>Durum</th><th>Tarih</th></tr></thead>";
        var body = document.createElement("tbody");
        JetleAPI.getComplaints().slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }).slice(0, 6).forEach(function (c) {
          body.appendChild(rCell([c.listingId, c.reason, badge(c.status), new Date(c.createdAt).toLocaleString("tr-TR")]));
        });
        tb.appendChild(body);
        root.appendChild(tb);
      }
      function openDrawer(L) {
        var drawer = aid("adminDetailDrawer");
        var body = aid("adminDrawerBody");
        if (!drawer || !body) return;
        var specs = L.specs || {};
        var specRows = Object.keys(specs).slice(0, 20).map(function (k) { return "<tr><th>" + escHtml(k) + "</th><td>" + escHtml(specs[k]) + "</td></tr>"; }).join("");
        var pkgOpts = ["basic", "baslangic", "standart", "pro", "kurumsal_plus", "featured", "showcase", "store"];
        var pkgSel = pkgOpts
          .map(function (v) {
            return "<option value=\"" + escHtml(v) + "\"" + (String(L.packageType || "basic") === v ? " selected" : "") + ">" + escHtml(v) + "</option>";
          })
          .join("");
        body.innerHTML =
          "<h4>" + escHtml(L.title) + "</h4>" +
          "<p class='text-small text-muted'>" + escHtml(L.category) + " › " + escHtml(L.subcategory) + " · " + escHtml(L.city) + "/" + escHtml(L.district || "") + "</p>" +
          "<p><strong>" + escHtml(new Intl.NumberFormat("tr-TR").format(L.price) + " ₺") + "</strong></p>" +
          "<p class='text-small'>" + escHtml(L.description || "") + "</p>" +
          "<div class='admin-drawer__imgs'>" + (L.images || []).slice(0, 3).map(function (u) { return "<img src='" + String(u).replace(/"/g, "") + "' alt='ilan görseli'>"; }).join("") + "</div>" +
          "<table class='data-table data-table--specs'><tbody>" + specRows + "</tbody></table>" +
          "<div class='admin-prem panel'>" +
          "<h5 class=\"admin-prem__h\">Premium alanları</h5>" +
          "<p class=\"text-small text-muted\">featured / showcase / sponsored ve paket etiketi. Kayıt anında liste güncellenir.</p>" +
          "<div class=\"admin-prem__row\">" +
          "<label class=\"admin-prem__chk\"><input type=\"checkbox\" id=\"adminPremFeat\"" + (L.featured ? " checked" : "") + "> featured</label>" +
          "<label class=\"admin-prem__chk\"><input type=\"checkbox\" id=\"adminPremShow\"" + (L.showcase ? " checked" : "") + "> showcase</label>" +
          "<label class=\"admin-prem__chk\"><input type=\"checkbox\" id=\"adminPremSpon\"" + (L.sponsored ? " checked" : "") + "> sponsored</label>" +
          "</div>" +
          "<div class=\"field\"><label for=\"adminPremPkg\">packageType</label><select id=\"adminPremPkg\">" + pkgSel + "</select></div>" +
          "<button type=\"button\" class=\"btn btn-primary btn-sm\" id=\"adminPremSave\">Kaydet</button>" +
          "</div>";
        var saveBtn = aid("adminPremSave");
        if (saveBtn) {
          saveBtn.onclick = function () {
            JetleAPI.updateListingFields(L.id, {
              featured: !!aid("adminPremFeat").checked,
              showcase: !!aid("adminPremShow").checked,
              sponsored: !!aid("adminPremSpon").checked,
              packageType: aid("adminPremPkg").value || "basic"
            });
            panelRefresh();
            drawer.hidden = true;
          };
        }
        drawer.hidden = false;
      }
      function renderAdminPricing() {
        var root = aid("adminPricingCatalog");
        if (!root) return;
        renderPricingCatalogInto(root, { userId: null, readOnly: true });
      }
      function renderListings() {
        var root = aid("adminListingsTable");
        if (!root) return;
        root.innerHTML = "";
        var uList = usersRaw();
        var um = {};
        uList.forEach(function (u) { um[u.id] = u; });
        var rows = JetleAPI.getAllListings().filter(function (L) {
          if (adminState.listing.status !== "all" && L.status !== adminState.listing.status) return false;
          if (adminState.listing.category !== "all" && L.category !== adminState.listing.category) return false;
          if (adminState.listing.subcategory !== "all" && L.subcategory !== adminState.listing.subcategory) return false;
          if (adminState.listing.city !== "all" && L.city !== adminState.listing.city) return false;
          var anyPremium = !!L.featured || !!L.showcase || !!L.sponsored;
          if (adminState.listing.featured === "yes" && !anyPremium) return false;
          if (adminState.listing.featured === "no" && anyPremium) return false;
          if (!listingDateMatch(L, adminState.listing.date)) return false;
          var uname = (um[L.createdBy] && um[L.createdBy].name) || L.sellerName || "";
          if (adminState.listing.user && s(uname).indexOf(s(adminState.listing.user)) === -1) return false;
          var q = s(adminState.listing.q);
          if (q) {
            var blob = s((L.title || "") + " " + (L.listingNo || "") + " " + uname);
            if (blob.indexOf(q) === -1) return false;
          }
          return true;
        }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        var tb = document.createElement("table");
        tb.className = "data-table";
        tb.innerHTML = "<thead><tr><th>İlan No</th><th>Başlık</th><th>Kategori</th><th>Şehir</th><th>Kullanıcı</th><th>Tarih</th><th>Durum</th><th>featured</th><th>showcase</th><th>sponsored</th><th>packageType</th><th>Aksiyonlar</th></tr></thead>";
        var body = document.createElement("tbody");
        rows.forEach(function (L) {
          var uname = (um[L.createdBy] && um[L.createdBy].name) || L.sellerName || "—";
          var actions = document.createElement("td");
          actions.className = "table-actions";
          function ab(lbl, fn) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "btn btn-secondary btn-sm";
            b.textContent = lbl;
            b.addEventListener("click", fn);
            actions.appendChild(b);
          }
          ab("Onayla", function () { JetleAPI.updateListingStatus(L.id, "approved"); panelRefresh(); });
          ab("Reddet", function () { JetleAPI.updateListingStatus(L.id, "rejected"); panelRefresh(); });
          ab("Pasife Al", function () { JetleAPI.updateListingStatus(L.id, "passive"); panelRefresh(); });
          ab("Detayı Gör", function () { openDrawer(L); });
          ab(L.featured ? "Öne çıkarma kapat" : "Öne çıkar", function () { JetleAPI.updateListingFields(L.id, { featured: !L.featured, packageType: !L.featured ? "featured" : (L.packageType || "basic") }); panelRefresh(); });
          ab(L.showcase ? "Vitrinden çıkar" : "Vitrine al", function () { JetleAPI.updateListingFields(L.id, { showcase: !L.showcase, packageType: !L.showcase ? "showcase" : (L.packageType || "basic") }); panelRefresh(); });
          ab(L.sponsored ? "Sponsor kaldır" : "Sponsorlu yap", function () { JetleAPI.updateListingFields(L.id, { sponsored: !L.sponsored, packageType: !L.sponsored ? "store" : (L.packageType || "basic") }); panelRefresh(); });
          ab("Paket değiştir", function () {
            var next = L.packageType === "basic" ? "featured" : L.packageType === "featured" ? "showcase" : L.packageType === "showcase" ? "store" : "basic";
            JetleAPI.updateListingFields(L.id, { packageType: next });
            panelRefresh();
          });
          body.appendChild(rCell([
            L.listingNo || "—",
            L.title,
            L.category + " › " + L.subcategory,
            L.city,
            uname,
            new Date(L.createdAt).toLocaleDateString("tr-TR"),
            badge(L.status),
            badge(L.featured ? "yes" : "no"),
            badge(L.showcase ? "yes" : "no"),
            badge(L.sponsored ? "yes" : "no"),
            L.packageType || "basic",
            actions
          ]));
        });
        tb.appendChild(body);
        root.appendChild(tb);
      }
      function renderUsers() {
        var root = aid("adminUsersTable");
        if (!root) return;
        root.innerHTML = "";
        var listings = JetleAPI.getAllListings();
        var rows = usersRaw().filter(function (u) {
          if (adminState.users.role !== "all" && u.role !== adminState.users.role) return false;
          if (adminState.users.status !== "all" && (u.status || "active") !== adminState.users.status) return false;
          var q = s(adminState.users.q);
          if (!q) return true;
          return s((u.name || "") + " " + (u.email || "")).indexOf(q) !== -1;
        });
        var tb = document.createElement("table");
        tb.className = "data-table";
        tb.innerHTML = "<thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Şehir</th><th>Rol</th><th>Durum</th><th>Toplam ilan</th><th>Kayıt tarihi</th><th>Aksiyonlar</th></tr></thead>";
        var body = document.createElement("tbody");
        rows.forEach(function (u) {
          var act = document.createElement("td");
          act.className = "table-actions";
          function ub(lbl, fn) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "btn btn-secondary btn-sm";
            b.textContent = lbl;
            b.addEventListener("click", fn);
            act.appendChild(b);
          }
          ub("Aktif et", function () { u.status = "active"; u.active = true; saveUsersRaw(usersRaw().map(function (x) { return x.id === u.id ? u : x; })); panelRefresh(); });
          ub("Pasife al", function () { u.status = "passive"; u.active = false; saveUsersRaw(usersRaw().map(function (x) { return x.id === u.id ? u : x; })); panelRefresh(); });
          ub("Rol değiştir", function () {
            u.role = u.role === "user" ? "store" : u.role === "store" ? "admin" : "user";
            saveUsersRaw(usersRaw().map(function (x) { return x.id === u.id ? u : x; }));
            panelRefresh();
          });
          ub("Detay gör", function () { alert((u.name || "") + " / " + (u.email || "")); });
          var count = listings.filter(function (L) { return L.createdBy === u.id; }).length;
          body.appendChild(rCell([u.name || "—", u.email || "—", u.city || "—", u.role || "user", badge(u.status || "active"), String(count), new Date(u.createdAt || Date.now()).toLocaleDateString("tr-TR"), act]));
        });
        tb.appendChild(body);
        root.appendChild(tb);
      }
      function renderComplaints() {
        var root = aid("adminComplaintsTable");
        if (!root) return;
        root.innerHTML = "";
        var rows = JetleAPI.getComplaints().filter(function (c) {
          if (adminState.complaints.status !== "all" && c.status !== adminState.complaints.status) return false;
          var q = s(adminState.complaints.q);
          if (!q) return true;
          return s((c.listingTitle || "") + " " + c.listingId + " " + (c.reason || "") + " " + (c.message || "") + " " + (c.reporterType || "")).indexOf(q) !== -1;
        });
        var tb = document.createElement("table");
        tb.className = "data-table";
        tb.innerHTML = "<thead><tr><th>İlan başlığı</th><th>Neden</th><th>Açıklama</th><th>Bildiren tipi</th><th>Tarih</th><th>Durum</th><th>Aksiyonlar</th></tr></thead>";
        var body = document.createElement("tbody");
        rows.forEach(function (c) {
          var act = document.createElement("td");
          act.className = "table-actions";
          function cb(lbl, fn) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "btn btn-secondary btn-sm";
            b.textContent = lbl;
            b.addEventListener("click", fn);
            act.appendChild(b);
          }
          cb("İncelemede", function () { JetleAPI.updateComplaintStatus(c.id, "reviewing"); panelRefresh(); });
          cb("Çözüldü", function () { JetleAPI.updateComplaintStatus(c.id, "resolved"); panelRefresh(); });
          cb("Reddedildi", function () { JetleAPI.updateComplaintStatus(c.id, "dismissed"); panelRefresh(); });
          cb("İlanı pasife al", function () { JetleAPI.updateListingStatus(c.listingId, "passive"); JetleAPI.updateComplaintStatus(c.id, "reviewing"); panelRefresh(); });
          cb("İlanı gör", function () { window.location.href = "ilan-detay.html?id=" + encodeURIComponent(c.listingId); });
          body.appendChild(
            rCell([
              c.listingTitle || c.listingId,
              c.reason || "Diğer",
              c.message ? String(c.message).slice(0, 90) : "—",
              c.reporterType || "guest",
              new Date(c.createdAt).toLocaleString("tr-TR"),
              badge(c.status),
              act
            ])
          );
        });
        tb.appendChild(body);
        root.appendChild(tb);
      }
      function renderAds() {
        var root = aid("adminAdsList");
        if (!root) return;
        root.innerHTML = "";
        JetleAPI.getAds().forEach(function (ad) {
          var row = document.createElement("div");
          row.className = "panel ad-row";
          row.innerHTML =
            "<strong>" + escHtml(ad.title) + "</strong>" +
            "<span class='text-small text-muted'>Slot: " + escHtml(ad.slot) + " · Durum: " + escHtml(ad.active ? "Aktif" : "Pasif") + "</span>" +
            "<span class='text-small text-muted'>Başlangıç / Bitiş: 2026-04-01 - 2026-12-31</span>";
          var act = document.createElement("div");
          act.className = "table-actions";
          var b = document.createElement("button");
          b.type = "button";
          b.className = "btn btn-secondary btn-sm";
          b.textContent = ad.active ? "Pasife Al" : "Aktif Et";
          b.addEventListener("click", function () { JetleAPI.toggleAd(ad.id); panelRefresh(); });
          act.appendChild(b);
          row.appendChild(act);
          root.appendChild(row);
        });
      }
      function isoToLocalInput(iso) {
        if (!iso) return "";
        var d = new Date(iso);
        if (!isFinite(d.getTime())) return "";
        var pad = function (n) {
          return String(n).padStart(2, "0");
        };
        return (
          d.getFullYear() +
          "-" +
          pad(d.getMonth() + 1) +
          "-" +
          pad(d.getDate()) +
          "T" +
          pad(d.getHours()) +
          ":" +
          pad(d.getMinutes())
        );
      }
      function localInputToIso(val) {
        if (!val) return null;
        var d = new Date(val);
        return isFinite(d.getTime()) ? d.toISOString() : null;
      }
      function renderCampaignAds() {
        var root = aid("adminCampaignAdsTable");
        if (!root) return;
        root.innerHTML = "";
        if (!JetleAPI.backendEnabled()) {
          root.innerHTML = "<p class=\"text-muted text-small\">Kampanya reklamları yalnızca backend API açıkken yönetilir.</p>";
          return;
        }
        var res = JetleAPI.adminListCampaignAds();
        var rows = res.ok ? res.data : [];
        if (!res.ok) {
          root.innerHTML = "<p class=\"text-muted text-small\">" + escHtml(res.message || "Liste alınamadı.") + "</p>";
          return;
        }
        var tb = document.createElement("table");
        tb.className = "data-table";
        tb.innerHTML =
          "<thead><tr><th>Başlık</th><th>Yerleşim</th><th>Sıra</th><th>Aktif</th><th>Başlangıç</th><th>Bitiş</th><th>İşlem</th></tr></thead>";
        var body = document.createElement("tbody");
        rows.forEach(function (r) {
          var act = document.createElement("td");
          act.className = "table-actions";
          function mk(lbl, fn) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "btn btn-secondary btn-sm";
            b.textContent = lbl;
            b.addEventListener("click", fn);
            act.appendChild(b);
          }
          mk("Düzenle", function () {
            aid("adminCampEditId").value = r.id;
            aid("adminCampTitle").value = r.title || "";
            aid("adminCampSubtitle").value = r.subtitle || "";
            aid("adminCampDesc").value = r.description || "";
            aid("adminCampImg").value = r.imageUrl || "";
            aid("adminCampMobImg").value = r.mobileImageUrl || "";
            aid("adminCampCta").value = r.ctaText || "İncele";
            aid("adminCampUrl").value = r.targetUrl || "";
            aid("adminCampPlacement").value = r.placementType || "hero";
            aid("adminCampOrder").value = String(r.order != null ? r.order : 0);
            aid("adminCampStart").value = isoToLocalInput(r.startDate);
            aid("adminCampEnd").value = isoToLocalInput(r.endDate);
            aid("adminCampSponsor").value = r.sponsorLabel || "Sponsorlu";
            aid("adminCampTone").value = r.backgroundTone || "neutral";
            aid("adminCampActive").checked = !!r.isActive;
            showSection("ads-campaign");
          });
          mk("Aç/Kapat", function () {
            JetleAPI.adminToggleCampaignAd(r.id);
            panelRefresh();
          });
          mk("Sil", function () {
            if (!window.confirm("Bu reklam silinsin mi?")) return;
            JetleAPI.adminDeleteCampaignAd(r.id);
            panelRefresh();
          });
          body.appendChild(
            rCell([
              r.title,
              r.placementType,
              String(r.order != null ? r.order : 0),
              r.isActive ? "evet" : "hayır",
              r.startDate ? new Date(r.startDate).toLocaleString("tr-TR") : "—",
              r.endDate ? new Date(r.endDate).toLocaleString("tr-TR") : "—",
              act
            ])
          );
        });
        tb.appendChild(body);
        root.appendChild(tb);
      }
      function renderFeatured() {
        var root = aid("adminFeaturedTable");
        if (!root) return;
        root.innerHTML = "";
        var rows = JetleAPI.getAllListings().filter(function (L) { return !!L.featured || !!L.showcase || !!L.sponsored; });
        var tb = document.createElement("table");
        tb.className = "data-table";
        tb.innerHTML = "<thead><tr><th>İlan No</th><th>Başlık</th><th>featured</th><th>showcase</th><th>sponsored</th><th>Paket</th><th>Aksiyon</th></tr></thead>";
        var body = document.createElement("tbody");
        rows.forEach(function (L) {
          var act = document.createElement("td");
          var b = document.createElement("button");
          b.type = "button";
          b.className = "btn btn-secondary btn-sm";
          b.textContent = "Sıfırla";
          b.addEventListener("click", function () { JetleAPI.updateListingFields(L.id, { featured: false, showcase: false, sponsored: false, packageType: "basic" }); panelRefresh(); });
          act.appendChild(b);
          body.appendChild(rCell([L.listingNo, L.title, badge(L.featured ? "yes" : "no"), badge(L.showcase ? "yes" : "no"), badge(L.sponsored ? "yes" : "no"), L.packageType || "basic", act]));
        });
        tb.appendChild(body);
        root.appendChild(tb);
      }
      function renderCategories() {
        var root = aid("adminCategoryTree");
        if (!root) return;
        root.innerHTML = "";
        var ul = document.createElement("ul");
        ul.className = "cat-readonly-list";
        JetleMarket.CATEGORY_TREE.forEach(function (cat) {
          var li = document.createElement("li");
          li.innerHTML = "<strong>" + escHtml(cat.name) + "</strong>";
          var sub = document.createElement("ul");
          cat.children.forEach(function (ch) {
            var cli = document.createElement("li");
            cli.textContent = cat.name.toLowerCase() + " > " + ch.name.toLowerCase();
            var act = document.createElement("span");
            act.className = "table-actions";
            ["Alt kategori ekle", "Pasife al", "Yeniden adlandır"].forEach(function (label) {
              var b = document.createElement("button");
              b.type = "button";
              b.className = "btn btn-secondary btn-sm";
              b.textContent = label;
              b.addEventListener("click", function () { alert(label + " (dummy)"); });
              act.appendChild(b);
            });
            cli.appendChild(act);
            sub.appendChild(cli);
          });
          li.appendChild(sub);
          ul.appendChild(li);
        });
        root.appendChild(ul);
      }
      function populateListingFilters() {
        var rows = JetleAPI.getAllListings();
        function fill(id, list) {
          var el = aid(id);
          if (!el) return;
          var keep = el.value || "all";
          el.innerHTML = '<option value="all">Tümü</option>';
          list.forEach(function (it) {
            var o = document.createElement("option");
            o.value = it;
            o.textContent = it;
            el.appendChild(o);
          });
          el.value = list.indexOf(keep) !== -1 ? keep : "all";
        }
        fill("adminListingCategory", Array.from(new Set(rows.map(function (x) { return x.category; }))).sort());
        fill("adminListingSubcategory", Array.from(new Set(rows.map(function (x) { return x.subcategory; }))).sort());
        fill("adminListingCity", Array.from(new Set(rows.map(function (x) { return x.city; }))).sort());
      }

      var adminUser = JetleAuth.requireAdmin();
      if (!adminUser) return;
      var adminIdentity = aid("adminIdentity");
      if (adminIdentity) adminIdentity.textContent = "Admin: " + adminUser.name;
      populateListingFilters();
      document.querySelectorAll(".admin-nav-item").forEach(function (btn) {
        btn.addEventListener("click", function () { showSection(btn.getAttribute("data-section")); });
      });
      aid("adminDrawerClose").addEventListener("click", function () { aid("adminDetailDrawer").hidden = true; });
      aid("adminListingApply").addEventListener("click", function () {
        adminState.listing.q = aid("adminListingSearch").value || "";
        adminState.listing.status = aid("adminListingFilter").value || "all";
        adminState.listing.category = aid("adminListingCategory").value || "all";
        adminState.listing.subcategory = aid("adminListingSubcategory").value || "all";
        adminState.listing.city = aid("adminListingCity").value || "all";
        adminState.listing.user = aid("adminListingUser").value || "";
        adminState.listing.featured = aid("adminListingFeatured").value || "all";
        adminState.listing.date = aid("adminListingDate").value || "all";
        renderListings();
      });
      aid("adminListingReset").addEventListener("click", function () {
        adminState.listing = { q: "", status: "all", category: "all", subcategory: "all", city: "all", user: "", featured: "all", date: "all" };
        ["adminListingSearch", "adminListingUser"].forEach(function (id) { aid(id).value = ""; });
        ["adminListingFilter", "adminListingCategory", "adminListingSubcategory", "adminListingCity", "adminListingFeatured", "adminListingDate"].forEach(function (id) { aid(id).value = "all"; });
        renderListings();
      });
      aid("adminUserApply").addEventListener("click", function () {
        adminState.users.q = aid("adminUserSearch").value || "";
        adminState.users.role = aid("adminUserRole").value || "all";
        adminState.users.status = aid("adminUserStatus").value || "all";
        renderUsers();
      });
      aid("adminUserReset").addEventListener("click", function () {
        adminState.users = { q: "", role: "all", status: "all" };
        aid("adminUserSearch").value = "";
        aid("adminUserRole").value = "all";
        aid("adminUserStatus").value = "all";
        renderUsers();
      });
      aid("adminComplaintStatus").addEventListener("change", function () {
        adminState.complaints.status = aid("adminComplaintStatus").value || "all";
        renderComplaints();
      });
      aid("adminComplaintSearch").addEventListener("input", function () {
        adminState.complaints.q = aid("adminComplaintSearch").value || "";
        renderComplaints();
      });
      if (aid("adminCampNew")) {
        aid("adminCampNew").addEventListener("click", function () {
          aid("adminCampEditId").value = "";
          ["adminCampTitle", "adminCampSubtitle", "adminCampDesc", "adminCampImg", "adminCampMobImg"].forEach(function (id) {
            aid(id).value = "";
          });
          aid("adminCampCta").value = "İncele";
          aid("adminCampUrl").value = "";
          aid("adminCampPlacement").value = "hero";
          aid("adminCampOrder").value = "0";
          aid("adminCampStart").value = "";
          aid("adminCampEnd").value = "";
          aid("adminCampSponsor").value = "Sponsorlu";
          aid("adminCampTone").value = "neutral";
          aid("adminCampActive").checked = true;
        });
      }
      if (aid("adminCampSave")) {
        aid("adminCampSave").addEventListener("click", function () {
          var body = {
            title: aid("adminCampTitle").value.trim(),
            subtitle: aid("adminCampSubtitle").value.trim(),
            description: aid("adminCampDesc").value.trim(),
            imageUrl: aid("adminCampImg").value.trim(),
            mobileImageUrl: aid("adminCampMobImg").value.trim(),
            ctaText: aid("adminCampCta").value.trim() || "İncele",
            targetUrl: aid("adminCampUrl").value.trim(),
            placementType: aid("adminCampPlacement").value,
            order: Number(aid("adminCampOrder").value) || 0,
            startDate: localInputToIso(aid("adminCampStart").value),
            endDate: localInputToIso(aid("adminCampEnd").value),
            sponsorLabel: aid("adminCampSponsor").value.trim() || "Sponsorlu",
            backgroundTone: aid("adminCampTone").value,
            isActive: !!aid("adminCampActive").checked
          };
          var editId = aid("adminCampEditId").value.trim();
          var res = editId ? JetleAPI.adminUpdateCampaignAd(editId, body) : JetleAPI.adminCreateCampaignAd(body);
          if (!res.ok) {
            window.alert(res.message || "İşlem başarısız.");
            return;
          }
          window.alert(editId ? "Güncellendi." : "Oluşturuldu.");
          aid("adminCampEditId").value = "";
          panelRefresh();
        });
      }
      panelRefresh();
    }

    if (page === "paketler" && window.JetleAPI) {
      var pm = document.getElementById("pricingPublicMount");
      if (pm) {
        var usr = window.JetleAuth && typeof JetleAuth.getCurrentUser === "function" ? JetleAuth.getCurrentUser() : null;
        renderPricingCatalogInto(pm, { userId: usr ? usr.id : null, readOnly: false });
      }
    }
  });
})();
