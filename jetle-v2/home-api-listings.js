/**
 * Ana sayfa — API ilanları: kartlar, arama, kategori, sayfalama / daha fazla.
 */
(function () {
  "use strict";

  try {
    window.__JETLE_USE_HOME_API_LISTINGS__ = true;
  } catch (e) {}

  var DEFAULT_LISTINGS_URL = "https://jetle-online-production.up.railway.app/api/listings";
  /** İlk yüklemede sadece 6 kart; kalanlar lazy chunk halinde gelir. */
  var HOME_INITIAL_RENDER_COUNT = 6;
  var HOME_LAZY_BATCH_SIZE = 6;
  var CARD_IMG_W = 320;
  var CARD_IMG_H = 240;
  var DESC_MAX = 140;

  /** Ham API satırları (filtre öncesi). */
  var apiRows = [];
  /** API boş / hata: grid örnek ilanlarla doldurulur; filtre eşleşmezse yine örnekler gösterilir. */
  var homeGridIsDemo = false;
  var shownCount = 0;
  var filterKeyword = "";
  var filterCategory = "";
  var filterCity = "";
  /** İlk API yanıtı gelene kadar grid güncellenmez (erken arama olayları için). */
  var listingsFetchSettled = false;
  var lazyLoadQueued = false;
  var infiniteObserver = null;
  var scrollFallbackWired = false;

  /** API yok veya öne çıkan yokken gösterilecek örnek ilanlar (4–6 adet). */
  var FAKE_FEATURED = [
    {
      _id: "jetle-demo-1",
      title: "2019 BMW 320i M Sport",
      price: 1285000,
      city: "Ankara",
      district: "Çankaya",
      category: "Vasıta",
      featured: true,
      coverImage: "https://picsum.photos/seed/jetlefeat1/640/480"
    },
    {
      _id: "jetle-demo-2",
      title: "Satılık 3+1 Daire · Deniz manzaralı",
      price: 4250000,
      city: "İzmir",
      district: "Karşıyaka",
      category: "Emlak",
      featured: true,
      coverImage: "https://picsum.photos/seed/jetlefeat2/640/480"
    },
    {
      _id: "jetle-demo-3",
      title: "MacBook Pro 14\" M3 · Garantili",
      price: 67900,
      city: "İstanbul",
      district: "Beşiktaş",
      category: "Elektronik",
      featured: true,
      coverImage: "https://picsum.photos/seed/jetlefeat3/640/480"
    },
    {
      _id: "jetle-demo-4",
      title: "Vespa Primavera 150 · Az kullanılmış",
      price: 185000,
      city: "Antalya",
      district: "Muratpaşa",
      category: "Vasıta",
      featured: true,
      coverImage: "https://picsum.photos/seed/jetlefeat4/640/480"
    },
    {
      _id: "jetle-demo-5",
      title: "Ofis taşıma & montaj paketi",
      price: 8500,
      city: "Bursa",
      district: "Osmangazi",
      category: "Hizmet",
      featured: true,
      coverImage: "https://picsum.photos/seed/jetlefeat5/640/480"
    },
    {
      _id: "jetle-demo-6",
      title: "Yeni sezon ayakkabı & çanta lotu",
      price: 3200,
      city: "İstanbul",
      district: "Ümraniye",
      category: "Alışveriş",
      featured: true,
      coverImage: "https://picsum.photos/seed/jetlefeat6/640/480"
    }
  ];

  function idKey(item) {
    if (!item || typeof item !== "object") return "";
    if (item._id != null) return String(item._id);
    if (item.id != null) return String(item.id);
    return "";
  }

  function selectFeaturedList(rows) {
    var r = rows || [];
    var promoted = r
      .filter(isPromotedListing)
      .sort(function (a, b) {
        return promotedSortKey(b) - promotedSortKey(a);
      });
    var picked = promoted.slice(0, 6);
    var used = {};
    picked.forEach(function (x) {
      used[idKey(x)] = true;
    });
    if (picked.length < 4) {
      for (var i = 0; i < r.length && picked.length < 6; i++) {
        var k = idKey(r[i]);
        if (k && used[k]) continue;
        if (k) used[k] = true;
        picked.push(r[i]);
      }
    }
    if (picked.length === 0 && r.length) {
      picked = r.slice(0, 6).map(function (x) {
        return Object.assign({ featured: true }, x);
      });
    }
    if (picked.length === 0) {
      picked = FAKE_FEATURED.slice(0, 6);
    }
    return picked.slice(0, 6);
  }

  /** Ana grid: API yoksa örnek ilanlar (≥12 kart için yeterli adet). */
  var FAKE_GRID_LISTINGS = [
    {
      _id: "jetle-grid-1",
      title: "Renault Clio 1.0 TCe Joy",
      price: 565000,
      city: "İstanbul",
      district: "Kadıköy",
      category: "Vasıta",
      description: "Bakımlı, tek sahip, ekspertiz raporu mevcut.",
      coverImage: "https://picsum.photos/seed/jetleg1/640/480",
      createdAt: "2026-04-21T08:30:00.000Z",
      featured: false
    },
    {
      _id: "jetle-grid-2",
      title: "3+1 Kiralık Daire · Metro yakını",
      price: 18500,
      city: "Ankara",
      district: "Çankaya",
      category: "Emlak",
      description: "Eşyalı seçeneği, güvenlikli site, otopark.",
      coverImage: "https://picsum.photos/seed/jetleg2/640/480",
      createdAt: "2026-04-21T06:15:00.000Z",
      sellerType: "Kurumsal"
    },
    {
      _id: "jetle-grid-3",
      title: "iPhone 15 Pro 256 GB",
      price: 42900,
      city: "İzmir",
      district: "Bornova",
      category: "Elektronik",
      description: "Fatura garantili, kutulu, takas düşünülür.",
      coverImage: "https://picsum.photos/seed/jetleg3/640/480",
      createdAt: "2026-04-20T19:00:00.000Z"
    },
    {
      _id: "jetle-grid-4",
      title: "Ford Focus 1.5 TDCi Titanium",
      price: 698000,
      city: "Bursa",
      district: "Nilüfer",
      category: "Vasıta",
      description: "Düşük km, cam tavan, kış lastiği dahil.",
      coverImage: "https://picsum.photos/seed/jetleg4/640/480",
      createdAt: "2026-04-20T14:22:00.000Z"
    },
    {
      _id: "jetle-grid-5",
      title: "Villa · Havuzlu · Güvenlikli site",
      price: 18500000,
      city: "Antalya",
      district: "Konyaaltı",
      category: "Emlak",
      description: "Denize 800 m, müstakil bahçe, hazır mutfak.",
      coverImage: "https://picsum.photos/seed/jetleg5/640/480",
      createdAt: "2026-04-19T11:40:00.000Z",
      sellerType: "Kurumsal"
    },
    {
      _id: "jetle-grid-6",
      title: "Gaming PC · RTX 4070 · 32 GB RAM",
      price: 38500,
      city: "İstanbul",
      district: "Ümraniye",
      category: "Elektronik",
      description: "Garantili parçalar, temiz kurulum.",
      coverImage: "https://picsum.photos/seed/jetleg6/640/480",
      createdAt: "2026-04-21T04:05:00.000Z"
    },
    {
      _id: "jetle-grid-7",
      title: "Kış lastiği seti · 205/55 R16",
      price: 4200,
      city: "Kocaeli",
      district: "İzmit",
      category: "Alışveriş",
      description: "Az kullanılmış, diş derinliği iyi.",
      coverImage: "https://picsum.photos/seed/jetleg7/640/480",
      createdAt: "2026-04-18T16:20:00.000Z"
    },
    {
      _id: "jetle-grid-8",
      title: "Ev temizlik & ütü paketi",
      price: 1200,
      city: "İstanbul",
      district: "Ataşehir",
      category: "Hizmet",
      description: "Haftalık veya tek seferlik, referanslı ekip.",
      coverImage: "https://picsum.photos/seed/jetleg8/640/480",
      createdAt: "2026-04-21T09:50:00.000Z"
    },
    {
      _id: "jetle-grid-9",
      title: "Hyundai Tucson 1.6 CRDi Premium",
      price: 1125000,
      city: "Adana",
      district: "Seyhan",
      category: "Vasıta",
      description: "Otomatik, deri döşeme, servis bakımlı.",
      coverImage: "https://picsum.photos/seed/jetleg9/640/480",
      createdAt: "2026-04-17T09:00:00.000Z"
    },
    {
      _id: "jetle-grid-10",
      title: "Ofis mobilyası · toplu satış",
      price: 28000,
      city: "İstanbul",
      district: "Şişli",
      category: "Alışveriş",
      description: "Masa, dolap ve koltuk takımı; yerinde teslim.",
      coverImage: "https://picsum.photos/seed/jetleg10/640/480",
      createdAt: "2026-04-16T13:30:00.000Z",
      sellerType: "Kurumsal"
    },
    {
      _id: "jetle-grid-11",
      title: "Peugeot 3008 1.5 BlueHDi Allure",
      price: 925000,
      city: "Mersin",
      district: "Yenişehir",
      category: "Vasıta",
      description: "Garaj arabası, cam filmi, navigasyon.",
      coverImage: "https://picsum.photos/seed/jetleg11/640/480",
      createdAt: "2026-04-21T10:00:00.000Z"
    },
    {
      _id: "jetle-grid-12",
      title: "Stüdyo daire · Öğrenciye uygun",
      price: 9500,
      city: "Eskişehir",
      district: "Tepebaşı",
      category: "Emlak",
      description: "Eşyalı, internet dahil, merkeze yürüme.",
      coverImage: "https://picsum.photos/seed/jetleg12/640/480",
      createdAt: "2026-04-20T22:15:00.000Z"
    },
    {
      _id: "jetle-grid-13",
      title: "PlayStation 5 + 2 kol",
      price: 14200,
      city: "İstanbul",
      district: "Bakırköy",
      category: "Elektronik",
      description: "Kutu açılmamış oyun hediye; garanti devredilir.",
      coverImage: "https://picsum.photos/seed/jetleg13/640/480",
      createdAt: "2026-04-19T18:45:00.000Z"
    },
    {
      _id: "jetle-grid-14",
      title: "Nakliye · şehir içi kamyonet",
      price: 2500,
      city: "Konya",
      district: "Selçuklu",
      category: "Hizmet",
      description: "Aynı gün randevu, sigortalı taşıma.",
      coverImage: "https://picsum.photos/seed/jetleg14/640/480",
      createdAt: "2026-04-21T07:20:00.000Z",
      sellerType: "Kurumsal"
    }
  ];

  function featuredCardHref(item) {
    var id = idKey(item);
    if (!id || /^jetle-demo-/i.test(String(id))) return "index.html";
    return detailPageHref(id);
  }

  function resolveListingsUrl() {
    try {
      var meta = document.querySelector('meta[name="jetle-api-base"]');
      var base = meta && meta.getAttribute("content");
      if (base && String(base).trim()) {
        return String(base).trim().replace(/\/+$/, "") + "/api/listings";
      }
    } catch (err) {}
    return DEFAULT_LISTINGS_URL;
  }

  function readUrlFilters() {
    try {
      var u = new URL(window.location.href);
      if (u.searchParams.has("q")) filterKeyword = u.searchParams.get("q") || "";
      if (u.searchParams.has("cat")) filterCategory = (u.searchParams.get("cat") || "").toLowerCase();
      if (u.searchParams.has("city")) filterCity = u.searchParams.get("city") || "";
    } catch (err) {}
  }

  function pushUrlFilters() {
    try {
      var u = new URL(window.location.href);
      var q = String(filterKeyword || "").trim();
      if (q) u.searchParams.set("q", q);
      else u.searchParams.delete("q");
      if (filterCategory) u.searchParams.set("cat", filterCategory);
      else u.searchParams.delete("cat");
      var c = String(filterCity || "").trim();
      if (c) u.searchParams.set("city", c);
      else u.searchParams.delete("city");
      if (history.replaceState) history.replaceState({}, "", u);
    } catch (err) {}
  }

  function syncSearchInputs() {
    var homeIn = document.getElementById("homeListingKeyword");
    var headIn = document.getElementById("headerSearchInput");
    if (homeIn) homeIn.value = filterKeyword;
    if (headIn) headIn.value = filterKeyword;
    syncHeroCategorySelect();
    syncHomeHeroCitySelect();
  }

  function syncHeroCategorySelect() {
    var sel = document.getElementById("homeHeroCategory");
    if (!sel) return;
    var v = String(filterCategory || "").toLowerCase();
    if (v === "emlak" || v === "vasita" || v === "elektronik" || v === "alisveris" || v === "hizmet") sel.value = v;
    else sel.value = "";
  }

  function syncHomeHeroCitySelect() {
    var c = document.getElementById("homeHeroCity");
    if (!c) return;
    var want = String(filterCity || "").trim();
    if (!want) {
      c.value = "";
      return;
    }
    var ok = false;
    for (var i = 0; i < c.options.length; i++) {
      if (c.options[i].value === want) {
        ok = true;
        break;
      }
    }
    c.value = ok ? want : "";
  }

  function syncHeroCityFromSidebar() {
    var src = document.getElementById("citySelect");
    var dst = document.getElementById("homeHeroCity");
    if (!src || !dst) return;
    var prev = String(filterCity || dst.value || "").trim();
    dst.innerHTML = src.innerHTML;
    if (prev) {
      var ok = false;
      for (var i = 0; i < dst.options.length; i++) {
        if (dst.options[i].value === prev) {
          ok = true;
          break;
        }
      }
      if (ok) dst.value = prev;
    }
  }

  function syncCategoryChips() {
    document.querySelectorAll(".home-cat-chip").forEach(function (btn) {
      var v = btn.getAttribute("data-home-cat") || "";
      btn.classList.toggle("is-active", v === filterCategory);
    });
    document.querySelectorAll(".home-cat-block").forEach(function (btn) {
      var v = btn.getAttribute("data-home-cat") || "";
      btn.classList.toggle("is-active", v === filterCategory);
    });
  }

  function normalizeRows(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload.data && Array.isArray(payload.data)) return payload.data;
    if (payload.ok && Array.isArray(payload.data)) return payload.data;
    return [];
  }

  function pickThumbUrl(item) {
    if (!item || typeof item !== "object") return "";
    var m = item.media && Array.isArray(item.media.images) ? item.media.images[0] : null;
    if (m && typeof m === "object") {
      var u = m.thumbUrl || m.mediumUrl || m.originalUrl || "";
      if (u) return String(u).trim();
    }
    if (item.coverImage && String(item.coverImage).trim()) return String(item.coverImage).trim();
    if (Array.isArray(item.images) && item.images[0]) return String(item.images[0]).trim();
    return "";
  }

  function formatTry(n) {
    var num = Number(n);
    if (!Number.isFinite(num)) return "—";
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(num) + " ₺";
  }

  function foldTr(s) {
    return String(s || "").toLocaleLowerCase("tr-TR");
  }

  function shortDescription(text) {
    var t = String(text || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!t) return "";
    if (t.length <= DESC_MAX) return t;
    return t.slice(0, DESC_MAX - 1).trim() + "…";
  }

  function locationLine(item) {
    if (!item || typeof item !== "object") return "—";
    var d = item.district != null ? String(item.district).trim() : "";
    var c = item.city != null ? String(item.city).trim() : "";
    if (item.location && typeof item.location === "object") {
      if (!d && item.location.district) d = String(item.location.district).trim();
      if (!c && item.location.city) c = String(item.location.city).trim();
    }
    if (d && c) return d + ", " + c;
    if (c) return c;
    if (d) return d;
    return "—";
  }

  function hashStr(s) {
    var h = 0;
    s = String(s || "");
    for (var i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  /** API’de kurumsal işareti varsa veya id’ye göre kararlı “rastgele” (~%25). */
  function showKurumsalBadge(item) {
    if (!item || typeof item !== "object") return false;
    var raw = item.sellerType || item.sellerProfileType || item.profileType || item.accountType || item.sellerCategory || "";
    if (raw && /kurumsal/i.test(String(raw))) return true;
    var key = idKey(item) || String(item.title || item.listingNo || "");
    return hashStr(key) % 4 === 1;
  }

  function cityLabel(item) {
    if (!item || typeof item !== "object") return "—";
    var c = item.city != null ? String(item.city).trim() : "";
    if (item.location && typeof item.location === "object" && item.location.city) {
      c = c || String(item.location.city).trim();
    }
    return c || "—";
  }

  function mongoIdToDateMs(idStr) {
    var s = String(idStr || "");
    if (s.length !== 24 || !/^[a-f0-9]+$/i.test(s)) return null;
    var ts = parseInt(s.slice(0, 8), 16);
    return Number.isFinite(ts) ? ts * 1000 : null;
  }

  function parseListingDateMs(item) {
    if (!item) return null;
    var keys = ["createdAt", "updatedAt", "publishedAt", "created", "date", "listedAt"];
    for (var i = 0; i < keys.length; i++) {
      var v = item[keys[i]];
      if (v == null) continue;
      var t = new Date(v).getTime();
      if (!Number.isNaN(t)) return t;
    }
    return mongoIdToDateMs(idKey(item));
  }

  function relativeTimeTr(ms) {
    if (ms == null || Number.isNaN(ms)) return "";
    var diff = Date.now() - ms;
    if (diff < 0) diff = 0;
    var sec = Math.floor(diff / 1000);
    if (sec < 45) return "Az önce";
    var min = Math.floor(sec / 60);
    if (min < 60) return min + " dk önce";
    var hr = Math.floor(min / 60);
    if (hr < 24) return hr + " saat önce";
    var d = Math.floor(hr / 24);
    if (d < 7) return d + " gün önce";
    var w = Math.floor(d / 7);
    if (w < 5) return w + " hafta önce";
    return new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
  }

  function cityAndTimeLine(item) {
    var city = cityLabel(item);
    var rel = relativeTimeTr(parseListingDateMs(item));
    if (rel && city && city !== "—") return city + " • " + rel;
    if (rel) return rel;
    return city;
  }

  function detailPageHref(id) {
    return "ilan-detail.html?id=" + encodeURIComponent(id);
  }

  function gridListingHref(id) {
    if (!id) return "index.html";
    if (/^jetle-(demo|grid)-/i.test(String(id))) return "index.html";
    return detailPageHref(id);
  }

  function isPromotedListing(item) {
    if (!item || typeof item !== "object") return false;
    return !!(item.featured || item.showcase || item.sponsored || item.urgent || item.highlight);
  }

  function promotedSortKey(item) {
    var s = 0;
    if (item.urgent) s += 8;
    if (item.showcase) s += 4;
    if (item.featured) s += 2;
    if (item.highlight) s += 1;
    if (item.sponsored) s += 1;
    return s;
  }

  function cityMatches(item, cityNorm) {
    var want = String(cityNorm || "").trim();
    if (!want) return true;
    var c = item.city != null ? String(item.city).trim() : "";
    if (item.location && typeof item.location === "object" && item.location.city) {
      c = c || String(item.location.city).trim();
    }
    return foldTr(c) === foldTr(want);
  }

  function appendPromotionBadges(host, item) {
    if (!host || !item) return;
    var hasRealBadge = !!(item.urgent || item.showcase || item.featured);
    if (item.urgent) {
      var u = document.createElement("span");
      u.className = "jetle-badge jetle-badge--acil";
      u.textContent = "Acil";
      host.appendChild(u);
    }
    if (item.showcase) {
      var v = document.createElement("span");
      v.className = "jetle-badge jetle-badge--vitrin";
      v.textContent = "Vitrin";
      host.appendChild(v);
    }
    if (item.featured) {
      var f = document.createElement("span");
      f.className = "jetle-badge jetle-badge--one";
      f.textContent = "Öne çıkan";
      host.appendChild(f);
    }
    if (!hasRealBadge) {
      // Kararlı "random": aynı ilan her yüklemede aynı etiketi alır.
      var rk = hashStr(idKey(item) || item.title || item.description || "");
      if (rk % 7 === 0) {
        var ra = document.createElement("span");
        ra.className = "jetle-badge jetle-badge--acil";
        ra.textContent = "Acil";
        host.appendChild(ra);
      } else if (rk % 7 === 1) {
        var rv = document.createElement("span");
        rv.className = "jetle-badge jetle-badge--vitrin";
        rv.textContent = "Vitrin";
        host.appendChild(rv);
      }
    }
  }

  function keywordMatches(item, kw) {
    var k = String(kw || "").trim();
    if (!k) return true;
    var fk = foldTr(k);
    var title = foldTr(item.title);
    var desc = foldTr(item.description);
    return title.indexOf(fk) !== -1 || desc.indexOf(fk) !== -1;
  }

  function haystackForCategory(item) {
    var parts = [
      item.category,
      item.subcategory,
      item.categorySlug,
      item.title,
      item.description
    ];
    return foldTr(parts.filter(Boolean).join(" "));
  }

  function categoryMatches(item, key) {
    if (!key) return true;
    var h = haystackForCategory(item);
    if (key === "emlak") {
      return (
        h.indexOf("emlak") !== -1 ||
        h.indexOf("gayrimenkul") !== -1 ||
        h.indexOf("konut") !== -1 ||
        h.indexOf("arsa") !== -1 ||
        h.indexOf("daire") !== -1
      );
    }
    if (key === "vasita") {
      return (
        h.indexOf("vasıta") !== -1 ||
        h.indexOf("vasita") !== -1 ||
        h.indexOf("araç") !== -1 ||
        h.indexOf("arac") !== -1 ||
        h.indexOf("otomobil") !== -1 ||
        h.indexOf("motosiklet") !== -1 ||
        h.indexOf("oto") !== -1
      );
    }
    if (key === "elektronik") {
      return (
        h.indexOf("elektronik") !== -1 ||
        h.indexOf("telefon") !== -1 ||
        h.indexOf("bilgisayar") !== -1 ||
        h.indexOf("tablet") !== -1 ||
        h.indexOf("tv") !== -1 ||
        h.indexOf("laptop") !== -1
      );
    }
    if (key === "alisveris") {
      return h.indexOf("alışveriş") !== -1 || h.indexOf("alisveris") !== -1 || h.indexOf("mağaza") !== -1;
    }
    if (key === "hizmet") {
      return h.indexOf("hizmet") !== -1 || h.indexOf("hizmetler") !== -1;
    }
    return true;
  }

  function getFilteredRows() {
    return apiRows.filter(function (item) {
      return (
        categoryMatches(item, filterCategory) &&
        keywordMatches(item, filterKeyword) &&
        cityMatches(item, filterCity)
      );
    });
  }

  function getGridDisplayRows() {
    var filtered = getFilteredRows();
    if (homeGridIsDemo && filtered.length === 0 && apiRows.length) return apiRows;
    return filtered;
  }

  function syncHomeSectionHeading() {
    try {
      var h = document.getElementById("allHeading");
      var label = document.getElementById("allHeadingLabel");
      var t = homeGridIsDemo ? "Yeni ilanlar" : "İlanlar";
      if (label) label.textContent = t;
      else if (h) h.textContent = t;
    } catch (e) {}
  }

  function buildFeaturedCard(item) {
    var id = idKey(item);
    var title = item.title != null ? String(item.title) : "İsimsiz ilan";
    var loc = locationLine(item);

    var link = document.createElement("a");
    link.className = "featured-card featured-card--premium";
    link.href = featuredCardHref(item);
    if (id) link.setAttribute("data-listing-id", id);

    var wrap = document.createElement("div");
    wrap.className = "featured-card__media-wrap";

    var badgeOne = document.createElement("span");
    badgeOne.className = "featured-card__badge-one";
    badgeOne.textContent = "Öne Çıkan";
    wrap.appendChild(badgeOne);

    var thumb = pickThumbUrl(item);
    if (thumb) {
      var media = document.createElement("div");
      media.className = "featured-card__media";
      var img = document.createElement("img");
      img.src = thumb;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);
      wrap.appendChild(media);
    } else {
      var ph = document.createElement("div");
      ph.className = "featured-card__media featured-card__media--placeholder";
      ph.setAttribute("aria-hidden", "true");
      wrap.appendChild(ph);
    }

    link.appendChild(wrap);

    var body = document.createElement("div");
    body.className = "featured-card__body";

    var priceEl = document.createElement("div");
    priceEl.className = "featured-card__price";
    priceEl.textContent = formatTry(item.price);

    var titleEl = document.createElement("p");
    titleEl.className = "featured-card__title";
    titleEl.textContent = title;

    var meta = document.createElement("p");
    meta.className = "featured-card__meta";
    meta.textContent = loc;

    body.appendChild(priceEl);
    body.appendChild(titleEl);
    body.appendChild(meta);
    link.appendChild(body);

    return link;
  }

  function renderFeaturedStrip(rows) {
    var rowEl = document.getElementById("homeFeaturedRow");
    var emptyEl = document.getElementById("homeFeaturedEmpty");
    if (!rowEl || !emptyEl) return;

    var list = selectFeaturedList(rows || []);

    while (rowEl.firstChild) rowEl.removeChild(rowEl.firstChild);

    if (list.length === 0) {
      emptyEl.hidden = false;
      rowEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    rowEl.hidden = false;
    list.forEach(function (item) {
      rowEl.appendChild(buildFeaturedCard(item));
    });
  }

  function buildCard(item) {
    var id = item._id != null ? String(item._id) : item.id != null ? String(item.id) : "";
    var title = item.title != null ? String(item.title) : "İsimsiz ilan";
    var descShort = shortDescription(item.description);

    var art = document.createElement("article");
    art.className = "listing-card listing-card--api-feed";
    if (id) {
      art.setAttribute("data-id", id);
      art.setAttribute("data-listing-id", id);
      art.style.cursor = "pointer";
      art.setAttribute("role", "link");
      art.setAttribute("tabindex", "0");
      art.addEventListener("click", function () {
        window.location.href = gridListingHref(id);
      });
      art.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = gridListingHref(id);
        }
      });
    }

    var inner = document.createElement("div");
    inner.className = "listing-card__link listing-card__link--api";

    var thumb = pickThumbUrl(item);
    var mediaWrap = document.createElement("div");
    mediaWrap.className = "listing-card__media-wrap";
    if (showKurumsalBadge(item)) {
      var kurumsal = document.createElement("span");
      kurumsal.className = "listing-card__kurumsal-badge";
      kurumsal.textContent = "Kurumsal";
      kurumsal.setAttribute("aria-hidden", "true");
      mediaWrap.appendChild(kurumsal);
    }
    var badges = document.createElement("div");
    badges.className = "jetle-badges";
    appendPromotionBadges(badges, item);
    if (badges.firstChild) mediaWrap.appendChild(badges);

    if (thumb) {
      var media = document.createElement("div");
      media.className = "listing-card__media";
      var img = document.createElement("img");
      img.src = thumb;
      img.alt = title;
      img.width = CARD_IMG_W;
      img.height = CARD_IMG_H;
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);
      mediaWrap.appendChild(media);
    } else {
      var ph = document.createElement("div");
      ph.className = "listing-card__media";
      ph.setAttribute("aria-hidden", "true");
      mediaWrap.appendChild(ph);
    }
    inner.appendChild(mediaWrap);

    var body = document.createElement("div");
    body.className = "listing-card__body";

    var priceEl = document.createElement("div");
    priceEl.className = "listing-card__price";
    priceEl.textContent = formatTry(item.price);

    var titleEl = document.createElement("h3");
    titleEl.className = "listing-card__title";
    titleEl.textContent = title;

    var meta = document.createElement("p");
    meta.className = "listing-card__meta listing-card__meta--citytime listing-card__meta--loc";
    meta.textContent = cityAndTimeLine(item);

    body.appendChild(priceEl);
    body.appendChild(titleEl);
    body.appendChild(meta);

    if (descShort) {
      var descEl = document.createElement("p");
      descEl.className = "listing-card__desc";
      descEl.textContent = descShort;
      body.appendChild(descEl);
    }

    inner.appendChild(body);
    art.appendChild(inner);
    return art;
  }

  function setEmptyState(emptyBox, titleEl, subEl, show, titleText, subText) {
    if (!emptyBox) return;
    emptyBox.hidden = !show;
    if (titleEl && titleText != null) titleEl.textContent = titleText;
    if (subEl && subText != null) subEl.textContent = subText;
  }

  function updateResultsInfo(infoEl, totalFiltered, shown) {
    if (!infoEl) return;
    if (totalFiltered === 0) {
      infoEl.textContent = "";
      return;
    }
    if (shown >= totalFiltered) {
      infoEl.textContent = "Toplam " + totalFiltered + " ilan";
    } else {
      infoEl.textContent = "Gösterilen " + shown + " / " + totalFiltered + " ilan";
    }
  }

  function updatePager(totalFiltered, shown) {
    var pager = document.getElementById("listingsPager");
    if (!pager) return;
    pager.hidden = totalFiltered === 0 || shown >= totalFiltered;
  }

  function appendPage(grid, rows) {
    rows.forEach(function (item) {
      grid.appendChild(buildCard(item));
    });
  }

  function appendNextLazyChunk(grid, info) {
    var displayRows = getGridDisplayRows();
    if (!displayRows.length || shownCount >= displayRows.length) return;
    var next = displayRows.slice(shownCount, shownCount + HOME_LAZY_BATCH_SIZE);
    shownCount += next.length;
    appendPage(grid, next);
    updateResultsInfo(info, displayRows.length, shownCount);
    updatePager(displayRows.length, shownCount);
  }

  function queueLazyChunk(grid, info) {
    if (lazyLoadQueued) return;
    lazyLoadQueued = true;
    var run = function () {
      lazyLoadQueued = false;
      appendNextLazyChunk(grid, info);
    };
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(run, { timeout: 320 });
    } else {
      setTimeout(run, 140);
    }
  }

  function applyMainView(opts) {
    opts = opts || {};
    var resetShown = opts.resetShown !== false;
    if (!listingsFetchSettled) return;

    var grid = document.getElementById("listingsGrid");
    var emptyBox = document.getElementById("emptyResults");
    var emptyTitle = document.getElementById("emptyResultsTitle");
    var emptySub = document.getElementById("emptyResultsSub");
    var info = document.getElementById("resultsInfo");

    if (!grid) return;

    if (apiRows.length === 0) {
      apiRows = FAKE_GRID_LISTINGS.slice();
      homeGridIsDemo = true;
    }

    renderFeaturedStrip(apiRows);
    syncHomeSectionHeading();

    var displayRows = getGridDisplayRows();

    if (displayRows.length === 0) {
      grid.innerHTML = "";
      shownCount = 0;
      updatePager(0, 0);
      setEmptyState(
        emptyBox,
        emptyTitle,
        emptySub,
        true,
        "İlan bulunamadı",
        "Seçtiğiniz kriterlere uygun sonuç yok. Filtreleri genişletmeyi deneyin."
      );
      if (info) info.textContent = "";
      return;
    }

    setEmptyState(emptyBox, emptyTitle, emptySub, false, "", "");

    if (resetShown) {
      shownCount = Math.min(HOME_INITIAL_RENDER_COUNT, displayRows.length);
      grid.innerHTML = "";
      appendPage(grid, displayRows.slice(0, shownCount));
    }

    updateResultsInfo(info, displayRows.length, shownCount);
    updatePager(displayRows.length, shownCount);

    try {
      window.__JETLE_HOME_LISTINGS__ = {
        total: displayRows.length,
        totalAll: apiRows.length,
        pageSize: HOME_LAZY_BATCH_SIZE,
        shown: function () {
          return shownCount;
        }
      };
    } catch (err) {}
  }

  function wireLoadMore(grid, info) {
    var btn = document.getElementById("listingsLoadMore");
    if (!btn || btn.getAttribute("data-wired") === "1") return;
    btn.setAttribute("data-wired", "1");
    btn.addEventListener("click", function () {
      queueLazyChunk(grid, info);
    });

    var pager = document.getElementById("listingsPager");
    if (pager && typeof window.IntersectionObserver === "function") {
      if (infiniteObserver) infiniteObserver.disconnect();
      infiniteObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) queueLazyChunk(grid, info);
          });
        },
        { root: null, rootMargin: "280px 0px", threshold: 0.01 }
      );
      infiniteObserver.observe(pager);
    } else if (!scrollFallbackWired) {
      scrollFallbackWired = true;
      window.addEventListener(
        "scroll",
        function () {
          var pagerEl = document.getElementById("listingsPager");
          if (!pagerEl || pagerEl.hidden) return;
          var rect = pagerEl.getBoundingClientRect();
          if (rect.top < window.innerHeight + 260) queueLazyChunk(grid, info);
        },
        { passive: true }
      );
    }
  }

  function wireMarketplaceOnce(grid, info) {
    var toolbar = document.getElementById("homeMarketToolbar");
    if (!toolbar || toolbar.getAttribute("data-wired") === "1") return;
    toolbar.setAttribute("data-wired", "1");

    var kwInput = document.getElementById("homeListingKeyword");
    var searchBtn = document.getElementById("homeListingSearchBtn");

    function runHomeSearch() {
      var catEl = document.getElementById("homeHeroCategory");
      var cityEl = document.getElementById("homeHeroCity");
      if (catEl) filterCategory = String(catEl.value || "").toLowerCase();
      if (cityEl) filterCity = cityEl.value || "";
      if (kwInput) filterKeyword = kwInput.value || "";
      syncCategoryChips();
      syncSearchInputs();
      pushUrlFilters();
      if (window.JetleMarket && typeof JetleMarket.setSearchQuery === "function") {
        try {
          JetleMarket.setSearchQuery(filterKeyword);
        } catch (err) {}
      } else {
        applyMainView({ resetShown: true });
      }
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        runHomeSearch();
      });
    }
    if (kwInput) {
      kwInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          runHomeSearch();
        }
      });
    }

    var catSel = document.getElementById("homeHeroCategory");
    if (catSel) {
      catSel.addEventListener("change", function () {
        filterCategory = String(catSel.value || "").toLowerCase();
        syncCategoryChips();
        pushUrlFilters();
        applyMainView({ resetShown: true });
      });
    }
    var citySel = document.getElementById("homeHeroCity");
    if (citySel) {
      citySel.addEventListener("change", function () {
        filterCity = citySel.value || "";
        pushUrlFilters();
        applyMainView({ resetShown: true });
      });
    }

    document.querySelectorAll(".home-cat-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        filterCategory = chip.getAttribute("data-home-cat") || "";
        syncCategoryChips();
        syncHeroCategorySelect();
        pushUrlFilters();
        applyMainView({ resetShown: true });
      });
    });

    document.querySelectorAll(".home-cat-block").forEach(function (blk) {
      blk.addEventListener("click", function () {
        filterCategory = blk.getAttribute("data-home-cat") || "";
        syncCategoryChips();
        syncHeroCategorySelect();
        pushUrlFilters();
        applyMainView({ resetShown: true });
      });
    });

    window.addEventListener("jetle-home-api-search", function (ev) {
      var q = ev && ev.detail && ev.detail.q != null ? String(ev.detail.q) : "";
      filterKeyword = q;
      syncSearchInputs();
      pushUrlFilters();
      syncCategoryChips();
      syncHeroCategorySelect();
      if (listingsFetchSettled) applyMainView({ resetShown: true });
    });

    wireLoadMore(grid, info);
  }

  function loadHomeListingsFromApi() {
    if (!document.body || document.body.getAttribute("data-page") !== "home") return;

    var grid = document.getElementById("listingsGrid");
    var emptyBox = document.getElementById("emptyResults");
    var emptyTitle = document.getElementById("emptyResultsTitle");
    var emptySub = document.getElementById("emptyResultsSub");
    var info = document.getElementById("resultsInfo");
    var loadEl = document.getElementById("homeListingsLoading");

    if (!grid) return;

    readUrlFilters();
    syncSearchInputs();
    syncCategoryChips();
    listingsFetchSettled = false;
    wireMarketplaceOnce(grid, info);

    var url = resolveListingsUrl();

    if (info) info.textContent = "İlanlar yükleniyor…";

    fetch(url, {
      method: "GET",
      credentials: "omit",
      cache: "force-cache",
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        var rows = normalizeRows(json);
        shownCount = 0;
        listingsFetchSettled = true;

        if (loadEl) loadEl.hidden = true;

        var kwInput = document.getElementById("homeListingKeyword");
        if (kwInput && String(kwInput.value || "").trim()) {
          filterKeyword = kwInput.value || "";
        }

        if (rows.length === 0) {
          apiRows = FAKE_GRID_LISTINGS.slice();
          homeGridIsDemo = true;
        } else {
          apiRows = rows;
          homeGridIsDemo = false;
        }

        applyMainView({ resetShown: true });
        setTimeout(function () {
          syncHeroCityFromSidebar();
          syncHomeHeroCitySelect();
        }, 0);
        setTimeout(function () {
          syncHeroCityFromSidebar();
          syncHomeHeroCitySelect();
        }, 650);
      })
      .catch(function (err) {
        console.log("[JETLE][home-api-listings]", err);
        if (loadEl) loadEl.hidden = true;
        apiRows = FAKE_GRID_LISTINGS.slice();
        homeGridIsDemo = true;
        shownCount = 0;
        listingsFetchSettled = true;
        setEmptyState(emptyBox, emptyTitle, emptySub, false, "", "");
        if (info) info.textContent = "";
        applyMainView({ resetShown: true });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHomeListingsFromApi);
  } else {
    loadHomeListingsFromApi();
  }
})();
