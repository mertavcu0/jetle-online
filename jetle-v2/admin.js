/**
 * JETLE v2 — yönetim paneli (yalnızca admin rolü)
 */
(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function showSection(id) {
    document.querySelectorAll(".admin-nav-item").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-section") === id);
    });
    document.querySelectorAll(".admin-section").forEach(function (s) {
      s.hidden = s.id !== "sec-" + id;
    });
  }

  function renderStats() {
    var list = JetleAPI.getAllListings();
    var users = JSON.parse(localStorage.getItem(JetleAuth.KEYS.USERS) || "[]");
    var pending = list.filter(function (L) {
      return L.status === "pending";
    }).length;
    var approved = list.filter(function (L) {
      return L.status === "approved";
    }).length;
    var prem = list.filter(function (L) {
      return L.featured && L.status === "approved";
    }).length;
    var mount = $("adminStats");
    if (!mount) return;
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    function card(label, val) {
      var d = document.createElement("div");
      d.className = "stat-card panel";
      var l = document.createElement("span");
      l.className = "stat-label";
      l.textContent = label;
      var v = document.createElement("strong");
      v.className = "stat-value";
      v.textContent = String(val);
      d.appendChild(l);
      d.appendChild(v);
      mount.appendChild(d);
    }
    card("Toplam ilan", list.length);
    card("Bekleyen ilan", pending);
    card("Aktif kullanıcı", users.filter(function (u) {
      return u.active !== false;
    }).length);
    card("Öne çıkan (yayında)", prem);
  }

  function renderRecentListings() {
    var m = $("adminRecentListings");
    if (!m) return;
    while (m.firstChild) m.removeChild(m.firstChild);
    var rows = JetleAPI.getAllListings()
      .slice()
      .sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 6);
    var tb = document.createElement("table");
    tb.className = "data-table";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    ["No", "Başlık", "Durum"].forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tb.appendChild(thead);
    var body = document.createElement("tbody");
    rows.forEach(function (L) {
      var r = document.createElement("tr");
      [L.listingNo, L.title, L.status].forEach(function (t) {
        var td = document.createElement("td");
        td.textContent = t;
        r.appendChild(td);
      });
      body.appendChild(r);
    });
    tb.appendChild(body);
    m.appendChild(tb);
  }

  function renderRecentComplaints() {
    var m = $("adminRecentComplaints");
    if (!m) return;
    while (m.firstChild) m.removeChild(m.firstChild);
    var rows = JetleAPI.getComplaints()
      .slice()
      .sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 5);
    var tb = document.createElement("table");
    tb.className = "data-table";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    ["Sebep", "Durum", "Tarih"].forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tb.appendChild(thead);
    var body = document.createElement("tbody");
    rows.forEach(function (c) {
      var r = document.createElement("tr");
      [c.reason, c.status, c.createdAt].forEach(function (t) {
        var td = document.createElement("td");
        td.textContent = t;
        r.appendChild(td);
      });
      body.appendChild(r);
    });
    tb.appendChild(body);
    m.appendChild(tb);
  }

  function renderListingsTable() {
    var filter = $("adminListingFilter").value;
    var m = $("adminListingsTable");
    if (!m) return;
    while (m.firstChild) m.removeChild(m.firstChild);
    var rows = JetleAPI.getAllListings().filter(function (L) {
      if (filter === "all") return true;
      return L.status === filter;
    });
    var tb = document.createElement("table");
    tb.className = "data-table";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    ["No", "Başlık", "Kullanıcı", "Durum", "İşlem"].forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tb.appendChild(thead);
    var body = document.createElement("tbody");
    rows.forEach(function (L) {
      var r = document.createElement("tr");
      function cell(t) {
        var td = document.createElement("td");
        td.textContent = t;
        r.appendChild(td);
      }
      cell(L.listingNo || "");
      cell(L.title);
      cell(L.createdBy || "—");
      cell(L.status);
      var td = document.createElement("td");
      td.className = "table-actions";
      function act(label, fn) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-secondary btn-sm";
        b.textContent = label;
        b.addEventListener("click", fn);
        td.appendChild(b);
      }
      act("Onayla", function () {
        JetleAPI.updateListingStatus(L.id, "approved");
        renderListingsTable();
        renderStats();
      });
      act("Reddet", function () {
        JetleAPI.updateListingStatus(L.id, "rejected");
        renderListingsTable();
        renderStats();
      });
      act("Pasif", function () {
        JetleAPI.updateListingStatus(L.id, "passive");
        renderListingsTable();
        renderStats();
      });
      var a = document.createElement("a");
      a.href = "ilan-detay.html?id=" + encodeURIComponent(L.id);
      a.className = "btn btn-secondary btn-sm";
      a.textContent = "Detay";
      td.appendChild(a);
      r.appendChild(td);
      body.appendChild(r);
    });
    tb.appendChild(body);
    m.appendChild(tb);
  }

  function renderUsers() {
    var m = $("adminUsersTable");
    if (!m) return;
    while (m.firstChild) m.removeChild(m.firstChild);
    var users = JSON.parse(localStorage.getItem(JetleAuth.KEYS.USERS) || "[]");
    var tb = document.createElement("table");
    tb.className = "data-table";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    ["Ad", "E-posta", "Rol", "Durum"].forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tb.appendChild(thead);
    var body = document.createElement("tbody");
    users.forEach(function (u) {
      var r = document.createElement("tr");
      [u.name, u.email, u.role, u.active === false ? "Pasif" : "Aktif"].forEach(function (t) {
        var td = document.createElement("td");
        td.textContent = t;
        r.appendChild(td);
      });
      body.appendChild(r);
    });
    tb.appendChild(body);
    m.appendChild(tb);
  }

  function renderComplaints() {
    var m = $("adminComplaintsTable");
    if (!m) return;
    while (m.firstChild) m.removeChild(m.firstChild);
    var rows = JetleAPI.getComplaints();
    var tb = document.createElement("table");
    tb.className = "data-table";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    ["İlan", "Bildiren", "Sebep", "Durum", "İşlem"].forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tb.appendChild(thead);
    var body = document.createElement("tbody");
    rows.forEach(function (c) {
      var r = document.createElement("tr");
      [c.listingId, c.reporter, c.reason, c.status].forEach(function (t) {
        var td = document.createElement("td");
        td.textContent = t;
        r.appendChild(td);
      });
      var td = document.createElement("td");
      var b1 = document.createElement("button");
      b1.type = "button";
      b1.className = "btn btn-secondary btn-sm";
      b1.textContent = "Kapat";
      b1.addEventListener("click", function () {
        JetleAPI.updateComplaintStatus(c.id, "closed");
        renderComplaints();
      });
      td.appendChild(b1);
      r.appendChild(td);
      body.appendChild(r);
    });
    tb.appendChild(body);
    m.appendChild(tb);
  }

  function renderAds() {
    var m = $("adminAdsList");
    if (!m) return;
    while (m.firstChild) m.removeChild(m.firstChild);
    JetleAPI.getAds().forEach(function (ad) {
      var d = document.createElement("div");
      d.className = "panel ad-row";
      var t = document.createElement("strong");
      t.textContent = ad.title;
      var s = document.createElement("span");
      s.className = "text-small text-muted";
      s.textContent = "Slot: " + ad.slot + " — " + (ad.active ? "Aktif" : "Pasif");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn-secondary btn-sm";
      b.textContent = "Aç/Kapat";
      b.addEventListener("click", function () {
        JetleAPI.toggleAd(ad.id);
        renderAds();
      });
      d.appendChild(t);
      d.appendChild(s);
      d.appendChild(b);
      m.appendChild(d);
    });
  }

  function renderCategoryTree() {
    var m = $("adminCategoryTree");
    if (!m) return;
    while (m.firstChild) m.removeChild(m.firstChild);
    JetleMarket.CATEGORY_TREE.forEach(function (g) {
      var h = document.createElement("h3");
      h.className = "cat-readonly-parent";
      h.textContent = g.name;
      m.appendChild(h);
      var ul = document.createElement("ul");
      ul.className = "cat-readonly-list";
      g.children.forEach(function (ch) {
        var li = document.createElement("li");
        li.textContent = ch.name + " (" + ch.slug + ")";
        ul.appendChild(li);
      });
      m.appendChild(ul);
    });
  }

  function init() {
    if (document.body.getAttribute("data-page") !== "admin") return;
    JetleAuth.init();
    JetleAuth.renderHeaderBar();
    if (!JetleAuth.requireAdmin()) return;

    document.querySelectorAll(".admin-nav-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showSection(btn.getAttribute("data-section"));
      });
    });

    $("adminListingFilter").addEventListener("change", renderListingsTable);

    renderStats();
    renderRecentListings();
    renderRecentComplaints();
    renderListingsTable();
    renderUsers();
    renderComplaints();
    renderAds();
    renderCategoryTree();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
