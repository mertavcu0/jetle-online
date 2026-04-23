/**
 * Jetle V2 — ilan-detay.html: sekmeler + fotoğraf slider okları.
 * initDetailPage sonunda ilan.js bindIlanDetayDetailTabs / bindIlanDetayGallerySlider çağırır.
 */
(function () {
  "use strict";

  function bindIlanDetayGallerySlider() {
    var root = document.getElementById("detailRoot");
    var thumbs = document.getElementById("ilanThumbs");
    var prev = document.getElementById("detailSliderPrev");
    var next = document.getElementById("detailSliderNext");
    var cEl = document.getElementById("detailSliderCounter");
    var idxEl = document.getElementById("detailSliderIndex");
    var totEl = document.getElementById("detailSliderTotal");
    if (!root || !thumbs || !prev || !next) return;

    function photoButtons() {
      return Array.prototype.slice.call(thumbs.querySelectorAll('.detail-thumb[data-kind="photo"]'));
    }

    function activePhotoIndex() {
      var btns = photoButtons();
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].classList.contains("is-active")) return i;
      }
      return 0;
    }

    function activeIsVideo() {
      var active = thumbs.querySelector(".detail-thumb.is-active");
      return !!(active && active.getAttribute("data-kind") === "video");
    }

    function setByIndex(i) {
      var btns = photoButtons();
      if (!btns.length) return;
      var clamped = Math.max(0, Math.min(btns.length - 1, i));
      btns[clamped].click();
    }

    function refresh() {
      var btns = photoButtons();
      var n = btns.length;
      if (n <= 1 || activeIsVideo()) {
        prev.disabled = true;
        next.disabled = true;
        if (cEl) cEl.hidden = true;
        return;
      }
      if (cEl) cEl.hidden = false;
      if (totEl) totEl.textContent = String(n);
      var ai = activePhotoIndex();
      if (idxEl) idxEl.textContent = String(ai + 1);
      prev.disabled = ai <= 0;
      next.disabled = ai >= n - 1;
    }

    prev.onclick = function () {
      var ai = activePhotoIndex();
      if (ai > 0) setByIndex(ai - 1);
      setTimeout(refresh, 0);
    };
    next.onclick = function () {
      var btns = photoButtons();
      var ai = activePhotoIndex();
      if (ai < btns.length - 1) setByIndex(ai + 1);
      setTimeout(refresh, 0);
    };

    if (root.getAttribute("data-slider-delegation") !== "1") {
      root.setAttribute("data-slider-delegation", "1");
      root.addEventListener("click", function (e) {
        if (e.target.closest("#ilanThumbs .detail-thumb")) requestAnimationFrame(refresh);
      });
    }

    refresh();
  }

  window.bindIlanDetayGallerySlider = bindIlanDetayGallerySlider;

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

  function bindIlanDetayDetailTabs() {
    bindOnce();
  }

  window.bindIlanDetayDetailTabs = bindIlanDetayDetailTabs;
  window.bindIlanDetayPremiumTabs = bindIlanDetayDetailTabs;
})();
