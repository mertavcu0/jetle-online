/**
 * Türkiye — 81 il ve tüm ilçeler (TÜİK / İçişleri güncel ilçe adlarına yakın UTF-8).
 * Alfabetik: iller ve her ilin ilçeleri `tr-TR` sıralı; yinelenen ilçe adları kaldırıldı.
 *
 * Tarayıcı (klasik script): `globalThis.JETLE_TR_CITIES` + `JetleTrCities` API.
 * ESM / TypeScript: `export const TR_CITIES` ile aynı yapıda dizi (aşağıdaki TR_CITIES).
 *
 * Veri üretimi: `node scripts/build-professional-tr-cities.cjs`
 */
const TR_CITIES =
[
  {
    "name": "Adana",
    "districts": [
      "Aladağ",
      "Ceyhan",
      "Çukurova",
      "Feke",
      "İmamoğlu",
      "Karaisalı",
      "Karataş",
      "Kozan",
      "Pozantı",
      "Saimbeyli",
      "Sarıçam",
      "Seyhan",
      "Tufanbeyli",
      "Yumurtalık",
      "Yüreğir"
    ]
  },
  {
    "name": "Adıyaman",
    "districts": [
      "Besni",
      "Çelikhan",
      "Gerger",
      "Gölbaşı",
      "Kahta",
      "Merkez",
      "Samsat",
      "Sincik",
      "Tut"
    ]
  },
  {
    "name": "Afyonkarahisar",
    "districts": [
      "Başmakçı",
      "Bayat",
      "Bolvadin",
      "Çay",
      "Çobanlar",
      "Dazkırı",
      "Dinar",
      "Emirdağ",
      "Evciler",
      "Hocalar",
      "İhsaniye",
      "İscehisar",
      "Kızılören",
      "Merkez",
      "Sandıklı",
      "Sinanpaşa",
      "Sultandağı",
      "Şuhut"
    ]
  },
  {
    "name": "Ağrı",
    "districts": [
      "Diyadin",
      "Doğubayazıt",
      "Eleşkirt",
      "Hamur",
      "Merkez",
      "Patnos",
      "Taşlıçay",
      "Tutak"
    ]
  },
  {
    "name": "Aksaray",
    "districts": [
      "Ağaçören",
      "Eskil",
      "Gülağaç",
      "Güzelyurt",
      "Merkez",
      "Ortaköy",
      "Sariyahşi"
    ]
  },
  {
    "name": "Amasya",
    "districts": [
      "Göynücek",
      "Gümüşhacıköy",
      "Hamamözü",
      "Merkez",
      "Merzifon",
      "Suluova",
      "Taşova"
    ]
  },
  {
    "name": "Ankara",
    "districts": [
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
    ]
  },
  {
    "name": "Antalya",
    "districts": [
      "Akseki",
      "Aksu",
      "Alanya",
      "Demre",
      "Döşemealti",
      "Elmali",
      "Finike",
      "Gazipaşa",
      "Gündoğmuş",
      "İbradi",
      "Kaş",
      "Kemer",
      "Kepez",
      "Konyaalti",
      "Korkuteli",
      "Kumluca",
      "Manavgat",
      "Muratpaşa",
      "Serik"
    ]
  },
  {
    "name": "Ardahan",
    "districts": [
      "Çıldır",
      "Damal",
      "Göle",
      "Hanak",
      "Merkez",
      "Posof"
    ]
  },
  {
    "name": "Artvin",
    "districts": [
      "Ardanuç",
      "Arhavi",
      "Borçka",
      "Hopa",
      "Merkez",
      "Yusufeli"
    ]
  },
  {
    "name": "Aydın",
    "districts": [
      "Bozdoğan",
      "Buharkent",
      "Çine",
      "Didim",
      "Germencik",
      "İncirliova",
      "Karacasu",
      "Karpuzlu",
      "Koçarli",
      "Köşk",
      "Kuşadasi",
      "Kuyucak",
      "Nazilli",
      "Söke",
      "Sultanhisar",
      "Yenipazar"
    ]
  },
  {
    "name": "Balıkesir",
    "districts": [
      "Ayvalik",
      "Balya",
      "Bandirma",
      "Bigadiç",
      "Burhaniye",
      "Dursunbey",
      "Edremit",
      "Erdek",
      "Gömeç",
      "Gönen",
      "Havran",
      "İvrindi",
      "Kepsut",
      "Manyas",
      "Marmara",
      "Savaştepe",
      "Sindirgi",
      "Susurluk"
    ]
  },
  {
    "name": "Bartın",
    "districts": [
      "Amasra",
      "Kurucaşile",
      "Merkez",
      "Ulus"
    ]
  },
  {
    "name": "Batman",
    "districts": [
      "Beşiri",
      "Gercüş",
      "Hasankeyf",
      "Kozluk",
      "Merkez",
      "Sason"
    ]
  },
  {
    "name": "Bayburt",
    "districts": [
      "Aydintepe",
      "Demirözü",
      "Merkez"
    ]
  },
  {
    "name": "Bilecik",
    "districts": [
      "Bozüyük",
      "Gölpazari",
      "İnhisar",
      "Merkez",
      "Osmaneli",
      "Pazaryeri",
      "Söğüt",
      "Yenipazar"
    ]
  },
  {
    "name": "Bingöl",
    "districts": [
      "Adakli",
      "Genç",
      "Karliova",
      "Kiği",
      "Merkez",
      "Solhan",
      "Yayladere",
      "Yedisu"
    ]
  },
  {
    "name": "Bitlis",
    "districts": [
      "Adilcevaz",
      "Ahlat",
      "Güroymak",
      "Hizan",
      "Merkez",
      "Mutki",
      "Tatvan"
    ]
  },
  {
    "name": "Bolu",
    "districts": [
      "Dörtdivan",
      "Gerede",
      "Göynük",
      "Kibriscik",
      "Mengen",
      "Merkez",
      "Mudurnu",
      "Seben",
      "Yeniçağa"
    ]
  },
  {
    "name": "Burdur",
    "districts": [
      "Ağlasun",
      "Altinyayla",
      "Bucak",
      "Çavdir",
      "Çeltikçi",
      "Gölhisar",
      "Karamanli",
      "Kemer",
      "Merkez",
      "Tefenni",
      "Yeşilova"
    ]
  },
  {
    "name": "Bursa",
    "districts": [
      "Büyükorhan",
      "Gemlik",
      "Gürsu",
      "Harmancik",
      "İnegöl",
      "İznik",
      "Karacabey",
      "Keles",
      "Kestel",
      "Mudanya",
      "Mustafakemalpaşa",
      "Nilüfer",
      "Orhaneli",
      "Orhangazi",
      "Osmangazi",
      "Yenişehir",
      "Yildirim"
    ]
  },
  {
    "name": "Çanakkale",
    "districts": [
      "Ayvacik",
      "Bayramiç",
      "Biga",
      "Bozcaada",
      "Çan",
      "Eceabat",
      "Ezine",
      "Gelibolu",
      "İmroz",
      "Lapseki",
      "Merkez",
      "Yenice"
    ]
  },
  {
    "name": "Çankırı",
    "districts": [
      "Atkaracalar",
      "Bayramören",
      "Çerkeş",
      "Eldivan",
      "Ilgaz",
      "Kizilirmak",
      "Korgun",
      "Kurşunlu",
      "Merkez",
      "Orta",
      "Şabanözü",
      "Yaprakli"
    ]
  },
  {
    "name": "Çorum",
    "districts": [
      "Alaca",
      "Bayat",
      "Boğazkale",
      "Dodurga",
      "İskilip",
      "Kargi",
      "Laçin",
      "Mecitözü",
      "Merkez",
      "Oğuzlar",
      "Ortaköy",
      "Osmancik",
      "Sungurlu",
      "Uğurludağ"
    ]
  },
  {
    "name": "Denizli",
    "districts": [
      "Acipayam",
      "Akköy",
      "Babadağ",
      "Baklan",
      "Bekilli",
      "Beyağaç",
      "Bozkurt",
      "Buldan",
      "Çal",
      "Çameli",
      "Çardak",
      "Çivril",
      "Güney",
      "Honaz",
      "Kale",
      "Sarayköy",
      "Serinhisar",
      "Tavas"
    ]
  },
  {
    "name": "Diyarbakır",
    "districts": [
      "Bağlar",
      "Bismil",
      "Çermik",
      "Çinar",
      "Çüngüş",
      "Dicle",
      "Eğil",
      "Ergani",
      "Hani",
      "Hazro",
      "Kayapinar",
      "Kocaköy",
      "Kulp",
      "Lice",
      "Silvan",
      "Sur",
      "Yenişehir"
    ]
  },
  {
    "name": "Düzce",
    "districts": [
      "Akçakoca",
      "Cumayeri",
      "Çilimli",
      "Gölyaka",
      "Gümüşova",
      "Kaynaşlı",
      "Merkez",
      "Yığılca"
    ]
  },
  {
    "name": "Edirne",
    "districts": [
      "Enez",
      "Havsa",
      "İpsala",
      "Keşan",
      "Lalapaşa",
      "Meriç",
      "Merkez",
      "Süloğlu",
      "Uzunköprü"
    ]
  },
  {
    "name": "Elaziğ",
    "districts": [
      "Ağin",
      "Alacakaya",
      "Aricak",
      "Baskil",
      "Karakoçan",
      "Keban",
      "Kovancilar",
      "Maden",
      "Merkez",
      "Palu",
      "Sivrice"
    ]
  },
  {
    "name": "Erzincan",
    "districts": [
      "Çayirli",
      "İliç",
      "Kemah",
      "Kemaliye",
      "Merkez",
      "Otlukbeli",
      "Refahiye",
      "Tercan",
      "Üzümlü"
    ]
  },
  {
    "name": "Erzurum",
    "districts": [
      "Aşkale",
      "Aziziye",
      "Çat",
      "Hinis",
      "Horasan",
      "İspir",
      "Karaçoban",
      "Karayazi",
      "Köprüköy",
      "Narman",
      "Oltu",
      "Olur",
      "Palandöken",
      "Pasinler",
      "Pazaryolu",
      "Şenkaya",
      "Tekman",
      "Tortum",
      "Uzundere",
      "Yakutiye"
    ]
  },
  {
    "name": "Eskişehir",
    "districts": [
      "Alpu",
      "Beylikova",
      "Çifteler",
      "Günyüzü",
      "Han",
      "İnönü",
      "Mahmudiye",
      "Mihalgazi",
      "Mihaliççik",
      "Odunpazari",
      "Saricakaya",
      "Seyitgazi",
      "Sivrihisar",
      "Tepebaşi"
    ]
  },
  {
    "name": "Gaziantep",
    "districts": [
      "Araban",
      "İslahiye",
      "Karkamiş",
      "Nizip",
      "Nurdaği",
      "Oğuzeli",
      "Şahinbey",
      "Şehitkamil",
      "Yavuzeli"
    ]
  },
  {
    "name": "Giresun",
    "districts": [
      "Alucra",
      "Bulancak",
      "Çamoluk",
      "Çanakçi",
      "Dereli",
      "Doğankent",
      "Espiye",
      "Eynesil",
      "Görele",
      "Güce",
      "Keşap",
      "Merkez",
      "Piraziz",
      "Şebinkarahisar",
      "Tirebolu",
      "Yağlidere"
    ]
  },
  {
    "name": "Gümüşhane",
    "districts": [
      "Kelkit",
      "Köse",
      "Kürtün",
      "Merkez",
      "Şiran",
      "Torul"
    ]
  },
  {
    "name": "Hakkari",
    "districts": [
      "Çukurca",
      "Merkez",
      "Şemdinli",
      "Yüksekova"
    ]
  },
  {
    "name": "Hatay",
    "districts": [
      "Altinözü",
      "Belen",
      "Dörtyol",
      "Erzin",
      "Hassa",
      "İskenderun",
      "Kirikhan",
      "Kumlu",
      "Reyhanli",
      "Samandağ",
      "Yayladaği"
    ]
  },
  {
    "name": "Iğdır",
    "districts": [
      "Aralık",
      "Karakoyunlu",
      "Merkez",
      "Tuzluca"
    ]
  },
  {
    "name": "Isparta",
    "districts": [
      "Aksu",
      "Atabey",
      "Eğirdir",
      "Gelendost",
      "Gönen",
      "Keçiborlu",
      "Merkez",
      "Senirkent",
      "Sütçüler",
      "Şarkikaraağaç",
      "Uluborlu",
      "Yalvaç",
      "Yenişarbademli"
    ]
  },
  {
    "name": "İstanbul",
    "districts": [
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
    ]
  },
  {
    "name": "İzmir",
    "districts": [
      "Aliağa",
      "Balçova",
      "Bayındır",
      "Bayrakli",
      "Bergama",
      "Beydağ",
      "Bornova",
      "Buca",
      "Çeşme",
      "Çiğli",
      "Dikili",
      "Foça",
      "Gaziemir",
      "Güzelbahçe",
      "Karabağlar",
      "Karaburun",
      "Karşiyaka",
      "Kemalpaşa",
      "Kınık",
      "Kiraz",
      "Konak",
      "Menderes",
      "Menemen",
      "Narlidere",
      "Ödemiş",
      "Seferihisar",
      "Selçuk",
      "Tire",
      "Torbalı",
      "Urla"
    ]
  },
  {
    "name": "Kahramanmaraş",
    "districts": [
      "Afşin",
      "Andirin",
      "Çağlayancerit",
      "Ekinözü",
      "Elbistan",
      "Göksun",
      "Nurhak",
      "Pazarcik",
      "Türkoğlu"
    ]
  },
  {
    "name": "Karabük",
    "districts": [
      "Eflani",
      "Eskipazar",
      "Merkez",
      "Ovacık",
      "Safranbolu",
      "Yenice"
    ]
  },
  {
    "name": "Karaman",
    "districts": [
      "Ayranci",
      "Başyayla",
      "Ermenek",
      "Kazimkarabekir",
      "Merkez",
      "Sariveliler"
    ]
  },
  {
    "name": "Kars",
    "districts": [
      "Akyaka",
      "Arpaçay",
      "Digor",
      "Kağizman",
      "Merkez",
      "Sarikamiş",
      "Selim",
      "Susuz"
    ]
  },
  {
    "name": "Kastamonu",
    "districts": [
      "Abana",
      "Ağli",
      "Araç",
      "Azdavay",
      "Bozkurt",
      "Cide",
      "Çatalzeytin",
      "Daday",
      "Devrekani",
      "Doğanyurt",
      "Hanönü",
      "İhsangazi",
      "İnebolu",
      "Küre",
      "Merkez",
      "Pinarbaşi",
      "Seydiler",
      "Şenpazar",
      "Taşköprü",
      "Tosya"
    ]
  },
  {
    "name": "Kayseri",
    "districts": [
      "Akkişla",
      "Bünyan",
      "Develi",
      "Felahiye",
      "Hacilar",
      "İncesu",
      "Kocasinan",
      "Melikgazi",
      "Özvatan",
      "Pinarbaşi",
      "Sarioğlan",
      "Sariz",
      "Talas",
      "Tomarza",
      "Yahyali",
      "Yeşilhisar"
    ]
  },
  {
    "name": "Kırıkkale",
    "districts": [
      "Bahşili",
      "Balişeyh",
      "Çelebi",
      "Delice",
      "Karakeçili",
      "Keskin",
      "Merkez",
      "Sulakyurt",
      "Yahşihan"
    ]
  },
  {
    "name": "Kırklareli",
    "districts": [
      "Babaeski",
      "Demirköy",
      "Kofçaz",
      "Lüleburgaz",
      "Merkez",
      "Pehlivanköy",
      "Pinarhisar",
      "Vize"
    ]
  },
  {
    "name": "Kırşehir",
    "districts": [
      "Akçakent",
      "Akpinar",
      "Boztepe",
      "Çiçekdaği",
      "Kaman",
      "Merkez",
      "Mucur"
    ]
  },
  {
    "name": "Kilis",
    "districts": [
      "Elbeyli",
      "Merkez",
      "Musabeyli",
      "Polateli"
    ]
  },
  {
    "name": "Kocaeli",
    "districts": [
      "Başiskele",
      "Çayirova",
      "Darica",
      "Derince",
      "Dilovasi",
      "Gebze",
      "Gölcük",
      "İzmit",
      "Kandira",
      "Karamürsel",
      "Kartepe",
      "Körfez"
    ]
  },
  {
    "name": "Konya",
    "districts": [
      "Ahirli",
      "Akören",
      "Akşehir",
      "Altinekin",
      "Beyşehir",
      "Bozkir",
      "Cihanbeyli",
      "Çeltik",
      "Çumra",
      "Derbent",
      "Derebucak",
      "Doğanhisar",
      "Emirgazi",
      "Ereğli",
      "Güneysinir",
      "Hadim",
      "Halkapinar",
      "Hüyük",
      "Ilgin",
      "Kadinhani",
      "Karapinar",
      "Karatay",
      "Kulu",
      "Meram",
      "Sarayönü",
      "Selçuklu",
      "Seydişehir",
      "Taşkent",
      "Tuzlukçu",
      "Yalihüyük",
      "Yunak"
    ]
  },
  {
    "name": "Kütahya",
    "districts": [
      "Altintaş",
      "Aslanapa",
      "Çavdarhisar",
      "Domaniç",
      "Dumlupinar",
      "Emet",
      "Gediz",
      "Hisarcik",
      "Merkez",
      "Pazarlar",
      "Simav",
      "Şaphane",
      "Tavşanli"
    ]
  },
  {
    "name": "Malatya",
    "districts": [
      "Akçadağ",
      "Arapgir",
      "Arguvan",
      "Battalgazi",
      "Darende",
      "Doğanşehir",
      "Doğanyol",
      "Hekimhan",
      "Kale",
      "Kuluncak",
      "Pütürge",
      "Yazihan",
      "Yeşilyurt"
    ]
  },
  {
    "name": "Manisa",
    "districts": [
      "Ahmetli",
      "Akhisar",
      "Alaşehir",
      "Demirci",
      "Gölmarmara",
      "Gördes",
      "Kirkağaç",
      "Köprübaşi",
      "Kula",
      "Salihli",
      "Sarigöl",
      "Saruhanli",
      "Selendi",
      "Soma",
      "Turgutlu"
    ]
  },
  {
    "name": "Mardin",
    "districts": [
      "Dargeçit",
      "Derik",
      "Kiziltepe",
      "Mazidaği",
      "Midyat",
      "Nusaybin",
      "Ömerli",
      "Savur",
      "Yeşilli"
    ]
  },
  {
    "name": "Mersin",
    "districts": [
      "Akdeniz",
      "Anamur",
      "Aydıncık",
      "Bozyazi",
      "Çamliyayla",
      "Erdemli",
      "Gülnar",
      "Merkez",
      "Mezitli",
      "Mut",
      "Silifke",
      "Tarsus",
      "Toroslar",
      "Yenişehir"
    ]
  },
  {
    "name": "Muğla",
    "districts": [
      "Bodrum",
      "Dalaman",
      "Datça",
      "Fethiye",
      "Kavaklidere",
      "Köyceğiz",
      "Marmaris",
      "Milas",
      "Ortaca",
      "Ula",
      "Yatağan"
    ]
  },
  {
    "name": "Muş",
    "districts": [
      "Bulanik",
      "Hasköy",
      "Korkut",
      "Malazgirt",
      "Merkez",
      "Varto"
    ]
  },
  {
    "name": "Nevşehir",
    "districts": [
      "Acigöl",
      "Avanos",
      "Derinkuyu",
      "Gülşehir",
      "Hacibektaş",
      "Kozakli",
      "Merkez",
      "Ürgüp"
    ]
  },
  {
    "name": "Niğde",
    "districts": [
      "Altunhisar",
      "Bor",
      "Çamardi",
      "Çiftlik",
      "Merkez",
      "Ulukişla"
    ]
  },
  {
    "name": "Ordu",
    "districts": [
      "Akkuş",
      "Aybasti",
      "Çamaş",
      "Çatalpinar",
      "Çaybaşi",
      "Fatsa",
      "Gölköy",
      "Gülyali",
      "Gürgentepe",
      "İkizce",
      "Kabadüz",
      "Kabataş",
      "Korgan",
      "Kumru",
      "Mesudiye",
      "Perşembe",
      "Ulubey",
      "Ünye"
    ]
  },
  {
    "name": "Osmaniye",
    "districts": [
      "Bahçe",
      "Düziçi",
      "Hasanbeyli",
      "Kadirli",
      "Merkez",
      "Sumbas",
      "Toprakkale"
    ]
  },
  {
    "name": "Rize",
    "districts": [
      "Ardeşen",
      "Çamlihemşin",
      "Çayeli",
      "Derepazari",
      "Findikli",
      "Güneysu",
      "Hemşin",
      "İkizdere",
      "İyidere",
      "Kalkandere",
      "Merkez",
      "Pazar"
    ]
  },
  {
    "name": "Sakarya",
    "districts": [
      "Adapazari",
      "Akyazi",
      "Arifiye",
      "Erenler",
      "Ferizli",
      "Geyve",
      "Hendek",
      "Karapürçek",
      "Karasu",
      "Kaynarca",
      "Kocaali",
      "Pamukova",
      "Sapanca",
      "Serdivan",
      "Söğütlü",
      "Tarakli"
    ]
  },
  {
    "name": "Samsun",
    "districts": [
      "19 Mayis",
      "Alaçam",
      "Asarcik",
      "Atakum",
      "Ayvacik",
      "Bafra",
      "Canik",
      "Çarşamba",
      "Havza",
      "İlkadim",
      "Kavak",
      "Ladik",
      "Salipazari",
      "Tekkeköy",
      "Terme",
      "Vezirköprü",
      "Yakakent"
    ]
  },
  {
    "name": "Siirt",
    "districts": [
      "Aydinlar",
      "Baykan",
      "Eruh",
      "Kurtalan",
      "Merkez",
      "Pervari",
      "Şirvan"
    ]
  },
  {
    "name": "Sinop",
    "districts": [
      "Ayancik",
      "Boyabat",
      "Dikmen",
      "Durağan",
      "Erfelek",
      "Gerze",
      "Merkez",
      "Saraydüzü",
      "Türkeli"
    ]
  },
  {
    "name": "Sivas",
    "districts": [
      "Akincilar",
      "Altinyayla",
      "Divriği",
      "Doğanşar",
      "Gemerek",
      "Gölova",
      "Gürün",
      "Hafik",
      "İmranli",
      "Kangal",
      "Koyulhisar",
      "Merkez",
      "Suşehri",
      "Şarkişla",
      "Ulaş",
      "Yildizeli",
      "Zara"
    ]
  },
  {
    "name": "Şanlıurfa",
    "districts": [
      "Akçakale",
      "Birecik",
      "Bozova",
      "Ceylanpinar",
      "Halfeti",
      "Harran",
      "Hilvan",
      "Siverek",
      "Suruç",
      "Viranşehir"
    ]
  },
  {
    "name": "Şirnak",
    "districts": [
      "Beytüşşebap",
      "Cizre",
      "Güçlükonak",
      "İdil",
      "Merkez",
      "Silopi",
      "Uludere"
    ]
  },
  {
    "name": "Tekirdağ",
    "districts": [
      "Çerkezköy",
      "Çorlu",
      "Hayrabolu",
      "Malkara",
      "Marmaraereğlisi",
      "Muratli",
      "Saray",
      "Şarköy"
    ]
  },
  {
    "name": "Tokat",
    "districts": [
      "Almus",
      "Artova",
      "Başçiftlik",
      "Erbaa",
      "Merkez",
      "Niksar",
      "Pazar",
      "Reşadiye",
      "Sulusaray",
      "Turhal",
      "Yeşilyurt",
      "Zile"
    ]
  },
  {
    "name": "Trabzon",
    "districts": [
      "Akçaabat",
      "Arakli",
      "Arsin",
      "Beşikdüzü",
      "Çarşibaşi",
      "Çaykara",
      "Dernekpazari",
      "Düzköy",
      "Hayrat",
      "Köprübaşi",
      "Maçka",
      "Of",
      "Sürmene",
      "Şalpazari",
      "Tonya",
      "Vakfikebir",
      "Yomra"
    ]
  },
  {
    "name": "Tunceli",
    "districts": [
      "Çemişgezek",
      "Hozat",
      "Mazgirt",
      "Merkez",
      "Nazimiye",
      "Ovacık",
      "Pertek",
      "Pülümür"
    ]
  },
  {
    "name": "Uşak",
    "districts": [
      "Banaz",
      "Eşme",
      "Karahalli",
      "Merkez",
      "Sivasli",
      "Ulubey"
    ]
  },
  {
    "name": "Van",
    "districts": [
      "Bahçesaray",
      "Başkale",
      "Çaldiran",
      "Çatak",
      "Edremit",
      "Erciş",
      "Gevaş",
      "Gürpinar",
      "Muradiye",
      "Özalp",
      "Saray"
    ]
  },
  {
    "name": "Yalova",
    "districts": [
      "Altınova",
      "Armutlu",
      "Çınarcık",
      "Çiftlikköy",
      "Merkez",
      "Termal"
    ]
  },
  {
    "name": "Yozgat",
    "districts": [
      "Akdağmadeni",
      "Aydıncık",
      "Boğazlıyan",
      "Çandır",
      "Çayıralan",
      "Çekerek",
      "Kadışehri",
      "Merkez",
      "Saraykent",
      "Sarıkaya",
      "Sorgun",
      "Şefaatli",
      "Yenifakılı",
      "Yerköy"
    ]
  },
  {
    "name": "Zonguldak",
    "districts": [
      "Alaplı",
      "Çaycuma",
      "Devrek",
      "Ereğli",
      "Gökçebey",
      "Merkez"
    ]
  }
];

(function (global) {
  "use strict";
  global.JETLE_TR_CITIES = TR_CITIES;
  global.TR_CITIES = TR_CITIES;
  global.JetleTrCities = {
    getAll: function () {
      return global.JETLE_TR_CITIES;
    },
    getProvinceNames: function () {
      return global.JETLE_TR_CITIES.map(function (r) {
        return r.name;
      });
    },
    getDistricts: function (provinceName) {
      var want = String(provinceName || "");
      for (var i = 0; i < global.JETLE_TR_CITIES.length; i++) {
        if (global.JETLE_TR_CITIES[i].name === want) {
          return (global.JETLE_TR_CITIES[i].districts || []).slice();
        }
      }
      return [];
    }
  };
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);

if (typeof module !== "undefined" && module.exports) {
  module.exports.TR_CITIES = TR_CITIES;
}
