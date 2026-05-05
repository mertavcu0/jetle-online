document.addEventListener("DOMContentLoaded", () => {
const user = localStorage.getItem("user");

if (!user) {
  alert("İlan vermek için giriş yapmalısın");
  window.location.href = "login.html";
  return;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='140'%3E%3Crect fill='%23e5e7eb' width='400' height='140'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EFotoğraf yok%3C/text%3E%3C/svg%3E";

const categorySelect = document.getElementById("category");
const dynamicFields = document.getElementById("dynamicFields");
const imageInput = document.getElementById("images");
const preview = document.getElementById("imagePreview");
const photoDropZone = document.getElementById("photoDropZone");
const priceInput = document.getElementById("price");
const titleInput = document.getElementById("title");
const cityInput = document.getElementById("city");

const livePreviewImg = document.getElementById("livePreviewImg");
const livePreviewTitle = document.getElementById("livePreviewTitle");
const livePreviewMeta = document.getElementById("livePreviewMeta");
const livePreviewPrice = document.getElementById("livePreviewPrice");

const LS_USER_LISTINGS = "jetle_user_listings";
const LS_LISTINGS_CACHE = "jetle_listings_cache";
const MAX_IMAGES = 20;

let stagedImageFiles = [];
let currentStep = 1;

const panels = () => Array.from(document.querySelectorAll(".step-panel"));
const indicators = () => Array.from(document.querySelectorAll(".step-progress-item"));

function showStep(n) {
  currentStep = n;
  panels().forEach((p) => {
    const step = Number(p.dataset.step);
    p.classList.toggle("active", step === n);
    p.hidden = step !== n;
  });
  indicators().forEach((el) => {
    const s = Number(el.dataset.stepIndicator);
    el.classList.toggle("active", s === n);
    el.classList.toggle("done", s < n);
  });
}

function digitsOnly(str) {
  return String(str || "").replace(/\D/g, "");
}

function formatTurkishTL(digits) {
  if (!digits) return "";
  const withDots = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return withDots + " TL";
}

function getPriceRaw() {
  return digitsOnly(priceInput.value);
}

let priceFormatting = false;
priceInput.addEventListener("input", () => {
  if (priceFormatting) return;
  priceFormatting = true;
  const digits = digitsOnly(priceInput.value);
  priceInput.value = digits ? formatTurkishTL(digits) : "";
  priceFormatting = false;
  updateLivePreview();
});

function syncInputFilesFromStaged() {
  const dt = new DataTransfer();
  stagedImageFiles.forEach((f) => dt.items.add(f));
  imageInput.files = dt.files;
}

function getDragAfterElement(container, x) {
  const elements = [...container.querySelectorAll(".preview-item:not(.dragging)")];

  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }

    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function syncStagedOrderFromPreview() {
  const nextOrder = [...preview.querySelectorAll(".preview-item")]
    .map((item) => stagedImageFiles[Number(item.dataset.index)])
    .filter(Boolean);

  if (nextOrder.length === stagedImageFiles.length) {
    stagedImageFiles = nextOrder;
    syncInputFilesFromStaged();
  }
}

function renderThumbPreviews() {
  preview.innerHTML = "";
  stagedImageFiles.forEach((file, i) => {
    const div = document.createElement("div");
    div.className = "preview-item";
    div.draggable = true;
    div.dataset.index = String(i);

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src);
    img.alt = "";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerText = "X";
    btn.className = "remove-btn";

    btn.addEventListener("click", () => {
      stagedImageFiles.splice(i, 1);
      syncInputFilesFromStaged();
      renderThumbPreviews();
      updateLivePreviewImage();
    });

    div.addEventListener("dragstart", () => {
      div.classList.add("dragging");
    });

    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
      syncStagedOrderFromPreview();
      renderThumbPreviews();
      updateLivePreviewImage();
    });

    div.appendChild(img);
    div.appendChild(btn);
    preview.appendChild(div);
  });
}

function updateLivePreviewImage() {
  if (stagedImageFiles.length === 0) {
    livePreviewImg.src = PLACEHOLDER_IMG;
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    livePreviewImg.src = e.target.result;
  };
  reader.readAsDataURL(stagedImageFiles[0]);
}

function addImageFilesFromDrop(fileList) {
  const incoming = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
  if (!incoming.length) return;
  const availableSlots = MAX_IMAGES - stagedImageFiles.length;
  if (availableSlots <= 0) {
    alert(`En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz.`);
    return;
  }
  if (incoming.length > availableSlots) {
    alert(`En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz. İlk ${availableSlots} fotoğraf eklendi.`);
  }
  stagedImageFiles = stagedImageFiles.concat(incoming.slice(0, availableSlots));
  syncInputFilesFromStaged();
  renderThumbPreviews();
  updateLivePreviewImage();
}

function updateLivePreview() {
  const title = titleInput.value.trim() || "İlan başlığı";
  const cat = categorySelect.value || "Kategori";
  const city = cityInput.value.trim() || "Şehir";
  const raw = getPriceRaw();
  livePreviewTitle.textContent = title;
  livePreviewMeta.textContent = `${cat} • ${city}`;
  livePreviewPrice.textContent = raw ? formatTurkishTL(raw) : "—";
}

