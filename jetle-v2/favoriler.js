(function () {
  "use strict";

  function currentFavUserId() {
    var u = null;
    try {
      u = window.JetleAuth && JetleAuth.getCurrentUser ? JetleAuth.getCurrentUser() : null;
    } catch (e0) {}
    return (u && u.id) || "__guest__";
  }

  function renderFavoritesPage() {
    var grid = document.getElementById("favoritesGrid");
    var empty = document.getElementById("favoritesEmpty");
    var lead = document.getElementById("favoritesLead");
    if (!grid || !window.JetleAPI || !window.JetleMarket) return;

    while (grid.firstChild) grid.removeChild(grid.firstChild);
    var rows = JetleAPI.getFavoriteListings(currentFavUserId()).filter(function (L) {
      return !!L;
    });

    if (!rows.length) {
      if (empty) empty.hidden = false;
      if (lead) lead.textContent = "Henüz favoriniz yok, hemen keşfetmeye başlayın.";
      return;
    }

    if (empty) empty.hidden = true;
    if (lead) lead.textContent = rows.length + " ilan favorilerinizde kayıtlı.";

    rows.forEach(function (L) {
      grid.appendChild(JetleMarket.createListingCard(JetleAPI.toMarketCard(L)));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body && document.body.classList.contains("page-favorites")) {
      if (window.JetleAuth && JetleAuth.renderHeaderBar) JetleAuth.renderHeaderBar();
      renderFavoritesPage();
    }
  });
})();
