/**
 * Jetle V2 — ilan-detay.html premium sekmeler (Açıklama / Özellikler).
 * initDetailPage sonunda ilan.js içinden bindIlanDetayPremiumTabs() çağrılır.
 */
(function () {
  "use strict";

  function setTab(name) {
    var descBtn = document.getElementById("detailTabDescBtn");
    var featBtn = document.getElementById("detailTabFeatBtn");
    var descPanel = document.getElementById("detailPanelDesc");
    var featPanel = document.getElementById("detailPanelFeat");
    if (!descPanel || !featPanel) return;

    var showFeat = name === "feat";
    descPanel.hidden = showFeat;
    featPanel.hidden = !showFeat;
    descPanel.classList.toggle("detail-tab-panel--active", !showFeat);
    featPanel.classList.toggle("detail-tab-panel--active", showFeat);
    descPanel.style.display = showFeat ? "none" : "block";
    featPanel.style.display = showFeat ? "block" : "none";

    if (descBtn) {
      descBtn.classList.toggle("active", !showFeat);
      descBtn.setAttribute("aria-selected", showFeat ? "false" : "true");
    }
    if (featBtn) {
      featBtn.classList.toggle("active", showFeat);
      featBtn.setAttribute("aria-selected", showFeat ? "true" : "false");
    }
  }

  function bindOnce() {
    var root = document.getElementById("detailRoot");
    if (!root || root.getAttribute("data-tabs-bound") === "1") return;
    var descBtn = document.getElementById("detailTabDescBtn");
    var featBtn = document.getElementById("detailTabFeatBtn");
    if (!descBtn || !featBtn) return;
    root.setAttribute("data-tabs-bound", "1");

    descBtn.addEventListener("click", function () {
      setTab("desc");
    });
    featBtn.addEventListener("click", function () {
      setTab("feat");
    });
    setTab("desc");
  }

  window.bindIlanDetayPremiumTabs = function () {
    bindOnce();
  };
})();
