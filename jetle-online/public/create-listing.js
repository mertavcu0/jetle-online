async function initCreateListingPage() {
  const user = localStorage.getItem("user");
  if (!user) {
    alert("İlan vermek için giriş yapmalısın");
    window.location.href = "login.html";
    return;
  }

  const PLACEHOLDER_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='140'%3E%3Crect fill='%23e5e7eb' width='400' height='140'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EFotoğraf yok%3C/text%3E%3C/svg%3E";

  const cityData = window.cities || {};

  function getChecked(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.checked : false;
  }

  function safeVal(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.value : "";
  }

  function getVal(name) {
    return safeVal(name);
  }

  function isVehicle() {
    return safeVal("category") === "vasita";
  }

  function isRealEstate() {
    return safeVal("category") === "emlak";
  }

  function toggleSections() {
    const vehicleFields = document.getElementById("vehicleFields");
    const ekspertiz = document.getElementById("ekspertizSection");

    if (!vehicleFields || !ekspertiz) return;

    if (isVehicle()) {
      vehicleFields.style.display = "block";
      ekspertiz.style.display = "block";
    } else {
      vehicleFields.style.display = "none";
      ekspertiz.style.display = "none";
    }
  }

  function toggleEkspertiz() {
    const kategori = document.querySelector('[name="category"]')?.value;
    const ekspertiz = document.getElementById("ekspertizSection");

    if (!ekspertiz) return;

    if (kategori === "vasita") {
      ekspertiz.style.display = "block";
    } else {
      ekspertiz.style.display = "none";
    }
  }

  function setVal(name, value) {
    const el = document.querySelector(`[name="${name}"]`) || document.getElementById(name);
    if (!el) return;
    el.value = value;
  }


  let carData = {};

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
    } catch (err) {
      console.error("CAR DATA ERROR:", err);
      carData = {};
    }
  }

  const $ = (id) => document.getElementById(id);
  const form = $("createForm");
  const categorySelect = $("category");
  const dynamicFields = $("dynamicFields");
  const imageInput = $("images");
  const preview = $("imagePreview");
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
  const submitButton = $("btnSubmitListing");
  const step1Message = $("step1Message");
  const step2Message = $("step2Message");
  const step1Next = $("btnStep1Next");
  const step2Next = $("btnStep2Next");
  const damageStatusList = $("damageStatusList");
  const damageTooltip = $("damageTooltip");
  const token = localStorage.getItem("token");
  const MAX_PHOTOS = 30;
  const fuelOptions = ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"];
  const transmissionOptions = ["Manuel", "Otomatik", "Yarı Otomatik"];
  const bodyTypes = ["Sedan", "Hatchback", "SUV", "Coupe", "Pickup", "Minivan", "Station Wagon"];
  const colors = ["Beyaz", "Siyah", "Gri", "Kırmızı", "Mavi"];

  let currentStep = 1;
  let stagedImageFiles = [];
  const expertizData = {};
  const ekspertizData = expertizData;
  const damageStates = ["original", "painted", "changed", "damaged"];
  const damageLabels = {
    original: "Normal",
    painted: "Boyalı",
    changed: "Değişen",
    damaged: "Hasarlı",
  };

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
    data.forEach(item => {
      const opt = document.createElement("option");
      opt.setAttribute("value", item);
      opt.textContent = item;
      select.appendChild(opt);
    });
    select.disabled = false;
  }

  function fillSelect(id, values, placeholder) {
    const select = field(id);
    if (!select) return;

    const uniqueValues = [...new Set((values || []).filter(Boolean))];
    select.innerHTML = selectOptions(uniqueValues, placeholder);
    select.disabled = !uniqueValues.length;
    if (uniqueValues.length === 1) setVal(id, uniqueValues[0]);
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

  function field(id) {
    return document.getElementById(id);
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
    document.querySelectorAll("select").forEach((select) => {
      select.disabled = false;
    });
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
    document.querySelectorAll("select").forEach((select) => {
      select.disabled = false;
    });
  }

  function renderVehicleFields() {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="brand">Marka</label>
          <select id="brand">${selectOptions(Object.keys(carData), "Marka seçin")}</select>
        </div>
        <div class="field-group">
          <label for="series">Seri</label>
          <select id="series" disabled><option value="">Önce marka seçin</option></select>
        </div>
        <div class="field-group">
          <label for="model">Model</label>
          <select id="model" disabled><option value="">Önce seri seçin</option></select>
        </div>
        <div class="field-group">
          <label for="year">Yıl</label>
          <input type="number" id="year" min="1980" max="2026" placeholder="Örn. 2020">
        </div>
        <div class="field-group">
          <label for="km">Kilometre</label>
          <input type="number" id="km" min="0" max="1000000" placeholder="Örn. 85000">
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
          <select id="color"></select>
        </div>
        <div class="field-group">
          <label for="engine">Motor hacmi</label>
          <select id="engine">
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

    const brandSelect = field("brand");
    if (brandSelect) brandSelect.addEventListener("change", () => {
      updateSeriesOptions();
      updateLivePreview();
      updateStepButtons();
    });

    const seriesSelect = field("series");
    if (seriesSelect) seriesSelect.addEventListener("change", () => {
      updateModelOptions();
      updateLivePreview();
      updateStepButtons();
    });

    const modelSelect = field("model");
    if (modelSelect) modelSelect.addEventListener("change", () => {
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
          <input type="text" id="rooms" placeholder="Örn. 3+1">
        </div>
        <div class="field-group">
          <label for="m2">m²</label>
          <input type="number" id="m2" placeholder="Örn. 120">
        </div>
        <div class="field-group">
          <label for="age">Bina yaşı</label>
          <input type="number" id="age" placeholder="Örn. 5">
        </div>
        <div class="field-group">
          <label for="floor">Kat</label>
          <input type="text" id="floor" placeholder="Örn. 4">
        </div>
      </div>
    `;
  }

  function renderElectronicsFields() {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="brand">Marka</label>
          <input type="text" id="brand" placeholder="Marka">
        </div>
        <div class="field-group">
          <label for="model">Model</label>
          <input type="text" id="model" placeholder="Model">
        </div>
      </div>
    `;
  }

  function renderFields() {
    if (currentStep !== 2) return;
    const category = safeVal("category");
    if (!document.querySelector('[name="category"]')) return;
    if (category === "Otomobil" && !document.querySelector("[name=brand]")) return;

    if (category === "Otomobil") renderVehicleFields();
    else if (category === "Emlak") renderRealEstateFields();
    else renderElectronicsFields();
  }

  function showStep(step) {
    currentStep = step;
    document.querySelectorAll(".step-panel").forEach((panel) => {
      const active = Number(panel.dataset.step) === step;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    document.querySelectorAll(".step-progress-item").forEach((item) => {
      const order = Number(item.dataset.stepIndicator);
      item.classList.toggle("active", order === step);
      item.classList.toggle("done", order < step);
    });
  }

  function markError(id) {
    const element = field(id);
    element?.closest(".field-group")?.classList.add("field-error");
  }

  function clearError(element) {
    element?.closest(".field-group")?.classList.remove("field-error");
  }

  function step1Ready() {
    if (currentStep !== 1) return true;
    return Boolean(safeVal("category") && (safeVal("title") || "").trim() && safeVal("city"));
  }

  function step2Ready() {
    if (currentStep !== 2) return true;
    if (!(safeVal("description") || "").trim()) return false;
    if (safeVal("category") !== "Otomobil") return true;
    return ["brand", "series", "model", "year", "km", "fuel", "transmission", "bodyType"].every((name) => {
      const value = safeVal(name);
      return value !== null && String(value).trim();
    });
  }

  function updateStepButtons() {
    const btn = document.getElementById("stepNext");
    if (!btn) return;

    const submitBtn = document.getElementById("submitBtn");
    if (!submitBtn) return;
    if (submitBtn) {
      submitBtn.disabled = false;
    }

    const ready1 = step1Ready();
    const ready2 = step2Ready();
    if (step1Next) step1Next.disabled = !ready1;
    if (step2Next) step2Next.disabled = !ready2;
    if (step1Message) step1Message.textContent = ready1 ? "" : "Kategori, başlık ve şehir dolmadan devam edemezsiniz.";
    if (step2Message) step2Message.textContent = ready2 ? "" : "Detay alanlarını doldurun.";

    if (currentStep !== 5) return;
    submitBtn.disabled = !(ready1 && ready2);
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
      if (!safeVal("fuel") || !safeVal("transmission") || !safeVal("bodyType")) {
        alert("Lütfen tüm araç bilgilerini seç");
        valid = false;
      }
    }
    if (!valid) alert("Lütfen detay alanlarını doldurun.");
    updateStepButtons();
    return valid;
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = value;
  }

  function updateLivePreview() {
    if (currentStep !== 5) return;
    const title = safeVal("title").trim();
    const city = safeVal("city");
    const districtValue = safeVal("district");
    const district = districtValue ? ` / ${districtValue}` : "";
    const vehicle = [safeVal("brand"), safeVal("series"), safeVal("model")].filter(Boolean).join(" ");
    const location = [city ? `${city}${district}` : "", vehicle].filter(Boolean).join(" • ");
    const priceValue = rawPrice();
    const price = priceValue ? `${Number(priceValue).toLocaleString("tr-TR")} TL` : "";

    setText("#livePreviewTitle", title || vehicle);
    setText("#livePreviewMeta", location);
    setText("#livePreviewPrice", price);
    setText("#previewTitle", title || vehicle);
    setText("#previewPrice", price);
    setText("#previewLocation", location);
  }

  function updateLivePreviewImage() {
    if (!stagedImageFiles.length) {
      livePreviewImg.src = PLACEHOLDER_IMG;
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      livePreviewImg.src = event.target.result;
    };
    reader.readAsDataURL(stagedImageFiles[0]);
  }

  function syncInputFiles() {
    const dt = new DataTransfer();
    stagedImageFiles.forEach((file) => dt.items.add(file));
    imageInput.files = dt.files;
  }

  function renderImagePreview() {
    preview.innerHTML = "";
    stagedImageFiles.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "preview-item";
      item.title = `${index + 1}. fotoğraf`;
      const img = document.createElement("img");
      img.style.width = "100px";
      img.style.margin = "5px";
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "remove-btn";
      btn.textContent = "X";
      btn.addEventListener("click", () => {
        stagedImageFiles.splice(index, 1);
        syncInputFiles();
        renderImagePreview();
        updateLivePreviewImage();
      });
      item.append(img, btn);
      preview.appendChild(item);
    });
  }

  function addImages(files) {
    const images = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    const freeSlots = MAX_PHOTOS - stagedImageFiles.length;
    if (freeSlots <= 0) {
      alert("En fazla 30 fotoğraf yükleyebilirsin.");
      syncInputFiles();
      return;
    }

    if (images.length > freeSlots) {
      alert("En fazla 30 fotoğraf yükleyebilirsin. Fazla fotoğraflar eklenmedi.");
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
        const label = part.dataset.label || part.dataset.part || "Parca";
        const state = part.dataset.state || "original";
        const status = damageLabels[state] || state;
        return `<span>${label}: ${status}</span>`;
      })
      .join("");

    damageStatusList.innerHTML = rows || "<span>Parca secimi bekleniyor</span>";
  }

  function positionDamageTooltip(event) {
    if (!damageTooltip) return;
    damageTooltip.style.left = `${event.clientX + 12}px`;
    damageTooltip.style.top = `${event.clientY + 12}px`;
  }

  function showDamageTooltip(part, event) {
    if (!damageTooltip) return;
    damageTooltip.textContent = part.dataset.label || part.dataset.part || "Parca";
    damageTooltip.style.display = "block";
    positionDamageTooltip(event);
  }

  function hideDamageTooltip() {
    if (!damageTooltip) return;
    damageTooltip.style.display = "none";
  }

  async function uploadImagesIfNeeded() {
    if (!stagedImageFiles.length) return [];
    const formData = new FormData();
    stagedImageFiles.forEach((file) => formData.append("images", file));
    const res = await fetch("/api/listings/upload", {
      method: "POST",
      headers: token ? { Authorization: "Bearer " + token } : {},
      body: formData,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.urls) ? data.urls : [];
  }

  function formPayload(imageUrls = []) {
    const selectedDamage = Object.entries(collectDamageMap())
      .filter(([, value]) => value && value !== "original")
      .map(([part, value]) => `${part}:${value}`);
    const selectedFeatures = collectFeatures();

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
      features: selectedFeatures,
      damage: selectedDamage,
      damageMap: collectDamageMap(),
    };

    ["brand", "series", "model", "year", "km", "fuel", "gear", "transmission", "bodyType", "color", "engine", "engineSize", "enginePower", "power", "sellerType", "rooms", "m2", "age", "floor"].forEach((id) => {
      const element = field(id);
      const value = safeVal(id);
      if (element && value !== "") payload[id] = element.type === "number" ? Number(value) : value;
    });

    if (!payload.transmission && payload.gear) payload.transmission = payload.gear;
    if (!payload.engineSize && payload.engine) payload.engineSize = payload.engine;
    if (!payload.enginePower && payload.power) payload.enginePower = payload.power;

    return payload;
  }

  await loadCarData();
  populateCities();
  renderFields();
  showStep(1);
  updateLivePreview();
  updateStepButtons();

  if (categorySelect) categorySelect.addEventListener("change", () => {
    renderFields();
    updateLivePreview();
    updateStepButtons();
  });

  document.querySelector('[name="category"]')?.addEventListener("change", toggleSections);
  document.querySelector('[name="category"]')?.addEventListener("change", toggleEkspertiz);
  toggleEkspertiz();

  if (cityInput) cityInput.addEventListener("change", () => {
    populateDistricts();
    updateLivePreview();
    updateStepButtons();
  });

  [titleInput, descriptionInput, priceInput, districtInput].forEach((element) => {
    element?.addEventListener("input", () => {
      clearError(element);
      if (element === priceInput) setVal("price", digitsOnly(safeVal("price")));
      updateLivePreview();
      updateStepButtons();
    });
    element?.addEventListener("change", () => {
      updateLivePreview();
      updateStepButtons();
    });
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

  const btnStep1Next = $("btnStep1Next");
  if (btnStep1Next) btnStep1Next.addEventListener("click", () => {
    if (validateStep1()) showStep(2);
  });
  const btnStep2Back = $("btnStep2Back");
  if (btnStep2Back) btnStep2Back.addEventListener("click", () => showStep(1));
  const btnStep2Next = $("btnStep2Next");
  if (btnStep2Next) btnStep2Next.addEventListener("click", () => {
    if (validateStep2()) showStep(3);
  });
  const btnStep3Back = $("btnStep3Back");
  if (btnStep3Back) btnStep3Back.addEventListener("click", () => showStep(2));

  if (imageInput) imageInput.addEventListener("change", () => addImages(imageInput.files));
  if (videoInput) videoInput.addEventListener("change", () => renderVideoPreview(videoInput.files?.[0]));
  if (photoDropZone) photoDropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    photoDropZone.classList.add("drag-over");
  });
  if (photoDropZone) photoDropZone.addEventListener("dragleave", () => photoDropZone.classList.remove("drag-over"));
  if (photoDropZone) photoDropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    photoDropZone.classList.remove("drag-over");
    addImages(event.dataTransfer.files);
  });

  document.querySelectorAll(".damage-panel .part").forEach((part) => {
    part.dataset.state = "original";
    part.addEventListener("click", () => {
      const current = part.dataset.state || "original";
      const next = damageStates[(damageStates.indexOf(current) + 1) % damageStates.length];
      part.dataset.state = next;
      part.classList.remove("painted", "changed", "damaged");
      if (next !== "original") part.classList.add(next);
      renderDamageStatusList();
    });
    part.addEventListener("mouseenter", (event) => showDamageTooltip(part, event));
    part.addEventListener("mousemove", positionDamageTooltip);
    part.addEventListener("mouseleave", hideDamageTooltip);
  });
  renderDamageStatusList();

  document.querySelectorAll(".part").forEach((el) => {
    el.addEventListener("click", () => {
      const part = el.dataset.part;
      const current = el.dataset.status || "none";

      const next =
        current === "none" ? "orijinal" :
        current === "orijinal" ? "boyalı" :
        current === "boyalı" ? "degisen" :
        "none";

      el.dataset.status = next;
      ekspertizData[part] = next;
    });
  });

  {
    const form = document.getElementById("listingForm");

    if (form) form.addEventListener("submit", async (e) => {
      e.preventDefault();

      console.log("SUBMIT BAŞLADI");

      const formData = new FormData(form);
      console.log("EKSPERTIZ TEST:", {
        kaput: getVal("kaput"),
        tavan: getVal("tavan"),
        bagaj: getVal("bagaj")
      });
      formData.append("kaput", getVal("kaput"));
      formData.append("tavan", getVal("tavan"));
      formData.append("bagaj", getVal("bagaj"));
      formData.append("sag_on_camurluk", getVal("sag_on_camurluk"));
      formData.append("sol_on_camurluk", getVal("sol_on_camurluk"));
      formData.append("sag_on_kapi", getVal("sag_on_kapi"));
      formData.append("sol_on_kapi", getVal("sol_on_kapi"));
      formData.append("sag_arka_kapi", getVal("sag_arka_kapi"));
      formData.append("sol_arka_kapi", getVal("sol_arka_kapi"));
      Object.keys(expertizData).forEach((key) => {
        formData.append(key, expertizData[key]);
      });
      Object.keys(ekspertizData).forEach((key) => {
        formData.append(key, ekspertizData[key]);
      });

      try {
        const res = await fetch("/api/listings", {
          method: "POST",
          body: formData
        });

        const text = await res.text();
        console.log("RAW RESPONSE:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          alert("Server JSON dönmüyor");
          return;
        }

        if (!res.ok) {
          alert(data.message || "Hata var");
          return;
        }

        console.log("BAŞARILI:", data);

        alert("İlan başarıyla oluşturuldu");

        window.location.href = "/";

      } catch (err) {
        console.error("FETCH ERROR:", err);
        alert("Sunucuya bağlanamadı");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initCreateListingPage();
});
