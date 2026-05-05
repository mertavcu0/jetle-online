const DETAIL_API = window.API_BASE || "http://localhost:3000";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMoney(value) {
  const number = Number(value || 0);
  return number ? `${number.toLocaleString("tr-TR")} TL` : "Fiyat belirtilmedi";
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function resolveImage(src) {
  if (!src || String(src).trim() === "") return PLACEHOLDER_IMAGE;
  if (String(src).startsWith("/uploads/")) return `${DETAIL_API}${src}`;
  return src;
}

function getImages(listing) {
  const images = Array.isArray(listing.images) && listing.images.length ? listing.images : [listing.image];
  return images.map(resolveImage).filter(Boolean);
}

function getListingId() {
  const pathMatch = window.location.pathname.match(/^\/ilan\/([a-f0-9]{24})/i);
  return pathMatch?.[1] || new URLSearchParams(window.location.search).get("id");
}

function youtubeEmbedUrl(url = "") {
  const value = String(url).trim();
  const lower = value.toLowerCase();
  if (!value || (!lower.includes("youtube") && !lower.includes("youtu.be"))) return "";

  const watchMatch = value.match(/[?&]v=([^&]+)/);
  const shortMatch = value.match(/youtu\.be\/([^?&]+)/);
  const embedMatch = value.match(/embed\/([^?&]+)/);
  const id = watchMatch?.[1] || shortMatch?.[1] || embedMatch?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

function fieldRows(rows) {
  return rows
    .filter((row) => row.value !== undefined && row.value !== null && String(row.value).trim() !== "")
    .map((row) => `
      <div class="detail-table-row">
        <span>${escapeHtml(row.label)}</span>
        <strong>${escapeHtml(row.value)}</strong>
      </div>
    `)
    .join("");
}

function iconSvg(name) {
  const icons = {
    clipboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="2" width="8" height="4" rx="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>',
    gauge: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>',
    mapPin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21a7 7 0 0 0-14 0"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    fileText: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>',
  };
  return icons[name] || icons.clipboard;
}

function detailCard(title, icon, body) {
  if (!body || !String(body).trim()) return "";
  return `
    <section class="pro-detail-card">
      <div class="pro-section-title">
        <span class="pro-section-icon">${icon}</span>
        <h2>${title}</h2>
      </div>
      ${body}
    </section>
  `;
}

function renderInfoBar(listing) {
  const items = [
    { icon: "KM", label: "Kilometre", value: listing.km ? `${Number(listing.km).toLocaleString("tr-TR")} km` : "" },
    { icon: "Y", label: "Yıl", value: listing.year },
    { icon: "Yk", label: "Yakıt", value: listing.fuel },
    { icon: "V", label: "Vites", value: listing.transmission },
  ].filter((item) => item.value !== undefined && item.value !== null && String(item.value).trim() !== "");

  if (!items.length) return "";

  return `
    <section class="listing-info-bar">
      ${items.map((item) => `
        <div class="info-bar-item">
          <span class="info-bar-icon">${escapeHtml(item.icon)}</span>
          <div>
            <small>${escapeHtml(item.label)}</small>
            <strong>${escapeHtml(item.value)}</strong>
          </div>
        </div>
      `).join("")}
    </section>
  `;
}

function featureTags(features) {
  if (!Array.isArray(features) || !features.length) return "";
  return `<div class="pro-feature-tags">${features.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

function renderVideo(listing) {
  if (!listing.video) return "";

  const embed = youtubeEmbedUrl(listing.video);
  const body = embed
    ? `<div class="listing-video-frame"><iframe src="${embed}" title="İlan videosu" allowfullscreen></iframe></div>`
    : `<a class="video-link" href="${escapeHtml(listing.video)}" target="_blank" rel="noopener">Videoyu aç</a>`;

  return detailCard("Video", iconSvg("fileText"), body);
}

function renderGallery(listing) {
  const images = getImages(listing);
  const thumbs = images.map((image, index) => `
    <button class="pro-thumb ${index === 0 ? "active" : ""}" type="button" data-image="${escapeHtml(image)}">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(listing.title || "İlan görseli")} ${index + 1}" loading="lazy">
    </button>
  `).join("");

  return `
    <section class="pro-gallery-card">
      <div class="pro-main-image-wrap">
        <img id="mainImage" class="pro-main-image" src="${escapeHtml(images[0] || PLACEHOLDER_IMAGE)}" alt="${escapeHtml(listing.title || "İlan görseli")}">
      </div>
      ${images.length > 1 ? `<div class="pro-thumbs">${thumbs}</div>` : ""}
    </section>
  `;
}

function renderSidebar(listing) {
  const sellerName = listing.createdBy?.username || listing.createdBy?.name || "Jetle Kullanıcı";
  const location = [listing.city, listing.district].filter(Boolean).join(" / ");
  const sellerId = listing.userId || listing.createdBy?._id || listing.createdBy || "";

  return `
    <aside class="pro-side">
      <section class="pro-price-card">
        <div class="pro-price">${formatMoney(listing.price)}</div>
        <div class="pro-meta-list">
          ${location ? `<p><span>Konum</span><strong>${escapeHtml(location)}</strong></p>` : ""}
          ${listing.category ? `<p><span>Kategori</span><strong>${escapeHtml(listing.category)}</strong></p>` : ""}
          ${listing.createdAt ? `<p><span>İlan Tarihi</span><strong>${formatDate(listing.createdAt)}</strong></p>` : ""}
          ${listing.views !== undefined ? `<p><span>Görüntülenme</span><strong>${Number(listing.views || 0).toLocaleString("tr-TR")}</strong></p>` : ""}
        </div>
      </section>

      <section class="pro-seller-card">
        <div>
          <span class="pro-eyebrow">İlan sahibi</span>
          <h3>${escapeHtml(sellerName)}</h3>
        </div>
        <button class="pro-message-btn" type="button" onclick="openChat('${escapeHtml(sellerId)}')">
          <span>Mesaj Gönder</span>
        </button>
        <p class="pro-safe-note">Jetle üzerinden iletişim kurarak görüşmeyi kayıt altında tutabilirsin.</p>
      </section>
    </aside>
  `;
}

function renderInfoSections(listing) {
  const specs = listing.specs || {};
  const listingInfo = fieldRows([
    { label: "Kategori", value: listing.category },
    { label: "İlan Tarihi", value: formatDate(listing.createdAt) },
    { label: "İlan No", value: listing._id },
    { label: "Görüntülenme", value: listing.views !== undefined ? Number(listing.views || 0).toLocaleString("tr-TR") : "" },
  ]);

  const technical = fieldRows([
    { label: "Marka", value: listing.brand },
    { label: "Model", value: listing.model },
    { label: "Seri", value: listing.series },
    { label: "Yıl", value: listing.year },
    { label: "Kilometre", value: listing.km ? `${Number(listing.km).toLocaleString("tr-TR")} km` : "" },
    { label: "Yakıt", value: listing.fuel },
    { label: "Vites", value: listing.transmission },
    { label: "Kasa Tipi", value: listing.bodyType || listing.body || specs.bodyType || specs.body },
    { label: "Renk", value: listing.color || specs.color },
    { label: "Motor Hacmi", value: listing.engine || specs.engine || specs.engineVolume },
    { label: "Güç", value: listing.power ? `${listing.power} hp` : specs.power },
  ]);

  const location = fieldRows([
    { label: "Şehir", value: listing.city },
    { label: "İlçe", value: listing.district },
  ]);

  const sellerName = listing.createdBy?.username || listing.createdBy?.name || "Jetle Kullanıcı";
  const seller = fieldRows([
    { label: "Satıcı", value: sellerName },
    { label: "Üyelik Tipi", value: listing.createdBy ? "Jetle üyesi" : "" },
    { label: "İletişim", value: "Jetle mesajlaşma ile güvenli görüşme" },
  ]);

  const specGrid = fieldRows([
    { label: "Marka", value: listing.brand },
    { label: "Model", value: listing.model },
    { label: "Yıl", value: listing.year },
    { label: "KM", value: listing.km ? `${Number(listing.km).toLocaleString("tr-TR")} km` : "" },
    { label: "Yakıt", value: listing.fuel },
    { label: "Vites", value: listing.transmission },
    { label: "Motor", value: listing.engine || specs.engine || specs.engineVolume },
    { label: "Güç", value: listing.power ? `${listing.power} hp` : specs.power },
  ]);

  const listingDescription = listing.description || listing.desc || "";
  const description = listingDescription
    ? `${specGrid ? `<div class="spec-grid">${specGrid}</div>` : ""}<div class="pro-description">${escapeHtml(listingDescription).replace(/\n/g, "<br>")}</div>`
    : "";

  return `
    <div class="pro-info-grid">
      ${detailCard("İlan Bilgileri", iconSvg("clipboard"), listingInfo ? `<div class="detail-table">${listingInfo}</div>` : "")}
      ${detailCard("Teknik Özellikler", iconSvg("gauge"), technical ? `<div class="detail-table">${technical}</div>` : "")}
      ${detailCard("Konum", iconSvg("mapPin"), location ? `<div class="detail-table">${location}</div>` : "")}
      ${detailCard("Satıcı hakkında", iconSvg("user"), seller ? `<div class="detail-table">${seller}</div>` : "")}
      ${detailCard("Donanım", iconSvg("settings"), featureTags(listing.features))}
      ${detailCard("Açıklama", iconSvg("fileText"), description)}
    </div>
  `;
}

function renderSimilarCard(item) {
  const url = window.listingUrl ? window.listingUrl(item) : `/ilan-detay.html?id=${item._id}`;
  const image = resolveImage((Array.isArray(item.images) && item.images[0]) || item.image);
  return `
    <a class="similar-card" href="${url}">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}" loading="lazy">
      <div>
        <strong>${escapeHtml(item.title || "İlan")}</strong>
        <span>${formatMoney(item.price)}</span>
        <small>${escapeHtml(item.city || "")}</small>
      </div>
    </a>
  `;
}

async function loadSimilarListings(listing) {
  const holder = document.getElementById("similarListings");
  if (!holder) return;

  try {
    const params = new URLSearchParams();
    if (listing.category) params.set("category", listing.category);
    params.set("limit", "8");
    const res = await fetch(`${DETAIL_API}/api/listings?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error("Benzer ilanlar yüklenemedi");

    const items = data.filter((item) => String(item._id) !== String(listing._id)).slice(0, 4);
    holder.innerHTML = items.length
      ? items.map(renderSimilarCard).join("")
      : `<div class="pro-empty-similar">Bu kategori için benzer ilan bulunamadı.</div>`;
  } catch {
    holder.innerHTML = `<div class="pro-empty-similar">Benzer ilanlar şu an gösterilemiyor.</div>`;
  }
}

