document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (!user) {
    alert("İlan vermek için giriş yapmalısınız.");
    window.location.href = "/login.html";
    return;
  }

  const PLACEHOLDER_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='140'%3E%3Crect fill='%23e5e7eb' width='400' height='140'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EFoto%C4%9Fraf%20yok%3C/text%3E%3C/svg%3E";
  const cityData = window.cities || {};
  const token = localStorage.getItem("token");
  const MAX_PHOTOS = 30;
  const fuelOptions = ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"];
  const transmissionOptions = ["Manuel", "Otomatik", "Yarı Otomatik"];
  const bodyTypes = ["Sedan", "Hatchback", "SUV", "Coupe", "Pickup", "Minivan", "Station Wagon"];
  const colors = ["Beyaz", "Siyah", "Gri", "Kırmızı", "Mavi"];

  const $ = (id) => document.getElementById(id);
  const categorySelect = $("category");
  const dynamicFields = $("dynamicFields");
  const imageInput = $("images");
  const preview = $("preview");
  const videoInput = $("video");
  const videoPreview = $("videoPreview");
  const photoDropZone = $("photoDropZone");
  const priceInput = $("price");
  const titleInput = $("title");
  const cityInput = $("city");
  const districtInput = $("district");
  const descriptionInput = $("description");
  const livePreviewImg = $("livePreviewImg");
  const livePreviewTitle = $("livePreviewTitle");
  const livePreviewMeta = $("livePreviewMeta");
  const livePreviewPrice = $("livePreviewPrice");
  const step1Message = $("step1Message");
  const step2Message = $("step2Message");
  const step1Next = $("btnStep1Next");
  const step2Next = $("btnStep2Next");
  const damageStatusList = $("damageStatusList");
  const damageTooltip = $("damageTooltip");

  let currentStep = 1;
  let stagedImageFiles = [];
  let carData = {};
  const damageLabels = {
    original: "Normal",
    painted: "Boyalı",
    changed: "Değişen",
    damaged: "Hasarlı",
    boyali: "Boyalı",
    degisen: "Değişen",
    lokal: "Lokal Boyalı",
  };

  livePreviewImg.src = PLACEHOLDER_IMG;

  function field(id) {
    return document.getElementById(id);
  }

  function safeVal(name) {
    const el = document.querySelector(`[name="${name}"]`) || document.getElementById(name);
    return el ? String(el.value || "") : "";
  }

  function setVal(name, value) {
    const el = document.querySelector(`[name="${name}"]`) || document.getElementById(name);
    if (el) el.value = value;
  }

  function digitsOnly(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function formatTL(value) {
    const digits = digitsOnly(value);
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " TL";
  }

  function rawPrice() {
    return digitsOnly(safeVal("price"));
  }

  function selectOptions(values, placeholder) {
    return [`<option value="">${placeholder}</option>`, ...values.map((value) => `<option value="${value}">${value}</option>`)].join("");
  }

  function populateSelect(id, data) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = '<option value="">Seç</option>';
    data.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      select.appendChild(opt);
    });
    select.disabled = false;
  }

  function clearError(element) {
    element?.closest(".field-group")?.classList.remove("field-error");
  }

  function markError(id) {
    const element = field(id);
    element?.closest(".field-group")?.classList.add("field-error");
  }

  function panels() {
    return Array.from(document.querySelectorAll(".step-panel"));
  }

  function indicators() {
    return Array.from(document.querySelectorAll(".step-progress-item"));
  }

  function showStep(step) {
    currentStep = step;
    panels().forEach((panel) => {
      const active = Number(panel.dataset.step) === step;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    indicators().forEach((item) => {
      const order = Number(item.dataset.stepIndicator);
      item.classList.toggle("active", order === step);
      item.classList.toggle("done", order < step);
    });
    updateLivePreview();
    updateStepButtons();
  }

  function normalizeCarData(brands) {
    return (brands || []).reduce((acc, brand) => {
      if (!brand?.name) return acc;
      acc[brand.name] = {};
      (brand.series || []).forEach((series) => {
        if (series?.name) {
          acc[brand.name][series.name] = (series.models || []).map((item) =>
            typeof item === "string" ? { name: item, fuel: [], transmission: [], body: [] } : item
          );
        }
      });
      return acc;
    }, {});
  }

  async function loadCarData() {
    try {
      const res = await fetch("/api/cars");
      if (!res.ok) throw new Error("Araç verisi yüklenemedi");
      carData = normalizeCarData(await res.json());
    } catch (error) {
      console.error("CAR DATA ERROR:", error);
      carData = {};
    }
  }

  function selectedVehicleModel() {
    const brand = safeVal("brand");
    const series = safeVal("series");
    const modelName = safeVal("model");
    const models = brand && series ? carData[brand]?.[series] || [] : [];
    return models.find((item) => item.name === modelName) || null;
  }

  function applyVehicleSpecs() {
    const selected = selectedVehicleModel();
    if (!selected) return;
    if (field("engine") && selected.engine) {
      field("engine").innerHTML = selectOptions([selected.engine], "Motor hacmi seçin");
      setVal("engine", selected.engine);
    }
  }

  function updateSeriesOptions() {
    const brand = safeVal("brand");
    const seriesSelect = field("series");
    const modelSelect = field("model");
    if (!seriesSelect || !modelSelect) return;
    const series = brand ? Object.keys(carData[brand] || {}) : [];
    seriesSelect.disabled = !series.length;
    seriesSelect.innerHTML = series.length
      ? selectOptions(series, "Seri seçin")
      : '<option value="">Önce marka seçin</option>';
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="">Önce seri seçin</option>';
  }

  function updateModelOptions() {
    const brand = safeVal("brand");
    const series = safeVal("series");
    const modelSelect = field("model");
    if (!modelSelect) return;
    const models = brand && series ? carData[brand]?.[series] || [] : [];
    modelSelect.disabled = !models.length;
    modelSelect.innerHTML = models.length
      ? selectOptions(models.map((item) => item.name), "Model seçin")
      : '<option value="">Önce seri seçin</option>';
  }

  function renderVehicleFields() {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="brand">Marka</label>
          <select id="brand" name="brand">${selectOptions(Object.keys(carData), "Marka seçin")}</select>
        </div>
        <div class="field-group">
          <label for="series">Seri</label>
          <select id="series" name="series" disabled><option value="">Önce marka seçin</option></select>
        </div>
        <div class="field-group">
          <label for="model">Model</label>
          <select id="model" name="model" disabled><option value="">Önce seri seçin</option></select>
        </div>
        <div class="field-group">
          <label for="year">Yıl</label>
          <input type="number" id="year" name="year" min="1980" max="2026" placeholder="Örn. 2020">
        </div>
        <div class="field-group">
          <label for="km">Kilometre</label>
          <input type="number" id="km" name="km" min="0" max="1000000" placeholder="Örn. 85000">
        </div>
        <div class="field-group">
          <label for="fuel">Yakıt</label>
          <select id="fuel" name="fuel"></select>
        </div>
        <div class="field-group">
          <label for="transmission">Vites</label>
          <select id="transmission" name="transmission"></select>
        </div>
        <div class="field-group">
          <label for="bodyType">Kasa tipi</label>
          <select id="bodyType" name="bodyType"></select>
        </div>
        <div class="field-group">
          <label for="color">Renk</label>
          <select id="color" name="color"></select>
        </div>
        <div class="field-group">
          <label for="engine">Motor hacmi</label>
          <select id="engine" name="engine">
            <option value="">Motor hacmi seçin</option>
            <option>1.0 - 1.3</option>
            <option>1.4 - 1.6</option>
            <option>1.8 - 2.0</option>
            <option>2.0 ve üzeri</option>
            <option>Elektrik</option>
          </select>
        </div>
      </div>
    `;

    populateSelect("fuel", fuelOptions);
    populateSelect("transmission", transmissionOptions);
    populateSelect("bodyType", bodyTypes);
    populateSelect("color", colors);

    field("brand")?.addEventListener("change", () => {
      updateSeriesOptions();
      updateLivePreview();
      updateStepButtons();
    });
    field("series")?.addEventListener("change", () => {
      updateModelOptions();
      updateLivePreview();
      updateStepButtons();
    });
    field("model")?.addEventListener("change", () => {
      applyVehicleSpecs();
      updateLivePreview();
      updateStepButtons();
    });

    ["model", "year", "km", "fuel", "transmission", "bodyType", "engine"].forEach((id) => {
      const element = field(id);
      if (!element) return;
      element.addEventListener("input", () => {
        updateLivePreview();
        updateStepButtons();
      });
      element.addEventListener("change", () => {
        updateLivePreview();
        updateStepButtons();
      });
    });
  }

  function renderRealEstateFields() {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="rooms">Oda sayısı</label>
          <input type="text" id="rooms" name="rooms" placeholder="Örn. 3+1">
        </div>
        <div class="field-group">
          <label for="m2">m²</label>
          <input type="number" id="m2" name="m2" placeholder="Örn. 120">
        </div>
        <div class="field-group">
          <label for="age">Bina yaşı</label>
          <input type="number" id="age" name="age" placeholder="Örn. 5">
        </div>
        <div class="field-group">
          <label for="floor">Kat</label>
          <input type="text" id="floor" name="floor" placeholder="Örn. 4">
        </div>
      </div>
    `;
  }

  function renderElectronicsFields() {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="brand">Marka</label>
          <input type="text" id="brand" name="brand" placeholder="Marka">
        </div>
        <div class="field-group">
          <label for="model">Model</label>
          <input type="text" id="model" name="model" placeholder="Model">
        </div>
      </div>
    `;
  }

  function renderFields() {
    const category = safeVal("category");
    dynamicFields.innerHTML = "";
    if (category === "Otomobil") renderVehicleFields();
    else if (category === "Emlak") renderRealEstateFields();
    else if (category === "Elektronik") renderElectronicsFields();
  }

  function populateCities() {
    cityInput.innerHTML = selectOptions(Object.keys(cityData), "Şehir seçin");
    populateDistricts();
  }

  function populateDistricts() {
    const districts = cityData[safeVal("city")] || [];
    districtInput.disabled = !districts.length;
    districtInput.innerHTML = districts.length
      ? selectOptions(districts, "İlçe seçin")
      : '<option value="">Önce şehir seçin</option>';
  }

  function step1Ready() {
    return Boolean(safeVal("category") && safeVal("title").trim() && safeVal("city"));
  }

  function step2Ready() {
    if (!safeVal("description").trim()) return false;
    if (safeVal("category") !== "Otomobil") return true;
    return ["brand", "series", "model", "year", "km", "fuel", "transmission", "bodyType"].every((name) => safeVal(name).trim());
  }

  function updateStepButtons() {
    if (step1Next) step1Next.disabled = !step1Ready();
    if (step2Next) step2Next.disabled = !step2Ready();
    if (step1Message) step1Message.textContent = step1Ready() ? "" : "Kategori, başlık ve şehir dolmadan devam edemezsiniz.";
    if (step2Message) step2Message.textContent = step2Ready() ? "" : "Detay alanlarını doldurun.";
  }

  function validateStep1() {
    let valid = true;
    ["category", "title", "city"].forEach((id) => {
      if (!safeVal(id).trim()) {
        markError(id);
        valid = false;
      }
    });
    if (!valid) alert("Kategori, başlık ve şehir zorunlu.");
    updateStepButtons();
    return valid;
  }

  function validateStep2() {
    let valid = true;
    if (!safeVal("description").trim()) {
      markError("description");
      valid = false;
    }
    if (safeVal("category") === "Otomobil") {
      ["brand", "series", "model", "year", "km", "fuel", "transmission", "bodyType"].forEach((id) => {
        if (!safeVal(id).trim()) {
          markError(id);
          valid = false;
        }
      });
    }
    if (!valid) alert("Lütfen detay alanlarını doldurun.");
    updateStepButtons();
    return valid;
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function updateLivePreview() {
    const title = safeVal("title").trim();
    const city = safeVal("city");
    const district = safeVal("district");
    const vehicle = [safeVal("brand"), safeVal("series"), safeVal("model")].filter(Boolean).join(" ");
    const location = [city ? `${city}${district ? ` / ${district}` : ""}` : "", vehicle].filter(Boolean).join(" ");
    const priceValue = rawPrice();
    const price = priceValue ? `${Number(priceValue).toLocaleString("tr-TR")} TL` : "-";

    setText("#livePreviewTitle", title || vehicle || "İlan başlığı");
    setText("#livePreviewMeta", location || "Kategori / Şehir");
    setText("#livePreviewPrice", price);
    setText("#previewTitle", title || vehicle);
    setText("#previewLocation", location);
    setText("#previewPrice", price);
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
    reader.readAsDataURL(stagedImageFiles[0]);
  }

  function syncInputFiles() {
    if (typeof DataTransfer !== "function") return;
    const dt = new DataTransfer();
    stagedImageFiles.forEach((file) => dt.items.add(file));
    imageInput.files = dt.files;
  }

  function renderImagePreview() {
    preview.innerHTML = "";
    stagedImageFiles.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "preview-item";
      item.draggable = true;
      item.dataset.index = String(index);

      const img = document.createElement("img");
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = String(event.target?.result || "");
      };
      reader.readAsDataURL(file);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "remove-btn";
      button.textContent = "X";
      button.addEventListener("click", () => {
        stagedImageFiles.splice(index, 1);
        syncInputFiles();
        renderImagePreview();
        updateLivePreviewImage();
      });

      item.addEventListener("dragstart", () => item.classList.add("dragging"));
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        syncStagedOrder();
        renderImagePreview();
        updateLivePreviewImage();
      });

      item.append(img, button);
      preview.appendChild(item);
    });
  }

  function getDragAfterElement(container, x) {
    const elements = [...container.querySelectorAll(".preview-item:not(.dragging)")];
    return elements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) return { offset, element: child };
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function syncStagedOrder() {
    const nextOrder = [...preview.querySelectorAll(".preview-item")]
      .map((item) => stagedImageFiles[Number(item.dataset.index)])
      .filter(Boolean);
    if (nextOrder.length === stagedImageFiles.length) {
      stagedImageFiles = nextOrder;
      syncInputFiles();
    }
  }

  function addImages(files) {
    const images = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    const freeSlots = MAX_PHOTOS - stagedImageFiles.length;
    if (freeSlots <= 0) {
      alert(`En fazla ${MAX_PHOTOS} fotoğraf yükleyebilirsiniz.`);
      return;
    }
    if (images.length > freeSlots) {
      alert(`En fazla ${MAX_PHOTOS} fotoğraf yükleyebilirsiniz. İlk ${freeSlots} fotoğraf eklendi.`);
    }
    stagedImageFiles = stagedImageFiles.concat(images.slice(0, freeSlots));
    syncInputFiles();
    renderImagePreview();
    updateLivePreviewImage();
  }

  function renderVideoPreview(file) {
    if (!videoPreview) return;
    videoPreview.innerHTML = "";
    if (!file || !file.type.startsWith("video/")) return;
    const video = document.createElement("video");
    video.controls = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);
    video.onloadeddata = () => URL.revokeObjectURL(video.src);
    videoPreview.appendChild(video);
  }

  function collectFeatures() {
    return Array.from(document.querySelectorAll('.features-root input[type="checkbox"]:checked'))
      .map((input) => input.closest("label")?.innerText.trim())
      .filter(Boolean);
  }

  function collectDamageMap() {
    const damageMap = {};
    document.querySelectorAll(".damage-panel .part").forEach((part) => {
      const name = part.dataset.part;
      if (!name) return;
      damageMap[name] = part.dataset.state || "original";
    });
    return damageMap;
  }

  function renderDamageStatusList() {
    if (!damageStatusList) return;
    const rows = Array.from(document.querySelectorAll(".damage-panel .part"))
      .map((part) => {
        const label = part.dataset.label || part.dataset.part || "Parça";
        const state = part.dataset.state || "original";
        const status = damageLabels[state] || state;
        return `<span>${label}: ${status}</span>`;
      })
      .join("");
    damageStatusList.innerHTML = rows || "<span>Parça seçimi bekleniyor</span>";
  }

  function positionDamageTooltip(event) {
    if (!damageTooltip) return;
    damageTooltip.style.left = `${event.clientX + 12}px`;
    damageTooltip.style.top = `${event.clientY + 12}px`;
  }

  function showDamageTooltip(part, event) {
    if (!damageTooltip) return;
    damageTooltip.textContent = part.dataset.label || part.dataset.part || "Parça";
    damageTooltip.style.display = "block";
    positionDamageTooltip(event);
  }

  function hideDamageTooltip() {
    if (damageTooltip) damageTooltip.style.display = "none";
  }

  async function uploadImagesIfNeeded() {
    if (!stagedImageFiles.length) return [];
    if (!token) {
      window.location.href = "/login.html";
      return [];
    }
    const formData = new FormData();
    stagedImageFiles.forEach((file) => formData.append("images", file));
    const res = await fetch("/api/listings/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.urls) ? data.urls : [];
  }

  function formPayload(imageUrls = []) {
    const payload = {
      title: safeVal("title").trim(),
      description: safeVal("description").trim(),
      desc: safeVal("description").trim(),
      price: Number(rawPrice()),
      category: safeVal("category"),
      subCategory: safeVal("subCategory"),
      city: safeVal("city"),
      district: safeVal("district"),
      location: safeVal("district") ? `${safeVal("city")} / ${safeVal("district")}` : safeVal("city"),
      features: collectFeatures(),
      damageMap: collectDamageMap(),
      images: imageUrls,
    };

    ["brand", "series", "model", "year", "km", "fuel", "gear", "transmission", "bodyType", "color", "engine", "rooms", "m2", "age", "floor"].forEach((id) => {
      const value = safeVal(id);
      if (value !== "") payload[id] = value;
    });

    if (!payload.transmission && payload.gear) payload.transmission = payload.gear;
    return payload;
  }

  priceInput?.addEventListener("input", () => {
    setVal("price", formatTL(safeVal("price")));
    updateLivePreview();
  });

  [titleInput, descriptionInput, cityInput, districtInput, categorySelect].forEach((element) => {
    element?.addEventListener("input", () => {
      clearError(element);
      updateLivePreview();
      updateStepButtons();
    });
    element?.addEventListener("change", () => {
      clearError(element);
      updateLivePreview();
      updateStepButtons();
    });
  });

  categorySelect?.addEventListener("change", () => {
    renderFields();
    updateLivePreview();
    updateStepButtons();
  });

  cityInput?.addEventListener("change", () => {
    populateDistricts();
    updateLivePreview();
    updateStepButtons();
  });

  document.addEventListener("input", (event) => {
    if (event.target.closest("#dynamicFields")) {
      clearError(event.target);
      updateLivePreview();
      updateStepButtons();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.closest("#dynamicFields")) {
      clearError(event.target);
      updateLivePreview();
      updateStepButtons();
    }
  });

  step1Next?.addEventListener("click", () => {
    if (validateStep1()) showStep(2);
  });
  $("btnStep2Back")?.addEventListener("click", () => showStep(1));
  step2Next?.addEventListener("click", () => {
    if (validateStep2()) showStep(3);
  });
  $("btnStep3Back")?.addEventListener("click", () => showStep(2));

  imageInput?.addEventListener("change", () => addImages(imageInput.files));
  videoInput?.addEventListener("change", () => renderVideoPreview(videoInput.files?.[0]));

  photoDropZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    photoDropZone.classList.add("drag-over");
  });
  photoDropZone?.addEventListener("dragleave", () => photoDropZone.classList.remove("drag-over"));
  photoDropZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    photoDropZone.classList.remove("drag-over");
    addImages(event.dataTransfer.files);
  });

  preview?.addEventListener("dragover", (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(preview, event.clientX);
    const dragging = preview.querySelector(".dragging");
    if (!dragging) return;
    if (!afterElement) preview.appendChild(dragging);
    else preview.insertBefore(dragging, afterElement);
  });

  document.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-status]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  document.querySelectorAll(".damage-panel .part").forEach((part) => {
    part.dataset.state = "original";
    part.addEventListener("click", () => {
      const current = part.dataset.state || "original";
      const next =
        current === "original" ? "painted" :
        current === "painted" ? "changed" :
        current === "changed" ? "lokal" :
        "original";
      part.dataset.state = next;
      part.classList.remove("painted", "changed", "lokal", "boyali", "degisen");
      if (next !== "original") part.classList.add(next);
      renderDamageStatusList();
    });
    part.addEventListener("mouseenter", (event) => showDamageTooltip(part, event));
    part.addEventListener("mousemove", positionDamageTooltip);
    part.addEventListener("mouseleave", hideDamageTooltip);
  });

  $("createForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      if (currentStep !== 3) showStep(3);
      return;
    }

    let imageUrls = [];
    if (stagedImageFiles.length) {
      imageUrls = await uploadImagesIfNeeded();
    }

    const payload = formPayload(imageUrls);
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch("/api/listings", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
      return;
    }

    if (!response.ok) {
      let message = "İlan kaydedilemedi.";
      try {
        const json = await response.json();
        message = json.error || json.msg || message;
      } catch (_) {}
      alert(message);
      return;
    }

    alert("İlan başarıyla kaydedildi.");
    window.location.href = "/index.html";
  });

  loadCarData().finally(() => {
    populateCities();
    renderFields();
    renderDamageStatusList();
    showStep(1);
    updateLivePreview();
    updateStepButtons();
  });
});
