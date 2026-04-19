/**
 * jetle-v2 — basit ilan ver formu (POST /api/ilan)
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

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    if (!window.JetleAPI) return;
    JetleAPI.init();

    var form = document.getElementById("ilanVerForm");
    var citySel = document.getElementById("ilanCity");
    if (citySel && citySel.options.length <= 1) {
      CITIES.forEach(function (c) {
        var o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        citySel.appendChild(o);
      });
    }

    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
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

      var btn = document.getElementById("ilanVerSubmit");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Gönderiliyor…";
      }

      var body = {
        title: (document.getElementById("ilanTitle") && document.getElementById("ilanTitle").value) || "",
        description: (document.getElementById("ilanDesc") && document.getElementById("ilanDesc").value) || "",
        price: Number((document.getElementById("ilanPrice") && document.getElementById("ilanPrice").value) || 0),
        category: (document.getElementById("ilanCategory") && document.getElementById("ilanCategory").value) || "",
        city: (document.getElementById("ilanCity") && document.getElementById("ilanCity").value) || ""
      };

      var res = JetleAPI.postPublicIlan(body);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "İlanı gönder";
      }

      if (res.ok && res.data && res.data.ok) {
        window.alert("İlan gönderildi, onay bekliyor");
        form.reset();
        return;
      }
      var msg = (res && res.message) || (res.data && res.data.message) || "Gönderilemedi.";
      window.alert(msg);
    });
  });
})();
