/**
 * JETLE v2 — kullanıcı paneli (ilanlarım / favoriler / profil)
 */
(function () {
  "use strict";

  var listingFilterStatus = "all";

  function $(id) {
    return document.getElementById(id);
  }

  function showTab(name) {
    document.querySelectorAll(".dash-tab").forEach(function (t) {
      t.classList.toggle("is-active", t.getAttribute("data-tab") === name);
    });
    document.querySelectorAll(".dash-panel").forEach(function (p) {
      p.hidden = p.getAttribute("data-panel") !== name;
    });
  }

  function applyHash() {
    var h = (location.hash || "").replace("#", "");
    var map = {
      listings: "listings",
      favorites: "favorites",
      messages: "messages",
      packages: "packages",
      profile: "profile"
    };
    if (map[h]) showTab(map[h]);
  }

  function statusBadgeClass(s) {
    if (s === "approved") return "status-badge status-badge--ok";
    if (s === "pending") return "status-badge status-badge--wait";
    if (s === "rejected") return "status-badge status-badge--no";
    if (s === "passive") return "status-badge status-badge--off";
    return "status-badge";
  }

  function statusLabel(s) {
    if (s === "approved") return "Yayında";
    if (s === "pending") return "Onay bekliyor";
    if (s === "rejected") return "Reddedildi";
    if (s === "passive") return "Pasif";
    return s;
  }

  function renderMyListings(user) {
    var mount = $("myListingsMount");
    if (!mount) return;
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    var rows = JetleAPI.getListingsByUser(user.id).filter(function (L) {
      if (listingFilterStatus === "all") return true;
      return L.status === listingFilterStatus;
    });
    if (!rows.length) {
      var empty = document.createElement("p");
      empty.className = "text-muted";
      empty.textContent = "Bu filtrede ilan yok.";
      mount.appendChild(empty);
      return;
    }
    rows.forEach(function (L) {
      var card = document.createElement("article");
      card.className = "dash-listing-card panel";

      var head = document.createElement("div");
      head.className = "dash-listing-card__head";
      var title = document.createElement("a");
      title.href = "ilan-detay.html?id=" + encodeURIComponent(L.id);
      title.className = "dash-listing-card__title";
      title.textContent = L.title;
      var badge = document.createElement("span");
      badge.className = statusBadgeClass(L.status);
      badge.textContent = statusLabel(L.status);
      head.appendChild(title);
      head.appendChild(badge);
      card.appendChild(head);

      var meta = document.createElement("p");
      meta.className = "text-small text-muted";
      meta.textContent =
        (L.listingNo || L.id) + " · " + JetleMarket.formatPrice(L.price) + " · " + L.city + " / " + L.district;
      card.appendChild(meta);

      var actions = document.createElement("div");
      actions.className = "dash-listing-card__actions";

      var aDet = document.createElement("a");
      aDet.href = "ilan-detay.html?id=" + encodeURIComponent(L.id);
      aDet.className = "btn btn-secondary btn-sm";
      aDet.textContent = "Detay";
      actions.appendChild(aDet);

      var bDel = document.createElement("button");
      bDel.type = "button";
      bDel.className = "btn btn-secondary btn-sm";
      bDel.textContent = "Sil";
      bDel.addEventListener("click", function () {
        if (!window.confirm("İlanı kalıcı olarak silmek istiyor musunuz?")) return;
        JetleAPI.deleteListing(L.id);
        renderMyListings(user);
      });
      actions.appendChild(bDel);

      var bEd = document.createElement("button");
      bEd.type = "button";
      bEd.className = "btn btn-secondary btn-sm";
      bEd.textContent = "Düzenle";
      bEd.disabled = true;
      bEd.title = "Düzenleme yakında";
      actions.appendChild(bEd);

      card.appendChild(actions);
      mount.appendChild(card);
    });
  }

  function renderFavorites(user) {
    var grid = $("favGrid");
    if (!grid) return;
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    var raw = localStorage.getItem(JetleAPI.KEYS.FAVORITES);
    var ids = [];
    try {
      ids = raw ? JSON.parse(raw) : [];
    } catch (e) {}
    if (!Array.isArray(ids) || !ids.length) {
      var p = document.createElement("p");
      p.className = "text-muted";
      p.textContent = "Henüz favori ilan yok. Ana sayfadan ☆ ile ekleyebilirsiniz.";
      grid.appendChild(p);
      return;
    }
    ids.forEach(function (id) {
      var L = JetleAPI.getListingForViewer(id, user);
      if (!L) return;
      grid.appendChild(JetleMarket.createListingCard(JetleAPI.toMarketCard(L)));
    });
  }

  function loadProfile() {
    var u = JetleAuth.getFullUser();
    if (!u) return;
    $("profName").value = u.name || "";
    $("profPhone").value = u.phone || "";
    $("profCity").value = u.city || "";
    $("profType").value =
      u.role === "admin" ? "Yönetici" : u.role === "store" ? "Mağaza hesabı · " + (u.profileType || "Kurumsal") : u.profileType || "Bireysel";
  }

  function init() {
    var user = JetleAuth.requireUser();
    if (!user) return;

    JetleAuth.renderNavbar(window.currentUser);

    document.querySelectorAll(".dash-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showTab(btn.getAttribute("data-tab"));
      });
    });

    document.querySelectorAll(".listing-filter").forEach(function (b) {
      b.addEventListener("click", function () {
        listingFilterStatus = b.getAttribute("data-status") || "all";
        document.querySelectorAll(".listing-filter").forEach(function (x) {
          x.classList.toggle("is-active", x === b);
        });
        renderMyListings(user);
      });
    });

    renderMyListings(user);
    renderFavorites(user);
    loadProfile();

    $("profSave").addEventListener("click", function () {
      var res = JetleAuth.updateProfile({
        name: $("profName").value,
        phone: $("profPhone").value,
        city: $("profCity").value
      });
      var msg = $("profMsg");
      if (msg) {
        msg.hidden = false;
        msg.textContent = res.ok ? "Profil güncellendi." : res.message;
      }
      JetleAuth.renderNavbar(window.currentUser);
    });

    window.addEventListener("hashchange", applyHash);
    applyHash();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.getAttribute("data-page") === "dashboard") init();
  });
})();
