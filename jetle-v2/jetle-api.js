(function () {
  "use strict";

  var STORAGE_KEYS = {
    LISTINGS: "jetle_platform_listings",
    FAVORITES: "jetle_platform_favorites"
  };

  function toast(msg, type) {
    if (window.JetleCommon && typeof window.JetleCommon.showToast === "function") {
      window.JetleCommon.showToast(msg, type || "error");
      return;
    }
    try {
      window.alert(msg);
    } catch (e) {}
  }

  function readJson(storage, key, fallback) {
    try {
      var raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(storage, key, val) {
    try {
      storage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      toast("Veri kaydedilemedi.");
      return false;
    }
  }

  function currentUserId() {
    try {
      var u = window.JetleAuth && JetleAuth.getCurrentUser ? JetleAuth.getCurrentUser() : null;
      return (u && u.id) || "__guest__";
    } catch (e) {
      return "__guest__";
    }
  }

  var base = window.JetleAPI || {};

  function normalizeListings() {
    try {
      var local = readJson(localStorage, STORAGE_KEYS.LISTINGS, []);
      if (Array.isArray(local) && local.length) return local;
      if (typeof base.getMarketListings === "function") {
        var market = base.getMarketListings();
        if (Array.isArray(market)) {
          writeJson(localStorage, STORAGE_KEYS.LISTINGS, market);
          return market;
        }
      }
      if (Array.isArray(base.listings) && base.listings.length) {
        writeJson(localStorage, STORAGE_KEYS.LISTINGS, base.listings);
        return base.listings.slice();
      }
    } catch (e) {
      toast("Ilanlar okunamadi.");
    }
    return [];
  }

  function getListings() {
    try {
      var rows = normalizeListings();
      api.listings = rows.slice();
      return rows;
    } catch (e) {
      toast("Ilanlar alinamadi.");
      return [];
    }
  }

  function getListingById(id) {
    try {
      if (typeof base.getListingById === "function") {
        var b = base.getListingById(id);
        if (b) return b;
      }
      var rows = getListings();
      var sid = String(id || "");
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i].id || rows[i]._id || "") === sid) return rows[i];
      }
    } catch (e) {
      toast("Ilan detayi getirilemedi.");
    }
    return null;
  }

  function createListing(data) {
    try {
      if (!data || typeof data !== "object") throw new Error("Gecerli ilan verisi gerekli.");
      if (typeof base.createListing === "function") {
        var res = base.createListing(data);
        var rowsFromBase = normalizeListings();
        api.listings = rowsFromBase.slice();
        return res;
      }
      var rows = getListings();
      var next = Object.assign({}, data);
      if (!next.id) next.id = "l-" + Date.now();
      if (!next.createdAt) next.createdAt = new Date().toISOString();
      rows.unshift(next);
      writeJson(localStorage, STORAGE_KEYS.LISTINGS, rows);
      api.listings = rows.slice();
      return { ok: true, listing: next };
    } catch (e) {
      toast(e && e.message ? e.message : "Ilan olusturulamadi.");
      return { ok: false, message: e && e.message ? e.message : "Ilan olusturulamadi." };
    }
  }

  function readFavoritesMap() {
    var map = readJson(sessionStorage, STORAGE_KEYS.FAVORITES, {});
    return map && typeof map === "object" ? map : {};
  }

  function getFavorites(userId) {
    try {
      var uid = userId || currentUserId();
      if (typeof base.getFavorites === "function") {
        var existing = base.getFavorites(uid);
        if (Array.isArray(existing) && existing.length) return existing.slice();
      }
      var map = readFavoritesMap();
      var favs = map[uid];
      return Array.isArray(favs) ? favs.slice() : [];
    } catch (e) {
      toast("Favoriler alinamadi.");
      return [];
    }
  }

  function toggleFavorite(id, userId) {
    try {
      var uid = userId || currentUserId();
      var sid = String(id || "");
      if (!sid) throw new Error("Favori id bos olamaz.");
      if (typeof base.toggleFavorite === "function") {
        var out = base.toggleFavorite(uid, sid);
        return out;
      }
      var map = readFavoritesMap();
      var list = Array.isArray(map[uid]) ? map[uid].slice() : [];
      var idx = list.indexOf(sid);
      var on = false;
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.push(sid);
        on = true;
      }
      map[uid] = list;
      writeJson(sessionStorage, STORAGE_KEYS.FAVORITES, map);
      return on;
    } catch (e) {
      toast("Favori islemi basarisiz.");
      return false;
    }
  }

  var api = Object.assign({}, base, {
    listings: normalizeListings(),
    getListings: getListings,
    getListingById: getListingById,
    createListing: createListing,
    getFavorites: getFavorites,
    toggleFavorite: toggleFavorite
  });

  window.JetleAPI = api;
})();