function clearFieldError(el) {
  const g = el.closest(".field-group");
  if (g) g.classList.remove("field-error");
}

["title", "city", "price", "category", "description"].forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("focus", () => clearFieldError(el));
  el.addEventListener("input", () => {
    clearFieldError(el);
    if (id !== "price") updateLivePreview();
  });
  el.addEventListener("change", () => {
    clearFieldError(el);
    updateLivePreview();
  });
});

photoDropZone.addEventListener("dragenter", (e) => {
  e.preventDefault();
});
photoDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (e.target.closest(".preview-item")) return;
  photoDropZone.classList.add("drag-over");
});
photoDropZone.addEventListener("dragleave", () => {
  photoDropZone.classList.remove("drag-over");
});
photoDropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  photoDropZone.classList.remove("drag-over");
  if (e.target.closest(".preview-item")) return;
  if (e.dataTransfer.files && e.dataTransfer.files.length) {
    addImageFilesFromDrop(e.dataTransfer.files);
  }
});

imageInput.addEventListener("change", function () {
  if (!this.files?.length) {
    syncInputFilesFromStaged();
    renderThumbPreviews();
    updateLivePreviewImage();
    return;
  }
  addImageFilesFromDrop(this.files);
});

preview.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(preview, e.clientX);
  const dragging = preview.querySelector(".dragging");

  if (!dragging) return;

  if (afterElement == null) {
    preview.appendChild(dragging);
  } else {
    preview.insertBefore(dragging, afterElement);
  }
});

categorySelect.addEventListener("change", () => {
  renderFields();
  updateLivePreview();
});

