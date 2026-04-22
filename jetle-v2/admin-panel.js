/**
 * JETLE v2 — ilan moderasyonu (admin): onay / red / silme
 */
(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function statusLabelTr(s) {
    if (s === "pending") return "Onay bekliyor";
    if (s === "approved") return "Yayında";
    if (s === "rejected") return "Reddedildi";
    if (s === "draft") return "Taslak";
    if (s === "passive") return "Pasif";
    return s || "—";
  }

  function statusClass(s) {
    if (s === "approved") return "status-badge status-badge--ok";
    if (s === "pending") return "status-badge status-badge--wait";
    if (s === "rejected") return "status-badge status-badge--no";
    if (s === "passive") return "status-badge status-badge--off";
    return "status-badge";
  }

  function formatDate(iso) {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("tr-TR", {
        dateStyle: "short",
        timeStyle: "short"
      });
    } catch (e) {
      return String(iso);
    }
  }

  function showMsg(text, isErr) {
    var el = $("adminPanelMsg");
    if (!el) return;
    el.hidden = false;
    el.textContent = text || "";
    el.className = "admin-panel-msg" + (isErr ? " admin-panel-msg--err" : "");
  }

  function loadTable() {
    var wrap = $("adminPanelTableWrap");
    var tbody = $("adminPanelTbody");
    if (!wrap || !tbody) return;
    tbody.innerHTML = "";
    var res = window.JetleAPI.adminFetchListings();
    if (!res.ok) {
      showMsg(res.message || "Liste yüklenemedi.", true);
      return;
    }
    var rows = res.data && Array.isArray(res.data.data) ? res.data.data : [];
    if (!rows.length) {
      showMsg("Kayıtlı ilan yok.", false);
      return;
    }
    showMsg("", false);
    $("adminPanelMsg").hidden = true;
    rows.forEach(function (row) {
      var owner = row.owner || {};
      var tr = document.createElement("tr");
      var tdTitle = document.createElement("td");
      tdTitle.textContent = row.title || "—";
      var tdUser = document.createElement("td");
      if (owner.fullName || owner.email) {
        tdUser.innerHTML =
          "<div class=\"admin-panel-user\">" +
          (owner.fullName ? "<span class=\"admin-panel-user__name\">" + escapeHtml(owner.fullName) + "</span>" : "") +
          (owner.email ? "<span class=\"admin-panel-user__email text-small text-muted\">" + escapeHtml(owner.email) + "</span>" : "") +
          "</div>";
      } else if (row.userId) {
        tdUser.innerHTML =
          "<span class=\"text-small text-muted\">Kullanıcı ID: " + escapeHtml(String(row.userId)) + "</span>";
      } else {
        tdUser.textContent = "—";
      }
      var tdDate = document.createElement("td");
      tdDate.className = "text-small";
      tdDate.textContent = formatDate(row.createdAt);
      var tdStatus = document.createElement("td");
      var badge = document.createElement("span");
      badge.className = statusClass(row.status);
      badge.textContent = statusLabelTr(row.status);
      tdStatus.appendChild(badge);
      var tdAct = document.createElement("td");
      tdAct.className = "admin-panel-actions";

      function btn(label, cls, onClick) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-sm " + cls;
        b.textContent = label;
        b.addEventListener("click", onClick);
        return b;
      }

      tdAct.appendChild(
        btn("Onayla", "btn-primary", function () {
          var r = JetleAPI.adminApproveListing(row.id);
          if (!r.ok) {
            showMsg(r.message || "Onaylanamadı.", true);
            return;
          }
          JetleAPI.notifyListingsChanged();
          loadTable();
        })
      );
      tdAct.appendChild(
        btn("Reddet", "btn-secondary", function () {
          var r = JetleAPI.adminRejectListing(row.id);
          if (!r.ok) {
            showMsg(r.message || "Reddedilemedi.", true);
            return;
          }
          JetleAPI.notifyListingsChanged();
          loadTable();
        })
      );
      tdAct.appendChild(
        btn("Sil", "btn-secondary", function () {
          if (!window.confirm("Bu ilanı kalıcı olarak silmek istiyor musunuz?")) return;
          var r = JetleAPI.adminDeleteListing(row.id);
          if (!r.ok) {
            showMsg(r.message || "Silinemedi.", true);
            return;
          }
          JetleAPI.notifyListingsChanged();
          loadTable();
        })
      );

      tr.appendChild(tdTitle);
      tr.appendChild(tdUser);
      tr.appendChild(tdDate);
      tr.appendChild(tdStatus);
      tr.appendChild(tdAct);
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function init() {
    var u = JetleAuth.requireAdmin();
    if (!u) return;
    JetleAuth.renderHeaderBar();
    var idEl = $("adminPanelIdentity");
    if (idEl) idEl.textContent = u.name + " · admin";
    loadTable();
    var refresh = $("adminPanelRefresh");
    if (refresh) refresh.addEventListener("click", loadTable);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.getAttribute("data-page") === "admin-panel") init();
  });
})();
