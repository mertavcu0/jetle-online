/**
 * jetle-v2 — İlan ver formu (POST /api/ilan), doğrulama, kategori, sürükle-bırak, önizleme, adım çubuğu.
 */
(function () {
  "use strict";

  var CITIES = [
    "Adana",
    "Ankara",
    "Antalya",
    "Bursa",
    "Denizli",
    "Diyarbakır",
    "Erzurum",
    "Eskişehir",
    "Gaziantep",
    "İstanbul",
    "İzmir",
    "Kayseri",
    "Kocaeli",
    "Konya",
    "Malatya",
    "Mersin",
    "Samsun",
    "Sakarya",
    "Trabzon",
    "Van",
    "Diğer"
  ];

  var previewUrls = [];

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function revokePreviewUrls() {
    previewUrls.forEach(function (u) {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    previewUrls = [];
  }

  function mergeIntoFileInput(input, fileList) {
    if (!input || !fileList || !fileList.length) return;
    try {
      var dt = new DataTransfer();
      if (input.files && input.files.length) {
        for (var i = 0; i < input.files.length; i++) {
          dt.items.add(input.files[i]);
        }
      }
      for (var j = 0; j < fileList.length; j++) {
        dt.items.add(fileList[j]);
      }
      input.files = dt.files;
    } catch (err) {
      console.warn("[ilan-ver] Dosya birleştirme desteklenmiyor", err);
    }
  }

  function updatePhotoLabel(photoInput, labelEl) {
    if (!labelEl) return;
    var n = photoInput && photoInput.files ? photoInput.files.length : 0;
    if (!n) {
      labelEl.hidden = true;
      labelEl.textContent = "";
      return;
    }
    labelEl.hidden = false;
    labelEl.textContent = n === 1 ? "1 dosya seçildi" : n + " dosya seçildi";
  }

  function renderPhotoPreviews(photoInput, mount) {
    revokePreviewUrls();
    if (!mount) return;
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    if (!photoInput || !photoInput.files || !photoInput.files.length) return;
    var max = 16;
    var n = Math.min(photoInput.files.length, max);
    for (var i = 0; i < n; i++) {
      var f = photoInput.files[i];
      if (!f || !f.type || f.type.indexOf("image/") !== 0) continue;
      var url = URL.createObjectURL(f);
      previewUrls.push(url);
      var wrap = document.createElement("div");
      wrap.className = "ilan-ver-v2__preview";
      var img = document.createElement("img");
      img.src = url;
      img.alt = f.name || "Önizleme";
      wrap.appendChild(img);
      mount.appendChild(wrap);
    }
  }

  function bilgiOk() {
    var title = document.getElementById("ilanTitle");
    var desc = document.getElementById("ilanDesc");
    var t = title && String(title.value || "").trim();
    var d = desc && String(desc.value || "").trim();
    return !!(t && t.length >= 3 && d && d.length >= 10);
  }

  function isFormValid() {
    var title = document.getElementById("ilanTitle");
    var desc = document.getElementById("ilanDesc");
    var price = document.getElementById("ilanPrice");
    var cat = document.getElementById("ilanCategory");
    var city = document.getElementById("ilanCity");

    var t = title && String(title.value || "").trim();
    var d = desc && String(desc.value || "").trim();
    var pRaw = price && String(price.value || "").trim();
    var p = pRaw === "" ? NaN : Number(price.value);
    var c = cat && String(cat.value || "").trim();
    var ci = city && String(city.value || "").trim();

    if (!t || t.length < 3) return false;
    if (!d || d.length < 10) return false;
    if (!c) return false;
    if (!ci) return false;
    if (!Number.isFinite(p) || p < 0) return false;
    return true;
  }

  function syncStepTrack() {
    var tabs = document.querySelectorAll(".ilan-ver-v2__steptab");
    if (!tabs || tabs.length < 3) return;
    var full = isFormValid();
    var b = bilgiOk();
    var stepIndex = 0;
    if (!b) stepIndex = 0;
    else if (!full) stepIndex = 1;
    else stepIndex = 2;
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("is-active", i === stepIndex);
    }
  }

  function syncCategoryReadout(catSelect, readout) {
    if (!readout) return;
    var v = catSelect && String(catSelect.value || "").trim();
    if (!v) {
      readout.textContent = "Sol menüden seçim yapın.";
      return;
    }
    readout.textContent = "Seçilen kategori: " + v;
  }

  function syncCatButtons(catSelect, buttons) {
    var v = catSelect ? String(catSelect.value || "") : "";
    buttons.forEach(function (btn) {
      var val = btn.getAttribute("data-ilan-cat") || "";
      btn.classList.toggle("is-selected", val === v);
    });
  }

  function refreshSubmitState(submitBtn) {
    if (!submitBtn) return;
    if (submitBtn.getAttribute("data-submitting") === "1") return;
    submitBtn.disabled = !isFormValid();
  }

  ready(function () {
    if (!window.JetleAPI) return;
    JetleAPI.init();

    var form = document.getElementById("ilanVerForm");
    var citySel = document.getElementById("ilanCity");
    var catSelect = document.getElementById("ilanCategory");
    var readout = document.getElementById("ilanCategoryReadout");
    var submitBtn = document.getElementById("ilanVerSubmit");
    var photoInput = document.getElementById("ilanPhotos");
    var dropzone = document.getElementById("ilanPhotoDropzone");
    var filesLabel = document.getElementById("ilanPhotoFilesLabel");
    var previewsEl = document.getElementById("ilanPhotoPreviews");
    var catButtons = document.querySelectorAll(".ilan-ver-v2__catbtn[data-ilan-cat]");

    if (citySel && citySel.options.length <= 1) {
      CITIES.forEach(function (c) {
        var o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        citySel.appendChild(o);
      });
    }

    if (!form) return;

    function onPhotosUpdated() {
      updatePhotoLabel(photoInput, filesLabel);
      renderPhotoPreviews(photoInput, previewsEl);
      refreshSubmitState(submitBtn);
      syncStepTrack();
    }

    function onFieldChange() {
      syncCategoryReadout(catSelect, readout);
      syncCatButtons(catSelect, catButtons);
      refreshSubmitState(submitBtn);
      syncStepTrack();
    }

    catButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var val = btn.getAttribute("data-ilan-cat") || "";
        if (catSelect) catSelect.value = val;
        onFieldChange();
      });
    });

    ["input", "change"].forEach(function (ev) {
      form.addEventListener(
        ev,
        function (e) {
          if (e.target && e.target.id === "ilanPhotos") return;
          onFieldChange();
        },
        true
      );
    });

    if (photoInput) {
      photoInput.addEventListener("change", function () {
        onPhotosUpdated();
      });
    }

    if (dropzone && photoInput) {
      var dragDepth = 0;
      dropzone.addEventListener("dragenter", function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragDepth++;
        dropzone.classList.add("is-dragover");
      });
      dropzone.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("is-dragover");
      });
      dropzone.addEventListener("dragleave", function (e) {
        e.preventDefault();
        dragDepth = Math.max(0, dragDepth - 1);
        if (dragDepth === 0) dropzone.classList.remove("is-dragover");
      });
      dropzone.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragDepth = 0;
        dropzone.classList.remove("is-dragover");
        var files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length) mergeIntoFileInput(photoInput, files);
        updatePhotoLabel(photoInput, filesLabel);
        renderPhotoPreviews(photoInput, previewsEl);
        photoInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }

    onFieldChange();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!isFormValid()) return;

      if (!window.JetleAuth || !JetleAuth.isLoggedIn()) {
        window.location.href = "login.html?next=" + encodeURIComponent("ilan-ver.html");
        return;
      }
      if (!JetleAPI.backendEnabled || !JetleAPI.backendEnabled()) {
        window.alert("Şu an yalnızca canlı API ile ilan gönderilebilir. Ayarlardan backend modunu açın.");
        return;
      }
      var token = JetleAPI.getAccessToken && JetleAPI.getAccessToken();
      if (!token) {
        window.location.href = "login.html?next=" + encodeURIComponent("ilan-ver.html");
        return;
      }

      if (submitBtn) {
        submitBtn.setAttribute("data-submitting", "1");
        submitBtn.disabled = true;
        submitBtn.textContent = "Gönderiliyor...";
      }

      var body = {
        title: (document.getElementById("ilanTitle") && document.getElementById("ilanTitle").value) || "",
        description: (document.getElementById("ilanDesc") && document.getElementById("ilanDesc").value) || "",
        price: Number((document.getElementById("ilanPrice") && document.getElementById("ilanPrice").value) || 0),
        category: (document.getElementById("ilanCategory") && document.getElementById("ilanCategory").value) || "",
        city: (document.getElementById("ilanCity") && document.getElementById("ilanCity").value) || ""
      };

      var res = JetleAPI.postPublicIlan(body);
      if (submitBtn) {
        submitBtn.removeAttribute("data-submitting");
        submitBtn.textContent = "İlan Gönder";
        refreshSubmitState(submitBtn);
      }

      if (res.ok && res.data && res.data.ok) {
        window.alert("İlan gönderildi, onay bekliyor");
        form.reset();
        catButtons.forEach(function (b) {
          b.classList.remove("is-selected");
        });
        syncCategoryReadout(catSelect, readout);
        updatePhotoLabel(photoInput, filesLabel);
        renderPhotoPreviews(photoInput, previewsEl);
        onFieldChange();
        return;
      }
      var msg = (res && res.message) || (res.data && res.data.message) || "Gönderilemedi.";
      window.alert(msg);
    });
  });
})();
