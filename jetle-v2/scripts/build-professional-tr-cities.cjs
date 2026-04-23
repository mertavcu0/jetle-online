/**
 * Mevcut tr-cities.js içeriğini okuyup:
 * - 81 ili tr-TR alfabetik sıralar
 * - Her ilin ilçelerini tr-TR alfabetik sıralar ve yinelenenleri kaldırır
 * - İstanbul / Ankara için resmi tam listeyi uygular
 * - Yaygın ASCII / yazım hatalarını DÜZELT tablosu ile düzeltir
 * Çıktı: ../tr-cities.js (global + isteğe bağlı CommonJS)
 */
/* eslint-disable no-console */
"use strict";

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "tr-cities.js");
const DEST = path.join(__dirname, "..", "tr-cities.js");

const ISTANBUL = [
  "Adalar",
  "Arnavutköy",
  "Ataşehir",
  "Avcılar",
  "Bağcılar",
  "Bahçelievler",
  "Bakırköy",
  "Başakşehir",
  "Bayrampaşa",
  "Beşiktaş",
  "Beykoz",
  "Beylikdüzü",
  "Beyoğlu",
  "Büyükçekmece",
  "Çatalca",
  "Çekmeköy",
  "Esenler",
  "Esenyurt",
  "Eyüpsultan",
  "Fatih",
  "Gaziosmanpaşa",
  "Güngören",
  "Kadıköy",
  "Kağıthane",
  "Kartal",
  "Küçükçekmece",
  "Maltepe",
  "Pendik",
  "Sancaktepe",
  "Sarıyer",
  "Silivri",
  "Sultanbeyli",
  "Sultangazi",
  "Şile",
  "Şişli",
  "Tuzla",
  "Ümraniye",
  "Üsküdar",
  "Zeytinburnu"
];

const ANKARA = [
  "Akyurt",
  "Altındağ",
  "Ayaş",
  "Bala",
  "Beypazarı",
  "Çamlıdere",
  "Çankaya",
  "Çubuk",
  "Elmadağ",
  "Etimesgut",
  "Evren",
  "Gölbaşı",
  "Güdül",
  "Haymana",
  "Kahramankazan",
  "Kalecik",
  "Keçiören",
  "Kızılcahamam",
  "Mamak",
  "Nallıhan",
  "Polatlı",
  "Pursaklar",
  "Sincan",
  "Şereflikoçhisar",
  "Yenimahalle"
];

/** Tüm veri kümesinde birebir eşleşen ilçe adı düzeltmeleri (yaygın eski transliterasyonlar) */
const DISTRICT_RENAME = {
  Karaisali: "Karaisalı",
  Pozanti: "Pozantı",
  Sariçam: "Sarıçam",
  Yumurtalik: "Yumurtalık",
  Gölbaşi: "Gölbaşı",
  Başmakçi: "Başmakçı",
  Kizilören: "Kızılören",
  Sandikli: "Sandıklı",
  Sultandaği: "Sultandağı",
  Doğubayazit: "Doğubayazıt",
  Taşliçay: "Taşlıçay",
  Gümüşhaciköy: "Gümüşhacıköy",
  Avcilar: "Avcılar",
  Bağcilar: "Bağcılar",
  Bakirköy: "Bakırköy",
  Eyüp: "Eyüpsultan",
  Kadiköy: "Kadıköy",
  Kağithane: "Kağıthane",
  Sariyer: "Sarıyer",
  Altindağ: "Altındağ",
  Beypazari: "Beypazarı",
  Çamlidere: "Çamlıdere",
  Kizilcahamam: "Kızılcahamam",
  Polatli: "Polatlı",
  Bayindir: "Bayındır",
  Kinik: "Kınık",
  Torbali: "Torbalı",
  Aliaga: "Aliağa",
  Aralik: "Aralık",
  Karakoyunlu: "Karakoyunlu",
  Altinova: "Altınova",
  Çinarcik: "Çınarcık",
  Akçakoca: "Akçakoca",
  Cumayeri: "Cumayeri",
  Kaynaşli: "Kaynaşlı",
  Yiğilca: "Yığılca",
  Iscehisar: "İscehisar",
  Ihsaniye: "İhsaniye",
  Dazkiri: "Dazkırı",
  Nallihan: "Nallıhan",
  Aydincik: "Aydıncık",
  Boğazliyan: "Boğazlıyan",
  Çandir: "Çandır",
  Çayiralan: "Çayıralan",
  Kadişehri: "Kadışehri",
  Sarikaya: "Sarıkaya",
  Yenifakili: "Yenifakılı",
  Alapli: "Alaplı",
  Ovacik: "Ovacık",
  Aralik: "Aralık",
  Akçakoca: "Akçakoca",
  Cumayeri: "Cumayeri",
  Kaynaşli: "Kaynaşlı",
  Yiğilca: "Yığılca",
  Altinova: "Altınova",
  Çinarcik: "Çınarcık",
  Karakoyunlu: "Karakoyunlu",
  Çildir: "Çıldır"
};

const PROVINCE_RENAME = {
  Adiyaman: "Adıyaman",
  Aydin: "Aydın",
  Ağri: "Ağrı",
  Balikesir: "Balıkesir",
  Çankiri: "Çankırı",
  Diyarbakir: "Diyarbakır",
  Kirklareli: "Kırklareli",
  Kirşehir: "Kırşehir",
  Şanliurfa: "Şanlıurfa",
  Kirikkale: "Kırıkkale",
  Bartin: "Bartın",
  Iğdir: "Iğdır",
  Igdir: "Iğdır",
  Sanliurfa: "Şanlıurfa",
  Canakkale: "Çanakkale",
  Corum: "Çorum",
  Elazig: "Elazığ",
  Eskisehir: "Eskişehir",
  Gumushane: "Gümüşhane",
  Kütahya: "Kütahya",
  Mugla: "Muğla",
  Nevsehir: "Nevşehir",
  Nigde: "Niğde",
  Tekirdag: "Tekirdağ",
  Usak: "Uşak",
  Kirsehir: "Kırşehir"
};

