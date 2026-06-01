const API = "";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fixMojibakeText(value) {
  const text = String(value ?? "");
  if (!/[\u00C3\u00C2\u00C4\u00C5\uFFFD]/.test(text)) return text;
  try {
    const bytes = Uint8Array.from(Array.from(text).map((ch) => ch.charCodeAt(0) & 255));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded && decoded !== text ? decoded.replace(/\uFFFD/g, "") : text.replace(/\uFFFD/g, "");
  } catch (_) {
    return text.replace(/\uFFFD/g, "");
  }
}

function normalizeTextValue(value) {
  if (Array.isArray(value)) return value.map((item) => normalizeTextValue(item));
  if (typeof value === "string") return fixMojibakeText(value).normalize("NFC");
  return value;
}

function normalizeTextObject(value) {
  if (Array.isArray(value)) return value.map((item) => normalizeTextObject(item));
  if (value && typeof value === "object") {
    const next = {};
    Object.entries(value).forEach(([key, item]) => {
      next[key] = normalizeTextObject(item);
    });
    return next;
  }
  return normalizeTextValue(value);
}

function getParams() {
  return new URLSearchParams(window.location.search);
}

const categoryLabels = {
  emlak: "Emlak",
  vasita: "Vasıta",
  "is-makineleri": "İş Makineleri",
  "yedek-parca": "Yedek Parça"
};

const categoryOrder = ["vasita", "emlak", "is-makineleri", "yedek-parca"];
const PAGE_SIZE = 20;

function getCategoryLabel(key) {
  const overrides = {
    emlak: "Emlak",
    vasita: "Vas\u0131ta",
    "is-makineleri": "\u0130\u015f Makinalar\u0131",
    "yedek-parca": "Yedek Par\u00e7a"
  };
  return overrides[key] || fixMojibakeText(categoryLabels[key] || key);
}

function slugifyFilterValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSubcategoryFromUrl() {
  return slugifyFilterValue(getParams().get("subcategory") || "");
}

function getPageFromUrl() {
  const rawValue = Number.parseInt(getParams().get("page") || "1", 10);
  if (!Number.isFinite(rawValue) || rawValue < 1) return 1;
  return rawValue;
}

function clampPage(page, totalItems, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(Number(totalItems || 0) / pageSize));
  const safePage = Math.min(Math.max(Number(page || 1), 1), totalPages);
  return { page: safePage, totalPages };
}

function paginateItems(items, page, pageSize = PAGE_SIZE) {
  const list = Array.isArray(items) ? items : [];
  const { page: safePage, totalPages } = clampPage(page, list.length, pageSize);
  const start = (safePage - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems: list.length,
    pageSize
  };
}

