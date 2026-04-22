/**
 * JETLE v2 — vitrin kartları, filtreler, ilan detayı, şehir/ilçe yardımcıları
 */
(function () {
  "use strict";

  var CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın",
    "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı",
    "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
    "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul",
    "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya",
    "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ",
    "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak",
    "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan",
    "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
  ];

  var DISTRICTS = {
    İstanbul: ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Şile", "Şişli", "Sultanbeyli", "Sultangazi", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
    Ankara: ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kahramankazan", "Kalecik", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
    İzmir: ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
    Bursa: ["Osmangazi", "Nilüfer", "Yıldırım", "İnegöl", "Gemlik", "Mustafakemalpaşa", "Mudanya", "Orhangazi", "Yenişehir", "İznik"],
    Adana: ["Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Ceyhan", "Kozan", "İmamoğlu", "Karaisalı", "Pozantı"],
    Antalya: ["Muratpaşa", "Konyaaltı", "Kepez", "Döşemealtı", "Aksu", "Kumluca", "Manavgat", "Alanya", "Kaş", "Kemer", "Serik"],
    Konya: ["Meram", "Karatay", "Selçuklu", "Akören", "Beyşehir", "Cihanbeyli", "Ereğli", "Ilgın", "Akşehir", "Sarayönü"],
    Gaziantep: ["Şahinbey", "Şehitkamil", "Oğuzeli", "Nizip", "İslahiye", "Nurdağı", "Araban", "Yavuzeli"],
    Kocaeli: ["İzmit", "Gebze", "Darıca", "Körfez", "Gölcük", "Kartepe", "Başiskele", "Çayırova", "Derince", "Karamürsel"],
    Mersin: ["Akdeniz", "Mezitli", "Toroslar", "Yenişehir", "Tarsus", "Erdemli", "Silifke", "Anamur", "Mut"]
  };

  var CATEGORY_TREE = [
    {
      name: "Vasıta",
      q: "vasita",
      children: [
        { name: "Otomobil", slug: "vasita-otomobil", q: "otomobil" },
        { name: "Arazi, SUV & Pickup", slug: "vasita-suv", q: "suv" },
        { name: "Elektrikli Araçlar", slug: "vasita-elektrik", q: "elektrikli" },
        { name: "Motosiklet", slug: "vasita-motosiklet", q: "motosiklet" },
        { name: "Minivan & Panelvan", slug: "vasita-minivan", q: "minivan" },
        { name: "Ticari Araçlar", slug: "vasita-ticari", q: "ticari" }
      ]
    },
    {
      name: "Emlak",
      q: "emlak",
      children: [
        { name: "Konut", slug: "emlak-konut", q: "konut" },
        { name: "İş Yeri", slug: "emlak-isyeri", q: "is-yeri" },
        { name: "Arsa", slug: "emlak-arsa", q: "arsa" },
        { name: "Bina", slug: "emlak-bina", q: "bina" },
        { name: "Devre Mülk", slug: "emlak-devre", q: "devre-mulk" },
        { name: "Turistik Tesis", slug: "emlak-turistik", q: "turistik-tesis" },
        { name: "Otel", slug: "emlak-otel", q: "otel" }
      ]
    },
    {
      name: "Alışveriş",
      q: "alisveris",
      children: [
        { name: "Telefon", slug: "alisveris-telefon", q: "telefon" },
        { name: "Bilgisayar", slug: "alisveris-bilgisayar", q: "bilgisayar" },
        { name: "Ev Yaşam", slug: "alisveris-ev", q: "ev-yasam" },
        { name: "Anne Bebek", slug: "alisveris-anne", q: "anne-bebek" },
        { name: "Moda", slug: "alisveris-moda", q: "moda" }
      ]
    },
    {
      name: "Hizmetler",
      q: "hizmetler",
      children: [
        { name: "Tamir", slug: "hizmet-tamir", q: "tamir" },
        { name: "Nakliye", slug: "hizmet-nakliye", q: "nakliye" },
        { name: "Temizlik", slug: "hizmet-temizlik", q: "temizlik" },
        { name: "Özel Ders", slug: "hizmet-ders", q: "ozel-ders" },
        { name: "Organizasyon", slug: "hizmet-organizasyon", q: "organizasyon" }
      ]
    }
  ];

  /** Tek kaynak: marka → seri → model (sol menü + ilan-ver vasıta seçimi) */
  function slugifyMarketToken(val) {
    if (!val) return "";
    var map = { ı: "i", İ: "i", ğ: "g", Ğ: "g", ü: "u", Ü: "u", ş: "s", Ş: "s", ö: "o", Ö: "o", ç: "c", Ç: "c" };
    var s = String(val)
      .trim()
      .replace(/[ıİğĞüÜşŞöÖçÇ]/g, function (ch) {
        return map[ch] || ch;
      });
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function vehicleDataToOtomobilTree(vd) {
    var brandNames = Object.keys(vd).sort(function (a, b) {
      return a.localeCompare(b, "tr");
    });
    return brandNames.map(function (brandName) {
      var seriesObj = vd[brandName];
      var seriesNames = Object.keys(seriesObj).sort(function (a, b) {
        return a.localeCompare(b, "tr");
      });
      return {
        label: brandName,
        slug: slugifyMarketToken(brandName),
        series: seriesNames.map(function (serName) {
          var models = seriesObj[serName];
          return {
            label: serName,
            slug: slugifyMarketToken(serName),
            models: models.map(function (modelName) {
              return { label: modelName, slug: slugifyMarketToken(modelName) };
            })
          };
        })
      };
    });
  }

        var VEHICLE_DATA = {
  "Alfa Romeo": {
    "4C": [
      "1750 TBi",
      "Standart",
      "Üst donanım"
    ],
    "Giulia": [
      "2.0",
      "2.9 QV",
      "Sport line",
      "2.0 Turbo",
      "2.2 Diesel"
    ],
    "Giulietta": [
      "1.4 TB",
      "2.0 JTDM",
      "Sport line",
      "1.6 JTDm"
    ],
    "MiTo": [
      "1.4 TB",
      "1.3 JTDm"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Stelvio": [
      "2.0",
      "2.9 QV",
      "2.2 D",
      "2.0 Turbo",
      "2.2 Diesel"
    ],
    "Tonale": [
      "1.5 Hybrid",
      "PHEV",
      "Sport line"
    ]
  },
  "Audi": {
    "A Serisi": [
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8"
    ],
    "A1": [
      "25 TFSI",
      "30 TFSI",
      "35 TFSI"
    ],
    "A1 Allstreet": [
      "30 TFSI",
      "35 TFSI"
    ],
    "A3": [
      "30 TFSI",
      "35 TFSI",
      "35 TDI",
      "40 TDI",
      "S3"
    ],
    "A4": [
      "35 TDI",
      "40 TFSI",
      "45 TFSI",
      "35 TFSI",
      "40 TDI"
    ],
    "A4 Allroad": [
      "40 TDI",
      "45 TFSI",
      "quattro"
    ],
    "A4 Avant": [
      "35 TDI",
      "40 TFSI",
      "40 TDI",
      "45 TFSI"
    ],
    "A5": [
      "40 TFSI",
      "45 TFSI",
      "S5"
    ],
    "A6": [
      "40 TDI",
      "45 TFSI",
      "55 TFSI"
    ],
    "A6 Avant": [
      "40 TDI",
      "45 TFSI"
    ],
    "A7": [
      "45 TFSI",
      "55 TFSI",
      "S7"
    ],
    "A7 Sportback": [
      "45 TFSI",
      "50 TDI"
    ],
    "A8": [
      "50 TDI",
      "55 TFSI",
      "60 TFSI"
    ],
    "e-tron": [
      "50 quattro",
      "55 quattro",
      "S",
      "Q4 e-tron",
      "Q8 e-tron",
      "e-tron GT"
    ],
    "e-tron GT": [
      "quattro",
      "RS e-tron GT"
    ],
    "Q Serisi": [
      "Q2",
      "Q3",
      "Q5",
      "Q7",
      "Q8"
    ],
    "Q2": [
      "30 TFSI",
      "35 TFSI",
      "Sport line",
      "40 TFSI"
    ],
    "Q3": [
      "35 TFSI",
      "40 TDI",
      "45 TFSI"
    ],
    "Q4 e-tron": [
      "35",
      "40",
      "50 quattro"
    ],
    "Q5": [
      "40 TDI",
      "45 TFSI",
      "50 TDI"
    ],
    "Q7": [
      "45 TDI",
      "50 TDI",
      "55 TFSI"
    ],
    "Q8": [
      "45 TDI",
      "50 TDI",
      "55 TFSI",
      "RS Q8"
    ],
    "Q8 e-tron": [
      "50 quattro",
      "55 quattro",
      "50",
      "55"
    ],
    "Q8 Sportback e-tron": [
      "50 quattro",
      "55 quattro",
      "50",
      "55"
    ],
    "RS3": [
      "2.5 TFSI",
      "Performance",
      "Sport",
      "Sportback",
      "Sedan"
    ],
    "RS4": [
      "2.9 TFSI",
      "Avant",
      "Competition"
    ],
    "RS5": [
      "Coupe",
      "Sportback"
    ],
    "RS6": [
      "4.0 TFSI",
      "Performance",
      "GT",
      "Avant"
    ],
    "TT": [
      "40 TFSI",
      "45 TFSI",
      "TTS"
    ]
  },
  "BMW": {
    "1 Serisi": [
      "116i",
      "118i",
      "120i"
    ],
    "2 Serisi": [
      "218i",
      "220i",
      "225xe",
      "M235i"
    ],
    "2 Serisi Active Tourer": [
      "218i",
      "220i",
      "220d"
    ],
    "2 Serisi Gran Coupe": [
      "218i",
      "220d",
      "M235i"
    ],
    "3 Serisi": [
      "316i",
      "320i",
      "318d",
      "330i",
      "M3",
      "320d"
    ],
    "4 Serisi": [
      "420i",
      "430i",
      "M440i",
      "M4"
    ],
    "4 Serisi Gran Coupe": [
      "420i",
      "430i"
    ],
    "5 Serisi": [
      "520i",
      "520d",
      "530i",
      "530e",
      "540i",
      "M5"
    ],
    "6 Serisi": [
      "630i",
      "640i",
      "Gran Turismo"
    ],
    "6 Serisi Gran Turismo": [
      "630i",
      "640d",
      "620d"
    ],
    "7 Serisi": [
      "740i",
      "750i",
      "745e",
      "730d"
    ],
    "8 Serisi": [
      "840i",
      "M850i",
      "i8",
      "850i"
    ],
    "8 Serisi Gran Coupe": [
      "840i",
      "M850i"
    ],
    "i Serisi": [
      "i3",
      "i4",
      "i5",
      "i7",
      "iX"
    ],
    "i3": [
      "120 Ah",
      "135 kW",
      "Sport line",
      "s 120 Ah",
      "s"
    ],
    "i4": [
      "eDrive40",
      "M50",
      "Sport line",
      "eDrive35"
    ],
    "i5": [
      "eDrive40",
      "M60",
      "Sport line",
      "xDrive40"
    ],
    "i5 Touring": [
      "eDrive40",
      "M60"
    ],
    "i7": [
      "xDrive60",
      "M70",
      "Sport line"
    ],
    "iX": [
      "xDrive40",
      "xDrive50",
      "M60"
    ],
    "iX1": [
      "eDrive20",
      "xDrive30"
    ],
    "iX2": [
      "xDrive30",
      "M Sport"
    ],
    "M2": [
      "Competition",
      "CS",
      "Sport line",
      "Coupe"
    ],
    "M3": [
      "Competition",
      "Touring",
      "Sport line",
      "Sedan",
      "xDrive"
    ],
    "M4": [
      "Competition",
      "CSL",
      "Sport line",
      "Coupe",
      "Convertible"
    ],
    "M5": [
      "Sedan",
      "Competition",
      "CS"
    ],
    "X Serisi": [
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7"
    ],
    "X1": [
      "sDrive18i",
      "xDrive20i",
      "xDrive25e",
      "xDrive20d"
    ],
    "X2": [
      "sDrive18i",
      "M235i",
      "xDrive20d",
      "sDrive20i"
    ],
    "X3": [
      "xDrive20i",
      "xDrive30i",
      "M40i",
      "20i",
      "20d"
    ],
    "X4": [
      "xDrive20i",
      "xDrive30i",
      "M40i",
      "xDrive30d"
    ],
    "X5": [
      "xDrive40i",
      "xDrive45e",
      "M50i",
      "30d",
      "40i",
      "M50d"
    ],
    "X6": [
      "xDrive40i",
      "M50i",
      "Competition",
      "30d",
      "40i"
    ],
    "X7": [
      "xDrive40i",
      "M50i",
      "xDrive50i",
      "xDrive40d"
    ],
    "XM": [
      "Label Red",
      "Standard"
    ],
    "Z4": [
      "sDrive20i",
      "M40i",
      "M",
      "sDrive30i",
      "20i"
    ]
  },
  "BYD": {
    "Atto 3": [
      "Standard",
      "Extended",
      "Sport line",
      "Comfort",
      "Design"
    ],
    "Dolphin": [
      "44 kWh",
      "60 kWh",
      "Sport line",
      "Comfort",
      "Design"
    ],
    "Han": [
      "EV",
      "DM-i",
      "Sport line",
      "AWD"
    ],
    "Seal": [
      "RWD",
      "AWD",
      "Sport line",
      "Design",
      "Excellence",
      "Performance"
    ],
    "Seal U": [
      "Comfort",
      "Design"
    ],
    "Tang": [
      "EV",
      "DM",
      "Sport line"
    ],
    "Yuan Plus": [
      "EV",
      "Extended",
      "Sport line"
    ]
  },
  "Chery": {
    "Arrizo": [
      "1.5 T",
      "Pro",
      "Sport line"
    ],
    "Arrizo 8": [
      "Comfort",
      "Luxury"
    ],
    "Omoda 5": [
      "1.6 T",
      "EV",
      "Sport line",
      "Comfort",
      "Luxury"
    ],
    "Tiggo": [
      "Tiggo 7",
      "Tiggo 8"
    ],
    "Tiggo 4": [
      "1.5 T",
      "Pro",
      "Sport line"
    ],
    "Tiggo 5": [
      "1.5 T",
      "CVT",
      "Sport line"
    ],
    "Tiggo 5X": [
      "Comfort",
      "Luxury"
    ],
    "Tiggo 7": [
      "1.5 T",
      "Pro",
      "Sport line"
    ],
    "Tiggo 7 Pro": [
      "Comfort",
      "Luxury"
    ],
    "Tiggo 8": [
      "1.6 T",
      "Pro",
      "Sport line"
    ],
    "Tiggo 8 Pro": [
      "Luxury",
      "Intelligent"
    ]
  },
  "Chevrolet": {
    "Aveo": [
      "1.4 LT",
      "Standart",
      "Üst donanım"
    ],
    "Camaro": [
      "2.0 Turbo",
      "SS 6.2",
      "Sport line"
    ],
    "Captiva": [
      "2.0 Diesel",
      "2.2 Diesel",
      "Sport line"
    ],
    "Cruze": [
      "1.6",
      "2.0 Diesel",
      "Sport line"
    ],
    "Equinox": [
      "1.5 T",
      "2.0 T",
      "Sport line"
    ],
    "Malibu": [
      "1.5 T",
      "2.0 T",
      "Sport line"
    ],
    "Spark": [
      "1.2 LS",
      "Standart",
      "Üst donanım"
    ],
    "Trax": [
      "1.4 T",
      "1.8",
      "Sport line"
    ]
  },
  "Citroen": {
    "Berlingo": [
      "1.5 BlueHDi",
      "Standart",
      "Üst donanım",
      "Combi"
    ],
    "C-Elysee": [
      "1.2 VTi",
      "1.6 HDi",
      "1.6 VTi",
      "1.2 PureTech"
    ],
    "C3": [
      "1.2 PureTech",
      "1.5 BlueHDi",
      "Sport line"
    ],
    "C3 Aircross": [
      "1.2 PureTech",
      "1.5 BlueHDi",
      "Sport line",
      "Shine"
    ],
    "C4": [
      "1.2 PureTech",
      "Electric",
      "Sport line"
    ],
    "C5 Aircross": [
      "1.5 BlueHDi",
      "1.6 Hybrid",
      "Sport line"
    ],
    "Jumper": [
      "2.2 BlueHDi",
      "Standart",
      "Üst donanım"
    ],
    "Spacetourer": [
      "2.0 BlueHDi",
      "Electric",
      "Sport line",
      "XL"
    ]
  },
  "Dacia": {
    "Dokker": [
      "1.5 Blue dCi",
      "1.6 SCe",
      "Van",
      "1.5 dCi"
    ],
    "Duster": [
      "1.0 TCe",
      "1.3 TCe",
      "1.5 Blue dCi"
    ],
    "Express": [
      "1.5 Blue dCi",
      "1.6 SCe",
      "Sport line"
    ],
    "Jogger": [
      "1.0 ECO-G",
      "Hybrid 140",
      "Sport line"
    ],
    "Lodgy": [
      "1.5 Blue dCi",
      "1.6 SCe",
      "Sport line",
      "1.5 dCi",
      "Stepway"
    ],
    "Logan": [
      "1.0 TCe",
      "Standart",
      "Üst donanım",
      "1.0 ECO-G"
    ],
    "Sandero": [
      "1.0 SCe",
      "1.0 ECO-G",
      "Sport line"
    ],
    "Spring": [
      "Electric 45",
      "Electric 65",
      "Sport line"
    ]
  },
  "DS Automobiles": {
    "DS 3": [
      "PureTech",
      "E-Tense",
      "Sport line",
      "PureTech 130"
    ],
    "DS 3 Crossback": [
      "PureTech 130",
      "E-Tense"
    ],
    "DS 4": [
      "PureTech",
      "E-Tense",
      "Sport line",
      "PureTech 130",
      "BlueHDi 130"
    ],
    "DS 4 Crossback": [
      "PureTech",
      "BlueHDi",
      "Sport line"
    ],
    "DS 7": [
      "PureTech",
      "E-Tense",
      "Sport line",
      "BlueHDi 130",
      "E-Tense 225"
    ],
    "DS 9": [
      "PureTech",
      "E-Tense",
      "Sport line",
      "PureTech 225",
      "E-Tense 250"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ]
  },
  "Fiat": {
    "500": [
      "1.0 Hybrid",
      "1.2",
      "Sport line",
      "Electric"
    ],
    "Doblo": [
      "1.6 Multijet",
      "1.3 Multijet",
      "Sport line"
    ],
    "Ducato": [
      "2.3 Multijet",
      "2.2 JTD",
      "Electric",
      "2.2 Multijet",
      "3.0 Multijet"
    ],
    "Egea Cross": [
      "1.6 Multijet",
      "1.3 Multijet",
      "Sport line",
      "1.4 Fire"
    ],
    "Egea Hatchback": [
      "1.4 Fire",
      "1.3 Multijet",
      "Sport line",
      "1.6 Multijet"
    ],
    "Egea Sedan": [
      "1.4 Fire",
      "1.3 Multijet",
      "1.6 Multijet"
    ],
    "Fiorino": [
      "1.3 Multijet",
      "1.4 Fire",
      "Sport line"
    ],
    "Linea": [
      "1.3 Multijet",
      "1.4 Fire",
      "1.6"
    ],
    "Panda": [
      "1.0 Hybrid",
      "1.2",
      "Cross"
    ],
    "Tipo": [
      "1.4 T-Jet",
      "1.6 Multijet",
      "Egea",
      "1.4 Fire"
    ],
    "Ulysse": [
      "2.0 BlueHDi",
      "Electric"
    ]
  },
  "Ford": {
    "Bronco": [
      "2.3 EcoBoost",
      "2.7 EcoBoost",
      "Badlands",
      "Outer Banks",
      "Wildtrak"
    ],
    "Ecosport": [
      "1.0 EcoBoost",
      "1.5 TDCi"
    ],
    "Edge": [
      "2.0 EcoBoost",
      "2.0 TDCi",
      "ST-Line"
    ],
    "Explorer": [
      "3.0 EcoBoost",
      "Electric"
    ],
    "Fiesta": [
      "1.1",
      "1.0 EcoBoost",
      "1.5 TDCi"
    ],
    "Focus": [
      "1.0 EcoBoost",
      "1.5 EcoBoost",
      "2.0 EcoBlue",
      "1.5 TDCi"
    ],
    "Kuga": [
      "1.5 EcoBoost",
      "2.0 EcoBlue Hybrid",
      "Sport line",
      "2.0 EcoBlue"
    ],
    "Mondeo": [
      "2.0 EcoBoost",
      "2.0 TDCi",
      "Sport line",
      "1.5 EcoBoost"
    ],
    "Mustang": [
      "2.3 EcoBoost",
      "GT 5.0",
      "Mach-E"
    ],
    "Mustang Mach-E": [
      "Standard Range",
      "GT",
      "Long Range"
    ],
    "Puma": [
      "1.0 EcoBoost",
      "1.0 Hybrid",
      "Sport line",
      "ST-Line"
    ],
    "Ranger": [
      "2.0 EcoBlue",
      "3.2 TDCi",
      "Sport line",
      "Raptor"
    ],
    "Tourneo Connect": [
      "1.5 EcoBlue",
      "2.0 EcoBlue",
      "L2",
      "1.5 EcoBoost"
    ],
    "Tourneo Courier": [
      "1.0 EcoBoost",
      "1.5 TDCi",
      "Electric"
    ],
    "Transit": [
      "2.0 EcoBlue",
      "350 L3",
      "460 L4",
      "350 L",
      "390 L"
    ],
    "Transit Custom": [
      "320 L2",
      "340 L2",
      "350 L2"
    ]
  },
  "Honda": {
    "Accord": [
      "1.5 Turbo",
      "2.0 Hybrid",
      "Sport line",
      "1.5 VTEC Turbo"
    ],
    "City": [
      "1.5",
      "1.5 e:HEV",
      "1.0 Turbo",
      "e"
    ],
    "Civic": [
      "1.5 VTEC Turbo",
      "1.6 i-DTEC",
      "2.0 Type R",
      "e",
      "Type R"
    ],
    "Civic Hatchback": [
      "1.5 VTEC Turbo",
      "1.6 i-DTEC",
      "Sport line"
    ],
    "CR-V": [
      "1.5 VTEC",
      "2.0 e:HEV",
      "Sport line",
      "1.5 VTEC Turbo",
      "e"
    ],
    "HR-V": [
      "1.5",
      "1.5 Hybrid",
      "Sport line",
      "e"
    ],
    "Insight": [
      "1.5 Hybrid",
      "e:HEV",
      "Touring",
      "1.3 Hybrid",
      "Hybrid"
    ],
    "Jazz": [
      "1.5 e:HEV",
      "Crosstar",
      "Sport line",
      "1.3",
      "e"
    ],
    "Legend": [
      "3.5 V6",
      "Hybrid",
      "SH-AWD",
      "Hybrid SH-AWD"
    ],
    "Type R": [
      "2.0 VTEC Turbo",
      "Limited Edition",
      "Track",
      "Civic Type R",
      "Championship White"
    ],
    "ZR-V": [
      "1.5 VTEC Turbo",
      "e:HEV",
      "2.0 e"
    ]
  },
  "Hyundai": {
    "Accent Blue": [
      "1.4 MPI",
      "1.6 CRDi",
      "Sport line"
    ],
    "Bayon": [
      "1.0 T-GDI",
      "1.4 MPI",
      "Hybrid",
      "1.2 MPI"
    ],
    "Elantra": [
      "1.6 MPI",
      "1.6 CRDi",
      "Sport line"
    ],
    "Ioniq 5": [
      "58 kWh",
      "77 kWh",
      "N",
      "Standard Range",
      "Long Range",
      "125 kW",
      "AWD"
    ],
    "Ioniq 6": [
      "Long Range",
      "AWD",
      "E-GMP",
      "Standard Range"
    ],
    "i10": [
      "1.0 MPI",
      "1.2 MPI",
      "Sport line"
    ],
    "i20": [
      "1.2 MPI",
      "1.0 T-GDI",
      "Sport line"
    ],
    "i30": [
      "1.5 DPI",
      "1.6 CRDi",
      "Sport line",
      "1.5 T-GDI"
    ],
    "Kona": [
      "Electric",
      "1.0 T-GDI",
      "1.6 Hybrid"
    ],
    "Santa Fe": [
      "2.2 CRDi",
      "1.6 T-GDI Hybrid",
      "Sport line",
      "1.6 Hybrid"
    ],
    "Tucson": [
      "1.6 T-GDI",
      "1.6 CRDi",
      "Sport line",
      "Hybrid"
    ]
  },
  "Jaguar": {
    "E-Pace": [
      "P200",
      "D200"
    ],
    "F-Pace": [
      "P250",
      "P400",
      "Sport line",
      "D300"
    ],
    "F-Type": [
      "P300",
      "P450",
      "Sport line",
      "R-Dynamic",
      "Coupe",
      "Cabrio"
    ],
    "I-Pace": [
      "EV 400",
      "EV 500",
      "Sport line",
      "EV400",
      "HSE"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model grubu 2": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "XE": [
      "P250",
      "P300",
      "Sport line",
      "2.0 P250",
      "2.0 D180"
    ],
    "XF": [
      "P250",
      "D200",
      "Sport line",
      "2.0 P250",
      "2.0 D200"
    ],
    "XF Sportbrake": [
      "P250",
      "D300",
      "Sport line"
    ]
  },
  "Jeep": {
    "Avenger": [
      "1.2 Turbo",
      "Electric",
      "Sport line"
    ],
    "Cherokee": [
      "2.0 Turbo",
      "2.2 Multijet",
      "Trailhawk",
      "2.0 Diesel",
      "3.2"
    ],
    "Commander": [
      "2.0 T",
      "4xe",
      "Sport line"
    ],
    "Compass": [
      "1.3 Turbo",
      "4xe",
      "Sport line"
    ],
    "Gladiator": [
      "3.6",
      "3.0 CRD",
      "Sport line",
      "3.0 V6",
      "Rubicon"
    ],
    "Grand Cherokee": [
      "2.0 4xe",
      "3.6",
      "Sport line"
    ],
    "Grand Cherokee L": [
      "3.6",
      "5.7",
      "Sport line"
    ],
    "Renegade": [
      "1.3 Limited",
      "4xe",
      "Sport line"
    ],
    "Wrangler": [
      "2.0 Turbo",
      "Rubicon",
      "Sport line"
    ]
  },
  "Kia": {
    "Carnival": [
      "2.2 CRDi",
      "3.5 V6",
      "Hybrid"
    ],
    "Ceed": [
      "1.5 T-GDI",
      "1.6 CRDi",
      "Sport line"
    ],
    "Cerato": [
      "1.6 MPI",
      "1.6 CRDi",
      "Sport line",
      "1.6"
    ],
    "EV6": [
      "Standard",
      "GT-Line",
      "GT",
      "Standard Range",
      "Long Range"
    ],
    "EV9": [
      "Long Range",
      "GT-Line",
      "AWD"
    ],
    "Niro": [
      "Hybrid",
      "PHEV",
      "EV",
      "1.6 Hybrid"
    ],
    "Picanto": [
      "1.0 DPI",
      "1.2 DPI",
      "Sport line",
      "1.0 MPI"
    ],
    "Proceed": [
      "1.5 T-GDI",
      "GT",
      "GT-Line"
    ],
    "Rio": [
      "1.2 DPI",
      "1.4 DPI",
      "Sport line",
      "1.4 MPI"
    ],
    "Sorento": [
      "2.2 CRDi",
      "1.6 T-GDI Hybrid",
      "Sport line",
      "Hybrid"
    ],
    "Sportage": [
      "1.6 CRDi",
      "1.6 Hybrid",
      "Sport line",
      "Hybrid"
    ],
    "Stonic": [
      "1.0 T-GDI",
      "1.4 MPI",
      "Sport line"
    ],
    "XCeed": [
      "1.5 T-GDI",
      "1.6 CRDi"
    ]
  },
  "Land Rover": {
    "Defender": [
      "90 P300",
      "110 D250",
      "Sport line",
      "90",
      "110",
      "130",
      "110 P400e",
      "130 D300"
    ],
    "Defender 130": [
      "D300",
      "P400"
    ],
    "Discovery": [
      "D300",
      "P360",
      "Sport line",
      "D250",
      "P300",
      "Base",
      "HSE"
    ],
    "Discovery Sport": [
      "P200",
      "D200",
      "Sport line",
      "Base",
      "P300e"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Range Rover": [
      "P400",
      "D350",
      "P530",
      "Standard",
      "Autobiography"
    ],
    "Range Rover Evoque": [
      "P200",
      "D200",
      "Sport line",
      "Base",
      "Dynamic",
      "P300e"
    ],
    "Range Rover Sport": [
      "P360",
      "D350",
      "Sport line",
      "SE",
      "HSE",
      "P510e"
    ],
    "Range Rover Velar": [
      "P250",
      "D300",
      "Sport line",
      "Base",
      "R-Dynamic",
      "P400e"
    ]
  },
  "Lexus": {
    "CT": [
      "200h",
      "Standart",
      "Üst donanım",
      "F Sport"
    ],
    "ES": [
      "300h",
      "Standart",
      "Üst donanım",
      "Executive"
    ],
    "IS": [
      "300h",
      "Standart",
      "Üst donanım",
      "F Sport"
    ],
    "LBX": [
      "250h",
      "Hybrid",
      "Sport line"
    ],
    "LC": [
      "500",
      "500h",
      "Sport line"
    ],
    "LS": [
      "500h",
      "500",
      "Sport line",
      "Executive"
    ],
    "NX": [
      "350h",
      "450h+",
      "Sport line"
    ],
    "RX": [
      "350h",
      "500h",
      "Sport line"
    ],
    "UX": [
      "250h",
      "300e",
      "Sport line",
      "F Sport"
    ]
  },
  "Mazda": {
    "CX-3": [
      "2.0 Skyactiv-G",
      "Standart",
      "Üst donanım",
      "Prime"
    ],
    "CX-30": [
      "2.0",
      "e-Skyactiv X",
      "Sport line",
      "2.0 Skyactiv-G"
    ],
    "CX-5": [
      "2.0 Skyactiv-G",
      "2.5 Skyactiv-G",
      "Sport line"
    ],
    "CX-60": [
      "2.5",
      "PHEV",
      "Sport line"
    ],
    "Mazda2": [
      "1.5 Skyactiv-G",
      "Standart",
      "Üst donanım",
      "Prime"
    ],
    "Mazda3": [
      "2.0 Skyactiv-G",
      "e-Skyactiv X",
      "Sport line"
    ],
    "Mazda6": [
      "2.0 Skyactiv-G",
      "2.5 Skyactiv-G",
      "Sport line"
    ],
    "MX-5": [
      "1.5",
      "2.0",
      "Sport line"
    ]
  },
  "Mercedes-Benz": {
    "A Serisi": [
      "A180",
      "A200",
      "A250"
    ],
    "AMG GT": [
      "43",
      "53",
      "63",
      "63 S E Performance"
    ],
    "B Serisi": [
      "B180",
      "B200",
      "Sport line"
    ],
    "C Coupe": [
      "200",
      "300",
      "C200 Coupe",
      "C300 Coupe"
    ],
    "C Serisi": [
      "C180",
      "C200",
      "C300"
    ],
    "Citan": [
      "110 CDI",
      "112",
      "Tourer",
      "Panelvan"
    ],
    "CLA": [
      "CLA 180",
      "CLA 200",
      "CLA 250",
      "180",
      "200",
      "250 4MATIC"
    ],
    "CLA Shooting Brake": [
      "180",
      "200",
      "250 4MATIC",
      "CLA 180",
      "CLA 200"
    ],
    "CLE": [
      "200",
      "300 4MATIC",
      "450 4MATIC"
    ],
    "CLS": [
      "CLS 350",
      "CLS 450",
      "CLS 53"
    ],
    "E Coupe": [
      "200",
      "300",
      "E200 Coupe",
      "E300 Coupe"
    ],
    "E Serisi": [
      "E200",
      "E300",
      "E350de",
      "E350"
    ],
    "EQ": [
      "EQA",
      "EQB",
      "EQC",
      "EQE",
      "EQS"
    ],
    "EQA": [
      "250",
      "300 4MATIC",
      "350 4MATIC"
    ],
    "EQB": [
      "250",
      "300 4MATIC",
      "350 4MATIC"
    ],
    "EQC": [
      "400 4MATIC",
      "AMG Line",
      "Sport line",
      "Edition 1886"
    ],
    "EQE": [
      "300",
      "350+",
      "AMG 53",
      "500 4MATIC"
    ],
    "EQS": [
      "450+",
      "580 4MATIC",
      "AMG 53"
    ],
    "G Serisi": [
      "G 400 d",
      "G 500",
      "G 63",
      "G400d",
      "G63 AMG"
    ],
    "GLA": [
      "GLA 180",
      "GLA 200",
      "GLA 250",
      "GLA 220d"
    ],
    "GLB": [
      "GLB 180",
      "GLB 200",
      "GLB 35",
      "GLB 220d"
    ],
    "GLC": [
      "GLC 200",
      "GLC 300",
      "GLC 43",
      "GLC 220d"
    ],
    "GLE": [
      "GLE 300",
      "GLE 450",
      "GLE 53",
      "GLE 400",
      "GLE 300d"
    ],
    "GLS": [
      "GLS 400",
      "GLS 580",
      "GLS 63",
      "GLS 400d"
    ],
    "S Coupe": [
      "450",
      "560",
      "S500 Coupe",
      "S63 AMG"
    ],
    "S Serisi": [
      "S350",
      "S500",
      "S580e",
      "S400"
    ],
    "SL": [
      "43",
      "55",
      "63",
      "55 4MATIC+",
      "63 4MATIC+",
      "SL 43",
      "SL 63"
    ],
    "SLC": [
      "180",
      "200",
      "43"
    ],
    "Sprinter": [
      "311 CDI",
      "316 CDI",
      "519 CDI"
    ],
    "V Serisi": [
      "V 220 d",
      "V 250 d",
      "V 300 d",
      "Marco Polo",
      "V220d",
      "V250d"
    ],
    "Vito": [
      "114 CDI",
      "119 CDI"
    ]
  },
  "MG": {
    "4": [
      "EV",
      "Extended",
      "Sport line"
    ],
    "5 EV": [
      "Standard",
      "Long Range",
      "Sport line"
    ],
    "HS": [
      "1.5 T",
      "PHEV",
      "Sport line",
      "1.5 Turbo",
      "Gasoline"
    ],
    "Marvel R": [
      "EV",
      "Extended",
      "Sport line",
      "Performance",
      "Luxury"
    ],
    "MG4": [
      "Comfort",
      "Luxury",
      "Electric",
      "XPower"
    ],
    "MG5": [
      "Comfort",
      "Luxury"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "ZS": [
      "1.5",
      "EV",
      "Sport line",
      "1.0 Turbo",
      "Electric"
    ]
  },
  "Mini": {
    "Cabrio": [
      "Cooper",
      "Cooper S",
      "Sport line"
    ],
    "Clubman": [
      "Cooper",
      "Cooper S",
      "Sport line"
    ],
    "Countryman": [
      "Cooper",
      "Cooper S",
      "SE ALL4"
    ],
    "Electric": [
      "Cooper SE",
      "E",
      "Sport line"
    ],
    "Hatch": [
      "Cooper",
      "Cooper S",
      "John Cooper Works"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model grubu 2": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Paceman": [
      "Cooper",
      "Cooper S",
      "Sport line"
    ]
  },
  "Mitsubishi": {
    "ASX": [
      "1.6 MIVEC",
      "2.0 MIVEC",
      "PHEV",
      "1.6 Invite",
      "1.8 DID"
    ],
    "Eclipse Cross": [
      "1.5 Turbo",
      "PHEV",
      "Sport line"
    ],
    "L200": [
      "2.4 DI-D",
      "2.4 MIVEC",
      "Sport line"
    ],
    "Lancer": [
      "1.6 Invite",
      "1.8 Intense"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Outlander": [
      "2.0",
      "PHEV",
      "Sport line"
    ],
    "Pajero": [
      "3.2 DI-D",
      "3.8 V6"
    ],
    "Space Star": [
      "1.0",
      "1.2",
      "Sport line"
    ]
  },
  "Nissan": {
    "Ariya": [
      "63 kWh",
      "87 kWh",
      "Sport line"
    ],
    "Juke": [
      "1.0 DIG-T",
      "Standart",
      "Üst donanım",
      "1.6 Hybrid"
    ],
    "Leaf": [
      "40 kWh",
      "62 kWh",
      "Sport line"
    ],
    "Micra": [
      "1.0 IG-T",
      "1.5 dCi",
      "Sport line",
      "1.2"
    ],
    "Navara": [
      "2.3 dCi",
      "2.5",
      "Sport line",
      "Pro-4X"
    ],
    "Note": [
      "1.2 DIG-S",
      "1.5 dCi",
      "e-Power",
      "1.2"
    ],
    "Qashqai": [
      "1.3 DIG-T",
      "e-Power",
      "Sport line"
    ],
    "X-Trail": [
      "1.5 e-Power",
      "Standart",
      "Üst donanım",
      "4WD"
    ]
  },
  "Opel": {
    "Astra": [
      "1.4 Turbo",
      "1.6 CDTI",
      "Sport line"
    ],
    "Combo": [
      "1.5 CDTI",
      "1.2 Turbo",
      "Sport line",
      "1.5 Diesel",
      "Life"
    ],
    "Corsa": [
      "1.2",
      "1.2 Turbo",
      "Sport line"
    ],
    "Crossland": [
      "1.2",
      "1.2 Turbo",
      "Sport line"
    ],
    "Grandland": [
      "1.2 Turbo",
      "1.5 CDTI",
      "Sport line",
      "1.5 Diesel"
    ],
    "Insignia": [
      "1.6 CDTI",
      "2.0 Turbo",
      "Sport line"
    ],
    "Mokka": [
      "1.2 Turbo",
      "Electric",
      "Sport line"
    ],
    "Vivaro": [
      "2.0 CDTI",
      "Electric",
      "Sport line"
    ],
    "Zafira": [
      "1.6 CDTI",
      "2.0 CDTI",
      "Tourer",
      "1.5 Diesel"
    ]
  },
  "Peugeot": {
    "208": [
      "1.2 PureTech",
      "Standart",
      "Üst donanım",
      "GT"
    ],
    "308": [
      "1.2 PureTech",
      "1.5 BlueHDi",
      "Sport line"
    ],
    "508": [
      "1.5 BlueHDi",
      "1.6 Hybrid",
      "PSE",
      "1.6 PureTech"
    ],
    "2008": [
      "1.2 PureTech",
      "Electric",
      "Sport line"
    ],
    "3008": [
      "1.5 BlueHDi",
      "1.6 Hybrid",
      "Sport line"
    ],
    "5008": [
      "1.5 BlueHDi",
      "1.6 Hybrid",
      "Sport line"
    ],
    "Expert": [
      "1.5 BlueHDi",
      "2.0 BlueHDi",
      "Electric",
      "Combi"
    ],
    "Rifter": [
      "1.5 BlueHDi",
      "Electric",
      "Sport line",
      "GT Line"
    ]
  },
  "Porsche": {
    "911": [
      "Carrera",
      "Carrera S",
      "Turbo",
      "Targa",
      "GT3"
    ],
    "718 Cayman": [
      "2.0",
      "S 2.5",
      "GTS 4.0"
    ],
    "911 GT3": [
      "Touring",
      "RS"
    ],
    "911 Targa": [
      "4",
      "4S"
    ],
    "Cayenne": [
      "3.0",
      "S",
      "E-Hybrid",
      "Coupe"
    ],
    "Cayenne Coupe": [
      "3.0",
      "Turbo GT"
    ],
    "Macan": [
      "2.0",
      "S",
      "GTS"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model grubu 2": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model grubu 3": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Panamera": [
      "4",
      "4S",
      "Turbo E-Hybrid"
    ],
    "Taycan": [
      "4S",
      "Turbo",
      "Turbo S"
    ]
  },
  "Renault": {
    "Arkana": [
      "1.3 TCe",
      "E-Tech Hybrid",
      "Mild Hybrid"
    ],
    "Austral": [
      "E-Tech Hybrid",
      "1.3 TCe",
      "Sport line",
      "Mild Hybrid",
      "E-Tech"
    ],
    "Captur": [
      "1.0 TCe",
      "1.3 TCe",
      "E-Tech Hybrid",
      "E-Tech"
    ],
    "Clio": [
      "1.0 TCe",
      "1.0 SCe",
      "1.5 Blue dCi"
    ],
    "Espace": [
      "1.3 TCe",
      "E-Tech Full Hybrid",
      "E-Tech"
    ],
    "Fluence": [
      "1.5 dCi",
      "1.6 16V",
      "2.0",
      "1.6",
      "ZE"
    ],
    "Kadjar": [
      "1.3 TCe",
      "1.5 Blue dCi",
      "Sport line"
    ],
    "Koleos": [
      "2.0 dCi",
      "X-Tronic",
      "Sport line",
      "1.6 dCi"
    ],
    "Laguna": [
      "1.5 dCi",
      "2.0 dCi",
      "GT",
      "1.6"
    ],
    "Megane": [
      "1.3 TCe",
      "1.5 Blue dCi",
      "Sport line",
      "E-Tech"
    ],
    "Megane Sedan": [
      "1.3 TCe",
      "1.5 Blue dCi",
      "Sport line"
    ],
    "Scenic": [
      "1.3 TCe",
      "1.5 Blue dCi",
      "E-Tech",
      "1.5 dCi"
    ],
    "Symbol": [
      "1.0 SCe",
      "1.2 16V",
      "0.9 TCe",
      "1.2",
      "1.5 dCi"
    ],
    "Taliant": [
      "1.0 Turbo",
      "1.0 SCe",
      "Sport line",
      "1.0 TCe"
    ]
  },
  "Seat": {
    "Alhambra": [
      "1.4 TSI",
      "2.0 TDI",
      "Sport line",
      "Style"
    ],
    "Arona": [
      "1.0 TSI",
      "Standart",
      "Üst donanım",
      "Style"
    ],
    "Ateca": [
      "1.5 TSI",
      "2.0 TDI",
      "Sport line"
    ],
    "Ibiza": [
      "1.0 MPI",
      "1.0 EcoTSI",
      "Sport line"
    ],
    "Leon": [
      "1.0 eTSI",
      "1.5 TSI",
      "2.0 TDI"
    ],
    "Mii": [
      "1.0",
      "Electric",
      "Sport line"
    ],
    "Tarraco": [
      "1.5 TSI",
      "2.0 TDI",
      "Sport line"
    ],
    "Toledo": [
      "1.0 TSI",
      "1.6 TDI",
      "Sport line"
    ]
  },
  "Skoda": {
    "Enyaq": [
      "60",
      "80",
      "Sport line"
    ],
    "Fabia": [
      "1.0 MPI",
      "1.0 TSI",
      "Sport line"
    ],
    "Kamiq": [
      "1.0 TSI",
      "1.5 TSI",
      "Sport line"
    ],
    "Karoq": [
      "1.5 TSI",
      "2.0 TDI",
      "Sport line"
    ],
    "Kodiaq": [
      "1.5 TSI",
      "2.0 TDI",
      "Sport line"
    ],
    "Octavia": [
      "1.0 e-TSI",
      "1.5 TSI",
      "2.0 TDI"
    ],
    "Rapid": [
      "1.0 TSI",
      "1.4 TSI",
      "1.6 TDI"
    ],
    "Scala": [
      "1.0 TSI",
      "1.5 TSI",
      "Sport line"
    ],
    "Superb": [
      "1.5 TSI",
      "2.0 TDI",
      "Sport line"
    ]
  },
  "Subaru": {
    "BRZ": [
      "2.4",
      "Standart",
      "Üst donanım",
      "Sport"
    ],
    "Forester": [
      "2.0i e-Boxer",
      "Standart",
      "Üst donanım",
      "Premium"
    ],
    "Impreza": [
      "1.6i",
      "2.0i",
      "Sport line"
    ],
    "Legacy": [
      "2.5",
      "2.4 Turbo",
      "Sport line"
    ],
    "Levorg": [
      "1.6 GT",
      "2.0",
      "Sport line"
    ],
    "Outback": [
      "2.5i",
      "Standart",
      "Üst donanım",
      "Touring"
    ],
    "WRX": [
      "2.4 Turbo",
      "STI",
      "Sport line"
    ],
    "XV": [
      "1.6i",
      "e-Boxer",
      "Sport line"
    ]
  },
  "Suzuki": {
    "Baleno": [
      "1.2 Dualjet",
      "Standart",
      "Üst donanım",
      "CVT"
    ],
    "Celerio": [
      "1.0",
      "1.2",
      "Sport line"
    ],
    "Ignis": [
      "1.2 Dualjet",
      "Hybrid",
      "Sport line"
    ],
    "Jimny": [
      "1.5 AllGrip",
      "Standart",
      "Üst donanım",
      "Pro"
    ],
    "S-Cross": [
      "1.4 Boosterjet",
      "Hybrid",
      "Sport line"
    ],
    "Swift": [
      "1.2 Dualjet",
      "Hybrid",
      "Sport line"
    ],
    "Vitara": [
      "1.4 Boosterjet",
      "Hybrid",
      "Sport line"
    ]
  },
  "Tesla": {
    "Cybertruck": [
      "Dual Motor",
      "Tri Motor",
      "Foundation",
      "Single Motor"
    ],
    "Model 3": [
      "Standard Range",
      "Long Range",
      "Performance"
    ],
    "Model grubu 1": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model grubu 2": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model grubu 3": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model grubu 4": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model grubu 5": [
      "Standart",
      "Üst donanım",
      "Sport line"
    ],
    "Model S": [
      "Dual Motor",
      "Plaid",
      "Sport line",
      "Standard"
    ],
    "Model X": [
      "Standard",
      "Plaid"
    ],
    "Model Y": [
      "Standard Range",
      "Long Range",
      "Performance",
      "Standard"
    ],
    "Roadster": [
      "Founders",
      "Base",
      "Plaid"
    ]
  },
  "TOGG": {
    "T10F": [
      "Sedan (concept)",
      "Fastback",
      "RWD",
      "AWD"
    ],
    "T10X": [
      "V1 RWD",
      "V2 RWD",
      "V2 AWD",
      "V1 RWD Standart Menzil",
      "V1 RWD Uzun Menzil",
      "V2 RWD Uzun Menzil"
    ]
  },
  "Toyota": {
    "Auris": [
      "1.33 VVT-i",
      "1.6 Valvematic",
      "Hybrid",
      "1.33",
      "1.6",
      "1.8 Hybrid"
    ],
    "Avensis": [
      "1.6 Valvematic",
      "1.8 Valvematic",
      "2.0 D-4D",
      "1.6",
      "1.8"
    ],
    "bZ4X": [
      "Motion",
      "Vision",
      "AWD",
      "Advance",
      "Passion"
    ],
    "Camry": [
      "2.5 Hybrid",
      "3.0 V6",
      "Sport line"
    ],
    "Corolla": [
      "1.5",
      "1.8 Hybrid",
      "2.0 Hybrid",
      "1.6",
      "1.6 Vision"
    ],
    "Corolla Cross": [
      "1.8 Hybrid",
      "2.0 Hybrid",
      "Sport line",
      "Flame",
      "Passion"
    ],
    "Hilux": [
      "2.4 D-4D",
      "2.8 D-4D",
      "Sport line",
      "2.4 Diesel",
      "2.8 Diesel"
    ],
    "Hilux GR Sport": [
      "2.8 D-4D",
      "AT"
    ],
    "Land Cruiser": [
      "3.3 D",
      "3.5 V6",
      "Sport line",
      "Diesel",
      "V8",
      "Prado",
      "3.0 D-4D"
    ],
    "Prius": [
      "1.8 Hybrid",
      "2.0 Hybrid",
      "AWD-i",
      "Plug-in Hybrid",
      "Hybrid"
    ],
    "Proace City": [
      "1.5 BlueHDi",
      "Electric",
      "L2",
      "1.5 D-4D",
      "1.2 Turbo"
    ],
    "RAV4": [
      "2.5 Hybrid",
      "2.5 AWD",
      "Plug-in",
      "Adventure"
    ],
    "Verso": [
      "1.6 Valvematic",
      "1.8 Valvematic",
      "2.0 D-4D",
      "1.6",
      "1.8"
    ],
    "Yaris": [
      "1.0",
      "1.5 Hybrid",
      "Sport line",
      "Hybrid"
    ],
    "Yaris Cross": [
      "1.5 Hybrid",
      "AWD-i",
      "Sport line",
      "Adventure",
      "Hybrid Flame",
      "Hybrid Passion"
    ]
  },
  "Volkswagen": {
    "Amarok": [
      "2.0 TDI",
      "3.0 V6 TDI",
      "2.3 TSI",
      "V6"
    ],
    "Arteon": [
      "2.0 TSI",
      "2.0 TDI",
      "Sport line"
    ],
    "Arteon Shooting Brake": [
      "1.5 TSI",
      "2.0 TDI"
    ],
    "Caddy": [
      "1.5 TDI",
      "2.0 TDI",
      "1.4 TSI",
      "Life"
    ],
    "CC": [
      "1.8 TSI",
      "2.0 TSI",
      "3.6 V6",
      "1.4 TSI",
      "2.0 TDI"
    ],
    "Golf": [
      "1.0 TSI",
      "1.5 TSI",
      "2.0 GTI",
      "R"
    ],
    "Golf Variant": [
      "1.5 eTSI",
      "2.0 TDI"
    ],
    "ID.3": [
      "Pure",
      "Pro",
      "Pro S",
      "GTX"
    ],
    "ID.4": [
      "Pure",
      "Pro",
      "GTX"
    ],
    "ID.5": [
      "Pro",
      "Pro Performance",
      "GTX"
    ],
    "ID.Buzz": [
      "Cargo",
      "Pro"
    ],
    "Jetta": [
      "1.4 TSI",
      "1.5 TSI",
      "1.6 TDI"
    ],
    "Passat": [
      "1.5 eTSI",
      "2.0 TDI",
      "2.0 TSI"
    ],
    "Passat Variant": [
      "1.5 eTSI",
      "2.0 TDI"
    ],
    "Polo": [
      "1.0 MPI",
      "1.0 TSI",
      "Sport line",
      "GTI"
    ],
    "Scirocco": [
      "1.4 TSI",
      "2.0 TSI",
      "R"
    ],
    "Sharan": [
      "1.4 TSI",
      "2.0 TDI",
      "2.0 TSI"
    ],
    "T-Roc": [
      "1.0 TSI",
      "1.5 TSI",
      "Sport line",
      "R"
    ],
    "Taigo": [
      "1.0 TSI",
      "1.5 TSI",
      "Sport line",
      "R-Line"
    ],
    "Tiguan": [
      "1.5 TSI",
      "2.0 TDI",
      "Sport line",
      "R-Line"
    ],
    "Touareg": [
      "3.0 TDI",
      "3.0 TSI",
      "Sport line"
    ],
    "Touran": [
      "1.4 TSI",
      "1.5 TSI",
      "2.0 TDI"
    ],
    "Transporter": [
      "2.0 TDI",
      "2.0 TDI 4Motion",
      "2.0 TSI",
      "Long"
    ]
  },
  "Volvo": {
    "C40": [
      "Recharge Twin",
      "Recharge Single",
      "P8",
      "Recharge",
      "Twin Motor"
    ],
    "EX30": [
      "Single",
      "Twin",
      "Sport line"
    ],
    "EX90": [
      "Twin",
      "Performance",
      "Sport line"
    ],
    "S60": [
      "B4",
      "T5",
      "Sport line"
    ],
    "S90": [
      "B5",
      "T8",
      "Sport line"
    ],
    "V40": [
      "T2",
      "T3",
      "T5",
      "D2"
    ],
    "V60": [
      "B4",
      "T8",
      "Sport line",
      "Recharge"
    ],
    "V90": [
      "B5",
      "T8",
      "Sport line",
      "D4"
    ],
    "XC40": [
      "B3",
      "Recharge",
      "Sport line"
    ],
    "XC60": [
      "B5",
      "T8 Recharge",
      "Sport line"
    ],
    "XC90": [
      "B5",
      "T8 Recharge",
      "Sport line"
    ]
  }
};

  var OTOMOBIL_TREE = vehicleDataToOtomobilTree(VEHICLE_DATA);


  var VASITA_SUBCATEGORY_DATA = {
  "vasita-elektrik": {
    "Audi": {
      "A6 e-tron": [
        "Performance",
        "quattro"
      ],
      "A6 Sportback e-tron": [
        "Performance",
        "quattro"
      ],
      "e-tron": [
        "50 quattro",
        "55 quattro"
      ],
      "e-tron GT": [
        "quattro",
        "RS e-tron GT"
      ],
      "Q4 e-tron": [
        "35",
        "40",
        "50 quattro"
      ],
      "Q8 e-tron": [
        "50 quattro",
        "55 quattro"
      ],
      "Q8 Sportback e-tron": [
        "50 quattro",
        "55 quattro"
      ],
      "SQ8 e-tron": [
        "quattro",
        "Launch Edition"
      ]
    },
    "BMW": {
      "i3": [
        "120 Ah",
        "s 120 Ah"
      ],
      "i4": [
        "eDrive35",
        "eDrive40",
        "M50"
      ],
      "i5": [
        "eDrive40",
        "M60"
      ],
      "i5 Touring": [
        "eDrive40",
        "M60"
      ],
      "i7": [
        "xDrive60",
        "M70"
      ],
      "iX": [
        "xDrive40",
        "xDrive50"
      ],
      "iX1": [
        "eDrive20",
        "xDrive30"
      ],
      "iX2": [
        "xDrive30",
        "M Sport"
      ]
    },
    "BYD": {
      "Atto 3": [
        "Comfort",
        "Design"
      ],
      "Dolphin": [
        "Comfort",
        "Design"
      ],
      "Han": [
        "EV",
        "AWD"
      ],
      "Seal": [
        "Design",
        "Excellence"
      ]
    },
    "Hyundai": {
      "Inster": [
        "Standard Range",
        "Long Range"
      ],
      "Ioniq 5": [
        "125 kW",
        "160 kW AWD"
      ],
      "Ioniq 6": [
        "151 kW",
        "AWD"
      ],
      "Ioniq Electric": [
        "100 kW",
        "Premium"
      ],
      "Kona Electric": [
        "100 kW",
        "150 kW"
      ],
      "Nexo": [
        "Fuel Cell",
        "Prestige"
      ]
    },
    "Kia": {
      "EV3": [
        "Standard Range",
        "Long Range"
      ],
      "EV5": [
        "Long Range",
        "AWD"
      ],
      "EV6": [
        "Standard Range",
        "Long Range",
        "GT"
      ],
      "EV9": [
        "Long Range",
        "GT-Line"
      ],
      "Niro EV": [
        "Elegance",
        "Prestige"
      ],
      "Soul EV": [
        "Elegance",
        "Prestige"
      ]
    },
    "Mercedes-Benz": {
      "EQA": [
        "250",
        "300 4MATIC"
      ],
      "EQB": [
        "250+",
        "350 4MATIC"
      ],
      "EQC": [
        "400 4MATIC",
        "Edition 1886"
      ],
      "EQE": [
        "300",
        "350+"
      ],
      "EQS": [
        "450+",
        "580 4MATIC"
      ],
      "EQV": [
        "300",
        "Long"
      ],
      "eSprinter": [
        "Panel Van",
        "Cargo"
      ],
      "G 580 EQ": [
        "Edition One",
        "Standard"
      ]
    },
    "MG": {
      "Marvel R": [
        "Performance",
        "Luxury"
      ],
      "MG4": [
        "Comfort",
        "Luxury",
        "XPower"
      ],
      "MG5 Electric": [
        "Comfort",
        "Luxury"
      ],
      "ZS EV": [
        "Comfort",
        "Luxury"
      ]
    },
    "Tesla": {
      "Cybertruck": [
        "AWD",
        "Cyberbeast"
      ],
      "Model 3": [
        "Standard Range",
        "Long Range",
        "Performance"
      ],
      "Model S": [
        "Dual Motor",
        "Plaid"
      ],
      "Model X": [
        "Long Range",
        "Plaid"
      ],
      "Model Y": [
        "Standard Range",
        "Long Range",
        "Performance"
      ]
    }
  },
  "vasita-minivan": {
    "Citroen": {
      "Berlingo": [
        "1.5 BlueHDi",
        "Shine"
      ],
      "Jumpy": [
        "2.0 BlueHDi",
        "Combi"
      ],
      "Nemo": [
        "1.3 HDi",
        "Combi"
      ],
      "SpaceTourer": [
        "2.0 BlueHDi",
        "XL"
      ]
    },
    "Fiat": {
      "Doblo": [
        "1.6 Multijet",
        "Cargo"
      ],
      "Ducato": [
        "2.3 Multijet",
        "Minibus"
      ],
      "Fiorino": [
        "1.3 Multijet",
        "Combi"
      ],
      "Scudo": [
        "2.0 Multijet",
        "Combi"
      ]
    },
    "Ford": {
      "Tourneo Connect": [
        "1.5 EcoBlue",
        "Deluxe"
      ],
      "Tourneo Courier": [
        "1.5 TDCi",
        "Titanium"
      ],
      "Transit": [
        "2.0 EcoBlue",
        "Van"
      ],
      "Transit Custom": [
        "2.0 EcoBlue",
        "Trend"
      ]
    },
    "Peugeot": {
      "Expert": [
        "2.0 BlueHDi",
        "Combi"
      ],
      "Partner": [
        "1.5 BlueHDi",
        "Van"
      ],
      "Rifter": [
        "1.5 BlueHDi",
        "GT"
      ],
      "Traveller": [
        "2.0 BlueHDi",
        "Business"
      ]
    },
    "Renault": {
      "Express": [
        "1.5 dCi",
        "Van"
      ],
      "Kangoo": [
        "1.5 Blue dCi",
        "Touch"
      ],
      "Master": [
        "2.3 dCi",
        "Panelvan"
      ],
      "Trafic": [
        "2.0 dCi",
        "Combi"
      ]
    },
    "Volkswagen": {
      "Caddy": [
        "2.0 TDI",
        "Combi"
      ],
      "Caravelle": [
        "2.0 TDI",
        "Highline"
      ],
      "Multivan": [
        "2.0 TDI",
        "eHybrid"
      ],
      "Transporter": [
        "2.0 TDI",
        "Camper"
      ]
    }
  },
  "vasita-motosiklet": {
    "BMW Motorrad": {
      "F 750 GS": [
        "Standard",
        "Touring"
      ],
      "F 900 R": [
        "Standard",
        "Performance"
      ],
      "G 310 R": [
        "Standard",
        "Sport"
      ],
      "R 1250 GS": [
        "Triple Black",
        "Adventure"
      ]
    },
    "Honda": {
      "CB125R": [
        "Neo Sports Cafe",
        "ABS"
      ],
      "CB250R": [
        "ABS",
        "Neo Sports Cafe"
      ],
      "CBR250R": [
        "ABS",
        "Sport"
      ],
      "Forza": [
        "250",
        "350"
      ],
      "PCX": [
        "125",
        "CBS"
      ]
    },
    "Kawasaki": {
      "Ninja 250": [
        "Standard",
        "KRT"
      ],
      "Versys 650": [
        "Tourer",
        "Standard"
      ],
      "Vulcan S": [
        "Standard",
        "Tourer"
      ],
      "Z650": [
        "Standard",
        "Performance"
      ]
    },
    "KTM": {
      "790 Duke": [
        "Standard",
        "Tech Pack"
      ],
      "Adventure 390": [
        "Standard",
        "SW"
      ],
      "Duke 125": [
        "Standard",
        "ABS"
      ],
      "Duke 390": [
        "Standard",
        "Performance"
      ]
    },
    "Suzuki": {
      "Burgman 125": [
        "Street",
        "Standard"
      ],
      "Burgman 400": [
        "Standard",
        "Executive"
      ],
      "GSX-R125": [
        "ABS",
        "Sport"
      ],
      "V-Strom 650": [
        "XT",
        "Standard"
      ]
    },
    "Yamaha": {
      "MT-07": [
        "ABS",
        "Pure"
      ],
      "MT-09": [
        "Standard",
        "SP"
      ],
      "R25": [
        "ABS",
        "Connected"
      ],
      "XMAX": [
        "250",
        "300"
      ]
    }
  },
  "vasita-suv": {
    "Audi": {
      "Q2": [
        "35 TFSI",
        "Advanced"
      ],
      "Q3": [
        "35 TFSI",
        "40 TDI"
      ],
      "Q5": [
        "40 TDI",
        "45 TFSI"
      ],
      "Q7": [
        "45 TDI",
        "55 TFSI"
      ],
      "Q8": [
        "50 TDI",
        "55 TFSI"
      ],
      "SQ5": [
        "TDI",
        "TFSI"
      ],
      "SQ7": [
        "V8",
        "Performance"
      ],
      "SQ8": [
        "V8",
        "Performance"
      ]
    },
    "BMW": {
      "X1": [
        "sDrive18i",
        "xDrive20d"
      ],
      "X2": [
        "sDrive20i",
        "xDrive20d"
      ],
      "X3": [
        "20i",
        "20d",
        "M40i"
      ],
      "X4": [
        "20i",
        "20d",
        "M40i"
      ],
      "X5": [
        "30d",
        "40i"
      ],
      "X6": [
        "30d",
        "40i"
      ],
      "X7": [
        "40d",
        "40i"
      ],
      "XM": [
        "Label Red",
        "Standard"
      ]
    },
    "Ford": {
      "Bronco": [
        "Outer Banks",
        "Wildtrak"
      ],
      "EcoSport": [
        "1.0 EcoBoost",
        "1.5 TDCi"
      ],
      "Explorer": [
        "3.0 EcoBoost",
        "ST"
      ],
      "Kuga": [
        "1.5 EcoBoost",
        "2.0 EcoBlue"
      ],
      "Puma": [
        "1.0 EcoBoost",
        "ST-Line"
      ],
      "Ranger": [
        "2.0 EcoBlue",
        "Raptor"
      ]
    },
    "Hyundai": {
      "Bayon": [
        "1.0 T-GDI",
        "1.2 MPI"
      ],
      "ix35": [
        "2.0 CRDi",
        "2.0 MPI"
      ],
      "Kona": [
        "1.0 T-GDI",
        "Electric"
      ],
      "Palisade": [
        "2.2 CRDi",
        "3.8 V6"
      ],
      "Santa Fe": [
        "1.6 T-GDI Hybrid",
        "2.2 CRDi"
      ],
      "Tucson": [
        "1.6 T-GDI",
        "Hybrid"
      ],
      "Venue": [
        "1.0 T-GDI",
        "1.6 CRDi"
      ]
    },
    "Jeep": {
      "Compass": [
        "1.3 Turbo",
        "4xe"
      ],
      "Grand Cherokee": [
        "2.0 4xe",
        "3.6"
      ],
      "Renegade": [
        "1.3 Limited",
        "4xe"
      ],
      "Wrangler": [
        "Sahara",
        "Rubicon"
      ]
    },
    "Kia": {
      "Niro": [
        "Hybrid",
        "EV"
      ],
      "Seltos": [
        "1.6 CRDi",
        "1.5 MPI"
      ],
      "Sorento": [
        "1.6 Hybrid",
        "2.2 CRDi"
      ],
      "Sportage": [
        "1.6 CRDi",
        "1.6 Hybrid"
      ],
      "Stonic": [
        "1.0 T-GDI",
        "1.4 MPI"
      ],
      "Telluride": [
        "3.8 V6",
        "Prestige"
      ]
    },
    "Land Rover": {
      "Defender": [
        "90 P300",
        "110 D250",
        "110 P400e",
        "130 D300"
      ],
      "Discovery": [
        "D250",
        "D300",
        "P300"
      ],
      "Discovery Sport": [
        "P200",
        "D200",
        "P300e"
      ],
      "Range Rover": [
        "P400",
        "D350",
        "P530"
      ],
      "Range Rover Evoque": [
        "P200",
        "D200",
        "P300e"
      ],
      "Range Rover Sport": [
        "P360",
        "D350",
        "P510e"
      ],
      "Range Rover Velar": [
        "P250",
        "D300",
        "P400e"
      ]
    },
    "Mercedes-Benz": {
      "G Serisi": [
        "G 400 d",
        "G 63 AMG"
      ],
      "GLA": [
        "200",
        "200 d"
      ],
      "GLB": [
        "200",
        "220 d"
      ],
      "GLC": [
        "200",
        "220 d",
        "300"
      ],
      "GLE": [
        "300 d",
        "450"
      ],
      "GLS": [
        "400 d",
        "580"
      ]
    },
    "Nissan": {
      "Juke": [
        "1.0 DIG-T",
        "Hybrid"
      ],
      "Murano": [
        "2.5",
        "3.5 V6"
      ],
      "Navara": [
        "2.3 dCi",
        "Pro-4X"
      ],
      "Patrol": [
        "4.0 V6",
        "5.6 V8"
      ],
      "Qashqai": [
        "1.3 DIG-T",
        "e-Power"
      ],
      "X-Trail": [
        "1.5 e-Power",
        "4WD"
      ]
    },
    "Toyota": {
      "C-HR": [
        "1.2 Turbo",
        "1.8 Hybrid"
      ],
      "Corolla Cross": [
        "1.8 Hybrid",
        "Flame"
      ],
      "Hilux": [
        "2.4 D-4D",
        "2.8 D-4D",
        "GR Sport"
      ],
      "Land Cruiser": [
        "Prado",
        "3.0 D-4D"
      ],
      "RAV4": [
        "2.5 Hybrid",
        "Adventure"
      ],
      "Yaris Cross": [
        "1.5 Hybrid",
        "Adventure"
      ]
    },
    "Volkswagen": {
      "Amarok": [
        "2.0 TDI",
        "V6"
      ],
      "Atlas": [
        "2.0 TSI",
        "V6"
      ],
      "T-Roc": [
        "1.0 TSI",
        "1.5 TSI"
      ],
      "Taigo": [
        "1.0 TSI",
        "1.5 TSI"
      ],
      "Tiguan": [
        "1.5 TSI",
        "2.0 TDI"
      ],
      "Touareg": [
        "3.0 TDI",
        "3.0 TSI"
      ]
    }
  },
  "vasita-ticari": {
    "Fiat": {
      "Doblo Cargo": [
        "1.6 Multijet",
        "Maxi"
      ],
      "Ducato": [
        "2.3 Multijet",
        "Maxi"
      ],
      "Fiorino Cargo": [
        "1.3 Multijet",
        "Urban"
      ],
      "Scudo": [
        "2.0 Multijet",
        "Van"
      ]
    },
    "Ford": {
      "Cargo": [
        "1833",
        "2533"
      ],
      "F-MAX": [
        "Standard",
        "High Roof"
      ],
      "Transit": [
        "350 L",
        "390 L"
      ],
      "Transit Custom": [
        "2.0 EcoBlue",
        "Panel Van"
      ]
    },
    "Isuzu": {
      "D-Max": [
        "V-Cross",
        "Hi-Ride"
      ],
      "Novo": [
        "3.0",
        "Shuttle"
      ],
      "NPR": [
        "3.0",
        "Long"
      ],
      "NQR": [
        "3.0",
        "Long"
      ]
    },
    "Mercedes-Benz": {
      "Actros": [
        "1845",
        "1851"
      ],
      "Atego": [
        "1018",
        "1218"
      ],
      "Sprinter": [
        "316 CDI",
        "319 CDI"
      ],
      "Vito": [
        "114 CDI",
        "119 CDI"
      ]
    },
    "Renault": {
      "Kangoo Van": [
        "1.5 dCi",
        "Touch"
      ],
      "Mascott": [
        "3.0 dCi",
        "Long"
      ],
      "Master": [
        "2.3 dCi",
        "L3H2"
      ],
      "Trafic": [
        "2.0 dCi",
        "Van"
      ]
    },
    "Volkswagen": {
      "Amarok": [
        "V6",
        "PanAmericana"
      ],
      "Caddy Cargo": [
        "2.0 TDI",
        "Life"
      ],
      "Crafter": [
        "2.0 TDI",
        "Long"
      ],
      "Transporter": [
        "2.0 TDI",
        "Panel Van"
      ]
    }
  }
};

  function normalizeVehicleData(raw) {
    var out = {};
    Object.keys(raw || {}).forEach(function (brandName) {
      var serObj = raw[brandName] || {};
      var serAcc = {};
      Object.keys(serObj).forEach(function (serName) {
        var slug = slugifyMarketToken(serName);
        var key = Object.keys(serAcc).find(function (k) {
          return slugifyMarketToken(k) === slug;
        }) || serName;
        var arr = serAcc[key] || [];
        var seen = {};
        arr.concat(serObj[serName] || []).forEach(function (m) {
          var mk = slugifyMarketToken(m);
          if (!mk || seen[mk]) return;
          seen[mk] = true;
          arr.push(m);
        });
        serAcc[key] = arr;
      });
      out[brandName] = serAcc;
    });
    return out;
  }

  var VASITA_SUBCATEGORY_TREES = {
    "vasita-otomobil": OTOMOBIL_TREE,
    "vasita-suv": vehicleDataToOtomobilTree(normalizeVehicleData(VASITA_SUBCATEGORY_DATA["vasita-suv"])),
    "vasita-elektrik": vehicleDataToOtomobilTree(normalizeVehicleData(VASITA_SUBCATEGORY_DATA["vasita-elektrik"])),
    "vasita-motosiklet": vehicleDataToOtomobilTree(normalizeVehicleData(VASITA_SUBCATEGORY_DATA["vasita-motosiklet"])),
    "vasita-minivan": vehicleDataToOtomobilTree(normalizeVehicleData(VASITA_SUBCATEGORY_DATA["vasita-minivan"])),
    "vasita-ticari": vehicleDataToOtomobilTree(normalizeVehicleData(VASITA_SUBCATEGORY_DATA["vasita-ticari"]))
  };

  function getVasitaTreeBySlug(slug) {
    return VASITA_SUBCATEGORY_TREES[slug] || null;
  }


  function resolveSlugFromQuery(catQ, subQ) {
    var cq = String(catQ || "").toLowerCase();
    var sq = String(subQ || "").toLowerCase();
    if (!cq || !sq) return "";
    for (var i = 0; i < CATEGORY_TREE.length; i++) {
      var g = CATEGORY_TREE[i];
      if (g.q !== cq) continue;
      for (var j = 0; j < g.children.length; j++) {
        var ch = g.children[j];
        if (ch.q === sq) return ch.slug;
      }
    }
    return "";
  }

  function parentNameFromQuery(catQ) {
    var cq = String(catQ || "").toLowerCase();
    for (var i = 0; i < CATEGORY_TREE.length; i++) {
      if (CATEGORY_TREE[i].q === cq) return CATEGORY_TREE[i].name;
    }
    return "";
  }

  function slugToQueryParams(slug) {
    if (!slug) return null;
    for (var i = 0; i < CATEGORY_TREE.length; i++) {
      var g = CATEGORY_TREE[i];
      for (var j = 0; j < g.children.length; j++) {
        var ch = g.children[j];
        if (ch.slug === slug) return { cat: g.q, sub: ch.q };
      }
    }
    return null;
  }

  function parentQFromName(name) {
    for (var i = 0; i < CATEGORY_TREE.length; i++) {
      if (CATEGORY_TREE[i].name === name) return CATEGORY_TREE[i].q;
    }
    return "";
  }

  function syncIndexUrlFromState() {
    if (document.body.getAttribute("data-page") !== "home") return;
    try {
      var params = new URLSearchParams();
      if (state.search && String(state.search).trim()) params.set("q", String(state.search).trim());
      if (state.sellerId) params.set("seller", state.sellerId);
      if (state.sellerName) params.set("sellerName", state.sellerName);
      if (state.parentCategoryName) {
        var pq = parentQFromName(state.parentCategoryName);
        if (pq) params.set("category", pq);
      } else if (state.categorySlug) {
        var mapped = slugToQueryParams(state.categorySlug);
        if (mapped) {
          params.set("category", mapped.cat);
          params.set("subcategory", mapped.sub);
        }
      }
      if (state.brandSlug && state.categorySlug && state.categorySlug.indexOf("vasita-") === 0) {
        params.set("brand", state.brandSlug);
      }
      if (state.seriesSlug && state.categorySlug && state.categorySlug.indexOf("vasita-") === 0 && state.brandSlug) {
        params.set("series", state.seriesSlug);
      }
      if (state.modelSlug && state.categorySlug && state.categorySlug.indexOf("vasita-") === 0 && state.brandSlug && state.seriesSlug) {
        params.set("model", state.modelSlug);
      }
      if (state.sortBy && state.sortBy !== "newest") params.set("sort", state.sortBy);
      if (state.minPrice != null) params.set("minPrice", String(state.minPrice));
      if (state.maxPrice != null) params.set("maxPrice", String(state.maxPrice));
      if (state.city) params.set("city", state.city);
      if (state.district) params.set("district", state.district);
      if (state.datePreset && state.datePreset !== "all") params.set("date", state.datePreset);
      [
        ["estateSub", state.estateSubcategory],
        ["room", state.housingRoom],
        ["living", state.housingLivingRoom],
        ["gross", state.housingGross],
        ["net", state.housingNet],
        ["age", state.housingBuildingAge],
        ["floor", state.housingFloor],
        ["heat", state.housingHeating],
        ["bath", state.housingBathroom],
        ["balcony", state.housingBalcony],
        ["elevator", state.housingElevator],
        ["parking", state.housingParking],
        ["furnished", state.housingFurnished],
        ["insite", state.housingInSite],
        ["dues", state.housingDues],
        ["title", state.housingTitle],
        ["mortgage", state.housingMortgage],
        ["zoning", state.landZoning],
        ["landM2", state.landM2],
        ["emsal", state.landEmsal],
        ["gabari", state.landGabari],
        ["landMortgage", state.landMortgage],
        ["landTrade", state.landTrade],
        ["bed", state.hotelBedCount],
        ["openArea", state.hotelOpenArea],
        ["closedArea", state.hotelClosedArea],
        ["buildState", state.hotelBuildState],
        ["groundSurvey", state.hotelGroundSurvey],
        ["yearMin", state.vehicleYearMin],
        ["yearMax", state.vehicleYearMax],
        ["fuel", state.vehicleFuel],
        ["gear", state.vehicleGear],
        ["body", state.vehicleBody],
        ["drive", state.vehicleDrive],
        ["color", state.vehicleColor],
        ["condition", state.vehicleCondition],
        ["kimden", state.vehicleKimden],
        ["trade", state.vehicleTrade],
        ["damage", state.vehicleDamage],
        ["warranty", state.vehicleWarranty]
      ].forEach(function (kv) {
        if (kv[1]) params.set(kv[0], kv[1]);
      });
      if (state.vehicleKmMin != null) params.set("kmMin", String(state.vehicleKmMin));
      if (state.vehicleKmMax != null) params.set("kmMax", String(state.vehicleKmMax));
      var qs = params.toString();
      var base = window.location.pathname.indexOf("index.html") !== -1 ? "index.html" : window.location.pathname.split("/").pop() || "index.html";
      var url = base + (qs ? "?" + qs : "");
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, url);
      }
    } catch (e) {}
  }

  var marketListings = [];

  var state = {
    categorySlug: "",
    parentCategoryName: "",
    brandSlug: "",
    seriesSlug: "",
    modelSlug: "",
    search: "",
    sortBy: "newest",
    minPrice: null,
    maxPrice: null,
    city: "",
    district: "",
    datePreset: "all",
    estateSubcategory: "",
    housingRoom: "",
    housingLivingRoom: "",
    housingGross: "",
    housingNet: "",
    housingBuildingAge: "",
    housingFloor: "",
    housingFurnished: "",
    housingInSite: "",
    housingHeating: "",
    housingBathroom: "",
    housingBalcony: "",
    housingElevator: "",
    housingParking: "",
    housingDues: "",
    housingTitle: "",
    housingMortgage: "",
    landZoning: "",
    landM2: "",
    landEmsal: "",
    landGabari: "",
    landMortgage: "",
    landTrade: "",
    hotelBedCount: "",
    hotelOpenArea: "",
    hotelClosedArea: "",
    hotelBuildState: "",
    hotelGroundSurvey: "",
    vehicleYearMin: "",
    vehicleYearMax: "",
    vehicleKmMin: null,
    vehicleKmMax: null,
    vehicleFuel: "",
    vehicleGear: "",
    vehicleBody: "",
    vehicleDrive: "",
    vehicleColor: "",
    vehicleCondition: "",
    vehicleKimden: "",
    vehicleTrade: "",
    vehicleDamage: "",
    vehicleWarranty: "",
    sellerId: "",
    sellerName: ""
  };

  function favKey() {
    return JetleAPI.KEYS.FAVORITES;
  }

  function currentFavUserId() {
    var u = JetleAuth && JetleAuth.getCurrentUser ? JetleAuth.getCurrentUser() : null;
    return u && u.id ? u.id : "__guest__";
  }

  function readFavorites() {
    return JetleAPI.getFavorites(currentFavUserId());
  }

  function writeFavorites(ids) {
    var uid = currentFavUserId();
    var favs = JetleAPI.getFavorites(uid);
    if (JSON.stringify(favs) === JSON.stringify(ids)) return;
    var toRemove = favs.filter(function (x) { return ids.indexOf(x) === -1; });
    var toAdd = ids.filter(function (x) { return favs.indexOf(x) === -1; });
    toRemove.forEach(function (id) { JetleAPI.toggleFavorite(uid, id); });
    toAdd.forEach(function (id) { JetleAPI.toggleFavorite(uid, id); });
  }

  function isFavorite(id) {
    return JetleAPI.isFavorite(currentFavUserId(), id);
  }

  function toggleFavorite(id) {
    return JetleAPI.toggleFavorite(currentFavUserId(), id);
  }

  function refreshMarketData() {
    marketListings = JetleAPI.getPublicCards();
  }

  function formatPrice(n) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
  }

  function formatDate(iso) {
    var d = new Date(iso);
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(d);
  }

  function formatDateTime(iso) {
    var d = new Date(iso);
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
  }

  /** Örn. 12 Nisan 2026 */
  function formatDateLong(iso) {
    var d = new Date(iso);
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(d);
  }

  function listingMatchesDate(iso, preset) {
    if (preset === "all") return true;
    var t = new Date(iso).getTime();
    var now = Date.now();
    var day = 24 * 60 * 60 * 1000;
    if (preset === "today" || preset === "day") {
      var start = new Date();
      start.setHours(0, 0, 0, 0);
      return t >= start.getTime();
    }
    if (preset === "3days") return now - t <= 3 * day;
    if (preset === "week") return now - t <= 7 * day;
    if (preset === "month") return now - t <= 30 * day;
    return true;
  }

  function getFilteredListings() {
    var q = state.search.trim().toLowerCase();
    function resolveEstateSlug() {
      if (state.categorySlug && state.categorySlug.indexOf("emlak-") === 0) return state.categorySlug;
      var map = {
        Konut: "emlak-konut",
        "İş Yeri": "emlak-isyeri",
        Arsa: "emlak-arsa",
        Bina: "emlak-bina",
        "Devre Mülk": "emlak-devre",
        "Turistik Tesis": "emlak-turistik",
        Otel: "emlak-otel"
      };
      return map[state.estateSubcategory] || "";
    }
    function pickSpec(L, keys) {
      var groups = [L.specs || {}, L.housingSpecs || {}, L.landSpecs || {}, L.hotelSpecs || {}, L.realEstateSpecs || {}];
      for (var gi = 0; gi < groups.length; gi++) {
        var g = groups[gi];
        for (var ki = 0; ki < keys.length; ki++) {
          var v = g[keys[ki]];
          if (v != null && String(v).trim() !== "") return String(v).trim();
        }
      }
      return "";
    }
    function parseNum(val) {
      var n = Number(String(val || "").replace(/\./g, "").replace(/[^\d]/g, ""));
      return isNaN(n) ? null : n;
    }
    return marketListings.filter(function (L) {
      var isVehicleScope = (state.categorySlug && state.categorySlug.indexOf("vasita-") === 0) || state.parentCategoryName === "Vasıta";
      var estateSlug = resolveEstateSlug();
      if (state.sellerId) {
        if ((L.createdBy || "") !== state.sellerId) return false;
      } else if (state.sellerName) {
        if ((L.sellerName || "") !== state.sellerName) return false;
      }
      if (state.parentCategoryName) {
        if ((L.parentCategory || "") !== state.parentCategoryName) return false;
      } else if (state.categorySlug && L.categorySlug !== state.categorySlug) {
        return false;
      }
      if (isVehicleScope && state.brandSlug) {
        if ((L.brandSlug || "") !== state.brandSlug) return false;
      }
      if (isVehicleScope && state.seriesSlug && (L.seriesSlug || "") !== state.seriesSlug) return false;
      if (isVehicleScope && state.modelSlug && (L.modelSlug || "") !== state.modelSlug) return false;
      if (isVehicleScope) {
        var ly = parseNum(pickSpec(L, ["Yıl"]));
        var lkm = parseNum(pickSpec(L, ["KM"]));
        if (state.vehicleYearMin && ly != null && ly < Number(state.vehicleYearMin)) return false;
        if (state.vehicleYearMax && ly != null && ly > Number(state.vehicleYearMax)) return false;
        if (state.vehicleKmMin != null && lkm != null && lkm < state.vehicleKmMin) return false;
        if (state.vehicleKmMax != null && lkm != null && lkm > state.vehicleKmMax) return false;
        if (state.vehicleFuel && pickSpec(L, ["Yakıt tipi", "Yakıt"]) !== state.vehicleFuel) return false;
        if (state.vehicleGear && pickSpec(L, ["Vites"]) !== state.vehicleGear) return false;
        if (state.vehicleBody && pickSpec(L, ["Kasa tipi"]) !== state.vehicleBody) return false;
        if (state.vehicleDrive && pickSpec(L, ["Çekiş"]) !== state.vehicleDrive) return false;
        if (state.vehicleColor && pickSpec(L, ["Renk"]) !== state.vehicleColor) return false;
        if (state.vehicleCondition && pickSpec(L, ["Araç durumu"]) !== state.vehicleCondition) return false;
        if (state.vehicleKimden && pickSpec(L, ["Kimden"]) !== state.vehicleKimden) return false;
        if (state.vehicleTrade && pickSpec(L, ["Takas"]) !== state.vehicleTrade) return false;
        if (state.vehicleDamage && pickSpec(L, ["Ağır hasar kaydı", "Hasar kaydı"]) !== state.vehicleDamage) return false;
        if (state.vehicleWarranty && pickSpec(L, ["Garanti"]) !== state.vehicleWarranty) return false;
      }
      if (state.estateSubcategory && (L.subcategory || "") !== state.estateSubcategory) return false;
      if (estateSlug === "emlak-konut") {
        if (state.housingRoom && pickSpec(L, ["Oda sayısı"]) !== state.housingRoom) return false;
        if (state.housingLivingRoom && pickSpec(L, ["Salon sayısı"]) !== state.housingLivingRoom) return false;
        if (state.housingGross && pickSpec(L, ["m² brüt", "Brüt m²"]) !== state.housingGross) return false;
        if (state.housingNet && pickSpec(L, ["m² net", "Net m²"]) !== state.housingNet) return false;
        if (state.housingBuildingAge && pickSpec(L, ["Bina yaşı"]) !== state.housingBuildingAge) return false;
        if (state.housingFloor && pickSpec(L, ["Bulunduğu kat"]) !== state.housingFloor) return false;
        if (state.housingFurnished && pickSpec(L, ["Eşyalı"]) !== state.housingFurnished) return false;
        if (state.housingInSite && pickSpec(L, ["Site içerisinde", "Site içinde"]) !== state.housingInSite) return false;
        if (state.housingHeating && pickSpec(L, ["Isıtma"]) !== state.housingHeating) return false;
        if (state.housingBathroom && pickSpec(L, ["Banyo sayısı", "WC sayısı"]) !== state.housingBathroom) return false;
        if (state.housingBalcony && pickSpec(L, ["Balkon"]) !== state.housingBalcony) return false;
        if (state.housingElevator && pickSpec(L, ["Asansör"]) !== state.housingElevator) return false;
        if (state.housingParking && pickSpec(L, ["Otopark"]) !== state.housingParking) return false;
        if (state.housingDues && pickSpec(L, ["Aidat"]) !== state.housingDues) return false;
        if (state.housingTitle && pickSpec(L, ["Tapu durumu"]) !== state.housingTitle) return false;
        if (state.housingMortgage && pickSpec(L, ["Krediye uygun"]) !== state.housingMortgage) return false;
      }
      if (estateSlug === "emlak-arsa") {
        if (state.landZoning && pickSpec(L, ["İmar durumu"]) !== state.landZoning) return false;
        if (state.landM2 && pickSpec(L, ["m²"]) !== state.landM2) return false;
        if (state.landEmsal && pickSpec(L, ["KAKS (emsal)", "KAKS (Emsal)", "KAKS"]) !== state.landEmsal) return false;
        if (state.landGabari && pickSpec(L, ["Gabari"]) !== state.landGabari) return false;
        if (state.landMortgage && pickSpec(L, ["Krediye uygun"]) !== state.landMortgage) return false;
        if (state.landTrade && pickSpec(L, ["Takasa uygun", "Takas"]) !== state.landTrade) return false;
      }
      if (estateSlug === "emlak-otel" || estateSlug === "emlak-turistik") {
        if (state.hotelBedCount && pickSpec(L, ["Yatak sayısı"]) !== state.hotelBedCount) return false;
        if (state.hotelOpenArea && pickSpec(L, ["Açık alan m²", "Açık alan metre kare"]) !== state.hotelOpenArea) return false;
        if (state.hotelClosedArea && pickSpec(L, ["Kapalı alan m²", "Kapalı alan metre kare"]) !== state.hotelClosedArea) return false;
        if (state.hotelBuildState && pickSpec(L, ["Yapı durumu", "Yapının durumu"]) !== state.hotelBuildState) return false;
        if (state.hotelGroundSurvey && pickSpec(L, ["Zemin etüdü"]) !== state.hotelGroundSurvey) return false;
      }
      if (state.city && L.city !== state.city) return false;
      if (state.district && L.district !== state.district) return false;
      if (state.minPrice != null && L.price < state.minPrice) return false;
      if (state.maxPrice != null && L.price > state.maxPrice) return false;
      if (!listingMatchesDate(L.createdAt, state.datePreset)) return false;
      if (q) {
        var blob = (
          (L.searchText ||
            L.title + " " + (L.description || "") + " " + (L.categoryLabel || "") + " " + (L.parentCategory || "") + " " + (L.city || "") + " " + (L.district || "") + " " + (L.sellerName || "")
        )).toLowerCase();
        if (blob.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function getSortedListings(list) {
    function dopingPriority(L) {
      if (L.showcase) return 2;
      if (L.featured) return 1;
      return 0;
    }
    function byDopingThenDate(a, b) {
      var dp = dopingPriority(b) - dopingPriority(a);
      if (dp !== 0) return dp;
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    function numSpec(L, keys) {
      var groups = [L.specs || {}, L.realEstateSpecs || {}];
      for (var g = 0; g < groups.length; g++) {
        for (var k = 0; k < keys.length; k++) {
          var v = groups[g][keys[k]];
          if (v != null && String(v).trim() !== "") {
            var n = Number(String(v).replace(/\./g, "").replace(/[^\d]/g, ""));
            if (!isNaN(n)) return n;
          }
        }
      }
      return null;
    }
    var sorted = list.slice();
    if (state.sortBy === "price-asc") return sorted.sort(function (a, b) { return byDopingThenDate(a, b) || (a.price - b.price); });
    if (state.sortBy === "price-desc") return sorted.sort(function (a, b) { return byDopingThenDate(a, b) || (b.price - a.price); });
    if (state.sortBy === "year-desc") return sorted.sort(function (a, b) { return byDopingThenDate(a, b) || ((numSpec(b, ["Yıl"]) || 0) - (numSpec(a, ["Yıl"]) || 0)); });
    if (state.sortBy === "km-asc") return sorted.sort(function (a, b) { return byDopingThenDate(a, b) || ((numSpec(a, ["KM"]) || 999999999) - (numSpec(b, ["KM"]) || 999999999)); });
    return sorted.sort(byDopingThenDate);
  }

  function populateCitySelect(selectId, opts) {
    opts = opts || {};
    var sel = document.getElementById(selectId || "citySelect");
    if (!sel) return;
    var keep = sel.value;
    sel.innerHTML = "";
    var first = document.createElement("option");
    first.value = "";
    first.textContent = opts.placeholder != null ? opts.placeholder : sel.id === "citySelect" ? "Tüm şehirler" : "Şehir seçin";
    sel.appendChild(first);
    CITIES.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      sel.appendChild(o);
    });
    if (keep) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === keep) {
          sel.value = keep;
          break;
        }
      }
    }
  }

  function fillDistrictSelect(citySelectId, districtSelectId) {
    var cEl = document.getElementById(citySelectId);
    var dEl = document.getElementById(districtSelectId);
    if (!cEl || !dEl) return;
    var city = cEl.value;
    var keep = dEl.value;
    while (dEl.firstChild) dEl.removeChild(dEl.firstChild);
    var p = document.createElement("option");
    p.value = "";
    p.textContent = city ? "İlçe seçin" : "Önce şehir seçin";
    dEl.appendChild(p);
    var list = DISTRICTS[city] || [];
    if (city && !list.length) list = ["Merkez"];
    list.forEach(function (d) {
      var o = document.createElement("option");
      o.value = d;
      o.textContent = d;
      dEl.appendChild(o);
    });
    if (keep) dEl.value = keep;
  }

  function slugifyListingTitle(title) {
    var map = {
      ı: "i",
      İ: "i",
      ğ: "g",
      Ğ: "g",
      ü: "u",
      Ü: "u",
      ş: "s",
      Ş: "s",
      ö: "o",
      Ö: "o",
      ç: "c",
      Ç: "c"
    };
    var s = String(title || "")
      .trim()
      .replace(/[ıİğĞüÜşŞöÖçÇ]/g, function (ch) {
        return map[ch] || ch;
      })
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return (s || "ilan").slice(0, 80);
  }

  function buildListingDetailUrl(id, title) {
    return "ilan-detay.html?id=" + encodeURIComponent(id) + "&slug=" + encodeURIComponent(slugifyListingTitle(title));
  }

  function expandVasitaState() {
    if (state.parentCategoryName === "Vasıta") return true;
    if (state.categorySlug && state.categorySlug.indexOf("vasita-") === 0) return true;
    if (state.brandSlug || state.seriesSlug || state.modelSlug) return true;
    return false;
  }

  function expandVehicleBranchState(slug) {
    return (
      state.categorySlug === slug ||
      !!state.brandSlug ||
      !!state.seriesSlug ||
      !!state.modelSlug
    );
  }

  function groupIsOpen(group) {
    if (state.parentCategoryName === group.name && !state.categorySlug) return true;
    for (var i = 0; i < group.children.length; i++) {
      if (group.children[i].slug === state.categorySlug) return true;
    }
    return false;
  }

  function catTreeLeafHref(groupQ, ch) {
    return "index.html?category=" + encodeURIComponent(groupQ) + "&subcategory=" + encodeURIComponent(ch.q);
  }

  function buildLeafLink(group, ch) {
    var a = document.createElement("a");
    a.href = catTreeLeafHref(group.q, ch);
    a.className = "cat-tree__link cat-tree__link--sub";
    if (state.categorySlug === ch.slug && !state.brandSlug && !state.seriesSlug && !state.modelSlug) {
      a.classList.add("is-active");
    }
    a.textContent = ch.name;
    return a;
  }

  function vasitaBrandBaseHref(group, ch, brandSlug) {
    return catTreeLeafHref(group.q, ch) + "&brand=" + encodeURIComponent(brandSlug);
  }

  function brandNavShouldOpen(brand) {
    return state.brandSlug === brand.slug;
  }

  function seriesNavShouldOpen(brandSlug, ser) {
    return state.brandSlug === brandSlug && (state.seriesSlug === ser.slug || !!state.modelSlug);
  }

  function buildSeriesSubtree(group, ch, brandB, ser, brandBaseHref) {
    var seriesHref = brandBaseHref + "&series=" + encodeURIComponent(ser.slug);
    var serOpen = seriesNavShouldOpen(brandB.slug, ser);

    var wrap = document.createElement("div");
    wrap.className = "cat-tree__node cat-tree__node--series" + (serOpen ? " is-open" : "");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat-tree__toggle cat-tree__toggle--series";
    btn.setAttribute("aria-expanded", serOpen ? "true" : "false");
    var c0 = document.createElement("span");
    c0.className = "cat-tree__caret";
    c0.setAttribute("aria-hidden", "true");
    var lb = document.createElement("span");
    lb.className = "cat-tree__label";
    lb.textContent = ser.label;
    btn.appendChild(c0);
    btn.appendChild(lb);
    if (
      state.categorySlug === ch.slug &&
      state.brandSlug === brandB.slug &&
      state.seriesSlug === ser.slug &&
      !state.modelSlug
    ) {
      btn.classList.add("is-active");
    }
    wrap.appendChild(btn);

    var nest = document.createElement("div");
    nest.className = "cat-tree__nest cat-tree__nest--models";

    var allSer = document.createElement("a");
    allSer.href = seriesHref;
    allSer.className = "cat-tree__link cat-tree__link--series-all";
    allSer.textContent = "Tüm " + ser.label;
    if (
      state.categorySlug === ch.slug &&
      state.brandSlug === brandB.slug &&
      state.seriesSlug === ser.slug &&
      !state.modelSlug
    ) {
      allSer.classList.add("is-active");
    }
    nest.appendChild(allSer);

    ser.models.forEach(function (mod) {
      var ma = document.createElement("a");
      ma.href = seriesHref + "&model=" + encodeURIComponent(mod.slug);
      ma.className = "cat-tree__link cat-tree__link--model";
      ma.textContent = mod.label;
      if (
        state.categorySlug === ch.slug &&
        state.brandSlug === brandB.slug &&
        state.seriesSlug === ser.slug &&
        state.modelSlug === mod.slug
      ) {
        ma.classList.add("is-active");
      }
      nest.appendChild(ma);
    });
    wrap.appendChild(nest);
    return wrap;
  }

  function buildBrandSubtree(group, ch, brandB) {
    var brandBaseHref = vasitaBrandBaseHref(group, ch, brandB.slug);
    var bOpen = brandNavShouldOpen(brandB);

    var wrap = document.createElement("div");
    wrap.className = "cat-tree__node cat-tree__node--brand" + (bOpen ? " is-open" : "");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat-tree__toggle cat-tree__toggle--brand";
    btn.setAttribute("aria-expanded", bOpen ? "true" : "false");
    var c0 = document.createElement("span");
    c0.className = "cat-tree__caret";
    c0.setAttribute("aria-hidden", "true");
    var lb = document.createElement("span");
    lb.className = "cat-tree__label";
    lb.textContent = brandB.label;
    btn.appendChild(c0);
    btn.appendChild(lb);
    if (
      state.categorySlug === ch.slug &&
      state.brandSlug === brandB.slug &&
      !state.seriesSlug &&
      !state.modelSlug
    ) {
      btn.classList.add("is-active");
    }
    wrap.appendChild(btn);

    var nest = document.createElement("div");
    nest.className = "cat-tree__nest cat-tree__nest--series-list";

    var allBrand = document.createElement("a");
    allBrand.href = brandBaseHref;
    allBrand.className = "cat-tree__link cat-tree__link--brand-all";
    allBrand.textContent = "Tüm " + brandB.label;
    if (
      state.categorySlug === ch.slug &&
      state.brandSlug === brandB.slug &&
      !state.seriesSlug &&
      !state.modelSlug
    ) {
      allBrand.classList.add("is-active");
    }
    nest.appendChild(allBrand);

    brandB.series.forEach(function (ser) {
      nest.appendChild(buildSeriesSubtree(group, ch, brandB, ser, brandBaseHref));
    });
    wrap.appendChild(nest);
    return wrap;
  }

  function buildVasitaSubcategoryBranch(group, ch, tree) {
    var node = document.createElement("div");
    node.className = "cat-tree__node cat-tree__node--otomobil" + (expandVehicleBranchState(ch.slug) ? " is-open" : "");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat-tree__toggle cat-tree__toggle--sub";
    btn.setAttribute("aria-expanded", expandVehicleBranchState(ch.slug) ? "true" : "false");
    var caret = document.createElement("span");
    caret.className = "cat-tree__caret";
    caret.setAttribute("aria-hidden", "true");
    var lab = document.createElement("span");
    lab.className = "cat-tree__label";
    lab.textContent = ch.name;
    btn.appendChild(caret);
    btn.appendChild(lab);
    if (
      state.categorySlug === ch.slug &&
      !state.brandSlug &&
      !state.seriesSlug &&
      !state.modelSlug
    ) {
      btn.classList.add("is-active");
    }
    node.appendChild(btn);

    var brandNest = document.createElement("div");
    brandNest.className = "cat-tree__nest cat-tree__nest--brands";

    var allOto = document.createElement("a");
    allOto.href = catTreeLeafHref(group.q, ch);
    allOto.className = "cat-tree__link cat-tree__link--all-sub";
    if (
      state.categorySlug === ch.slug &&
      !state.brandSlug &&
      !state.seriesSlug &&
      !state.modelSlug
    ) {
      allOto.classList.add("is-active");
    }
    allOto.textContent = "Tüm " + ch.name;
    brandNest.appendChild(allOto);

    tree.forEach(function (brandB) {
      brandNest.appendChild(buildBrandSubtree(group, ch, brandB));
    });
    node.appendChild(brandNest);
    return node;
  }

  function buildExpandableGroup(group) {
    var open = groupIsOpen(group);
    var wrap = document.createElement("div");
    wrap.className = "cat-tree__node cat-tree__node--root" + (open ? " is-open" : "");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat-tree__toggle";
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    var caret = document.createElement("span");
    caret.className = "cat-tree__caret";
    caret.setAttribute("aria-hidden", "true");
    var lab = document.createElement("span");
    lab.className = "cat-tree__label";
    lab.textContent = group.name;
    btn.appendChild(caret);
    btn.appendChild(lab);
    if (state.parentCategoryName === group.name && !state.categorySlug) btn.classList.add("is-active");
    wrap.appendChild(btn);

    var nest = document.createElement("div");
    nest.className = "cat-tree__nest";
    group.children.forEach(function (ch) {
      nest.appendChild(buildLeafLink(group, ch));
    });
    wrap.appendChild(nest);
    return wrap;
  }

  function buildVasitaTreeNode(group) {
    var wrap = document.createElement("div");
    wrap.className = "cat-tree__node cat-tree__node--root" + (expandVasitaState() ? " is-open" : "");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat-tree__toggle";
    btn.setAttribute("aria-expanded", expandVasitaState() ? "true" : "false");
    var caret = document.createElement("span");
    caret.className = "cat-tree__caret";
    caret.setAttribute("aria-hidden", "true");
    var lab = document.createElement("span");
    lab.className = "cat-tree__label";
    lab.textContent = group.name;
    btn.appendChild(caret);
    btn.appendChild(lab);
    if (state.parentCategoryName === "Vasıta" && !state.categorySlug) btn.classList.add("is-active");
    wrap.appendChild(btn);

    var nest = document.createElement("div");
    nest.className = "cat-tree__nest";
    group.children.forEach(function (ch) {
      var tree = getVasitaTreeBySlug(ch.slug);
      if (tree) {
        nest.appendChild(buildVasitaSubcategoryBranch(group, ch, tree));
      } else {
        nest.appendChild(buildLeafLink(group, ch));
      }
    });
    wrap.appendChild(nest);
    return wrap;
  }

  function buildCategoryNav() {
    var nav = document.getElementById("categoryNav");
    if (!nav) return;
    nav.className = "category-nav category-tree";
    while (nav.firstChild) nav.removeChild(nav.firstChild);

    var allActive =
      !state.categorySlug &&
      !state.parentCategoryName &&
      !state.brandSlug &&
      !state.seriesSlug &&
      !state.modelSlug;
    var all = document.createElement("a");
    all.href = "index.html";
    all.className = "cat-tree__link cat-tree__link--root" + (allActive ? " is-active" : "");
    all.textContent = "Tüm kategoriler";
    nav.appendChild(all);

    CATEGORY_TREE.forEach(function (group) {
      if (group.name === "Vasıta") {
        nav.appendChild(buildVasitaTreeNode(group));
      } else {
        nav.appendChild(buildExpandableGroup(group));
      }
    });
  }

  function listingIdHash(id) {
    var s = String(id || "");
    var n = 0;
    for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
    return n;
  }

  function isListingCreatedToday(iso) {
    if (!iso) return false;
    try {
      var d = new Date(iso);
      var t = new Date();
      return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
    } catch (e) {
      return false;
    }
  }

  /** ACİL / Fiyat düştü / Bugün — deterministik, kart başına tutarlı */
  function listingCardFlairs(L) {
    var h = listingIdHash(L.id);
    var urgent = !!L.urgent;
    var priceDrop = h % 13 === 0;
    var today = isListingCreatedToday(L.createdAt);
    return { urgent: urgent, priceDrop: priceDrop, today: today };
  }

  function createListingCard(L) {
    var card = document.createElement("article");
    card.className = "listing-card" + (L.showcase ? " listing-card--showcase" : "") + (L.featured ? " listing-card--featured" : "") + (L.highlight ? " listing-card--highlight" : "");
    card.setAttribute("data-listing-id", L.id);

    var premiumBadges = [];
    if (L.showcase) premiumBadges.push("VİTRİN");
    if (L.featured) premiumBadges.push("ÖNE ÇIKAN");
    if (L.sponsored) premiumBadges.push("Sponsorlu");
    if (premiumBadges.length) {
      var pWrap = document.createElement("div");
      pWrap.className = "listing-card__premium";
      premiumBadges.forEach(function (name) {
        var b = document.createElement("span");
        b.className = "listing-card__badge listing-card__badge--premium";
        b.textContent = name;
        pWrap.appendChild(b);
      });
      card.appendChild(pWrap);
    }

    if (L.sellerType === "Mağaza") {
      var badge = document.createElement("span");
      badge.className = "listing-card__badge listing-card__badge--store";
      badge.textContent = "Mağaza";
      card.appendChild(badge);
    }

    var fav = document.createElement("button");
    fav.type = "button";
    fav.className = "btn-icon listing-card__fav" + (isFavorite(L.id) ? " is-fav" : "");
    fav.setAttribute("aria-label", "Favorilere ekle");
    fav.setAttribute("data-fav-id", L.id);
    fav.textContent = isFavorite(L.id) ? "★" : "☆";
    card.appendChild(fav);

    var link = document.createElement("a");
    link.className = "listing-card__link";
    link.href = buildListingDetailUrl(L.id, L.title);

    var media = document.createElement("div");
    media.className = "listing-card__media";
    var img = document.createElement("img");
    img.src = (L.thumb || L.image) || "";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 480;
    img.height = 360;
    media.appendChild(img);
    link.appendChild(media);

    var body = document.createElement("div");
    body.className = "listing-card__body";

    var fl = listingCardFlairs(L);
    var flairRow = document.createElement("div");
    flairRow.className = "listing-card__flair-row";
    if (fl.urgent) {
      var u = document.createElement("span");
      u.className = "listing-card__flair listing-card__flair--urgent";
      u.textContent = "ACİL";
      flairRow.appendChild(u);
    }
    if (fl.priceDrop) {
      var pd = document.createElement("span");
      pd.className = "listing-card__flair listing-card__flair--pricedrop";
      pd.textContent = "Fiyat düştü";
      flairRow.appendChild(pd);
    }
    if (fl.today) {
      var td = document.createElement("span");
      td.className = "listing-card__flair listing-card__flair--today";
      td.textContent = "Bugün eklendi";
      flairRow.appendChild(td);
    }
    if (flairRow.childNodes.length) body.appendChild(flairRow);

    var price = document.createElement("div");
    price.className = "listing-card__price";
    price.textContent = formatPrice(L.price);
    body.appendChild(price);

    var title = document.createElement("h3");
    title.className = "listing-card__title";
    title.textContent = L.title;
    body.appendChild(title);

    var meta = document.createElement("div");
    meta.className = "listing-card__meta";
    meta.textContent = [L.city, L.district].filter(Boolean).join(" · ") + " · " + formatDate(L.createdAt);
    body.appendChild(meta);

    var cat = document.createElement("div");
    cat.className = "listing-card__cat";
    cat.textContent = L.parentCategory + " › " + L.categoryLabel + " · " + L.sellerType;
    body.appendChild(cat);

    var priceHint = document.createElement("p");
    priceHint.className = "listing-card__price-hint";
    priceHint.textContent = "Fiyat güncel";
    body.appendChild(priceHint);

    if (L.parentCategory === "Vasıta") {
      var vx = document.createElement("p");
      vx.className = "listing-card__vasita-note";
      vx.textContent = "Pazarlık payı olabilir";
      body.appendChild(vx);
    }

    var desc = document.createElement("p");
    desc.className = "listing-card__desc";
    desc.textContent = L.description;
    body.appendChild(desc);

    link.appendChild(body);
    card.appendChild(link);

    return card;
  }

  function clearEl(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function renderFeatured() {
    var row = document.getElementById("featuredRow");
    if (!row) return;
    clearEl(row);
    var list = getFilteredListings()
      .filter(function (L) {
        return L.featured;
      })
      .slice(0, 4);
    if (!list.length) {
      var empty = document.createElement("div");
      empty.className = "empty-panel";
      empty.textContent = "Öne çıkan ilan bulunmuyor.";
      row.appendChild(empty);
      return;
    }
    list.forEach(function (L) {
      row.appendChild(createListingCard(L));
    });
  }

  function renderShowcase() {
    var row = document.getElementById("showcaseRow");
    if (!row) return;
    clearEl(row);
    var list = getFilteredListings()
      .filter(function (L) {
        return L.showcase;
      })
      .slice(0, 6);
    if (!list.length) {
      var empty = document.createElement("div");
      empty.className = "empty-panel";
      empty.textContent = "Vitrin alanında ilan yok.";
      row.appendChild(empty);
      return;
    }
    list.forEach(function (L) {
      row.appendChild(createListingCard(L));
    });
  }

  function renderSponsored() {
    var row = document.getElementById("sponsoredRow");
    if (!row) return;
    clearEl(row);
    var list = getFilteredListings()
      .filter(function (L) {
        return L.sponsored;
      })
      .slice(0, 3);
    if (!list.length) {
      var empty = document.createElement("div");
      empty.className = "empty-panel";
      empty.textContent = "Aktif sponsorlu ilan yok.";
      row.appendChild(empty);
      return;
    }
    list.forEach(function (L) {
      row.appendChild(createListingCard(L));
    });
  }

  function renderNew() {
    var row = document.getElementById("newRow");
    if (!row) return;
    clearEl(row);
    var sorted = getFilteredListings().sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    sorted.slice(0, 4).forEach(function (L) {
      row.appendChild(createListingCard(L));
    });
  }

  function renderGrid() {
    var grid = document.getElementById("listingsGrid");
    var info = document.getElementById("resultsInfo");
    var emptyBox = document.getElementById("emptyResults");
    if (!grid) return;
    if (typeof window !== "undefined" && window.__JETLE_USE_HOME_API_LISTINGS__ && document.body && document.body.getAttribute("data-page") === "home") {
      return;
    }
    clearEl(grid);
    var list = getSortedListings(getFilteredListings());
    if (info) {
      var suffix = "";
      if (state.sellerId) suffix = " — bu satıcının ilanları";
      else if (state.sellerName) suffix = " — \"" + state.sellerName + "\" ilanları";
      else if (state.categorySlug === "vasita-otomobil") {
        if (state.modelSlug && state.seriesSlug && state.brandSlug) suffix = " — marka / seri / model";
        else if (state.seriesSlug && state.brandSlug) suffix = " — marka / seri";
        else if (state.brandSlug) suffix = " — seçili marka";
      }
      info.textContent = "Toplam " + list.length + " ilan bulundu" + suffix;
    }
    if (emptyBox) emptyBox.hidden = list.length > 0;
    var emptyTitle = document.getElementById("emptyResultsTitle");
    var emptySub = document.getElementById("emptyResultsSub");
    if (emptyTitle && emptySub) {
      if (list.length === 0 && (!marketListings || marketListings.length === 0)) {
        emptyTitle.textContent = "Henüz ilan yok";
        emptySub.textContent =
          "Onaylı ilan bulunmuyor. İlk ilanı siz verebilir veya filtreleri sıfırlayarak tekrar deneyebilirsiniz.";
      } else if (list.length === 0) {
        emptyTitle.textContent = "İlan bulunamadı";
        emptySub.textContent =
          "Seçtiğiniz kriterlere uygun onaylı ilan yok. Filtreleri genişletin veya aramayı değiştirin.";
      }
    }
    list.forEach(function (L, idx) {
      grid.appendChild(createListingCard(L));
      if (idx === 2 && window.JetleAds && typeof JetleAds.createInlineCardElement === "function") {
        var adNode = JetleAds.createInlineCardElement();
        if (adNode) grid.appendChild(adNode);
      }
    });
  }

  function syncFilterForm() {
    var minP = document.getElementById("minPrice");
    var maxP = document.getElementById("maxPrice");
    var city = document.getElementById("citySelect");
    var date = document.getElementById("dateFilter");
    var district = document.getElementById("districtSelect");
    var sort = document.getElementById("sortSelect");
    var estateSub = document.getElementById("estateSubcategoryFilter");
    var room = document.getElementById("housingRoomFilter");
    var living = document.getElementById("housingLivingRoomFilter");
    var gross = document.getElementById("housingGrossFilter");
    var furnished = document.getElementById("housingFurnishedFilter");
    var inSite = document.getElementById("housingSiteFilter");
    var heating = document.getElementById("housingHeatingFilter");
    var mortgage = document.getElementById("housingMortgageFilter");
    var zoning = document.getElementById("landZoningFilter");
    var landM2 = document.getElementById("landM2Filter");
    var landEmsal = document.getElementById("landEmsalFilter");
    var landGabari = document.getElementById("landGabariFilter");
    var landMortgage = document.getElementById("landMortgageFilter");
    var landTrade = document.getElementById("landTradeFilter");
    var net = document.getElementById("housingNetFilter");
    var age = document.getElementById("housingAgeFilter");
    var floor = document.getElementById("housingFloorFilter");
    var bath = document.getElementById("housingBathroomFilter");
    var balcony = document.getElementById("housingBalconyFilter");
    var elevator = document.getElementById("housingElevatorFilter");
    var parking = document.getElementById("housingParkingFilter");
    var dues = document.getElementById("housingDuesFilter");
    var title = document.getElementById("housingTitleFilter");
    var bed = document.getElementById("hotelBedFilter");
    var openArea = document.getElementById("hotelOpenAreaFilter");
    var closedArea = document.getElementById("hotelClosedAreaFilter");
    var buildState = document.getElementById("hotelBuildStateFilter");
    var groundSurvey = document.getElementById("hotelGroundSurveyFilter");
    var vBrand = document.getElementById("filterVehicleBrand");
    var vSeries = document.getElementById("filterVehicleSeries");
    var vModel = document.getElementById("filterVehicleModel");
    var yearMin = document.getElementById("filterYearMin");
    var yearMax = document.getElementById("filterYearMax");
    var kmMin = document.getElementById("filterKmMin");
    var kmMax = document.getElementById("filterKmMax");
    var fuel = document.getElementById("filterFuel");
    var gear = document.getElementById("filterGear");
    var body = document.getElementById("filterBody");
    var drive = document.getElementById("filterDrive");
    var color = document.getElementById("filterColor");
    var cond = document.getElementById("filterVehicleState");
    var kimden = document.getElementById("filterSellerFrom");
    var trade = document.getElementById("filterTrade");
    var dmg = document.getElementById("filterDamage");
    var war = document.getElementById("filterWarranty");
    if (minP) minP.value = state.minPrice != null ? String(state.minPrice) : "";
    if (maxP) maxP.value = state.maxPrice != null ? String(state.maxPrice) : "";
    if (city) city.value = state.city;
    syncDistrictFilter();
    if (district) district.value = state.district;
    if (date) date.value = state.datePreset;
    if (sort) sort.value = state.sortBy;
    if (estateSub) estateSub.value = state.estateSubcategory;
    if (room) room.value = state.housingRoom;
    if (living) living.value = state.housingLivingRoom;
    if (gross) gross.value = state.housingGross;
    if (furnished) furnished.value = state.housingFurnished;
    if (inSite) inSite.value = state.housingInSite;
    if (heating) heating.value = state.housingHeating;
    if (mortgage) mortgage.value = state.housingMortgage;
    if (zoning) zoning.value = state.landZoning;
    if (landM2) landM2.value = state.landM2;
    if (landEmsal) landEmsal.value = state.landEmsal;
    if (landGabari) landGabari.value = state.landGabari;
    if (landMortgage) landMortgage.value = state.landMortgage;
    if (landTrade) landTrade.value = state.landTrade;
    if (net) net.value = state.housingNet;
    if (age) age.value = state.housingBuildingAge;
    if (floor) floor.value = state.housingFloor;
    if (bath) bath.value = state.housingBathroom;
    if (balcony) balcony.value = state.housingBalcony;
    if (elevator) elevator.value = state.housingElevator;
    if (parking) parking.value = state.housingParking;
    if (dues) dues.value = state.housingDues;
    if (title) title.value = state.housingTitle;
    if (bed) bed.value = state.hotelBedCount;
    if (openArea) openArea.value = state.hotelOpenArea;
    if (closedArea) closedArea.value = state.hotelClosedArea;
    if (buildState) buildState.value = state.hotelBuildState;
    if (groundSurvey) groundSurvey.value = state.hotelGroundSurvey;
    if (vBrand) vBrand.value = state.brandSlug;
    if (vSeries) vSeries.value = state.seriesSlug;
    if (vModel) vModel.value = state.modelSlug;
    if (yearMin) yearMin.value = state.vehicleYearMin;
    if (yearMax) yearMax.value = state.vehicleYearMax;
    if (kmMin) kmMin.value = state.vehicleKmMin != null ? String(state.vehicleKmMin) : "";
    if (kmMax) kmMax.value = state.vehicleKmMax != null ? String(state.vehicleKmMax) : "";
    if (fuel) fuel.value = state.vehicleFuel;
    if (gear) gear.value = state.vehicleGear;
    if (body) body.value = state.vehicleBody;
    if (drive) drive.value = state.vehicleDrive;
    if (color) color.value = state.vehicleColor;
    if (cond) cond.value = state.vehicleCondition;
    if (kimden) kimden.value = state.vehicleKimden;
    if (trade) trade.value = state.vehicleTrade;
    if (dmg) dmg.value = state.vehicleDamage;
    if (war) war.value = state.vehicleWarranty;
    syncHousingFilterVisibility();
    syncVehicleFilterVisibility();
    syncVehicleFilterSelects();
  }

  function readFilterForm() {
    var minP = document.getElementById("minPrice");
    var maxP = document.getElementById("maxPrice");
    var city = document.getElementById("citySelect");
    var date = document.getElementById("dateFilter");
    var district = document.getElementById("districtSelect");
    var sort = document.getElementById("sortSelect");
    var estateSub = document.getElementById("estateSubcategoryFilter");
    var room = document.getElementById("housingRoomFilter");
    var living = document.getElementById("housingLivingRoomFilter");
    var gross = document.getElementById("housingGrossFilter");
    var furnished = document.getElementById("housingFurnishedFilter");
    var inSite = document.getElementById("housingSiteFilter");
    var heating = document.getElementById("housingHeatingFilter");
    var mortgage = document.getElementById("housingMortgageFilter");
    var zoning = document.getElementById("landZoningFilter");
    var landM2 = document.getElementById("landM2Filter");
    var landEmsal = document.getElementById("landEmsalFilter");
    var landGabari = document.getElementById("landGabariFilter");
    var landMortgage = document.getElementById("landMortgageFilter");
    var landTrade = document.getElementById("landTradeFilter");
    var net = document.getElementById("housingNetFilter");
    var age = document.getElementById("housingAgeFilter");
    var floor = document.getElementById("housingFloorFilter");
    var bath = document.getElementById("housingBathroomFilter");
    var balcony = document.getElementById("housingBalconyFilter");
    var elevator = document.getElementById("housingElevatorFilter");
    var parking = document.getElementById("housingParkingFilter");
    var dues = document.getElementById("housingDuesFilter");
    var title = document.getElementById("housingTitleFilter");
    var bed = document.getElementById("hotelBedFilter");
    var openArea = document.getElementById("hotelOpenAreaFilter");
    var closedArea = document.getElementById("hotelClosedAreaFilter");
    var buildState = document.getElementById("hotelBuildStateFilter");
    var groundSurvey = document.getElementById("hotelGroundSurveyFilter");
    var vBrand = document.getElementById("filterVehicleBrand");
    var vSeries = document.getElementById("filterVehicleSeries");
    var vModel = document.getElementById("filterVehicleModel");
    var yearMin = document.getElementById("filterYearMin");
    var yearMax = document.getElementById("filterYearMax");
    var kmMin = document.getElementById("filterKmMin");
    var kmMax = document.getElementById("filterKmMax");
    var fuel = document.getElementById("filterFuel");
    var gear = document.getElementById("filterGear");
    var body = document.getElementById("filterBody");
    var drive = document.getElementById("filterDrive");
    var color = document.getElementById("filterColor");
    var cond = document.getElementById("filterVehicleState");
    var kimden = document.getElementById("filterSellerFrom");
    var trade = document.getElementById("filterTrade");
    var dmg = document.getElementById("filterDamage");
    var war = document.getElementById("filterWarranty");
    state.minPrice = minP && minP.value !== "" ? Number(minP.value) : null;
    state.maxPrice = maxP && maxP.value !== "" ? Number(maxP.value) : null;
    state.city = city && city.value ? city.value : "";
    state.district = district && district.value ? district.value : "";
    state.datePreset = date && date.value ? date.value : "all";
    state.sortBy = sort && sort.value ? sort.value : "newest";
    state.estateSubcategory = estateSub && estateSub.value ? estateSub.value : "";
    state.housingRoom = room && room.value ? room.value : "";
    state.housingLivingRoom = living && living.value ? living.value : "";
    state.housingGross = gross && gross.value ? gross.value : "";
    state.housingFurnished = furnished && furnished.value ? furnished.value : "";
    state.housingInSite = inSite && inSite.value ? inSite.value : "";
    state.housingHeating = heating && heating.value ? heating.value : "";
    state.housingMortgage = mortgage && mortgage.value ? mortgage.value : "";
    state.landZoning = zoning && zoning.value ? zoning.value : "";
    state.landM2 = landM2 && landM2.value ? landM2.value : "";
    state.landEmsal = landEmsal && landEmsal.value ? landEmsal.value : "";
    state.landGabari = landGabari && landGabari.value ? landGabari.value : "";
    state.landMortgage = landMortgage && landMortgage.value ? landMortgage.value : "";
    state.landTrade = landTrade && landTrade.value ? landTrade.value : "";
    state.housingNet = net && net.value ? net.value : "";
    state.housingBuildingAge = age && age.value ? age.value : "";
    state.housingFloor = floor && floor.value ? floor.value : "";
    state.housingBathroom = bath && bath.value ? bath.value : "";
    state.housingBalcony = balcony && balcony.value ? balcony.value : "";
    state.housingElevator = elevator && elevator.value ? elevator.value : "";
    state.housingParking = parking && parking.value ? parking.value : "";
    state.housingDues = dues && dues.value ? dues.value : "";
    state.housingTitle = title && title.value ? title.value : "";
    state.hotelBedCount = bed && bed.value ? bed.value : "";
    state.hotelOpenArea = openArea && openArea.value ? openArea.value : "";
    state.hotelClosedArea = closedArea && closedArea.value ? closedArea.value : "";
    state.hotelBuildState = buildState && buildState.value ? buildState.value : "";
    state.hotelGroundSurvey = groundSurvey && groundSurvey.value ? groundSurvey.value : "";
    state.vehicleYearMin = yearMin && yearMin.value ? yearMin.value : "";
    state.vehicleYearMax = yearMax && yearMax.value ? yearMax.value : "";
    state.vehicleKmMin = kmMin && kmMin.value !== "" ? Number(kmMin.value) : null;
    state.vehicleKmMax = kmMax && kmMax.value !== "" ? Number(kmMax.value) : null;
    state.vehicleFuel = fuel && fuel.value ? fuel.value : "";
    state.vehicleGear = gear && gear.value ? gear.value : "";
    state.vehicleBody = body && body.value ? body.value : "";
    state.vehicleDrive = drive && drive.value ? drive.value : "";
    state.vehicleColor = color && color.value ? color.value : "";
    state.vehicleCondition = cond && cond.value ? cond.value : "";
    state.vehicleKimden = kimden && kimden.value ? kimden.value : "";
    state.vehicleTrade = trade && trade.value ? trade.value : "";
    state.vehicleDamage = dmg && dmg.value ? dmg.value : "";
    state.vehicleWarranty = war && war.value ? war.value : "";
    state.brandSlug = vBrand && vBrand.value ? vBrand.value : "";
    state.seriesSlug = vSeries && vSeries.value ? vSeries.value : "";
    state.modelSlug = vModel && vModel.value ? vModel.value : "";
  }

  function syncHousingFilterVisibility() {
    var group = document.getElementById("housingFilterGroup");
    if (!group) return;
    var show = (state.categorySlug && state.categorySlug.indexOf("emlak-") === 0) || state.parentCategoryName === "Emlak";
    if (show) group.removeAttribute("hidden");
    else group.setAttribute("hidden", "");
    if (!show) {
      state.housingRoom = "";
      state.housingLivingRoom = "";
      state.housingGross = "";
      state.housingFurnished = "";
      state.housingInSite = "";
      state.housingHeating = "";
      state.housingMortgage = "";
      state.landZoning = "";
      state.landM2 = "";
      state.landEmsal = "";
      state.landGabari = "";
      state.landMortgage = "";
      state.landTrade = "";
      state.hotelOpenArea = "";
      state.hotelClosedArea = "";
      state.hotelBuildState = "";
      state.hotelGroundSurvey = "";
      state.estateSubcategory = "";
      var ids = ["estateSubcategoryFilter", "housingRoomFilter", "housingGrossFilter", "housingFurnishedFilter", "housingSiteFilter", "housingHeatingFilter", "housingMortgageFilter", "landZoningFilter"];
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = "";
      });
    }
    var sub = state.categorySlug || "";
    if (!sub && state.estateSubcategory) {
      var subMap = {
        Konut: "emlak-konut",
        "İş Yeri": "emlak-isyeri",
        Arsa: "emlak-arsa",
        Bina: "emlak-bina",
        "Devre Mülk": "emlak-devre",
        "Turistik Tesis": "emlak-turistik",
        Otel: "emlak-otel"
      };
      sub = subMap[state.estateSubcategory] || "";
    }
    var showHousing = !sub || sub === "emlak-konut";
    var showHotel = sub === "emlak-otel" || sub === "emlak-turistik";
    var showArsa = sub === "emlak-arsa";
    function setFieldVisible(id, visible) {
      var el = document.getElementById(id);
      if (!el) return;
      var box = el.closest(".field");
      if (!box) return;
      box.hidden = !visible;
    }
    [
      "housingRoomFilter", "housingLivingRoomFilter", "housingGrossFilter", "housingNetFilter", "housingAgeFilter",
      "housingFloorFilter", "housingHeatingFilter", "housingBathroomFilter", "housingBalconyFilter", "housingElevatorFilter",
      "housingParkingFilter", "housingFurnishedFilter", "housingSiteFilter", "housingDuesFilter", "housingMortgageFilter", "housingTitleFilter"
    ].forEach(function (id) { setFieldVisible(id, showHousing); });
    ["landZoningFilter", "landM2Filter", "landEmsalFilter", "landGabariFilter", "landMortgageFilter", "landTradeFilter"].forEach(function (id) {
      setFieldVisible(id, showArsa);
    });
    ["hotelBedFilter", "hotelOpenAreaFilter", "hotelClosedAreaFilter", "hotelBuildStateFilter", "hotelGroundSurveyFilter"].forEach(function (id) {
      setFieldVisible(id, showHotel);
    });
    syncFilterAccordionVisibility();
  }

  function getActiveVehicleTree() {
    if (!state.categorySlug || state.categorySlug.indexOf("vasita-") !== 0) return null;
    return getVasitaTreeBySlug(state.categorySlug);
  }

  function fillSelectWithOptions(el, values, placeholder) {
    if (!el) return;
    var keep = el.value;
    el.innerHTML = "";
    var p = document.createElement("option");
    p.value = "";
    p.textContent = placeholder || "Tümü";
    el.appendChild(p);
    (values || []).forEach(function (v) {
      var value = "";
      var label = "";
      if (v && typeof v === "object") {
        value = String(v.value != null ? v.value : "");
        label = String(v.label != null ? v.label : value);
      } else {
        value = String(v);
        label = value;
      }
      var o = document.createElement("option");
      o.value = value;
      o.textContent = label;
      el.appendChild(o);
    });
    var hasKeep = (values || []).some(function (v) {
      if (v && typeof v === "object") return String(v.value != null ? v.value : "") === keep;
      return String(v) === keep;
    });
    if (keep && hasKeep) el.value = keep;
  }

  function syncFilterAccordionVisibility() {
    var vg = document.getElementById("vehicleFilterGroup");
    var vac = document.getElementById("vehicleFilterAccordion");
    if (vac) {
      if (vg && vg.hasAttribute("hidden")) vac.setAttribute("hidden", "");
      else vac.removeAttribute("hidden");
    }
    var hg = document.getElementById("housingFilterGroup");
    var hac = document.getElementById("housingFilterAccordion");
    if (hac) {
      if (hg && hg.hasAttribute("hidden")) hac.setAttribute("hidden", "");
      else hac.removeAttribute("hidden");
    }
  }

  var CHIP_SORT_LABELS = {
    newest: "En yeni",
    "price-asc": "Fiyat artan",
    "price-desc": "Fiyat azalan",
    "year-desc": "Yıla göre",
    "km-asc": "KM (düşük → yüksek)"
  };
  var CHIP_DATE_LABELS = { day: "Son 24 saat", "3days": "Son 3 gün", week: "Son 7 gün", month: "Son 30 gün" };

  function hasVehicleExtraFilters() {
    return !!(
      state.vehicleYearMin ||
      state.vehicleYearMax ||
      state.vehicleKmMin != null ||
      state.vehicleKmMax != null ||
      state.vehicleFuel ||
      state.vehicleGear ||
      state.vehicleBody ||
      state.vehicleDrive ||
      state.vehicleColor ||
      state.vehicleCondition ||
      state.vehicleKimden ||
      state.vehicleTrade ||
      state.vehicleDamage ||
      state.vehicleWarranty
    );
  }

  function hasEmlakExtraFilters() {
    return !!(
      state.estateSubcategory ||
      state.housingRoom ||
      state.housingLivingRoom ||
      state.housingGross ||
      state.housingNet ||
      state.housingBuildingAge ||
      state.housingFloor ||
      state.housingHeating ||
      state.housingBathroom ||
      state.housingBalcony ||
      state.housingElevator ||
      state.housingParking ||
      state.housingFurnished ||
      state.housingInSite ||
      state.housingDues ||
      state.housingMortgage ||
      state.housingTitle ||
      state.landZoning ||
      state.landM2 ||
      state.landEmsal ||
      state.landGabari ||
      state.landMortgage ||
      state.landTrade ||
      state.hotelBedCount ||
      state.hotelOpenArea ||
      state.hotelClosedArea ||
      state.hotelBuildState ||
      state.hotelGroundSurvey
    );
  }

  function removeFilterChip(chip) {
    if (chip === "sort") state.sortBy = "newest";
    else if (chip === "minPrice") state.minPrice = null;
    else if (chip === "maxPrice") state.maxPrice = null;
    else if (chip === "city") {
      state.city = "";
      state.district = "";
    } else if (chip === "district") state.district = "";
    else if (chip === "date") state.datePreset = "all";
    else if (chip === "search") state.search = "";
    else if (chip === "vehicleTree") {
      state.brandSlug = "";
      state.seriesSlug = "";
      state.modelSlug = "";
    } else if (chip === "vehicleExtra") {
      state.vehicleYearMin = "";
      state.vehicleYearMax = "";
      state.vehicleKmMin = null;
      state.vehicleKmMax = null;
      state.vehicleFuel = "";
      state.vehicleGear = "";
      state.vehicleBody = "";
      state.vehicleDrive = "";
      state.vehicleColor = "";
      state.vehicleCondition = "";
      state.vehicleKimden = "";
      state.vehicleTrade = "";
      state.vehicleDamage = "";
      state.vehicleWarranty = "";
    } else if (chip === "emlak") {
      state.estateSubcategory = "";
      state.housingRoom = "";
      state.housingLivingRoom = "";
      state.housingGross = "";
      state.housingNet = "";
      state.housingBuildingAge = "";
      state.housingFloor = "";
      state.housingHeating = "";
      state.housingBathroom = "";
      state.housingBalcony = "";
      state.housingElevator = "";
      state.housingParking = "";
      state.housingFurnished = "";
      state.housingInSite = "";
      state.housingDues = "";
      state.housingMortgage = "";
      state.housingTitle = "";
      state.landZoning = "";
      state.landM2 = "";
      state.landEmsal = "";
      state.landGabari = "";
      state.landMortgage = "";
      state.landTrade = "";
      state.hotelBedCount = "";
      state.hotelOpenArea = "";
      state.hotelClosedArea = "";
      state.hotelBuildState = "";
      state.hotelGroundSurvey = "";
    }
    syncFilterForm();
    syncDistrictFilter();
    syncVehicleFilterSelects();
    syncHousingFilterVisibility();
    syncVehicleFilterVisibility();
    syncFilterAccordionVisibility();
    var si = document.getElementById("headerSearchInput");
    if (si && chip === "search") si.value = "";
    buildCategoryNav();
    renderFeatured();
    renderShowcase();
    renderSponsored();
    renderNew();
    renderGrid();
    syncIndexUrlFromState();
    renderActiveFilterTags();
  }

  function renderActiveFilterTags() {
    var mount = document.getElementById("homeFilterActiveTags");
    if (!mount) return;
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    var frag = document.createDocumentFragment();
    function addChip(id, label) {
      var span = document.createElement("span");
      span.className = "home-filter-tag";
      span.setAttribute("data-filter-chip", id);
      var t = document.createElement("span");
      t.className = "home-filter-tag__text";
      t.textContent = label;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "home-filter-tag__remove";
      btn.setAttribute("aria-label", label + " filtresini kaldır");
      btn.textContent = "×";
      span.appendChild(t);
      span.appendChild(btn);
      frag.appendChild(span);
    }
    if (state.sortBy && state.sortBy !== "newest") addChip("sort", "Sıralama: " + (CHIP_SORT_LABELS[state.sortBy] || state.sortBy));
    if (state.minPrice != null && !isNaN(state.minPrice)) addChip("minPrice", "Min " + formatPrice(Number(state.minPrice)));
    if (state.maxPrice != null && !isNaN(state.maxPrice)) addChip("maxPrice", "Max " + formatPrice(Number(state.maxPrice)));
    if (state.city) addChip("city", state.city);
    if (state.district) addChip("district", state.district);
    if (state.datePreset && state.datePreset !== "all") addChip("date", CHIP_DATE_LABELS[state.datePreset] || state.datePreset);
    if (state.search && String(state.search).trim()) addChip("search", "Arama: " + String(state.search).trim().slice(0, 28));
    if (state.brandSlug || state.seriesSlug || state.modelSlug) {
      var b = document.getElementById("filterVehicleBrand");
      var s = document.getElementById("filterVehicleSeries");
      var m = document.getElementById("filterVehicleModel");
      var parts = [];
      if (state.brandSlug && b && b.selectedOptions[0]) parts.push(b.selectedOptions[0].textContent);
      if (state.seriesSlug && s && s.selectedOptions[0]) parts.push(s.selectedOptions[0].textContent);
      if (state.modelSlug && m && m.selectedOptions[0]) parts.push(m.selectedOptions[0].textContent);
      addChip("vehicleTree", "Araç: " + (parts.length ? parts.join(" · ") : "Seçili"));
    }
    if (hasVehicleExtraFilters()) addChip("vehicleExtra", "Araç detayı");
    if (hasEmlakExtraFilters()) addChip("emlak", "Emlak / arsa");
    if (!frag.childNodes.length) {
      mount.hidden = true;
      return;
    }
    mount.appendChild(frag);
    mount.hidden = false;
  }

  function syncVehicleFilterVisibility() {
    var box = document.getElementById("vehicleFilterGroup");
    if (!box) return;
    var show = !!getActiveVehicleTree();
    if (show) box.removeAttribute("hidden");
    else box.setAttribute("hidden", "");
    if (!show) {
      state.brandSlug = "";
      state.seriesSlug = "";
      state.modelSlug = "";
      state.vehicleYearMin = "";
      state.vehicleYearMax = "";
      state.vehicleKmMin = null;
      state.vehicleKmMax = null;
      state.vehicleFuel = "";
      state.vehicleGear = "";
      state.vehicleBody = "";
      state.vehicleDrive = "";
      state.vehicleColor = "";
      state.vehicleCondition = "";
      state.vehicleKimden = "";
      state.vehicleTrade = "";
      state.vehicleDamage = "";
      state.vehicleWarranty = "";
    }
    syncFilterAccordionVisibility();
  }

  function syncVehicleFilterSelects() {
    var tree = getActiveVehicleTree();
    var bSel = document.getElementById("filterVehicleBrand");
    var sSel = document.getElementById("filterVehicleSeries");
    var mSel = document.getElementById("filterVehicleModel");
    var yearMin = document.getElementById("filterYearMin");
    var yearMax = document.getElementById("filterYearMax");
    if (!bSel || !sSel || !mSel) return;
    if (!tree) {
      fillSelectWithOptions(bSel, [], "Tümü");
      fillSelectWithOptions(sSel, [], "Tümü");
      fillSelectWithOptions(mSel, [], "Tümü");
      sSel.disabled = true;
      mSel.disabled = true;
      return;
    }
    var brands = tree.map(function (b) { return { slug: b.slug, label: b.label, series: b.series }; });
    var brandOptions = brands.map(function (b) { return { value: b.slug, label: b.label }; });
    fillSelectWithOptions(bSel, brandOptions, "Tümü");
    var bObj = brands.find(function (b) { return b.slug === state.brandSlug; });
    var series = bObj ? bObj.series : [];
    var seriesOptions = series.map(function (s) { return { value: s.slug, label: s.label }; });
    fillSelectWithOptions(sSel, seriesOptions, "Tümü");
    sSel.disabled = !bObj;
    var sObj = series.find(function (s) { return s.slug === state.seriesSlug; });
    var modelOptions = sObj ? sObj.models.map(function (m) { return { value: m.slug, label: m.label }; }) : [];
    fillSelectWithOptions(mSel, modelOptions, "Tümü");
    mSel.disabled = !sObj;

    var fuelVals = ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik", "Benzin & LPG"];
    var gearVals = ["Manuel", "Otomatik", "Yarı Otomatik"];
    var bodyVals = ["Sedan", "Hatchback", "SUV", "Coupe", "Cabrio", "Station Wagon", "Pick-up", "Panelvan"];
    var driveVals = ["Önden Çekiş", "Arkadan İtiş", "4x4", "AWD"];
    var colorVals = ["Beyaz", "Siyah", "Gri", "Gümüş", "Mavi", "Kırmızı", "Yeşil", "Kahverengi", "Sarı"];
    fillSelectWithOptions(document.getElementById("filterFuel"), fuelVals, "Tümü");
    fillSelectWithOptions(document.getElementById("filterGear"), gearVals, "Tümü");
    fillSelectWithOptions(document.getElementById("filterBody"), bodyVals, "Tümü");
    fillSelectWithOptions(document.getElementById("filterDrive"), driveVals, "Tümü");
    fillSelectWithOptions(document.getElementById("filterColor"), colorVals, "Tümü");
    fillSelectWithOptions(document.getElementById("filterVehicleState"), ["Sıfır", "İkinci El"], "Tümü");
    fillSelectWithOptions(document.getElementById("filterSellerFrom"), ["Sahibinden", "Mağazadan", "Yetkili Bayiden"], "Tümü");
    if (yearMin && yearMax && !yearMin.options.length) {
      var years = [];
      for (var y = 2026; y >= 1990; y--) years.push(String(y));
      fillSelectWithOptions(yearMin, years, "Yok");
      fillSelectWithOptions(yearMax, years, "Yok");
    } else if (yearMin && yearMin.options.length <= 1) {
      var ys = [];
      for (var y2 = 2026; y2 >= 1990; y2--) ys.push(String(y2));
      fillSelectWithOptions(yearMin, ys, "Yok");
      fillSelectWithOptions(yearMax, ys, "Yok");
    }
  }

  function syncDistrictFilter() {
    fillDistrictSelect("citySelect", "districtSelect");
    var district = document.getElementById("districtSelect");
    if (district) district.disabled = !state.city;
  }

  function clearSellerFilter() {
    state.sellerId = "";
    state.sellerName = "";
  }

  function setCategoryFilter(childSlug, parentName) {
    state.categorySlug = childSlug || "";
    state.parentCategoryName = parentName || "";
    state.brandSlug = "";
    state.seriesSlug = "";
    state.modelSlug = "";
    syncHousingFilterVisibility();
    syncVehicleFilterVisibility();
    syncVehicleFilterSelects();
    clearSellerFilter();
    buildCategoryNav();
    renderFeatured();
    renderNew();
    renderGrid();
    syncIndexUrlFromState();
  }

  function setCategorySlug(slug) {
    setCategoryFilter(slug || "", "");
  }

  function setSearchQuery(q) {
    state.search = q || "";
    clearSellerFilter();
    renderFeatured();
    renderNew();
    renderGrid();
    syncIndexUrlFromState();
    try {
      window.dispatchEvent(new CustomEvent("jetle-home-api-search", { detail: { q: state.search } }));
    } catch (e0) {}
  }

  function applyFilters() {
    readFilterForm();
    renderFeatured();
    renderNew();
    renderGrid();
    syncIndexUrlFromState();
    renderActiveFilterTags();
  }

  function resetFilters() {
    state.categorySlug = "";
    state.parentCategoryName = "";
    state.minPrice = null;
    state.maxPrice = null;
    state.city = "";
    state.district = "";
    state.datePreset = "all";
    state.sortBy = "newest";
    state.estateSubcategory = "";
    state.housingRoom = "";
    state.housingLivingRoom = "";
    state.housingGross = "";
    state.housingNet = "";
    state.housingBuildingAge = "";
    state.housingFloor = "";
    state.housingHeating = "";
    state.housingBathroom = "";
    state.housingBalcony = "";
    state.housingElevator = "";
    state.housingParking = "";
    state.housingFurnished = "";
    state.housingInSite = "";
    state.housingDues = "";
    state.housingMortgage = "";
    state.housingTitle = "";
    state.landZoning = "";
    state.landM2 = "";
    state.landEmsal = "";
    state.landGabari = "";
    state.landMortgage = "";
    state.landTrade = "";
    state.hotelBedCount = "";
    state.hotelOpenArea = "";
    state.hotelClosedArea = "";
    state.hotelBuildState = "";
    state.hotelGroundSurvey = "";
    state.vehicleYearMin = "";
    state.vehicleYearMax = "";
    state.vehicleKmMin = null;
    state.vehicleKmMax = null;
    state.vehicleFuel = "";
    state.vehicleGear = "";
    state.vehicleBody = "";
    state.vehicleDrive = "";
    state.vehicleColor = "";
    state.vehicleCondition = "";
    state.vehicleKimden = "";
    state.vehicleTrade = "";
    state.vehicleDamage = "";
    state.vehicleWarranty = "";
    state.brandSlug = "";
    state.seriesSlug = "";
    state.modelSlug = "";
    clearSellerFilter();
    syncFilterForm();
    renderFeatured();
    renderNew();
    renderGrid();
    syncIndexUrlFromState();
    renderActiveFilterTags();
  }

  function handleFilterControlChange(id) {
    if (id === "citySelect") {
      state.city = document.getElementById("citySelect").value || "";
      state.district = "";
      syncDistrictFilter();
      return;
    }
    if (id === "filterVehicleBrand") {
      state.brandSlug = document.getElementById("filterVehicleBrand").value || "";
      state.seriesSlug = "";
      state.modelSlug = "";
      syncVehicleFilterSelects();
      return;
    }
    if (id === "filterVehicleSeries") {
      state.seriesSlug = document.getElementById("filterVehicleSeries").value || "";
      state.modelSlug = "";
      syncVehicleFilterSelects();
      return;
    }
    if (id === "filterVehicleModel") {
      state.modelSlug = document.getElementById("filterVehicleModel").value || "";
      return;
    }
    if (id === "estateSubcategoryFilter") {
      state.estateSubcategory = document.getElementById("estateSubcategoryFilter").value || "";
      syncHousingFilterVisibility();
    }
  }

  function refreshAll() {
    refreshMarketData();
    syncFilterForm();
    buildCategoryNav();
    renderFeatured();
    renderShowcase();
    renderSponsored();
    renderNew();
    renderGrid();
    renderActiveFilterTags();
  }

  function onFavClick(id) {
    toggleFavorite(id);
    refreshAll();
  }

  function initHome() {
    refreshMarketData();
    var params = new URLSearchParams(window.location.search);
    state.sellerId = params.get("seller") || "";
    state.sellerName = params.get("sellerName") ? params.get("sellerName") : "";
    state.search = params.get("q") || "";
    state.categorySlug = "";
    state.parentCategoryName = "";
    state.brandSlug = "";
    state.seriesSlug = "";
    state.modelSlug = "";
    var catQ = params.get("category");
    var subQ = params.get("subcategory");
    var brandQ = (params.get("brand") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    var seriesQ = (params.get("series") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    var modelQ = (params.get("model") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    state.sortBy = params.get("sort") || "newest";
    state.minPrice = params.get("minPrice") ? Number(params.get("minPrice")) : null;
    state.maxPrice = params.get("maxPrice") ? Number(params.get("maxPrice")) : null;
    state.city = params.get("city") || "";
    state.district = params.get("district") || "";
    state.datePreset = params.get("date") || "all";
    state.estateSubcategory = params.get("estateSub") || "";
    state.housingRoom = params.get("room") || "";
    state.housingLivingRoom = params.get("living") || "";
    state.housingGross = params.get("gross") || "";
    state.housingNet = params.get("net") || "";
    state.housingBuildingAge = params.get("age") || "";
    state.housingFloor = params.get("floor") || "";
    state.housingHeating = params.get("heat") || "";
    state.housingBathroom = params.get("bath") || "";
    state.housingBalcony = params.get("balcony") || "";
    state.housingElevator = params.get("elevator") || "";
    state.housingParking = params.get("parking") || "";
    state.housingFurnished = params.get("furnished") || "";
    state.housingInSite = params.get("insite") || "";
    state.housingDues = params.get("dues") || "";
    state.housingTitle = params.get("title") || "";
    state.housingMortgage = params.get("mortgage") || "";
    state.landZoning = params.get("zoning") || "";
    state.landM2 = params.get("landM2") || "";
    state.landEmsal = params.get("emsal") || "";
    state.landGabari = params.get("gabari") || "";
    state.landMortgage = params.get("landMortgage") || "";
    state.landTrade = params.get("landTrade") || "";
    state.hotelBedCount = params.get("bed") || "";
    state.hotelOpenArea = params.get("openArea") || "";
    state.hotelClosedArea = params.get("closedArea") || "";
    state.hotelBuildState = params.get("buildState") || "";
    state.hotelGroundSurvey = params.get("groundSurvey") || "";
    state.vehicleYearMin = params.get("yearMin") || "";
    state.vehicleYearMax = params.get("yearMax") || "";
    state.vehicleKmMin = params.get("kmMin") ? Number(params.get("kmMin")) : null;
    state.vehicleKmMax = params.get("kmMax") ? Number(params.get("kmMax")) : null;
    state.vehicleFuel = params.get("fuel") || "";
    state.vehicleGear = params.get("gear") || "";
    state.vehicleBody = params.get("body") || "";
    state.vehicleDrive = params.get("drive") || "";
    state.vehicleColor = params.get("color") || "";
    state.vehicleCondition = params.get("condition") || "";
    state.vehicleKimden = params.get("kimden") || "";
    state.vehicleTrade = params.get("trade") || "";
    state.vehicleDamage = params.get("damage") || "";
    state.vehicleWarranty = params.get("warranty") || "";
    if (catQ && subQ) {
      state.categorySlug = resolveSlugFromQuery(catQ, subQ) || "";
    } else if (catQ) {
      state.parentCategoryName = parentNameFromQuery(catQ) || "";
    }
    if (state.categorySlug && state.categorySlug.indexOf("vasita-") === 0 && brandQ) {
      state.brandSlug = brandQ;
      if (seriesQ) state.seriesSlug = seriesQ;
      if (seriesQ && modelQ) state.modelSlug = modelQ;
    }
    var si = document.getElementById("headerSearchInput");
    if (si) si.value = state.search;
    populateCitySelect("citySelect");
    syncDistrictFilter();
    syncVehicleFilterVisibility();
    syncVehicleFilterSelects();
    syncHousingFilterVisibility();
    syncFilterForm();
    if (window.JetleAds && typeof JetleAds.mountHomePage === "function") {
      JetleAds.mountHomePage();
    }
    refreshAll();
  }

  function getQueryParam(name) {
    var p = new URLSearchParams(window.location.search);
    return p.get(name) || "";
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  var DETAIL_IMG_PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560"><rect fill="#eceef2" width="900" height="560"/><text x="450" y="278" text-anchor="middle" fill="#6b7280" font-family="system-ui,Segoe UI,sans-serif" font-size="17">Görsel yok</text></svg>'
    );
  function yearsOnJetle(iso) {
    if (!iso) return "Yeni üye";
    var diff = Date.now() - new Date(iso).getTime();
    if (!isFinite(diff) || diff < 0) return "Yeni üye";
    var y = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
    return y <= 0 ? "1 yıldan az" : y + " yıldır Jetle'de";
  }

  var VEHICLE_SPEC_ROWS = [
    { label: "Marka", keys: ["Marka"] },
    { label: "Seri", keys: ["Seri"] },
    { label: "Model", keys: ["Model"] },
    { label: "Yıl", keys: ["Yıl"] },
    { label: "Araç modeli", keys: ["Araç modeli"] },
    { label: "Vasıta türü", keys: ["Vasıta türü"] },
    { label: "KM", keys: ["KM"] },
    { label: "Yakıt tipi", keys: ["Yakıt tipi", "Yakıt"] },
    { label: "Vites", keys: ["Vites"] },
    { label: "Araç durumu", keys: ["Araç durumu"] },
    { label: "Kasa tipi", keys: ["Kasa tipi"] },
    { label: "Motor hacmi", keys: ["Motor hacmi"] },
    { label: "Motor gücü", keys: ["Motor gücü"] },
    { label: "Çekiş", keys: ["Çekiş"] },
    { label: "Renk", keys: ["Renk"] },
    { label: "Garanti", keys: ["Garanti"] },
    { label: "Ağır hasar kaydı", keys: ["Ağır hasar kaydı", "Hasar kaydı"] },
    { label: "Plaka / Uyruk", keys: ["Plaka / Uyruk"] },
    { label: "Takas", keys: ["Takas"] },
    { label: "Kimden", keys: ["Kimden"] },
    { label: "Teknik özellikler", keys: ["Teknik özellikler"] }
  ];

  var KONUT_SPEC_ROWS = [
    { label: "Emlak tipi", keys: ["Emlak tipi", "Tür"] },
    { label: "m² brüt", keys: ["m² brüt", "m² (brüt)"] },
    { label: "m² net", keys: ["m² net", "m² (net)"] },
    { label: "m²", keys: ["m²"] },
    { label: "Oda sayısı", keys: ["Oda sayısı"] },
    { label: "Bina yaşı", keys: ["Bina yaşı"] },
    { label: "Bulunduğu kat", keys: ["Bulunduğu kat", "Kat"] },
    { label: "Kat sayısı", keys: ["Kat sayısı"] },
    { label: "Isıtma", keys: ["Isıtma"] },
    { label: "Banyo sayısı", keys: ["Banyo sayısı"] },
    { label: "Mutfak", keys: ["Mutfak"] },
    { label: "Balkon", keys: ["Balkon"] },
    { label: "Asansör", keys: ["Asansör"] },
    { label: "Otopark", keys: ["Otopark"] },
    { label: "Eşyalı", keys: ["Eşyalı", "Eşya durumu"] },
    { label: "Kullanım durumu", keys: ["Kullanım durumu"] },
    { label: "Site içerisinde", keys: ["Site içerisinde", "Site içinde"] },
    { label: "Site adı", keys: ["Site adı"] },
    { label: "Aidat", keys: ["Aidat"] },
    { label: "Krediye uygun", keys: ["Krediye uygun"] },
    { label: "Tapu durumu", keys: ["Tapu durumu"] },
    { label: "Depozito", keys: ["Depozito"] },
    { label: "Kimden", keys: ["Kimden"] }
  ];

  var ARSA_SPEC_ROWS = [
    { label: "İmar durumu", keys: ["İmar durumu"] },
    { label: "Ada no", keys: ["Ada no"] },
    { label: "Parsel no", keys: ["Parsel no"] },
    { label: "Pafta no", keys: ["Pafta no"] },
    { label: "KAKS (Emsal)", keys: ["KAKS (Emsal)", "KAKS (emsal)", "KAKS"] },
    { label: "Gabari", keys: ["Gabari"] },
    { label: "m²", keys: ["m²"] },
    { label: "Tapu durumu", keys: ["Tapu durumu"] },
    { label: "Takas", keys: ["Takas"] },
    { label: "Kimden", keys: ["Kimden"] }
  ];

  var ISYERI_SPEC_ROWS = [
    { label: "Tür", keys: ["Tür"] },
    { label: "m² brüt", keys: ["m² brüt"] },
    { label: "m² net", keys: ["m² net"] },
    { label: "Oda / Bölme sayısı", keys: ["Oda / Bölme sayısı"] },
    { label: "Bulunduğu kat", keys: ["Bulunduğu kat"] },
    { label: "Kat sayısı", keys: ["Kat sayısı"] },
    { label: "Isıtma", keys: ["Isıtma"] },
    { label: "WC sayısı", keys: ["WC sayısı"] },
    { label: "Asansör", keys: ["Asansör"] },
    { label: "Otopark", keys: ["Otopark"] },
    { label: "Kullanım durumu", keys: ["Kullanım durumu"] },
    { label: "Aidat", keys: ["Aidat"] },
    { label: "Tapu durumu", keys: ["Tapu durumu"] },
    { label: "Takasa uygun", keys: ["Takasa uygun"] }
  ];

  var BINA_SPEC_ROWS = [
    { label: "Toplam kat sayısı", keys: ["Toplam kat sayısı"] },
    { label: "Toplam bağımsız bölüm", keys: ["Toplam bağımsız bölüm"] },
    { label: "Kullanım durumu", keys: ["Kullanım durumu"] },
    { label: "Asansör", keys: ["Asansör"] },
    { label: "Otopark", keys: ["Otopark"] },
    { label: "Isıtma", keys: ["Isıtma"] },
    { label: "Yaş", keys: ["Yaş"] },
    { label: "Tapu durumu", keys: ["Tapu durumu"] },
    { label: "Krediye uygun", keys: ["Krediye uygun"] }
  ];

  var DEVRE_SPEC_ROWS = [
    { label: "Dönem", keys: ["Dönem"] },
    { label: "Oda sayısı", keys: ["Oda sayısı"] },
    { label: "m² brüt", keys: ["m² brüt"] },
    { label: "Eşyalı", keys: ["Eşyalı"] },
    { label: "Site içerisinde", keys: ["Site içerisinde"] },
    { label: "Aidat", keys: ["Aidat"] },
    { label: "Kullanım hakkı türü", keys: ["Kullanım hakkı türü"] }
  ];

  var OTEL_SPEC_ROWS = [
    { label: "Yatak sayısı", keys: ["Yatak sayısı"] },
    { label: "Açık alan m²", keys: ["Açık alan m²", "Açık alan metre kare"] },
    { label: "Kapalı alan m²", keys: ["Kapalı alan m²", "Kapalı alan metre kare"] },
    { label: "Zemin etüdü", keys: ["Zemin etüdü"] },
    { label: "Yapı durumu", keys: ["Yapı durumu", "Yapının durumu"] },
    { label: "Oda sayısı", keys: ["Oda sayısı"] },
    { label: "Kat sayısı", keys: ["Kat sayısı"] },
    { label: "Isıtma", keys: ["Isıtma"] },
    { label: "Otopark", keys: ["Otopark"] },
    { label: "Tapu durumu", keys: ["Tapu durumu"] },
    { label: "Kimden", keys: ["Kimden"] }
  ];

  var SHOP_SPEC_ROWS = [
    { label: "Marka", keys: ["Marka"] },
    { label: "Model", keys: ["Model"] },
    { label: "Durum", keys: ["Durum"] },
    { label: "Garanti", keys: ["Garanti"] },
    { label: "Fatura", keys: ["Fatura"] },
    { label: "Takas", keys: ["Takas"] },
    { label: "Kimden", keys: ["Kimden"] }
  ];

  var SERVICE_SPEC_ROWS = [
    { label: "Hizmet türü", keys: ["Hizmet türü"] },
    { label: "Hizmet bölgesi", keys: ["Hizmet bölgesi", "Bölge"] },
    { label: "Deneyim yılı", keys: ["Deneyim yılı", "Tecrübe yılı", "Deneyim"] },
    { label: "Bireysel / Kurumsal", keys: ["Bireysel / Kurumsal"] },
    { label: "Yerinde hizmet", keys: ["Yerinde hizmet"] },
    { label: "Online hizmet", keys: ["Online hizmet"] }
  ];

  function getDetailSpecRows(L) {
    var cat = L.category || "";
    var sub = L.subcategory || "";
    var slug = L.categorySlug || "";
    if (cat === "Vasıta") return VEHICLE_SPEC_ROWS;
    if (cat === "Emlak") {
      if (sub === "Arsa" || slug === "emlak-arsa") return ARSA_SPEC_ROWS;
      if (sub === "İş Yeri" || slug === "emlak-isyeri") return ISYERI_SPEC_ROWS;
      if (sub === "Bina" || slug === "emlak-bina") return BINA_SPEC_ROWS;
      if (sub === "Devre Mülk" || slug === "emlak-devre") return DEVRE_SPEC_ROWS;
      if (sub === "Otel" || slug === "emlak-otel" || sub === "Turistik Tesis" || slug === "emlak-turistik") return OTEL_SPEC_ROWS;
      return KONUT_SPEC_ROWS;
    }
    if (cat === "Alışveriş") return SHOP_SPEC_ROWS;
    if (cat === "Hizmetler") return SERVICE_SPEC_ROWS;
    return [];
  }

  var REALESTATE_KEY_MAP = {
    "Oda sayısı": "roomCount",
    "Salon sayısı": "livingRoomCount",
    "m² brüt": "grossAreaRange",
    "Brüt m²": "grossAreaRange",
    "m² net": "netAreaRange",
    "Net m²": "netAreaRange",
    "Bina yaşı": "buildingAge",
    "Bulunduğu kat": "floorLocation",
    "Kat sayısı": "totalFloors",
    "Toplam kat sayısı": "totalFloors",
    "Isıtma": "heatingType",
    "Banyo sayısı": "bathroomCount",
    "WC sayısı": "bathroomCount",
    "Mutfak tipi": "kitchenType",
    "Balkon": "balcony",
    "Asansör": "elevator",
    "Otopark": "parkingType",
    "Eşyalı": "furnished",
    "Kullanım durumu": "usageStatus",
    "Site içerisinde": "inSite",
    "Site içinde": "inSite",
    "Site adı": "siteName",
    "Aidat": "duesRange",
    "Krediye uygun": "mortgageEligible",
    "Tapu durumu": "titleStatus",
    "Depozito": "depositRange",
    "İmar durumu": "zoningStatus",
    "Ada no": "adaNo",
    "Parsel no": "parselNo",
    "Pafta no": "paftaNo",
    "KAKS (Emsal)": "emsal",
    "KAKS (emsal)": "emsal",
    "KAKS": "emsal",
    "Gabari": "gabari",
    "Yatak sayısı": "bedCount",
    "Açık alan m²": "openAreaRange",
    "Kapalı alan m²": "closedAreaRange",
    "Zemin etüdü": "groundSurvey",
    "Yapı durumu": "buildingCondition",
    "Yapının durumu": "buildingCondition",
    "Tesis türü": "facilityType",
    "Emlak tipi": "propertyType"
  };

  function pickSpecVal(specs, keys, L) {
    if (!specs) specs = {};
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (specs[k] != null && String(specs[k]).trim() !== "") return String(specs[k]).trim();
      if (L && L.realEstateSpecs && REALESTATE_KEY_MAP[k]) {
        var mapped = L.realEstateSpecs[REALESTATE_KEY_MAP[k]];
        if (mapped != null && String(mapped).trim() !== "") return String(mapped).trim();
      }
    }
    return "—";
  }

  function fillSpecTableBody(tbody, L) {
    if (!tbody) return;
    clearEl(tbody);
    var specs = L.specs || {};
    var plan = getDetailSpecRows(L);
    var added = 0;
    if (plan && plan.length) {
      plan.forEach(function (row) {
        var val = pickSpecVal(specs, row.keys, L);
        if (val === "—" || String(val).trim() === "") return;
        added++;
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.textContent = row.label;
        var td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
    }
    if (!added) {
      var ks = Object.keys(specs).sort();
      if (ks.length) {
        ks.forEach(function (k) {
          var v = specs[k];
          if (v == null || String(v).trim() === "") return;
          added++;
          var tr = document.createElement("tr");
          var th = document.createElement("th");
          th.textContent = k;
          var td = document.createElement("td");
          td.textContent = v;
          tr.appendChild(th);
          tr.appendChild(td);
          tbody.appendChild(tr);
        });
      }
    }
    if (!added) {
      var tr0 = document.createElement("tr");
      var td0 = document.createElement("td");
      td0.colSpan = 2;
      td0.className = "data-table__empty";
      td0.textContent = "Bu ilan için ek teknik bilgi girilmemiş.";
      tr0.appendChild(td0);
      tbody.appendChild(tr0);
    }
  }

  /** API `features`: { Grup: [ "satır", ... ] } veya specs / plan üzerinden gruplu liste. */
  function buildFeatureGroupsFromListing(L) {
    if (!L || typeof L !== "object") return null;
    if (L.features && typeof L.features === "object" && !Array.isArray(L.features)) {
      var out = {};
      Object.keys(L.features).forEach(function (g) {
        var arr = L.features[g];
        if (!Array.isArray(arr)) return;
        var lines = arr
          .map(function (x) {
            return String(x != null ? x : "").trim();
          })
          .filter(Boolean);
        if (lines.length) out[g] = lines;
      });
      if (Object.keys(out).length) return out;
    }
    var specs = L.specs || {};
    var plan = getDetailSpecRows(L);
    var lines = [];
    if (plan && plan.length) {
      plan.forEach(function (row) {
        var val = pickSpecVal(specs, row.keys, L);
        if (val === "—" || String(val).trim() === "") return;
        lines.push(row.label + ": " + val);
      });
    }
    if (!lines.length) {
      var ks = Object.keys(specs).sort();
      ks.forEach(function (k) {
        var v = specs[k];
        if (v == null || String(v).trim() === "") return;
        if (typeof v === "object") return;
        lines.push(k + ": " + String(v));
      });
    }
    return lines.length ? { Özellikler: lines } : null;
  }

  function fillDetailFeaturesGrouped(container, L) {
    if (!container) return;
    clearEl(container);
    var groups = buildFeatureGroupsFromListing(L);
    if (!groups) return;
    Object.keys(groups).forEach(function (gName) {
      var items = groups[gName];
      if (!Array.isArray(items) || !items.length) return;
      var wrap = document.createElement("div");
      wrap.className = "detail-features-group";
      var h4 = document.createElement("h4");
      h4.className = "detail-features-group__title";
      h4.textContent = gName;
      var ul = document.createElement("ul");
      ul.className = "detail-features-group__list";
      items.forEach(function (it) {
        var li = document.createElement("li");
        var t = String(it || "").trim();
        li.textContent = t.indexOf("\u2714") === 0 ? t : "\u2714 " + t;
        ul.appendChild(li);
      });
      wrap.appendChild(h4);
      wrap.appendChild(ul);
      container.appendChild(wrap);
    });
  }

  function fillBreadcrumb(nav, L) {
    if (!nav) return;
    clearEl(nav);
    function sep() {
      var s = document.createElement("span");
      s.className = "detail-breadcrumb__sep";
      s.textContent = "›";
      s.setAttribute("aria-hidden", "true");
      return s;
    }
    function a(href, t) {
      var el = document.createElement("a");
      el.href = href;
      el.textContent = t;
      return el;
    }
    nav.appendChild(a("index.html", "Ana Sayfa"));
    nav.appendChild(sep());
    var pq = parentQFromName(L.category || "");
    nav.appendChild(a(pq ? "index.html?category=" + encodeURIComponent(pq) : "index.html", L.category || "Kategori"));
    nav.appendChild(sep());
    var qp = slugToQueryParams(L.categorySlug);
    if (qp) {
      nav.appendChild(
        a("index.html?category=" + encodeURIComponent(qp.cat) + "&subcategory=" + encodeURIComponent(qp.sub), L.subcategory || "")
      );
    } else {
      nav.appendChild(document.createTextNode(L.subcategory || ""));
    }
    nav.appendChild(sep());
    var cur = document.createElement("span");
    cur.className = "detail-breadcrumb__current";
    var t = L.title || "";
    cur.textContent = t.length > 72 ? t.slice(0, 69) + "…" : t;
    nav.appendChild(cur);
  }

  function initDetailPage() {
    var root = document.getElementById("detailRoot");
    var missing = document.getElementById("detailNotFound");
    var id = getQueryParam("id");
    var viewer = JetleAuth.getCurrentUser();
    var raw = JetleAPI.getListingById(id);
    var L = JetleAPI.getListingForViewer(id, viewer);

    var nfTitle = document.getElementById("detailNotFoundTitle");
    var nfDesc = document.getElementById("detailNotFoundDesc");

    function showEmpty(title, desc) {
      if (root) root.hidden = true;
      if (missing) missing.hidden = false;
      if (nfTitle) nfTitle.textContent = title || "İlan bulunamadı";
      if (nfDesc) nfDesc.textContent = desc || "";
      document.title = (title || "İlan") + " — JETLE.online";
      var dpf = document.getElementById("detailPageFooter");
      if (dpf) dpf.hidden = true;
    }

    if (!id) {
      showEmpty("İlan bulunamadı", "Geçerli bir ilan bağlantısı ile açın (?id=…).");
      return;
    }
    if (!raw) {
      showEmpty("İlan bulunamadı", "Bu numaraya ait kayıt bulunamadı. Ana sayfadan arama yapabilirsiniz.");
      return;
    }
    if (!L) {
      showEmpty(
        "Bu ilan yayında değil",
        "İlan henüz onaylanmadı, reddedildi veya yayından kaldırıldı. Sahibi veya yöneticiyseniz giriş yaparak panele gidin."
      );
      return;
    }

    if (missing) missing.hidden = true;
    if (root) root.hidden = false;
    if (root) root.setAttribute("data-listing-id", L.id);
    var dpfShow = document.getElementById("detailPageFooter");
    if (dpfShow) dpfShow.hidden = false;

    document.title = (L.title || "İlan") + " — JETLE.online";

    var statusEl = document.getElementById("detailStatusBanner");
    if (statusEl) {
      if (L.status !== "approved" && viewer && (viewer.role === "admin" || L.createdBy === viewer.id)) {
        statusEl.hidden = false;
        statusEl.textContent =
          L.status === "pending"
            ? "Bu ilan incelemede; yalnızca siz ve yöneticiler görebilir."
            : L.status === "rejected"
              ? "Bu ilan reddedildi."
              : "Bu ilan pasif durumda.";
        statusEl.className = "detail-status-banner detail-status-banner--" + L.status;
      } else {
        statusEl.hidden = true;
      }
    }

    fillBreadcrumb(document.getElementById("detailBreadcrumb"), L);

    setText("detailPrice", formatPrice(L.price));
    var negEl = document.getElementById("detailPriceNegotiation");
    if (negEl) {
      negEl.textContent =
        L.category === "Vasıta" ? "Pazarlık payı vardır" : "Bu kategori için uygun fiyat";
    }
    setText("detailTitle", L.title);

    try {
      var cleanUrl =
        "ilan-detay.html?id=" +
        encodeURIComponent(L.id) +
        "&slug=" +
        encodeURIComponent(slugifyListingTitle(L.title));
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (e) {}
    var locObj = L.location && typeof L.location === "object" ? L.location : null;
    var locCity = (locObj && locObj.city) || L.city || "";
    var locDistrict = (locObj && locObj.district) || L.district || "";
    var locAddress = (locObj && locObj.address) || "";
    var locCoords = locObj && locObj.lat != null && locObj.lng != null
      ? Number(locObj.lat).toFixed(5) + ", " + Number(locObj.lng).toFixed(5)
      : "";
    var locLine = [locCity, locDistrict].filter(Boolean).join(" / ") || locCoords || "Belirtilmedi";
    setText("detailListingNo", L.listingNo || L.id);
    setText("detailDate", formatDateLong(L.createdAt));
    setText("detailLocLine", locLine);
    setText("detailCategory", L.category + " › " + L.subcategory);
    setText("detailLocInline", locLine);
    setText("detailAddressInline", locAddress || "Belirtilmedi");
    setText("detailDateInline", formatDateLong(L.createdAt));
    setText("detailNoInline", L.listingNo || L.id);

    var descEl = document.getElementById("detailDesc");
    if (descEl) {
      descEl.textContent = "";
      var rawDesc = L.description != null ? String(L.description).trim() : "";
      if (!rawDesc) {
        var p0 = document.createElement("p");
        p0.className = "detail-desc__text detail-desc__text--empty";
        p0.textContent = "Satıcı açıklama eklememiştir";
        descEl.appendChild(p0);
      } else if (typeof window.DOMPurify !== "undefined" && window.DOMPurify.sanitize) {
        var safe = window.DOMPurify.sanitize(rawDesc.replace(/\n/g, "<br/>"), {
          ALLOWED_TAGS: ["br", "p", "strong", "em", "b", "i", "ul", "ol", "li", "a", "span"],
          ALLOWED_ATTR: ["href", "target", "rel", "class"]
        });
        descEl.innerHTML = safe;
      } else {
        var p1 = document.createElement("p");
        p1.className = "detail-desc__text";
        p1.textContent = rawDesc;
        descEl.appendChild(p1);
      }
    }

    setText("detailSeller", L.sellerName || "Satıcı");
    var sellerProfile = L.createdBy ? JetleAPI.getPublicUserProfile(L.createdBy) : null;
    var sellerRoleText = "Bireysel";
    if (sellerProfile && sellerProfile.profileType === "Kurumsal") sellerRoleText = "Kurumsal Üye";
    else if (L.sellerType === "Mağaza") sellerRoleText = "Mağaza";
    setText("detailSellerRole", sellerRoleText);
    setText("detailSellerCity", "Şehir: " + ((sellerProfile && sellerProfile.city) || L.city || "Belirtilmemiş"));
    setText("detailSellerMemberSince", "Üyelik: " + yearsOnJetle(sellerProfile && sellerProfile.createdAt));
    var sid = String(L.id || "");
    var alt = 0;
    for (var ui = 0; ui < sid.length; ui++) alt += sid.charCodeAt(ui);
    setText("detailSellerSeen", "Son görülme: " + (alt % 3 === 0 ? "Bugün aktif" : alt % 3 === 1 ? "Son 24 saatte aktif" : "Bu hafta aktif"));
    var sellerBadges = document.getElementById("detailSellerBadges");
    if (sellerBadges) {
      sellerBadges.textContent = "";
      function addBadge(text) {
        var b = document.createElement("span");
        b.className = "detail-verified-badge";
        b.textContent = text;
        sellerBadges.appendChild(b);
      }
      addBadge("Onaylı Kullanıcı");
      if (sellerRoleText === "Kurumsal Üye") addBadge("Kurumsal Üye");
    }

    var profBtn = document.getElementById("detailSellerProfileBtn");
    var shopBtn = document.getElementById("detailSellerListingsBtn");
    var phoneBtn = document.getElementById("detailPhoneBtn");
    var phoneNumEl = document.getElementById("detailPhoneNumber");
    var sellerPhone = L.phone ? String(L.phone).trim() : (sellerProfile && sellerProfile.phone ? String(sellerProfile.phone).trim() : "");
    var phoneStorageKey = "jetle_detail_phone_open_" + String(L.id || "");
    var phoneOpened = false;
    try {
      phoneOpened = sessionStorage.getItem(phoneStorageKey) === "1";
    } catch (e) {}

    function normalizeTel(v) {
      return String(v || "").replace(/\s+/g, "");
    }
    function showPhoneState(opened) {
      if (!phoneBtn || !phoneNumEl) return;
      if (!sellerPhone) {
        phoneNumEl.hidden = false;
        phoneNumEl.textContent = "Telefon bilgisi bulunamadı";
        phoneBtn.textContent = "Telefon bilgisi";
        phoneBtn.classList.remove("detail-phone-btn--call");
        return;
      }
      if (!opened) {
        phoneNumEl.hidden = true;
        phoneNumEl.textContent = "";
        phoneBtn.textContent = "Telefonu göster";
        phoneBtn.classList.remove("detail-phone-btn--call");
        phoneBtn.setAttribute("aria-label", "Telefon numarasını göster");
      } else {
        phoneNumEl.hidden = false;
        phoneNumEl.textContent = sellerPhone;
        phoneBtn.textContent = "Ara: " + sellerPhone;
        phoneBtn.classList.add("detail-phone-btn--call");
        phoneBtn.setAttribute("aria-label", "Satıcıyı ara");
      }
    }

    if (profBtn) profBtn.href = L.createdBy ? "satici.html?id=" + encodeURIComponent(L.createdBy) : "dashboard.html#profile";

    if (shopBtn) {
      shopBtn.textContent = "Tüm ilanlarını gör";
      if (L.createdBy) {
        shopBtn.href = "satici.html?id=" + encodeURIComponent(L.createdBy);
      } else if (L.sellerName) {
        shopBtn.href = "index.html?sellerName=" + encodeURIComponent(L.sellerName);
      } else {
        shopBtn.href = "index.html?q=" + encodeURIComponent(L.subcategory || L.category || "");
      }
    }

    if (phoneNumEl) {
      phoneNumEl.textContent = "";
      phoneNumEl.hidden = true;
    }
    if (phoneBtn) {
      showPhoneState(phoneOpened);
      phoneBtn.onclick = function () {
        if (!sellerPhone) {
          showPhoneState(false);
          return;
        }
        if (!phoneOpened) {
          phoneOpened = true;
          try {
            sessionStorage.setItem(phoneStorageKey, "1");
          } catch (e) {}
          showPhoneState(true);
          return;
        }
        window.location.href = "tel:" + normalizeTel(sellerPhone);
      };
    }

    function updateStarFavUi() {
      var on = isFavorite(L.id);
      var star = document.getElementById("detailStarFav");
      if (star) {
        star.textContent = on ? "★" : "☆";
        star.classList.toggle("is-active", on);
        star.setAttribute("aria-label", on ? "Favorilerden çıkar" : "Favorilere ekle");
      }
    }
    updateStarFavUi();
    var starBtn = document.getElementById("detailStarFav");
    if (starBtn) {
      starBtn.onclick = function () {
        toggleFavorite(L.id);
        updateStarFavUi();
        var fb = document.getElementById("detailFavBtn");
        if (fb) fb.textContent = isFavorite(L.id) ? "Favorilerden çıkar" : "Favorilere ekle";
        JetleAuth.renderHeaderBar();
      };
    }

    var reportBottom = document.getElementById("detailReportBottomBtn");
    var complaintModal = document.getElementById("detailComplaintModal");
    var complaintForm = document.getElementById("detailComplaintForm");
    var complaintClose = document.getElementById("detailComplaintClose");
    var complaintReason = document.getElementById("detailComplaintReason");
    var complaintMessage = document.getElementById("detailComplaintMessage");
    var complaintFeedback = document.getElementById("detailComplaintFeedback");
    var complaintEscHandler = null;
    function resetComplaintFeedback() {
      if (!complaintFeedback) return;
      complaintFeedback.hidden = true;
      complaintFeedback.textContent = "";
      complaintFeedback.className = "text-small";
    }
    function closeComplaintModal(clearForm) {
      if (!complaintModal) return;
      complaintModal.hidden = true;
      complaintModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (complaintEscHandler) {
        document.removeEventListener("keydown", complaintEscHandler);
        complaintEscHandler = null;
      }
      if (clearForm) {
        if (complaintReason) complaintReason.value = "";
        if (complaintMessage) complaintMessage.value = "";
      }
      resetComplaintFeedback();
    }
    function openComplaintModal() {
      if (!complaintModal) return;
      complaintModal.hidden = false;
      complaintModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      resetComplaintFeedback();
      if (complaintEscHandler) document.removeEventListener("keydown", complaintEscHandler);
      complaintEscHandler = function (ev) {
        if (ev.key === "Escape") closeComplaintModal(false);
      };
      document.addEventListener("keydown", complaintEscHandler);
      if (complaintReason) complaintReason.focus();
    }
    function openComplaintFlow() {
      openComplaintModal();
    }
    if (complaintModal) {
      complaintModal.hidden = true;
      complaintModal.setAttribute("aria-hidden", "true");
      complaintModal.onclick = function (e) {
        if (e.target === complaintModal) closeComplaintModal(false);
      };
    }
    if (complaintClose) {
      complaintClose.onclick = function () {
        closeComplaintModal(false);
      };
    }
    if (complaintForm) {
      complaintForm.onsubmit = function (e) {
        e.preventDefault();
        var reason = complaintReason ? String(complaintReason.value || "").trim() : "";
        var message = complaintMessage ? String(complaintMessage.value || "").trim() : "";
        if (!reason) {
          if (complaintFeedback) {
            complaintFeedback.hidden = false;
            complaintFeedback.className = "text-small msg-feedback msg-feedback--error";
            complaintFeedback.textContent = "Lütfen bir şikayet nedeni seçin.";
          }
          return;
        }
        var u = JetleAuth.getCurrentUser();
        var res = JetleAPI.addComplaint({
          listingId: L.id,
          listingTitle: L.title || "",
          reason: reason,
          message: message,
          reporterUserId: u && u.id ? u.id : null,
          reporterType: u && u.id ? "user" : "guest"
        });
        if (!res || res.ok === false) {
          if (complaintFeedback) {
            complaintFeedback.hidden = false;
            complaintFeedback.className = "text-small msg-feedback msg-feedback--error";
            complaintFeedback.textContent =
              res && res.code === "duplicate_recent"
                ? "Bu ilan için kısa süre önce bildirim gönderdiniz."
                : "Bildirim gönderilemedi. Lütfen tekrar deneyin.";
          }
          return;
        }
        closeComplaintModal(true);
        window.alert("Bildiriminiz alındı. İnceleme sonrası gerekli işlem yapılacaktır.");
      };
    }
    if (reportBottom) {
      reportBottom.onclick = openComplaintFlow;
    }

    var mainImg = document.getElementById("ilanMainImage") || document.getElementById("detailMainImg");
    var thumbs = document.getElementById("ilanThumbs") || document.getElementById("detailThumbs");
    var wrap = document.getElementById("detailMainPhotoWrap");
    var imgs = L.images && L.images.length ? L.images.filter(Boolean).slice() : [];
    if (imgs.length > 30) imgs = imgs.slice(0, 30);
    if (L.coverImage && imgs.indexOf(L.coverImage) >= 0) {
      imgs = [L.coverImage].concat(imgs.filter(function (x) { return x !== L.coverImage; }));
    }
    var videoWrap = document.getElementById("detailVideoWrap");
    var videoPlayer = document.getElementById("detailVideoPlayer");
    var vObj = L.video || (L.media && L.media.video) || null;
    if (videoWrap && videoPlayer) {
      if (vObj && vObj.url) {
        videoPlayer.src = vObj.url;
      } else {
        videoWrap.hidden = true;
        videoPlayer.removeAttribute("src");
      }
    }

    var galleryMode = "photo";

    function syncDetailGalleryStage() {
      var hasV = !!(vObj && vObj.url);
      if (!wrap || !videoWrap) return;
      if (galleryMode === "video" && hasV) {
        wrap.hidden = true;
        videoWrap.hidden = false;
      } else {
        wrap.hidden = false;
        videoWrap.hidden = true;
        try {
          if (videoPlayer) videoPlayer.pause();
        } catch (ePause) {}
      }
    }

    function setDetailActiveThumb(btn) {
      if (!thumbs || !btn) return;
      thumbs.querySelectorAll(".detail-thumb").forEach(function (x) {
        x.classList.toggle("is-active", x === btn);
      });
    }

    function setMainSrc(src) {
      if (!mainImg) return;
      mainImg.onload = function () {
        mainImg.classList.remove("is-error");
      };
      mainImg.onerror = function () {
        mainImg.onerror = null;
        mainImg.src = DETAIL_IMG_PLACEHOLDER;
        mainImg.classList.add("is-error");
      };
      mainImg.alt = L.title || "İlan görseli";
      mainImg.loading = "eager";
      mainImg.src = src || DETAIL_IMG_PLACEHOLDER;
    }

    var hasListingVideo = !!(vObj && vObj.url);

    if (!imgs.length && !hasListingVideo) {
      galleryMode = "photo";
      setMainSrc(DETAIL_IMG_PLACEHOLDER);
      if (wrap) wrap.classList.add("detail-main-photo--placeholder");
      if (thumbs) {
        clearEl(thumbs);
        thumbs.hidden = true;
      }
      syncDetailGalleryStage();
    } else {
      if (wrap) wrap.classList.remove("detail-main-photo--placeholder");
      if (thumbs) {
        thumbs.hidden = false;
        clearEl(thumbs);
        imgs.forEach(function (src, i) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "detail-thumb detail-thumb--square" + (i === 0 ? " is-active" : "");
          b.setAttribute("data-kind", "photo");
          b.setAttribute("aria-label", "Fotoğraf " + (i + 1));
          var im = document.createElement("img");
          im.src = src;
          im.alt = "";
          im.loading = "lazy";
          im.onerror = function () {
            im.src = DETAIL_IMG_PLACEHOLDER;
          };
          b.appendChild(im);
          b.addEventListener("click", function () {
            galleryMode = "photo";
            syncDetailGalleryStage();
            setMainSrc(src);
            setDetailActiveThumb(b);
          });
          thumbs.appendChild(b);
        });
        if (hasListingVideo) {
          var vb = document.createElement("button");
          vb.type = "button";
          vb.className = "detail-thumb detail-thumb--video";
          vb.setAttribute("data-kind", "video");
          vb.setAttribute("aria-label", "İlan videosu");
          var vlab = document.createElement("span");
          vlab.textContent = "Video";
          vb.appendChild(vlab);
          vb.addEventListener("click", function () {
            galleryMode = "video";
            syncDetailGalleryStage();
            setDetailActiveThumb(vb);
          });
          thumbs.appendChild(vb);
        }
      }
      if (imgs.length) {
        galleryMode = "photo";
        syncDetailGalleryStage();
        setMainSrc(imgs[0]);
        var firstPh = thumbs ? thumbs.querySelector('.detail-thumb[data-kind="photo"]') : null;
        setDetailActiveThumb(firstPh);
      } else {
        galleryMode = "video";
        syncDetailGalleryStage();
        var vBtn = thumbs ? thumbs.querySelector(".detail-thumb--video") : null;
        setDetailActiveThumb(vBtn);
      }
    }

    fillSpecTableBody(document.getElementById("detailSpecBody"), L);
    fillDetailFeaturesGrouped(document.getElementById("detailFeaturesGrouped"), L);

    var favBtn = document.getElementById("detailFavBtn");
    if (favBtn) {
      favBtn.textContent = isFavorite(L.id) ? "Favorilerden çıkar" : "Favorilere ekle";
      favBtn.onclick = function () {
        toggleFavorite(L.id);
        favBtn.textContent = isFavorite(L.id) ? "Favorilerden çıkar" : "Favorilere ekle";
        updateStarFavUi();
        JetleAuth.renderHeaderBar();
      };
    }

    var msgBtn = document.getElementById("detailMsgBtn");
    var msgModal = document.getElementById("detailMsgModal");
    var msgClose = document.getElementById("detailMsgClose");
    var msgForm = document.getElementById("detailMsgForm");
    var msgInput = document.getElementById("detailMsgInput");
    var msgInfo = document.getElementById("detailMsgInfo");
    var msgFeedback = document.getElementById("detailMsgFeedback");
    var msgEscHandler = null;
    function resetMsgFeedback() {
      if (!msgFeedback) return;
      msgFeedback.hidden = true;
      msgFeedback.textContent = "";
      msgFeedback.className = "text-small";
    }
    function closeMsgModal(clearInput) {
      if (!msgModal) return;
      msgModal.hidden = true;
      msgModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (msgEscHandler) {
        document.removeEventListener("keydown", msgEscHandler);
        msgEscHandler = null;
      }
      if (clearInput && msgInput) msgInput.value = "";
      resetMsgFeedback();
    }
    function openMsgModal() {
      if (!msgModal) return;
      msgModal.hidden = false;
      msgModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      resetMsgFeedback();
      if (msgEscHandler) document.removeEventListener("keydown", msgEscHandler);
      msgEscHandler = function (ev) {
        if (ev.key === "Escape") closeMsgModal(false);
      };
      document.addEventListener("keydown", msgEscHandler);
      if (msgInput) msgInput.focus();
    }
    if (msgModal) {
      msgModal.hidden = true;
      msgModal.setAttribute("aria-hidden", "true");
    }
    if (msgClose && msgModal) {
      msgClose.onclick = function () {
        closeMsgModal(false);
      };
    }
    if (msgModal) {
      msgModal.onclick = function (e) {
        if (e.target === msgModal) closeMsgModal(false);
      };
    }
    if (msgInfo) msgInfo.textContent = (L.sellerName || "Satıcı") + " · " + (L.title || "");
    if (msgBtn) {
      msgBtn.onclick = function () {
        var u = JetleAuth.getCurrentUser();
        if (!u) {
          window.location.href =
            "login.html?next=" + encodeURIComponent(buildListingDetailUrl(L.id, L.title));
          return;
        }
        openMsgModal();
      };
    }
    if (msgForm) {
      msgForm.onsubmit = function (e) {
        e.preventDefault();
        var u = JetleAuth.getCurrentUser();
        if (!u) {
          window.location.href = "login.html?next=" + encodeURIComponent(buildListingDetailUrl(L.id, L.title));
          return;
        }
        var text = msgInput ? String(msgInput.value || "").trim() : "";
        if (!text) {
          if (msgFeedback) {
            msgFeedback.hidden = false;
            msgFeedback.className = "text-small msg-feedback msg-feedback--error";
            msgFeedback.textContent = "Lütfen bir mesaj yazın.";
          }
          return;
        }
        JetleAPI.sendMessage({
          listingId: L.id,
          fromUserId: u.id,
          toUserId: L.createdBy || L.sellerId || "seller-" + slugifyMarketToken(L.sellerName || "satici"),
          message: text
        });
        closeMsgModal(true);
        window.alert("Mesajınız gönderildi.");
      };
    }

    var shareBtn = document.getElementById("detailShareBtn");
    if (shareBtn) {
      shareBtn.onclick = function () {
        var url = location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            window.alert("Bağlantı panoya kopyalandı.");
          });
        } else {
          window.prompt("Bağlantıyı kopyalayın:", url);
        }
      };
    }

    var compBtn = document.getElementById("detailComplaintBtn");
    if (compBtn) compBtn.onclick = openComplaintFlow;

    var similar = document.getElementById("detailSimilar");
    if (similar) {
      clearEl(similar);
      similar.className = "detail-similar-grid";
      JetleAPI.getSimilarPublic(L.id, L.categorySlug, L.category, 4).forEach(function (card) {
        var node = createListingCard(card);
        node.classList.add("listing-card--compact");
        similar.appendChild(node);
      });
    }

    var heatToday = document.getElementById("detailHeatToday");
    var heat24 = document.getElementById("detailHeat24h");
    var heatBlock = document.getElementById("detailHeatBlock");
    var vh = listingIdHash(L.id);
    var viewers24 = 8 + (vh % 42);
    if (heat24) {
      heat24.textContent = "Son 24 saatte " + viewers24 + " kişi baktı";
    }
    if (heatToday) {
      var showHot = L.featured || L.showcase || vh % 4 === 0;
      heatToday.hidden = !showHot;
      heatToday.textContent = "Bu ilan bugün çok görüntülendi";
    }
    if (heatBlock) heatBlock.hidden = false;

    var urgentAside = document.getElementById("detailUrgentAside");
    if (urgentAside) {
      urgentAside.textContent = "";
      if (L.featured || L.showcase) {
        var pb = document.createElement("span");
        pb.className = "detail-aside-flair detail-aside-flair--premium";
        pb.textContent = L.showcase ? "Vitrin ilanı" : "Öne çıkan ilan";
        urgentAside.appendChild(pb);
      }
      if (L.urgent) {
        var ub = document.createElement("span");
        ub.className = "detail-aside-flair detail-aside-flair--urgent";
        ub.textContent = "ACİL";
        urgentAside.appendChild(ub);
      }
      var fakeViews = 120 + (vh % 400);
      var vb = document.createElement("span");
      vb.className = "detail-aside-flair detail-aside-flair--muted";
      vb.textContent = "Bugün ~" + fakeViews + " görüntülenme";
      urgentAside.appendChild(vb);
    }

    if (typeof window.bindIlanDetayPremiumTabs === "function") {
      try {
        window.bindIlanDetayPremiumTabs();
      } catch (eTabs) {}
    }
  }

  /** Emlak > Konut — oda sayısı (yalnızca metin değil, seçim) */
  var KONUT_ODA_OPTIONS = [
    "1+0",
    "1+1",
    "2+1",
    "3+1",
    "4+1",
    "5+1",
    "5+2+"
  ];
  var KONUT_BRUT_OPTIONS = ["0-50", "50-75", "75-100", "100-125", "125-150", "150-200", "200+"];
  var KONUT_NET_OPTIONS = ["0-50", "50-75", "75-100", "100-125", "125-150", "150-200", "200+"];
  var KONUT_BINA_YASI_OPTIONS = ["0", "1-5", "6-10", "11-15", "16-20", "21-25", "26+"];
  var KONUT_KAT_OPTIONS = ["Bodrum", "Zemin", "Yüksek giriş", "1", "2", "3", "4", "5", "6+", "Çatı dubleks"];
  var KONUT_KAT_SAYISI_OPTIONS = ["1", "2", "3", "4", "5", "6-10", "11-15", "15+"];
  var KONUT_ISITMA_OPTIONS = ["Kombi (Doğalgaz)", "Merkezi", "Klima", "Soba", "Yerden Isıtma", "Isı Pompası", "Yok"];
  var KONUT_BANYO_OPTIONS = ["1", "2", "3+"];
  var KONUT_SALON_OPTIONS = ["1", "2", "3+"];
  var KONUT_MUTFAK_OPTIONS = ["Açık", "Kapalı"];
  var KONUT_EVET_HAYIR = ["Evet", "Hayır"];
  var KONUT_OTOPARK_OPTIONS = ["Açık", "Kapalı", "Yok"];
  var KONUT_KULLANIM_OPTIONS = ["Boş", "Kiracılı", "Mülk sahibi"];
  var KONUT_AIDAT_OPTIONS = ["Yok", "0-500", "500-1000", "1000-2000", "2000+"];
  var KONUT_DEPOZITO_OPTIONS = ["Yok", "1 kira", "2 kira", "3 kira+"];
  var KONUT_IMAR_OPTIONS = ["Konut", "Ticari", "Sanayi", "Tarla", "Bağ & Bahçe", "Depolama", "Turizm"];
  var KONUT_KAKS_OPTIONS = ["0.20", "0.30", "0.50", "0.75", "1.00", "1.50+"];
  var KONUT_GABARI_OPTIONS = ["2 Kat", "3 Kat", "4 Kat", "5 Kat+", "Serbest"];
  var OTEL_YATAK_OPTIONS = ["1-10", "10-20", "20-50", "50-100", "100+"];
  var OTEL_ALAN_OPTIONS = ["0-250", "250-500", "500-1000", "1000-2500", "2500+"];

  var VEHICLE_BRANDS = Object.keys(VEHICLE_DATA).sort(function (a, b) {
    return a.localeCompare(b, "tr");
  });

  var VEHICLE_YEAR_OPTIONS = (function () {
    var y = 2026;
    var min = 1990;
    var o = [];
    for (; y >= min; y--) o.push(String(y));
    return o;
  })();

  var VEHICLE_KM_BANDS = [
    "0 – 20.000 km",
    "20.001 – 50.000 km",
    "50.001 – 80.000 km",
    "80.001 – 120.000 km",
    "120.001 – 160.000 km",
    "160.001 – 200.000 km",
    "200.000+ km"
  ];

  var VEHICLE_MOTOR_CC = [
    "1000 cc",
    "1200 cc",
    "1300 cc",
    "1400 cc",
    "1500 cc",
    "1600 cc",
    "1800 cc",
    "2000 cc",
    "2500 cc",
    "3000 cc+"
  ];

  var VEHICLE_MOTOR_HP = ["75 hp", "90 hp", "110 hp", "130 hp", "150 hp", "180 hp", "200 hp", "250 hp+", "Elektrik motoru"];

  /** ilan-ver.html — çok adımlı ilan oluşturma */
  function initListingWizard() {
    var u = JetleAuth.requireUser();
    if (!u) return;

    var step = 1;
    var maxStep = 5;
    var editingListingId = null;
    var imageItems = [];
    var coverImage = "";
    var videoItem = null;
    var MAX_IMAGES = 30;
    var MAX_IMAGE_UPLOAD_BYTES = 25 * 1024 * 1024;
    var MAX_VIDEO_UPLOAD_BYTES = 200 * 1024 * 1024;
    var mediaUploadState = {
      photoBusy: false,
      videoBusy: false,
      photoProgress: 0,
      videoProgress: 0
    };
    var lastFailedPhotoFiles = null;
    var lastFailedVideoFile = null;
    var draggingPhotoIndex = -1;
    var photoUploadQueue = [];
    var activePhotoUploads = [];
    var PHOTO_PARALLEL_LIMIT = 3;
    var photoBatchCancelRequested = false;
    var videoChunkUpload = { sessionId: "", xhr: null, cancelled: false };
    var locationState = {
      city: "",
      district: "",
      address: "",
      lat: null,
      lng: null
    };
    var mapCtx = {
      map: null,
      marker: null,
      geocoder: null,
      fallbackMode: true
    };
    var fieldPrefix = "dyn-";
    var vehicleCascadeListenersWired = false;
    var lastVehicleSlug = "";

    function $(id) {
      return document.getElementById(id);
    }

    function showError(msg) {
      var el = $("formError");
      if (!el) return;
      el.textContent = msg || "";
      el.hidden = !msg;
    }
    function showSuccess(msg) {
      var el = $("formSuccess");
      if (!el) return;
      el.textContent = msg || "";
      el.hidden = !msg;
    }
    function clearNotices() {
      showError("");
      showSuccess("");
    }

    function showPhotoWarn(show) {
      var w = $("photoWarn");
      if (w) w.hidden = !show;
    }
    function updateMediaProgress() {
      var ph = $("photoProgressFill");
      if (ph) ph.style.width = Math.min(100, Math.round((imageItems.length / MAX_IMAGES) * 100)) + "%";
      var vh = $("videoProgressFill");
      if (vh) vh.style.width = videoItem ? "100%" : "0%";
    }
    function updatePhotoCountInfo() {
      var el = $("photoCountInfo");
      if (!el) return;
      el.textContent = imageItems.length + " / " + MAX_IMAGES;
      updateMediaProgress();
    }
    function setSubmitButtonsDisabled(disabled) {
      var btns = ["btnNext", "btnSubmitFinal", "btnSaveDraft"];
      btns.forEach(function (id) {
        var el = $(id);
        if (el) el.disabled = !!disabled;
      });
    }
    function updateUploadProgressUi(kind, percent, busy) {
      var isPhoto = kind === "photo";
      var wrap = $(isPhoto ? "photoUploadStatus" : "videoUploadStatus");
      var fill = $(isPhoto ? "photoUploadPercentFill" : "videoUploadPercentFill");
      var txt = $(isPhoto ? "photoUploadPercentText" : "videoUploadPercentText");
      if (wrap) wrap.hidden = !busy;
      if (fill) fill.style.width = Math.max(0, Math.min(100, Math.round(percent || 0))) + "%";
      if (txt) txt.textContent = Math.max(0, Math.min(100, Math.round(percent || 0))) + "%";
      mediaUploadState.photoBusy = isPhoto ? !!busy : mediaUploadState.photoBusy;
      mediaUploadState.videoBusy = isPhoto ? mediaUploadState.videoBusy : !!busy;
      mediaUploadState.photoProgress = isPhoto ? (percent || 0) : mediaUploadState.photoProgress;
      mediaUploadState.videoProgress = isPhoto ? mediaUploadState.videoProgress : (percent || 0);
      setSubmitButtonsDisabled(mediaUploadState.photoBusy || mediaUploadState.videoBusy);
    }
    function anyUploadInProgress() {
      return !!(mediaUploadState.photoBusy || mediaUploadState.videoBusy);
    }
    function setRetryButton(kind, visible) {
      var btn = $(kind === "photo" ? "retryPhotoUploadBtn" : "retryVideoUploadBtn");
      if (btn) btn.hidden = !visible;
    }
    function updateVideoCountInfo() {
      var el = $("videoCountInfo");
      if (!el) return;
      el.textContent = (videoItem ? 1 : 0) + " / 1";
      updateMediaProgress();
    }
    function pickMediaImages() {
      return imageItems.map(function (x) { return x.url; }).filter(Boolean);
    }
    function mediaUploadEnabled() {
      return !!(window.JetleAPI && JetleAPI.backendEnabled && JetleAPI.backendEnabled());
    }
    function getBackendAccessToken() {
      if (!window.JetleAPI || !JetleAPI.authStorage || !JetleAPI.authStorage.read) return "";
      var s = JetleAPI.authStorage.read();
      return s && s.accessToken ? String(s.accessToken) : "";
    }
    function uploadMultipartToBackend(url, field, files, onProgress) {
      var token = getBackendAccessToken();
      if (!token) return Promise.reject(new Error("Medya yüklemek için tekrar giriş yapın."));
      var fd = new FormData();
      Array.prototype.slice.call(files || [], 0).forEach(function (file) {
        fd.append(field, file);
      });
      var base = (window.JetleAPI && JetleAPI.API_GATEWAY && JetleAPI.API_GATEWAY.baseUrl) || "";
      var full = base ? base.replace(/\/+$/, "") + url : url;
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", full, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.upload.onprogress = function (ev) {
          if (!ev || !ev.lengthComputable) return;
          if (typeof onProgress === "function") onProgress((ev.loaded / ev.total) * 100);
        };
        xhr.onerror = function () {
          reject(new Error("Yükleme sırasında bağlantı hatası oluştu."));
        };
        xhr.onload = function () {
          var data = {};
          try {
            data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
          } catch (e) {}
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
            return;
          }
          reject(new Error((data && data.message) || "Yükleme başarısız."));
        };
        xhr.send(fd);
      });
    }
    function uploadSingleFileXhr(url, field, file, onProgress) {
      var token = getBackendAccessToken();
      if (!token) return Promise.reject(new Error("Medya yüklemek için tekrar giriş yapın."));
      var fd = new FormData();
      fd.append(field, file);
      var base = (window.JetleAPI && JetleAPI.API_GATEWAY && JetleAPI.API_GATEWAY.baseUrl) || "";
      var full = base ? base.replace(/\/+$/, "") + url : url;
      var xhr = new XMLHttpRequest();
      var promise = new Promise(function (resolve, reject) {
        xhr.open("POST", full, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.upload.onprogress = function (ev) {
          if (ev && ev.lengthComputable && typeof onProgress === "function") onProgress((ev.loaded / ev.total) * 100);
        };
        xhr.onerror = function () { reject(new Error("Yükleme sırasında bağlantı hatası oluştu.")); };
        xhr.onabort = function () { reject(new Error("Yükleme iptal edildi.")); };
        xhr.onload = function () {
          var data = {};
          try { data = xhr.responseText ? JSON.parse(xhr.responseText) : {}; } catch (e) {}
          if (xhr.status >= 200 && xhr.status < 300) return resolve(data);
          reject(new Error((data && data.message) || "Yükleme başarısız."));
        };
        xhr.send(fd);
      });
      return { xhr: xhr, promise: promise };
    }
    function backendJson(method, url, body) {
      var token = getBackendAccessToken();
      if (!token) return Promise.reject(new Error("Medya yüklemek için tekrar giriş yapın."));
      var base = (window.JetleAPI && JetleAPI.API_GATEWAY && JetleAPI.API_GATEWAY.baseUrl) || "";
      var full = base ? base.replace(/\/+$/, "") + url : url;
      return fetch(full, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: body == null ? undefined : JSON.stringify(body)
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error((data && data.message) || "İşlem başarısız.");
          return data;
        });
      });
    }
    function uploadVideoInChunks(file, onProgress) {
      var CHUNK_SIZE = 5 * 1024 * 1024;
      return backendJson("POST", "/api/media/upload-video/init", {
        fileName: file.name || "video",
        mimeType: file.type || "video/mp4",
        totalSize: file.size
      }).then(function (initRes) {
        var sessionId = initRes && initRes.data ? initRes.data.sessionId : "";
        if (!sessionId) throw new Error("Video oturumu başlatılamadı.");
        videoChunkUpload.sessionId = sessionId;
        videoChunkUpload.cancelled = false;
        var token = getBackendAccessToken();
        var base = (window.JetleAPI && JetleAPI.API_GATEWAY && JetleAPI.API_GATEWAY.baseUrl) || "";
        var full = (base ? base.replace(/\/+$/, "") : "") + "/api/media/upload-video/chunk";

        function sendChunk(offset) {
          if (videoChunkUpload.cancelled) return Promise.reject(new Error("Yükleme iptal edildi."));
          if (offset >= file.size) return Promise.resolve();
          var blob = file.slice(offset, Math.min(offset + CHUNK_SIZE, file.size));
          return new Promise(function (resolve, reject) {
            var fd = new FormData();
            fd.append("chunk", blob, file.name || "video.part");
            fd.append("sessionId", sessionId);
            fd.append("offset", String(offset));
            fd.append("totalSize", String(file.size));
            var xhr = new XMLHttpRequest();
            videoChunkUpload.xhr = xhr;
            xhr.open("POST", full, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.onload = function () {
              if (xhr.status < 200 || xhr.status >= 300) {
                var data = {};
                try { data = xhr.responseText ? JSON.parse(xhr.responseText) : {}; } catch (e) {}
                reject(new Error((data && data.message) || "Video parçası yüklenemedi."));
                return;
              }
              var nextOffset = offset + blob.size;
              if (typeof onProgress === "function") onProgress((nextOffset / file.size) * 100);
              resolve(nextOffset);
            };
            xhr.onerror = function () { reject(new Error("Video yükleme bağlantı hatası.")); };
            xhr.onabort = function () { reject(new Error("Yükleme iptal edildi.")); };
            xhr.send(fd);
          }).then(sendChunk);
        }
        return sendChunk(0).then(function () {
          return backendJson("POST", "/api/media/upload-video/complete", {
            sessionId: sessionId,
            fileName: file.name || "video",
            mimeType: file.type || "video/mp4"
          });
        });
      });
    }
    function normalizeCoord(v) {
      if (v == null || v === "") return null;
      var n = Number(v);
      return isNaN(n) ? null : n;
    }
    function updateMapCoordsText() {
      var el = $("mapCoordsText");
      if (!el) return;
      if (locationState.lat == null || locationState.lng == null) {
        el.textContent = "Konum seçilmedi";
        return;
      }
      el.textContent = "Seçilen konum: " + Number(locationState.lat).toFixed(6) + ", " + Number(locationState.lng).toFixed(6);
    }
    function setLocationLatLng(lat, lng) {
      locationState.lat = normalizeCoord(lat);
      locationState.lng = normalizeCoord(lng);
      updateMapCoordsText();
    }
    function syncLocationFromInputs() {
      locationState.city = $("formCity") ? $("formCity").value : "";
      locationState.district = $("formDistrict") ? $("formDistrict").value : "";
      locationState.address = $("formAddress") ? String($("formAddress").value || "").trim() : "";
    }
    function updateFallbackMarkerUI(lat, lng) {
      var mapEl = $("mapPicker");
      if (!mapEl) return;
      var marker = mapEl.querySelector(".map-picker__marker");
      if (lat == null || lng == null) {
        if (marker) marker.remove();
        return;
      }
      if (!marker) {
        marker = document.createElement("span");
        marker.className = "map-picker__marker";
        mapEl.appendChild(marker);
      }
      var x = ((Number(lng) + 180) / 360) * mapEl.clientWidth;
      var y = ((90 - Number(lat)) / 180) * mapEl.clientHeight;
      marker.style.left = Math.max(8, Math.min(mapEl.clientWidth - 8, x)) + "px";
      marker.style.top = Math.max(16, Math.min(mapEl.clientHeight - 4, y)) + "px";
    }
    function reverseGeocodeIfAvailable(lat, lng) {
      if (!mapCtx.geocoder || !window.google || !google.maps) return;
      mapCtx.geocoder.geocode({ location: { lat: lat, lng: lng } }, function (results, status) {
        if (status !== "OK" || !results || !results[0]) return;
        if ($("formAddress") && !$("formAddress").value.trim()) {
          $("formAddress").value = results[0].formatted_address || "";
          syncLocationFromInputs();
        }
      });
    }
    function initPlaceAutocomplete() {
      if (!window.google || !google.maps || !google.maps.places || !$("mapSearchInput")) return;
      var ac = new google.maps.places.Autocomplete($("mapSearchInput"), {
        fields: ["formatted_address", "geometry", "address_components"]
      });
      ac.addListener("place_changed", function () {
        var place = ac.getPlace();
        if (!place) return;
        if ($("formAddress")) $("formAddress").value = place.formatted_address || $("mapSearchInput").value || "";
        if (place.geometry && place.geometry.location) {
          var lat = place.geometry.location.lat();
          var lng = place.geometry.location.lng();
          setLocationLatLng(lat, lng);
          if (mapCtx.map) mapCtx.map.setCenter({ lat: lat, lng: lng });
          if (mapCtx.marker) mapCtx.marker.setPosition({ lat: lat, lng: lng });
          updateFallbackMarkerUI(lat, lng);
          reverseGeocodeIfAvailable(lat, lng);
        }
        syncLocationFromInputs();
      });
    }
    function initMap() {
      var mapEl = $("mapPicker");
      var fallbackEl = $("mapPickerFallback");
      if (!mapEl) return;
      var hasMaps = !!(window.google && google.maps);
      mapCtx.fallbackMode = !hasMaps;
      if (fallbackEl) fallbackEl.hidden = hasMaps;
      if (!hasMaps) {
        mapEl.addEventListener("click", function (ev) {
          var rect = mapEl.getBoundingClientRect();
          var rx = Math.max(0, Math.min(rect.width, ev.clientX - rect.left));
          var ry = Math.max(0, Math.min(rect.height, ev.clientY - rect.top));
          var lng = (rx / rect.width) * 360 - 180;
          var lat = 90 - (ry / rect.height) * 180;
          setLocationLatLng(lat, lng);
          updateFallbackMarkerUI(lat, lng);
        });
        return;
      }
      mapCtx.map = new google.maps.Map(mapEl, {
        center: { lat: 39.0, lng: 35.0 },
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false
      });
      mapCtx.geocoder = new google.maps.Geocoder();
      mapCtx.marker = new google.maps.Marker({
        map: mapCtx.map,
        position: mapCtx.map.getCenter(),
        draggable: true
      });
      setLocationLatLng(mapCtx.marker.getPosition().lat(), mapCtx.marker.getPosition().lng());
      mapCtx.map.addListener("click", function (evt) {
        if (!evt || !evt.latLng) return;
        mapCtx.marker.setPosition(evt.latLng);
        setLocationLatLng(evt.latLng.lat(), evt.latLng.lng());
        reverseGeocodeIfAvailable(evt.latLng.lat(), evt.latLng.lng());
      });
      mapCtx.marker.addListener("dragend", function (evt) {
        if (!evt || !evt.latLng) return;
        setLocationLatLng(evt.latLng.lat(), evt.latLng.lng());
        reverseGeocodeIfAvailable(evt.latLng.lat(), evt.latLng.lng());
      });
    }

    function normalizePhone(raw) {
      var digits = String(raw || "").replace(/\D+/g, "");
      if (digits.length === 10) digits = "0" + digits;
      return digits;
    }
    function formatPhoneDisplay(raw) {
      var p = normalizePhone(raw);
      if (p.length !== 11) return String(raw || "");
      return p.replace(/^(\d{4})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4");
    }
    function syncContactPhoneFromProfile() {
      var cb = $("fUseProfilePhone");
      var inp = $("fPhone");
      if (!cb || !inp) return;
      if (cb.checked) inp.value = formatPhoneDisplay((u && u.phone) || "");
    }

    function setStepIndicators() {
      document.querySelectorAll(".wizard-step").forEach(function (p) {
        var n = Number(p.getAttribute("data-step"));
        p.classList.toggle("wizard-step--active", n === step);
        p.classList.toggle("wizard-step--done", n < step);
      });
      for (var s = 1; s <= maxStep; s++) {
        var sec = $("stepPanel" + s);
        if (sec) sec.hidden = s !== step;
      }
      var bp = $("btnPrev");
      if (bp) bp.hidden = step === 1;
      var btnNext = $("btnNext");
      var btnFin = $("btnSubmitFinal");
      if (btnNext && btnFin) {
        if (step === maxStep) {
          btnNext.hidden = true;
          btnFin.hidden = false;
        } else {
          btnNext.hidden = false;
          btnFin.hidden = true;
        }
      }
      syncVehicleCascadePanel();
    }

    function getSelectedCategory() {
      var parent = $("catParent").value;
      var sub = $("catSub").value;
      var subEl = $("catSub").selectedOptions[0];
      var slug = subEl ? subEl.getAttribute("data-slug") : "";
      var subLabel = subEl ? subEl.textContent : "";
      return { parent: parent, sub: subLabel, slug: slug };
    }

    function fillSubcategories() {
      var parent = $("catParent").value;
      var sub = $("catSub");
      while (sub.firstChild) sub.removeChild(sub.firstChild);
      var ph = document.createElement("option");
      ph.value = "";
      ph.textContent = "Alt kategori seçin";
      sub.appendChild(ph);
      if (!parent) return;
      CATEGORY_TREE.forEach(function (g) {
        if (g.name !== parent) return;
        g.children.forEach(function (ch) {
          var o = document.createElement("option");
          o.value = ch.name;
          o.setAttribute("data-slug", ch.slug);
          o.textContent = ch.name;
          sub.appendChild(o);
        });
      });
    }

    function dynAppend(w, key, label, node, req) {
      node.setAttribute("data-spec-key", key);
      var id = fieldPrefix + key.replace(/\s|²|\/|&|\(|\)/g, "-");
      node.id = id;
      var div = document.createElement("div");
      div.className = "field";
      var lab = document.createElement("label");
      lab.setAttribute("for", id);
      lab.className = "field-label";
      lab.textContent = req ? label + " *" : label;
      div.appendChild(lab);
      div.appendChild(node);
      w.appendChild(div);
    }

    function fillSel(sel, arr, ph) {
      sel.innerHTML = "";
      var p = document.createElement("option");
      p.value = "";
      p.textContent = ph || "Seçin";
      sel.appendChild(p);
      arr.forEach(function (x) {
        var o = document.createElement("option");
        o.value = x;
        o.textContent = x;
        sel.appendChild(o);
      });
    }

    function dynAppendFieldClass(w, key, label, node, req, fieldClass) {
      node.setAttribute("data-spec-key", key);
      var id = fieldPrefix + key.replace(/\s|²|\/|&|\(|\)/g, "-");
      node.id = id;
      var div = document.createElement("div");
      div.className = "field" + (fieldClass ? " " + fieldClass : "");
      var lab = document.createElement("label");
      lab.setAttribute("for", id);
      lab.className = "field-label";
      lab.textContent = req ? label + " *" : label;
      div.appendChild(lab);
      div.appendChild(node);
      w.appendChild(div);
    }

    function dynSection(wrap, title) {
      var card = document.createElement("section");
      card.className = "spec-card";
      var h = document.createElement("h4");
      h.className = "spec-card__title";
      h.textContent = title;
      var body = document.createElement("div");
      body.className = "spec-card__body";
      card.appendChild(h);
      card.appendChild(body);
      wrap.appendChild(card);
      return body;
    }

    function appendYesNoSegment(wrap, key, caption, req) {
      var name = fieldPrefix + key.replace(/\s|²|\/|&|\(|\)/g, "-") + "-yn";
      var div = document.createElement("div");
      div.className = "field field--segment";
      var leg = document.createElement("span");
      leg.className = "field-label";
      leg.textContent = req ? caption + " *" : caption;
      div.appendChild(leg);
      var grp = document.createElement("div");
      grp.className = "segment-toggle";
      grp.setAttribute("role", "radiogroup");
      [["Evet", "Evet"], ["Hayır", "Hayır"]].forEach(function (pair) {
        var lab = document.createElement("label");
        lab.className = "segment-toggle__opt";
        var inp = document.createElement("input");
        inp.type = "radio";
        inp.name = name;
        inp.value = pair[0];
        inp.setAttribute("data-spec-key", key);
        lab.appendChild(inp);
        lab.appendChild(document.createTextNode(" " + pair[1]));
        grp.appendChild(lab);
      });
      div.appendChild(grp);
      wrap.appendChild(div);
    }

    function appendRadioSegment(wrap, key, caption, options, req) {
      var name = fieldPrefix + key.replace(/\s|²|\/|&|\(|\)/g, "-") + "-opt";
      var div = document.createElement("div");
      div.className = "field field--segment";
      var leg = document.createElement("span");
      leg.className = "field-label";
      leg.textContent = req ? caption + " *" : caption;
      div.appendChild(leg);
      var grp = document.createElement("div");
      grp.className = "segment-toggle";
      grp.setAttribute("role", "radiogroup");
      (options || []).forEach(function (labelText) {
        var lab = document.createElement("label");
        lab.className = "segment-toggle__opt";
        var inp = document.createElement("input");
        inp.type = "radio";
        inp.name = name;
        inp.value = labelText;
        inp.setAttribute("data-spec-key", key);
        lab.appendChild(inp);
        lab.appendChild(document.createTextNode(" " + labelText));
        grp.appendChild(lab);
      });
      div.appendChild(grp);
      wrap.appendChild(div);
    }

    function syncVehicleSeries() {
      var brandEl = $("vehicleBrand");
      var seri = $("vehicleSeries");
      var model = $("vehicleModel");
      if (!brandEl || !seri || !model) return;
      var b = brandEl.value;
      seri.innerHTML = "";
      seri.disabled = !b;
      var po = document.createElement("option");
      po.value = "";
      po.textContent = b ? "Seri seçin" : "Önce marka seçin";
      seri.appendChild(po);
      model.innerHTML = "";
      model.disabled = true;
      var pm = document.createElement("option");
      pm.value = "";
      pm.textContent = "Önce seri seçin";
      model.appendChild(pm);
      if (!b || !VEHICLE_DATA[b]) return;
      Object.keys(VEHICLE_DATA[b])
        .sort(function (a, c) {
          return a.localeCompare(c, "tr");
        })
        .forEach(function (s) {
          var o = document.createElement("option");
          o.value = s;
          o.textContent = s;
          seri.appendChild(o);
        });
    }

    function syncVehicleModel() {
      var brandEl = $("vehicleBrand");
      var seri = $("vehicleSeries");
      var model = $("vehicleModel");
      if (!brandEl || !seri || !model) return;
      var b = brandEl.value;
      var s = seri.value;
      model.innerHTML = "";
      model.disabled = !s;
      var pm = document.createElement("option");
      pm.value = "";
      pm.textContent = s ? "Model seçin" : "Önce seri seçin";
      model.appendChild(pm);
      if (!b || !s || !VEHICLE_DATA[b] || !VEHICLE_DATA[b][s]) return;
      VEHICLE_DATA[b][s].forEach(function (m) {
        var o = document.createElement("option");
        o.value = m;
        o.textContent = m;
        model.appendChild(o);
      });
    }

    function renderVehicleFields() {
      var brandEl = $("vehicleBrand");
      var seri = $("vehicleSeries");
      var model = $("vehicleModel");
      if (!brandEl || !seri || !model) return;
      fillSel(brandEl, VEHICLE_BRANDS, "Marka seçin");
      seri.innerHTML = "";
      var p0 = document.createElement("option");
      p0.value = "";
      p0.textContent = "Önce marka seçin";
      seri.appendChild(p0);
      seri.disabled = true;
      model.innerHTML = "";
      var p1 = document.createElement("option");
      p1.value = "";
      p1.textContent = "Önce seri seçin";
      model.appendChild(p1);
      model.disabled = true;
    }

    function wireVehicleCascade() {
      if (vehicleCascadeListenersWired) return;
      var vb = $("vehicleBrand");
      var vs = $("vehicleSeries");
      if (!vb || !vs) return;
      vehicleCascadeListenersWired = true;
      vb.addEventListener("change", function () {
        syncVehicleSeries();
        syncVehicleModel();
      });
      vs.addEventListener("change", syncVehicleModel);
    }

    function syncVehicleCascadePanel() {
      var vc = $("vehicleCascade");
      if (!vc) return;
      var cat = getSelectedCategory();
      var isVasita = cat.parent === "Vasıta";
      var show = isVasita && !!cat.slug;

      if (!isVasita) {
        lastVehicleSlug = "";
      }

      if (!show) {
        vc.setAttribute("hidden", "");
        vc.classList.remove("vehicle-cascade--open");
        return;
      }

      vc.removeAttribute("hidden");
      vc.classList.add("vehicle-cascade--open");

      if (cat.slug !== lastVehicleSlug) {
        lastVehicleSlug = cat.slug;
        renderVehicleFields();
        wireVehicleCascade();
      }
    }

    function renderDynamicFields() {
      var wrap = $("dynamicFields");
      if (!wrap) return;
      while (wrap.firstChild) wrap.removeChild(wrap.firstChild);

      var cat = getSelectedCategory();
      if (!cat.parent || !cat.slug) return;

      if (cat.parent === "Vasıta") {
        wrap.className = "dynamic-fields dynamic-fields--grid dynamic-fields--vehicle";

        var hv = document.createElement("input");
        hv.type = "hidden";
        hv.setAttribute("data-spec-key", "Vasıta türü");
        hv.value = cat.sub;
        wrap.appendChild(hv);

        var yil = document.createElement("select");
        fillSel(yil, VEHICLE_YEAR_OPTIONS, "Yıl seçin");
        dynAppendFieldClass(wrap, "Yıl", "Model yılı", yil, true, "field--select");

        var km = document.createElement("select");
        fillSel(km, VEHICLE_KM_BANDS, "Kilometre aralığı seçin");
        dynAppendFieldClass(wrap, "KM", "Kilometre", km, true, "field--select");

        var yakit = document.createElement("select");
        fillSel(yakit, ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik", "Benzin & LPG"], "Seçin");
        dynAppendFieldClass(wrap, "Yakıt tipi", "Yakıt tipi", yakit, true, "field--select");

        var vites = document.createElement("select");
        fillSel(vites, ["Manuel", "Otomatik", "Yarı Otomatik"], "Seçin");
        dynAppendFieldClass(wrap, "Vites", "Vites", vites, true, "field--select");

        var durum = document.createElement("select");
        fillSel(durum, ["Sıfır", "İkinci El"], "Seçin");
        dynAppendFieldClass(wrap, "Araç durumu", "Araç durumu", durum, true, "field--select");

        var kasa = document.createElement("select");
        fillSel(kasa, ["Sedan", "Hatchback", "SUV", "Coupe", "Cabrio", "Station Wagon", "Pick-up", "Panelvan"], "Seçin");
        dynAppendFieldClass(wrap, "Kasa tipi", "Kasa tipi", kasa, true, "field--select");

        var motorH = document.createElement("select");
        fillSel(motorH, VEHICLE_MOTOR_CC, "Seçin");
        dynAppendFieldClass(wrap, "Motor hacmi", "Motor hacmi", motorH, true, "field--select");

        var motorG = document.createElement("select");
        fillSel(motorG, VEHICLE_MOTOR_HP, "Seçin");
        dynAppendFieldClass(wrap, "Motor gücü", "Motor gücü", motorG, true, "field--select");

        var cekis = document.createElement("select");
        fillSel(cekis, ["Önden Çekiş", "Arkadan İtiş", "4x4", "AWD"], "Seçin");
        dynAppendFieldClass(wrap, "Çekiş", "Çekiş", cekis, true, "field--select");

        var renk = document.createElement("select");
        fillSel(renk, ["Beyaz", "Siyah", "Gri", "Gümüş", "Mavi", "Kırmızı", "Yeşil", "Kahverengi", "Sarı"], "Seçin");
        dynAppendFieldClass(wrap, "Renk", "Renk", renk, true, "field--select");

        appendYesNoSegment(wrap, "Garanti", "Garanti", true);
        appendYesNoSegment(wrap, "Ağır hasar kaydı", "Ağır hasar kaydı", true);
        appendYesNoSegment(wrap, "Takas", "Takas", true);

        var plaka = document.createElement("select");
        fillSel(plaka, ["Türkiye Plakalı", "Yabancı Plakalı", "Belirtilmemiş"], "Seçin");
        dynAppendFieldClass(wrap, "Plaka / Uyruk", "Plaka / uyruk", plaka, true, "field--select");

        var kimden = document.createElement("select");
        fillSel(kimden, ["Sahibinden", "Mağazadan", "Yetkili Bayiden"], "Seçin");
        dynAppendFieldClass(wrap, "Kimden", "Kimden", kimden, true, "field--select");
        return;
      }

      wrap.className = "dynamic-fields dynamic-fields--grid";

      if (cat.parent === "Emlak") {
        var slug = cat.slug;
        var tapuOptions = ["Kat mülkiyetli", "Kat irtifaklı", "Hisseli", "Arsa Tapulu"];
        if (slug === "emlak-arsa") {
          var arsaTemel = dynSection(wrap, "Temel Bilgiler");
          var imar = document.createElement("select");
          fillSel(imar, KONUT_IMAR_OPTIONS, "Seçin");
          dynAppend(arsaTemel, "İmar durumu", "İmar durumu", imar, true);
          var arsaM2 = document.createElement("select");
          fillSel(arsaM2, ["0-250", "250-500", "500-1000", "1000-2000", "2000+"], "Seçin");
          dynAppend(arsaTemel, "m²", "m²", arsaM2, true);
          appendYesNoSegment(arsaTemel, "Krediye uygun", "Krediye uygun", true);
          appendYesNoSegment(arsaTemel, "Takasa uygun", "Takasa uygun", true);
          var tapuArsa = document.createElement("select");
          fillSel(tapuArsa, ["Müstakil Parsel", "Hisseli", "Tahsis"], "Seçin");
          dynAppend(arsaTemel, "Tapu durumu", "Tapu durumu", tapuArsa, true);
          var arsaKonum = dynSection(wrap, "Konum ve Durum");
          dynAppend(arsaKonum, "Ada no", "Ada no", (function () { var i = document.createElement("input"); i.type = "text"; return i; })(), false);
          dynAppend(arsaKonum, "Parsel no", "Parsel no", (function () { var i = document.createElement("input"); i.type = "text"; return i; })(), false);
          dynAppend(arsaKonum, "Pafta no", "Pafta no", (function () { var i = document.createElement("input"); i.type = "text"; return i; })(), false);
          var kaksArsa = document.createElement("select");
          fillSel(kaksArsa, KONUT_KAKS_OPTIONS, "Seçin");
          dynAppend(arsaKonum, "KAKS (emsal)", "KAKS (emsal)", kaksArsa, false);
          var gabariArsa = document.createElement("select");
          fillSel(gabariArsa, KONUT_GABARI_OPTIONS, "Seçin");
          dynAppend(arsaKonum, "Gabari", "Gabari", gabariArsa, false);
          return;
        }
        if (slug === "emlak-otel" || slug === "emlak-turistik") {
          var otelTemel = dynSection(wrap, "Temel Bilgiler");
          var tesisTur = document.createElement("select");
          fillSel(tesisTur, ["Otel", "Butik Otel", "Apart Otel", "Pansiyon", "Tatil Köyü"], "Seçin");
          dynAppend(otelTemel, "Tesis türü", "Tesis türü", tesisTur, true);
          var yatak = document.createElement("select");
          fillSel(yatak, OTEL_YATAK_OPTIONS, "Seçin");
          dynAppend(otelTemel, "Yatak sayısı", "Yatak sayısı", yatak, true);
          var acik = document.createElement("select");
          fillSel(acik, OTEL_ALAN_OPTIONS, "Seçin");
          dynAppend(otelTemel, "Açık alan m²", "Açık alan m²", acik, true);
          var kapali = document.createElement("select");
          fillSel(kapali, OTEL_ALAN_OPTIONS, "Seçin");
          dynAppend(otelTemel, "Kapalı alan m²", "Kapalı alan m²", kapali, true);
          var otelFizik = dynSection(wrap, "Fiziksel Özellikler");
          appendYesNoSegment(otelFizik, "Zemin etüdü", "Zemin etüdü", true);
          appendYesNoSegment(otelFizik, "Deniz manzarası", "Deniz manzarası", false);
          var ydur = document.createElement("select");
          fillSel(ydur, ["Yeni", "İyi", "Orta", "Eski"], "Seçin");
          dynAppend(otelFizik, "Yapının durumu", "Yapının durumu", ydur, true);
          var isitO = document.createElement("select");
          fillSel(isitO, KONUT_ISITMA_OPTIONS, "Seçin");
          dynAppend(otelFizik, "Isıtma", "Isıtma", isitO, true);
          var otoO = document.createElement("select");
          fillSel(otoO, KONUT_OTOPARK_OPTIONS, "Seçin");
          dynAppend(otelFizik, "Otopark", "Otopark", otoO, true);
          appendYesNoSegment(otelFizik, "Asansör", "Asansör", true);
          var otelKonum = dynSection(wrap, "Konum ve Durum");
          var tapuO = document.createElement("select");
          fillSel(tapuO, tapuOptions, "Seçin");
          dynAppend(otelKonum, "Tapu durumu", "Tapu durumu", tapuO, true);
          return;
        }
        if (slug === "emlak-isyeri") {
          var isTemel = dynSection(wrap, "Temel Bilgiler");
          var isTur = document.createElement("select");
          fillSel(isTur, ["Ofis", "Dükkan & Mağaza", "Büro", "Plaza Katı", "Depo", "Atölye", "İmalathane"], "Seçin");
          dynAppend(isTemel, "Tür", "Tür", isTur, true);
          var isBrut = document.createElement("select");
          fillSel(isBrut, KONUT_BRUT_OPTIONS, "Seçin");
          dynAppend(isTemel, "m² brüt", "Brüt m²", isBrut, true);
          var isNet = document.createElement("select");
          fillSel(isNet, KONUT_NET_OPTIONS, "Seçin");
          dynAppend(isTemel, "m² net", "Net m²", isNet, true);
          var isBol = document.createElement("select");
          fillSel(isBol, ["1", "2", "3", "4", "5+"], "Seçin");
          dynAppend(isTemel, "Oda / Bölme sayısı", "Oda / Bölme sayısı", isBol, true);
          var isKat = document.createElement("select");
          fillSel(isKat, KONUT_KAT_OPTIONS, "Seçin");
          dynAppend(isTemel, "Bulunduğu kat", "Bulunduğu kat", isKat, true);
          var isKatS = document.createElement("select");
          fillSel(isKatS, KONUT_KAT_SAYISI_OPTIONS, "Seçin");
          dynAppend(isTemel, "Kat sayısı", "Kat sayısı", isKatS, true);
          var isIc = dynSection(wrap, "İç Özellikler");
          var isIsit = document.createElement("select");
          fillSel(isIsit, KONUT_ISITMA_OPTIONS, "Seçin");
          dynAppend(isIc, "Isıtma", "Isıtma", isIsit, true);
          var isWc = document.createElement("select");
          fillSel(isWc, ["1", "2", "3+"], "Seçin");
          dynAppend(isIc, "WC sayısı", "WC sayısı", isWc, true);
          appendYesNoSegment(isIc, "Asansör", "Asansör", true);
          var isOt = document.createElement("select");
          fillSel(isOt, KONUT_OTOPARK_OPTIONS, "Seçin");
          dynAppend(isIc, "Otopark", "Otopark", isOt, true);
          var isKul = document.createElement("select");
          fillSel(isKul, KONUT_KULLANIM_OPTIONS, "Seçin");
          dynAppend(isIc, "Kullanım durumu", "Kullanım durumu", isKul, true);
          var isAid = document.createElement("select");
          fillSel(isAid, KONUT_AIDAT_OPTIONS, "Seçin");
          dynAppend(isIc, "Aidat", "Aidat", isAid, false);
          var isTapu = document.createElement("select");
          fillSel(isTapu, tapuOptions, "Seçin");
          dynAppend(isIc, "Tapu durumu", "Tapu durumu", isTapu, true);
          appendYesNoSegment(isIc, "Takasa uygun", "Takasa uygun", true);
          return;
        }
        if (slug === "emlak-bina") {
          var bTemel = dynSection(wrap, "Temel Bilgiler");
          var bTopKat = document.createElement("select");
          fillSel(bTopKat, KONUT_KAT_SAYISI_OPTIONS, "Seçin");
          dynAppend(bTemel, "Toplam kat sayısı", "Toplam kat sayısı", bTopKat, true);
          var bBag = document.createElement("select");
          fillSel(bBag, ["1-5", "6-10", "11-20", "20+"], "Seçin");
          dynAppend(bTemel, "Toplam bağımsız bölüm", "Toplam bağımsız bölüm", bBag, true);
          var bKul = document.createElement("select");
          fillSel(bKul, KONUT_KULLANIM_OPTIONS, "Seçin");
          dynAppend(bTemel, "Kullanım durumu", "Kullanım durumu", bKul, true);
          var bIc = dynSection(wrap, "İç Özellikler");
          appendYesNoSegment(bIc, "Asansör", "Asansör", true);
          var bOt = document.createElement("select");
          fillSel(bOt, KONUT_OTOPARK_OPTIONS, "Seçin");
          dynAppend(bIc, "Otopark", "Otopark", bOt, true);
          var bIs = document.createElement("select");
          fillSel(bIs, KONUT_ISITMA_OPTIONS, "Seçin");
          dynAppend(bIc, "Isıtma", "Isıtma", bIs, true);
          var bYas = document.createElement("select");
          fillSel(bYas, KONUT_BINA_YASI_OPTIONS, "Seçin");
          dynAppend(bIc, "Yaş", "Yaş", bYas, true);
          var bTapu = document.createElement("select");
          fillSel(bTapu, tapuOptions, "Seçin");
          dynAppend(bIc, "Tapu durumu", "Tapu durumu", bTapu, true);
          appendYesNoSegment(bIc, "Krediye uygun", "Krediye uygun", true);
          return;
        }
        if (slug === "emlak-devre") {
          var dTemel = dynSection(wrap, "Temel Bilgiler");
          var dDonem = document.createElement("select");
          fillSel(dDonem, ["Yaz", "Kış", "İlkbahar", "Sonbahar", "Yıllık dönüşümlü"], "Seçin");
          dynAppend(dTemel, "Dönem", "Dönem", dDonem, true);
          var dOda = document.createElement("select");
          fillSel(dOda, KONUT_ODA_OPTIONS, "Seçin");
          dynAppend(dTemel, "Oda sayısı", "Oda sayısı", dOda, true);
          var dBrut = document.createElement("select");
          fillSel(dBrut, KONUT_BRUT_OPTIONS, "Seçin");
          dynAppend(dTemel, "m² brüt", "Brüt m²", dBrut, true);
          appendYesNoSegment(dTemel, "Eşyalı", "Eşyalı", true);
          appendYesNoSegment(dTemel, "Site içerisinde", "Site içerisinde", true);
          var dAid = document.createElement("select");
          fillSel(dAid, KONUT_AIDAT_OPTIONS, "Seçin");
          dynAppend(dTemel, "Aidat", "Aidat", dAid, false);
          var dHak = document.createElement("select");
          fillSel(dHak, ["Tapulu", "Sözleşmeli"], "Seçin");
          dynAppend(dTemel, "Kullanım hakkı türü", "Kullanım hakkı türü", dHak, true);
          return;
        }
        var temel = dynSection(wrap, "Temel Bilgiler");
        var emlakTipi = document.createElement("select");
        fillSel(emlakTipi, ["Satılık Daire", "Kiralık Daire", "Satılık Residence", "Kiralık Residence", "Müstakil Ev", "Villa"], "Seçin");
        dynAppend(temel, "Emlak tipi", "Emlak tipi", emlakTipi, true);
        var odaKonut = document.createElement("select");
        fillSel(odaKonut, KONUT_ODA_OPTIONS, "Seçin");
        dynAppend(temel, "Oda sayısı", "Oda sayısı", odaKonut, true);
        var salon = document.createElement("select");
        fillSel(salon, KONUT_SALON_OPTIONS, "Seçin");
        dynAppend(temel, "Salon sayısı", "Salon sayısı", salon, true);
        var brut = document.createElement("select");
        fillSel(brut, KONUT_BRUT_OPTIONS, "Seçin");
        dynAppend(temel, "m² brüt", "Brüt m²", brut, true);
        var net = document.createElement("select");
        fillSel(net, KONUT_NET_OPTIONS, "Seçin");
        dynAppend(temel, "m² net", "Net m²", net, true);
        var binaYasi = document.createElement("select");
        fillSel(binaYasi, KONUT_BINA_YASI_OPTIONS, "Seçin");
        dynAppend(temel, "Bina yaşı", "Bina yaşı", binaYasi, true);
        var bulunduguKat = document.createElement("select");
        fillSel(bulunduguKat, KONUT_KAT_OPTIONS, "Seçin");
        dynAppend(temel, "Bulunduğu kat", "Bulunduğu kat", bulunduguKat, true);
        var katSayisi = document.createElement("select");
        fillSel(katSayisi, KONUT_KAT_SAYISI_OPTIONS, "Seçin");
        dynAppend(temel, "Kat sayısı", "Kat sayısı", katSayisi, true);
        var fiziksel = dynSection(wrap, "İç Özellikler");
        var isit = document.createElement("select");
        fillSel(isit, KONUT_ISITMA_OPTIONS, "Seçin");
        dynAppend(fiziksel, "Isıtma", "Isıtma", isit, true);
        var banyo = document.createElement("select");
        fillSel(banyo, KONUT_BANYO_OPTIONS, "Seçin");
        dynAppend(fiziksel, "Banyo sayısı", "Banyo sayısı", banyo, true);
        appendRadioSegment(fiziksel, "Mutfak tipi", "Mutfak tipi", ["Açık", "Kapalı"], true);
        appendRadioSegment(fiziksel, "Balkon", "Balkon", ["Var", "Yok"], true);
        appendRadioSegment(fiziksel, "Asansör", "Asansör", ["Var", "Yok"], true);
        var otopark = document.createElement("select");
        fillSel(otopark, KONUT_OTOPARK_OPTIONS, "Seçin");
        dynAppend(fiziksel, "Otopark", "Otopark", otopark, true);
        appendYesNoSegment(fiziksel, "Eşyalı", "Eşyalı", true);
        var durumKart = dynSection(wrap, "Konum ve Durum");
        var kull = document.createElement("select");
        fillSel(kull, KONUT_KULLANIM_OPTIONS, "Seçin");
        dynAppend(durumKart, "Kullanım durumu", "Kullanım durumu", kull, true);
        appendYesNoSegment(durumKart, "Site içerisinde", "Site içerisinde", true);
        dynAppend(durumKart, "Site adı", "Site adı", (function () { var i = document.createElement("input"); i.type = "text"; return i; })(), false);
        (function () {
          var siteNameEl = durumKart.querySelector('[data-spec-key="Site adı"]');
          var radios = durumKart.querySelectorAll('input[type="radio"][data-spec-key="Site içerisinde"]');
          function syncSiteName() {
            if (!siteNameEl) return;
            var yes = false;
            radios.forEach(function (r) {
              if (r.checked && r.value === "Evet") yes = true;
            });
            siteNameEl.disabled = !yes;
            if (!yes) siteNameEl.value = "";
          }
          radios.forEach(function (r) {
            r.addEventListener("change", syncSiteName);
          });
          syncSiteName();
        })();
        var aidat = document.createElement("select");
        fillSel(aidat, KONUT_AIDAT_OPTIONS, "Seçin");
        dynAppend(durumKart, "Aidat", "Aidat", aidat, false);
        appendYesNoSegment(durumKart, "Krediye uygun", "Krediye uygun", true);
        var tapu = document.createElement("select");
        fillSel(tapu, tapuOptions, "Seçin");
        dynAppend(durumKart, "Tapu durumu", "Tapu durumu", tapu, true);
        var depozito = document.createElement("select");
        fillSel(depozito, KONUT_DEPOZITO_OPTIONS, "Seçin");
        dynAppend(durumKart, "Depozito", "Depozito", depozito, false);
        return;
      }

      if (cat.parent === "Alışveriş") {
        dynAppend(wrap, "Marka", "Marka", (function () {
          var i = document.createElement("input");
          i.type = "text";
          return i;
        })(), true);
        dynAppend(wrap, "Model", "Model / ürün", (function () {
          var i = document.createElement("input");
          i.type = "text";
          return i;
        })(), true);
        var dur = document.createElement("select");
        fillSel(dur, ["Sıfır", "İkinci el", "Outlet"], "Seçin");
        dynAppend(wrap, "Durum", "Durum", dur, true);
        dynAppend(wrap, "Garanti", "Garanti", (function () {
          var i = document.createElement("input");
          i.type = "text";
          return i;
        })(), false);
        var fat = document.createElement("select");
        fillSel(fat, ["Var", "Yok"], "Seçin");
        dynAppend(wrap, "Fatura", "Fatura", fat, true);
        var tak = document.createElement("select");
        fillSel(tak, ["Evet", "Hayır"], "Seçin");
        dynAppend(wrap, "Takas", "Takas", tak, true);
        return;
      }

      if (cat.parent === "Hizmetler") {
        dynAppend(wrap, "Hizmet türü", "Hizmet türü", (function () {
          var i = document.createElement("input");
          i.type = "text";
          return i;
        })(), true);
        dynAppend(wrap, "Hizmet bölgesi", "Hizmet bölgesi", (function () {
          var i = document.createElement("input");
          i.type = "text";
          return i;
        })(), true);
        dynAppend(wrap, "Deneyim yılı", "Deneyim (yıl)", (function () {
          var i = document.createElement("input");
          i.type = "number";
          i.min = "0";
          return i;
        })(), false);
        var bk = document.createElement("select");
        fillSel(bk, ["Bireysel", "Kurumsal", "Her ikisi"], "Seçin");
        dynAppend(wrap, "Bireysel / Kurumsal", "Hedef kitle", bk, true);
        var yer = document.createElement("select");
        fillSel(yer, ["Evet", "Hayır"], "Seçin");
        dynAppend(wrap, "Yerinde hizmet", "Yerinde hizmet", yer, true);
        dynAppend(wrap, "Online hizmet", "Online / uzaktan", (function () {
          var i = document.createElement("input");
          i.type = "text";
          i.placeholder = "Örn. Randevu, teklif";
          return i;
        })(), false);
      }
    }

    function collectSpecs() {
      var specs = {};
      var cat0 = getSelectedCategory();
      if (cat0.parent === "Vasıta") {
        var vb = $("vehicleBrand");
        var vs = $("vehicleSeries");
        var vm = $("vehicleModel");
        if (vb && vs && vm) {
          specs["Marka"] = vb.value;
          specs["Seri"] = vs.value;
          specs["Model"] = vm.value;
        }
      }
      document.querySelectorAll("#dynamicFields input[type=radio][data-spec-key]").forEach(function (el) {
        if (!el.checked) return;
        var k = el.getAttribute("data-spec-key");
        if (k) specs[k] = el.value;
      });
      document
        .querySelectorAll(
          "#dynamicFields select[data-spec-key], #dynamicFields textarea[data-spec-key], #dynamicFields input:not([type=radio])[data-spec-key]"
        )
        .forEach(function (inp) {
          var k = inp.getAttribute("data-spec-key");
          if (k) specs[k] = inp.value;
        });
      return JetleAPI.sanitizeSpecs(specs);
    }

    function pickFromSpecs(specs, keys) {
      for (var i = 0; i < keys.length; i++) {
        var v = specs[keys[i]];
        if (v != null && String(v).trim() !== "") return String(v).trim();
      }
      return "";
    }

    function collectStructuredSpecs(specs, cat) {
      var groups = { housingSpecs: null, landSpecs: null, hotelSpecs: null, realEstateSpecs: null };
      if (cat.parent !== "Emlak") return groups;
      var realEstateSpecs = {
        propertyType: pickFromSpecs(specs, ["Emlak tipi", "Tür"]),
        roomCount: pickFromSpecs(specs, ["Oda sayısı"]),
        livingRoomCount: pickFromSpecs(specs, ["Salon sayısı"]),
        grossAreaRange: pickFromSpecs(specs, ["m² brüt", "Brüt m²"]),
        netAreaRange: pickFromSpecs(specs, ["m² net", "Net m²"]),
        buildingAge: pickFromSpecs(specs, ["Bina yaşı", "Yaş"]),
        floorLocation: pickFromSpecs(specs, ["Bulunduğu kat"]),
        totalFloors: pickFromSpecs(specs, ["Kat sayısı", "Toplam kat sayısı"]),
        heatingType: pickFromSpecs(specs, ["Isıtma"]),
        bathroomCount: pickFromSpecs(specs, ["Banyo sayısı", "WC sayısı"]),
        kitchenType: pickFromSpecs(specs, ["Mutfak tipi", "Mutfak"]),
        balcony: pickFromSpecs(specs, ["Balkon"]),
        elevator: pickFromSpecs(specs, ["Asansör"]),
        parkingType: pickFromSpecs(specs, ["Otopark"]),
        furnished: pickFromSpecs(specs, ["Eşyalı"]),
        usageStatus: pickFromSpecs(specs, ["Kullanım durumu"]),
        inSite: pickFromSpecs(specs, ["Site içerisinde", "Site içinde"]),
        siteName: pickFromSpecs(specs, ["Site adı"]),
        duesRange: pickFromSpecs(specs, ["Aidat"]),
        mortgageEligible: pickFromSpecs(specs, ["Krediye uygun"]),
        titleStatus: pickFromSpecs(specs, ["Tapu durumu"]),
        depositRange: pickFromSpecs(specs, ["Depozito"]),
        zoningStatus: pickFromSpecs(specs, ["İmar durumu"]),
        adaNo: pickFromSpecs(specs, ["Ada no"]),
        parselNo: pickFromSpecs(specs, ["Parsel no"]),
        paftaNo: pickFromSpecs(specs, ["Pafta no"]),
        emsal: pickFromSpecs(specs, ["KAKS (Emsal)", "KAKS (emsal)", "KAKS"]),
        gabari: pickFromSpecs(specs, ["Gabari"]),
        bedCount: pickFromSpecs(specs, ["Yatak sayısı"]),
        openAreaRange: pickFromSpecs(specs, ["Açık alan m²"]),
        closedAreaRange: pickFromSpecs(specs, ["Kapalı alan m²"]),
        groundSurvey: pickFromSpecs(specs, ["Zemin etüdü"]),
        buildingCondition: pickFromSpecs(specs, ["Yapı durumu", "Yapının durumu"]),
        facilityType: pickFromSpecs(specs, ["Tesis türü"])
      };
      realEstateSpecs = JetleAPI.sanitizeSpecs(realEstateSpecs);
      if (Object.keys(realEstateSpecs).length) groups.realEstateSpecs = realEstateSpecs;
      if (cat.slug === "emlak-konut") groups.housingSpecs = realEstateSpecs;
      else if (cat.slug === "emlak-arsa") groups.landSpecs = realEstateSpecs;
      else if (cat.slug === "emlak-otel" || cat.slug === "emlak-turistik") groups.hotelSpecs = realEstateSpecs;
      return groups;
    }

    function parsePriceRaw() {
      var raw = ($("fPrice") && $("fPrice").value) || "";
      var n = parseInt(String(raw).replace(/\D/g, ""), 10);
      return isNaN(n) ? NaN : n;
    }

    function valSpec(key) {
      var catV = getSelectedCategory();
      if (catV.parent === "Vasıta" && (key === "Marka" || key === "Seri" || key === "Model")) {
        var map = { Marka: "vehicleBrand", Seri: "vehicleSeries", Model: "vehicleModel" };
        var el = $(map[key]);
        return el ? String(el.value).trim() : "";
      }
      var found = "";
      document.querySelectorAll("#dynamicFields input[type=radio][data-spec-key]").forEach(function (el) {
        if (el.getAttribute("data-spec-key") === key && el.checked) found = String(el.value).trim();
      });
      if (found) return found;
      document.querySelectorAll("#dynamicFields [data-spec-key]").forEach(function (el) {
        if (el.type === "radio") return;
        if (el.getAttribute("data-spec-key") === key) found = String(el.value).trim();
      });
      return found;
    }

    function validateStep(n) {
      showError("");
      if (n === 1) {
        var c = getSelectedCategory();
        if (!c.parent || !c.slug) {
          showError("Devam etmek için ana ve alt kategori seçmelisiniz.");
          return false;
        }
      }
      if (n === 2) {
        if (!$("fTitle").value.trim()) {
          showError("İlan başlığı zorunludur.");
          return false;
        }
        var pr = parsePriceRaw();
        if (isNaN(pr) || pr < 0) {
          showError("Geçerli bir fiyat girin (yalnızca rakam).");
          return false;
        }
        if (!$("fDesc").value.trim()) {
          showError("Açıklama zorunludur.");
          return false;
        }
        var st = document.querySelector('input[name="sellerType"]:checked');
        if (!st) {
          showError("Satıcı tipini seçin (Sahibinden veya Mağaza).");
          return false;
        }
        var ph = normalizePhone($("fPhone").value);
        if (ph.length < 11) {
          showError("Geçerli bir telefon numarası girin");
          return false;
        }
      }
      if (n === 3) {
        var cat = getSelectedCategory();
        if (cat.parent === "Vasıta") {
          var reqV = [
            "Marka",
            "Seri",
            "Model",
            "Yıl",
            "KM",
            "Yakıt tipi",
            "Vites",
            "Araç durumu",
            "Kasa tipi",
            "Motor hacmi",
            "Motor gücü",
            "Çekiş",
            "Renk",
            "Garanti",
            "Ağır hasar kaydı",
            "Plaka / Uyruk",
            "Takas",
            "Kimden"
          ];
          for (var vi = 0; vi < reqV.length; vi++) {
            if (!valSpec(reqV[vi])) {
              showError(reqV[vi] + " alanı zorunludur.");
              return false;
            }
          }
        } else if (cat.parent === "Emlak") {
          if (cat.slug === "emlak-arsa") {
            if (!valSpec("İmar durumu") || !valSpec("m²")) {
              showError("İmar durumu ve metre kare zorunludur.");
              return false;
            }
          } else if (cat.slug === "emlak-otel" || cat.slug === "emlak-turistik") {
            if (!valSpec("Yatak sayısı") || !valSpec("Kapalı alan m²")) {
              showError("Yatak sayısı ve kapalı alan zorunludur.");
              return false;
            }
          } else if (cat.slug === "emlak-isyeri") {
            if (!valSpec("Tür") || !valSpec("m² brüt") || !valSpec("m² net")) {
              showError("Tür, brüt m² ve net m² zorunludur.");
              return false;
            }
          } else if (cat.slug === "emlak-bina") {
            if (!valSpec("Toplam kat sayısı") || !valSpec("Toplam bağımsız bölüm")) {
              showError("Toplam kat sayısı ve bağımsız bölüm zorunludur.");
              return false;
            }
          } else if (cat.slug === "emlak-devre") {
            if (!valSpec("Dönem") || !valSpec("Oda sayısı")) {
              showError("Dönem ve oda sayısı zorunludur.");
              return false;
            }
          } else {
            if (!valSpec("Emlak tipi") || !valSpec("m² brüt") || !valSpec("m² net") || !valSpec("Oda sayısı")) {
              showError("Emlak tipi, m² ve oda sayısı zorunludur.");
              return false;
            }
          }
        } else if (cat.parent === "Alışveriş") {
          if (!valSpec("Marka") || !valSpec("Model") || !valSpec("Durum")) {
            showError("Marka, model ve durum zorunludur.");
            return false;
          }
        } else if (cat.parent === "Hizmetler") {
          if (!valSpec("Hizmet türü") || !valSpec("Hizmet bölgesi")) {
            showError("Hizmet türü ve bölge zorunludur.");
            return false;
          }
        }
      }
      if (n === 4) {
        if (anyUploadInProgress()) {
          showError("Medya yükleme devam ediyor. Lütfen yükleme tamamlanmadan devam etmeyin.");
          return false;
        }
        var pendingMedia = imageItems.some(function (it) { return !it.url || it.uploadState === "error"; });
        if (pendingMedia) {
          showError("Bazı fotoğraflar yüklenemedi veya tamamlanmadı. Lütfen yüklemeyi tamamlayın.");
          return false;
        }
        syncLocationFromInputs();
        var hasCityDistrict = !!(locationState.city && locationState.district);
        var hasMapPoint = locationState.lat != null && locationState.lng != null;
        if (!hasCityDistrict && !hasMapPoint) {
          showError("Konum için şehir + ilçe seçin veya haritadan nokta belirleyin.");
          return false;
        }
        showPhotoWarn(!imageItems.length);
      }
      return true;
    }

    function buildSummary() {
      var cat = getSelectedCategory();
      var st = document.querySelector('input[name="sellerType"]:checked');
      var pr = parsePriceRaw();
      syncLocationFromInputs();
      var locSummary = locationState.city && locationState.district
        ? locationState.city + " / " + locationState.district
        : (locationState.lat != null && locationState.lng != null
          ? Number(locationState.lat).toFixed(5) + ", " + Number(locationState.lng).toFixed(5)
          : "Belirtilmedi");
      $("sumTitle").textContent = $("fTitle").value.trim();
      $("sumPrice").textContent = formatPrice(pr);
      $("sumLoc").textContent = locSummary;
      $("sumCat").textContent = cat.parent + " › " + cat.sub;
      $("sumSeller").textContent = st ? st.value : "";
      $("sumPhone").textContent = formatPhoneDisplay($("fPhone").value);
      $("sumDesc").textContent = $("fDesc").value.trim();

      var specMount = $("sumSpecs");
      if (specMount) {
        while (specMount.firstChild) specMount.removeChild(specMount.firstChild);
        var sp = collectSpecs();
        Object.keys(sp).forEach(function (k) {
          if (!String(sp[k]).trim()) return;
          var row = document.createElement("div");
          row.className = "summary-kv-row";
          var l = document.createElement("span");
          l.className = "summary-kv-label";
          l.textContent = k;
          var v = document.createElement("strong");
          v.className = "summary-kv-value";
          v.textContent = sp[k];
          row.appendChild(l);
          row.appendChild(v);
          specMount.appendChild(row);
        });
      }

      var imgMount = $("sumImages");
      if (imgMount) {
        while (imgMount.firstChild) imgMount.removeChild(imgMount.firstChild);
        if (!imageItems.length) {
          var em = document.createElement("p");
          em.className = "text-small text-muted summary-no-photo";
          em.textContent = "Görsel eklenmedi; yayın sonrası sistem örnek görsel atayabilir.";
          imgMount.appendChild(em);
        } else {
          imageItems.forEach(function (it, i) {
            var url = it.url;
            var tile = document.createElement("div");
            tile.className = "summary-thumb";
            var im = document.createElement("img");
            im.src = it.thumbUrl || it.url;
            im.alt = "";
            im.loading = "lazy";
            var cap = document.createElement("span");
            cap.className = "summary-thumb-cap";
            var isCover = coverImage ? url === coverImage : i === 0;
            cap.textContent = isCover ? "Kapak" : String(i + 1);
            tile.appendChild(im);
            tile.appendChild(cap);
            imgMount.appendChild(tile);
          });
        }
      }

      var pv = $("previewCard");
      if (pv) {
        while (pv.firstChild) pv.removeChild(pv.firstChild);
        var box = document.createElement("div");
        box.className = "live-card-preview";
        var previewImages = pickMediaImages();
        var pv0 =
          coverImage && previewImages.indexOf(coverImage) !== -1 ? coverImage : previewImages[0];
        if (pv0) {
          var pvSrc = pv0;
          for (var pi = 0; pi < imageItems.length; pi++) {
            if (imageItems[pi].url === pv0) {
              pvSrc = imageItems[pi].thumbUrl || imageItems[pi].url;
              break;
            }
          }
          var img = document.createElement("img");
          img.src = pvSrc;
          img.alt = "";
          img.loading = "lazy";
          box.appendChild(img);
        }
        var body = document.createElement("div");
        body.className = "live-card-preview__body";
        var price = document.createElement("div");
        price.className = "listing-card__price";
        price.textContent = formatPrice(pr);
        var title = document.createElement("div");
        title.className = "listing-card__title";
        title.textContent = $("fTitle").value.trim();
        body.appendChild(price);
        body.appendChild(title);
        box.appendChild(body);
        pv.appendChild(box);
      }
    }

    function validateImageFile(file) {
      if (!file) return "Dosya bulunamadı.";
      var name = String(file.name || "").toLowerCase();
      var mime = String(file.type || "").toLowerCase();
      var okMime = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/pjpeg"].indexOf(mime) !== -1;
      var okExt = /\.(jpe?g|png|webp)$/i.test(name);
      if (mime === "image/gif") return "GIF desteklenmiyor. JPG, PNG veya WebP yükleyin.";
      if (!okMime && !okExt) return "Desteklenmeyen format: " + (file.name || "dosya") + ". JPG, JPEG, PNG veya WebP seçin.";
      if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
        return "Çok büyük dosya: " + (file.name || "") + " (maks. " + Math.round(MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024)) + " MB).";
      }
      return null;
    }

    /** Yüksek çözünürlüğü web için indirger: ana görsel ~1600 px, ayrı küçük önizleme; WebP tercih, yoksa JPEG. */
    function optimizeImageFile(file) {
      function resizeCanvasFromImage(sourceImg, maxEdge) {
        var ratio = Math.min(1, maxEdge / Math.max(sourceImg.width, sourceImg.height));
        var w = Math.max(1, Math.round(sourceImg.width * ratio));
        var h = Math.max(1, Math.round(sourceImg.height * ratio));
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        var ctx = c.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(sourceImg, 0, 0, w, h);
        return c;
      }
      function encodeWebpOrJpeg(canvas, webpQ, jpegQ) {
        var out = null;
        try {
          out = canvas.toDataURL("image/webp", webpQ);
        } catch (e1) {
          out = null;
        }
        if (!out || out.indexOf("data:image/webp") !== 0) {
          out = canvas.toDataURL("image/jpeg", jpegQ);
        }
        return out;
      }
      function shrinkUnderMaxChars(canvas, maxChars) {
        var out = encodeWebpOrJpeg(canvas, 0.76, 0.78);
        var q = 0.74;
        while (out.length > maxChars && q > 0.42) {
          out = canvas.toDataURL("image/jpeg", q);
          q -= 0.06;
        }
        return out;
      }
      return new Promise(function (resolve) {
        var vErr = validateImageFile(file);
        if (vErr) {
          resolve({ ok: false, message: vErr });
          return;
        }
        var reader = new FileReader();
        reader.onload = function () {
          var raw = typeof reader.result === "string" ? reader.result : "";
          if (!raw) {
            resolve({ ok: false, message: "Dosya okunamadı." });
            return;
          }
          var img = new Image();
          img.onload = function () {
            var mainCanvas = resizeCanvasFromImage(img, 1600);
            if (!mainCanvas) {
              resolve({ ok: false, message: "Tarayıcı görüntüyü işleyemedi." });
              return;
            }
            var mainUrl = shrinkUnderMaxChars(mainCanvas, 2000000);
            var thumbCanvas = resizeCanvasFromImage(img, 480);
            var thumbUrl = thumbCanvas
              ? shrinkUnderMaxChars(thumbCanvas, 320000)
              : mainUrl;
            resolve({ ok: true, url: mainUrl, thumbUrl: thumbUrl });
          };
          img.onerror = function () {
            resolve({ ok: false, message: "Görsel açılamadı: " + (file.name || "dosya") });
          };
          img.src = raw;
        };
        reader.onerror = function () {
          resolve({ ok: false, message: "Dosya okunamadı." });
        };
        reader.readAsDataURL(file);
      });
    }

    function renderPreviews() {
      var box = $("imagePreview");
      if (!box) return;
      while (box.firstChild) box.removeChild(box.firstChild);
      for (var i = 0; i < imageItems.length; i++) {
        (function (idx) {
          var item = imageItems[idx];
          var wrap = document.createElement("div");
          wrap.className = "preview-tile" + (item.url === coverImage ? " preview-tile--cover" : "");
          wrap.draggable = true;
          wrap.addEventListener("dragstart", function (ev) {
            draggingPhotoIndex = idx;
            wrap.classList.add("is-dragging");
            if (ev && ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
          });
          wrap.addEventListener("dragend", function () {
            wrap.classList.remove("is-dragging");
            draggingPhotoIndex = -1;
            box.querySelectorAll(".preview-tile").forEach(function (x) { x.classList.remove("is-drop-target"); });
          });
          wrap.addEventListener("dragover", function (ev) {
            if (draggingPhotoIndex < 0 || draggingPhotoIndex === idx) return;
            ev.preventDefault();
            wrap.classList.add("is-drop-target");
          });
          wrap.addEventListener("dragleave", function () {
            wrap.classList.remove("is-drop-target");
          });
          wrap.addEventListener("drop", function (ev) {
            ev.preventDefault();
            wrap.classList.remove("is-drop-target");
            if (draggingPhotoIndex < 0 || draggingPhotoIndex === idx) return;
            var moving = imageItems[draggingPhotoIndex];
            imageItems.splice(draggingPhotoIndex, 1);
            imageItems.splice(idx, 0, moving);
            if (coverImage) {
              var cidx = imageItems.findIndex(function (x) { return x.url === coverImage; });
              if (cidx > 0) {
                var coverItem = imageItems[cidx];
                imageItems.splice(cidx, 1);
                imageItems.unshift(coverItem);
              }
            }
            renderPreviews();
          });
          var img = document.createElement("img");
          img.src = item.thumbUrl || item.url;
          img.alt = "";
          img.loading = "lazy";
          var cap = document.createElement("span");
          cap.className = "preview-cap";
          cap.textContent = "Fotoğraf " + String(idx + 1);
          if (item.uploadState === "uploading" || item.uploadState === "error") {
            var pTrack = document.createElement("span");
            pTrack.className = "preview-item-progress";
            var pFill = document.createElement("span");
            pFill.className = "preview-item-progress__fill" + (item.uploadState === "error" ? " is-error" : "");
            pFill.style.width = Math.round(item.uploadProgress || 0) + "%";
            pTrack.appendChild(pFill);
            wrap.appendChild(pTrack);
          }
          if (item.uploadState === "uploading") {
            var busy = document.createElement("span");
            busy.className = "preview-upload-badge preview-upload-badge--uploading";
            busy.textContent = "Yükleniyor " + Math.round(item.uploadProgress || 0) + "%";
            wrap.appendChild(busy);
          } else if (item.uploadState === "error") {
            var err = document.createElement("span");
            err.className = "preview-upload-badge preview-upload-badge--error";
            err.textContent = "Hata";
            wrap.appendChild(err);
          } else if (item.uploadState === "done") {
            var ok = document.createElement("span");
            ok.className = "preview-upload-badge preview-upload-badge--done";
            ok.textContent = "✓";
            wrap.appendChild(ok);
          }
          var coverBtn = document.createElement("button");
          coverBtn.type = "button";
          coverBtn.className = "preview-cover-btn" + (item.url === coverImage ? " is-cover" : "");
          coverBtn.textContent = item.url === coverImage ? "Kapak" : "Kapak yap";
          coverBtn.addEventListener("click", function () {
            coverImage = item.url;
            var pos = imageItems.indexOf(item);
            if (pos > 0) {
              imageItems.splice(pos, 1);
              imageItems.unshift(item);
            }
            renderPreviews();
            updatePhotoCountInfo();
          });
          var tb = document.createElement("div");
          tb.className = "preview-toolbar";
          var up = document.createElement("button");
          up.type = "button";
          up.className = "preview-move";
          up.textContent = "Yukarı";
          up.disabled = idx === 0;
          up.addEventListener("click", function () {
            if (idx <= 0) return;
            var tmp = imageItems[idx - 1];
            imageItems[idx - 1] = imageItems[idx];
            imageItems[idx] = tmp;
            renderPreviews();
          });
          var down = document.createElement("button");
          down.type = "button";
          down.className = "preview-move";
          down.textContent = "Aşağı";
          down.disabled = idx >= imageItems.length - 1;
          down.addEventListener("click", function () {
            if (idx >= imageItems.length - 1) return;
            var tmp2 = imageItems[idx + 1];
            imageItems[idx + 1] = imageItems[idx];
            imageItems[idx] = tmp2;
            renderPreviews();
          });
          tb.appendChild(up);
          tb.appendChild(down);
          var rm = document.createElement("button");
          rm.type = "button";
          rm.className = "preview-remove";
          rm.setAttribute("aria-label", "Kaldır");
          rm.textContent = "×";
          rm.addEventListener("click", function () {
            var at = imageItems.indexOf(item);
            if (at === -1) return;
            if (mediaUploadEnabled() && item.assetId) {
              var tk = getBackendAccessToken();
              if (tk) {
                var base = (window.JetleAPI && JetleAPI.API_GATEWAY && JetleAPI.API_GATEWAY.baseUrl) || "";
                var full = base ? base.replace(/\/+$/, "") + "/api/media/" + encodeURIComponent(item.assetId) : "/api/media/" + encodeURIComponent(item.assetId);
                fetch(full, { method: "DELETE", headers: { Authorization: "Bearer " + tk }, credentials: "include" }).catch(function () {});
              }
            }
            imageItems.splice(at, 1);
            if (coverImage === item.url) coverImage = imageItems[0] ? imageItems[0].url : "";
            renderPreviews();
            showPhotoWarn(!imageItems.length);
            updatePhotoCountInfo();
          });
          wrap.appendChild(coverBtn);
          wrap.appendChild(rm);
          wrap.appendChild(tb);
          wrap.appendChild(img);
          wrap.appendChild(cap);
          box.appendChild(wrap);
        })(i);
      }
      updatePhotoCountInfo();
    }

    function handleFiles(files) {
      var incoming = Array.prototype.slice.call(files || [], 0);
      if (!incoming.length) return;
      var remain = MAX_IMAGES - imageItems.length;
      if (remain <= 0) {
        showError("Fotoğraf kotası doldu. En fazla " + MAX_IMAGES + " fotoğraf ekleyebilirsiniz.");
        return;
      }
      var accepted = [];
      var firstReject = null;
      incoming.forEach(function (f) {
        if (!f) return;
        var err = validateImageFile(f);
        if (err) {
          if (!firstReject) firstReject = err;
          return;
        }
        accepted.push(f);
      });
      if (!accepted.length) {
        showError(firstReject || "Uygun fotoğraf bulunamadı. JPG, PNG veya WebP seçin.");
        return;
      }
      if (accepted.length > remain) {
        showError(
          "Bu seçimdeki bazı dosyalar eklenmedi: en fazla " +
            MAX_IMAGES +
            " fotoğrafınız olabilir. Şu an " +
            remain +
            " boş slot kaldı; yalnızca ilk " +
            remain +
            " dosya işlenecek."
        );
        accepted = accepted.slice(0, remain);
      }
      if (mediaUploadEnabled()) {
        setRetryButton("photo", false);
        lastFailedPhotoFiles = null;
        photoBatchCancelRequested = false;
        var pendingCount = accepted.length;
        var completed = 0;
        var failed = 0;
        var uploaded = [];
        accepted.forEach(function (file) {
          var placeholder = {
            localId: "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
            url: "",
            thumbUrl: "",
            uploadState: "uploading",
            uploadProgress: 0,
            fileName: file.name || "foto"
          };
          imageItems.push(placeholder);
          photoUploadQueue.push({ file: file, placeholder: placeholder, retries: 0 });
        });
        renderPreviews();
        updateUploadProgressUi("photo", 1, true);

        function recalcTotalProgress() {
          if (!pendingCount) return;
          var sum = 0;
          imageItems.forEach(function (it) {
            if (it.uploadState === "done") sum += 100;
            else if (it.uploadState === "uploading") sum += Math.max(0, Math.min(100, Number(it.uploadProgress || 0)));
          });
          var pct = Math.round(sum / pendingCount);
          updateUploadProgressUi("photo", pct, true);
        }

        function finalizeBatch() {
          activePhotoUploads = [];
          photoUploadQueue = [];
          var hasErr = failed > 0;
          if (!coverImage && imageItems[0] && imageItems[0].url) coverImage = imageItems[0].url;
          renderPreviews();
          showPhotoWarn(!imageItems.length);
          if (hasErr) {
            setRetryButton("photo", true);
            lastFailedPhotoFiles = accepted.slice();
            showError(failed + " fotoğraf yüklenemedi. 'Tekrar dene' ile yeniden deneyebilirsiniz.");
          } else if (!photoBatchCancelRequested) {
            showError("");
          } else {
            showError("Fotoğraf yükleme iptal edildi.");
          }
          setTimeout(function () { updateUploadProgressUi("photo", 0, false); }, 500);
        }

        function startNext() {
          if (photoBatchCancelRequested) {
            if (!activePhotoUploads.length) finalizeBatch();
            return;
          }
          while (activePhotoUploads.length < PHOTO_PARALLEL_LIMIT && photoUploadQueue.length) {
            (function () {
              var task = photoUploadQueue.shift();
              var req = uploadSingleFileXhr("/api/media/upload-images", "images", task.file, function (pct) {
                task.placeholder.uploadProgress = pct;
                recalcTotalProgress();
                renderPreviews();
              });
              activePhotoUploads.push(req.xhr);
              req.promise.then(function (data) {
                var row = data && data.data && data.data.images && data.data.images[0];
                if (!row || !row.mediumUrl) throw new Error("Fotoğraf yanıtı geçersiz.");
                task.placeholder.assetId = row.id || "";
                task.placeholder.originalUrl = row.originalUrl || row.mediumUrl;
                task.placeholder.mediumUrl = row.mediumUrl || row.originalUrl;
                task.placeholder.thumbUrl = row.thumbUrl || row.mediumUrl || row.originalUrl;
                task.placeholder.url = task.placeholder.mediumUrl;
                task.placeholder.uploadState = "done";
                task.placeholder.uploadProgress = 100;
                uploaded.push(task.file.name + "::" + completed);
              }).catch(function () {
                if (task.retries < 2 && !photoBatchCancelRequested) {
                  task.retries += 1;
                  photoUploadQueue.push(task);
                } else {
                  task.placeholder.uploadState = "error";
                  task.placeholder.uploadError = "Yüklenemedi";
                  failed += 1;
                }
              }).finally(function () {
                completed += 1;
                var ix = activePhotoUploads.indexOf(req.xhr);
                if (ix >= 0) activePhotoUploads.splice(ix, 1);
                if (!photoUploadQueue.length && !activePhotoUploads.length) finalizeBatch();
                else startNext();
              });
            })();
          }
        }
        startNext();
        return;
      }
      Promise.all(accepted.map(optimizeImageFile)).then(function (results) {
        var optErr = null;
        results.forEach(function (r) {
          if (!r || !r.ok) {
            if (r && r.message && !optErr) optErr = r.message;
            return;
          }
          if (typeof r.url === "string" && r.url.indexOf("data:image") === 0) {
            imageItems.push({ url: r.url, thumbUrl: typeof r.thumbUrl === "string" ? r.thumbUrl : r.url });
          }
        });
        if (optErr) showError(optErr);
        else showError("");
        if (!coverImage && imageItems[0]) coverImage = imageItems[0].url;
        renderPreviews();
        showPhotoWarn(!imageItems.length);
      });
    }

    function renderVideoPreview() {
      var box = $("videoPreview");
      var player = $("videoPreviewPlayer");
      var overlay = $("videoPlayOverlay");
      var nameEl = $("videoPreviewName");
      if (!box || !player) return;
      if (!videoItem) {
        box.hidden = true;
        player.removeAttribute("src");
        player.load();
        if (overlay) overlay.classList.remove("is-hidden");
        if (nameEl) {
          nameEl.hidden = true;
          nameEl.textContent = "";
        }
        updateVideoCountInfo();
        return;
      }
      player.src = videoItem.url;
      box.hidden = false;
      if (overlay) overlay.classList.remove("is-hidden");
      if (nameEl) {
        nameEl.hidden = false;
        nameEl.textContent = videoItem.name || "Video";
      }
      updateVideoCountInfo();
    }

    function handleVideoFiles(files) {
      var list = Array.prototype.slice.call(files || [], 0);
      if (!list.length) return;
      if (list.length > 1 || videoItem) {
        showError(
          videoItem
            ? "Zaten bir video eklediniz (1/1). Yenisini yüklemek için önce mevcut videoyu kaldırın."
            : "Aynı anda yalnızca bir video dosyası seçebilirsiniz."
        );
        return;
      }
      var file = list[0];
      var okTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
      var ext = (file.name || "").toLowerCase();
      var okExt = ext.endsWith(".mp4") || ext.endsWith(".mov") || ext.endsWith(".webm");
      if (okTypes.indexOf(file.type) === -1 && !okExt) {
        showError("Bu video formatı desteklenmiyor. Lütfen MP4, MOV veya WebM yükleyin.");
        return;
      }
      if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
        showError(
          "Video dosyası çok büyük. En fazla " + Math.round(MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024)) + " MB yükleyebilirsiniz."
        );
        return;
      }
      videoItem = { url: URL.createObjectURL(file), type: file.type || "video/mp4", name: file.name || "video" };
      if (mediaUploadEnabled()) {
        setRetryButton("video", false);
        lastFailedVideoFile = null;
        updateUploadProgressUi("video", 2, true);
        var tryNo = 0;
        function runVideoUpload() {
          return uploadVideoInChunks(file, function (pct) {
            updateUploadProgressUi("video", pct, true);
          }).catch(function (err) {
            if (!videoChunkUpload.cancelled && tryNo < 2) {
              tryNo += 1;
              return runVideoUpload();
            }
            throw err;
          });
        }
        runVideoUpload()
          .then(function (data) {
            var v = data && data.data ? data.data.video : null;
            if (!v || !v.url) throw new Error("Video yanıtı geçersiz.");
            videoItem = {
              assetId: v.id || "",
              url: v.url,
              type: v.type || "video/mp4",
              size: v.size || 0,
              name: file.name || "video"
            };
            renderVideoPreview();
            showError("");
            updateUploadProgressUi("video", 100, true);
            setTimeout(function () { updateUploadProgressUi("video", 0, false); }, 500);
          })
          .catch(function (err) {
            lastFailedVideoFile = file;
            setRetryButton("video", true);
            updateUploadProgressUi("video", 0, false);
            videoItem = null;
            renderVideoPreview();
            showError(err && err.message ? err.message : "Video yüklenemedi.");
          });
        return;
      }
      renderVideoPreview();
      showError("");
    }

    function buildListingPayload(user) {
      syncLocationFromInputs();
      var cat = getSelectedCategory();
      var st = document.querySelector('input[name="sellerType"]:checked');
      var pr = parsePriceRaw();
      var specs = collectSpecs();
      var structured = collectStructuredSpecs(specs, cat);
      var mediaImages = pickMediaImages();
      var imageMediaObjects = imageItems.map(function (it, i) {
        if (!it.url) return null;
        return {
          assetId: it.assetId || "",
          originalUrl: it.originalUrl || it.url,
          mediumUrl: it.mediumUrl || it.url,
          thumbUrl: it.thumbUrl || it.url,
          isCover: (coverImage ? it.url === coverImage : i === 0),
          order: i
        };
      }).filter(Boolean);
      return {
        id: editingListingId,
        title: $("fTitle").value,
        price: isNaN(pr) ? 0 : pr,
        city: locationState.city,
        district: locationState.district,
        address: locationState.address,
        lat: locationState.lat,
        lng: locationState.lng,
        category: cat.parent,
        subcategory: cat.sub,
        categorySlug: cat.slug,
        sellerType: st ? st.value : "Sahibinden",
        sellerName: user.name,
        phone: formatPhoneDisplay($("fPhone").value),
        description: $("fDesc").value,
        images: mediaImages,
        coverImage: coverImage || (mediaImages[0] || ""),
        video: videoItem ? { assetId: videoItem.assetId || "", url: videoItem.url, type: videoItem.type, size: videoItem.size || 0, name: videoItem.name } : null,
        media: {
          images: imageMediaObjects,
          coverImage: coverImage || (mediaImages[0] || ""),
          video: videoItem ? { assetId: videoItem.assetId || "", url: videoItem.url, type: videoItem.type, size: videoItem.size || 0, name: videoItem.name } : null
        },
        location: {
          city: locationState.city,
          district: locationState.district,
          address: locationState.address,
          lat: locationState.lat,
          lng: locationState.lng
        },
        createdBy: user.id,
        specs: specs,
        housingSpecs: structured.housingSpecs,
        landSpecs: structured.landSpecs,
        hotelSpecs: structured.hotelSpecs,
        realEstateSpecs: structured.realEstateSpecs
      };
    }

    function persistListing(mode) {
      function parseApiError(err) {
        if (!err) return "";
        var status = Number(err.status || 0);
        if (status === 0) return "Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.";
        if (status === 401) return "İlan işlemi için tekrar giriş yapın.";
        if (status === 403) return "Bu ilan üzerinde işlem yetkiniz yok.";
        if (status === 400 && Array.isArray(err.details) && err.details.length) {
          return err.details[0].msg || err.message || "";
        }
        return err.message || "";
      }
      var user = JetleAuth.getCurrentUser();
      if (!user) return;
      var payload = buildListingPayload(user);
      var res = null;
      if (mode === "draft") {
        if (typeof JetleAPI.saveDraft === "function") res = JetleAPI.saveDraft(payload, user.id);
        else if (editingListingId) res = JetleAPI.mergeUserListing(editingListingId, user.id, payload, { status: "draft" });
        else res = { ok: true, listing: JetleAPI.addListing(payload, { status: "draft" }) };
        if (!res || !res.ok) {
          showError((res && res.message) || "Taslak kaydedilemedi.");
          return;
        }
        editingListingId = res.listing && res.listing.id ? res.listing.id : editingListingId;
        showSuccess("Taslak kaydedildi.");
        return;
      }
      if (editingListingId) {
        res = JetleAPI.mergeUserListing(editingListingId, user.id, payload, { status: "pending" });
        if (!res || !res.ok) {
          showError(parseApiError(res) || "İlan güncellenemedi.");
          return;
        }
        window.alert("İlan düzenlendi ve yeniden onaya alındı.");
        window.location.href = "dashboard.html#listings";
        return;
      }
      var created = null;
      if (typeof JetleAPI.createListing === "function") created = JetleAPI.createListing(payload);
      else created = JetleAPI.addListing(payload);
      if (created && created._backendError) {
        showError(parseApiError(created.response) || "İlan gönderilemedi. Lütfen bilgileri kontrol ederek tekrar deneyin.");
        return;
      }
      if (!created) {
        showError("İlan gönderilemedi. Lütfen bilgileri kontrol ederek tekrar deneyin.");
        return;
      }
      window.alert("İlanınız incelemeye gönderildi.");
      window.location.href = "dashboard.html#listings";
    }

    function submitListing() {
      clearNotices();
      if (anyUploadInProgress()) {
        showError("Yükleme tamamlanmadan ilan gönderemezsiniz.");
        return;
      }
      if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) return;
      persistListing("submit");
    }

    function saveListingDraft() {
      clearNotices();
      if (anyUploadInProgress()) {
        showError("Yükleme sürerken taslak kaydedemezsiniz. Lütfen tamamlanmasını bekleyin.");
        return;
      }
      persistListing("draft");
    }

    populateCitySelect("formCity", { placeholder: "Şehir seçin" });
    fillDistrictSelect("formCity", "formDistrict");
    syncLocationFromInputs();
    initMap();
    initPlaceAutocomplete();
    $("formCity").addEventListener("change", function () {
      fillDistrictSelect("formCity", "formDistrict");
      syncLocationFromInputs();
    });
    $("formDistrict").addEventListener("change", function () {
      syncLocationFromInputs();
    });
    var formAddress = $("formAddress");
    if (formAddress) {
      formAddress.addEventListener("input", function () {
        syncLocationFromInputs();
      });
    }
    var mapSearchInput = $("mapSearchInput");
    if (mapSearchInput) {
      mapSearchInput.addEventListener("change", function () {
        if (!window.google || !google.maps) {
          if ($("formAddress")) $("formAddress").value = mapSearchInput.value;
          syncLocationFromInputs();
        }
      });
    }

    $("catParent").addEventListener("change", function () {
      fillSubcategories();
      renderDynamicFields();
      syncVehicleCascadePanel();
    });
    $("catSub").addEventListener("change", function () {
      renderDynamicFields();
      syncVehicleCascadePanel();
    });

    var cp = $("catParent");
    while (cp.options.length > 1) cp.remove(1);
    CATEGORY_TREE.forEach(function (g) {
      var o = document.createElement("option");
      o.value = g.name;
      o.textContent = g.name;
      cp.appendChild(o);
    });

    var phoneInput = $("fPhone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        phoneInput.value = String(phoneInput.value || "").replace(/[^\d\s]/g, "");
      });
    }
    var useProfilePhone = $("fUseProfilePhone");
    if (useProfilePhone) {
      useProfilePhone.addEventListener("change", function () {
        if (useProfilePhone.checked) syncContactPhoneFromProfile();
      });
    }
    syncContactPhoneFromProfile();

    $("btnNext").addEventListener("click", function () {
      clearNotices();
      if (step >= maxStep) return;
      if (!validateStep(step)) return;
      step += 1;
      if (step === 3) renderDynamicFields();
      if (step === 5) buildSummary();
      setStepIndicators();
    });

    var btnFin = $("btnSubmitFinal");
    if (btnFin) {
      btnFin.addEventListener("click", function () {
        submitListing();
      });
    }
    var btnDraft = $("btnSaveDraft");
    if (btnDraft) {
      btnDraft.addEventListener("click", function () {
        saveListingDraft();
      });
    }

    $("btnPrev").addEventListener("click", function () {
      if (step > 1) {
        step -= 1;
        setStepIndicators();
        clearNotices();
      }
    });

    var fi = $("fileInput");
    var btnPick = $("btnPickFiles");
    if (btnPick && fi) {
      btnPick.addEventListener("click", function () {
        fi.click();
      });
    }
    if (fi) {
      fi.addEventListener("change", function () {
        handleFiles(this.files);
        this.value = "";
      });
    }
    var retryPhotoBtn = $("retryPhotoUploadBtn");
    if (retryPhotoBtn) {
      retryPhotoBtn.addEventListener("click", function () {
        if (lastFailedPhotoFiles && lastFailedPhotoFiles.length) handleFiles(lastFailedPhotoFiles);
      });
    }
    var cancelPhotoBtn = $("cancelPhotoUploadBtn");
    if (cancelPhotoBtn) {
      cancelPhotoBtn.addEventListener("click", function () {
        photoBatchCancelRequested = true;
        photoUploadQueue = [];
        activePhotoUploads.forEach(function (xhr) {
          try { xhr.abort(); } catch (e) {}
        });
        activePhotoUploads = [];
        imageItems = imageItems.filter(function (it) { return it.uploadState !== "uploading"; });
        updateUploadProgressUi("photo", 0, false);
        renderPreviews();
      });
    }

    var vi = $("videoInput");
    var btnPickVideo = $("btnPickVideo");
    var videoRemoveBtn = $("videoRemoveBtn");
    if (btnPickVideo && vi) {
      btnPickVideo.addEventListener("click", function () {
        vi.click();
      });
    }
    if (vi) {
      vi.addEventListener("change", function () {
        handleVideoFiles(this.files);
        this.value = "";
      });
    }
    var retryVideoBtn = $("retryVideoUploadBtn");
    if (retryVideoBtn) {
      retryVideoBtn.addEventListener("click", function () {
        if (lastFailedVideoFile) handleVideoFiles([lastFailedVideoFile]);
      });
    }
    var cancelVideoBtn = $("cancelVideoUploadBtn");
    if (cancelVideoBtn) {
      cancelVideoBtn.addEventListener("click", function () {
        videoChunkUpload.cancelled = true;
        if (videoChunkUpload.xhr) {
          try { videoChunkUpload.xhr.abort(); } catch (e) {}
        }
        if (videoChunkUpload.sessionId) {
          backendJson("POST", "/api/media/upload-video/cancel", { sessionId: videoChunkUpload.sessionId }).catch(function () {});
          videoChunkUpload.sessionId = "";
        }
        updateUploadProgressUi("video", 0, false);
        showError("Video yükleme iptal edildi.");
      });
    }
    if (videoRemoveBtn) {
      videoRemoveBtn.addEventListener("click", function () {
        if (mediaUploadEnabled() && videoItem && videoItem.assetId) {
          var tk = getBackendAccessToken();
          if (tk) {
            var base = (window.JetleAPI && JetleAPI.API_GATEWAY && JetleAPI.API_GATEWAY.baseUrl) || "";
            var full = base ? base.replace(/\/+$/, "") + "/api/media/" + encodeURIComponent(videoItem.assetId) : "/api/media/" + encodeURIComponent(videoItem.assetId);
            fetch(full, { method: "DELETE", headers: { Authorization: "Bearer " + tk }, credentials: "include" }).catch(function () {});
          }
        }
        if (videoItem && videoItem.url && String(videoItem.url).indexOf("blob:") === 0) {
          URL.revokeObjectURL(videoItem.url);
        }
        videoItem = null;
        renderVideoPreview();
      });
    }

    (function wireListingFormVideoPreview() {
      var player = $("videoPreviewPlayer");
      var overlay = $("videoPlayOverlay");
      if (!player || !overlay || player._jetleFormVideoWired) return;
      player._jetleFormVideoWired = true;
      overlay.addEventListener("click", function (ev) {
        ev.preventDefault();
        player.play().catch(function () {});
      });
      player.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
      });
      player.addEventListener("pause", function () {
        overlay.classList.remove("is-hidden");
      });
      player.addEventListener("ended", function () {
        overlay.classList.remove("is-hidden");
      });
    })();

    var dz = $("dropZone");
    if (dz) {
      ;["dragenter", "dragover", "dragleave", "drop"].forEach(function (ev) {
        dz.addEventListener(ev, function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      dz.addEventListener("dragover", function () {
        dz.classList.add("upload-drop--hover");
      });
      dz.addEventListener("dragleave", function () {
        dz.classList.remove("upload-drop--hover");
      });
      dz.addEventListener("drop", function (e) {
        dz.classList.remove("upload-drop--hover");
        var dt = e.dataTransfer;
        if (dt && dt.files) handleFiles(dt.files);
      });
      dz.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (fi) fi.click();
        }
      });
    }
    var videoDz = $("videoDropZone");
    if (videoDz) {
      ;["dragenter", "dragover", "dragleave", "drop"].forEach(function (ev) {
        videoDz.addEventListener(ev, function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      videoDz.addEventListener("dragover", function () {
        videoDz.classList.add("upload-drop--hover");
      });
      videoDz.addEventListener("dragleave", function () {
        videoDz.classList.remove("upload-drop--hover");
      });
      videoDz.addEventListener("drop", function (e) {
        videoDz.classList.remove("upload-drop--hover");
        var dt = e.dataTransfer;
        if (dt && dt.files) handleVideoFiles(dt.files);
      });
    }

    var fp = $("fPrice");
    if (fp) {
      fp.addEventListener("blur", function () {
        var n = parsePriceRaw();
        if (!isNaN(n)) fp.value = String(n);
      });
    }

    function applySpecsToWizardForm(specs) {
      if (!specs || typeof specs !== "object") return;
      Object.keys(specs).forEach(function (k) {
        var val = specs[k];
        if (val == null || val === "") return;
        var esc = String(k).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        var nodes = document.querySelectorAll("#dynamicFields [data-spec-key=\"" + esc + "\"]");
        nodes.forEach(function (el) {
          if (el.type === "radio") {
            el.checked = String(el.value) === String(val);
          } else {
            el.value = String(val);
          }
        });
      });
    }

    function tryLoadEditListing() {
      var eid = getQueryParam("edit");
      if (!eid) return;
      var L = JetleAPI.getListingById(eid);
      if (!L || L.createdBy !== u.id) {
        showError("Bu ilanı düzenleyemezsiniz veya bulunamadı.");
        return;
      }
      editingListingId = L.id;
      var h1 = document.querySelector("h1.page-title");
      if (h1) h1.textContent = "İlanı düzenle";
      var lead = document.querySelector(".form-lead");
      if (lead) {
        if (L.status === "draft") lead.textContent = "Taslağınızdan devam ediyorsunuz. Hazır olduğunuzda incelemeye gönderin.";
        else if (L.status === "rejected") lead.textContent = "Düzenleyip tekrar gönderin. İlanınız yeniden incelemeye alınır.";
        else lead.textContent = "Kaydettiğinizde ilan tekrar incelemeye gönderilir.";
      }
      if ($("btnSubmitFinal")) {
        $("btnSubmitFinal").textContent = L.status === "draft" ? "İncelemeye Gönder" : "Değişiklikleri Gönder";
      }
      if ($("fTitle")) $("fTitle").value = L.title || "";
      if ($("fDesc")) $("fDesc").value = L.description || "";
      if ($("fPrice")) $("fPrice").value = L.price != null ? String(L.price) : "";
      if ($("catParent")) $("catParent").value = L.category || "";
      fillSubcategories();
      if ($("catSub") && L.subcategory) {
        var sub = $("catSub");
        for (var oi = 0; oi < sub.options.length; oi++) {
          if (sub.options[oi].value === L.subcategory) {
            sub.selectedIndex = oi;
            break;
          }
        }
      }
      document.querySelectorAll('input[name="sellerType"]').forEach(function (r) {
        r.checked = r.value === (L.sellerType || "Sahibinden");
      });
      if ($("formCity")) $("formCity").value = L.city || (L.location && L.location.city) || "";
      fillDistrictSelect("formCity", "formDistrict");
      if ($("formDistrict")) $("formDistrict").value = L.district || (L.location && L.location.district) || "";
      if ($("formAddress") && L.location) $("formAddress").value = L.location.address || "";
      syncLocationFromInputs();
      if (L.location) {
        setLocationLatLng(L.location.lat, L.location.lng);
        if (mapCtx.map && locationState.lat != null && locationState.lng != null) {
          mapCtx.map.setCenter({ lat: locationState.lat, lng: locationState.lng });
        }
        if (mapCtx.marker && locationState.lat != null && locationState.lng != null) {
          mapCtx.marker.setPosition({ lat: locationState.lat, lng: locationState.lng });
        }
        updateFallbackMarkerUI(locationState.lat, locationState.lng);
      }
      var ph = L.phone || u.phone || "";
      if ($("fPhone")) $("fPhone").value = formatPhoneDisplay(ph);
      if ($("fUseProfilePhone")) $("fUseProfilePhone").checked = false;
      var imgs = L.images && L.images.length ? L.images : (L.media && L.media.images) || [];
      if (imgs.length > MAX_IMAGES) imgs = imgs.slice(0, MAX_IMAGES);
      imageItems = imgs.map(function (url) {
        return { url: url, thumbUrl: url };
      });
      coverImage = L.coverImage || (L.media && L.media.coverImage) || imgs[0] || "";
      renderPreviews();
      showPhotoWarn(!imageItems.length);
      updatePhotoCountInfo();
      if (L.video && L.video.url) {
        videoItem = { url: L.video.url, type: L.video.type || "video/mp4", name: L.video.name || "video" };
        renderVideoPreview();
      }

      renderDynamicFields();
      syncVehicleCascadePanel();
      setTimeout(function () {
        var sp = L.specs || {};
        var vb = $("vehicleBrand");
        if (vb && sp.Marka) {
          vb.value = sp.Marka;
          vb.dispatchEvent(new Event("change", { bubbles: true }));
        }
        setTimeout(function () {
          var vs = $("vehicleSeries");
          if (vs && sp.Seri) {
            vs.value = sp.Seri;
            vs.dispatchEvent(new Event("change", { bubbles: true }));
          }
          setTimeout(function () {
            var vm = $("vehicleModel");
            if (vm && sp.Model) vm.value = sp.Model;
            applySpecsToWizardForm(sp);
            clearNotices();
          }, 40);
        }, 40);
      }, 40);
    }

    setStepIndicators();
    renderDynamicFields();
    syncVehicleCascadePanel();
    renderVideoPreview();
    updatePhotoCountInfo();
    updateVideoCountInfo();
    updateMapCoordsText();
    tryLoadEditListing();
  }

  window.JetleMarket = {
    CITIES: CITIES,
    DISTRICTS: DISTRICTS,
    CATEGORY_TREE: CATEGORY_TREE,
    initHome: initHome,
    refreshAll: refreshAll,
    refreshMarketData: refreshMarketData,
    renderGrid: renderGrid,
    renderFeatured: renderFeatured,
    renderNew: renderNew,
    setCategorySlug: setCategorySlug,
    setCategoryFilter: setCategoryFilter,
    setSearchQuery: setSearchQuery,
    readFilterForm: readFilterForm,
    syncFilterForm: syncFilterForm,
    onFavClick: onFavClick,
    populateCitySelect: populateCitySelect,
    fillDistrictSelect: fillDistrictSelect,
    createListingCard: createListingCard,
    formatPrice: formatPrice,
    formatDate: formatDate,
    initDetailPage: initDetailPage,
    initListingWizard: initListingWizard,
    getQueryParam: getQueryParam,
    slugifyListingTitle: slugifyListingTitle,
    buildListingDetailUrl: buildListingDetailUrl,
    clearSellerFilter: clearSellerFilter,
    applyFilters: applyFilters,
    resetFilters: resetFilters,
    handleFilterControlChange: handleFilterControlChange,
    removeFilterChip: removeFilterChip,
    renderActiveFilterTags: renderActiveFilterTags
  };
})();