function parseExistingArray(raw) {
  var idx = raw.indexOf("const TR_CITIES");
  if (idx !== -1) {
    var eq = raw.indexOf("[", idx);
    if (eq === -1) throw new Error("const TR_CITIES sonrası [ yok");
    var depth = 0;
    for (var i = eq; i < raw.length; i++) {
      var c = raw[i];
      if (c === "[") depth++;
      else if (c === "]") {
        depth--;
        if (depth === 0) return JSON.parse(raw.slice(eq, i + 1));
      }
    }
    throw new Error("TR_CITIES dizisi kapanmadı");
  }
  var start = raw.indexOf("global.JETLE_TR_CITIES = ");
  if (start === -1) throw new Error("TR_CITIES / JETLE_TR_CITIES bulunamadı");
  var i0 = start + "global.JETLE_TR_CITIES = ".length;
  var end = raw.indexOf(";\n  var _PROVINCE_NAME_FIX", i0);
  if (end === -1) end = raw.indexOf(";\n})(typeof", i0);
  if (end === -1) throw new Error("Dizi sonu bulunamadı");
  return JSON.parse(raw.slice(i0, end));
}

function fixDistrictName(name) {
  if (DISTRICT_RENAME[name]) return DISTRICT_RENAME[name];
  return name;
}

function sortDedupeDistricts(arr) {
  const seen = new Map();
  (arr || []).forEach(function (d) {
    var fixed = fixDistrictName(String(d || "").trim());
    if (!fixed) return;
    var key = fixed.toLocaleLowerCase("tr-TR");
    if (!seen.has(key)) seen.set(key, fixed);
  });
  return Array.from(seen.values()).sort(function (a, b) {
    return a.localeCompare(b, "tr-TR", { sensitivity: "base" });
  });
}

function main() {
  const raw = fs.readFileSync(SRC, "utf8");
  var data = parseExistingArray(raw);

  var byName = {};
  data.forEach(function (row) {
    var n = String(row.name || "").trim();
    if (!n) return;
    var canon = PROVINCE_RENAME[n] || n;
    byName[canon] = row;
    row.name = canon;
  });

  var out = [];
  Object.keys(byName)
    .sort(function (a, b) {
      return a.localeCompare(b, "tr-TR", { sensitivity: "base" });
    })
    .forEach(function (prov) {
      var row = byName[prov];
      var districts = (row.districts || []).slice();
      if (prov === "İstanbul") districts = ISTANBUL.slice();
      else if (prov === "Ankara") districts = ANKARA.slice();
      out.push({
        name: prov,
        districts: sortDedupeDistricts(districts)
      });
    });

  if (out.length !== 81) {
    console.warn("Uyarı: il sayısı", out.length, "(81 olmalı)");
  }

  const json = JSON.stringify(out, null, 2);
  const banner =
    "/**\n" +
    " * Türkiye — 81 il ve tüm ilçeler (TÜİK / İçişleri güncel ilçe adlarına yakın UTF-8).\n" +
    " * Alfabetik: iller ve her ilin ilçeleri `tr-TR` sıralı; yinelenen ilçe adları kaldırıldı.\n" +
    " *\n" +
    " * Tarayıcı (klasik script): `globalThis.JETLE_TR_CITIES` + `JetleTrCities` API.\n" +
    " * ESM / TypeScript: `export const TR_CITIES` ile aynı yapıda dizi (aşağıdaki TR_CITIES).\n" +
    " *\n" +
    " * Veri üretimi: `node scripts/build-professional-tr-cities.cjs`\n" +
    " */\n";

  const body =
    banner +
    "const TR_CITIES =\n" +
    json +
    ";\n\n" +
    '(function (global) {\n' +
    '  "use strict";\n' +
    "  global.JETLE_TR_CITIES = TR_CITIES;\n" +
    "  global.TR_CITIES = TR_CITIES;\n" +
    "  global.JetleTrCities = {\n" +
    "    getAll: function () {\n" +
    "      return global.JETLE_TR_CITIES;\n" +
    "    },\n" +
    "    getProvinceNames: function () {\n" +
    "      return global.JETLE_TR_CITIES.map(function (r) {\n" +
    "        return r.name;\n" +
    "      });\n" +
    "    },\n" +
    "    getDistricts: function (provinceName) {\n" +
    "      var want = String(provinceName || \"\");\n" +
    "      for (var i = 0; i < global.JETLE_TR_CITIES.length; i++) {\n" +
    "        if (global.JETLE_TR_CITIES[i].name === want) {\n" +
    "          return (global.JETLE_TR_CITIES[i].districts || []).slice();\n" +
    "        }\n" +
    "      }\n" +
    "      return [];\n" +
    "    }\n" +
    "  };\n" +
    "})(typeof globalThis !== \"undefined\" ? globalThis : typeof window !== \"undefined\" ? window : this);\n\n" +
    "if (typeof module !== \"undefined\" && module.exports) {\n" +
    "  module.exports.TR_CITIES = TR_CITIES;\n" +
    "}\n";

  fs.writeFileSync(DEST, body, "utf8");
  var dcount = out.reduce(function (a, x) {
    return a + (x.districts && x.districts.length ? x.districts.length : 0);
  }, 0);
  console.log("Yazıldı:", DEST, "il:", out.length, "ilçe:", dcount);
}

main();