function renderFields() {
  const category = categorySelect.value;

  dynamicFields.innerHTML = "";

  if (category === "Otomobil") {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="year">Yıl</label>
          <input type="number" id="year" placeholder="Örn. 2020" />
        </div>
        <div class="field-group">
          <label for="km">Kilometre</label>
          <input type="number" id="km" placeholder="KM" />
        </div>
        <div class="field-group">
          <label for="fuel">Yakıt</label>
          <select id="fuel">
            <option>Benzin</option>
            <option>Dizel</option>
            <option>Elektrik</option>
          </select>
        </div>
        <div class="field-group">
          <label for="gear">Vites</label>
          <select id="gear">
            <option>Manuel</option>
            <option>Otomatik</option>
          </select>
        </div>
      </div>
    `;
  }

  if (category === "Emlak") {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="rooms">Oda Sayısı</label>
          <input type="text" id="rooms" placeholder="Örn. 3+1" />
        </div>
        <div class="field-group">
          <label for="m2">Metrekare</label>
          <input type="number" id="m2" placeholder="m²" />
        </div>
        <div class="field-group">
          <label for="age">Bina Yaşı</label>
          <input type="number" id="age" placeholder="Yıl" />
        </div>
      </div>
    `;
  }

  if (category === "Elektronik") {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="brand">Marka</label>
          <input type="text" id="brand" placeholder="Marka" />
        </div>
        <div class="field-group">
          <label for="model">Model</label>
          <input type="text" id="model" placeholder="Model" />
        </div>
      </div>
    `;
  }
}

renderFields();
showStep(1);
updateLivePreview();

function collectAracParcalari() {
  const o = {};
  document.querySelectorAll(".damage-panel .car-svg .part").forEach((p) => {
    const name = p.getAttribute("data-name");
    if (!name) return;
    if (p.classList.contains("degisen")) o[name] = "degisen";
    else if (p.classList.contains("lokal")) o[name] = "lokal";
    else if (p.classList.contains("boyali")) o[name] = "boyali";
    else o[name] = "orijinal";
  });
  return o;
}

document.getElementById("btnStep1Next").addEventListener("click", () => {
  const titleEl = document.getElementById("title");
  if (!titleEl.value.trim()) {
    titleEl.closest(".field-group")?.classList.add("field-error");
    titleEl.focus();
    alert("Lütfen ilan başlığını yazın.");
    return;
  }
  showStep(2);
});

document.getElementById("btnStep2Back").addEventListener("click", () => showStep(1));
document.getElementById("btnStep2Next").addEventListener("click", () => showStep(3));
document.getElementById("btnStep3Back").addEventListener("click", () => showStep(2));

function markError(id) {
  const el = document.getElementById(id);
  el?.closest(".field-group")?.classList.add("field-error");
}

function collectOzellikler() {
  const root = document.querySelector(".features-root");
  const o = {};
  if (!root) return o;
  root.querySelectorAll('input[type="checkbox"][id^="feat_"]').forEach((cb) => {
    o[cb.id] = !!cb.checked;
  });
  return o;
}

function readFirstImageDataUrl() {
  if (!stagedImageFiles.length) return Promise.resolve("");
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => resolve("");
    r.readAsDataURL(stagedImageFiles[0]);
  });
}

function appendUserListingToCacheShape(entry) {
  let cache = [];
  try {
    cache = JSON.parse(localStorage.getItem(LS_LISTINGS_CACHE) || "[]");
  } catch (e) {
    cache = [];
  }
  if (!Array.isArray(cache)) cache = [];
  const normalized = {
    _id: entry.id,
    title: entry.title,
    price: Number(entry.price),
    category: entry.category,
    city: entry.city,
    image: entry.image || "",
    description: entry.description || "",
    features: entry.ozellikler && typeof entry.ozellikler === "object" ? entry.ozellikler : {},
    aracParcalari:
      entry.aracParcalari && typeof entry.aracParcalari === "object" ? entry.aracParcalari : {},
    damageMap:
      (entry.damageMap && typeof entry.damageMap === "object" && entry.damageMap) ||
      (entry.aracParcalari && typeof entry.aracParcalari === "object" && entry.aracParcalari) ||
      {},
    km: entry.km,
    year: entry.year,
    fuel: entry.fuel,
    gear: entry.gear,
    rooms: entry.rooms,
    m2: entry.m2,
    age: entry.age,
    brand: entry.brand,
    model: entry.model,
  };
  const rest = cache.filter((x) => String(x._id) !== String(entry.id));
  rest.unshift(normalized);
  try {
    localStorage.setItem(LS_LISTINGS_CACHE, JSON.stringify(rest));
  } catch (e) {}
}

document.getElementById("createForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (currentStep !== 3) {
    alert("Önce adımları tamamlayıp son adıma gelin.");
    return;
  }

  document.querySelectorAll(".field-error").forEach((n) => n.classList.remove("field-error"));

  const titleVal = document.getElementById("title").value.trim();
  const cityVal = document.getElementById("city").value.trim();
  const priceRaw = getPriceRaw();

  let ok = true;
  if (!titleVal) {
    markError("title");
    ok = false;
  }
  if (!cityVal) {
    markError("city");
    ok = false;
  }
  if (!priceRaw || priceRaw === "0") {
    markError("price");
    ok = false;
  }

  if (!ok) {
    alert("Lütfen başlık, şehir ve geçerli bir fiyat girin.");
    return;
  }

  const ozellikler = collectOzellikler();
  const damageMap = collectAracParcalari();
  const categoryVal = document.getElementById("category").value;
  const descEl = document.getElementById("description");
  const description = (descEl && descEl.value.trim()) || "";

  const API_BASE = "";
  const payload = {
    title: titleVal,
    description,
    desc: description,
    price: priceRaw,
    category: categoryVal,
    city: cityVal,
    location: cityVal,
    features: ozellikler,
    damageMap,
  };
  ["year", "km", "rooms", "brand"].forEach((idName) => {
    const el = document.getElementById(idName);
    if (el) payload[idName] = el.value;
  });

  const files = imageInput.files;
  let requestBody = JSON.stringify(payload);
  if (files.length > 0) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
    });
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    requestBody = formData;
  }

  const headers = files.length > 0 ? {} : { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = "Bearer " + token;

  let res;
  try {
    res = await fetch(API_BASE + "/api/listings", {
      method: "POST",
      headers,
      body: requestBody,
    });
  } catch (err) {
    alert("Sunucuya bağlanılamadı. İnternet veya API adresini kontrol edin.");
    return;
  }

  if (!res.ok) {
    let errMsg = "İlan kaydedilemedi.";
    try {
      const j = await res.json();
      errMsg = j.error || j.msg || errMsg;
    } catch (e) {
      try {
        errMsg = (await res.text()) || errMsg;
      } catch (e2) {}
    }
    alert(errMsg);
    return;
  }

  let saved;
  try {
    saved = await res.json();
  } catch (e) {
    saved = null;
  }

  if (saved && saved._id) {
    try {
      const doc = {
        _id: String(saved._id),
        title: saved.title,
        price: saved.price,
        city: saved.city || "",
        category: saved.category || "",
        description: saved.description || "",
        desc: saved.desc || saved.description || "",
        image: saved.image || "",
        features: saved.features || {},
        aracParcalari: saved.damageMap || {},
        damageMap: saved.damageMap || {},
      };
      let cache = [];
      try {
        cache = JSON.parse(localStorage.getItem(LS_LISTINGS_CACHE) || "[]");
      } catch (e) {
        cache = [];
      }
      if (!Array.isArray(cache)) cache = [];
      const rest = cache.filter((x) => String(x._id) !== doc._id);
      rest.unshift(doc);
      localStorage.setItem(LS_LISTINGS_CACHE, JSON.stringify(rest));
    } catch (e) {}
  }

  console.log("İlan kaydedildi");
  alert("İlan başarıyla kaydedildi");
  window.location.href = "index.html";
});

let selectedDamageStatus = "orijinal";

document.querySelectorAll("[data-status]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-status]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedDamageStatus = btn.getAttribute("data-status") || "orijinal";
  });
});

document.querySelectorAll(".part").forEach((part) => {
  part.addEventListener("click", () => {
    part.classList.remove("orijinal", "boyali", "lokal", "degisen", "active");

    if (selectedDamageStatus !== "orijinal") {
      part.classList.add(selectedDamageStatus, "active");
    }
  });
});

});

