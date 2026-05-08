function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let phoneShown = false;
let currentIndex = 0;
let images = [];

function getLocalPendingListingById(id) {
  if (!id) return null;

  try {
    const stored = JSON.parse(localStorage.getItem("jetleLocalPendingListings") || "[]");
    if (!Array.isArray(stored)) return null;

    return stored.find((item) => String(item?._id || item?.id || "") === String(id)) || null;
  } catch (err) {
    console.warn("LOCAL PENDING DETAIL READ FAILED", err);
    return null;
  }
}

function resolveImage(src) {
  if (!src || String(src).trim() === "") {
    return "https://picsum.photos/600/400";
  }
  return src;
}

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (_) {}
    return trimmed.split(/[,|]/).map((item) => item.trim()).filter(Boolean);
  }
  return [value].filter(Boolean);
}

function formatValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value ?? "").trim();
}

function renderTagList(items) {
  const values = asArray(items);
  if (!values.length) return "";
  return `<div class="tag-list">${values.map((item) => `<span class="tag-chip">${escapeHtml(formatValue(item))}</span>`).join("")}</div>`;
}

function renderSpecGrid(rows) {
  const visibleRows = rows.filter((row) => formatValue(row.value));
  if (!visibleRows.length) return "";

  return `
    <div class="spec-grid">
      ${visibleRows.map((row) => `
        <div class="spec-item">
          <strong>${escapeHtml(row.label)}</strong>
          <span>${escapeHtml(formatValue(row.value))}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderTechSpecs(listing) {
  const techTab = document.getElementById("tech");
  if (!techTab) return;

  const specRows = [
    { label: "Marka", value: listing.brand },
    { label: "Seri", value: listing.series },
    { label: "Model", value: listing.model },
    { label: "Yıl", value: listing.year },
    { label: "KM", value: listing.km },
    { label: "Yakıt", value: listing.fuel },
    { label: "Vites", value: listing.transmission },
    { label: "Kasa Tipi", value: listing.bodyType || listing.body },
    { label: "Motor Hacmi", value: listing.engineSize || listing.engineVolume || listing.engine },
    { label: "Motor Gücü", value: listing.enginePower || listing.hp },
    { label: "Renk", value: listing.color },
    { label: "Çekiş", value: listing.traction || listing.drive },
    { label: "Hasar Kaydı", value: listing.damageRecord || listing.damage }
  ];

  const featureMarkup = renderTagList(listing.features);
  const expertiseRows = [
    { label: "Değişen", value: listing.changedParts },
    { label: "Boyalı", value: listing.paintedParts },
    { label: "Hasarlı", value: listing.damagedParts },
    { label: "Hasar Kaydı", value: listing.damageRecord || listing.damage },
    { label: "Ekspertiz", value: listing.expertise || listing.inspection }
  ].filter((row) => formatValue(row.value));

  const sections = [];
  const specsMarkup = renderSpecGrid(specRows);
  if (specsMarkup) {
    sections.push(`
      <div class="spec-section">
        <h4>Teknik Bilgiler</h4>
        ${specsMarkup}
      </div>
    `);
  }

  if (featureMarkup) {
    sections.push(`
      <div class="spec-section">
        <h4>Özellikler</h4>
        ${featureMarkup}
      </div>
    `);
  }

  if (expertiseRows.length) {
    sections.push(`
      <div class="spec-section">
        <h4>Ekspertiz / Hasar Bilgisi</h4>
        ${renderSpecGrid(expertiseRows)}
      </div>
    `);
  }

  techTab.innerHTML = sections.length
    ? sections.join("")
    : `<p id="techText">Bu ilan için teknik özellik bilgisi bulunmuyor.</p>`;
}

function renderGallery(listing) {
  const main = document.getElementById("mainImage");
  const thumbs = document.getElementById("thumbnails");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  images = Array.isArray(listing.images) && listing.images.length
    ? listing.images
    : listing.image && String(listing.image).trim() !== ""
      ? [listing.image]
      : ["https://picsum.photos/600/400"];

  const normalizedImages = images.map((img) => resolveImage(img));
  currentIndex = 0;

  function showImage(index) {
    if (!main) return;

    main.onload = () => {
      main.parentElement.querySelector(".no-image-text")?.remove();
    };
    main.onerror = () => {
      main.src = "https://picsum.photos/600/400";
    };
    main.src = normalizedImages[index];

    document.querySelectorAll("#thumbnails img").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  showImage(currentIndex);

  if (!thumbs) return;
  thumbs.innerHTML = "";

  normalizedImages.forEach((img, index) => {
    const el = document.createElement("img");
    el.src = img;
    el.className = index === 0 ? "active" : "";
    el.alt = `Küçük görsel ${index + 1}`;
    el.onerror = () => {
      el.src = "https://picsum.photos/120/90";
    };
    el.onclick = () => {
      currentIndex = index;
      showImage(currentIndex);
    };
    thumbs.appendChild(el);
  });

  if (next) {
    next.onclick = () => {
      currentIndex = (currentIndex + 1) % normalizedImages.length;
      showImage(currentIndex);
    };
  }

  if (prev) {
    prev.onclick = () => {
      currentIndex = (currentIndex - 1 + normalizedImages.length) % normalizedImages.length;
      showImage(currentIndex);
    };
  }
}

function renderListingData(data) {
  window.listingData = data;
  document.title = `${data.title || "İlan"} | Jetle`;

  document.getElementById("title").innerText = data.title || "";
  document.getElementById("price").innerText = `${Number(data.price || 0).toLocaleString("tr-TR")} TL`;
  document.getElementById("city").innerText = data.city || "";
  document.getElementById("category").innerText = data.category || "";

  const descEl = document.getElementById("desc");
  const descTextEl = document.getElementById("descText");
  if (descEl && !descTextEl) descEl.innerText = data.desc || data.description || "";
  if (descTextEl) descTextEl.innerText = data.desc || data.description || "";

  const sellerName = document.getElementById("sellerName");
  const sellerCity = document.getElementById("sellerCity");
  if (sellerName) sellerName.innerText = data.sellerName || "Jetle Kullanıcı";
  if (sellerCity) sellerCity.innerText = data.city || "";

  renderGallery(data);
  renderTechSpecs(data);
}

function openMessagesForListing() {
  const listing = window.listingData || {};
  const listingId = listing._id || listing.id || "";
  window.location.href = `/messages.html?listingId=${encodeURIComponent(listingId)}`;
}

function showPhoneInfo() {
  const listing = window.listingData || {};
  const phone = String(listing.phone || listing.user?.phone || "").trim();
  if (!phone) {
    alert("Telefon bilgisi yok");
    return;
  }
  alert(phone);
}

async function loadListing() {
  const id = new URLSearchParams(window.location.search).get("id");

  try {
    fetch(`/api/listings/${id}/view`, {
      method: "POST"
    });

    const res = await fetch(`/api/listings/${id}`);
    if (!res.ok) throw new Error("not found");

    const data = await res.json();
    console.log("DATA:", data);
    renderListingData(data);
  } catch (err) {
    const localPending = getLocalPendingListingById(id);
    if (localPending) {
      console.log("DETAIL FALLBACK: local pending listing used", localPending);
      renderListingData(localPending);
      return;
    }

    document.querySelector(".detail-container").innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2>İlan bulunamadı</h2>
        <p>Bu ilan silinmiş veya mevcut değil.</p>
        <a href="index.html">Ana sayfaya dön</a>
      </div>
    `;
  }
}

loadListing();

document.querySelectorAll(".tab").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

window.openMessagesForListing = openMessagesForListing;
window.showPhoneInfo = showPhoneInfo;
