document.addEventListener("DOMContentLoaded", () => {
  const userRaw = localStorage.getItem("user");

  if (!userRaw) {
    alert("İlan vermek için giriş yapmalısınız.");
    window.location.href = "/login.html";
    return;
  }

  const PLACEHOLDER_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='140'%3E%3Crect fill='%23e5e7eb' width='400' height='140'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EFoto%C4%9Fraf%20yok%3C/text%3E%3C/svg%3E";

  const categorySelect = document.getElementById("category");
  const dynamicFields = document.getElementById("dynamicFields");
  const imageInput = document.getElementById("images");
  const preview = document.getElementById("imagePreview");
  const photoDropZone = document.getElementById("photoDropZone");
  const priceInput = document.getElementById("price");
  const titleInput = document.getElementById("title");
  const cityInput = document.getElementById("city");
  const descriptionInput = document.getElementById("description");

  const livePreviewImg = document.getElementById("livePreviewImg");
  const livePreviewTitle = document.getElementById("livePreviewTitle");
  const livePreviewMeta = document.getElementById("livePreviewMeta");
  const livePreviewPrice = document.getElementById("livePreviewPrice");

  const LS_LISTINGS_CACHE = "jetle_listings_cache";
  const MAX_IMAGES = 20;

  let stagedImageFiles = [];
  let currentStep = 1;
  let selectedDamageStatus = "orijinal";

  livePreviewImg.src = PLACEHOLDER_IMG;

  const panels = () => Array.from(document.querySelectorAll(".step-panel"));
  const indicators = () => Array.from(document.querySelectorAll("[data-step-indicator]"));

  function showStep(step) {
    currentStep = step;
    panels().forEach((panel) => {
      const panelStep = Number(panel.dataset.step);
      const active = panelStep === step;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    indicators().forEach((indicator) => {
      const itemStep = Number(indicator.dataset.stepIndicator);
      indicator.classList.toggle("active", itemStep === step);
      indicator.classList.toggle("done", itemStep < step);
    });
  }

  function digitsOnly(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function formatTurkishTL(digits) {
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " TL";
  }

  function getPriceRaw() {
    return digitsOnly(priceInput.value);
  }

  function syncInputFilesFromStaged() {
    if (typeof DataTransfer !== "function") return;
    const dt = new DataTransfer();
    stagedImageFiles.forEach((file) => dt.items.add(file));
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
    stagedImageFiles.forEach((file, index) => {
      const div = document.createElement("div");
      div.className = "preview-item";
      div.draggable = true;
      div.dataset.index = String(index);

      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = () => URL.revokeObjectURL(img.src);

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "X";
      button.className = "remove-btn";

      button.addEventListener("click", () => {
        stagedImageFiles.splice(index, 1);
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
      div.appendChild(button);
      preview.appendChild(div);
    });
  }

  function updateLivePreviewImage() {
    if (!stagedImageFiles.length) {
      livePreviewImg.src = PLACEHOLDER_IMG;
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      livePreviewImg.src = String(event.target?.result || PLACEHOLDER_IMG);
    };
    reader.onerror = () => {
      livePreviewImg.src = PLACEHOLDER_IMG;
    };
    reader.readAsDataURL(stagedImageFiles[0]);
  }

  function addImageFilesFromDrop(fileList) {
    const incoming = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
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
    const category = categorySelect.value || "Kategori";
    const city = cityInput.value.trim() || "Şehir";
    const priceRaw = getPriceRaw();

    livePreviewTitle.textContent = title;
    livePreviewMeta.textContent = `${category} - ${city}`;
    livePreviewPrice.textContent = priceRaw ? formatTurkishTL(priceRaw) : "-";
  }

  function clearFieldError(element) {
    const group = element.closest(".field-group");
    if (group) group.classList.remove("field-error");
  }

  function markError(id) {
    const element = document.getElementById(id);
    element?.closest(".field-group")?.classList.add("field-error");
  }

  function renderFields() {
    const category = categorySelect.value;
    dynamicFields.innerHTML = "";

    if (category === "Otomobil") {
      dynamicFields.innerHTML = `
        <div class="create-v2-form-grid">
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
              <option value="Benzin">Benzin</option>
              <option value="Dizel">Dizel</option>
              <option value="Elektrik">Elektrik</option>
            </select>
          </div>
          <div class="field-group">
            <label for="gear">Vites</label>
            <select id="gear">
              <option value="Manuel">Manuel</option>
              <option value="Otomatik">Otomatik</option>
            </select>
          </div>
        </div>
      `;
      return;
    }

    if (category === "Emlak") {
      dynamicFields.innerHTML = `
        <div class="create-v2-form-grid">
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
      return;
    }

    if (category === "Elektronik") {
      dynamicFields.innerHTML = `
        <div class="create-v2-form-grid">
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

  function collectAracParcalari() {
    const result = {};
    document.querySelectorAll(".part").forEach((part) => {
      const name = part.getAttribute("data-name");
      if (!name) return;
      if (part.classList.contains("degisen")) result[name] = "degisen";
      else if (part.classList.contains("lokal")) result[name] = "lokal";
      else if (part.classList.contains("boyali")) result[name] = "boyali";
      else result[name] = "orijinal";
    });
    return result;
  }

  function collectOzellikler() {
    const result = {};
    document.querySelectorAll('input[type="checkbox"][id^="feat_"]').forEach((checkbox) => {
      result[checkbox.id] = !!checkbox.checked;
    });
    return result;
  }

  function appendListingToLocalCache(entry) {
    let cache = [];
    try {
      cache = JSON.parse(localStorage.getItem(LS_LISTINGS_CACHE) || "[]");
    } catch (error) {
      cache = [];
    }
    if (!Array.isArray(cache)) cache = [];

    const normalized = {
      _id: entry._id || entry.id,
      title: entry.title,
      price: Number(entry.price || 0),
      category: entry.category,
      city: entry.city,
      image: entry.image || "",
      description: entry.description || "",
      features: entry.features || {},
      damageMap: entry.damageMap || {},
    };

    const next = cache.filter((item) => String(item._id) !== String(normalized._id));
    next.unshift(normalized);
    try {
      localStorage.setItem(LS_LISTINGS_CACHE, JSON.stringify(next));
    } catch (error) {
      console.warn("Local cache update skipped", error);
    }
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

  [titleInput, cityInput, descriptionInput, categorySelect].forEach((element) => {
    if (!element) return;
    element.addEventListener("focus", () => clearFieldError(element));
    element.addEventListener("input", () => {
      clearFieldError(element);
      updateLivePreview();
    });
    element.addEventListener("change", () => {
      clearFieldError(element);
      updateLivePreview();
    });
  });

  categorySelect.addEventListener("change", () => {
    renderFields();
    updateLivePreview();
  });

  photoDropZone.addEventListener("dragenter", (event) => {
    event.preventDefault();
  });
  photoDropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (event.target.closest(".preview-item")) return;
    photoDropZone.classList.add("drag-over");
  });
  photoDropZone.addEventListener("dragleave", () => {
    photoDropZone.classList.remove("drag-over");
  });
  photoDropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    photoDropZone.classList.remove("drag-over");
    if (event.target.closest(".preview-item")) return;
    if (event.dataTransfer?.files?.length) {
      addImageFilesFromDrop(event.dataTransfer.files);
    }
  });

  imageInput.addEventListener("change", function onChange() {
    if (!this.files?.length) {
      syncInputFilesFromStaged();
      renderThumbPreviews();
      updateLivePreviewImage();
      return;
    }
    addImageFilesFromDrop(this.files);
  });

  preview.addEventListener("dragover", (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(preview, event.clientX);
    const dragging = preview.querySelector(".dragging");
    if (!dragging) return;

    if (!afterElement) {
      preview.appendChild(dragging);
    } else {
      preview.insertBefore(dragging, afterElement);
    }
  });

  document.getElementById("btnStep1Next").addEventListener("click", () => {
    if (!titleInput.value.trim()) {
      titleInput.closest(".field-group")?.classList.add("field-error");
      titleInput.focus();
      alert("Lütfen ilan başlığını yazın.");
      return;
    }
    showStep(2);
  });

  document.getElementById("btnStep2Back").addEventListener("click", () => showStep(1));
  document.getElementById("btnStep2Next").addEventListener("click", () => showStep(3));
  document.getElementById("btnStep3Back").addEventListener("click", () => showStep(2));

  document.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-status]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      selectedDamageStatus = button.getAttribute("data-status") || "orijinal";
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

  document.getElementById("createForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (currentStep !== 3) {
      alert("Önce adımları tamamlayıp son adıma gelin.");
      return;
    }

    document.querySelectorAll(".field-error").forEach((node) => node.classList.remove("field-error"));

    const titleVal = titleInput.value.trim();
    const cityVal = cityInput.value.trim();
    const priceRaw = getPriceRaw();

    let valid = true;
    if (!titleVal) {
      markError("title");
      valid = false;
    }
    if (!cityVal) {
      markError("city");
      valid = false;
    }
    if (!priceRaw || priceRaw === "0") {
      markError("price");
      valid = false;
    }

    if (!valid) {
      alert("Lütfen başlık, şehir ve geçerli bir fiyat girin.");
      return;
    }

    const payload = {
      title: titleVal,
      description: descriptionInput.value.trim(),
      desc: descriptionInput.value.trim(),
      price: priceRaw,
      category: categorySelect.value,
      city: cityVal,
      location: cityVal,
      features: collectOzellikler(),
      damageMap: collectAracParcalari(),
    };

    ["year", "km", "fuel", "gear", "rooms", "m2", "age", "brand", "model"].forEach((id) => {
      const element = document.getElementById(id);
      if (element && element.value) payload[id] = element.value;
    });

    const files = imageInput.files;
    let requestBody = JSON.stringify(payload);
    const headers = files.length > 0 ? {} : { "Content-Type": "application/json" };

    if (files.length > 0) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
      });
      for (let i = 0; i < files.length; i += 1) {
        formData.append("images", files[i]);
      }
      requestBody = formData;
    }

    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch("/api/listings", {
        method: "POST",
        headers,
        body: requestBody,
      });
    } catch (error) {
      alert("Sunucuya bağlanılamadı. İnternet veya API adresini kontrol edin.");
      return;
    }

    if (!response.ok) {
      let message = "İlan kaydedilemedi.";
      try {
        const json = await response.json();
        message = json.error || json.msg || message;
      } catch (error) {
        try {
          message = (await response.text()) || message;
        } catch (innerError) {
          console.warn(innerError);
        }
      }
      alert(message);
      return;
    }

    let saved = null;
    try {
      saved = await response.json();
    } catch (error) {
      saved = null;
    }

    if (saved && saved._id) {
      appendListingToLocalCache(saved);
    }

    alert("İlan başarıyla kaydedildi.");
    window.location.href = "/index.html";
  });

  renderFields();
  showStep(1);
  updateLivePreview();
});