function updateSeo(listing) {
  const title = `${listing.title || "İlan Detay"} - Jetle`;
  const description = listing.description || listing.desc || `${listing.title || "İlan"} Jetle'de.`;
  const image = getImages(listing)[0] || PLACEHOLDER_IMAGE;

  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);

  let schema = document.getElementById("listingSchema");
  if (!schema) {
    schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "listingSchema";
    document.head.appendChild(schema);
  }

  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    image,
    description,
    offers: {
      "@type": "Offer",
      price: Number(listing.price || 0),
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
    },
  });
}

function bindGallery() {
  const main = document.getElementById("mainImage");
  document.querySelectorAll(".pro-thumb").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".pro-thumb").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (main) main.src = button.dataset.image;
    });
  });
}

function openChat(userId) {
  window.pendingChatUserId = userId;
  alert("Mesaj sistemi yakında aktif olacak");
}

window.openChat = openChat;

async function loadListingDetail() {
  const root = document.getElementById("detail");
  if (!root) return;

  const id = getListingId();
  if (!id) {
    root.innerHTML = `<div class="message">İlan ID bulunamadı.</div>`;
    return;
  }

  try {
    const res = await fetch(`${DETAIL_API}/api/listings/${id}`);
    const listing = await res.json();
    if (!res.ok) throw new Error(listing.message || "İlan bulunamadı");

    updateSeo(listing);

    root.innerHTML = `
      <div class="pro-detail-heading">
        <div>
          <span class="pro-breadcrumb">Jetle / ${escapeHtml(listing.category || "İlan")}</span>
          <h1>${escapeHtml(listing.title || "İlan Detayı")}</h1>
        </div>
        <strong>${formatMoney(listing.price)}</strong>
      </div>

      <div class="pro-detail-layout">
        <div class="pro-detail-main">
          ${renderGallery(listing)}
          ${renderInfoBar(listing)}
          ${renderVideo(listing)}
          ${renderInfoSections(listing)}
        </div>
        ${renderSidebar(listing)}
      </div>

      <section class="pro-detail-card pro-similar-section">
        <div class="pro-section-title">
          <span class="pro-section-icon">${iconSvg("clipboard")}</span>
          <h2>Benzer ilanlar</h2>
        </div>
        <div class="similar-grid" id="similarListings">
          <div class="spinner"></div>
        </div>
      </section>
    `;

    bindGallery();
    loadSimilarListings(listing);
  } catch (error) {
    root.innerHTML = `
      <div class="pro-detail-error">
        <h1>İlan bulunamadı</h1>
        <p>${escapeHtml(error.message || "Bu ilan silinmiş veya yayından kaldırılmış olabilir.")}</p>
        <a class="btn-primary" href="/ilanlar.html">İlanlara dön</a>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadListingDetail);
