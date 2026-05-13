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
let galleryImages = [];
let galleryShowImage = null;
let galleryModalOpen = false;
let galleryModalBound = false;

function resolveImage(src) {
  const value = String(src || "").trim();
  if (!value) return "";
  const lowered = value.toLowerCase();
  if (
    lowered.includes("picsum.photos") ||
    lowered.includes("images.unsplash.com") ||
    lowered.includes("source.unsplash.com")
  ) {
    return "";
  }
  return value;
}

function getListingImages(listing) {
  const values = [];
  if (Array.isArray(listing?.images)) values.push(...listing.images);
  if (Array.isArray(listing?.photos)) values.push(...listing.photos);
  if (listing?.image) values.push(listing.image);

  return [...new Set(values.map((item) => resolveImage(item)).filter(Boolean))];
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

function getGalleryModalElements() {
  return {
    modal: document.getElementById("galleryModal"),
    image: document.getElementById("galleryModalImage"),
    counter: document.getElementById("galleryModalCounter"),
    thumbs: document.getElementById("galleryModalThumbs"),
    prev: document.getElementById("galleryModalPrev"),
    next: document.getElementById("galleryModalNext"),
    close: document.getElementById("galleryModalClose")
  };
}

function normalizeGalleryIndex(index) {
  if (!galleryImages.length) return 0;
  const length = galleryImages.length;
  return ((index % length) + length) % length;
}

function renderGalleryModal() {
  const { image, counter, thumbs } = getGalleryModalElements();
  if (!image || !counter || !thumbs || !galleryImages.length) return;

  image.src = galleryImages[currentIndex];
  image.onerror = () => {
    image.removeAttribute("src");
  };
  counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;

  thumbs.innerHTML = "";
  galleryImages.forEach((src, index) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.alt = `Büyük fotoğraf küçük görsel ${index + 1}`;
    thumb.className = index === currentIndex ? "active" : "";
    thumb.onerror = () => {
      thumb.remove();
    };
    thumb.onclick = () => setGalleryImage(index);
    thumbs.appendChild(thumb);
  });
}

function setGalleryImage(index) {
  if (!galleryImages.length) return;
  currentIndex = normalizeGalleryIndex(index);

  if (typeof galleryShowImage === "function") {
    galleryShowImage(currentIndex);
  }

  if (galleryModalOpen) {
    renderGalleryModal();
  }
}

function openGalleryModal(index = currentIndex) {
  const { modal } = getGalleryModalElements();
  if (!modal || !galleryImages.length) return;

  bindGalleryModalEvents();
  galleryModalOpen = true;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setGalleryImage(index);
}

function closeGalleryModal() {
  const { modal } = getGalleryModalElements();
  if (!modal) return;

  galleryModalOpen = false;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function bindGalleryModalEvents() {
  if (galleryModalBound) return;
  galleryModalBound = true;

  const { modal, prev, next, close } = getGalleryModalElements();
  if (!modal) return;

  prev?.addEventListener("click", () => setGalleryImage(currentIndex - 1));
  next?.addEventListener("click", () => setGalleryImage(currentIndex + 1));
  close?.addEventListener("click", closeGalleryModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeGalleryModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!galleryModalOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeGalleryModal();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setGalleryImage(currentIndex - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setGalleryImage(currentIndex + 1);
    }
  });
}

function renderGallery(listing) {
  const main = document.getElementById("mainImage");
  const thumbs = document.getElementById("thumbnails");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const imageCount = document.getElementById("imageCount");
  const noImageText = main?.parentElement?.querySelector(".no-image-text");

  images = getListingImages(listing);
  galleryImages = images.slice();
  currentIndex = 0;

  if (imageCount) {
    imageCount.textContent = images.length ? `${images.length} Fotoğraf` : "Görsel yok";
  }

  if (!images.length) {
    if (main) {
      main.removeAttribute("src");
      main.style.display = "none";
      main.onclick = null;
      main.style.cursor = "default";
    }
    if (noImageText) noImageText.style.display = "flex";
    if (thumbs) thumbs.innerHTML = "";
    if (prev) prev.style.display = "none";
    if (next) next.style.display = "none";
    closeGalleryModal();
    return;
  }

  const normalizedImages = images;

  function showImage(index) {
    if (!main) return;
    if (noImageText) noImageText.style.display = "none";
    main.style.display = "block";
    if (prev) prev.style.display = "";
    if (next) next.style.display = "";

    main.onload = () => {
      if (noImageText) noImageText.style.display = "none";
    };
    main.onerror = () => {
      main.removeAttribute("src");
      if (noImageText) noImageText.style.display = "flex";
    };
    main.src = normalizedImages[index];

    document.querySelectorAll("#thumbnails img").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  galleryShowImage = showImage;

  showImage(currentIndex);

  if (main) {
    main.style.cursor = "zoom-in";
    main.onclick = () => openGalleryModal(currentIndex);
  }

  if (!thumbs) return;
  thumbs.innerHTML = "";

  normalizedImages.forEach((img, index) => {
    const el = document.createElement("img");
    el.src = img;
    el.className = index === 0 ? "active" : "";
    el.alt = `Küçük görsel ${index + 1}`;
    el.onerror = () => {
      el.remove();
    };
    el.onclick = () => {
      setGalleryImage(index);
    };
    thumbs.appendChild(el);
  });

  if (next) {
    next.onclick = () => {
      setGalleryImage(currentIndex + 1);
    };
  }

  if (prev) {
    prev.onclick = () => {
      setGalleryImage(currentIndex - 1);
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
    renderListingData(data);
  } catch (err) {
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