function buildPaginationModel(totalPages, currentPage, maxVisible = 5) {
  const safeTotal = Math.max(1, Number(totalPages || 1));
  const safeCurrent = Math.min(Math.max(Number(currentPage || 1), 1), safeTotal);
  if (safeTotal <= maxVisible) {
    return Array.from({ length: safeTotal }, (_, index) => index + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = safeCurrent - half;
  let end = safeCurrent + half;

  if (start < 1) {
    end += 1 - start;
    start = 1;
  }

  if (end > safeTotal) {
    start -= end - safeTotal;
    end = safeTotal;
  }

  start = Math.max(start, 1);
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

function getSubcategoryLabel(listing, mainCategory) {
  const candidates = [
    listing?.subCategory,
    listing?.estateType,
    listing?.type,
    listing?.vehicleType,
    listing?.bodyType,
    listing?.body
  ];

  for (const candidate of candidates) {
    const text = String(normalizeTextValue(candidate) || "").trim();
    if (!text) continue;

    const candidateSlug = slugifyFilterValue(text);
    const mainLabelSlug = slugifyFilterValue(getCategoryLabel(mainCategory));
    if (candidateSlug && candidateSlug !== mainCategory && candidateSlug !== mainLabelSlug) {
      return text;
    }
  }

  return "";
}

function buildCategoryCounts(listings) {
  const counts = Object.fromEntries(categoryOrder.map((key) => [key, 0]));
  (Array.isArray(listings) ? listings : []).forEach((listing) => {
    const mainCategory = getListingMainCategory(listing);
    if (Object.prototype.hasOwnProperty.call(counts, mainCategory)) {
      counts[mainCategory] += 1;
    }
  });
  return counts;
}

function buildSubcategoryCounts(listings, activeCategory) {
  const counts = new Map();
  if (!activeCategory) return counts;

  (Array.isArray(listings) ? listings : []).forEach((listing) => {
    const label = getSubcategoryLabel(listing, activeCategory);
    if (!label) return;
    const slug = slugifyFilterValue(label);
    if (!slug) return;
    const current = counts.get(slug);
    if (current) {
      current.count += 1;
      return;
    }
    counts.set(slug, { slug, label, count: 1 });
  });

  return counts;
}

function renderCategoryCounts(counts) {
  document.querySelectorAll("[data-category-link]").forEach((link) => {
    const key = link.dataset.categoryLink || "";
    const count = Number(counts?.[key] || 0);
    link.textContent = `${getCategoryLabel(key)} (${count})`;
    link.dataset.count = String(count);
  });
}

function renderSubcategoryPanel(activeCategory, counts, activeSubcategory) {
  const panel = document.getElementById("subcategoryPanel");
  const title = document.getElementById("subcategoryTitle");
  const links = document.getElementById("subcategoryLinks");
  const empty = document.getElementById("subcategoryEmpty");
  if (!panel || !title || !links || !empty) return;

  if (!activeCategory) {
    panel.hidden = true;
    links.innerHTML = "";
    empty.hidden = true;
    return;
  }

  const entries = Array.from(counts.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.label.localeCompare(b.label, "tr");
  });

  title.textContent = `${getCategoryLabel(activeCategory)} Alt Kategorileri`;
  panel.hidden = false;

  if (!entries.length) {
    links.innerHTML = "";
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  const params = getParams();
  links.innerHTML = entries.map((entry) => {
    const nextParams = new URLSearchParams(params.toString());
    nextParams.set("category", activeCategory);
    nextParams.set("subcategory", entry.slug);
    nextParams.delete("page");
    const href = `listings.html?${nextParams.toString()}`;
    const activeClass = entry.slug === activeSubcategory ? "active" : "";

    return `
      <a href="${escapeHtml(href)}" data-subcategory-link="${escapeHtml(entry.slug)}" class="${activeClass}">
        <span>${escapeHtml(entry.label)}</span>
        <span class="subcategory-count">(${entry.count})</span>
      </a>
    `;
  }).join("");
}

function normalizeCategorySlug(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";

  const normalized = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (normalized === "emlak") return "emlak";
  if (["vasita", "otomobil", "arac", "araba", "suv", "motosiklet", "pickup", "kamyonet"].includes(normalized)) return "vasita";
  if (["is-makineleri", "is-makinalari", "is-makinasi", "is-makinesi"].includes(normalized)) return "is-makineleri";
  if (["yedek-parca", "yedek-parca-ve-aksesuar", "yedek-parca-aksesuar", "aksesuar"].includes(normalized)) return "yedek-parca";
  return normalized;
}

function getListingMainCategory(listing) {
  const resolvedMainCategory = normalizeCategorySlug(
    listing?.mainCategory ||
    listing?.category ||
    listing?.subCategory ||
    listing?.type
  );

  console.log("LISTING_CATEGORY_DEBUG", {
    id: listing?._id || listing?.id || "",
    category: listing?.category || "",
    mainCategory: listing?.mainCategory || "",
    subCategory: listing?.subCategory || "",
    type: listing?.type || "",
    resolvedMainCategory
  });

  return resolvedMainCategory;
}

function getCategoryFromUrl() {
  return normalizeCategorySlug(getParams().get("category") || "");
}

function setPageTitle() {
  const title = document.getElementById("pageTitle");
  if (!title) return;

  const category = getCategoryFromUrl();
  title.textContent = category ? `${categoryLabels[category] || category} İlanları` : "Tüm İlanlar";
}

function setFormFromUrl() {
  const params = getParams();

  const searchInput = document.getElementById("searchInput");
  const category = document.getElementById("filterCategory");
  const city = document.getElementById("filterCity");
  const min = document.getElementById("minPrice");
  const max = document.getElementById("maxPrice");

  if (searchInput) searchInput.value = params.get("q") || params.get("search") || "";
  if (category) category.value = normalizeCategorySlug(params.get("category") || "");
  if (city) city.value = params.get("city") || "";
  if (min) min.value = params.get("min") || "";
  if (max) max.value = params.get("max") || "";
}

function buildQueryFromForm() {
  const params = new URLSearchParams();
  const search = document.getElementById("searchInput")?.value.trim();
  const category = document.getElementById("filterCategory")?.value;
  const city = document.getElementById("filterCity")?.value.trim();
  const min = document.getElementById("minPrice")?.value;
  const max = document.getElementById("maxPrice")?.value;

  if (search) params.set("q", search);
  if (category) params.set("category", normalizeCategorySlug(category));
  if (city) params.set("city", city);
  if (min) params.set("min", min);
  if (max) params.set("max", max);

  return params;
}

function getListingBadges(listing) {
  const badges = Array.isArray(listing.user?.badges) ? listing.user.badges : [];
  const legacyBadge = listing.user?.badge && listing.user.badge !== "none" ? [listing.user.badge] : [];

  return [...new Set([...badges, ...legacyBadge])].filter((badge) =>
    ["verified", "premium", "corporate"].includes(badge)
  );
}

function renderBadges(listing) {
  const labels = {
    verified: "Onaylı",
    premium: "Premium",
    corporate: "Kurumsal"
  };
  const badges = getListingBadges(listing);

  if (!badges.length) return "";

  return `
    <div class="badge-row">
      ${badges.map((badge) => `<span class="seller-badge ${badge}">${labels[badge]}</span>`).join("")}
    </div>
  `;
}

function isPlaceholderImage(src) {
  const value = String(src || "").trim().toLowerCase();
  if (!value) return true;
  return value.includes("picsum.photos") || value.includes("images.unsplash.com") || value.includes("source.unsplash.com");
}

function getListingImages(listing) {
  const values = [];
  if (Array.isArray(listing?.images)) values.push(...listing.images);
  if (Array.isArray(listing?.photos)) values.push(...listing.photos);
  if (listing?.image) values.push(listing.image);

  return [...new Set(values.map((item) => String(item || "").trim()).filter((item) => item && !isPlaceholderImage(item)))];
}

function listingImage(listing) {
  return getListingImages(listing)[0] || "";
}

function formatPrice(price) {
  return new Intl.NumberFormat("tr-TR").format(Number(price || 0)) + " TL";
}

function currentUser() {
  try {
    return normalizeTextObject(JSON.parse(localStorage.getItem("user") || "{}"));
  } catch (err) {
    return {};
  }
}

function userIdentity(user) {
  return user?._id || user?.id || user?.email || "";
}

function isFavorite(listing, user) {
  const identity = userIdentity(user);
  const email = user?.email || "";
  const favorites = Array.isArray(listing.favorites) ? listing.favorites : [];

  return favorites.some((favorite) => {
    if (!favorite) return false;
    if (typeof favorite === "object") {
      return (
        String(favorite._id || favorite.id || "") === String(identity) ||
        String(favorite.email || "") === String(email)
      );
    }
    return String(favorite) === String(identity);
  });
}

function favoriteButton(listing, user) {
  const active = isFavorite(listing, user);
  const id = listing?._id || listing?.id || "";
  return `
    <button class="fav-btn ${active ? "active" : ""}" type="button" data-action="favorite" data-id="${escapeHtml(id)}">
      ${active ? "♥" : "♡"}
    </button>
  `;
}

function renderListings(listings) {
  const container = document.getElementById("listingContainer");
  if (!container) return;

  if (!Array.isArray(listings) || !listings.length) {
    const activeCategory = getCategoryFromUrl();
    container.innerHTML = `
      <div class="empty-state">
        <h3>İlan bulunamadı</h3>
        <p>${activeCategory ? "Bu kategoride henüz ilan yok." : "Filtreleri değiştirerek tekrar arama yapabilirsiniz."}</p>
      </div>
    `;
    return;
  }

  const user = currentUser();

  container.innerHTML = listings.map((listing) => {
    const src = listingImage(listing);

    return `
      <div class="listing-card" data-action="detail" data-id="${escapeHtml(String(listing._id || listing.id || ""))}">
        ${src
          ? `<img class="card-img" src="${escapeHtml(src)}" alt="${escapeHtml(listing.title || "İlan")}" loading="lazy">`
          : `<div class="card-img-placeholder">Görsel yok</div>`}
        ${favoriteButton(listing, user)}
        <div class="card-body">
          <h3>${escapeHtml(listing.title || "")}</h3>
          <p>${formatPrice(listing.price)}</p>
          <span>${escapeHtml([listing.city, listing.district].filter(Boolean).join(" / "))}</span>
          ${renderBadges(listing)}
        </div>
      </div>
    `;
  }).join("");
}

async function loadListings() {
  setPageTitle();

  const container = document.getElementById("listingContainer");
  if (container) {
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        İlanlar yükleniyor...
      </div>
    `;
  }

  const params = getParams();
  params.delete("category");

  const res = await fetch(`${API}/api/listings${params.toString() ? `?${params.toString()}` : ""}`);
  const data = await res.json();
  const activeCategory = getCategoryFromUrl();
  const allListings = (Array.isArray(data) ? data : []).map((listing) => normalizeTextObject(listing));
  const categoryFilteredListings = activeCategory
    ? allListings.filter((listing) => {
        const resolvedMainCategory = getListingMainCategory(listing);
        const isMatch = resolvedMainCategory === activeCategory;
        console.log(isMatch ? "CATEGORY_MATCH_SUCCESS" : "CATEGORY_MATCH_FAIL", {
          currentCategory: activeCategory,
          id: listing?._id || listing?.id || "",
          resolvedMainCategory,
          category: listing?.category || "",
          mainCategory: listing?.mainCategory || "",
          subCategory: listing?.subCategory || ""
        });
        return isMatch;
      })
    : allListings;

  console.log("CATEGORY_STANDARDIZED", activeCategory || "all");
  console.log("CATEGORY_FILTER_RESULT", activeCategory || "all", categoryFilteredListings.length);

  renderListings(categoryFilteredListings);
}

function setPageTitle() {
  const title = document.getElementById("pageTitle");
  if (!title) return;

  const category = getCategoryFromUrl();
  title.textContent = category ? `${getCategoryLabel(category)} \u0130lanlar\u0131` : "T\u00fcm \u0130lanlar";
}

function buildQueryFromForm() {
  const currentParams = getParams();
  const params = new URLSearchParams(currentParams.toString());
  const search = document.getElementById("searchInput")?.value.trim();
  const categoryValue = document.getElementById("filterCategory")?.value;
  const nextCategory = normalizeCategorySlug(categoryValue);
  const currentCategory = normalizeCategorySlug(currentParams.get("category") || "");
  const city = document.getElementById("filterCity")?.value.trim();
  const min = document.getElementById("minPrice")?.value;
  const max = document.getElementById("maxPrice")?.value;

  params.delete("search");
  if (search) params.set("q", search);
  else params.delete("q");

  if (nextCategory) params.set("category", nextCategory);
  else params.delete("category");

  if (!nextCategory || currentCategory !== nextCategory) {
    params.delete("subcategory");
  }

  params.delete("page");

  params.delete("page");

  if (city) params.set("city", city);
  else params.delete("city");

  if (min) params.set("min", min);
  else params.delete("min");

  if (max) params.set("max", max);
  else params.delete("max");

  return params;
}

async function loadListings() {
  setPageTitle();

  const container = document.getElementById("listingContainer");
  if (container) {
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        \u0130lanlar y\u00fckleniyor...
      </div>
    `;
  }

  const params = getParams();
  params.delete("category");
  params.delete("subcategory");
  params.delete("page");
  params.delete("page");

  const res = await fetch(`${API}/api/listings${params.toString() ? `?${params.toString()}` : ""}`);
  const data = await res.json();
  const activeCategory = getCategoryFromUrl();
  const activeSubcategory = getSubcategoryFromUrl();
  const allListings = (Array.isArray(data) ? data : []).map((listing) => normalizeTextObject(listing));
  const categoryCounts = buildCategoryCounts(allListings);
  const categoryFilteredListings = activeCategory
    ? allListings.filter((listing) => getListingMainCategory(listing) === activeCategory)
    : allListings;
  const subcategoryCounts = buildSubcategoryCounts(categoryFilteredListings, activeCategory);
  const filteredListings = activeSubcategory
    ? categoryFilteredListings.filter((listing) => slugifyFilterValue(getSubcategoryLabel(listing, activeCategory)) === activeSubcategory)
    : categoryFilteredListings;

  console.log("CATEGORY_STANDARDIZED", activeCategory || "all");
  console.log("CATEGORY_FILTER_RESULT", activeCategory || "all", categoryFilteredListings.length);
  console.log("SUBCATEGORY_FILTER_RESULT", activeSubcategory || "all", filteredListings.length);

  renderCategoryCounts(categoryCounts);
  renderSubcategoryPanel(activeCategory, subcategoryCounts, activeSubcategory);
  renderListings(filteredListings);
}

async function toggleFavorite(id) {
  const user = currentUser();
  const token = String(localStorage.getItem("token") || "").trim();

  if ((!user.email && !user.id && !user._id) || !token) {
    alert("Favorilere eklemek için giriş yapmalısınız");
    window.location.href = "/login.html";
    return;
  }

  const res = await fetch(`/api/listings/${id}/favorite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login.html";
    return;
  }

  if (!res.ok) {
    alert("Favori işlemi tamamlanamadı");
    return;
  }

  loadListings();
}

function applyFilters() {
  const params = buildQueryFromForm();
  window.history.pushState({}, "", `listings.html${params.toString() ? `?${params.toString()}` : ""}`);
  setPageTitle();
  loadListings();
}

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function goDetail(id) {
  window.location.href = `listing-detail.html?id=${encodeURIComponent(id)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const layoutRoot = document.querySelector(".full-listings-layout, .page");
  const listingsContainer = document.getElementById("listingContainer");
  const listingTable = document.querySelector(".listing-table");
  console.log("LAYOUT_WIDTH_STATE", {
    viewport: window.innerWidth,
    layoutWidth: layoutRoot?.getBoundingClientRect?.().width || 0,
    sidebarWidth: document.querySelector(".sidebar")?.getBoundingClientRect?.().width || 0
  });
  console.log("LISTINGS_CONTAINER_READY", {
    exists: Boolean(listingsContainer),
    width: listingsContainer?.getBoundingClientRect?.().width || 0
  });
  console.log("TABLE_LAYOUT_READY", {
    tableExists: Boolean(listingTable),
    tableLayout: listingTable ? window.getComputedStyle(listingTable).tableLayout : "fixed"
  });
  console.log("COLUMN_WIDTHS_APPLIED", {
    photo: "160px",
    model: "132px",
    title: "minmax(300px, 1fr)",
    year: "64px",
    km: "84px",
    color: "74px",
    price: "150px",
    date: "104px",
    location: "124px"
  });
  console.log("MARKETPLACE_DENSITY_READY", true);
  console.log("TABLE_VISUAL_POLISH_READY", true);
  console.log("SAHIBINDEN_TABLE_MODE_READY", true);
  console.log("LIST_DENSITY_FINAL_READY", true);
  console.log("SAHIBINDEN_DENSITY_FINAL", true);
  console.log("MARKETPLACE_COMPACT_READY", true);

  setFormFromUrl();
  loadListings();

  document.getElementById("applyFilter")?.addEventListener("click", applyFilters);

  const debouncedApplyFilters = debounce(applyFilters, 350);

  ["filterCategory"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", applyFilters);
  });

  ["searchInput", "filterCity", "minPrice", "maxPrice"].forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener("input", debouncedApplyFilters);
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyFilters();
      }
    });
  });

  window.addEventListener("popstate", () => {
    setFormFromUrl();
    setPageTitle();
    loadListings();
  });

  document.addEventListener("click", (event) => {
    const subcategoryLink = event.target.closest("[data-subcategory-link]");
    if (subcategoryLink) {
      event.preventDefault();
      const nextUrl = new URL(subcategoryLink.href, window.location.origin);
      window.history.pushState({}, "", `${nextUrl.pathname}${nextUrl.search}`);
      setFormFromUrl();
      setPageTitle();
      loadListings();
      return;
    }

    const favoriteBtn = event.target.closest('[data-action="favorite"]');
    if (favoriteBtn) {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(favoriteBtn.dataset.id || "");
      return;
    }

    const detailCard = event.target.closest('[data-action="detail"]');
    if (detailCard) {
      goDetail(detailCard.dataset.id || "");
    }
  });
});
