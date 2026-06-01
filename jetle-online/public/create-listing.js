async function initCreateListingPage() {
  const isLocalDev = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const user = localStorage.getItem("user");
  if (!user && !isLocalDev) {
    alert("İlan vermek için giriş yapmalısın");
    window.location.href = "login.html";
    return;
  }

  const PLACEHOLDER_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='140'%3E%3Crect fill='%23eef2f7' width='400' height='140'/%3E%3Ctext x='50%25' y='47%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='14'%3EFoto%C4%9Fraf%20y%C3%BCklenmedi%3C/text%3E%3C/svg%3E";

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

  function normalizeCategoryToken(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function inferMainCategory(...values) {
    for (const value of values) {
      const normalized = normalizeCategoryToken(value);
      if (!normalized) continue;

      if (["vasita", "otomobil", "arac", "araba", "suv", "motosiklet", "pickup", "kamyonet"].includes(normalized)) {
        return "vasita";
      }

      if (["emlak", "arsa", "daire", "villa", "isyeri", "mustakil-ev", "rezidans"].includes(normalized)) {
        return "emlak";
      }

      if (["yedek-parca", "yedek-parca-ve-aksesuar", "aksesuar", "lastik-jant", "oto-aksesuar"].includes(normalized)) {
        return "yedek-parca";
      }

      if (["is-makineleri", "is-makinalari", "is-makinasi", "is-makinesi"].includes(normalized)) {
        return "is-makineleri";
      }
    }

    return "";
  }

  function syncVisibilityRequirements(scope = dynamicFields) {
    if (!scope) return;
    scope.querySelectorAll("input, select, textarea").forEach((control) => {
      if (!control.dataset.requiredOriginal) {
        control.dataset.requiredOriginal = control.required ? "true" : "false";
      }
      const group = control.closest(".field-group");
      const groupHidden = group ? window.getComputedStyle(group).display === "none" : false;
      const controlHidden = control.hidden || control.offsetParent === null;
      const inactive = control.disabled || groupHidden || controlHidden;
      control.required = !inactive && control.dataset.requiredOriginal === "true";
    });
  }

  function isVehicle() {
    return safeVal("category") === "vasita";
  }

  function isRealEstate() {
    return safeVal("category") === "emlak";
  }

  function toggleSections() {
    const vehicleSection = document.getElementById("vehicleFields");
    const ekspertiz = document.getElementById("ekspertizSection");

    if (!vehicleSection || !ekspertiz) return;

    if (isVehicle()) {
      vehicleSection.style.display = "block";
      ekspertiz.style.display = "block";
    } else {
      vehicleSection.style.display = "none";
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

  function normalizedMediaList(listing) {
    const candidates = [
      ...(Array.isArray(listing?.gallery) ? listing.gallery : []),
      ...(Array.isArray(listing?.images) ? listing.images : []),
      ...(Array.isArray(listing?.photos) ? listing.photos : []),
      listing?.mainImage,
      listing?.coverImage,
      listing?.image
    ];

    return [...new Set(
      candidates
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean)
    )];
  }

  function inferEditFormCategory(listing) {
    const tokens = [
      listing?.mainCategory,
      listing?.category,
      listing?.subCategory
    ].map((value) => normalizeCategoryToken(value)).filter(Boolean);

    if (tokens.some((token) => ["vasita", "otomobil", "arac", "araba", "suv", "pickup", "ticari"].includes(token))) {
      return "Otomobil";
    }

    if (tokens.some((token) => ["emlak", "daire", "villa", "arsa", "isyeri", "satilik-daire", "kiralik-daire"].includes(token))) {
      return "Emlak";
    }

    return "Elektronik";
  }

  function showListingFormFlow() {
    const selectionScreen = document.getElementById("categorySelectionScreen");
    const formFlow = document.getElementById("listingFormFlow");
    const layout = document.querySelector(".create-v3-layout");
    const previewColumn = document.querySelector(".create-v3-preview-column");

    if (selectionScreen) selectionScreen.hidden = true;
    if (formFlow) formFlow.hidden = false;
    layout?.classList.remove("category-flow-pending");
    previewColumn?.classList.remove("is-compact");
  }


  let carData = {};
  const VEHICLE_SELECT_PLACEHOLDERS = {
    brand: "Marka seçin",
    series: "Önce marka seçin",
    model: "Önce seri seçin",
  };

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
  const preview = $("preview");
  const videoInput = $("video");
  const videoPreview = $("videoPreview");
  const photoDropZone = $("photoDropZone");
  const photoCountText = $("photoCountText");
  const priceInput = $("price");
  const titleInput = $("title");
  const cityInput = $("city");
  const districtInput = $("district");
  const descriptionInput = $("description");
  const livePreviewImg = $("livePreviewImg");
  const livePreviewTitle = $("livePreviewTitle");
  const livePreviewMeta = $("livePreviewMeta");
  const livePreviewPrice = $("livePreviewPrice");
  const submitButton = $("submitBtn");
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
  const vehicleConditionOptions = ["Sıfır", "İkinci El"];
  const sellerTypeOptions = ["Sahibinden", "Galeriden", "Yetkili Bayiden"];
  const drivetrainOptions = ["Önden Çekiş", "Arkadan İtiş", "4x4", "AWD"];
  const emissionOptions = ["Euro 3", "Euro 4", "Euro 5", "Euro 6"];
  const warrantyOptions = ["Var", "Yok", "Devam Ediyor"];
  const yesNoOptions = ["Evet", "Hayır"];
  const hybridTypeOptions = ["HEV", "PHEV", "MHEV"];
  const damageRecordOptions = ["Yok", "Var", "Ağır Hasarlı"];
  const pageParams = new URLSearchParams(window.location.search);
  const editListingId = String(pageParams.get("edit") || "").trim();
  const isEditMode = Boolean(editListingId);

  let currentStep = 0;
  let isRendering = false;
  let lastRenderedCategory = "";
  let stagedImageFiles = [];
  let existingImageUrls = [];
  let editingListing = null;
  const expertizData = {};
  const ekspertizData = expertizData;
  const damageStates = ["original", "painted", "local", "changed"];
  const damageLabels = {
    original: "Normal",
    painted: "Boyalı",
    local: "Lokal Boyalı",
    changed: "Değişen",
  };
  const damageModeMap = {
    orijinal: "original",
    boyali: "painted",
    lokal: "local",
    degisen: "changed",
  };
  let currentDamageMode = "original";

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

  function toVehicleOptionRecords(values) {
    return [...new Set((values || []).filter(Boolean))].map((value) => ({
      value,
      text: value,
    }));
  }

  function setSelectOptionsFragment(select, placeholder, selectedOption = null) {
    if (!select) return;
    const fragment = document.createDocumentFragment();
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    fragment.appendChild(placeholderOption);

    if (selectedOption?.value) {
      const option = document.createElement("option");
      option.value = selectedOption.value;
      option.textContent = selectedOption.text || selectedOption.value;
      fragment.appendChild(option);
    }

    select.replaceChildren(fragment);
    select.value = selectedOption?.value || "";
  }

  function syncVehicleSelectSource(id, values, placeholder, { disabled = false, preserveValue = true } = {}) {
    const select = field(id);
    if (!select) return;

    const options = toVehicleOptionRecords(values);
    const currentValue = preserveValue ? String(select.value || "").trim() : "";
    const selectedOption = options.find((option) => option.value === currentValue) || null;

    select.__vehicleOptionSourceData = options;
    select.__vehicleFilteredOptions = selectedOption ? [selectedOption] : [];
    select.dataset.placeholderText = placeholder;
    select.disabled = disabled;
    setSelectOptionsFragment(select, placeholder, disabled ? null : selectedOption);
    select.dispatchEvent(new CustomEvent("vehicle-source-change", { bubbles: true }));
  }

  function primeVehicleSelectForEdit(id, sourceValues, selectedValue, placeholder) {
    const select = field(id);
    const normalizedSelectedValue = String(selectedValue || "").trim();
    if (!select) return;

    const options = toVehicleOptionRecords(sourceValues);
    const selectedOption = normalizedSelectedValue
      ? (options.find((option) => option.value === normalizedSelectedValue) || { value: normalizedSelectedValue, text: normalizedSelectedValue })
      : null;

    select.__vehicleOptionSourceData = options;
    select.__vehicleFilteredOptions = selectedOption ? [selectedOption] : [];
    select.dataset.placeholderText = placeholder;
    select.disabled = false;
    setSelectOptionsFragment(select, placeholder, selectedOption);
    select.value = selectedOption?.value || "";
    select.dispatchEvent(new CustomEvent("vehicle-source-change", { bubbles: true }));
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
    syncVehicleSelectSource("series", series, brand ? "Seri seçin" : VEHICLE_SELECT_PLACEHOLDERS.series, {
      disabled: !series.length,
      preserveValue: false,
    });
    syncVehicleSelectSource("model", [], VEHICLE_SELECT_PLACEHOLDERS.model, {
      disabled: true,
      preserveValue: false,
    });
  }

  function updateModelOptions() {
    const brand = safeVal("brand");
    const series = safeVal("series");
    const modelSelect = field("model");
    if (!modelSelect) return;

    const models = brand && series ? carData[brand]?.[series] || [] : [];
    syncVehicleSelectSource("model", models.map((item) => item.name), series ? "Model seçin" : VEHICLE_SELECT_PLACEHOLDERS.model, {
      disabled: !models.length,
      preserveValue: false,
    });
  }

  function toggleVehicleDetailFields() {
    const detailFields = ["km", "fuel", "transmission", "bodyType", "color", "engine"];

    detailFields.forEach((id) => {
      const input = field(id);
      const group = input?.closest(".field-group");
      if (!input || !group) return;
      group.style.display = "block";
      group.style.visibility = "visible";
      group.style.opacity = "1";
      input.disabled = false;
    });

    const allGroups = Array.from(dynamicFields?.querySelectorAll(".field-group") || []);
    const visibleCount = allGroups.filter((group) => window.getComputedStyle(group).display !== "none").length;
    const hiddenCount = allGroups.length - visibleCount;
    const disabledCount = detailFields
      .map((id) => field(id))
      .filter((input) => input?.disabled).length;

    console.log("visible field count", visibleCount);
    console.log("hidden field count", hiddenCount);
    console.log("disabled field count", disabledCount);
    syncVehicleFuelFields();
  }

  function syncVehicleFuelFields() {
    const fuelValue = safeVal("fuel");
    const isElectric = fuelValue === "Elektrik";
    const isHybrid = fuelValue === "Hibrit";

    dynamicFields?.querySelectorAll(".vehicle-fuel-group").forEach((group) => {
      const show =
        (group.classList.contains("vehicle-fuel-electric") && isElectric) ||
        (group.classList.contains("vehicle-fuel-hybrid") && isHybrid);
      group.style.display = show ? "flex" : "none";
      group.querySelectorAll("input, select").forEach((input) => {
        input.disabled = !show;
        if (!show) input.value = "";
      });
    });

    dynamicFields?.querySelectorAll(".vehicle-engine-group, .vehicle-combustion-group").forEach((group) => {
      const show = !isElectric;
      group.style.display = show ? "flex" : "none";
      group.querySelectorAll("input, select").forEach((input) => {
        input.disabled = !show;
        if (!show) input.value = "";
      });
    });

    dynamicFields?.querySelectorAll(".vehicle-motor-type-group").forEach((group) => {
      const show = isElectric;
      group.style.display = show ? "flex" : "none";
      group.querySelectorAll("input, select").forEach((input) => {
        input.disabled = !show;
        if (show) input.value = "Elektrikli";
      });
    });

    syncVisibilityRequirements();
  }

  function renderVehicleFields() {
    console.log("RENDER VEHICLE FIELDS START");
    const category = safeVal("category");
    console.log("CATEGORY", category);
    console.log("renderVehicleFields.dynamicFields.before", dynamicFields);
    console.log("renderVehicleFields.duplicateDynamicFieldsCount", document.querySelectorAll("#dynamicFields").length);
    console.log("vehicleFields", dynamicFields?.querySelectorAll("input, select") || []);

    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="brand">Marka *</label>
          <select id="brand" name="brand"><option value="">Marka seçin</option></select>
        </div>
        <div class="field-group">
          <label for="series">Seri *</label>
          <select id="series" name="series" disabled><option value="">Önce marka seçin</option></select>
        </div>
        <div class="field-group">
          <label for="model">Model *</label>
          <select id="model" name="model" disabled><option value="">Önce seri seçin</option></select>
        </div>
        <div class="field-group">
          <label for="year">Yıl *</label>
          <input type="number" id="year" name="year" min="1980" max="2026" placeholder="Örn. 2022">
        </div>
        <div class="field-group">
          <label for="vehicleCondition">Araç Durumu</label>
          <select id="vehicleCondition" name="vehicleCondition"></select>
        </div>
        <div class="field-group">
          <label for="sellerType">Kimden</label>
          <select id="sellerType" name="sellerType"></select>
        </div>
        <div class="field-group" style="display:block; visibility:visible; opacity:1;">
          <label for="km">Kilometre *</label>
          <input type="number" id="km" name="km" min="0" max="1000000" placeholder="Örn. 84500">
        </div>
        <div class="field-group" style="display:block; visibility:visible; opacity:1;">
          <label for="fuel">Yakıt *</label>
          <select id="fuel" name="fuel"></select>
        </div>
        <div class="field-group" style="display:block; visibility:visible; opacity:1;">
          <label for="transmission">Vites *</label>
          <select id="transmission" name="transmission"></select>
        </div>
        <div class="field-group" style="display:block; visibility:visible; opacity:1;">
          <label for="bodyType">Kasa tipi *</label>
          <select id="bodyType" name="bodyType"></select>
        </div>
        <div class="field-group">
          <label for="drivetrain">Çekiş</label>
          <select id="drivetrain" name="drivetrain"></select>
        </div>
        <div class="field-group" style="display:block; visibility:visible; opacity:1;">
          <label for="color">Renk</label>
          <select id="color" name="color"></select>
        </div>
        <div class="field-group vehicle-engine-group" style="display:block; visibility:visible; opacity:1;">
          <label for="engine">Motor hacmi</label>
          <select id="engine" name="engine">
            <option value="">Motor hacmi seçin</option>
            <option>0 - 1000 cc</option>
            <option>1001 - 1200 cc</option>
            <option>1201 - 1400 cc</option>
            <option>1401 - 1600 cc</option>
            <option>1601 - 1800 cc</option>
            <option>1801 - 2000 cc</option>
            <option>2001 - 2500 cc</option>
            <option>2501 - 3000 cc</option>
            <option>3000 cc ve üzeri</option>
          </select>
        </div>
        <div class="field-group vehicle-motor-type-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="electricMotorType">Motor Tipi</label>
          <input type="text" id="electricMotorType" value="Elektrikli" disabled>
        </div>
        <div class="field-group">
          <label for="enginePower">Motor Gücü (HP)</label>
          <input type="number" id="enginePower" name="enginePower" min="0" placeholder="Örn. 150">
        </div>
        <div class="field-group">
          <label for="torque">Tork (Nm)</label>
          <input type="number" id="torque" name="torque" min="0" placeholder="Örn. 320">
        </div>
        <div class="field-group vehicle-combustion-group">
          <label for="fuelConsumption">Yakıt Tüketimi</label>
          <input type="text" id="fuelConsumption" name="fuelConsumption" placeholder="Örn. 6.4 lt/100 km">
        </div>
        <div class="field-group vehicle-combustion-group">
          <label for="cityFuelConsumption">Şehir İçi Tüketim</label>
          <input type="text" id="cityFuelConsumption" name="cityFuelConsumption" placeholder="Örn. 7.8 lt/100 km">
        </div>
        <div class="field-group vehicle-combustion-group">
          <label for="highwayFuelConsumption">Şehir Dışı Tüketim</label>
          <input type="text" id="highwayFuelConsumption" name="highwayFuelConsumption" placeholder="Örn. 5.4 lt/100 km">
        </div>
        <div class="field-group vehicle-combustion-group">
          <label for="combinedFuelConsumption">Karma Tüketim</label>
          <input type="text" id="combinedFuelConsumption" name="combinedFuelConsumption" placeholder="Örn. 6.1 lt/100 km">
        </div>
        <div class="field-group vehicle-combustion-group">
          <label for="emissionStandard">Emisyon Standardı</label>
          <select id="emissionStandard" name="emissionStandard"></select>
        </div>
        <div class="field-group">
          <label for="plate">Araç Plakası</label>
          <input type="text" id="plate" name="plate" placeholder="Örn. 34 ABC 123">
        </div>
        <div class="field-group">
          <label for="hasarKaydi">Hasar Kaydı</label>
          <select id="hasarKaydi" name="hasarKaydi"></select>
        </div>
        <div class="field-group">
          <label for="warrantyStatus">Garanti Durumu</label>
          <select id="warrantyStatus" name="warrantyStatus"></select>
        </div>
        <div class="field-group">
          <label for="isSwapEligibleVehicle">Takas Durumu</label>
          <select id="isSwapEligibleVehicle" name="isSwapEligibleVehicle"></select>
        </div>
        <div class="field-group">
          <label for="isCreditEligibleVehicle">Krediye Uygun</label>
          <select id="isCreditEligibleVehicle" name="isCreditEligibleVehicle"></select>
        </div>
        <div class="field-group checkbox-field-group">
          <label class="inline-check" for="firstOwner">
            <input type="checkbox" id="firstOwner" name="firstOwner">
            <span>İlk Sahibinden</span>
          </label>
        </div>
        <div class="field-group checkbox-field-group">
          <label class="inline-check" for="serviceMaintained">
            <input type="checkbox" id="serviceMaintained" name="serviceMaintained">
            <span>Yetkili Servis Bakımlı</span>
          </label>
        </div>
        <div class="field-group full-width">
          <span class="field-hint">* işaretli alanlar ilan özetinde öne çıkar. Yakıt tipine göre elektrikli ve hibrit detayları aşağıda açılır.</span>
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="batteryCapacity">Batarya Kapasitesi</label>
          <input type="text" id="batteryCapacity" name="batteryCapacity" placeholder="Örn. 82 kWh">
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="rangeKm">Menzil</label>
          <input type="text" id="rangeKm" name="rangeKm" placeholder="Örn. 520 km">
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="acChargeTime">AC Şarj Süresi</label>
          <input type="text" id="acChargeTime" name="acChargeTime" placeholder="Örn. 7 saat">
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="dcFastChargeSupport">DC Hızlı Şarj</label>
          <select id="dcFastChargeSupport" name="dcFastChargeSupport"></select>
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="ccs2Support">CCS2</label>
          <select id="ccs2Support" name="ccs2Support"></select>
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="type2Support">Type2</label>
          <select id="type2Support" name="type2Support"></select>
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="batteryHealthVehicle">Batarya Sağlığı</label>
          <input type="text" id="batteryHealthVehicle" name="batteryHealthVehicle" placeholder="Örn. %94">
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="otaSupportVehicle">OTA Güncelleme</label>
          <select id="otaSupportVehicle" name="otaSupportVehicle"></select>
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="autonomousDrivingLevel">Otonom Sürüş</label>
          <select id="autonomousDrivingLevel" name="autonomousDrivingLevel"></select>
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-electric" style="display:none;">
          <label for="fsdSupportVehicle">FSD</label>
          <select id="fsdSupportVehicle" name="fsdSupportVehicle"></select>
        </div>
        <div class="field-group vehicle-fuel-group vehicle-fuel-hybrid" style="display:none;">
          <label for="hybridType">Hibrit Tipi</label>
          <select id="hybridType" name="hybridType"></select>
        </div>
      </div>
    `;

    dynamicFields.style.display = "grid";
    dynamicFields.style.visibility = "visible";
    dynamicFields.style.opacity = "1";

    const vehicleFields = dynamicFields.querySelectorAll("input, select");
    vehicleFields.forEach((fieldEl) => {
      const group = fieldEl.closest(".field-group");
      if (!group) return;
      group.style.display = "block";
      group.style.visibility = "visible";
      group.style.opacity = "1";
    });
    console.log("renderVehicleFields.dynamicFields.innerHTML.length", dynamicFields.innerHTML.length);
    console.log("renderVehicleFields.vehicleFields.length", vehicleFields.length);
    console.log("renderVehicleFields.display", dynamicFields.style.display);
    console.log("renderVehicleFields.hidden", dynamicFields.hidden);
    console.log("renderVehicleFields.offsetHeight", dynamicFields.offsetHeight);

    populateSelect("fuel", fuelOptions);
    populateSelect("transmission", transmissionOptions);
    populateSelect("bodyType", bodyTypes);
    populateSelect("color", colors);
    populateSelect("vehicleCondition", vehicleConditionOptions);
    populateSelect("sellerType", sellerTypeOptions);
    populateSelect("drivetrain", drivetrainOptions);
    populateSelect("emissionStandard", emissionOptions);
    populateSelect("warrantyStatus", warrantyOptions);
    populateSelect("hasarKaydi", damageRecordOptions);
    populateSelect("isSwapEligibleVehicle", yesNoOptions);
    populateSelect("isCreditEligibleVehicle", yesNoOptions);
    populateSelect("dcFastChargeSupport", yesNoOptions);
    populateSelect("ccs2Support", yesNoOptions);
    populateSelect("type2Support", yesNoOptions);
    populateSelect("otaSupportVehicle", yesNoOptions);
    populateSelect("autonomousDrivingLevel", yesNoOptions);
    populateSelect("fsdSupportVehicle", yesNoOptions);
    populateSelect("hybridType", hybridTypeOptions);
    syncVehicleSelectSource("brand", Object.keys(carData), VEHICLE_SELECT_PLACEHOLDERS.brand, { disabled: false });
    syncVehicleSelectSource("series", [], VEHICLE_SELECT_PLACEHOLDERS.series, { disabled: true, preserveValue: false });
    syncVehicleSelectSource("model", [], VEHICLE_SELECT_PLACEHOLDERS.model, { disabled: true, preserveValue: false });

    const brandSelect = field("brand");
    if (brandSelect) brandSelect.addEventListener("change", () => {
      updateSeriesOptions();
      toggleVehicleDetailFields();
      updateLivePreview();
      updateStepButtons();
    });

    const seriesSelect = field("series");
    if (seriesSelect) seriesSelect.addEventListener("change", () => {
      updateModelOptions();
      toggleVehicleDetailFields();
      updateLivePreview();
      updateStepButtons();
    });

    const modelSelect = field("model");
    if (modelSelect) modelSelect.addEventListener("change", () => {
      applyVehicleSpecs();
      toggleVehicleDetailFields();
      updateLivePreview();
      updateStepButtons();
    });

    const fuelSelect = field("fuel");
    if (fuelSelect) fuelSelect.addEventListener("change", () => {
      syncVehicleFuelFields();
      updateLivePreview();
      updateStepButtons();
    });

    ["model", "year", "km", "fuel", "transmission", "bodyType", "engine", "drivetrain", "enginePower", "vehicleCondition", "sellerType", "batteryCapacity", "rangeKm", "hybridType", "firstOwner", "serviceMaintained"].forEach((id) => {
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
    toggleVehicleDetailFields();
    syncVehicleFuelFields();

    console.log("renderVehicleFields.dynamicFields.after", dynamicFields);
    console.log("dynamic html", dynamicFields.innerHTML);
    console.log("dynamicFields.outerHTML.immediate", dynamicFields.outerHTML);
    requestAnimationFrame(() => {
      console.log("renderVehicleFields.rect", dynamicFields.getBoundingClientRect());
      console.log("renderVehicleFields.offsetHeight.raf", dynamicFields.offsetHeight);
      console.log("renderVehicleFields.computedDisplay.raf", window.getComputedStyle(dynamicFields).display);
      console.log("renderVehicleFields.computedVisibility.raf", window.getComputedStyle(dynamicFields).visibility);
      console.log("renderVehicleFields.computedOpacity.raf", window.getComputedStyle(dynamicFields).opacity);
      console.log("dynamicFields.outerHTML.raf", dynamicFields.outerHTML);
    });
  }

  function renderRealEstateFields() {
    const realEstateHeatingOptions = {
      konut: [
        "Kombi (Doğalgaz)",
        "Merkezi Sistem",
        "Merkezi (Pay Ölçer)",
        "Klima",
        "Soba",
        "Yerden Isıtma",
        "VRV",
        "Fan Coil",
        "Jeotermal",
        "Güneş Enerjisi",
        "Yok",
      ],
      isyeri: ["Kombi", "Merkezi", "Klima", "Yok"],
    };

    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="estateType">Emlak Tipi</label>
          <select id="estateType" name="estateType">
            <option value="">Emlak tipi seçin</option>
            <option value="konut">Konut</option>
            <option value="arsa">Arsa</option>
            <option value="isyeri">İşyeri</option>
          </select>
        </div>
        <div class="field-group">
          <label for="m2">m²</label>
          <input type="number" id="m2" name="m2" placeholder="Örn. 120">
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="rooms">Oda Sayısı</label>
          <input type="text" id="rooms" name="rooms" placeholder="Örn. 3+1">
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="age">Bina Yaşı</label>
          <input type="number" id="age" name="age" placeholder="Örn. 5">
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="floor">Bulunduğu Kat</label>
          <input type="text" id="floor" name="floor" placeholder="Örn. 4">
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="totalFloors">Kat Sayısı</label>
          <input type="number" id="totalFloors" name="totalFloors" placeholder="Örn. 12">
        </div>

        <div class="field-group estate-type-group estate-type-konut estate-type-isyeri" style="display:none;">
          <label for="heatingType">Isıtma Tipi</label>
          <select id="heatingType" name="heatingType">
            <option value="">Seçin</option>
            <option value="Kombi (Doğalgaz)">Kombi (Doğalgaz)</option>
            <option value="Merkezi Sistem">Merkezi Sistem</option>
            <option value="Merkezi (Pay Ölçer)">Merkezi (Pay Ölçer)</option>
            <option value="Yerden Isıtma">Yerden Isıtma</option>
            <option value="Klima">Klima</option>
            <option value="VRV">VRV</option>
            <option value="Fan Coil">Fan Coil</option>
            <option value="Jeotermal">Jeotermal</option>
            <option value="Güneş Enerjisi">Güneş Enerjisi</option>
            <option value="Soba">Soba</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="residenceUsageStatus">Kullanım Durumu</label>
          <select id="residenceUsageStatus" name="residenceUsageStatus">
            <option value="">Seçin</option>
            <option value="Boş">Boş</option>
            <option value="Kiracılı">Kiracılı</option>
            <option value="Mülk Sahibi Oturuyor">Mülk Sahibi Oturuyor</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="residenceTitleDeedStatus">Tapu Durumu</label>
          <select id="residenceTitleDeedStatus" name="residenceTitleDeedStatus">
            <option value="">Seçin</option>
            <option value="Kat Mülkiyetli">Kat Mülkiyetli</option>
            <option value="Kat İrtifaklı">Kat İrtifaklı</option>
            <option value="Hisseli Tapu">Hisseli Tapu</option>
            <option value="Arsa Tapulu">Arsa Tapulu</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="isFurnished">Eşyalı mı</label>
          <select id="isFurnished" name="isFurnished">
            <option value="">Seçin</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="isInSite">Site İçinde mi</label>
          <select id="isInSite" name="isInSite">
            <option value="">Seçin</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-konut estate-type-isyeri" style="display:none;">
          <label for="dues">Aidat</label>
          <input type="number" id="dues" name="dues" placeholder="Örn. 1500">
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="balconyCount">Balkon Sayısı</label>
          <input type="number" id="balconyCount" name="balconyCount" placeholder="Örn. 2">
        </div>

        <div class="field-group estate-type-group estate-type-konut estate-type-isyeri" style="display:none;">
          <label for="wcCount">WC Sayısı</label>
          <input type="number" id="wcCount" name="wcCount" placeholder="Örn. 2">
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="bathrooms">Banyo Sayısı</label>
          <input type="number" id="bathrooms" name="bathrooms" placeholder="Örn. 2">
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="facade">Cephe</label>
          <select id="facade" name="facade">
            <option value="">Seçin</option>
            <option value="Kuzey">Kuzey</option>
            <option value="Güney">Güney</option>
            <option value="Doğu">Doğu</option>
            <option value="Batı">Batı</option>
            <option value="Kuzeydoğu">Kuzeydoğu</option>
            <option value="Kuzeybatı">Kuzeybatı</option>
            <option value="Güneydoğu">Güneydoğu</option>
            <option value="Güneybatı">Güneybatı</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-konut">
          <label for="isMortgageEligible">Krediye Uygun</label>
          <select id="isMortgageEligible" name="isMortgageEligible">
            <option value="">Seçin</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-konut estate-type-arsa estate-type-isyeri" style="display:none;">
          <label for="isSwapEligible">Takasa Uygun</label>
          <select id="isSwapEligible" name="isSwapEligible">
            <option value="">Seçin</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="zoningStatus">İmar Durumu</label>
          <select id="zoningStatus" name="zoningStatus">
            <option value="">Seçin</option>
            <option value="Konut İmarlı">Konut İmarlı</option>
            <option value="Ticari İmarlı">Ticari İmarlı</option>
            <option value="Villa İmarlı">Villa İmarlı</option>
            <option value="Sanayi İmarlı">Sanayi İmarlı</option>
            <option value="Tarla">Tarla</option>
            <option value="Bağ & Bahçe">Bağ & Bahçe</option>
            <option value="Zeytinlik">Zeytinlik</option>
            <option value="Tarım">Tarım</option>
            <option value="Depolama">Depolama</option>
            <option value="Turizm">Turizm</option>
            <option value="Özel Kullanım">Özel Kullanım</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="arsaStatus">Arsa Durumu</label>
          <select id="arsaStatus" name="arsaStatus">
            <option value="">Seçin</option>
            <option value="Müstakil Parsel">Müstakil Parsel</option>
            <option value="Hisseli Parsel">Hisseli Parsel</option>
            <option value="Tahsisli">Tahsisli</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="gabari">Gabari</label>
          <input type="text" id="gabari" name="gabari" placeholder="Örn. Serbest / 6.50">
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="kaks">KAKS</label>
          <input type="text" id="kaks" name="kaks" placeholder="Örn. 1.20">
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="adaNo">Ada No</label>
          <input type="text" id="adaNo" name="adaNo" placeholder="Örn. 145">
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="parselNo">Parsel No</label>
          <input type="text" id="parselNo" name="parselNo" placeholder="Örn. 12">
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="paftaNo">Pafta No</label>
          <input type="text" id="paftaNo" name="paftaNo" placeholder="Örn. 27">
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="titleDeedStatus">Tapu Durumu</label>
          <select id="titleDeedStatus" name="titleDeedStatus">
            <option value="">Seçin</option>
            <option value="Kat Mülkiyetli">Kat Mülkiyetli</option>
            <option value="Kat İrtifaklı">Kat İrtifaklı</option>
            <option value="Hisseli Tapu">Hisseli Tapu</option>
            <option value="Arsa Tapulu">Arsa Tapulu</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="roadFrontage">Yola Cephe</label>
          <select id="roadFrontage" name="roadFrontage">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="roadOpened">Yolu Açılmış</label>
          <select id="roadOpened" name="roadOpened">
            <option value="">Seçin</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="flatExchangeEligible">Kat Karşılığı</label>
          <select id="flatExchangeEligible" name="flatExchangeEligible">
            <option value="">Seçin</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="electricInfrastructure">Elektrik</label>
          <select id="electricInfrastructure" name="electricInfrastructure">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="waterInfrastructure">Su</label>
          <select id="waterInfrastructure" name="waterInfrastructure">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="sewerageInfrastructure">Kanalizasyon</label>
          <select id="sewerageInfrastructure" name="sewerageInfrastructure">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="naturalGasInfrastructure">Doğalgaz</label>
          <select id="naturalGasInfrastructure" name="naturalGasInfrastructure">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="unitPrice">m² Fiyatı</label>
          <input type="number" id="unitPrice" name="unitPrice" placeholder="Örn. 12500">
        </div>

        <div class="field-group estate-type-group estate-type-arsa" style="display:none;">
          <label for="parcelQueryLink">Parsel Sorgu Linki</label>
          <input type="url" id="parcelQueryLink" name="parcelQueryLink" placeholder="https://parselsorgu.tkgm.gov.tr/">
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="workplaceType">İşyeri Türü</label>
          <select id="workplaceType" name="workplaceType">
            <option value="">Seçin</option>
            <option value="Dükkan">Dükkan</option>
            <option value="Mağaza">Mağaza</option>
            <option value="Ofis">Ofis</option>
            <option value="Büro">Büro</option>
            <option value="Plaza Katı">Plaza Katı</option>
            <option value="Cafe">Cafe</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Depo">Depo</option>
            <option value="Atölye">Atölye</option>
            <option value="İmalathane">İmalathane</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="usageStatus">Kullanım Durumu</label>
          <select id="usageStatus" name="usageStatus">
            <option value="">Seçin</option>
            <option value="Boş">Boş</option>
            <option value="Kiracılı">Kiracılı</option>
            <option value="Kullanımda">Kullanımda</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="sectionCount">Bölme Sayısı</label>
          <input type="number" id="sectionCount" name="sectionCount" placeholder="Örn. 3">
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="hasStorage">Depo</label>
          <select id="hasStorage" name="hasStorage">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="hasKitchen">Mutfak</label>
          <select id="hasKitchen" name="hasKitchen">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="showcaseMeters">Vitrin Cephesi</label>
          <input type="number" id="showcaseMeters" name="showcaseMeters" placeholder="Örn. 8">
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="workplaceTitleDeedStatus">Tapu Durumu</label>
          <select id="workplaceTitleDeedStatus" name="workplaceTitleDeedStatus">
            <option value="">Seçin</option>
            <option value="Kat Mülkiyetli">Kat Mülkiyetli</option>
            <option value="Kat İrtifaklı">Kat İrtifaklı</option>
            <option value="Hisseli">Hisseli</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="workplaceParking">Otopark</label>
          <select id="workplaceParking" name="workplaceParking">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="workplaceElevator">Asansör</label>
          <select id="workplaceElevator" name="workplaceElevator">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="workplaceGenerator">Jeneratör</label>
          <select id="workplaceGenerator" name="workplaceGenerator">
            <option value="">Seçin</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div class="field-group estate-type-group estate-type-isyeri" style="display:none;">
          <label for="usageSuitability">Kullanıma Uygunluk</label>
          <select id="usageSuitability" name="usageSuitability">
            <option value="">Seçin</option>
            <option value="Ofis">Ofis</option>
            <option value="Mağaza">Mağaza</option>
            <option value="Cafe">Cafe</option>
            <option value="Market">Market</option>
            <option value="Sağlık">Sağlık</option>
            <option value="Eğitim">Eğitim</option>
          </select>
        </div>
      </div>
    `;

    const estateTypeField = field("estateType");
    const estateFields = dynamicFields.querySelectorAll("input, select");
    const heatingTypeField = field("heatingType");
    const arsaTapuField = field("titleDeedStatus");
    const workplaceTapuField = field("workplaceTitleDeedStatus");
    const populateEstateSelect = (element, options) => {
      if (!element) return;
      const current = element.value;
      element.innerHTML = ['<option value="">Seçin</option>', ...options.map((option) => `<option value="${option}">${option}</option>`)].join("");
      if (options.includes(current)) element.value = current;
    };
    const syncEstateTypeFields = () => {
      const currentType = safeVal("estateType");
      populateEstateSelect(
        heatingTypeField,
        currentType === "isyeri" ? realEstateHeatingOptions.isyeri : realEstateHeatingOptions.konut
      );
      populateEstateSelect(
        arsaTapuField,
        ["Kat Mülkiyetli", "Kat İrtifaklı", "Hisseli Tapu", "Arsa Tapulu"]
      );
      populateEstateSelect(
        workplaceTapuField,
        ["Kat Mülkiyetli", "Kat İrtifaklı", "Hisseli"]
      );
      dynamicFields.querySelectorAll(".estate-type-group").forEach((group) => {
        const classes = group.classList;
        const isKonut = classes.contains("estate-type-konut");
        const isArsa = classes.contains("estate-type-arsa");
        const isIsyeri = classes.contains("estate-type-isyeri");
        const show =
          (!currentType && isKonut) ||
          (currentType === "konut" && isKonut) ||
          (currentType === "arsa" && isArsa) ||
          (currentType === "isyeri" && isIsyeri);
        group.style.display = show ? "flex" : "none";
        group.querySelectorAll("input, select, textarea").forEach((control) => {
          control.disabled = !show;
        });
      });
      syncVisibilityRequirements();
    };

    estateFields.forEach((fieldEl) => {
      fieldEl.addEventListener("input", () => {
        updateLivePreview();
        updateStepButtons();
      });
      fieldEl.addEventListener("change", () => {
        updateLivePreview();
        updateStepButtons();
      });
    });

    estateTypeField?.addEventListener("change", () => {
      syncEstateTypeFields();
      updateLivePreview();
      updateStepButtons();
    });

    syncEstateTypeFields();
  }

  function renderElectronicsFields() {
    dynamicFields.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label for="electronicType">Elektronik Türü</label>
          <select id="electronicType" name="electronicType">
            <option value="">Tür seçin</option>
            <option value="telefon">Telefon</option>
            <option value="laptop">Laptop / Bilgisayar</option>
            <option value="gaming">Gaming</option>
            <option value="tv">TV / Ses Sistemi</option>
            <option value="kamera">Kamera / Fotoğraf</option>
            <option value="aksesuar">Aksesuar</option>
          </select>
        </div>
        <div class="field-group">
          <label for="condition">Durum</label>
          <select id="condition" name="condition">
            <option value="">Durum seçin</option>
            <option value="Sıfır">Sıfır</option>
            <option value="Az Kullanılmış">Az Kullanılmış</option>
            <option value="İyi">İyi</option>
            <option value="Orta">Orta</option>
            <option value="Parça Niyetine">Parça Niyetine</option>
          </select>
        </div>
        <div class="field-group">
          <label for="brand">Marka</label>
          <input type="text" id="brand" name="brand" placeholder="Örn. Apple, Samsung, Lenovo">
        </div>
        <div class="field-group">
          <label for="model">Model</label>
          <input type="text" id="model" name="model" placeholder="Örn. iPhone 15 Pro">
        </div>

        <div class="field-group electronic-type-group electronic-type-phone">
          <label for="storage">Depolama</label>
          <select id="storage" name="storage">
            <option value="">Seçin</option>
            <option value="64 GB">64 GB</option>
            <option value="128 GB">128 GB</option>
            <option value="256 GB">256 GB</option>
            <option value="512 GB">512 GB</option>
            <option value="1 TB">1 TB</option>
          </select>
        </div>

        <div class="field-group electronic-type-group electronic-type-phone electronic-type-laptop">
          <label for="ram">RAM</label>
          <select id="ram" name="ram">
            <option value="">Seçin</option>
            <option value="4 GB">4 GB</option>
            <option value="8 GB">8 GB</option>
            <option value="16 GB">16 GB</option>
            <option value="32 GB">32 GB</option>
            <option value="64 GB">64 GB</option>
          </select>
        </div>

        <div class="field-group electronic-type-group electronic-type-phone">
          <label for="batteryHealth">Pil Sağlığı</label>
          <input type="text" id="batteryHealth" name="batteryHealth" placeholder="Örn. %92">
        </div>

        <div class="field-group electronic-type-group electronic-type-phone">
          <label for="deviceColor">Renk</label>
          <input type="text" id="deviceColor" name="deviceColor" placeholder="Örn. Titanyum Siyah">
        </div>

        <div class="field-group electronic-type-group electronic-type-phone">
          <label for="imeiStatus">IMEI Durumu</label>
          <select id="imeiStatus" name="imeiStatus">
            <option value="">Seçin</option>
            <option value="Kayıtlı">Kayıtlı</option>
            <option value="Kayıtsız">Kayıtsız</option>
            <option value="eSIM Destekli">eSIM Destekli</option>
          </select>
        </div>

        <div class="field-group electronic-type-group electronic-type-laptop">
          <label for="processor">İşlemci</label>
          <input type="text" id="processor" name="processor" placeholder="Örn. Intel Core i7 / M3">
        </div>

        <div class="field-group electronic-type-group electronic-type-laptop">
          <label for="ssdCapacity">SSD</label>
          <select id="ssdCapacity" name="ssdCapacity">
            <option value="">Seçin</option>
            <option value="256 GB SSD">256 GB SSD</option>
            <option value="512 GB SSD">512 GB SSD</option>
            <option value="1 TB SSD">1 TB SSD</option>
            <option value="2 TB SSD">2 TB SSD</option>
          </select>
        </div>

        <div class="field-group electronic-type-group electronic-type-laptop">
          <label for="gpu">GPU</label>
          <input type="text" id="gpu" name="gpu" placeholder="Örn. RTX 4060">
        </div>

        <div class="field-group electronic-type-group electronic-type-laptop">
          <label for="screenSize">Ekran Boyutu</label>
          <input type="text" id="screenSize" name="screenSize" placeholder="Örn. 15.6 inç">
        </div>

        <div class="field-group electronic-type-group electronic-type-laptop">
          <label for="operatingSystem">İşletim Sistemi</label>
          <input type="text" id="operatingSystem" name="operatingSystem" placeholder="Örn. Windows 11">
        </div>

        <div class="field-group electronic-type-group electronic-type-tv">
          <label for="screenInch">İnç</label>
          <input type="text" id="screenInch" name="screenInch" placeholder="Örn. 55 inç">
        </div>

        <div class="field-group electronic-type-group electronic-type-tv">
          <label for="panelType">Panel Tipi</label>
          <select id="panelType" name="panelType">
            <option value="">Seçin</option>
            <option value="LED">LED</option>
            <option value="QLED">QLED</option>
            <option value="OLED">OLED</option>
            <option value="Mini LED">Mini LED</option>
          </select>
        </div>

        <div class="field-group electronic-type-group electronic-type-tv">
          <label for="resolution">Çözünürlük</label>
          <select id="resolution" name="resolution">
            <option value="">Seçin</option>
            <option value="Full HD">Full HD</option>
            <option value="4K">4K</option>
            <option value="8K">8K</option>
          </select>
        </div>

        <div class="field-group electronic-type-group electronic-type-camera">
          <label for="lens">Lens</label>
          <input type="text" id="lens" name="lens" placeholder="Örn. 24-70mm">
        </div>

        <div class="field-group electronic-type-group electronic-type-camera">
          <label for="shutterCount">Shutter Sayısı</label>
          <input type="number" id="shutterCount" name="shutterCount" placeholder="Örn. 12000">
        </div>

        <div class="field-group electronic-type-group electronic-type-camera">
          <label for="sensorSize">Sensör Boyutu</label>
          <input type="text" id="sensorSize" name="sensorSize" placeholder="Örn. Full Frame">
        </div>
      </div>
    `;

    const electronicTypeField = field("electronicType");
    const syncElectronicTypeFields = () => {
      const currentType = safeVal("electronicType");
      dynamicFields.querySelectorAll(".electronic-type-group").forEach((group) => {
        const className = Array.from(group.classList).find((item) => item.startsWith("electronic-type-") && item !== "electronic-type-group");
        const matches = !currentType || className === `electronic-type-${currentType}`;
        group.style.display = matches ? "flex" : "none";
        group.querySelectorAll("input, select, textarea").forEach((control) => {
          control.disabled = !matches;
        });
      });
      if (field("subCategory") && currentType) {
        const labels = {
          telefon: "Telefon",
          laptop: "Laptop / Bilgisayar",
          gaming: "Gaming",
          tv: "TV / Ses Sistemi",
          kamera: "Kamera / Fotoğraf",
          aksesuar: "Aksesuar",
        };
        field("subCategory").value = labels[currentType] || "";
      }
      syncVisibilityRequirements();
    };

    electronicTypeField?.addEventListener("change", () => {
      syncElectronicTypeFields();
      updateLivePreview();
      updateStepButtons();
    });

    syncElectronicTypeFields();
  }

  function renderFields(force = false) {
    console.log("renderFields.enter", {
      currentStep,
      category: safeVal("category"),
      hasDynamicFields: Boolean(dynamicFields),
      dynamicLength: dynamicFields?.innerHTML?.length || 0,
      lastRenderedCategory,
      force
    });
    if (isRendering) return;
    if (!dynamicFields) return;

    if (currentStep !== 2) {
      console.log("renderFields.skip.nonStep2", {
        currentStep,
        beforeLength: dynamicFields.innerHTML.length
      });
      return;
    }

    const category = safeVal("category");
    if (!document.querySelector('[name="category"]')) return;
    if (!category) return;

    const shouldRender = force || !dynamicFields.innerHTML.trim() || lastRenderedCategory !== category;
    if (!shouldRender) {
      console.log("renderFields.skip.sameCategory", {
        currentStep,
        category,
        lastRenderedCategory
      });
      return;
    }

    isRendering = true;
    try {
      if (category === "Otomobil") renderVehicleFields();
      else if (category === "Emlak") renderRealEstateFields();
      else renderElectronicsFields();
      lastRenderedCategory = category;
      applyEditListingToDynamicFields();
      console.log("renderFields.afterRender", {
        category,
        dynamicLength: dynamicFields.innerHTML.length,
        outerHTML: dynamicFields.outerHTML
      });
    } finally {
      isRendering = false;
    }
  }

  function showStep(step) {
    if (step === currentStep) {
      return;
    }
    currentStep = step;
    console.log("SHOW STEP", step);
    console.log("typeof renderVehicleFields", typeof renderVehicleFields);
    if (step === 2) {
      console.log("CALLING renderVehicleFields");
      if (typeof renderVehicleFields === "function") {
        renderVehicleFields();
      }
    }
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
    const location = [city ? `${city}${district}` : "", vehicle].filter(Boolean).join(" ");
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
    if (!stagedImageFiles.length && !existingImageUrls.length) {
      livePreviewImg.src = PLACEHOLDER_IMG;
      return;
    }
    if (!stagedImageFiles.length && existingImageUrls.length) {
      livePreviewImg.src = existingImageUrls[0];
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
    const totalCount = existingImageUrls.length + stagedImageFiles.length;
    if (photoCountText) photoCountText.textContent = `${totalCount}/${MAX_PHOTOS} fotoğraf`;

    existingImageUrls.forEach((src, index) => {
      const item = document.createElement("div");
      item.className = "preview-item";
      item.title = `${index + 1}. fotoğraf`;
      item.dataset.order = String(index + 1);
      const img = document.createElement("img");
      img.alt = `${index + 1}. fotoğraf`;
      img.src = src;
      const overlay = document.createElement("div");
      overlay.className = "preview-item-overlay";
      overlay.innerHTML = `<span>${index === 0 ? "Kapak Fotoğrafı" : `Galeri ${index + 1}`}</span>`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "remove-btn";
      btn.setAttribute("aria-label", "Fotoğrafı sil");
      btn.textContent = "×";
      btn.addEventListener("click", () => {
        existingImageUrls.splice(index, 1);
        renderImagePreview();
        updateLivePreviewImage();
      });
      item.append(img, overlay, btn);
      preview.appendChild(item);
    });

    stagedImageFiles.forEach((file, fileIndex) => {
      const index = existingImageUrls.length + fileIndex;
      const item = document.createElement("div");
      item.className = "preview-item is-loading";
      item.title = `${index + 1}. fotoğraf`;
      item.dataset.order = String(index + 1);
      const img = document.createElement("img");
      img.alt = `${index + 1}. fotoğraf`;
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result;
        item.classList.remove("is-loading");
      };
      reader.readAsDataURL(file);
      const overlay = document.createElement("div");
      overlay.className = "preview-item-overlay";
      overlay.innerHTML = `<span>${index === 0 ? "Kapak Fotoğrafı" : `Galeri ${index + 1}`}</span>`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "remove-btn";
      btn.setAttribute("aria-label", "Fotoğrafı sil");
      btn.textContent = "×";
      btn.addEventListener("click", () => {
        stagedImageFiles.splice(fileIndex, 1);
        syncInputFiles();
        renderImagePreview();
        updateLivePreviewImage();
      });
      item.append(img, overlay, btn);
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

  function renderVideoPreview(file, videoUrl = "") {
    if (!videoPreview) return;
    videoPreview.innerHTML = "";
    const hasFile = file && file.type.startsWith("video/");
    const url = String(videoUrl || "").trim();

    if (!hasFile && !url) return;

    if (hasFile) {
      const video = document.createElement("video");
      video.controls = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
      video.onloadeddata = () => URL.revokeObjectURL(video.src);
      videoPreview.appendChild(video);
    }

    if (url) {
      const linkCard = document.createElement("div");
      linkCard.className = "video-link-preview";
      const title = document.createElement("strong");
      title.textContent = "YouTube bağlantısı eklendi";
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = url;
      linkCard.append(title, link);
      videoPreview.appendChild(linkCard);
    }
  }

  function applyEditListingToDynamicFields() {
    if (!isEditMode || !editingListing || currentStep !== 2) return;

    const listing = editingListing;
    const simpleFieldIds = [
      "year", "km", "fuel", "transmission", "bodyType", "drivetrain", "color",
      "engine", "enginePower", "torque", "fuelConsumption", "cityFuelConsumption",
      "highwayFuelConsumption", "combinedFuelConsumption", "emissionStandard", "plate",
      "hasarKaydi", "warrantyStatus", "isSwapEligibleVehicle", "isCreditEligibleVehicle",
      "batteryCapacity", "rangeKm", "acChargeTime", "dcFastChargeSupport", "ccs2Support",
      "type2Support", "batteryHealthVehicle", "otaSupportVehicle", "autonomousDrivingLevel",
      "fsdSupportVehicle", "hybridType", "sellerType", "vehicleCondition", "rooms", "m2",
      "age", "floor", "estateType", "dues", "bathrooms", "zoningStatus", "arsaStatus",
      "titleDeedStatus", "usageStatus", "hasStorage", "hasKitchen", "heatingType",
      "residenceUsageStatus", "residenceTitleDeedStatus", "isFurnished", "isInSite",
      "balconyCount", "wcCount", "facade", "totalFloors", "isMortgageEligible",
      "isSwapEligible", "gabari", "kaks", "adaNo", "parselNo", "paftaNo", "roadFrontage",
      "roadOpened", "flatExchangeEligible", "electricInfrastructure", "waterInfrastructure",
      "sewerageInfrastructure", "naturalGasInfrastructure", "unitPrice", "parcelQueryLink",
      "sectionCount", "showcaseMeters", "workplaceType", "workplaceTitleDeedStatus",
      "workplaceParking", "workplaceElevator", "workplaceGenerator", "usageSuitability",
      "videoUrl", "electronicType", "condition", "storage", "ram", "batteryHealth",
      "deviceColor", "imeiStatus", "processor", "ssdCapacity", "gpu", "screenSize",
      "operatingSystem", "screenInch", "panelType", "resolution", "lens", "shutterCount",
      "sensorSize", "subCategory"
    ];

    if (field("brand") && listing.brand) {
      primeVehicleSelectForEdit("brand", Object.keys(carData), listing.brand, VEHICLE_SELECT_PLACEHOLDERS.brand);
    }
    if (field("series") && listing.series) {
      primeVehicleSelectForEdit("series", Object.keys(carData[String(listing.brand || "")] || {}), listing.series, VEHICLE_SELECT_PLACEHOLDERS.series);
    }
    if (field("model") && listing.model) {
      const modelSource = (carData[String(listing.brand || "")]?.[String(listing.series || "")] || []).map((item) => item?.name).filter(Boolean);
      primeVehicleSelectForEdit("model", modelSource, listing.model, VEHICLE_SELECT_PLACEHOLDERS.model);
      applyVehicleSpecs();
    }

    simpleFieldIds.forEach((id) => {
      const input = field(id);
      if (!input) return;
      const value = listing[id];
      if (typeof value === "undefined" || value === null) return;
      setVal(id, value);
    });

    const firstOwnerValue = String(listing.firstOwner || "").trim().toLowerCase();
    const serviceMaintainedValue = String(listing.serviceMaintained || "").trim().toLowerCase();
    const firstOwnerField = field("firstOwner");
    const serviceMaintainedField = field("serviceMaintained");
    if (firstOwnerField) firstOwnerField.checked = firstOwnerValue === "evet" || firstOwnerValue === "true";
    if (serviceMaintainedField) serviceMaintainedField.checked = serviceMaintainedValue === "evet" || serviceMaintainedValue === "true";

    syncVehicleFuelFields();
    toggleVehicleDetailFields();
    updateLivePreview();
    updateStepButtons();
  }

  async function loadEditListingIfNeeded() {
    if (!isEditMode) return;

    if (!token) {
      alert("İlanı düzenlemek için giriş yapmalısın.");
      window.location.href = "/login.html";
      return;
    }

    const response = await fetch(`/api/listings/${encodeURIComponent(editListingId)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const listing = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(listing?.error || "İlan düzenleme verisi alınamadı");
    }

    editingListing = listing;
    existingImageUrls = normalizedMediaList(listing);

    showListingFormFlow();
    if (submitButton) submitButton.textContent = "İlanı Güncelle";
    document.title = "İlan Düzenle - Jetle";

    const formCategory = inferEditFormCategory(listing);
    setVal("category", formCategory);
    setVal("title", listing.title || "");
    setVal("description", listing.description || listing.desc || "");
    setVal("price", listing.price || "");
    setVal("city", listing.city || "");
    populateDistricts();
    setVal("district", listing.district || "");
    setVal("subCategory", listing.subCategory || "");

    renderImagePreview();
    updateLivePreviewImage();
    renderVideoPreview(null, listing.videoUrl || "");
    updateLivePreview();
    updateStepButtons();
  }

  function collectFeatures() {
    return Array.from(document.querySelectorAll('.features-root .category-feature-group.is-active input[type="checkbox"]:checked:not(:disabled)'))
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
        return `<span class="is-${state}">${label}: ${status}</span>`;
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
    if (!token) {
      window.location.href = "/login.html";
      return [];
    }
    const formData = new FormData();
    stagedImageFiles.forEach((file) => formData.append("images", file));
    console.log("UPLOAD_FETCH_START");
    const res = await fetch("/api/listings/upload", {
      method: "POST",
      headers: token ? { Authorization: "Bearer " + token } : {},
      body: formData,
    });
    console.log("UPLOAD_FETCH_DONE");
    if (!res.ok) return [];
    return await res.json();
  }

  function formPayload(imageUrls = []) {
    const selectedDamage = Object.entries(collectDamageMap())
      .filter(([, value]) => value && value !== "original")
      .map(([part, value]) => `${part}:${value}`);
    const selectedFeatures = collectFeatures();
    const rawCategory = safeVal("category");
    const rawSubCategory = safeVal("subCategory");
    const mainCategory = inferMainCategory(rawCategory, rawSubCategory);
    const subCategory = rawSubCategory || (mainCategory && normalizeCategoryToken(rawCategory) !== mainCategory ? rawCategory : "");

    const payload = {
      title: safeVal("title").trim(),
      description: safeVal("description").trim(),
      desc: safeVal("description").trim(),
      price: Number(rawPrice()),
      category: mainCategory || rawCategory,
      mainCategory: mainCategory || rawCategory,
      subCategory: subCategory,
      city: safeVal("city"),
      district: safeVal("district"),
      location: safeVal("district") ? `${safeVal("city")} / ${safeVal("district")}` : safeVal("city"),
      features: selectedFeatures,
      damage: selectedDamage,
      damageMap: collectDamageMap(),
    };

    console.log("CREATE_CATEGORY_RAW", JSON.stringify({
      category: rawCategory,
      mainCategory,
      subCategory
    }, null, 2));
    console.log("CREATE_MAIN_CATEGORY", mainCategory || rawCategory);
    console.log("CREATE_SUBCATEGORY", subCategory);

    ["brand", "series", "model", "year", "km", "fuel", "gear", "transmission", "bodyType", "color", "engine", "engineSize", "enginePower", "power", "sellerType", "vehicleCondition", "drivetrain", "torque", "fuelConsumption", "cityFuelConsumption", "highwayFuelConsumption", "combinedFuelConsumption", "emissionStandard", "plate", "hasarKaydi", "warrantyStatus", "isSwapEligibleVehicle", "isCreditEligibleVehicle", "batteryCapacity", "rangeKm", "acChargeTime", "dcFastChargeSupport", "ccs2Support", "type2Support", "batteryHealthVehicle", "otaSupportVehicle", "autonomousDrivingLevel", "fsdSupportVehicle", "hybridType", "rooms", "m2", "age", "floor", "estateType", "dues", "bathrooms", "zoningStatus", "arsaStatus", "titleDeedStatus", "usageStatus", "hasStorage", "hasKitchen", "heatingType", "residenceUsageStatus", "residenceTitleDeedStatus", "isFurnished", "isInSite", "balconyCount", "wcCount", "facade", "totalFloors", "isMortgageEligible", "isSwapEligible", "gabari", "kaks", "adaNo", "parselNo", "paftaNo", "roadFrontage", "roadOpened", "flatExchangeEligible", "electricInfrastructure", "waterInfrastructure", "sewerageInfrastructure", "naturalGasInfrastructure", "unitPrice", "parcelQueryLink", "sectionCount", "showcaseMeters", "workplaceType", "workplaceTitleDeedStatus", "workplaceParking", "workplaceElevator", "workplaceGenerator", "usageSuitability", "videoUrl", "electronicType", "condition", "storage", "ram", "batteryHealth", "deviceColor", "imeiStatus", "processor", "ssdCapacity", "gpu", "screenSize", "operatingSystem", "screenInch", "panelType", "resolution", "lens", "shutterCount", "sensorSize"].forEach((id) => {
      const element = field(id);
      if (element?.disabled) return;
      const value = safeVal(id);
      if (element && value !== "") payload[id] = element.type === "number" ? Number(value) : value;
    });

    if (getChecked("firstOwner")) payload.firstOwner = "Evet";
    if (getChecked("serviceMaintained")) payload.serviceMaintained = "Evet";

    if (!payload.transmission && payload.gear) payload.transmission = payload.gear;
    if (!payload.engineSize && payload.engine) payload.engineSize = payload.engine;
    if (!payload.enginePower && payload.power) payload.enginePower = payload.power;

    return payload;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (window.__SUBMIT_LOCK__) {
      console.warn("SUBMIT_BLOCKED_DUPLICATE");
      return;
    }

    window.__SUBMIT_LOCK__ = true;
    console.log("SUBMIT_START");

    if (!validateStep1() || !validateStep2()) {
      window.__SUBMIT_LOCK__ = false;
      return;
    }

    if (!token) {
      window.__SUBMIT_LOCK__ = false;
      alert("İlan vermek için giriş yapmalısın.");
      window.location.href = "/login.html";
      return;
    }

    const activeSubmitButton = submitButton || document.getElementById("submitBtn");
    const originalLabel = activeSubmitButton?.textContent || "";

    try {
      if (activeSubmitButton) {
        activeSubmitButton.disabled = true;
        activeSubmitButton.textContent = "Gönderiliyor...";
      }

      const uploadResult = await uploadImagesIfNeeded();
      console.log("UPLOAD_RAW_RESULT", uploadResult);
      const imageUrls =
        uploadResult?.urls ||
        uploadResult?.data?.urls ||
        uploadResult?.assets?.map((a) => a?.url) ||
        [];
      const uploadedImageUrls = (Array.isArray(imageUrls) ? imageUrls : [])
        .filter(Boolean)
        .map((v) => String(v).trim())
        .filter(Boolean);
      const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];
      console.log("FINAL_IMAGE_URLS", finalImageUrls);
      if (stagedImageFiles.length && !uploadedImageUrls.length) {
        console.error("UPLOAD_EMPTY_ABORT");
        return;
      }
      const payload = formPayload(finalImageUrls);

      payload.images = [...finalImageUrls];
      payload.photos = [...finalImageUrls];
      payload.gallery = [...finalImageUrls];
      payload.image = finalImageUrls[0] || "";
      payload.coverImage = finalImageUrls[0] || "";
      payload.mainImage = finalImageUrls[0] || "";

      console.log("CREATE_FINAL_PAYLOAD", JSON.stringify(payload, null, 2));

      const res = await fetch(isEditMode ? `/api/listings/${encodeURIComponent(editListingId)}` : "/api/listings", {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      console.log("CREATE_RESPONSE", data);

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "İlan gönderilemedi");
      }

      const listingId = String(data?.listing?._id || data?.listing?.id || data?._id || data?.id || "").trim();
      console.log("CREATE_REDIRECT_ID", data?.listing?._id || data?.listing?.id || data?._id || data?.id || "");
      alert(isEditMode ? "İlan başarıyla güncellendi." : "İlan başarıyla gönderildi.");
      if (listingId) {
        window.location.href = `/listing-detail.html?id=${encodeURIComponent(listingId)}`;
      }
    } catch (err) {
      console.error("LISTING SUBMIT ERROR:", err);
      alert(err?.message || "İlan gönderilemedi.");
    } finally {
      window.__SUBMIT_LOCK__ = false;
      if (activeSubmitButton) {
        activeSubmitButton.disabled = false;
        activeSubmitButton.textContent = originalLabel || "İlanı Yayınla";
      }
    }
  }

  await loadCarData();
  populateCities();
  showStep(1);
  renderFields();
  await loadEditListingIfNeeded();
  updateLivePreview();
  updateStepButtons();

  if (categorySelect) categorySelect.addEventListener("change", () => {
    const category = safeVal("category");
    if (lastRenderedCategory && lastRenderedCategory !== category) {
      dynamicFields.innerHTML = "";
      lastRenderedCategory = "";
    }
    renderFields(true);
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
    if (validateStep1()) {
      showStep(2);
      renderFields();
      updateStepButtons();
    }
  });
  const btnStep2Back = $("btnStep2Back");
  if (btnStep2Back) btnStep2Back.addEventListener("click", () => {
    showStep(1);
    renderFields();
    updateStepButtons();
  });
  const btnStep2Next = $("btnStep2Next");
  if (btnStep2Next) btnStep2Next.addEventListener("click", () => {
    if (validateStep2()) {
      showStep(3);
      renderFields();
      updateStepButtons();
    }
  });
  const btnStep3Back = $("btnStep3Back");
  if (btnStep3Back) btnStep3Back.addEventListener("click", () => {
    showStep(2);
    renderFields();
    updateStepButtons();
  });

  if (imageInput) imageInput.addEventListener("change", () => addImages(imageInput.files));
  if (videoInput) videoInput.addEventListener("change", () => renderVideoPreview(videoInput.files?.[0], field("videoUrl")?.value || ""));
  document.addEventListener("input", (event) => {
    if (event.target?.id === "videoUrl") {
      renderVideoPreview(videoInput?.files?.[0], event.target.value);
    }
  });
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

  if (form) {
    form.method = "post";
    form.action = "#";
    form.noValidate = true;
    form.removeEventListener("submit", handleFormSubmit);
    form.addEventListener("submit", handleFormSubmit);
  }

  document.querySelectorAll(".damage-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = damageModeMap[button.dataset.status] || "original";
      currentDamageMode = selected;
      document.querySelectorAll(".damage-btn").forEach((item) => item.classList.toggle("active", item === button));
    });
  });

  document.querySelectorAll(".damage-panel .part").forEach((part) => {
    part.dataset.state = "original";
    part.addEventListener("click", () => {
      part.dataset.state = currentDamageMode;
      part.classList.remove("painted", "local", "changed");
      if (currentDamageMode !== "original") part.classList.add(currentDamageMode);
      renderDamageStatusList();
      part.dispatchEvent(new Event("change", { bubbles: true }));
    });
    part.addEventListener("mouseenter", (event) => showDamageTooltip(part, event));
    part.addEventListener("mousemove", positionDamageTooltip);
    part.addEventListener("mouseleave", hideDamageTooltip);
  });
  renderDamageStatusList();

}

document.addEventListener("DOMContentLoaded", () => {
  initCreateListingPage();
});


