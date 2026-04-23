/**
 * JETLE v2 — tek merkezden dummy veri ve ilan yaşam döngüsü.
 * Üretimde backend ile değiştirilmek üzere yüzey API’si sabit tutuldu.
 */
(function () {
  "use strict";

  var KEYS = {
    LISTINGS: "jetle_v2_listings_v6",
    COMPLAINTS: "jetle_v2_complaints",
    ADS: "jetle_v2_ads",
    MESSAGES: "jetle_v2_messages",
    COUNTERS: "jetle_v2_counters",
    FAVORITES: "jetle_v2_favorites",
    USER_PACKAGES: "jetle_v2_user_packages",
    USER_ENTITLEMENTS: "jetle_v2_user_entitlements_v1"
  };
  var USERS_KEY = "jetle_v2_users";
  var SESSION_KEY = "jetle_v2_session";
  /** auth.js ile aynı anahtar: oturum JSON’u dışında kalıcı Bearer token */
  var ACCESS_TOKEN_LS_KEY = "jetle_v2_access_token";
  var BACKEND_FLAG_KEY = "jetle_v2_use_backend_api";
  var API_BASE_LS_KEY = "jetle_v2_api_base_url";
  /** Tüm API istekleri — göreli `/api/...` kullanılmaz; her zaman mutlak kök. */
  var API_BASE = "https://jetle-online-production.up.railway.app";
  const ME_ENDPOINT = "/api/auth/me";

  function isUnsafeApiBaseUrl(s) {
    var u = String(s || "").trim().toLowerCase();
    if (!u) return true;
    if (u.indexOf("localhost") !== -1 || u.indexOf("127.0.0.1") !== -1) return true;
    if (u === "/" || u.charAt(0) === ".") return true;
    return false;
  }

  /**
   * Tek API kökü: meta / __JETLE_API_BASE__ / localStorage (localhost ve göreli değerler yok sayılır).
   */
  function resolveJetleApiBaseUrl() {
    if (typeof window === "undefined") return API_BASE;
    try {
      var inj = window.__JETLE_API_BASE__;
      if (inj != null && String(inj).trim() && !isUnsafeApiBaseUrl(inj)) return String(inj).trim().replace(/\/+$/, "");
    } catch (e0) {}
    try {
      var meta = document.querySelector('meta[name="jetle-api-base"]');
      var mc = meta && meta.getAttribute("content");
      if (mc != null && String(mc).trim() && !isUnsafeApiBaseUrl(mc)) return String(mc).trim().replace(/\/+$/, "");
    } catch (e1) {}
    try {
      var ls = localStorage.getItem(API_BASE_LS_KEY);
      if (ls != null && String(ls).trim() && !isUnsafeApiBaseUrl(ls)) return String(ls).trim().replace(/\/+$/, "");
    } catch (e3) {}
    return API_BASE;
  }

  /**
   * Backend migration boundary:
   * - keep local strategy as default to avoid breaking current UI
   * - flip `useBackend` to true in migration phase
   * - move methods one-by-one to HTTP transport
   */
  var API_GATEWAY = {
    useBackend: true,
    baseUrl: resolveJetleApiBaseUrl(),
    endpoints: {
      auth: {
        register: "/api/auth/register",
        login: "/api/auth/login",
        logout: "/api/auth/logout",
        me: ME_ENDPOINT
      },
      listings: {
        list: "/api/listings",
        detail: "/api/listings/:id",
        create: "/api/listings",
        update: "/api/listings/:id",
        status: "/api/listings/:id/status",
        remove: "/api/listings/:id"
      }
    }
  };

  function apiRequestRoot() {
    var u = API_GATEWAY.baseUrl && String(API_GATEWAY.baseUrl).trim();
    if (!u || !/^https?:\/\//i.test(u)) return API_BASE.replace(/\/+$/, "");
    return u.replace(/\/+$/, "");
  }

  function httpRequest(method, url, body, token) {
    var full = apiRequestRoot() + (String(url || "").indexOf("/") === 0 ? url : "/" + url);
    var headers = { "Content-Type": "application/json" };
    var tk =
      token != null && String(token).trim() !== "" ? String(token).trim() : getAccessTokenFromSession();
    if (tk) headers.Authorization = "Bearer " + tk;
    return fetch(full, {
      method: method,
      headers: headers,
      credentials: "include",
      body: body == null ? undefined : JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () {
        return {};
      }).then(function (data) {
        if (!res.ok) {
          var msg = data && data.message ? data.message : "HTTP " + res.status;
          throw new Error(msg);
        }
        return data;
      });
    });
  }

  function backendEnabled() {
    var ls = localStorage.getItem(BACKEND_FLAG_KEY);
    if (ls === "1") return true;
    if (ls === "0") return false;
    return !!API_GATEWAY.useBackend;
  }

  function readStorageJson(storage, key, fallback) {
    try {
      var raw = storage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeStorageJson(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  function clearAuthStorage() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    try {
      localStorage.removeItem(ACCESS_TOKEN_LS_KEY);
    } catch (e2) {}
    try {
      localStorage.removeItem("token");
    } catch (e4) {}
  }

  function readAuthState() {
    var sessionState = readStorageJson(sessionStorage, SESSION_KEY, null);
    if (sessionState && typeof sessionState === "object") return sessionState;
    var localState = readStorageJson(localStorage, SESSION_KEY, null);
    if (localState && typeof localState === "object") return localState;
    return null;
  }

  function writeAuthState(state, remember) {
    var payload = state && typeof state === "object" ? state : null;
    clearAuthStorage();
    if (!payload) return null;
    payload.persist = !!remember;
    payload.at = payload.at || new Date().toISOString();
    var hasBackendToken = !!(payload.accessToken && backendEnabled());
    var useLocal = !!remember || hasBackendToken;
    writeStorageJson(useLocal ? localStorage : sessionStorage, SESSION_KEY, payload);
    return payload;
  }

  /** Tüm API istekleri için Bearer: önce `token`, sonra jetle_v2_access_token, sonra oturum. */
  function getAccessTokenFromSession() {
    try {
      var ls = localStorage.getItem("token") || localStorage.getItem(ACCESS_TOKEN_LS_KEY) || "";
      if (ls) return String(ls).trim();
    } catch (e0) {}
    var s = readAuthState();
    return s && s.accessToken ? String(s.accessToken).trim() : "";
  }

  /** GET/HEAD için Content-Type ekleme; POST JSON için opts.withJsonContentType === true */
  function buildFetchAuthHeaders(extra, opts) {
    opts = opts || {};
    var h = { Accept: "application/json" };
    if (opts.withJsonContentType) h["Content-Type"] = "application/json";
    if (extra && typeof extra === "object") {
      Object.keys(extra).forEach(function (k) {
        h[k] = extra[k];
      });
    }
    var tk = getAccessTokenFromSession();
    if (tk) h.Authorization = "Bearer " + tk;
    return h;
  }

  function syncBackendRequest(method, url, body) {
    try {
      var xhr = new XMLHttpRequest();
      var full = apiRequestRoot() + (String(url || "").indexOf("/") === 0 ? url : "/" + url);
      xhr.open(method, full, false);
      xhr.setRequestHeader("Content-Type", "application/json");
      var tk = getAccessTokenFromSession();
      if (tk) xhr.setRequestHeader("Authorization", "Bearer " + tk);
      xhr.withCredentials = true;
      xhr.send(body == null ? null : JSON.stringify(body));
      var data = {};
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch (e) {}
      if (xhr.status >= 200 && xhr.status < 300) return { ok: true, status: xhr.status, data: data };
      var attemptedUrl = "";
      try {
        attemptedUrl = apiRequestRoot() + (String(url || "").indexOf("/") === 0 ? url : "/" + url);
      } catch (eu) {}
      var errMsg = (data && data.message) || "İstek başarısız.";
      if (xhr.status === 0 && !data.message) {
        errMsg =
          "Sunucuya ulaşılamadı (HTTP 0). API kökü veya CORS ayarını kontrol edin." +
          (attemptedUrl ? " — " + attemptedUrl : "");
      }
      return {
        ok: false,
        status: xhr.status,
        code: data && data.code ? String(data.code) : "",
        details: data && data.details ? data.details : null,
        message: errMsg
      };
    } catch (e) {
      var fullUrl = "";
      try {
        fullUrl = apiRequestRoot() + (String(url || "").indexOf("/") === 0 ? url : "/" + url);
      } catch (e3) {}
      var em = e && e.message ? String(e.message) : "Ağ hatası";
      return {
        ok: false,
        status: 0,
        message: "Sunucuya ulaşılamadı: " + em + (fullUrl ? " — " + fullUrl : "")
      };
    }
  }

  var STATUS = {
    DRAFT: "draft",
    APPROVED: "approved",
    PENDING: "pending",
    REJECTED: "rejected",
    PASSIVE: "passive"
  };

  function sanitizeText(input, maxLen) {
    if (input == null) return "";
    var s = String(input).replace(/[\u0000-\u001F\u007F]/g, "").trim();
    if (maxLen && s.length > maxLen) s = s.slice(0, maxLen);
    return s;
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCounters() {
    var c = readJson(KEYS.COUNTERS, { listingSeq: 10000 });
    if (typeof c.listingSeq !== "number") c.listingSeq = 10000;
    return c;
  }

  function nextListingNo() {
    var c = getCounters();
    c.listingSeq += 1;
    writeJson(KEYS.COUNTERS, c);
    return "JET-" + c.listingSeq;
  }

  function buildSeedListings() {
    var vSpec = function (o) {
      return o;
    };
    return [
      seedVehicle("v-1", "2019 Volkswagen Golf 1.5 TSI Comfortline", 985000, "İstanbul", "Kadıköy", "vasita-otomobil", "Otomobil", "Sahibinden", "Tek sahibinden, ekspertiz raporu ve servis kayıtları mevcut.", "jv1", true, vSpec({
        Marka: "Volkswagen", Seri: "Golf", Model: "1.5 TSI", Yıl: "2019", "Vasıta türü": "Otomobil", KM: "40.001 – 60.000 km", "Yakıt tipi": "Benzin", Vites: "Otomatik", "Araç durumu": "İkinci El", "Kasa tipi": "Hatchback", "Motor hacmi": "1500 cc", "Motor gücü": "150 hp", Çekiş: "Önden Çekiş", Renk: "Gri", Garanti: "Hayır", "Ağır hasar kaydı": "Hayır", "Plaka / Uyruk": "Türkiye Plakalı", Takas: "Evet", Kimden: "Sahibinden"
      })),
      seedVehicle("v-2", "2021 BMW 320i M Sport — garanti devam", 2150000, "Ankara", "Çankaya", "vasita-otomobil", "Otomobil", "Mağaza", "Yetkili servis bakımlı, iç döşeme deri.", "jv2", false, vSpec({
        Marka: "BMW", Seri: "3 Serisi", Model: "320i", Yıl: "2021", "Vasıta türü": "Otomobil", KM: "20.001 – 50.000 km", "Yakıt tipi": "Benzin", Vites: "Otomatik", "Araç durumu": "İkinci El", "Kasa tipi": "Sedan", "Motor hacmi": "2000 cc", "Motor gücü": "180 hp", Çekiş: "Arkadan İtiş", Renk: "Siyah", Garanti: "Evet", "Ağır hasar kaydı": "Hayır", "Plaka / Uyruk": "Türkiye Plakalı", Takas: "Hayır", Kimden: "Mağazadan"
      })),
      seedVehicle("v-3", "2021 Toyota RAV4 Hybrid AWD X-Pack", 1890000, "İzmir", "Karşıyaka", "vasita-suv", "Arazi, SUV & Pickup", "Mağaza", "Hibrit batarya garantisi devam eder.", "jv3", true, vSpec({
        Marka: "Toyota", Seri: "RAV4", Model: "2.5 Hybrid", Yıl: "2021", "Vasıta türü": "Arazi, SUV & Pickup", KM: "20.001 – 50.000 km", "Yakıt tipi": "Hibrit", Vites: "Otomatik", "Araç durumu": "İkinci El", "Kasa tipi": "SUV", "Motor hacmi": "2500 cc", "Motor gücü": "180 hp", Çekiş: "AWD", Renk: "Beyaz", Garanti: "Evet", "Ağır hasar kaydı": "Hayır", "Plaka / Uyruk": "Türkiye Plakalı", Takas: "Evet", Kimden: "Yetkili Bayiden"
      })),
      seedVehicle("v-4", "Tesla Model 3 Long Range AWD", 1650000, "Bursa", "Nilüfer", "vasita-elektrik", "Elektrikli Araçlar", "Sahibinden", "Yazılım güncel, Supercharger uyumlu.", "jv4", false, vSpec({
        Marka: "Tesla", Seri: "Model 3", Model: "Long Range", Yıl: "2022", "Vasıta türü": "Elektrikli Araçlar", KM: "20.001 – 50.000 km", "Yakıt tipi": "Elektrik", Vites: "Otomatik", "Araç durumu": "İkinci El", "Kasa tipi": "Sedan", "Motor hacmi": "2000 cc", "Motor gücü": "Elektrik motoru", Çekiş: "AWD", Renk: "Siyah", Garanti: "Hayır", "Ağır hasar kaydı": "Hayır", "Plaka / Uyruk": "Türkiye Plakalı", Takas: "Hayır", Kimden: "Sahibinden"
      })),
      seedVehicle("v-5", "Mercedes-Benz Sprinter 316 CDI Panelvan", 1180000, "Kocaeli", "İzmit", "vasita-ticari", "Ticari Araçlar", "Mağaza", "Filo çıkışlı, bakımlı.", "jv5", false, vSpec({
        Marka: "Mercedes-Benz", Seri: "Sprinter", Model: "316 CDI", Yıl: "2019", "Vasıta türü": "Ticari Araçlar", KM: "160.001 – 200.000 km", "Yakıt tipi": "Dizel", Vites: "Manuel", "Araç durumu": "İkinci El", "Kasa tipi": "Panelvan", "Motor hacmi": "2000 cc", "Motor gücü": "150 hp", Çekiş: "Arkadan İtiş", Renk: "Beyaz", Garanti: "Hayır", "Ağır hasar kaydı": "Hayır", "Plaka / Uyruk": "Türkiye Plakalı", Takas: "Hayır", Kimden: "Mağazadan"
      })),
      seedVehicle("v-6", "Ford Transit Custom Minibüs 9+1", 920000, "Mersin", "Yenişehir", "vasita-minivan", "Minivan & Panelvan", "Sahibinden", "Turizm ruhsatlı, klima çalışır.", "jv6", false, vSpec({
        Marka: "Ford", Seri: "Transit Custom", Model: "320 L2", Yıl: "2018", "Vasıta türü": "Minivan & Panelvan", KM: "200.000+ km", "Yakıt tipi": "Dizel", Vites: "Manuel", "Araç durumu": "İkinci El", "Kasa tipi": "Panelvan", Renk: "Gümüş", "Motor hacmi": "2000 cc", "Motor gücü": "130 hp", Çekiş: "Önden Çekiş", Garanti: "Hayır", "Ağır hasar kaydı": "Hayır", "Plaka / Uyruk": "Türkiye Plakalı", Takas: "Evet", Kimden: "Sahibinden"
      })),
      seedEstate("e-1", "Caddebostan'da deniz manzaralı 3+1 satılık", 18500000, "İstanbul", "Kadıköy", "emlak-konut", "Konut", "Mağaza", "Site içi güvenlik, kapalı otopark.", "je1", true, {
        "Emlak tipi": "Satılık Daire", "m² brüt": "165", "m² net": "145", "Oda sayısı": "3+1", "Bina yaşı": "8", "Bulunduğu kat": "7", "Kat sayısı": "12", Isıtma: "Kombi Doğalgaz", "Banyo sayısı": "2", Mutfak: "Kapalı", Balkon: "Evet", Asansör: "Evet", Otopark: "Evet", Eşyalı: "Hayır", "Kullanım durumu": "Boş", "Site içerisinde": "Evet", "Site adı": "Örnek Park", Aidat: "3.200 ₺", "Krediye uygun": "Evet", "Tapu durumu": "Kat Mülkiyetli", Depozito: "İstenmiyor", Kimden: "Emlak Ofisi"
      }),
      seedEstate("e-2", "Çankaya merkezde 2+1 kiralık daire", 42000, "Ankara", "Çankaya", "emlak-konut", "Konut", "Mağaza", "Metroya yürüme mesafesi.", "je2", false, {
        "Emlak tipi": "Kiralık Daire", "m² brüt": "95", "m² net": "85", "Oda sayısı": "2+1", "Bina yaşı": "12", "Bulunduğu kat": "3", "Kat sayısı": "5", Isıtma: "Merkezi Sistem", "Banyo sayısı": "1", Mutfak: "Açık", Balkon: "Evet", Asansör: "Hayır", Otopark: "Yok", Eşyalı: "Evet", "Kullanım durumu": "Boş", "Site içerisinde": "Hayır", "Site adı": "—", Aidat: "850 ₺", "Krediye uygun": "Hayır", "Tapu durumu": "Kat Mülkiyetli", Depozito: "42.000 ₺", Kimden: "Emlak Ofisi"
      }),
      seedEstate("e-3", "Konya yolu üzeri yatırımlık tarla", 6200000, "Konya", "Selçuklu", "emlak-arsa", "Arsa", "Sahibinden", "Yola cephe, sulama hattı 200 m.", "je3", false, {
        "İmar durumu": "Tarla", "Ada no": "1241", "Parsel no": "18", "Pafta no": "K-42", "KAKS (Emsal)": "—", Gabari: "—", "m²": "18.500", "Tapu durumu": "Müstakil Tapulu", Takas: "Evet", Kimden: "Sahibinden"
      }),
      seedEstate("e-4", "Alsancak'ta köşe konum işyeri", 28500000, "İzmir", "Konak", "emlak-isyeri", "İş Yeri", "Mağaza", "Yüksek tavan, vitrin cephe.", "je4", true, {
        "Emlak tipi": "Satılık Dükkan", "m² brüt": "220", "m² net": "205", "Oda sayısı": "Açık plan", "Bina yaşı": "22", "Bulunduğu kat": "Zemin", "Kat sayısı": "4", Isıtma: "Klima", "Banyo sayısı": "2", Mutfak: "Kapalı", Balkon: "Hayır", Asansör: "Evet", Otopark: "Evet", Eşyalı: "Hayır", "Kullanım durumu": "Boş", "Site içerisinde": "Hayır", "Site adı": "—", Aidat: "4.500 ₺", "Krediye uygun": "Evet", "Tapu durumu": "Kat Mülkiyetli", Depozito: "—", Kimden: "Mağazadan"
      }),
      seedEstate("e-5", "Antalya Lara bölge butik otel satılık", 42000000, "Antalya", "Muratpaşa", "emlak-otel", "Otel", "Mağaza", "Denize 400 m, ruhsatlı işletme.", "je5", false, {
        "Yatak sayısı": "28", "Açık alan m²": "450", "Kapalı alan m²": "1200", "Zemin etüdü": "Var", "Yapının durumu": "Faaliyette", "Oda sayısı": "28 oda", "Kat sayısı": "4", Isıtma: "Merkezi Sistem", Otopark: "Evet", "Tapu durumu": "Kat Mülkiyetli", Kimden: "Mağazadan"
      }),
      seedShop("a-1", "iPhone 15 Pro 256 GB — garantili", 52999, "Antalya", "Muratpaşa", "alisveris-telefon", "Telefon", "Mağaza", "Kutulu, pil sağlığı %98.", "ja1", true, {
        Marka: "Apple", Model: "iPhone 15 Pro 256 GB", Durum: "İkinci el", Garanti: "Resmi garanti devam", Fatura: "Var", Takas: "Evet", Kimden: "Mağaza"
      }),
      seedShop("a-2", "MacBook Air M2 16 GB / 512 SSD", 38900, "İstanbul", "Beşiktaş", "alisveris-bilgisayar", "Bilgisayar", "Sahibinden", "Ofis kullanımı, kutulu.", "ja2", false, {
        Marka: "Apple", Model: "MacBook Air M2", Durum: "İkinci el", Garanti: "Sonlandı", Fatura: "Var", Takas: "Hayır", Kimden: "Sahibinden"
      }),
      seedShop("a-3", "Samsung Bespoke buzdolabı — sıfır", 38990, "Gaziantep", "Şahinbey", "alisveris-ev", "Ev Yaşam", "Mağaza", "Faturalı teslimat.", "ja3", false, {
        Marka: "Samsung", Model: "Bespoke RB38", Durum: "Sıfır", Garanti: "2 yıl", Fatura: "Var", Takas: "Hayır", Kimden: "Mağaza"
      }),
      seedService("h-1", "Kombi ve klima bakım — aynı gün", 850, "İstanbul", "Üsküdar", "hizmet-tamir", "Tamir", "Mağaza", "Yetkili ekip.", "jh1", false, {
        "Hizmet türü": "Isıtma / soğutma bakım", "Hizmet bölgesi": "Anadolu yakası", "Deneyim yılı": "12", "Bireysel / Kurumsal": "Kurumsal", "Yerinde hizmet": "Evet", "Online hizmet": "Randevu"
      }),
      seedService("h-2", "Evden eve sigortalı nakliyat", 4500, "Adana", "Seyhan", "hizmet-nakliye", "Nakliye", "Mağaza", "Ambalaj dahil.", "jh2", false, {
        "Hizmet türü": "Evden eve nakliyat", "Hizmet bölgesi": "Adana merkez", "Deneyim yılı": "8", "Bireysel / Kurumsal": "Kurumsal", "Yerinde hizmet": "Evet", "Online hizmet": "Teklif"
      })
    ];
  }

  function seedVehicle(id, title, price, city, district, slug, sub, seller, desc, seed, featured, specs) {
    return baseListing(id, title, price, city, district, slug, sub, "Vasıta", seller, desc, seed, featured, specs, "Örnek Otomotiv");
  }
  function seedEstate(id, title, price, city, district, slug, sub, seller, desc, seed, featured, specs) {
    return baseListing(id, title, price, city, district, slug, sub, "Emlak", seller, desc, seed, featured, specs, "Örnek Emlak");
  }
  function seedShop(id, title, price, city, district, slug, sub, seller, desc, seed, featured, specs) {
    return baseListing(id, title, price, city, district, slug, sub, "Alışveriş", seller, desc, seed, featured, specs, "Örnek Mağaza");
  }
  function seedService(id, title, price, city, district, slug, sub, seller, desc, seed, featured, specs) {
    return baseListing(id, title, price, city, district, slug, sub, "Hizmetler", seller, desc, seed, featured, specs, "Örnek Hizmet A.Ş.");
  }

  function baseListing(id, title, price, city, district, categorySlug, subcategory, category, sellerType, desc, seed, featured, specs, sellerName) {
    var img = "https://picsum.photos/seed/" + seed + "/800/520";
    return {
      id: id,
      listingNo: "",
      title: title,
      category: category,
      subcategory: subcategory,
      categorySlug: categorySlug,
      price: price,
      city: city,
      district: district,
      createdAt: new Date().toISOString(),
      status: STATUS.APPROVED,
      sellerType: sellerType,
      sellerName: sellerName,
      phone: "",
      sellerId: null,
      description: desc,
      images: [img, "https://picsum.photos/seed/" + seed + "b/800/520", "https://picsum.photos/seed/" + seed + "c/400/260"],
      coverImage: img,
      video: null,
      media: {
        images: [img, "https://picsum.photos/seed/" + seed + "b/800/520", "https://picsum.photos/seed/" + seed + "c/400/260"],
        coverImage: img,
        video: null
      },
      location: {
        city: city,
        district: district,
        address: "",
        lat: null,
        lng: null
      },
      featured: featured,
      showcase: !!featured,
      urgent: !!featured,
      highlight: false,
      featuredUntil: null,
      showcaseUntil: null,
      sponsored: false,
      packageType: featured ? "featured" : "basic",
      createdBy: null,
      specs: specs || {}
    };
  }

  function fixSeedDates(list) {
    var dates = [
      "2026-04-12T10:00:00", "2026-04-10T14:30:00", "2026-04-11T09:15:00", "2026-04-08T16:00:00",
      "2026-04-09T11:00:00", "2026-04-07T13:20:00", "2026-04-05T08:45:00", "2026-04-12T18:00:00",
      "2026-04-11T12:00:00", "2026-04-06T15:30:00", "2026-04-12T07:00:00", "2026-04-04T10:00:00",
      "2026-04-03T09:00:00", "2026-04-02T11:00:00", "2026-04-01T15:00:00", "2026-03-30T10:00:00"
    ];
    list.forEach(function (L, i) {
      L.createdAt = dates[i] || L.createdAt;
      L.listingNo = "JET-" + (10001 + i);
    });
    return list;
  }

  function ensureListingsSeeded() {
    var existing = readJson(KEYS.LISTINGS, null);
    if (Array.isArray(existing) && existing.length > 0) return;
    var seed = fixSeedDates(buildSeedListings());
    writeJson(KEYS.LISTINGS, seed);
    writeJson(KEYS.COUNTERS, { listingSeq: 10017 });
    notifyListingsChanged();
  }

  function seedComplaintsIfEmpty() {
    var list = readJson(KEYS.COMPLAINTS, null);
    if (Array.isArray(list) && list.length > 0) return;
    writeJson(KEYS.COMPLAINTS, [
      {
        id: "cmp-1",
        listingId: "v-1",
        listingTitle: "2019 Volkswagen Golf 1.5 TSI Comfortline",
        reason: "Yanıltıcı ilan",
        message: "Fotoğraflar ilanla uyuşmuyor gibi görünüyor.",
        reporterUserId: null,
        reporterType: "guest",
        status: "open",
        createdAt: "2026-04-11T09:00:00"
      },
      {
        id: "cmp-2",
        listingId: "a-2",
        listingTitle: "MacBook Air M2 16 GB / 512 SSD",
        reason: "Fiyat bilgisi yanlış",
        message: "",
        reporterUserId: "u-demo",
        reporterType: "user",
        status: "open",
        createdAt: "2026-04-10T14:00:00"
      }
    ]);
  }

  function seedAdsIfEmpty() {
    var list = readJson(KEYS.ADS, null);
    if (Array.isArray(list) && list.length > 0) return;
    writeJson(KEYS.ADS, [
      { id: "ad-1", title: "Üst banner — Otomobil", slot: "home-top", active: true },
      { id: "ad-2", title: "Yan vitrin — Emlak", slot: "sidebar", active: false }
    ]);
  }

  function seedMessagesIfEmpty() {
    var list = readJson(KEYS.MESSAGES, null);
    if (Array.isArray(list) && list.length > 0) return;
    writeJson(KEYS.MESSAGES, [
      {
        id: "msg-1",
        listingId: "v-1",
        fromUserId: "u-demo",
        toUserId: "seller-ornek-otomotiv",
        message: "Merhaba, araç hâlâ satılık mı?",
        createdAt: "2026-04-12T10:30:00",
        read: false,
        isRead: false
      },
      {
        id: "msg-2",
        listingId: "e-1",
        fromUserId: "seller-ornek-emlak",
        toUserId: "u-demo",
        message: "Aidat ve depozito bilgisini iletebilirim.",
        createdAt: "2026-04-12T11:00:00",
        read: false,
        isRead: false
      }
    ]);
  }

  function slugifyUserToken(val) {
    var map = { ı: "i", İ: "i", ğ: "g", Ğ: "g", ü: "u", Ü: "u", ş: "s", Ş: "s", ö: "o", Ö: "o", ç: "c", Ç: "c" };
    return String(val || "")
      .replace(/[ıİğĞüÜşŞöÖçÇ]/g, function (ch) { return map[ch] || ch; })
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function ensureSellerUsersFromListings() {
    var users = readJson(USERS_KEY, []);
    if (!Array.isArray(users)) users = [];
    var list = readJson(KEYS.LISTINGS, []);
    if (!Array.isArray(list)) list = [];
    var changedUsers = false;
    var changedListings = false;
    list.forEach(function (L) {
      var sellerName = sanitizeText(L.sellerName || "Satıcı", 120) || "Satıcı";
      if (!L.createdBy) {
        L.createdBy = "seller-" + (slugifyUserToken(sellerName) || String(L.id || "anon"));
        L.sellerId = L.createdBy;
        changedListings = true;
      }
      var exists = users.some(function (u) { return u.id === L.createdBy; });
      if (!exists) {
        users.push({
          id: L.createdBy,
          name: sellerName,
          email: slugifyUserToken(sellerName) + "@jetle-satici.local",
          phone: "05321112233",
          role: L.sellerType === "Mağaza" ? "store" : "user",
          city: L.city || "",
          profileType: L.sellerType === "Mağaza" ? "Kurumsal" : "Bireysel",
          active: true,
          status: "active",
          createdAt: "2025-01-01T09:00:00.000Z"
        });
        changedUsers = true;
      }
    });
    if (changedListings) writeJson(KEYS.LISTINGS, list);
    if (changedUsers) writeJson(USERS_KEY, users);
  }

  function backendListingToLegacy(row) {
    if (!row || typeof row !== "object") return null;
    var media = row.media && typeof row.media === "object" ? row.media : {};
    var mediaImages = Array.isArray(media.images) ? media.images.slice(0, 30) : [];
    var imageObjects = mediaImages.map(function (item, idx) {
      if (typeof item === "string") {
        return { assetId: "", originalUrl: item, mediumUrl: item, thumbUrl: item, isCover: idx === 0, order: idx };
      }
      return {
        assetId: sanitizeText(item && (item.assetId || item.id) || "", 80),
        originalUrl: sanitizeText(item && (item.originalUrl || item.url) || "", 5000),
        mediumUrl: sanitizeText(item && (item.mediumUrl || item.originalUrl || item.url) || "", 5000),
        thumbUrl: sanitizeText(item && (item.thumbUrl || item.mediumUrl || item.originalUrl || item.url) || "", 5000),
        isCover: !!(item && item.isCover),
        order: Number(item && item.order || idx)
      };
    }).filter(function (x) { return !!x.mediumUrl; }).sort(function (a, b) { return a.order - b.order; });
    var images = imageObjects.map(function (x) { return x.mediumUrl; });
    var coverObj = imageObjects.find(function (x) { return x.isCover; });
    var coverImage = sanitizeText(media.coverImage || (coverObj && coverObj.mediumUrl) || images[0] || "", 5000);
    return {
      id: String(row.id || row._id || ""),
      listingNo: sanitizeText(row.listingNo || "", 40),
      title: sanitizeText(row.title, 200),
      category: sanitizeText(row.category, 80),
      subcategory: sanitizeText(row.subcategory, 80),
      categorySlug: sanitizeText(row.categorySlug || "", 120),
      price: Math.max(0, Number(row.price) || 0),
      city: sanitizeText(row.city, 60),
      district: sanitizeText(row.district, 60),
      createdAt: row.createdAt || new Date().toISOString(),
      updatedAt: row.updatedAt || null,
      status: sanitizeText(row.status, 24) || STATUS.APPROVED,
      sellerType: sanitizeText(row.sellerType || "Sahibinden", 40),
      sellerName: sanitizeText(row.sellerName || "", 120),
      phone: sanitizeText(row.phone || "", 30),
      sellerId: row.ownerId || row.createdBy || null,
      description: sanitizeText(row.description || "", 8000),
      images: images,
      coverImage: coverImage,
      video: media.video || null,
      media: {
        images: imageObjects,
        coverImage: coverImage,
        video: media.video || null
      },
      location: {
        city: sanitizeText(row.city || "", 60),
        district: sanitizeText(row.district || "", 60),
        address: sanitizeText(row.address || "", 300),
        lat: row.lat == null ? null : Number(row.lat),
        lng: row.lng == null ? null : Number(row.lng)
      },
      featured: !!row.featured,
      showcase: !!row.showcase,
      urgent: !!row.urgent,
      highlight: !!row.highlight,
      featuredUntil: row.featuredUntil || null,
      showcaseUntil: row.showcaseUntil || null,
      sponsored: !!row.sponsored,
      packageType: sanitizeText(row.packageType || "basic", 48) || "basic",
      createdBy: row.ownerId || row.createdBy || null,
      specs: row.specs && typeof row.specs === "object" ? row.specs : {},
      features: row.features && typeof row.features === "object" && !Array.isArray(row.features) ? row.features : null
    };
  }

  function getAllListings() {
    if (backendEnabled()) {
      var remote = syncBackendRequest("GET", "/api/listings");
      if (remote.ok && remote.data && Array.isArray(remote.data.data)) {
        return remote.data.data.map(backendListingToLegacy).filter(Boolean);
      }
      return [];
    }
    ensureListingsSeeded();
    ensureSellerUsersFromListings();
    var list = readJson(KEYS.LISTINGS, []);
    if (!Array.isArray(list)) return [];
    var changed = false;
    var nowTs = Date.now();
    function normalizeUntil(raw) {
      if (!raw) return null;
      var t = new Date(raw).getTime();
      return isFinite(t) ? new Date(t).toISOString() : null;
    }
    list.forEach(function (L) {
      if (!L.status) L.status = STATUS.APPROVED;
      if (!Array.isArray(L.images) || !L.images.length) {
        L.images = [L.image || "https://picsum.photos/seed/jetle-mig/800/520"];
      }
      if (!L.specs) L.specs = {};
      if (L.featured == null) L.featured = false;
      if (L.showcase == null) L.showcase = false;
      if (L.urgent == null) L.urgent = false;
      if (L.highlight == null) L.highlight = false;
      var featuredUntil = normalizeUntil(L.featuredUntil);
      var showcaseUntil = normalizeUntil(L.showcaseUntil);
      if (L.featuredUntil !== featuredUntil) {
        L.featuredUntil = featuredUntil;
        changed = true;
      }
      if (L.showcaseUntil !== showcaseUntil) {
        L.showcaseUntil = showcaseUntil;
        changed = true;
      }
      if (L.featured && featuredUntil && new Date(featuredUntil).getTime() < nowTs) {
        L.featured = false;
        L.featuredUntil = null;
        changed = true;
      }
      if (L.showcase && showcaseUntil && new Date(showcaseUntil).getTime() < nowTs) {
        L.showcase = false;
        L.showcaseUntil = null;
        changed = true;
      }
      if (!L.featured && !L.showcase && (L.packageType === "featured" || L.packageType === "showcase")) {
        L.packageType = "basic";
        changed = true;
      }
      if (L.sponsored == null) L.sponsored = false;
      if (!L.packageType) L.packageType = "basic";
      if (!L.listingNo) L.listingNo = String(L.id || "").slice(0, 14);
      if (!L.subcategory && L.categoryLabel) L.subcategory = L.categoryLabel;
      if (!L.category && L.parentCategory) L.category = L.parentCategory;
    });
    if (changed) writeJson(KEYS.LISTINGS, list);
    return list;
  }

  function notifyListingsChanged() {
    try {
      window.dispatchEvent(new CustomEvent("jetle-listings-changed"));
    } catch (e) {}
  }

  function saveAllListings(list) {
    writeJson(KEYS.LISTINGS, list);
    notifyListingsChanged();
  }

  function getPublicListings() {
    return getAllListings().filter(function (L) {
      return L.status === STATUS.APPROVED;
    }).sort(function (a, b) {
      var ap = a.showcase ? 2 : a.featured ? 1 : 0;
      var bp = b.showcase ? 2 : b.featured ? 1 : 0;
      if (bp !== ap) return bp - ap;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  function slugifySpecForFilter(val) {
    if (!val) return "";
    var map = { ı: "i", İ: "i", ğ: "g", Ğ: "g", ü: "u", Ü: "u", ş: "s", Ş: "s", ö: "o", Ö: "o", ç: "c", Ç: "c" };
    var s = String(val)
      .trim()
      .replace(/[ıİğĞüÜşŞöÖçÇ]/g, function (ch) {
        return map[ch] || ch;
      });
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function buildSearchText(L) {
    var parts = [
      L.title,
      L.description || "",
      L.subcategory || "",
      L.category || "",
      L.city || "",
      L.district || "",
      (L.location && L.location.address) || "",
      L.sellerName || ""
    ];
    var sp = L.specs || {};
    Object.keys(sp).forEach(function (k) {
      parts.push(String(sp[k]));
    });
    [L.housingSpecs, L.landSpecs, L.hotelSpecs, L.realEstateSpecs].forEach(function (group) {
      if (!group || typeof group !== "object") return;
      Object.keys(group).forEach(function (k) {
        parts.push(String(group[k]));
      });
    });
    return parts.join(" \n").toLowerCase();
  }

  function toMarketCard(L) {
    var sp = L.specs || {};
    return {
      id: L.id,
      title: L.title,
      price: L.price,
      city: (L.location && L.location.city) || L.city,
      district: (L.location && L.location.district) || L.district,
      categoryLabel: L.subcategory,
      parentCategory: L.category,
      categorySlug: L.categorySlug,
      brandSlug: slugifySpecForFilter(sp.Marka || ""),
      seriesSlug: slugifySpecForFilter(sp.Seri || ""),
      modelSlug: slugifySpecForFilter(sp.Model || ""),
      createdAt: L.createdAt,
      sellerType: L.sellerType,
      sellerName: L.sellerName || "",
      phone: sanitizeText(L.phone || "", 30),
      coverImage: sanitizeText(L.coverImage || (L.media && L.media.coverImage) || "", 5000),
      video: L.video || (L.media && L.media.video) || null,
      media: L.media || null,
      location: L.location || null,
      createdBy: L.createdBy || null,
      description: L.description,
      image: (L.coverImage || (L.media && L.media.coverImage) || (L.images && L.images.length ? L.images[0] : "")),
      featured: !!L.featured,
      showcase: !!L.showcase,
      urgent: !!L.urgent,
      highlight: !!L.highlight,
      featuredUntil: L.featuredUntil || null,
      showcaseUntil: L.showcaseUntil || null,
      sponsored: !!L.sponsored,
      packageType: L.packageType || "basic",
      searchText: buildSearchText(L),
      specs: L.specs || {},
      housingSpecs: L.housingSpecs || {},
      landSpecs: L.landSpecs || {},
      hotelSpecs: L.hotelSpecs || {},
      realEstateSpecs: L.realEstateSpecs || {}
    };
  }

  function getListingById(id) {
    if (!id) return null;
    /* Demo / dokümantasyon: ?id=listing-1 ilk otomobil ilanına yönlendirilir */
    if (id === "listing-1") id = "v-1";
    if (backendEnabled()) {
      var remote = syncBackendRequest("GET", "/api/listings/" + encodeURIComponent(id));
      if (remote.ok && remote.data && remote.data.data) return backendListingToLegacy(remote.data.data);
      return null;
    }
    var list = getAllListings();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  /** Genel görüntüleme: yalnızca onaylı herkese; bekleyen ve diğer durumlar sahibi veya admin. */
  function getListingForViewer(id, viewer) {
    var L = getListingById(id);
    if (!L) return null;
    if (L.status === STATUS.APPROVED) return L;
    if (!viewer) return null;
    if (viewer.role === "admin") return L;
    if (L.createdBy && viewer.id === L.createdBy) return L;
    return null;
  }

  function getSimilarPublic(id, categorySlug, parentCategory, limit) {
    limit = limit || 4;
    var out = [];
    var seen = {};
    if (id) seen[id] = true;

    function pushFrom(arr) {
      arr.forEach(function (L) {
        if (out.length >= limit) return;
        if (seen[L.id]) return;
        seen[L.id] = true;
        out.push(toMarketCard(L));
      });
    }

    var catRows = null;
    if (backendEnabled() && parentCategory) {
      var remote = syncBackendRequest("GET", "/api/listings?category=" + encodeURIComponent(parentCategory));
      if (remote.ok && remote.data && Array.isArray(remote.data.data)) {
        catRows = remote.data.data.map(backendListingToLegacy).filter(function (L) {
          return L.status === STATUS.APPROVED;
        });
      }
    }

    if (catRows && catRows.length) {
      pushFrom(
        catRows.filter(function (L) {
          return L.id !== id && categorySlug && L.categorySlug === categorySlug;
        })
      );
      if (out.length < limit) {
        pushFrom(
          catRows.filter(function (L) {
            return L.id !== id;
          })
        );
      }
    }

    var pub = getPublicListings();
    if (out.length < limit) {
      pushFrom(
        pub.filter(function (L) {
          return L.id !== id && L.categorySlug === categorySlug;
        })
      );
    }
    if (out.length < limit && parentCategory) {
      pushFrom(
        pub.filter(function (L) {
          return L.id !== id && L.category === parentCategory;
        })
      );
    }
    if (out.length < limit) {
      pushFrom(
        pub.filter(function (L) {
          return L.id !== id;
        })
      );
    }
    return out.slice(0, limit);
  }

  function addComplaint(payload) {
    seedComplaintsIfEmpty();
    var list = readJson(KEYS.COMPLAINTS, []);
    if (!Array.isArray(list)) list = [];
    var reason = sanitizeText(payload.reason, 120);
    var listingId = sanitizeText(payload.listingId, 80);
    var listingTitle = sanitizeText(payload.listingTitle, 240);
    var reporterUserId = sanitizeText(payload.reporterUserId, 80) || null;
    var reporterType = sanitizeText(payload.reporterType, 20) || (reporterUserId ? "user" : "guest");
    var message = sanitizeText(payload.message, 1500);
    if (!reason || !listingId) return { ok: false, code: "invalid_payload" };
    var now = Date.now();
    var spamCutoff = now - 5 * 60 * 1000;
    var hasRecentSame = list.some(function (c) {
      var sameReporter = (c.reporterUserId || null) === (reporterUserId || null) && (c.reporterType || "guest") === reporterType;
      var sameTarget = (c.listingId || "") === listingId && (c.reason || "") === reason;
      var at = new Date(c.createdAt).getTime();
      return sameReporter && sameTarget && isFinite(at) && at >= spamCutoff;
    });
    if (hasRecentSame) return { ok: false, code: "duplicate_recent" };
    var row = {
      id: "cmp-" + Date.now() + "-" + Math.random().toString(36).slice(2, 5),
      listingId: listingId,
      listingTitle: listingTitle,
      reason: reason,
      message: message,
      reporterUserId: reporterUserId,
      reporterType: reporterType,
      status: "open",
      createdAt: new Date().toISOString()
    };
    list.push(row);
    writeJson(KEYS.COMPLAINTS, list);
    return { ok: true, complaint: row };
  }

  function addListing(payload, options) {
    if (backendEnabled()) {
      var remoteCreate = syncBackendRequest("POST", "/api/listings", {
        category: payload.category,
        subcategory: payload.subcategory,
        categorySlug: payload.categorySlug || "",
        sellerName: payload.sellerName || "",
        title: payload.title,
        description: payload.description,
        price: Number(payload.price || 0),
        status: (options && options.status) || "pending",
        phone: payload.phone || "",
        city: payload.city || "",
        district: payload.district || "",
        address: payload.address || (payload.location && payload.location.address) || "",
        lat: payload.lat != null ? payload.lat : payload.location && payload.location.lat,
        lng: payload.lng != null ? payload.lng : payload.location && payload.location.lng,
        media: payload.media || { images: payload.images || [], coverImage: payload.coverImage || "", video: payload.video || null },
        specs: payload.specs || {},
        featured: !!payload.featured,
        showcase: !!payload.showcase,
        urgent: !!payload.urgent,
        highlight: !!payload.highlight,
        featuredUntil: payload.featuredUntil || null,
        showcaseUntil: payload.showcaseUntil || null
      });
      if (!remoteCreate.ok || !remoteCreate.data || !remoteCreate.data.data) {
        return { _backendError: true, response: remoteCreate };
      }
      return backendListingToLegacy(remoteCreate.data.data);
    }
    options = options || {};
    var requestedStatus = sanitizeText(options.status, 20);
    var initialStatus = requestedStatus && Object.keys(STATUS).some(function (k) { return STATUS[k] === requestedStatus; })
      ? requestedStatus
      : STATUS.PENDING;
    var list = getAllListings();
    var id = "l-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    var images = Array.isArray(payload.images) ? payload.images.filter(function (u) {
      return typeof u === "string" && u.indexOf("data:image") === 0;
    }).slice(0, 30) : [];
    if (!images.length) images = ["https://picsum.photos/seed/new" + Date.now() + "/800/520"];
    var coverImage = sanitizeText(payload.coverImage || "", 5000);
    if (!coverImage || images.indexOf(coverImage) === -1) coverImage = images[0] || "";
    var video = payload.video && typeof payload.video === "object" ? {
      url: sanitizeText(payload.video.url, 5000),
      type: sanitizeText(payload.video.type, 80),
      name: sanitizeText(payload.video.name, 160)
    } : null;
    if (video && !video.url) video = null;
    var location = payload.location && typeof payload.location === "object" ? payload.location : {};
    var lat = Number(location.lat != null ? location.lat : payload.lat);
    var lng = Number(location.lng != null ? location.lng : payload.lng);

    var row = {
      id: id,
      listingNo: nextListingNo(),
      title: sanitizeText(payload.title, 200),
      category: sanitizeText(payload.category, 80),
      subcategory: sanitizeText(payload.subcategory, 80),
      categorySlug: sanitizeText(payload.categorySlug, 80),
      price: Math.max(0, Number(payload.price) || 0),
      city: sanitizeText(payload.city, 60),
      district: sanitizeText(payload.district, 60),
      createdAt: new Date().toISOString(),
      status: initialStatus,
      sellerType: sanitizeText(payload.sellerType, 40) || "Sahibinden",
      sellerName: sanitizeText(payload.sellerName, 120),
      phone: sanitizeText(payload.phone, 30),
      sellerId: payload.createdBy || null,
      description: sanitizeText(payload.description, 8000),
      images: images,
      coverImage: coverImage,
      video: video,
      media: {
        images: images.slice(),
        coverImage: coverImage,
        video: video
      },
      location: {
        city: sanitizeText(location.city || payload.city, 60),
        district: sanitizeText(location.district || payload.district, 60),
        address: sanitizeText(location.address || payload.address, 300),
        lat: isNaN(lat) ? null : lat,
        lng: isNaN(lng) ? null : lng
      },
      featured: false,
      showcase: false,
      urgent: false,
      highlight: false,
      featuredUntil: null,
      showcaseUntil: null,
      sponsored: false,
      packageType: "basic",
      createdBy: payload.createdBy || null,
      rejectionReason: "",
      specs: payload.specs && typeof payload.specs === "object" ? sanitizeSpecs(payload.specs) : {},
      housingSpecs: payload.housingSpecs && typeof payload.housingSpecs === "object" ? sanitizeSpecs(payload.housingSpecs) : null,
      landSpecs: payload.landSpecs && typeof payload.landSpecs === "object" ? sanitizeSpecs(payload.landSpecs) : null,
      hotelSpecs: payload.hotelSpecs && typeof payload.hotelSpecs === "object" ? sanitizeSpecs(payload.hotelSpecs) : null,
      realEstateSpecs: payload.realEstateSpecs && typeof payload.realEstateSpecs === "object" ? sanitizeSpecs(payload.realEstateSpecs) : null
    };
    if (!row.housingSpecs || !Object.keys(row.housingSpecs).length) delete row.housingSpecs;
    if (!row.landSpecs || !Object.keys(row.landSpecs).length) delete row.landSpecs;
    if (!row.hotelSpecs || !Object.keys(row.hotelSpecs).length) delete row.hotelSpecs;
    if (!row.realEstateSpecs || !Object.keys(row.realEstateSpecs).length) delete row.realEstateSpecs;
    list.push(row);
    saveAllListings(list);
    return row;
  }

  function createListing(payload) {
    return addListing(payload, { status: STATUS.PENDING });
  }

  function filterListingImageUrls(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(function (u) {
      return typeof u === "string" && (u.indexOf("data:image") === 0 || /^https?:\/\//i.test(u));
    }).slice(0, 30);
  }

  /** Sahibinin gönderdiği güncelleme — tekrar moderasyona düşer; id ve ilan no korunur. */
  function mergeUserListing(listingId, ownerId, payload, options) {
    options = options || {};
    if (backendEnabled()) {
      var remoteUpdate = syncBackendRequest("PUT", "/api/listings/" + encodeURIComponent(listingId), {
        category: payload.category,
        subcategory: payload.subcategory,
        categorySlug: payload.categorySlug || "",
        sellerName: payload.sellerName || "",
        title: payload.title,
        description: payload.description,
        price: Number(payload.price || 0),
        status: sanitizeText(options.status, 20) || "pending",
        phone: payload.phone || "",
        city: payload.city || "",
        district: payload.district || "",
        address: payload.address || (payload.location && payload.location.address) || "",
        lat: payload.lat != null ? payload.lat : payload.location && payload.location.lat,
        lng: payload.lng != null ? payload.lng : payload.location && payload.location.lng,
        media: payload.media || { images: payload.images || [], coverImage: payload.coverImage || "", video: payload.video || null },
        specs: payload.specs || {},
        featured: !!payload.featured,
        showcase: !!payload.showcase,
        urgent: !!payload.urgent,
        highlight: !!payload.highlight,
        featuredUntil: payload.featuredUntil || null,
        showcaseUntil: payload.showcaseUntil || null
      });
      if (!remoteUpdate.ok || !remoteUpdate.data || !remoteUpdate.data.data) return { ok: false, message: remoteUpdate.message || "İlan güncellenemedi." };
      return { ok: true, listing: backendListingToLegacy(remoteUpdate.data.data) };
    }
    var list = getAllListings();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === listingId) {
        idx = i;
        break;
      }
    }
    if (idx === -1) return { ok: false, message: "İlan bulunamadı." };
    var row = list[idx];
    if (row.createdBy !== ownerId) return { ok: false, message: "Bu ilanı düzenleyemezsiniz." };

    var images = filterListingImageUrls(payload.images);
    if (!images.length) images = Array.isArray(row.images) && row.images.length ? row.images.slice() : [];
    if (!images.length) images = ["https://picsum.photos/seed/edit" + Date.now() + "/800/520"];
    var coverImage = sanitizeText(payload.coverImage || "", 5000);
    if (!coverImage || images.indexOf(coverImage) === -1) coverImage = images[0] || "";
    var video = payload.video && typeof payload.video === "object" ? {
      url: sanitizeText(payload.video.url, 5000),
      type: sanitizeText(payload.video.type, 80),
      name: sanitizeText(payload.video.name, 160)
    } : null;
    if (!video || !video.url) video = row.video || null;
    var location = payload.location && typeof payload.location === "object" ? payload.location : {};
    var lat = Number(location.lat != null ? location.lat : payload.lat);
    var lng = Number(location.lng != null ? location.lng : payload.lng);

    row.title = sanitizeText(payload.title, 200);
    row.category = sanitizeText(payload.category, 80);
    row.subcategory = sanitizeText(payload.subcategory, 80);
    row.categorySlug = sanitizeText(payload.categorySlug, 80);
    row.price = Math.max(0, Number(payload.price) || 0);
    row.city = sanitizeText(payload.city, 60);
    row.district = sanitizeText(payload.district, 60);
    row.sellerType = sanitizeText(payload.sellerType, 40) || row.sellerType || "Sahibinden";
    row.sellerName = sanitizeText(payload.sellerName, 120) || row.sellerName;
    row.phone = sanitizeText(payload.phone, 30);
    row.description = sanitizeText(payload.description, 8000);
    row.images = images;
    row.coverImage = coverImage;
    row.video = video;
    row.media = {
      images: images.slice(),
      coverImage: coverImage,
      video: video
    };
    row.location = {
      city: sanitizeText(location.city || payload.city, 60),
      district: sanitizeText(location.district || payload.district, 60),
      address: sanitizeText(location.address || payload.address, 300),
      lat: isNaN(lat) ? (row.location && row.location.lat) || null : lat,
      lng: isNaN(lng) ? (row.location && row.location.lng) || null : lng
    };
    row.specs = payload.specs && typeof payload.specs === "object" ? sanitizeSpecs(payload.specs) : row.specs || {};
    row.housingSpecs = payload.housingSpecs && typeof payload.housingSpecs === "object" ? sanitizeSpecs(payload.housingSpecs) : row.housingSpecs || null;
    row.landSpecs = payload.landSpecs && typeof payload.landSpecs === "object" ? sanitizeSpecs(payload.landSpecs) : row.landSpecs || null;
    row.hotelSpecs = payload.hotelSpecs && typeof payload.hotelSpecs === "object" ? sanitizeSpecs(payload.hotelSpecs) : row.hotelSpecs || null;
    row.realEstateSpecs = payload.realEstateSpecs && typeof payload.realEstateSpecs === "object" ? sanitizeSpecs(payload.realEstateSpecs) : row.realEstateSpecs || null;
    if (!row.housingSpecs || !Object.keys(row.housingSpecs).length) delete row.housingSpecs;
    if (!row.landSpecs || !Object.keys(row.landSpecs).length) delete row.landSpecs;
    if (!row.hotelSpecs || !Object.keys(row.hotelSpecs).length) delete row.hotelSpecs;
    if (!row.realEstateSpecs || !Object.keys(row.realEstateSpecs).length) delete row.realEstateSpecs;
    if (payload.featured != null) row.featured = !!payload.featured;
    if (payload.showcase != null) row.showcase = !!payload.showcase;
    if (payload.urgent != null) row.urgent = !!payload.urgent;
    if (payload.highlight != null) row.highlight = !!payload.highlight;
    if (payload.featuredUntil != null) row.featuredUntil = payload.featuredUntil || null;
    if (payload.showcaseUntil != null) row.showcaseUntil = payload.showcaseUntil || null;

    if (row.status !== STATUS.REJECTED) row.rejectionReason = "";
    row.status = sanitizeText(options.status, 20) || STATUS.PENDING;
    row.updatedAt = new Date().toISOString();
    list[idx] = row;
    saveAllListings(list);
    notifyListingsChanged();
    return { ok: true, listing: row };
  }

  function setListingStatusByOwner(listingId, ownerId, status) {
    var allowed = [STATUS.DRAFT, STATUS.APPROVED, STATUS.PENDING, STATUS.REJECTED, STATUS.PASSIVE];
    if (allowed.indexOf(status) === -1) return { ok: false, message: "Geçersiz durum." };
    if (backendEnabled()) {
      if (String(getCurrentUserId()) !== String(ownerId)) return { ok: false, message: "Bu ilana işlem yetkiniz yok." };
      if (status !== STATUS.PASSIVE && status !== STATUS.PENDING) {
        return { ok: false, message: "Bu durum panelden güncellenemez." };
      }
      var res = syncBackendRequest("PATCH", ME_ENDPOINT + "/listings/" + encodeURIComponent(listingId) + "/status", { status: status });
      if (!res.ok) return { ok: false, message: res.message || "Durum güncellenemedi." };
      var row = res.data && res.data.data;
      notifyListingsChanged();
      return { ok: true, listing: row ? backendListingToLegacy(row) : null };
    }
    var list = getAllListings();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id !== listingId) continue;
      if (list[i].createdBy !== ownerId) return { ok: false, message: "Bu ilana işlem yetkiniz yok." };
      list[i].status = status;
      list[i].updatedAt = new Date().toISOString();
      if (status !== STATUS.REJECTED) list[i].rejectionReason = "";
      saveAllListings(list);
      return { ok: true, listing: list[i] };
    }
    return { ok: false, message: "İlan bulunamadı." };
  }

  function saveDraft(payload, ownerId) {
    if (!payload || typeof payload !== "object") return { ok: false, message: "Taslak verisi bulunamadı." };
    if (payload.id) {
      return mergeUserListing(payload.id, ownerId, payload, { status: STATUS.DRAFT });
    }
    if (!payload.createdBy && ownerId) payload.createdBy = ownerId;
    var row = addListing(payload, { status: STATUS.DRAFT });
    return { ok: true, listing: row };
  }

  function resubmitListing(listingId, ownerId) {
    return setListingStatusByOwner(listingId, ownerId, STATUS.PENDING);
  }

  function republishListing(listingId, ownerId) {
    if (backendEnabled()) {
      return setListingStatusByOwner(listingId, ownerId, STATUS.PENDING);
    }
    var list = getAllListings();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id !== listingId) continue;
      if (list[i].createdBy !== ownerId) return { ok: false, message: "Bu ilana işlem yetkiniz yok." };
      if (list[i].status !== STATUS.PASSIVE) return { ok: false, message: "Yalnızca pasif ilanlar yeniden yayınlanabilir." };
      list[i].status = STATUS.PENDING;
      list[i].updatedAt = new Date().toISOString();
      list[i].rejectionReason = "";
      saveAllListings(list);
      return { ok: true, listing: list[i] };
    }
    return { ok: false, message: "İlan bulunamadı." };
  }

  function sanitizeSpecs(specs) {
    var out = {};
    Object.keys(specs).forEach(function (k) {
      var key = sanitizeText(k, 80);
      if (!key) return;
      var val = sanitizeText(specs[k], 500);
      if (!val) return;
      out[key] = val;
    });
    return out;
  }

  function updateListingStatus(id, status) {
    var allowed = ["draft", "approved", "pending", "rejected", "passive"];
    if (allowed.indexOf(status) === -1) return null;
    var list = getAllListings();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i].status = status;
        saveAllListings(list);
        return list[i];
      }
    }
    return null;
  }

  function updateListingFields(id, patch) {
    var list = getAllListings();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        if (patch.featured != null) list[i].featured = !!patch.featured;
        if (patch.showcase != null) list[i].showcase = !!patch.showcase;
        if (patch.urgent != null) list[i].urgent = !!patch.urgent;
        if (patch.highlight != null) list[i].highlight = !!patch.highlight;
        if (patch.featuredUntil != null) list[i].featuredUntil = patch.featuredUntil || null;
        if (patch.showcaseUntil != null) list[i].showcaseUntil = patch.showcaseUntil || null;
        if (patch.sponsored != null) list[i].sponsored = !!patch.sponsored;
        if (patch.packageType != null) list[i].packageType = sanitizeText(patch.packageType, 48) || "basic";
        list[i].updatedAt = new Date().toISOString();
        saveAllListings(list);
        return list[i];
      }
    }
    return null;
  }

  function deleteListing(id) {
    if (backendEnabled()) {
      var del = syncBackendRequest("DELETE", ME_ENDPOINT + "/listings/" + encodeURIComponent(id));
      notifyListingsChanged();
      return { ok: del.ok, message: del.message || "" };
    }
    var list = getAllListings().filter(function (L) {
      return L.id !== id;
    });
    saveAllListings(list);
    return { ok: true, message: "" };
  }

  function adminFetchListings() {
    if (!backendEnabled()) return { ok: false, message: "Admin paneli sunucu API'si gerektirir." };
    return syncBackendRequest("GET", "/api/admin/listings");
  }

  function adminApproveListing(listingId) {
    if (!backendEnabled()) return { ok: false, message: "Sunucu bağlantısı gerekli." };
    return syncBackendRequest(
      "PUT",
      "/api/admin/listing/" + encodeURIComponent(listingId) + "/approve",
      {}
    );
  }

  function adminRejectListing(listingId) {
    if (!backendEnabled()) return { ok: false, message: "Sunucu bağlantısı gerekli." };
    return syncBackendRequest(
      "PUT",
      "/api/admin/listing/" + encodeURIComponent(listingId) + "/reject",
      {}
    );
  }

  function adminDeleteListing(listingId) {
    if (!backendEnabled()) return { ok: false, message: "Sunucu bağlantısı gerekli." };
    return syncBackendRequest("DELETE", "/api/admin/listing/" + encodeURIComponent(listingId));
  }

  /** Aktif + tarih aralığı uygun kampanya reklamları (placement opsiyonel). */
  function fetchPublicCampaignAds(placementType) {
    if (!backendEnabled()) return [];
    var q = placementType ? "?placementType=" + encodeURIComponent(placementType) : "";
    var r = syncBackendRequest("GET", "/api/ads/public" + q);
    if (!r.ok || !r.data) return [];
    var d = r.data.data;
    return Array.isArray(d) ? d : [];
  }

  function adminListCampaignAds() {
    if (!backendEnabled()) return { ok: false, data: [], message: "Sunucu gerekli." };
    var r = syncBackendRequest("GET", "/api/admin/ads");
    if (!r.ok) return { ok: false, data: [], message: r.message || "Liste alınamadı." };
    var d = r.data && r.data.data;
    return { ok: true, data: Array.isArray(d) ? d : [] };
  }

  function adminCreateCampaignAd(body) {
    if (!backendEnabled()) return { ok: false, message: "Sunucu gerekli." };
    return syncBackendRequest("POST", "/api/admin/ads", body || {});
  }

  function adminUpdateCampaignAd(id, body) {
    if (!backendEnabled()) return { ok: false, message: "Sunucu gerekli." };
    return syncBackendRequest("PUT", "/api/admin/ads/" + encodeURIComponent(id), body || {});
  }

  function adminDeleteCampaignAd(id) {
    if (!backendEnabled()) return { ok: false, message: "Sunucu gerekli." };
    return syncBackendRequest("DELETE", "/api/admin/ads/" + encodeURIComponent(id));
  }

  function adminToggleCampaignAd(id) {
    if (!backendEnabled()) return { ok: false, message: "Sunucu gerekli." };
    return syncBackendRequest("PATCH", "/api/admin/ads/" + encodeURIComponent(id) + "/toggle", {});
  }

  function getListingsByUser(userId) {
    if (backendEnabled()) {
      var remoteMine = syncBackendRequest("GET", ME_ENDPOINT + "/listings");
      if (remoteMine.ok && remoteMine.data && Array.isArray(remoteMine.data.data)) {
        return remoteMine.data.data.map(backendListingToLegacy).filter(Boolean);
      }
      return [];
    }
    return getAllListings().filter(function (L) {
      return L.createdBy === userId;
    }).sort(function (a, b) {
      var ap = a.showcase ? 2 : a.featured ? 1 : 0;
      var bp = b.showcase ? 2 : b.featured ? 1 : 0;
      if (bp !== ap) return bp - ap;
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
  }

  function addDaysIso(days) {
    var d = new Date();
    d.setDate(d.getDate() + (days || 0));
    return d.toISOString();
  }

  function activateDoping(listingId, ownerId, type) {
    var kind = sanitizeText(type, 24);
    if (backendEnabled()) {
      if (String(getCurrentUserId()) !== String(ownerId)) return { ok: false, message: "Bu ilana işlem yetkiniz yok." };
      var res = syncBackendRequest("POST", "/api/doping/activate", { listingId: listingId, type: kind });
      if (!res.ok) return { ok: false, message: res.message || "Doping uygulanamadı." };
      notifyListingsChanged();
      var L = getListingById(listingId);
      return { ok: true, listing: L, message: "Paket aktif edildi." };
    }
    var list = getAllListings();
    for (var i = 0; i < list.length; i++) {
      var L = list[i];
      if (L.id !== listingId) continue;
      if (L.createdBy !== ownerId) return { ok: false, message: "Bu ilana işlem yetkiniz yok." };
      if (L.status !== STATUS.APPROVED) return { ok: false, message: "Doping yalnızca yayındaki ilanlara uygulanır." };
      if (kind === "featured") {
        L.featured = true;
        L.featuredUntil = addDaysIso(7);
        L.packageType = "featured";
      } else if (kind === "showcase") {
        L.showcase = true;
        L.featured = true;
        L.showcaseUntil = addDaysIso(7);
        L.featuredUntil = addDaysIso(7);
        L.packageType = "showcase";
      } else if (kind === "urgent") {
        L.urgent = true;
      } else if (kind === "highlight") {
        L.highlight = true;
      } else {
        return { ok: false, message: "Geçersiz doping türü." };
      }
      L.updatedAt = new Date().toISOString();
      saveAllListings(list);
      return { ok: true, listing: L, message: "Paket aktif edildi." };
    }
    return { ok: false, message: "İlan bulunamadı." };
  }

  function getComplaints() {
    seedComplaintsIfEmpty();
    var list = readJson(KEYS.COMPLAINTS, []);
    if (!Array.isArray(list)) return [];
    return list.map(function (c) {
      if (!c.status) c.status = "open";
      if (!c.reporterType) c.reporterType = c.reporterUserId ? "user" : "guest";
      if (!c.reason) c.reason = "Diğer";
      if (!c.message) c.message = "";
      if (!c.listingTitle) {
        var L = getListingById(c.listingId);
        c.listingTitle = L ? L.title : "İlan";
      }
      return c;
    });
  }

  function updateComplaintStatus(id, status) {
    var allowed = ["open", "reviewing", "resolved", "dismissed"];
    if (allowed.indexOf(status) === -1) return;
    var list = getComplaints();
    list.forEach(function (c) {
      if (c.id === id) c.status = status;
    });
    writeJson(KEYS.COMPLAINTS, list);
  }

  function getAds() {
    seedAdsIfEmpty();
    return readJson(KEYS.ADS, []);
  }

  function toggleAd(id) {
    var list = getAds();
    list.forEach(function (a) {
      if (a.id === id) a.active = !a.active;
    });
    writeJson(KEYS.ADS, list);
  }

  function getMessageThreads() {
    seedMessagesIfEmpty();
    return getConversations(getCurrentUserId());
  }

  function getUserPackages() {
    var map = readJson(KEYS.USER_PACKAGES, {});
    if (!map || typeof map !== "object") return {};
    return map;
  }

  function defaultEntitlements() {
    return {
      storePlan: null,
      storeActiveUntil: null,
      dopingCredits: 0,
      featuredSlots: 0,
      showcaseSlots: 0,
      sponsorSlots: 0,
      bumpCredits: 0,
      extraListingSlots: 0
    };
  }

  function readEntitlementsMap() {
    var raw = readJson(KEYS.USER_ENTITLEMENTS, null);
    if (!raw || typeof raw !== "object") return {};
    return raw;
  }

  function writeEntitlementsMap(map) {
    writeJson(KEYS.USER_ENTITLEMENTS, map);
  }

  function migrateLegacyPackagesToEntitlements() {
    var map = getUserPackages();
    var em = readEntitlementsMap();
    var changed = false;
    Object.keys(map).forEach(function (uid) {
      var v = map[uid];
      if (typeof v !== "string" || v === "basic") return;
      if (!em[uid]) em[uid] = defaultEntitlements();
      var e = em[uid];
      if (e.storePlan) return;
      if (e.featuredSlots || e.showcaseSlots || e.dopingCredits || e.sponsorSlots) return;
      if (v === "store") {
        e.storePlan = "kurumsal_plus";
        e.storeActiveUntil = new Date(Date.now() + 30 * 864e5).toISOString();
        changed = true;
      } else if (v === "showcase") {
        e.storePlan = "pro";
        e.storeActiveUntil = new Date(Date.now() + 30 * 864e5).toISOString();
        changed = true;
      } else if (v === "featured") {
        e.storePlan = "standart";
        e.storeActiveUntil = new Date(Date.now() + 30 * 864e5).toISOString();
        changed = true;
      }
    });
    if (changed) writeEntitlementsMap(em);
  }

  function getEntitlements(userId) {
    if (!userId || userId === "__guest__") return defaultEntitlements();
    migrateLegacyPackagesToEntitlements();
    var em = readEntitlementsMap();
    var e = em[userId];
    if (!e || typeof e !== "object") e = defaultEntitlements();
    var d = defaultEntitlements();
    Object.keys(d).forEach(function (k) {
      if (e[k] == null) return;
      if (k.indexOf("Slots") !== -1 || k === "dopingCredits" || k === "bumpCredits" || k === "extraListingSlots") {
        var n = parseInt(e[k], 10);
        d[k] = isNaN(n) ? 0 : Math.max(0, n);
      } else {
        d[k] = e[k];
      }
    });
    if (d.storeActiveUntil && new Date(d.storeActiveUntil) < new Date()) {
      d.storePlan = null;
      d.storeActiveUntil = null;
    }
    if (backendEnabled() && getAccessTokenFromSession()) {
      var pk = syncBackendRequest("GET", ME_ENDPOINT + "/packages");
      if (pk.ok && pk.data && pk.data.data) {
        var srv = pk.data.data;
        if (typeof srv.dopingCredits === "number") d.dopingCredits = Math.max(0, srv.dopingCredits);
        if (typeof srv.featuredSlots === "number") d.featuredSlots = Math.max(0, srv.featuredSlots);
        if (typeof srv.showcaseSlots === "number") d.showcaseSlots = Math.max(0, srv.showcaseSlots);
        if (typeof srv.bumpCredits === "number") d.bumpCredits = Math.max(0, srv.bumpCredits);
        if (typeof srv.extraListingSlots === "number") d.extraListingSlots = Math.max(0, srv.extraListingSlots);
        if (srv.storePlan) {
          d.storePlan = String(srv.storePlan);
          d.storeActiveUntil =
            srv.storeActiveUntil == null
              ? null
              : typeof srv.storeActiveUntil === "string"
                ? srv.storeActiveUntil
                : new Date(srv.storeActiveUntil).toISOString();
        }
        if (d.storeActiveUntil && new Date(d.storeActiveUntil) < new Date()) {
          d.storePlan = null;
          d.storeActiveUntil = null;
        }
      }
    }
    return d;
  }

  function saveEntitlements(userId, ent) {
    if (!userId || userId === "__guest__") return;
    var em = readEntitlementsMap();
    em[userId] = ent;
    writeEntitlementsMap(em);
    syncLegacyUserPackageString(userId, ent);
  }

  function syncLegacyUserPackageString(userId, ent) {
    var map = getUserPackages();
    map[userId] = deriveLegacyPackageTier(ent);
    writeJson(KEYS.USER_PACKAGES, map);
  }

  function deriveLegacyPackageTier(ent) {
    if (ent.storePlan === "kurumsal_plus") return "store";
    if (ent.storePlan === "pro") return "showcase";
    if (ent.storePlan === "standart") return "featured";
    if (ent.sponsorSlots > 0) return "store";
    if (ent.showcaseSlots > 0) return "showcase";
    if (ent.featuredSlots > 0 || ent.dopingCredits > 0) return "featured";
    if (ent.storePlan === "baslangic") return "basic";
    return "basic";
  }

  function userCanFeatured(userId) {
    var e = getEntitlements(userId);
    if (e.storePlan === "standart" || e.storePlan === "pro" || e.storePlan === "kurumsal_plus") return true;
    if (e.featuredSlots > 0) return true;
    if (e.dopingCredits > 0) return true;
    var legacy = getUserPackages()[userId];
    if (legacy === "featured" || legacy === "showcase" || legacy === "store") return true;
    return false;
  }

  function userCanShowcase(userId) {
    var e = getEntitlements(userId);
    if (e.storePlan === "pro" || e.storePlan === "kurumsal_plus") return true;
    if (e.showcaseSlots > 0) return true;
    if (e.dopingCredits >= 2) return true;
    var legacy = getUserPackages()[userId];
    if (legacy === "showcase" || legacy === "store") return true;
    return false;
  }

  function userCanSponsor(userId) {
    var e = getEntitlements(userId);
    if (e.storePlan === "kurumsal_plus") return true;
    if (e.sponsorSlots > 0) return true;
    var legacy = getUserPackages()[userId];
    return legacy === "store";
  }

  function getUserPackage(userId) {
    return deriveLegacyPackageTier(getEntitlements(userId));
  }

  function setUserPackage(userId, packageType) {
    if (!userId) return null;
    var safe = sanitizeText(packageType, 48) || "basic";
    var allowed = ["basic", "featured", "showcase", "store", "baslangic", "standart", "pro", "kurumsal_plus"];
    if (allowed.indexOf(safe) === -1) safe = "basic";
    var ent = getEntitlements(userId);
    if (safe === "basic") {
      ent = defaultEntitlements();
    } else if (safe === "featured") {
      ent = defaultEntitlements();
      ent.storePlan = "standart";
      ent.storeActiveUntil = new Date(Date.now() + 30 * 864e5).toISOString();
    } else if (safe === "showcase") {
      ent = defaultEntitlements();
      ent.storePlan = "pro";
      ent.storeActiveUntil = new Date(Date.now() + 30 * 864e5).toISOString();
    } else if (safe === "store") {
      ent = defaultEntitlements();
      ent.storePlan = "kurumsal_plus";
      ent.storeActiveUntil = new Date(Date.now() + 30 * 864e5).toISOString();
    } else if (safe === "baslangic" || safe === "standart" || safe === "pro" || safe === "kurumsal_plus") {
      ent = getEntitlements(userId);
      ent.storePlan = safe;
      ent.storeActiveUntil = new Date(Date.now() + 30 * 864e5).toISOString();
    }
    saveEntitlements(userId, ent);
    return deriveLegacyPackageTier(ent);
  }

  function extendStorePlan(userId, planId, days) {
    var ent = getEntitlements(userId);
    ent.storePlan = planId;
    var base = ent.storeActiveUntil && new Date(ent.storeActiveUntil) > new Date() ? new Date(ent.storeActiveUntil) : new Date();
    ent.storeActiveUntil = new Date(base.getTime() + (days || 30) * 864e5).toISOString();
    saveEntitlements(userId, ent);
  }

  var PRICING_CATALOG = {
    dopings: [
      { id: "doping-guncelle", name: "Güncelim", price: 149, currency: "TRY", unit: "işlem", perks: ["Yayın tarihi güncellenir", "Liste sıralamasında tazelik", "Tek seferlik hak"], bumpCredits: 1 },
      { id: "doping-one-cikar", name: "Öne Çıkan İlan", price: 249, currency: "TRY", unit: "ilan / dönem", perks: ["Arama sonuçlarında üst bant", "Öne çıkan etiketi", "Kategori içi görünürlük"], featuredSlots: 1 },
      { id: "doping-vitrin", name: "Vitrin İlan", price: 399, currency: "TRY", unit: "ilan / dönem", perks: ["Vitrin şeridinde gösterim", "Öne çıkarma dahil", "Daha yüksek tıklanma"], showcaseSlots: 1 },
      { id: "doping-ana-vitrin", name: "Ana Sayfa Vitrin", price: 599, currency: "TRY", unit: "ilan / dönem", perks: ["Ana sayfa vitrin rotasyonu", "Marka görünürlüğü", "Öncelikli yerleşim"], showcaseSlots: 2 },
      { id: "doping-sponsor", name: "Sponsorlu İlan / Banner Destekli", price: 899, currency: "TRY", unit: "ilan / dönem", perks: ["Sponsor alanlarında gösterim", "Banner destekli görünüm", "Kampanya raporlaması"], sponsorSlots: 1 }
    ],
    stores: [
      { id: "store-baslangic", name: "Başlangıç Paket", price: 999, period: "ay", plan: "baslangic", perks: ["25 aktif ilan", "Mağaza rozeti", "Temel vitrin desteği"], maxListings: 25, popular: false },
      { id: "store-standart", name: "Standart Paket", price: 1999, period: "ay", plan: "standart", perks: ["75 aktif ilan", "Öne çıkan ilan kredileri", "Gelişmiş vitrin görünürlüğü"], maxListings: 75, popular: true },
      { id: "store-pro", name: "Pro Paket", price: 3499, period: "ay", plan: "pro", perks: ["200 aktif ilan", "Kurumsal profil", "Vitrin önceliği", "Reklam alanı avantajı"], maxListings: 200, popular: false },
      { id: "store-kurumsal", name: "Kurumsal Plus", price: 5999, period: "ay", plan: "kurumsal_plus", perks: ["500 aktif ilan", "Özel destek hattı", "Ana sayfa vitrin rotasyonu", "Banner önceliği"], maxListings: 500, popular: false }
    ],
    extras: [
      { id: "extra-ilan-1", name: "Ek İlan 1", price: 99, unit: "adet", extraListingSlots: 1, perks: ["Anında aktif slot"] },
      { id: "extra-ilan-2-5", name: "Ek İlan 2–5", price: 79, unit: "adet", extraListingSlots: 1, perks: ["Çoklu ilan ihtiyacı için", "Aynı hesapta kullanım"] },
      { id: "extra-ilan-10", name: "10’lu Ek İlan Paketi", price: 599, unit: "paket", extraListingSlots: 10, perks: ["10 ek yayın hakkı", "Paket başına tasarruf"] }
    ],
    credits: [
      { id: "kredi-5", name: "5 Kredi Paketi", price: 499, unit: "5 kredi", credits: 5, perks: ["Öne çıkarma veya vitrin için kullanılabilir", "Panelden takip"] },
      { id: "kredi-10", name: "10 Kredi Paketi", price: 899, unit: "10 kredi", credits: 10, perks: ["Daha uygun birim fiyat", "Kurumsal ilanlar için"] },
      { id: "kredi-25", name: "25 Kredi Paketi", price: 1999, unit: "25 kredi", credits: 25, perks: ["Yüksek hacimli satıcılar", "Öncelikli destek"] }
    ]
  };

  function getPricingCatalog() {
    return PRICING_CATALOG;
  }

  function purchasePricingProduct(userId, productId) {
    if (!userId || userId === "__guest__") return { ok: false, message: "Giriş yapın." };
    var pid = sanitizeText(productId, 48);
    var hit = null;
    PRICING_CATALOG.dopings.forEach(function (x) {
      if (x.id === pid) hit = { type: "doping", row: x };
    });
    if (!hit) {
      PRICING_CATALOG.stores.forEach(function (x) {
        if (x.id === pid) hit = { type: "store", row: x };
      });
    }
    if (!hit) {
      PRICING_CATALOG.extras.forEach(function (x) {
        if (x.id === pid) hit = { type: "extra", row: x };
      });
    }
    if (!hit) {
      PRICING_CATALOG.credits.forEach(function (x) {
        if (x.id === pid) hit = { type: "credit", row: x };
      });
    }
    if (!hit) return { ok: false, message: "Ürün bulunamadı." };
    if (backendEnabled()) {
      if (String(getCurrentUserId()) !== String(userId)) return { ok: false, message: "Oturum uyuşmuyor." };
      var pay = syncBackendRequest("POST", "/api/packages/activate", { productId: pid });
      if (!pay.ok) return { ok: false, message: pay.message || "Satın alma başarısız." };
      return { ok: true, message: hit.row.name + " satın alındı (simülasyon)." };
    }
    var ent = getEntitlements(userId);
    var r = hit.row;
    if (hit.type === "doping") {
      if (r.bumpCredits) ent.bumpCredits += r.bumpCredits;
      if (r.featuredSlots) ent.featuredSlots += r.featuredSlots;
      if (r.showcaseSlots) ent.showcaseSlots += r.showcaseSlots;
      if (r.sponsorSlots) ent.sponsorSlots += r.sponsorSlots;
    } else if (hit.type === "store") {
      extendStorePlan(userId, r.plan, 30);
      ent = getEntitlements(userId);
    } else if (hit.type === "extra") {
      ent.extraListingSlots += r.extraListingSlots || 0;
    } else if (hit.type === "credit") {
      ent.dopingCredits += r.credits || 0;
    }
    saveEntitlements(userId, ent);
    return { ok: true, message: r.name + " satın alındı (yerel ödeme simülasyonu)." };
  }

  function consumeFeaturedSlot(userId) {
    var ent = getEntitlements(userId);
    if (ent.storePlan === "standart" || ent.storePlan === "pro" || ent.storePlan === "kurumsal_plus") return true;
    if (ent.featuredSlots > 0) {
      ent.featuredSlots -= 1;
      saveEntitlements(userId, ent);
      return true;
    }
    if (ent.dopingCredits > 0) {
      ent.dopingCredits -= 1;
      saveEntitlements(userId, ent);
      return true;
    }
    return false;
  }

  function consumeShowcaseSlot(userId) {
    var ent = getEntitlements(userId);
    if (ent.storePlan === "pro" || ent.storePlan === "kurumsal_plus") return true;
    if (ent.dopingCredits >= 2) {
      ent.dopingCredits -= 2;
      saveEntitlements(userId, ent);
      return true;
    }
    if (ent.showcaseSlots > 0) {
      ent.showcaseSlots -= 1;
      saveEntitlements(userId, ent);
      return true;
    }
    return false;
  }

  function consumeSponsorSlot(userId) {
    var ent = getEntitlements(userId);
    if (ent.storePlan === "kurumsal_plus") return true;
    if (ent.sponsorSlots > 0) {
      ent.sponsorSlots -= 1;
      saveEntitlements(userId, ent);
      return true;
    }
    return false;
  }

  function bumpListing(listingId, userId) {
    var ent = getEntitlements(userId);
    if (ent.bumpCredits < 1) return { ok: false, message: "Güncelleme hakkınız yok. Paketler sekmesinden Güncelim satın alın." };
    var list = getAllListings();
    var L = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === listingId) {
        L = list[i];
        break;
      }
    }
    if (!L || L.createdBy !== userId) return { ok: false, message: "İlan bulunamadı." };
    ent.bumpCredits -= 1;
    saveEntitlements(userId, ent);
    L.createdAt = new Date().toISOString();
    saveAllListings(list);
    notifyListingsChanged();
    return { ok: true, message: "İlan yayın tarihi güncellendi." };
  }

  function getCurrentUserId() {
    var s = readAuthState();
    if (s && s.userId) return String(s.userId);
    if (s && s.user && s.user.id) return String(s.user.id);
    return "__guest__";
  }

  function readFavorites() {
    var raw = readJson(KEYS.FAVORITES, {});
    if (Array.isArray(raw)) {
      var migrated = { "__guest__": raw };
      writeJson(KEYS.FAVORITES, migrated);
      return migrated;
    }
    return raw && typeof raw === "object" ? raw : {};
  }

  function getFavorites(userId) {
    var uid = userId || getCurrentUserId();
    var map = readFavorites();
    var arr = map[uid];
    return Array.isArray(arr) ? arr.slice() : [];
  }

  function isFavorite(userId, listingId) {
    return getFavorites(userId).indexOf(listingId) !== -1;
  }

  function toggleFavorite(userId, listingId) {
    var uid = userId || getCurrentUserId();
    var map = readFavorites();
    var arr = Array.isArray(map[uid]) ? map[uid].slice() : [];
    var idx = arr.indexOf(listingId);
    if (idx === -1) arr.push(listingId);
    else arr.splice(idx, 1);
    map[uid] = arr;
    writeJson(KEYS.FAVORITES, map);
    return idx === -1;
  }

  function removeFavorite(userId, listingId) {
    var uid = userId || getCurrentUserId();
    var map = readFavorites();
    var arr = Array.isArray(map[uid]) ? map[uid].slice() : [];
    var idx = arr.indexOf(listingId);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    map[uid] = arr;
    writeJson(KEYS.FAVORITES, map);
    return true;
  }

  function getFavoriteListings(userId) {
    var ids = getFavorites(userId);
    return ids.map(getListingById).filter(Boolean);
  }

  function getMessages() {
    seedMessagesIfEmpty();
    var list = readJson(KEYS.MESSAGES, []);
    return Array.isArray(list) ? list : [];
  }

  function saveMessages(list) {
    writeJson(KEYS.MESSAGES, list);
  }

  function sendMessage(payload) {
    var txt = sanitizeText(payload.message, 800);
    if (!txt) return null;
    var list = getMessages();
    var row = {
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).slice(2, 5),
      listingId: sanitizeText(payload.listingId, 80),
      fromUserId: sanitizeText(payload.fromUserId, 80),
      toUserId: sanitizeText(payload.toUserId, 80),
      message: txt,
      createdAt: new Date().toISOString(),
      read: false,
      isRead: false
    };
    list.push(row);
    saveMessages(list);
    return row;
  }

  function getConversationMessages(userId, listingId, peerId) {
    var uid = userId || getCurrentUserId();
    return getMessages()
      .filter(function (m) {
        if (m.listingId !== listingId) return false;
        return (m.fromUserId === uid && m.toUserId === peerId) || (m.fromUserId === peerId && m.toUserId === uid);
      })
      .sort(function (a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
  }

  function markConversationRead(userId, listingId, peerId) {
    var uid = userId || getCurrentUserId();
    var list = getMessages();
    var changed = false;
    list.forEach(function (m) {
      if (m.listingId !== listingId) return;
      if (m.toUserId === uid && m.fromUserId === peerId && !m.read) {
        m.read = true;
        m.isRead = true;
        changed = true;
      }
    });
    if (changed) saveMessages(list);
  }

  function getConversations(userId) {
    var uid = userId || getCurrentUserId();
    var users = readJson(USERS_KEY, []);
    var userMap = {};
    if (Array.isArray(users)) users.forEach(function (u) { userMap[u.id] = u; });
    var grouped = {};
    getMessages().forEach(function (m) {
      if (m.fromUserId !== uid && m.toUserId !== uid) return;
      var peerId = m.fromUserId === uid ? m.toUserId : m.fromUserId;
      var key = m.listingId + "::" + peerId;
      if (!grouped[key]) {
        grouped[key] = {
          key: key,
          listingId: m.listingId,
          peerId: peerId,
          peerName: (userMap[peerId] && userMap[peerId].name) || "Kullanıcı",
          listingTitle: (getListingById(m.listingId) || {}).title || "İlan",
          lastMessage: m.message,
          lastAt: m.createdAt,
          unreadCount: 0
        };
      }
      if (new Date(m.createdAt) >= new Date(grouped[key].lastAt)) {
        grouped[key].lastAt = m.createdAt;
        grouped[key].lastMessage = m.message;
      }
      var seen = m.isRead === true || m.read === true;
      if (m.toUserId === uid && !seen) grouped[key].unreadCount += 1;
    });
    return Object.keys(grouped)
      .map(function (k) { return grouped[k]; })
      .sort(function (a, b) { return new Date(b.lastAt) - new Date(a.lastAt); });
  }

  function getPublicUserProfile(userId) {
    var users = readJson(USERS_KEY, []);
    if (!Array.isArray(users)) return null;
    var u = users.find(function (x) { return x.id === userId; });
    if (!u) return null;
    return {
      id: u.id,
      name: u.name,
      city: u.city || "",
      profileType: u.profileType || (u.role === "store" ? "Kurumsal" : "Bireysel"),
      createdAt: u.createdAt,
      phone: u.phone || ""
    };
  }

  function getApprovedListingsByUser(userId) {
    return getAllListings().filter(function (L) { return L.createdBy === userId && L.status === STATUS.APPROVED; });
  }

  function init() {
    try {
      API_GATEWAY.baseUrl = resolveJetleApiBaseUrl();
    } catch (eInit) {}
    ensureListingsSeeded();
    ensureSellerUsersFromListings();
    seedComplaintsIfEmpty();
    seedAdsIfEmpty();
    seedMessagesIfEmpty();
  }

  window.JetleAPI = {
    KEYS: KEYS,
    STATUS: STATUS,
    API_GATEWAY: API_GATEWAY,
    getApiBaseUrl: function () {
      return API_GATEWAY.baseUrl || "";
    },
    API_BASE: API_BASE,
    backendEnabled: backendEnabled,
    httpRequest: httpRequest,
    init: init,
    sanitizeText: sanitizeText,
    sanitizeSpecs: sanitizeSpecs,
    slugifySpecForFilter: slugifySpecForFilter,
    getAllListings: getAllListings,
    getPublicListings: getPublicListings,
    getPublicCards: function () {
      return getPublicListings().map(toMarketCard);
    },
    toMarketCard: toMarketCard,
    getListingById: getListingById,
    getListingForViewer: getListingForViewer,
    getSimilarPublic: getSimilarPublic,
    addComplaint: addComplaint,
    notifyListingsChanged: notifyListingsChanged,
    addListing: addListing,
    createListing: createListing,
    mergeUserListing: mergeUserListing,
    setListingStatusByOwner: setListingStatusByOwner,
    saveDraft: saveDraft,
    resubmitListing: resubmitListing,
    republishListing: republishListing,
    updateListingStatus: updateListingStatus,
    updateListingFields: updateListingFields,
    activateDoping: activateDoping,
    deleteListing: deleteListing,
    adminFetchListings: adminFetchListings,
    adminApproveListing: adminApproveListing,
    adminRejectListing: adminRejectListing,
    adminDeleteListing: adminDeleteListing,
    fetchPublicCampaignAds: fetchPublicCampaignAds,
    adminListCampaignAds: adminListCampaignAds,
    adminCreateCampaignAd: adminCreateCampaignAd,
    adminUpdateCampaignAd: adminUpdateCampaignAd,
    adminDeleteCampaignAd: adminDeleteCampaignAd,
    adminToggleCampaignAd: adminToggleCampaignAd,
    getListingsByUser: getListingsByUser,
    getComplaints: getComplaints,
    updateComplaintStatus: updateComplaintStatus,
    getAds: getAds,
    toggleAd: toggleAd,
    getMessageThreads: getMessageThreads,
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
    removeFavorite: removeFavorite,
    getFavoriteListings: getFavoriteListings,
    getMessages: getMessages,
    sendMessage: sendMessage,
    getConversationMessages: getConversationMessages,
    markConversationRead: markConversationRead,
    getConversations: getConversations,
    getPublicUserProfile: getPublicUserProfile,
    getApprovedListingsByUser: getApprovedListingsByUser
    ,getUserPackage: getUserPackage
    ,setUserPackage: setUserPackage
    ,getEntitlements: getEntitlements
    ,getPricingCatalog: getPricingCatalog
    ,purchasePricingProduct: purchasePricingProduct
    ,userCanFeatured: userCanFeatured
    ,userCanShowcase: userCanShowcase
    ,userCanSponsor: userCanSponsor
    ,consumeFeaturedSlot: consumeFeaturedSlot
    ,consumeShowcaseSlot: consumeShowcaseSlot
    ,consumeSponsorSlot: consumeSponsorSlot
    ,bumpListing: bumpListing
    ,postPublicIlan: function (body) {
      return syncBackendRequest("POST", "/api/ilan", body || {});
    }
    ,getAccessToken: getAccessTokenFromSession
    ,buildFetchAuthHeaders: buildFetchAuthHeaders
    ,authStorage: {
      key: SESSION_KEY,
      read: readAuthState,
      write: writeAuthState,
      clear: clearAuthStorage
    }
  };
})();
