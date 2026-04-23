(function () {
  function forcePopulateCitySelect() {
    const select = document.getElementById("citySelect");
    if (!select) return;

    if (select.options.length > 1) return;

    const cities = [
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

    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      select.appendChild(option);
    });
  }

  function requireAuth() {
    const user = JETLE.getCurrentUser();
    if (!user) {
      JETLE.showToast('Bu işlem için giriş yapmalısınız. Sayfa açık kaldı, isterseniz giriş yapıp devam edebilirsiniz.');
      return null;
    }
    return user;
  }

  const STORE_PACKAGES = [
    {
      id: 'standard',
      name: 'Standart Mağaza',
      price: 199,
      limit: 10,
      subtitle: 'Yeni başlayan mağazalar için ekonomik abonelik paketi',
      perks: ['10 ilan hakkı', 'Temel profil', 'Mağaza sayfası yayını']
    },
    {
      id: 'premium-store',
      name: 'Premium Mağaza',
      price: 499,
      limit: 50,
      subtitle: 'Daha görünür olmak isteyen aktif satıcılar için güçlü paket',
      perks: ['50 ilan hakkı', 'Öne çıkan mağaza rozeti', 'Vitrin alanı'],
      featured: true
    },
    {
      id: 'corporate',
      name: 'Kurumsal Mağaza',
      price: 999,
      limit: 'Sınırsız',
      subtitle: 'Yüksek hacimli profesyonel satıcılar için tam kurumsal çözüm',
      perks: ['Sınırsız ilan', 'Reklam alanı', 'Özel destek']
    }
  ];

  /** Şehir dropdown kaynağı (81 il). */
  const cities = [
    'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya',
    'Ankara','Antalya','Artvin','Aydın','Balıkesir',
    'Bilecik','Bingöl','Bitlis','Bolu','Burdur',
    'Bursa','Çanakkale','Çankırı','Çorum','Denizli',
    'Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum',
    'Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari',
    'Hatay','Isparta','Mersin','İstanbul','İzmir',
    'Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir',
    'Kocaeli','Konya','Kütahya','Malatya','Manisa',
    'Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir',
    'Niğde','Ordu','Rize','Sakarya','Samsun',
    'Siirt','Sinop','Sivas','Tekirdağ','Tokat',
    'Trabzon','Tunceli','Şanlıurfa','Uşak','Van',
    'Yozgat','Zonguldak','Aksaray','Bayburt','Karaman',
    'Kırıkkale','Batman','Şırnak','Bartın','Ardahan',
    'Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce'
  ];
  const TURKEY_PROVINCES_81 = cities;

  const vehicleCatalog = {
    'BMW': {
      '1 Serisi': ['116i', '118i', '120d'],
      '3 Serisi': ['318i', '320i', '320d'],
      '5 Serisi': ['520i', '520d', '530i'],
      'X3': ['20i', '20d', '30i'],
      'X5': ['30d', '40i', '50e']
    },
    'Mercedes-Benz': {
      'A Serisi': ['A180', 'A200', 'A200d'],
      'C Serisi': ['C180', 'C200', 'C220d'],
      'E Serisi': ['E180', 'E200d', 'E300'],
      'GLA': ['GLA 200', 'GLA 200d', 'GLA 250'],
      'GLC': ['GLC 200', 'GLC 220d', 'GLC 300']
    },
    'Audi': {
      'A3': ['1.0 TFSI', '1.5 TFSI', '2.0 TDI'],
      'A4': ['35 TFSI', '40 TDI', '45 TFSI'],
      'A6': ['40 TDI', '45 TFSI', '50 TDI'],
      'Q3': ['35 TFSI', '35 TDI', '40 TFSI'],
      'Q5': ['40 TDI', '45 TFSI', '50 TFSI e']
    },
    'Volkswagen': {
      'Golf': ['1.0 eTSI', '1.5 TSI', '2.0 TDI'],
      'Passat': ['1.5 eTSI', '2.0 TDI', '1.4 eHybrid'],
      'Polo': ['1.0 MPI', '1.0 TSI', '1.6 TDI'],
      'Tiguan': ['1.5 TSI', '2.0 TDI', '1.4 eHybrid'],
      'Amarok': ['2.0 TDI', '3.0 V6 TDI']
    },
    'Ford': {
      'Focus': ['1.0 EcoBoost', '1.5 TDCi', '1.5 EcoBlue'],
      'Fiesta': ['1.1', '1.0 EcoBoost', '1.5 TDCi'],
      'Kuga': ['1.5 EcoBoost', '2.0 EcoBlue', '2.5 Hybrid'],
      'Ranger': ['2.0 EcoBlue', '2.0 Bi-Turbo', '3.0 V6'],
      'Transit': ['350 L', '390 L', 'Custom']
    },
    'Toyota': {
      'Corolla': ['1.5 Vision', '1.5 Dream', '1.8 Hybrid'],
      'Yaris': ['1.0 Life', '1.5 Dream', '1.5 Hybrid'],
      'C-HR': ['1.2 Turbo', '1.8 Hybrid', '2.0 Hybrid'],
      'RAV4': ['2.0', '2.5 Hybrid', '2.5 Plug-in Hybrid'],
      'Hilux': ['2.4 D-4D', '2.8 D-4D']
    },
    'Honda': {
      'Civic': ['1.5 VTEC Turbo', '1.6 i-DTEC', '2.0 e:HEV'],
      'Accord': ['1.5 VTEC Turbo', '2.0 Hybrid'],
      'CR-V': ['1.5 VTEC Turbo', '2.0 Hybrid'],
      'HR-V': ['1.5 i-VTEC', '1.5 e:HEV']
    },
    'Hyundai': {
      'i20': ['1.2 MPI', '1.0 T-GDI', '1.4 MPI'],
      'i30': ['1.5 DPI', '1.5 T-GDI', '1.6 CRDi'],
      'Elantra': ['1.6 MPI', '1.6 CVT'],
      'Tucson': ['1.6 T-GDI', '1.6 CRDi', '1.6 Hybrid'],
      'Santa Fe': ['2.2 CRDi', '1.6 Hybrid']
    },
    'Renault': {
      'Clio': ['1.0 TCe', '1.5 Blue dCi', '1.0 SCe'],
      'Megane': ['1.3 TCe', '1.5 Blue dCi', 'E-Tech'],
      'Captur': ['1.0 TCe', '1.3 TCe', 'E-Tech Hybrid'],
      'Kadjar': ['1.3 TCe', '1.5 Blue dCi']
    },
    'Peugeot': {
      '208': ['1.2 PureTech', '1.5 BlueHDi', 'e-208'],
      '308': ['1.2 PureTech', '1.5 BlueHDi', '1.6 Plug-in Hybrid'],
      '2008': ['1.2 PureTech', '1.5 BlueHDi', 'e-2008'],
      '3008': ['1.5 BlueHDi', '1.6 PureTech', '1.6 Hybrid']
    },
    'Kia': {
      'Rio': ['1.2 MPI', '1.4 MPI'],
      'Ceed': ['1.0 T-GDI', '1.5 T-GDI', '1.6 CRDi'],
      'Sportage': ['1.6 T-GDI', '1.6 CRDi', '1.6 Hybrid']
    },
    'Nissan': {
      'Micra': ['1.0 IG-T', '1.5 dCi'],
      'Qashqai': ['1.3 DIG-T', '1.5 e-Power', '1.6 dCi'],
      'X-Trail': ['1.5 VC-T', '1.5 e-Power'],
      'Navara': ['2.3 dCi', '2.3 dCi 4x4']
    },
    'Opel': {
      'Corsa': ['1.2', '1.2 Turbo', 'e-Corsa'],
      'Astra': ['1.2 Turbo', '1.5 Diesel', 'Plug-in Hybrid'],
      'Grandland': ['1.2 Turbo', '1.5 Diesel', 'Plug-in Hybrid']
    },
    'Skoda': {
      'Fabia': ['1.0 MPI', '1.0 TSI'],
      'Octavia': ['1.5 TSI', '2.0 TDI', '1.4 iV'],
      'Superb': ['1.5 TSI', '2.0 TDI', '2.0 TSI'],
      'Kodiaq': ['1.5 TSI', '2.0 TDI']
    },
    'Seat': {
      'Ibiza': ['1.0 MPI', '1.0 EcoTSI'],
      'Leon': ['1.5 eTSI', '2.0 TDI', '1.4 eHybrid'],
      'Ateca': ['1.5 EcoTSI', '2.0 TDI'],
      'Arona': ['1.0 EcoTSI', '1.5 EcoTSI']
    },
    'Tesla': {
      'Model 3': ['Standard Range', 'Long Range', 'Performance'],
      'Model Y': ['Standard Range', 'Long Range', 'Performance'],
      'Model S': ['Dual Motor', 'Plaid'],
      'Model X': ['Dual Motor', 'Plaid']
    },
    'Volvo': {
      'S60': ['B4', 'B5', 'Recharge'],
      'S90': ['B5', 'Recharge'],
      'XC40': ['B3', 'B4', 'Recharge'],
      'XC60': ['B5', 'Recharge'],
      'XC90': ['B5', 'Recharge']
    },
    'Fiat': {
      'Egea': ['1.4 Fire', '1.6 Multijet', '1.3 Multijet'],
      '500': ['1.0 Hybrid', '1.2 Fire'],
      'Doblo': ['1.6 Multijet', '1.5 BlueHDi'],
      'Fiorino': ['1.3 Multijet']
    },
    'Dacia': {
      'Sandero': ['1.0 SCe', '1.0 TCe', '1.0 ECO-G'],
      'Logan': ['1.0 SCe', '1.0 ECO-G'],
      'Duster': ['1.0 TCe', '1.3 TCe', '1.5 Blue dCi']
    },
    'Jeep': {
      'Renegade': ['1.0', '1.3 Turbo', '4xe'],
      'Compass': ['1.3 Turbo', '1.6 Multijet', '4xe'],
      'Wrangler': ['2.0 Turbo', '2.2 CRD', '4xe']
    }
  };

  const allCars = Object.keys(vehicleCatalog).reduce(function (acc, brand) {
    acc[brand] = Object.keys(vehicleCatalog[brand] || {}).slice().sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    return acc;
  }, {});
  const VEHICLE_EQUIPMENT_OPTIONS = [
    'ABS',
    'ESP',
    'Airbag',
    'Deri Koltuk',
    'Sunroof',
    'Geri Görüş Kamerası',
    'Park Sensörü',
    'Navigasyon',
    'Isıtmalı Koltuk',
    'Hız Sabitleyici',
    'Bluetooth',
    'Apple CarPlay',
    'Android Auto'
  ];
  const COMPARE_STORAGE_KEY = 'jetle_compare_selection_v1';
  const vehicleMeta = {
    bodyTypes: [
      'Sedan',
      'Hatchback',
      'Station Wagon',
      'Coupe',
      'Cabrio',
      'SUV',
      'Pickup',
      'Minivan',
      'Panelvan',
      'Roadster'
    ],
    fuels: [
      'Benzin',
      'Dizel',
      'LPG',
      'Hibrit',
      'Elektrik',
      'Benzin + LPG'
    ],
    transmissions: [
      'Manuel',
      'Otomatik',
      'Yarı Otomatik'
    ],
    drivetrains: [
      'Önden Çekiş',
      'Arkadan İtiş',
      '4x4',
      'AWD'
    ],
    colors: [
      'Beyaz',
      'Siyah',
      'Gri',
      'Gümüş',
      'Kırmızı',
      'Mavi',
      'Lacivert',
      'Yeşil',
      'Sarı',
      'Kahverengi',
      'Bej',
      'Turuncu',
      'Bordo'
    ],
    conditions: [
      'Sıfır',
      'İkinci El',
      'Hasarlı'
    ],
    sellerTypes: [
      'Sahibinden',
      'Galeriden',
      'Yetkili Bayiden'
    ]
  };
  const estateMeta = {
    listingTypes: ['Satılık', 'Kiralık'],
    estateTypes: ['Konut', 'İş Yeri', 'Arsa', 'Bina', 'Devre Mülk', 'Turistik Tesis'],
    roomCounts: ['1+1', '2+1', '3+1', '4+1', '5+1', '6+1'],
    heatingTypes: ['Doğalgaz', 'Kombi', 'Klima'],
    yesNo: ['Evet', 'Hayır']
  };

  const VEHICLE_MODEL_META = {
    'X1': { bodyType: 'SUV', segment: 'Premium Kompakt' },
    'X3': { bodyType: 'SUV', segment: 'Lüks' },
    'X5': { bodyType: 'SUV', segment: 'Lüks' },
    'X6': { bodyType: 'SUV', segment: 'Lüks' },
    'X7': { bodyType: 'SUV', segment: 'Üst Segment' },
    'GLA': { bodyType: 'SUV', segment: 'Premium Kompakt' },
    'GLC': { bodyType: 'SUV', segment: 'Lüks' },
    'GLE': { bodyType: 'SUV', segment: 'Lüks' },
    'GLS': { bodyType: 'SUV', segment: 'Üst Segment' },
    'Q3': { bodyType: 'SUV', segment: 'Premium Kompakt' },
    'Q5': { bodyType: 'SUV', segment: 'Lüks' },
    'Q7': { bodyType: 'SUV', segment: 'Lüks' },
    'Q8': { bodyType: 'SUV', segment: 'Üst Segment' },
    'Tiguan': { bodyType: 'SUV', segment: 'Orta Segment' },
    'Touareg': { bodyType: 'SUV', segment: 'Üst Segment' },
    'Tucson': { bodyType: 'SUV', segment: 'Orta Segment' },
    'Santa Fe': { bodyType: 'SUV', segment: 'Üst Segment' },
    'Qashqai': { bodyType: 'SUV', segment: 'Orta Segment' },
    'Juke': { bodyType: 'SUV', segment: 'Kompakt' },
    'X-Trail': { bodyType: 'SUV', segment: 'Üst Segment' },
    'Sportage': { bodyType: 'SUV', segment: 'Orta Segment' },
    'Sorento': { bodyType: 'SUV', segment: 'Üst Segment' },
    'Kodiaq': { bodyType: 'SUV', segment: 'Üst Segment' },
    'Kamiq': { bodyType: 'SUV', segment: 'Kompakt' },
    'Ateca': { bodyType: 'SUV', segment: 'Orta Segment' },
    'Arona': { bodyType: 'SUV', segment: 'Kompakt' },
    'Compass': { bodyType: 'SUV', segment: 'Orta Segment' },
    'Renegade': { bodyType: 'SUV', segment: 'Kompakt' },
    'Cherokee': { bodyType: 'SUV', segment: 'Üst Segment' },
    'Wrangler': { bodyType: 'SUV', segment: 'Off-Road' },
    'Model Y': { bodyType: 'SUV', segment: 'Elektrikli Lüks' },
    'Model X': { bodyType: 'SUV', segment: 'Elektrikli Lüks' },
    'XC40': { bodyType: 'SUV', segment: 'Premium Kompakt' },
    'XC60': { bodyType: 'SUV', segment: 'Lüks' },
    'XC90': { bodyType: 'SUV', segment: 'Üst Segment' },
    '3 Serisi': { bodyType: 'Sedan', segment: 'Lüks' },
    '5 Serisi': { bodyType: 'Sedan', segment: 'Lüks' },
    '7 Serisi': { bodyType: 'Sedan', segment: 'Üst Segment' },
    'C Serisi': { bodyType: 'Sedan', segment: 'Lüks' },
    'E Serisi': { bodyType: 'Sedan', segment: 'Lüks' },
    'S Serisi': { bodyType: 'Sedan', segment: 'Üst Segment' },
    'A4': { bodyType: 'Sedan', segment: 'Lüks' },
    'A6': { bodyType: 'Sedan', segment: 'Lüks' },
    'A8': { bodyType: 'Sedan', segment: 'Üst Segment' },
    'Corolla': { bodyType: 'Sedan', segment: 'C Segment' },
    'Civic': { bodyType: 'Sedan', segment: 'C Segment' },
    'Focus': { bodyType: 'Hatchback', segment: 'C Segment' },
    'Golf': { bodyType: 'Hatchback', segment: 'C Segment' },
    'Polo': { bodyType: 'Hatchback', segment: 'B Segment' },
    'Clio': { bodyType: 'Hatchback', segment: 'B Segment' },
    'Megane': { bodyType: 'Hatchback', segment: 'C Segment' },
    'Egea': { bodyType: 'Sedan', segment: 'C Segment' },
    'Ranger': { bodyType: 'Pickup', segment: 'Ticari Pickup' }
  };

  function getUserFavorites(userId) {
    const map = JETLE.getFavoritesMap();
    return map[userId] || [];
  }

  function saveUserFavorites(userId, favorites) {
    const map = JETLE.getFavoritesMap();
    map[userId] = favorites;
    JETLE.saveFavoritesMap(map);
  }

  function isFavorite(listingId) {
    const user = JETLE.getCurrentUser();
    if (!user) return false;
    return getUserFavorites(user.id).includes(listingId);
  }

  function getCompareSelection() {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCompareSelection(items) {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(Array.isArray(items) ? items : []));
  }
  function getCategoryGroup(category) {
  if (!category) return '';

  if (
    category.includes('Araç') ||
    category.includes('Otomobil') ||
    category.includes('Motor') ||
    category.includes('Vasıta')
  ) return 'Araçlar';

  if (
    category.includes('Emlak') ||
    category.includes('Konut') ||
    category.includes('Arsa') ||
    category.includes('Gayrimenkul')
  ) return 'Gayrimenkul';

  return '';

function getComparableGroup(listing) {
  const group = getCategoryGroup(listing && listing.category);
  if (group === 'Araçlar' || group === 'Gayrimenkul') return group;
  return '';
}
  function isComparedListing(listingId) {
    return getCompareSelection().includes(listingId);
  }

  function toggleCompareListing(listingId) {
    const listing = JETLE.getListings().find(function (item) { return item.id === listingId; });
    if (!listing) return;

    const group = getComparableGroup(listing);
    if (!group) {
      JETLE.showToast('Karşılaştırma şu anda yalnızca araç ve emlak ilanlarında kullanılabilir.');
      return;
    }

    const current = getCompareSelection();
    const exists = current.includes(listingId);
    if (exists) {
      saveCompareSelection(current.filter(function (id) { return id !== listingId; }));
      JETLE.showToast('İlan karşılaştırmadan çıkarıldı.');
    } else {
      const selectedListings = JETLE.getListings().filter(function (item) { return current.includes(item.id); });
      const activeGroup = selectedListings[0] ? getComparableGroup(selectedListings[0]) : group;
      if (selectedListings.length && activeGroup !== group) {
        JETLE.showToast('Araç ve emlak ilanları ayrı ayrı karşılaştırılabilir.');
        return;
      }
      if (current.length >= 3) {
        JETLE.showToast('En fazla 3 ilan karşılaştırabilirsiniz.');
        return;
      }
      saveCompareSelection(current.concat(listingId));
      JETLE.showToast('İlan karşılaştırmaya eklendi.');
    }

    const page = document.body.dataset.page;
    if (page === 'home') renderHomeListings();
    if (page === 'favorites') renderFavoritesPage();
    if (page === 'listing-detail') renderListingDetailPage();
    if (page === 'compare') renderComparePage();
  }

  function getUserListingFollows(userId) {
    const map = JETLE.getListingFollowsMap ? JETLE.getListingFollowsMap() : {};
    return map[userId] || [];
  }

  function saveUserListingFollows(userId, follows) {
    const map = JETLE.getListingFollowsMap ? JETLE.getListingFollowsMap() : {};
    map[userId] = follows;
    if (JETLE.saveListingFollowsMap) JETLE.saveListingFollowsMap(map);
  }

  function isListingFollowed(listingId) {
    const user = JETLE.getCurrentUser();
    if (!user) return false;
    return getUserListingFollows(user.id).includes(listingId);
  }

  function getStorePackageById(packageId) {
    return STORE_PACKAGES.find(function (item) { return item.id === packageId; }) || null;
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }

  function getRememberChoice() {
    return Boolean(localStorage.getItem(JETLE.STORE.remember));
  }

  function updateCurrentUserRecord(nextUser) {
    const users = JETLE.getUsers().map(function (item) {
      return item.id === nextUser.id ? nextUser : item;
    });
    JETLE.saveUsers(users);
    JETLE.setCurrentUser({
      id: nextUser.id,
      name: nextUser.name,
      email: nextUser.email,
      avatar: nextUser.avatar || ''
    }, getRememberChoice());
    JETLE.renderNavAuth();
  }

  function getOwnerProfile(listing) {
    return JETLE.getUsers().find(function (item) {
      return item.id === listing.ownerId;
    }) || {};
  }

  function getSellerBadgeItems(owner, store) {
    const badges = [];
    const hasStore = Boolean(store && (store.active || store.slug || store.name));
    const packageId = String((store && store.packageId) || '').toLowerCase();
    const isVerifiedSeller = Boolean((owner && owner.verifiedUser) || (store && store.verified));
    const isPremiumStore = Boolean(store && (store.premium || packageId === 'premium-store' || packageId === 'corporate'));
    const isCorporateAccount = Boolean(hasStore || (owner && owner.profileType === 'store') || packageId === 'corporate');

    if (isVerifiedSeller) {
      badges.push({ label: 'Doğrulanmış Satıcı', className: 'seller-trust-badge seller-trust-badge-verified' });
    }
    if (isPremiumStore) {
      badges.push({ label: 'Premium Mağaza', className: 'seller-trust-badge seller-trust-badge-premium' });
    }
    if (isCorporateAccount) {
      badges.push({ label: 'Kurumsal Hesap', className: 'seller-trust-badge seller-trust-badge-corporate' });
    }

    return badges;
  }

  function getSellerBadgesMarkup(owner, store, extraClassName) {
    return getSellerBadgeItems(owner, store).map(function (item) {
      return '<span class="' + item.className + (extraClassName ? ' ' + extraClassName : '') + '">' + item.label + '</span>';
    }).join('');
  }

  function getSellerTrustSummary(owner, store) {
    return getSellerBadgeItems(owner, store).map(function (item) {
      return item.label;
    }).join(' · ');
  }

  function getListingStore(owner, listing) {
    if (owner && owner.store && owner.store.active) return owner.store;
    if (listing && listing.storeSlug) {
      return {
        active: true,
        slug: listing.storeSlug,
        name: listing.storeName || listing.ownerName || 'Mağaza',
        logo: '',
        verified: true,
        premium: listing.storePackageId === 'premium-store' || listing.storePackageId === 'corporate'
      };
    }
    return null;
  }

  function getStoreUrl(store) {
    if (!store || !store.slug) return 'magaza.html';
    return 'magaza.html?slug=' + encodeURIComponent(store.slug);
  }

  function getProfileUrl(owner) {
    const username = owner && owner.username ? owner.username : '';
    return 'kullanici.html?username=' + encodeURIComponent(username);
  }

  function readFollowMap() {
    try {
      return JSON.parse(localStorage.getItem('jetle_followed_sellers_v1') || '{}');
    } catch (error) {
      return {};
    }
  }

  function saveFollowMap(map) {
    localStorage.setItem('jetle_followed_sellers_v1', JSON.stringify(map || {}));
  }

  function getSellerFollowKey(owner, store) {
    if (store && store.slug) return 'store:' + store.slug;
    return 'user:' + (owner && owner.id ? owner.id : 'guest');
  }

  function getCurrentFollowedSellerKeys() {
    const currentUser = JETLE.getCurrentUser();
    if (!currentUser) return [];
    const map = readFollowMap();
    return Array.isArray(map[currentUser.id]) ? map[currentUser.id] : [];
  }

  function isFollowingSeller(owner, store) {
    return getCurrentFollowedSellerKeys().includes(getSellerFollowKey(owner, store));
  }

  function toggleSellerFollow(owner, store) {
    const currentUser = requireAuth();
    if (!currentUser) return false;
    if (owner && owner.id === currentUser.id) {
      JETLE.showToast('Kendi profilinizi takip etmenize gerek yok.');
      return false;
    }

    const map = readFollowMap();
    const currentKeys = Array.isArray(map[currentUser.id]) ? map[currentUser.id].slice() : [];
    const followKey = getSellerFollowKey(owner, store);
    const exists = currentKeys.includes(followKey);
    map[currentUser.id] = exists
      ? currentKeys.filter(function (item) { return item !== followKey; })
      : currentKeys.concat(followKey);
    saveFollowMap(map);
    JETLE.showToast(exists ? 'Satıcı takibiniz kaldırıldı.' : 'Satıcı takip listenize eklendi.');
    return !exists;
  }

  function getSellerPrimaryUrl(owner, store) {
    if (store && store.active && store.slug) return getStoreUrl(store);
    return getProfileUrl(owner || {});
  }

  function getSellerProfileMeta(owner, store, listings) {
    const sellerProfile = Object.assign({}, (owner && owner.sellerProfile) || {});
    const sellerListings = Array.isArray(listings) ? listings : JETLE.getListings().filter(function (item) {
      return owner && item.ownerId === owner.id;
    });
    const publishedListings = sellerListings.filter(isListingPublished);
    const passiveListings = sellerListings.filter(function (item) {
      const status = getListingModerationStatus(item);
      return status === 'pasif' || status === 'reddedildi';
    });
    const totals = sellerListings.reduce(function (sum, item) {
      const social = getListingSocialProof(item);
      sum.views += Number(social.views || 0);
      sum.favorites += Number(social.favorites || 0);
      return sum;
    }, { views: 0, favorites: 0 });
    const seed = String((owner && owner.id) || '').split('').reduce(function (sum, char) {
      return sum + char.charCodeAt(0);
    }, 0);
    const responseMinutes = Number(sellerProfile.responseMinutes || (store && store.responseMinutes) || 0) || ((seed % 35) + 10);
    const lastActive = sellerProfile.lastActive || (owner && owner.lastActive) || (owner && owner.updatedAt) || (publishedListings[0] && publishedListings[0].createdAt) || (owner && owner.createdAt) || new Date().toISOString();
    const serviceRegion = sellerProfile.serviceRegion || [store && store.city, store && store.district].filter(Boolean).join(' / ') || 'Türkiye Geneli';
    const expertise = sellerProfile.expertise || ((store && store.active) ? 'Kurumsal satış ve danışmanlık' : 'Bireysel ilan yönetimi');
    const about = sellerProfile.about || (store && store.description) || 'JETLE üzerinde güvenli iletişim ve şeffaf ilan deneyimi sunan satıcı profili.';
    const shortDescription = sellerProfile.shortDescription || (store && store.description) || 'Güven veren iletişim, güncel ilanlar ve hızlı dönüş ile platformda aktif satıcı profili.';
    const whatsapp = sellerProfile.whatsapp || (owner && owner.phone) || (store && store.phone) || '';
    const featuredListings = publishedListings.slice().sort(function (a, b) {
      if (Boolean(b.premium) !== Boolean(a.premium)) return Number(Boolean(b.premium)) - Number(Boolean(a.premium));
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, 4);
    const favoriteListings = publishedListings.slice().sort(function (a, b) {
      return getListingSocialProof(b).favorites - getListingSocialProof(a).favorites;
    }).slice(0, 4);

    return {
      shortDescription: shortDescription,
      about: about,
      serviceRegion: serviceRegion,
      expertise: expertise,
      responseMinutes: responseMinutes,
      lastActive: lastActive,
      whatsapp: whatsapp,
      totals: totals,
      listingCount: sellerListings.length,
      publishedCount: publishedListings.length,
      passiveCount: passiveListings.length,
      featuredListings: featuredListings,
      favoriteListings: favoriteListings
    };
  }

  function buildSellerContactActions(owner, store, stats, primaryListing, options) {
    const currentUser = JETLE.getCurrentUser();
    const ownProfile = currentUser && owner && currentUser.id === owner.id;
    const followLabel = isFollowingSeller(owner, store) ? 'Takibi Birak' : 'Saticiyi Takip Et';
    const phone = (store && store.phone) || (owner && owner.phone) || '05xx xxx xx xx';
    const phoneLabel = phone.replace(/\d(?=\d{2})/g, 'x');
    const whatsappLink = stats.whatsapp ? ('https://wa.me/' + String(stats.whatsapp).replace(/\D/g, '')) : '#';
    const mode = (options && options.mode) || 'profile';

    return '' +
      '<div class="' + (mode === 'detail' ? 'detail-seller-actions seller-contact-actions' : 'seller-contact-actions') + '">' +
        (!ownProfile && primaryListing ? '<button type="button" class="btn btn-light" data-seller-message-id="' + JETLE.escapeHtml(primaryListing.id) + '">Mesaj Gonder</button>' : '') +
        '<button type="button" class="btn btn-light" data-seller-phone="' + JETLE.escapeHtml(phone) + '" data-seller-phone-label="' + JETLE.escapeHtml(phoneLabel) + '">' + (mode === 'detail' ? 'Telefonu Goster' : 'Telefonu Goster') + '</button>' +
        (!ownProfile ? '<a href="' + JETLE.escapeHtml(whatsappLink) + '" class="btn btn-light' + (stats.whatsapp ? '' : ' is-disabled') + '" target="_blank" rel="noreferrer">WhatsApp ile Iletisim</a>' : '') +
        (!ownProfile ? '<button type="button" class="btn btn-primary" data-follow-seller="' + JETLE.escapeHtml(getSellerFollowKey(owner, store)) + '">' + followLabel + '</button>' : '') +
      '</div>';
  }

  function bindSellerActions(container, owner, store, primaryListing) {
    if (!container) return;

    Array.from(container.querySelectorAll('[data-follow-seller]')).forEach(function (button) {
      button.addEventListener('click', function () {
        const following = toggleSellerFollow(owner, store);
        button.textContent = following ? 'Takibi Birak' : 'Saticiyi Takip Et';
      });
    });

    Array.from(container.querySelectorAll('[data-seller-phone]')).forEach(function (button) {
      button.addEventListener('click', function () {
        button.textContent = button.dataset.sellerPhone || button.dataset.sellerPhoneLabel || 'Telefon Goruntulendi';
        button.disabled = true;
      });
    });

    Array.from(container.querySelectorAll('[data-seller-message-id]')).forEach(function (button) {
      button.addEventListener('click', function () {
        if (!primaryListing) {
          JETLE.showToast('Bu satici icin aktif ilan bulunmuyor.');
          return;
        }
        const conversation = ensureConversation(primaryListing);
        if (conversation) window.location.href = 'mesajlar.html?conversation=' + conversation.id;
      });
    });

    Array.from(container.querySelectorAll('[data-profile-tab]')).forEach(function (button) {
      button.addEventListener('click', function () {
        const tab = button.dataset.profileTab;
        container.querySelectorAll('[data-profile-tab]').forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        container.querySelectorAll('[data-profile-panel]').forEach(function (panel) {
          panel.classList.toggle('hidden', panel.dataset.profilePanel !== tab);
        });
      });
    });
  }

  function buildSellerProfileMarkup(owner, store, listings, options) {
    const sellerStore = store && store.active ? store : null;
    const sellerName = (sellerStore && sellerStore.name) || owner.name || owner.username || 'JETLE Saticisi';
    const joinedAt = owner.createdAt || new Date().toISOString();
    const stats = getSellerProfileMeta(owner, sellerStore, listings);
    const badges = getSellerBadgesMarkup(owner, sellerStore);
    const primaryListing = stats.featuredListings[0] || listings[0] || null;
    const activeListings = listings.filter(isListingPublished);
    const premiumListings = activeListings.filter(function (item) { return item.premium; }).slice(0, 4);
    const favoriteListings = stats.favoriteListings;
    const displayFeatured = premiumListings.length ? premiumListings : stats.featuredListings;
    const coverVisual = sellerStore && sellerStore.cover
      ? '<img src="' + JETLE.escapeHtml(sellerStore.cover) + '" alt="' + JETLE.escapeHtml(sellerName) + '" />'
      : '<div class="seller-profile-cover-fallback">' + JETLE.escapeHtml((options && options.coverLabel) || 'JETLE Satici Vitrini') + '</div>';
    const identityVisual = (sellerStore && sellerStore.logo)
      ? '<img src="' + JETLE.escapeHtml(sellerStore.logo) + '" alt="' + JETLE.escapeHtml(sellerName) + '" />'
      : (owner.avatar
        ? '<img src="' + JETLE.escapeHtml(owner.avatar) + '" alt="' + JETLE.escapeHtml(sellerName) + '" />'
        : '<span>' + JETLE.escapeHtml(String(sellerName.charAt(0)).toUpperCase()) + '</span>');
    const trustItems = [
      'Dogrulanmis hesap',
      'Guvenli iletisim',
      'Platform kurallarina uygun satici'
    ];

    return '' +
      '<section class="panel seller-profile-cover-panel">' +
        '<div class="seller-profile-cover-media">' + coverVisual + '</div>' +
        '<div class="seller-profile-hero">' +
          '<div class="seller-profile-main">' +
            '<div class="seller-profile-avatar">' + identityVisual + '</div>' +
            '<div class="seller-profile-copy">' +
              '<div class="seller-profile-kicker">' + JETLE.escapeHtml((options && options.kicker) || 'Satici Profili') + '</div>' +
              '<h1>' + JETLE.escapeHtml(sellerName) + '</h1>' +
              '<p>' + JETLE.escapeHtml(stats.shortDescription) + '</p>' +
              '<div class="seller-profile-meta">' +
                '<span>Katilma: ' + JETLE.formatDate(joinedAt) + '</span>' +
                '<span>Son aktif: ' + JETLE.formatDate(stats.lastActive) + '</span>' +
              '</div>' +
              (badges ? '<div class="seller-profile-badges">' + badges + '</div>' : '') +
            '</div>' +
          '</div>' +
          '<div class="seller-profile-highlights">' +
            '<div class="seller-profile-highlight"><span>Toplam ilan</span><strong>' + stats.listingCount + '</strong></div>' +
            '<div class="seller-profile-highlight"><span>Goruntulenme</span><strong>' + stats.totals.views + '</strong></div>' +
            '<div class="seller-profile-highlight"><span>Favori</span><strong>' + stats.totals.favorites + '</strong></div>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section class="seller-profile-layout">' +
        '<div class="seller-profile-main-column">' +
          (sellerStore ? '<section class="panel seller-profile-showcase-panel"><div class="panel-head compact"><h2>Magaza Vitrini</h2></div><div class="listing-grid">' + (displayFeatured.length ? displayFeatured.map(buildListingCard).join('') : buildShowcasePlaceholderCards(3, { count: 3, badge: 'Premium Vitrin', titlePrefix: 'Vitrin secimi', description: 'Secili magaza ilanlari burada one cikar.', ctaText: 'Magazayi Guncelle', meta: 'Kurumsal vitrin' })) + '</div></section>' : '') +
          '<section class="seller-profile-stats-grid">' +
            '<article class="panel seller-profile-stat-card"><span>Yayindaki ilan</span><strong>' + stats.publishedCount + '</strong></article>' +
            '<article class="panel seller-profile-stat-card"><span>Pasif / reddedilen</span><strong>' + stats.passiveCount + '</strong></article>' +
            '<article class="panel seller-profile-stat-card"><span>Ortalama yanit</span><strong>' + stats.responseMinutes + ' dk</strong></article>' +
            '<article class="panel seller-profile-stat-card"><span>Hizmet bolgesi</span><strong>' + JETLE.escapeHtml(stats.serviceRegion) + '</strong></article>' +
          '</section>' +
          '<section class="panel seller-profile-tabs-panel">' +
            '<div class="seller-profile-tabs">' +
              '<button type="button" class="seller-tab active" data-profile-tab="all">Tum Ilanlar</button>' +
              '<button type="button" class="seller-tab" data-profile-tab="featured">One Cikanlar</button>' +
              '<button type="button" class="seller-tab" data-profile-tab="favorites">Favoriler</button>' +
              '<button type="button" class="seller-tab" data-profile-tab="about">Hakkinda</button>' +
            '</div>' +
            '<div class="seller-profile-tab-content" data-profile-panel="all">' +
              '<div class="listing-grid">' + (activeListings.length ? activeListings.map(buildListingCard).join('') : buildShowcasePlaceholderCards(4, { count: 4, badge: 'Yayina Hazir', titlePrefix: 'Yeni vitrin alani', description: 'Satici yeni ilan eklediginde bu alan otomatik dolar.', ctaText: 'Ilan Ver', meta: 'Canli profil akisi' })) + '</div>' +
            '</div>' +
            '<div class="seller-profile-tab-content hidden" data-profile-panel="featured">' +
              '<div class="listing-grid">' + (displayFeatured.length ? displayFeatured.map(buildListingCard).join('') : buildShowcasePlaceholderCards(4, { count: 4, badge: 'One Cikan', titlePrefix: 'Premium secim', description: 'One cikan ve premium ilanlar bu sekmede gosterilir.', ctaText: 'Vitrini Incele', meta: 'Premium secki' })) + '</div>' +
            '</div>' +
            '<div class="seller-profile-tab-content hidden" data-profile-panel="favorites">' +
              '<div class="listing-grid">' + (favoriteListings.length ? favoriteListings.map(buildListingCard).join('') : buildShowcasePlaceholderCards(4, { count: 4, badge: 'Favori', titlePrefix: 'Yuksek ilgi potansiyeli', description: 'Bu saticinin favori toplayan ilanlari burada listelenir.', ctaText: 'Ilanlari Incele', meta: 'Favori performansi' })) + '</div>' +
            '</div>' +
            '<div class="seller-profile-tab-content hidden" data-profile-panel="about">' +
              '<div class="seller-profile-about-grid">' +
                '<article class="panel seller-profile-about-card"><h3>Hakkinda</h3><p>' + JETLE.escapeHtml(stats.about).replace(/\n/g, '<br />') + '</p></article>' +
                '<article class="panel seller-profile-about-card"><h3>Uzmanlik Alani</h3><p>' + JETLE.escapeHtml(stats.expertise) + '</p><h3>Hizmet Bolgesi</h3><p>' + JETLE.escapeHtml(stats.serviceRegion) + '</p></article>' +
              '</div>' +
            '</div>' +
          '</section>' +
        '</div>' +
        '<aside class="seller-profile-side-column">' +
          '<section class="panel seller-profile-contact-card">' +
            '<div class="panel-head compact"><h2>Iletisim</h2></div>' +
            '<div class="seller-profile-contact-list">' +
              '<div><strong>Telefon</strong><span>' + JETLE.escapeHtml(((sellerStore && sellerStore.phone) || owner.phone || '05xx xxx xx xx').replace(/\d(?=\d{2})/g, 'x')) + '</span></div>' +
              '<div><strong>E-posta</strong><span>' + JETLE.escapeHtml((sellerStore && sellerStore.email) || owner.email || '-') + '</span></div>' +
              '<div><strong>Konum</strong><span>' + JETLE.escapeHtml([sellerStore && sellerStore.city, sellerStore && sellerStore.district].filter(Boolean).join(' / ') || stats.serviceRegion) + '</span></div>' +
            '</div>' +
            buildSellerContactActions(owner, sellerStore, stats, primaryListing, { mode: 'profile' }) +
          '</section>' +
          '<section class="panel seller-profile-trust-card">' +
            '<div class="panel-head compact"><h2>Guven</h2></div>' +
            '<ul class="detail-trust-list">' + trustItems.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>' +
          '</section>' +
        '</aside>' +
      '</section>';
  }

  function getListingSlug(listing) {
    return listing.slug || slugify(listing.title || listing.listingNumber || listing.id || 'ilan');
  }

  function getDetailUrl(listing) {
    return 'ilan-detay.html?slug=' + encodeURIComponent(getListingSlug(listing));
  }

  function ensureListingSlugs() {
    const listings = JETLE.getListings();
    let changed = false;
    const nextListings = listings.map(function (item) {
      if (!item.slug) {
        item.slug = getListingSlug(item);
        changed = true;
      }
      return item;
    });
    if (changed) {
      JETLE.saveListings(nextListings);
    }
  }

  function upsertMetaTag(name, content, attr) {
    const key = attr || 'name';
    var tag = document.head.querySelector('meta[' + key + '="' + name + '"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(key, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  function getVerificationBadgeMarkup(status) {
    if (status === 'verified') return '<span class="badge badge-verified">İlan doğrulandı</span>';
    if (status === 'rejected') return '<span class="badge badge-rejected">Reddedildi</span>';
    return '<span class="badge badge-pending">Onay bekliyor</span>';
  }

  function getPremiumBadgeMarkup(isPremium) {
    return isPremium ? '<span class="badge badge-premium">Premium</span>' : '';
  }

  function getListingFreshnessMarkup(listing) {
    const createdAt = new Date(listing.createdAt).getTime();
    const ageInHours = (Date.now() - createdAt) / 3600000;
    return ageInHours <= 48
      ? '<span class="listing-card-status listing-card-status-new">Yeni</span>'
      : '<span class="listing-card-status">' + JETLE.formatDate(listing.createdAt) + '</span>';
  }

  function buildFeaturedStoreCard(owner) {
    const store = owner && owner.store ? owner.store : {};
    const storeListings = JETLE.getListings().filter(function (item) {
      return item.ownerId === owner.id;
    }).filter(function (item) {
      return isListingPublished(item);
    });
    const shortDescription = String(store.description || 'Güven veren mağaza profili ve güncel ilanlarıyla hizmet veriyor.').trim();
    const shortText = shortDescription.length > 110 ? shortDescription.slice(0, 107).trim() + '...' : shortDescription;
    const storeBadges = getSellerBadgesMarkup(owner, store, 'featured-store-badge');
    const storeLocation = [store.city, store.district].filter(Boolean).join(' / ');

    return '' +
      '<article class="featured-store-card">' +
        '<a href="' + getStoreUrl(store) + '" class="featured-store-card-link">' +
          '<div class="featured-store-card-head">' +
            '<div class="featured-store-card-logo">' +
              (store.logo ? '<img src="' + JETLE.escapeHtml(store.logo) + '" alt="' + JETLE.escapeHtml(store.name || 'Mağaza') + '" />' : '<span>' + JETLE.escapeHtml(String((store.name || owner.name || 'M').charAt(0)).toUpperCase()) + '</span>') +
            '</div>' +
            '<div class="featured-store-card-copy">' +
              '<h3>' + JETLE.escapeHtml(store.name || owner.name || 'JETLE Mağaza') + '</h3>' +
              (storeBadges ? '<div class="featured-store-card-badges">' + storeBadges + '</div>' : '') +
            '</div>' +
          '</div>' +
          '<p class="featured-store-card-description">' + JETLE.escapeHtml(shortText) + '</p>' +
          '<div class="featured-store-card-meta">' +
            '<strong>' + storeListings.length + ' ilan</strong>' +
            '<span>' + JETLE.escapeHtml(storeLocation || 'Türkiye geneli hizmet') + '</span>' +
          '</div>' +
        '</a>' +
      '</article>';
  }

  function getListingBrand(listing) {
    return String((listing.details && listing.details.brand) || '').trim();
  }

  function getListingModerationStatus(listing) {
    const rawStatus = String((listing && listing.status) || '').toLowerCase();
    if (rawStatus === 'pending' || rawStatus === 'bekliyor') return 'beklemede';
    if (rawStatus === 'active' || rawStatus === 'approved' || rawStatus === 'verified') return 'yayında';
    if (rawStatus === 'passive') return 'pasif';
    if (rawStatus === 'rejected') return 'reddedildi';
    if (rawStatus) return rawStatus;
    return String((listing && listing.verification) || '').toLowerCase() === 'verified' ? 'yayında' : 'beklemede';
  }

  function isListingPublished(listing) {
    return getListingModerationStatus(listing) === 'yayında';
  }

  /**
   * Profesyonel test ilanları (depoya yazılır). Görsel: 300x200; konum: il / ilçe (şehir filtresi).
   * Kategori: category + categorySlug + categoryGroup platform kurallarına uygun.
   */
  var HOME_PAGE_VITRIN_SEED_LISTINGS = [
    { id: '101', title: '2020 BMW 3.20i M Sport', price: 1250000, location: 'İstanbul / Kadıköy', dateLabel: 'Bugün', category: 'Otomobil', categorySlug: 'otomobil', categoryGroup: 'Araçlar', image: 'https://via.placeholder.com/300x200?text=BMW+320i', premium: true, featured: true, createdAt: '2026-04-12T10:30:00.000Z' },
    { id: '102', title: 'Kiralık 2+1 Daire — Merkezi Konum', price: 15000, location: 'Ankara / Çankaya', dateLabel: 'Dün', category: 'Konut', categorySlug: 'konut', categoryGroup: 'Gayrimenkul', image: 'https://via.placeholder.com/300x200?text=Kiralik+Daire', premium: false, featured: false, createdAt: '2026-04-11T14:00:00.000Z' },
    { id: '103', title: 'Tesla Model Y Long Range', price: 2500000, location: 'İzmir / Bornova', dateLabel: '2 gün önce', category: 'Elektrikli Araçlar', categorySlug: 'elektrikli-araclar', categoryGroup: 'Araçlar', image: 'https://via.placeholder.com/300x200?text=Tesla+MY', premium: true, featured: true, createdAt: '2026-04-10T09:15:00.000Z' },
    { id: '104', title: 'Toyota Hilux 4x4 Adventure', price: 1890000, location: 'Antalya / Kepez', dateLabel: 'Bugün', category: 'Arazi, SUV & Pickup', categorySlug: 'arazi-suv-pickup', categoryGroup: 'Araçlar', image: 'https://via.placeholder.com/300x200?text=Hilux', premium: true, featured: true, createdAt: '2026-04-12T08:00:00.000Z' },
    { id: '105', title: 'Satılık 3+1 Dubleks — Deniz Manzaralı', price: 4100000, location: 'Muğla / Bodrum', dateLabel: '3 gün önce', category: 'Konut', categorySlug: 'konut', categoryGroup: 'Gayrimenkul', image: 'https://via.placeholder.com/300x200?text=Dubleks', premium: true, featured: false, createdAt: '2026-04-09T11:45:00.000Z' },
    { id: '106', title: 'MacBook Pro 14" M3 Pro 18GB / 512GB', price: 85900, location: 'Bursa / Nilüfer', dateLabel: 'Dün', category: 'Bilgisayar', categorySlug: 'bilgisayar', categoryGroup: 'Alışveriş', image: 'https://via.placeholder.com/300x200?text=MacBook', premium: false, featured: false, createdAt: '2026-04-11T16:20:00.000Z' },
    { id: '107', title: 'iPhone 15 Pro 256GB — Garantili', price: 62900, location: 'İstanbul / Üsküdar', dateLabel: 'Bugün', category: 'Telefon & Aksesuar', categorySlug: 'telefon', categoryGroup: 'Alışveriş', image: 'https://via.placeholder.com/300x200?text=iPhone+15', premium: false, featured: false, createdAt: '2026-04-12T12:00:00.000Z' },
    { id: '108', title: 'Mini Ekskavatör 3,5 Ton — Bakımlı', price: 1150000, location: 'Konya / Selçuklu', dateLabel: '4 gün önce', category: 'İş Makineleri', categorySlug: 'is-makineleri', categoryGroup: 'İş & Sanayi', image: 'https://via.placeholder.com/300x200?text=Ekskavator', premium: false, featured: false, createdAt: '2026-04-08T13:30:00.000Z' }
  ];
  const listings = [
    {
      title: '2020 BMW 3.20i',
      price: '1.250.000 TL',
      location: 'İstanbul',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      title: 'Kiralık 2+1 Daire',
      price: '15.000 TL',
      location: 'Ankara',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      title: 'Tesla Model Y',
      price: '2.400.000 TL',
      location: 'İzmir',
      image: 'https://via.placeholder.com/300x200'
    }
  ];

  function ensureHomeVitrinSeedListings() {
    var all = JETLE.getListings();
    if (all.some(function (l) { return l && l.homeVitrinSeed; })) return;
    var published = all.filter(isListingPublished);
    var premiumOrFeatured = published.filter(function (x) {
      return x && (x.premium || x.featured);
    }).length;
    if (published.length > 0 && premiumOrFeatured > 0) return;
    var seeded = HOME_PAGE_VITRIN_SEED_LISTINGS.map(function (raw) {
      return Object.assign({}, raw, {
        homeVitrinSeed: true,
        homeDemoSeed: true,
        status: 'active',
        slug: 'demo-' + raw.id + '-' + slugify(raw.title || 'ilan'),
        images: [raw.image],
        listingNumber: 'DEMO-' + raw.id,
        ownerId: 'demo-owner',
        description: 'Örnek vitrin ilanı.',
        details: {}
      });
    });
    JETLE.saveListings(all.concat(seeded));
  }

  function injectHomePageDemoListingsIfEmpty() {
    ensureHomeVitrinSeedListings();
  }

  function getHomeVitrinDetailHref(listing) {
    return 'ilan-detay.html?id=' + encodeURIComponent(listing.id);
  }

  function buildHomeShowcaseListingCard(listing) {
    var img = (listing.images && listing.images[0]) || listing.image || 'https://via.placeholder.com/160x120';
    var priceText = typeof listing.price === 'number' ? JETLE.formatCurrency(listing.price) : String(listing.price || '');
    var dateText = listing.dateLabel || JETLE.formatDate(listing.createdAt);
    var catLabel = String(listing.category || '').trim();
    var href = getHomeVitrinDetailHref(listing);
    return '' +
      '<a class="listing-card-row listing-card-row--vitrin listing-card-interactive" href="' + href + '" data-href="' + href + '">' +
        '<div class="listing-card-image listing-card-image--vitrin">' +
          '<img src="' + JETLE.escapeHtml(img) + '" alt="' + JETLE.escapeHtml(listing.title || '') + '" width="160" height="120" loading="lazy" />' +
        '</div>' +
        '<div class="listing-card-body listing-card-body--vitrin">' +
          (catLabel ? '<span class="listing-card-vitrin-cat">' + JETLE.escapeHtml(catLabel) + '</span>' : '') +
          '<div class="listing-card-title listing-card-title--vitrin">' + JETLE.escapeHtml(listing.title || '') + '</div>' +
          '<div class="listing-card-price listing-card-price--vitrin">' + JETLE.escapeHtml(priceText) + '</div>' +
          '<div class="listing-card-meta-line listing-card-meta-line--vitrin">' +
            '<span class="listing-card-loc">' + JETLE.escapeHtml(listing.location || '') + '</span>' +
            '<span class="listing-card-date">' + JETLE.escapeHtml(dateText) + '</span>' +
          '</div>' +
        '</div>' +
      '</a>';
  }

  function getModerationStatusLabel(status) {
    if (status === 'beklemede') return 'Beklemede İnceleniyor';
    if (status === 'yayında') return 'Yayında';
    if (status === 'reddedildi') return 'Reddedildi';
    if (status === 'pasif') return 'Pasif';
    return 'Beklemede İnceleniyor';
  }

  function getListingModel(listing) {
    return String((listing.details && listing.details.model) || '').trim();
  }

  function getListingSocialProof(listing) {
    const favoritesMap = JETLE.getFavoritesMap();
    const favoriteCount = Object.keys(favoritesMap).reduce(function (sum, userId) {
      const items = Array.isArray(favoritesMap[userId]) ? favoritesMap[userId] : [];
      return sum + (items.includes(listing.id) ? 1 : 0);
    }, 0);

    if (typeof listing.views === 'number' || typeof listing.favoriteCount === 'number') {
      return {
        views: Number(listing.views || 0),
        favorites: Number(listing.favoriteCount || favoriteCount || 0)
      };
    }

    const seed = String(listing.id || '').split('').reduce(function (sum, char) {
      return sum + char.charCodeAt(0);
    }, 0);

    return {
      views: 90 + (seed % 280),
      favorites: favoriteCount || (1 + (seed % 6))
    };
  }

  function getListingMomentum(listing) {
    const seed = String(listing.id || '').split('').reduce(function (sum, char) {
      return sum + char.charCodeAt(0);
    }, 0);
    return {
      todayViews: 8 + (seed % 17)
    };
  }

  function isNewListing(listing) {
    const createdAt = new Date(listing.createdAt).getTime();
    return (Date.now() - createdAt) / 3600000 <= 48;
  }

  function isUrgentListing(listing) {
    const title = String((listing && listing.title) || '').toLowerCase();
    const description = String((listing && listing.description) || '').toLowerCase();
    return Boolean(listing && (listing.urgent || title.includes('acil') || description.includes('acil')));
  }

  function hasPriceDropBadge(listing) {
    const previousPrice = Number((listing && listing.previousPrice) || 0);
    const currentPrice = Number((listing && listing.price) || 0);
    return previousPrice > 0 && currentPrice > 0 && currentPrice < previousPrice;
  }

  function isPopularListing(listing) {
    const socialProof = getListingSocialProof(listing);
    const momentum = getListingMomentum(listing);
    return socialProof.views >= 220 || socialProof.favorites >= 8 || momentum.todayViews >= 18;
  }

  function getAttentionBadgeMarkup(listing) {
    const badges = [];
    if (isUrgentListing(listing)) badges.push('<span class="badge badge-attention badge-attention-urgent">ACİL</span>');
    if (isNewListing(listing)) badges.push('<span class="badge badge-attention badge-attention-new">YENİ</span>');
    if (hasPriceDropBadge(listing)) badges.push('<span class="badge badge-attention badge-attention-price">FİYAT DÜŞTÜ</span>');
    if (isPopularListing(listing)) badges.push('<span class="badge badge-attention badge-attention-popular">POPÜLER</span>');
    return badges.join('');
  }

  function getRelativeUpdateText(listing) {
    const sourceDate = listing.updatedAt || listing.createdAt;
    const diffMs = Date.now() - new Date(sourceDate).getTime();
    const diffHours = Math.max(1, Math.round(diffMs / 3600000));
    if (diffHours < 24) return diffHours + ' saat önce';
    const diffDays = Math.round(diffHours / 24);
    return diffDays + ' gün önce';
  }

  function getDetailSpecsMarkup(listing) {
    const details = listing.details || {};
    const labels = {
      brand: 'Marka',
      model: 'Model',
      series: 'Seri',
      bodyType: 'Kasa Tipi',
      fuel: 'Yakıt',
      transmission: 'Vites',
      traction: 'Çekiş',
      listingType: 'İlan Tipi',
      estateType: 'Emlak Türü',
      year: 'Yıl',
      km: 'KM',
      engineVolume: 'Motor Hacmi',
      enginePower: 'Motor Gücü',
      plateOrigin: 'Plaka / Uyruk',
      sellerType: 'Kimden',
      exchange: 'Takas',
      heavyDamage: 'Ağır Hasar Kayıtlı',
      condition: 'Durum',
      segment: 'Segment',
      color: 'Renk',
      city: 'İl',
      district: 'İlçe',
      neighborhood: 'Mahalle',
      m2: 'm²',
      roomCount: 'Oda Sayısı',
      buildingAge: 'Bina Yaşı',
      floor: 'Kat',
      totalFloors: 'Toplam Kat',
      heating: 'Isıtma',
      balcony: 'Balkon',
      elevator: 'Asansör',
      parking: 'Otopark',
      furnished: 'Eşyalı mı',
      warranty: 'Garanti Durumu'
    };

    const isVehicle = getCategoryGroup(listing.category) === 'Araçlar';
    const vehicleOrder = ['brand', 'model', 'series', 'year', 'km', 'fuel', 'transmission', 'bodyType', 'enginePower', 'engineVolume', 'traction', 'color', 'condition', 'sellerType', 'exchange', 'heavyDamage'];
    const estateOrder = ['listingType', 'estateType', 'roomCount', 'm2', 'buildingAge', 'floor', 'totalFloors', 'heating', 'balcony', 'elevator', 'parking', 'furnished', 'city', 'district', 'neighborhood'];
    const defaultOrder = ['brand', 'model', 'bodyType', 'fuel', 'transmission', 'traction', 'year', 'km', 'engineVolume', 'enginePower', 'plateOrigin', 'sellerType', 'exchange', 'heavyDamage', 'condition', 'segment', 'color', 'm2', 'roomCount', 'buildingAge', 'warranty'];
    const isEstate = getCategoryGroup(listing.category) === 'Gayrimenkul';
    const preferredOrder = isVehicle ? vehicleOrder : (isEstate ? estateOrder : defaultOrder);
    const rows = preferredOrder.filter(function (key) {
      return isVehicle || isEstate ? Object.prototype.hasOwnProperty.call(labels, key) : details[key];
    }).map(function (key) {
      const value = details[key] ? String(details[key]) : '-';
      return '<div class="detail-spec-row"><span>' + labels[key] + '</span><strong>' + JETLE.escapeHtml(value) + '</strong></div>';
    });

    if (isVehicle || isEstate) {
      rows.push('<div class="detail-spec-row"><span>İlan No</span><strong>' + JETLE.escapeHtml(String(listing.listingNumber || '-')) + '</strong></div>');
    }

    if (!rows.length) {
      return '<div class="empty-state compact-empty-state"><h3>Detay bilgisi bulunmuyor</h3><p>İlan sahibi ek teknik özellik paylaşmamış.</p></div>';
    }

    return '<div class="detail-spec-table">' + rows.join('') + '</div>';
  }

  function getVehicleEquipmentMarkup(listing) {
    const details = listing.details || {};
    const equipment = Array.isArray(details.equipment) ? details.equipment.filter(Boolean) : [];
    if (!equipment.length) return '';

    return '' +
      '<section class="panel detail-equipment-panel">' +
        '<div class="panel-head compact"><h2>Donanım Özellikleri</h2></div>' +
        '<div class="detail-equipment-badges">' +
          equipment.map(function (item) {
            return '<span class="detail-equipment-badge">' + JETLE.escapeHtml(String(item)) + '</span>';
          }).join('') +
        '</div>' +
      '</section>';
  }

  function buildNativeAdCard(index) {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const activeAds = JETLE.getContextualAdsByPlacement('inline', { category: selectedCategory });
    const ad = activeAds[index % (activeAds.length || 1)] || null;
    const adUrl = (ad && ad.ctaUrl) || 'reklam-ver.html';
    const adImage = (ad && ad.image) || '';
    if (ad && ad.id) {
      JETLE.trackAdImpression(ad.id);
    }
    return '' +
      '<article class="listing-card listing-card-ad">' +
        '<div class="listing-card-image listing-card-ad-image">' +
          '<span class="sponsored-tag">Sponsorlu</span>' +
          '<a href="' + JETLE.escapeHtml(adUrl) + '" class="native-ad-visual" data-ad-click-id="' + JETLE.escapeHtml((ad && ad.id) || '') + '">' +
            (adImage ? '<img src="' + JETLE.escapeHtml(adImage) + '" alt="' + JETLE.escapeHtml((ad && ad.title) || 'Sponsorlu reklam') + '" class="native-ad-visual-image" />' : '') +
            '<div class="native-ad-copy">' +
              '<strong>' + JETLE.escapeHtml((ad && ad.advertiser) || 'JETLE Reklam') + '</strong>' +
              '<span>' + JETLE.escapeHtml((ad && ad.title) || 'Markanızı doğru alıcılarla buluşturun') + '</span>' +
            '</div>' +
          '</a>' +
        '</div>' +
        '<div class="listing-card-body">' +
          '<div class="listing-badges"><span class="badge badge-sponsored">Sponsorlu İçerik</span></div>' +
          '<h3 class="listing-card-title"><a href="' + JETLE.escapeHtml(adUrl) + '">' + JETLE.escapeHtml((ad && ad.title) || 'İlanlar arasında görünür olun') + '</a></h3>' +
          '<div class="listing-card-price">' + JETLE.escapeHtml((ad && ad.packageType) || 'Kurumsal Reklam Alanı') + '</div>' +
          '<div class="listing-card-meta">' +
            '<span>' + JETLE.escapeHtml((ad && ad.description) || 'Anasayfa, kategori ve detay sayfalarında yayın') + '</span>' +
            '<span>' + JETLE.escapeHtml((ad && JETLE.getPlacementLabel(ad.placement)) || ('Gösterim paketi ' + (index + 1))) + '</span>' +
          '</div>' +
          '<div class="listing-card-foot">' +
            '<a class="btn btn-light" href="' + JETLE.escapeHtml(adUrl) + '" data-ad-click-id="' + JETLE.escapeHtml((ad && ad.id) || '') + '">' + JETLE.escapeHtml((ad && ad.ctaText) || 'Teklif Al') + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function buildListingCardHtml(listing, layout) {
      layout = layout || 'row';
      const layoutClass = layout === 'grid' ? 'listing-card-grid' : 'listing-card-row';
      const user = JETLE.getCurrentUser();
      const ownListing = user && user.id === listing.ownerId;
      const coverImage = (listing.images && listing.images[0]) || listing.image || 'https://placehold.co/800x600?text=JETLE';
      const socialProof = getListingSocialProof(listing);
      const owner = getOwnerProfile(listing);
      const profileUrl = owner.username ? getProfileUrl(owner) : '';
      const store = getListingStore(owner, listing);
      const sellerBadgesMarkup = getSellerBadgesMarkup(owner, store, 'listing-card-trust-badge');
      const sellerDisplayName = store
        ? (store.name || listing.storeName || listing.ownerName)
        : (listing.ownerName || owner.name || 'Bireysel kullanıcı');
      const vehicleListing = isVehicleListing(listing);
      const vehicleYear = getListingDetailValue(listing, 'year');
      const vehicleKm = getListingNumericDetail(listing, 'km');
      const vehicleFuel = getListingDetailValue(listing, 'fuel');
      const vehicleTransmission = getListingDetailValue(listing, 'transmission');
      const vehicleSummary = [vehicleYear, vehicleKm ? JETLE.formatNumber(vehicleKm) + ' km' : '', vehicleFuel, vehicleTransmission].filter(Boolean).join(' • ');
      const listingDate = JETLE.formatDate(listing.createdAt);
      const attentionBadges = getAttentionBadgeMarkup(listing);
      const categoryTagText = String(listing.category || '').trim() || String(JETLE.getCategoryGroupByName(listing.categoryGroup || listing.category || '') || '').trim();
      const badgeRow = (!vehicleListing ? ((listing.premium ? '<span class="badge badge-premium">Öne Çıkan</span>' : '') + attentionBadges + getVerificationBadgeMarkup(listing.verification)) : (attentionBadges + getVerificationBadgeMarkup(listing.verification)));
      const vehicleFactsRow = vehicleListing
        ? '<div class="listing-card-vehicle-facts">' +
            (vehicleYear ? '<span>' + JETLE.escapeHtml(vehicleYear) + '</span>' : '') +
            (vehicleKm ? '<span>' + JETLE.escapeHtml(JETLE.formatNumber(vehicleKm) + ' km') + '</span>' : '') +
            (vehicleFuel ? '<span>' + JETLE.escapeHtml(vehicleFuel) + '</span>' : '') +
            (vehicleTransmission ? '<span>' + JETLE.escapeHtml(vehicleTransmission) + '</span>' : '') +
          '</div>'
        : '';
      const sellerCompact = store
        ? '<div class="listing-card-seller-compact"><span class="listing-card-seller-name">' + JETLE.escapeHtml(sellerDisplayName) + '</span>' + (sellerBadgesMarkup ? '<span class="listing-card-seller-b">' + sellerBadgesMarkup + '</span>' : '') + '</div>'
        : '<div class="listing-card-seller-compact"><span class="listing-card-seller-name">' + JETLE.escapeHtml(sellerDisplayName) + '</span>' + (sellerBadgesMarkup ? '<span class="listing-card-seller-b">' + sellerBadgesMarkup + '</span>' : '') + (profileUrl && !vehicleListing ? ' <a href="' + profileUrl + '" class="listing-card-profile-link">Profil</a>' : '') + '</div>';
      return '' +
        '<article class="listing-card ' + layoutClass + ' ' + (vehicleListing ? 'listing-card-vehicle ' : '') + 'listing-card-interactive" data-href="' + getDetailUrl(listing) + '">' +
        '<div class="listing-card-image">' +
          (coverImage ? '<img src="' + coverImage + '" alt="' + JETLE.escapeHtml(listing.title) + '" />' : '') +
          '<div class="listing-card-image-badges">' + (listing.premium ? '<span class="badge badge-premium">Vitrin</span>' : '') + attentionBadges + '</div>' +
          '<button class="favorite-btn ' + (isFavorite(listing.id) ? 'active' : '') + '" type="button" data-favorite-id="' + listing.id + '">' + (isFavorite(listing.id) ? '♥' : '♡') + '</button>' +
        '</div>' +
        '<div class="listing-card-body">' +
          '<div class="listing-badges">' + badgeRow + '</div>' +
          '<h3 class="listing-card-title"><a href="' + getDetailUrl(listing) + '">' + JETLE.escapeHtml(listing.title) + '</a></h3>' +
          '<div class="listing-card-price">' + JETLE.formatCurrency(listing.price) + '</div>' +
          '<div class="listing-card-meta-line">' +
            '<span class="listing-card-loc">' + JETLE.escapeHtml(listing.location || '—') + '</span>' +
            '<span class="listing-card-date">' + JETLE.escapeHtml(listingDate) + '</span>' +
          '</div>' +
          (categoryTagText ? '<div class="listing-card-cat"><span class="listing-card-cat-tag">' + JETLE.escapeHtml(categoryTagText) + '</span></div>' : '') +
          vehicleFactsRow +
          sellerCompact +
          '<div class="listing-card-bottom-row">' +
            '<span class="listing-card-views">' + socialProof.views + ' görüntülenme</span>' +
            (!vehicleListing ? '<span class="listing-card-fav-hint">' + socialProof.favorites + ' favori</span>' : '') +
            getListingFreshnessMarkup(listing) +
          '</div>' +
          '<div class="listing-card-foot">' +
              '<a class="btn btn-light btn-sm" href="' + getDetailUrl(listing) + '">İncele</a>' +
              (getComparableGroup(listing) ? '<button type="button" class="btn btn-light btn-sm" data-compare-id="' + listing.id + '">' + (isComparedListing(listing.id) ? 'Karşılaştırmada' : 'Karşılaştır') + '</button>' : '') +
              (!ownListing ? '<button type="button" class="btn btn-light btn-sm" data-follow-listing-id="' + listing.id + '">' + (isListingFollowed(listing.id) ? 'Takibi Bırak' : 'Takip') + '</button>' : '') +
              (ownListing ? '<a class="btn btn-primary btn-sm btn-boost" href="doping.html?listingId=' + listing.id + '">Öne Çıkar</a>' : '') +
              (ownListing ? '<button type="button" class="btn btn-danger btn-sm" data-delete-id="' + listing.id + '">Sil</button>' : '') +
            '</div>' +
        '</div>' +
        '</article>';
  }

  function buildListingCard(listing) {
    return buildListingCardHtml(listing, 'row');
  }

  function buildListingGridCard(listing) {
    return buildListingCardHtml(listing, 'grid');
  }

  function buildModernListingCard(listing) {
    const title = JETLE.escapeHtml(String((listing && listing.title) || 'İlan başlığı'));
    const location = JETLE.escapeHtml(String((listing && listing.location) || 'Türkiye'));
    const image = JETLE.escapeHtml(String((listing && listing.image) || (listing && listing.images && listing.images[0]) || 'https://via.placeholder.com/300x200'));
    const priceText = typeof listing.price === 'number'
      ? JETLE.formatCurrency(listing.price)
      : JETLE.escapeHtml(String((listing && listing.price) || 'Fiyat bilgisi'));
    return '' +
      '<article class="listing-modern-card">' +
        '<div class="listing-modern-card__media"><img src="' + image + '" alt="' + title + '" loading="lazy" /></div>' +
        '<div class="listing-modern-card__body">' +
          '<h3 class="listing-modern-card__title">' + title + '</h3>' +
          '<div class="listing-modern-card__price">' + priceText + '</div>' +
          '<div class="listing-modern-card__location">' + location + '</div>' +
        '</div>' +
      '</article>';
  }

  /**
   * Ana sayfa #listingGrid: ilan dizisini grid kartları olarak basar (isteğe bağlı inline reklamlar).
   * @param {Array} data Filtrelenmiş ilan listesi
   * @param {string} [categoryForAds='all'] Reklam bağlamı için kategori kodu
   */
  function renderListings(data, categoryForAds) {
    const grid = document.getElementById('listingGrid');
    if (!grid) return;
    const items = Array.isArray(data) ? data : [];
    void categoryForAds;
    grid.className = 'listing-grid listing-grid--cards listing-grid--three modern-listing-grid';
    grid.innerHTML = items.map(function (item) {
      return buildModernListingCard(item);
    }).join('');
  }

  function toggleFavorite(listingId) {
    const user = requireAuth();
    if (!user) return;

    const favorites = getUserFavorites(user.id);
    const exists = favorites.includes(listingId);
    const next = exists ? favorites.filter(function (id) { return id !== listingId; }) : favorites.concat(listingId);
    saveUserFavorites(user.id, next);
    if (!exists) {
      const listing = JETLE.getListings().find(function (item) { return item.id === listingId; });
      if (listing && listing.ownerId && listing.ownerId !== user.id && typeof JETLE.addNotification === 'function') {
        JETLE.addNotification(listing.ownerId, {
          type: 'favorite',
          title: 'İlanınıza ilgi var',
          text: '"' + listing.title + '" ilanınız bir kullanıcı tarafından favorilere eklendi.'
        });
      }
    }
    JETLE.showToast(exists ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.');

    const page = document.body.dataset.page;
    if (page === 'home') renderHomeListings();
    if (page === 'favorites') renderFavoritesPage();
    if (page === 'listing-detail') renderListingDetailPage();
  }

  function toggleListingFollow(listingId) {
    const user = requireAuth();
    if (!user) return;

    const follows = getUserListingFollows(user.id);
    const exists = follows.includes(listingId);
    const next = exists ? follows.filter(function (id) { return id !== listingId; }) : follows.concat(listingId);
    saveUserListingFollows(user.id, next);
    JETLE.showToast(exists ? 'İlan takibinden çıkarıldı.' : 'İlan takibe alındı.');

    const page = document.body.dataset.page;
    if (page === 'home') renderHomeListings();
    if (page === 'favorites') renderFavoritesPage();
    if (page === 'listing-detail') renderListingDetailPage();
  }

  function getListingReportReasonOptions() {
    return [
      { value: 'wrong-category', label: 'Yanlış kategori' },
      { value: 'fake-listing', label: 'Sahte ilan' },
      { value: 'inappropriate-content', label: 'Uygunsuz içerik' },
      { value: 'spam', label: 'Spam' },
      { value: 'other', label: 'Diğer' }
    ];
  }

  function getListingReportReasonLabel(reason) {
    const match = getListingReportReasonOptions().find(function (item) {
      return item.value === reason;
    });
    return match ? match.label : 'Diğer';
  }

  function deleteListing(listingId) {
    const user = requireAuth();
    if (!user) return;

    const listings = JETLE.getListings();
    const listing = listings.find(function (item) { return item.id === listingId; });
    if (!listing || listing.ownerId !== user.id) {
      JETLE.showToast('Bu ilanı silme yetkiniz yok.');
      return;
    }

    if (!window.confirm('İlanı silmek istediğinize emin misiniz?')) {
      return;
    }

    JETLE.saveListings(listings.filter(function (item) { return item.id !== listingId; }));
    JETLE.showToast('İlan silindi.');

    const page = document.body.dataset.page;
    if (page === 'listing-detail') {
      window.location.href = 'index.html';
    } else if (page === 'favorites') {
      renderFavoritesPage();
    } else {
      renderHomeListings();
    }
  }

  function bindListingActions(container) {
    if (!container) return;
    container.onclick = function (event) {
      const interactiveCard = event.target.closest('.listing-card-interactive');
      const favoriteButton = event.target.closest('[data-favorite-id]');
      if (favoriteButton) {
        toggleFavorite(favoriteButton.dataset.favoriteId);
        return;
      }

      const compareButton = event.target.closest('[data-compare-id]');
      if (compareButton) {
        toggleCompareListing(compareButton.dataset.compareId);
        return;
      }

      const followButton = event.target.closest('[data-follow-listing-id]');
      if (followButton) {
        toggleListingFollow(followButton.dataset.followListingId);
        return;
      }

      const deleteButton = event.target.closest('[data-delete-id]');
      if (deleteButton) {
        deleteListing(deleteButton.dataset.deleteId);
        return;
      }

      if (event.target.closest('a, button, input, select, textarea')) {
        return;
      }

      if (interactiveCard && interactiveCard.dataset.href) {
        window.location.href = interactiveCard.dataset.href;
      }
    };
  }

  function isCategoryMatch(listingCategory, selectedCategory) {
    if (!selectedCategory || selectedCategory === 'all') return true;
    const normalized = String(listingCategory || '').toLowerCase();
    const exact = normalized === String(selectedCategory).toLowerCase();
    if (exact) return true;

    const group = JETLE.CATEGORY_GROUPS.find(function (item) {
      return item.title === selectedCategory;
    });

    if (!group) return false;

    const groupMatch = group.items.some(function (item) {
      return item.name.toLowerCase() === normalized;
    });

    const legacyMatch = (group.aliases || []).some(function (alias) {
      return alias.toLowerCase() === normalized;
    });

    return groupMatch || legacyMatch;
  }

  function isFeaturedMatch(listing, mode) {
    if (!mode || mode === 'all') return true;
    const createdAt = new Date(listing.createdAt).getTime();
    const ageInDays = (Date.now() - createdAt) / 86400000;

    if (mode === 'featured') return Boolean(listing.premium);
    if (mode === 'new') return ageInDays <= 7;
    if (mode === 'trend') return Boolean(listing.premium) || ageInDays <= 14 || Number(listing.price || 0) >= 50000;
    return true;
  }

  function getVehicleCatalogBrandKey(brandValue) {
    const normalized = String(brandValue || '').trim();
    if (normalized === 'Mercedes') return 'Mercedes-Benz';
    return normalized;
  }

  function getVehicleBrands() {
    return Object.keys(vehicleCatalog).slice().sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
  }

  function getVehicleSeriesForBrand(brandValue) {
    const brandKey = getVehicleCatalogBrandKey(brandValue);
    if (!brandKey || brandKey === 'all') return [];
    return Object.keys(vehicleCatalog[brandKey] || {}).slice().sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
  }

  function getVehicleModelsForSeries(brandValue, seriesValue) {
    const brandKey = getVehicleCatalogBrandKey(brandValue);
    if (!brandKey || brandKey === 'all' || !seriesValue || seriesValue === 'all') return [];
    return (vehicleCatalog[brandKey] && vehicleCatalog[brandKey][seriesValue] ? vehicleCatalog[brandKey][seriesValue] : []).slice().sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
  }

  function getVehicleModelsForBrand(brandValue) {
    const brandKey = getVehicleCatalogBrandKey(brandValue);
    if (!brandKey || brandKey === 'all') return [];
    const seriesMap = vehicleCatalog[brandKey] || {};
    return Object.keys(seriesMap).reduce(function (models, seriesName) {
      return models.concat(seriesMap[seriesName] || []);
    }, []).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
  }

  function getListingCity(listing) {
    return String((listing.location || '').split('/')[0] || '').trim();
  }

  /**
   * Şehir filtresi: lokasyon "İl / İlçe" formatında olduğu için tam location eşitliği değil il ile eşleşir.
   * "Tüm şehirler" (all) → filtre uygulanmaz.
   */
  function listingMatchesSelectedCity(listing, selectedCity) {
    if (!selectedCity || selectedCity === 'all') return true;
    return getListingCity(listing) === selectedCity;
  }

  function resolveCityFilterValueFromQuery(raw) {
    if (!raw || String(raw).toLowerCase() === 'all') return 'all';
    var s = String(raw).trim();
    var found = TURKEY_PROVINCES_81.find(function (p) {
      return p === s || p.toLowerCase() === s.toLowerCase();
    });
    return found || 'all';
  }

  function getActiveHomeCityFilterValue() {
    const citySelect = document.getElementById('citySelect');
    if (citySelect) return citySelect.value;
    if (document.getElementById('cityFilter')) return document.getElementById('cityFilter').value;
    if (document.getElementById('heroCityFilter')) return document.getElementById('heroCityFilter').value;
    return 'all';
  }

  function getListingCondition(listing) {
    const value = String(listing.condition || (listing.details && listing.details.condition) || '').toLowerCase();
    if (value === 'new' || value === 'yeni') return 'new';
    return 'used';
  }

  function getListingDetailValue(listing, key) {
    return String((listing.details && listing.details[key]) || '').trim();
  }

  function getListingNumericDetail(listing, key) {
    const rawValue = getListingDetailValue(listing, key).replace(/[^\d]/g, '');
    return rawValue ? Number(rawValue) : 0;
  }

  function isVehicleListing(listing) {
    const categoryGroup = JETLE.getCategoryGroupByName(listing.categoryGroup || listing.category || '');
    return categoryGroup === 'Araçlar' || Boolean(getListingBrand(listing));
  }

  function isEstateListing(listing) {
    const categoryGroup = JETLE.getCategoryGroupByName(listing.categoryGroup || listing.category || '');
    return categoryGroup === 'Gayrimenkul' || Boolean(getListingDetailValue(listing, 'estateType'));
  }

  function getListingDistrict(listing) {
    return String(getListingDetailValue(listing, 'district') || ((listing.location || '').split('/')[1] || '')).trim();
  }

  function isDateMatch(listing, maxAgeDays) {
    if (!maxAgeDays || maxAgeDays === 'all') return true;
    if (maxAgeDays === 'today') {
      const d = new Date(listing.createdAt);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    }
    if (maxAgeDays === '24h') {
      const ageHours = (Date.now() - new Date(listing.createdAt).getTime()) / 3600000;
      return ageHours <= 24;
    }
    const createdAt = new Date(listing.createdAt).getTime();
    const ageInDays = (Date.now() - createdAt) / 86400000;
    const n = Number(maxAgeDays);
    if (isNaN(n)) return true;
    return ageInDays <= n;
  }

  function sortListings(listings, mode) {
    const items = listings.slice();
    if (mode === 'oldest') {
      return items.sort(function (a, b) { return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); });
    }
    if (mode === 'price-asc') {
      return items.sort(function (a, b) { return Number(a.price || 0) - Number(b.price || 0); });
    }
    if (mode === 'price-desc') {
      return items.sort(function (a, b) { return Number(b.price || 0) - Number(a.price || 0); });
    }
    if (mode === 'km-asc') {
      return items.sort(function (a, b) { return getListingNumericDetail(a, 'km') - getListingNumericDetail(b, 'km'); });
    }
    if (mode === 'km-desc') {
      return items.sort(function (a, b) { return getListingNumericDetail(b, 'km') - getListingNumericDetail(a, 'km'); });
    }
    return items.sort(function (a, b) {
      if (Number(b.premium) !== Number(a.premium)) {
        return Number(b.premium) - Number(a.premium);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /** Ana sayfa sol ağaç: URL slug (ör. otomobil) ↔ filtre değeri (Otomobil) */
  const HOME_CATEGORY_TREE = [
    {
      title: 'Araçlar',
      display: 'Vasıta',
      slug: 'vasita',
      items: [
        { name: 'Otomobil', slug: 'otomobil' },
        { name: 'SUV & Pickup', display: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup' },
        { name: 'Elektrikli Araçlar', slug: 'elektrikli-araclar' },
        { name: 'Motosiklet', slug: 'motosiklet' },
        { name: 'Minivan & Panelvan', slug: 'minivan-panelvan' },
        { name: 'Ticari Araçlar', slug: 'ticari-araclar' }
      ]
    },
    {
      title: 'Gayrimenkul',
      display: 'Emlak',
      slug: 'emlak',
      items: [
        { name: 'Konut', slug: 'konut' },
        { name: 'İş Yeri', slug: 'is-yeri' },
        { name: 'Arsa', slug: 'arsa' },
        { name: 'Bina', slug: 'bina' },
        { name: 'Devre Mülk', slug: 'devre-mulk' }
      ]
    },
    {
      title: 'Alışveriş',
      display: 'Alışveriş',
      slug: 'alisveris',
      items: [
        { name: 'Telefon & Aksesuar', display: 'Telefon', slug: 'telefon' },
        { name: 'Bilgisayar', slug: 'bilgisayar' },
        { name: 'Ev Elektroniği', slug: 'ev-elektronigi' },
        { name: 'Giyim & Aksesuar', display: 'Moda', slug: 'moda' },
        { name: 'Anne & Bebek', slug: 'anne-bebek' }
      ]
    },
    {
      title: 'İş & Sanayi',
      display: 'İş & Sanayi',
      slug: 'is-sanayi',
      items: [
        { name: 'İş Makineleri', slug: 'is-makineleri' },
        { name: 'Tarım Makineleri', slug: 'tarim-makineleri' },
        { name: 'Sanayi Ekipmanları', slug: 'sanayi-ekipmanlari' }
      ]
    },
    {
      title: 'Hizmetler',
      display: 'Hizmetler',
      slug: 'hizmetler',
      items: [
        { name: 'Nakliye', slug: 'nakliye' },
        { name: 'Temizlik Hizmetleri', display: 'Temizlik', slug: 'temizlik' },
        { name: 'Ev Tadilat', display: 'Tamirat', slug: 'tamirat' },
        { name: 'Servis & Bakım', display: 'Teknik Servis', slug: 'teknik-servis' }
      ]
    }
  ];

  var HOME_SLUG_TO_FILTER_CACHE = null;
  function getHomeSlugToFilterMap() {
    if (HOME_SLUG_TO_FILTER_CACHE) return HOME_SLUG_TO_FILTER_CACHE;
    var map = { '': 'all', all: 'all' };
    HOME_CATEGORY_TREE.forEach(function (branch) {
      map[String(branch.slug).toLowerCase()] = branch.title;
      branch.items.forEach(function (item) {
        map[String(item.slug).toLowerCase()] = item.name;
      });
    });
    HOME_SLUG_TO_FILTER_CACHE = map;
    return map;
  }

  function homeSlugToCategoryFilter(slug) {
    if (!slug || String(slug).toLowerCase() === 'all') return 'all';
    var k = String(slug).trim().toLowerCase().replace(/_/g, '-');
    var map = getHomeSlugToFilterMap();
    if (map[k]) return map[k];
    if (JETLE.CATEGORIES && JETLE.CATEGORIES.indexOf(slug) !== -1) return slug;
    var cat = (JETLE.CATEGORIES || []).find(function (c) {
      return String(c).toLowerCase() === k;
    });
    if (cat) return cat;
    var g = (JETLE.CATEGORY_GROUPS || []).find(function (gr) {
      return String(gr.title).toLowerCase() === k;
    });
    return g ? g.title : 'all';
  }

  function homeCategoryFilterToSlug(filterValue) {
    if (!filterValue || filterValue === 'all') return '';
    for (var bi = 0; bi < HOME_CATEGORY_TREE.length; bi++) {
      var br = HOME_CATEGORY_TREE[bi];
      if (br.title === filterValue) return br.slug;
      for (var ii = 0; ii < br.items.length; ii++) {
        if (br.items[ii].name === filterValue) return br.items[ii].slug;
      }
    }
    return '';
  }

  /** URL ?category= ve listing.categorySlug aynı normalizasyon (küçük harf, boşluk trim, _ → -). */
  function normalizeCategorySlugParam(raw) {
    return String(raw || '').trim().toLowerCase().replace(/_/g, '-');
  }

  /** İlanın URL ile eşleşen slug'ı: önce kayıtlı categorySlug, yoksa ağaçtan türetme. */
  function getListingCategorySlug(listing) {
    if (listing && listing.categorySlug) {
      return normalizeCategorySlugParam(listing.categorySlug);
    }
    var cat = String((listing && listing.category) || '').trim();
    if (!cat) return '';
    for (var bi = 0; bi < HOME_CATEGORY_TREE.length; bi++) {
      var br = HOME_CATEGORY_TREE[bi];
      for (var ii = 0; ii < br.items.length; ii++) {
        if (br.items[ii].name === cat) {
          return normalizeCategorySlugParam(br.items[ii].slug);
        }
      }
    }
    return normalizeCategorySlugParam(slugify(cat));
  }

  /** URL ?category=: yaprak slug birebir; dal slug ise (vasita) alt kategori slug’larından biri. */
  function listingCategorySlugMatchesUrl(listing, urlNorm) {
    if (!urlNorm || urlNorm === 'all') return true;
    var listingSlug = getListingCategorySlug(listing);
    if (listingSlug === urlNorm) return true;
    for (var bi = 0; bi < HOME_CATEGORY_TREE.length; bi++) {
      var branch = HOME_CATEGORY_TREE[bi];
      if (normalizeCategorySlugParam(branch.slug) === urlNorm) {
        return branch.items.some(function (it) {
          return normalizeCategorySlugParam(it.slug) === listingSlug;
        });
      }
    }
    return false;
  }

  function buildHomeCategoryQueryHref(slug) {
    if (!slug || slug === 'all') return 'index.html';
    return 'index.html?category=' + encodeURIComponent(slug);
  }

  /** Ana sayfa #categoryList — açılır dal, varsayılan kapalı; seçim bu dalda ise açık. */
  function buildHomeCategoryTreeMarkup(activeResolved) {
    var ar = activeResolved === undefined || activeResolved === null ? 'all' : activeResolved;
    return '' +
      '<div class="category-home-tree" data-home-category-tree="static">' +
      '<a class="category-home-all category-home-link ' + (ar === 'all' ? 'is-active' : '') + '" href="index.html" data-home-category-slug="all" data-category="all">Tüm ilanlar</a>' +
      HOME_CATEGORY_TREE.map(function (branch) {
        var groupOnlyActive = ar !== 'all' && ar === branch.title;
        var branchShouldOpen = groupOnlyActive || branch.items.some(function (it) { return it.name === ar; });
        var gh = buildHomeCategoryQueryHref(branch.slug);
        return '' +
          '<div class="category-home-branch' + (branchShouldOpen ? ' is-open' : '') + '" data-branch-slug="' + JETLE.escapeHtml(branch.slug) + '">' +
            '<div class="category-home-branch-head">' +
              '<button type="button" class="category-home-toggle" data-action="toggle-branch" aria-expanded="' + (branchShouldOpen ? 'true' : 'false') + '" aria-label="Alt kategorileri göster veya gizle" data-branch-slug="' + JETLE.escapeHtml(branch.slug) + '">' +
                '<span class="category-home-chevron" aria-hidden="true">›</span>' +
              '</button>' +
              '<a class="category-home-group category-home-link ' + (groupOnlyActive ? 'is-active' : '') + '" href="' + gh + '" data-home-category-slug="' + JETLE.escapeHtml(branch.slug) + '" data-category="' + JETLE.escapeHtml(branch.title) + '">' +
                '<span class="category-home-group-label">' + JETLE.escapeHtml(branch.display) + '</span>' +
              '</a>' +
            '</div>' +
            '<ul class="category-home-subs">' +
            branch.items.map(function (item) {
              var subActive = item.name === ar;
              var label = item.display || item.name;
              var sh = buildHomeCategoryQueryHref(item.slug);
              return '<li><a class="category-home-sub category-home-link ' + (subActive ? 'is-active' : '') + '" href="' + sh + '" data-home-category-slug="' + JETLE.escapeHtml(item.slug) + '" data-category="' + JETLE.escapeHtml(item.name) + '">' + JETLE.escapeHtml(label) + '</a></li>';
            }).join('') +
            '</ul>' +
          '</div>';
      }).join('') +
      '</div>';
  }

  /** Kategori ağacı boş veya eksikse (hata / eski önbellek) DOM’a yeniden yükler. */
  function ensureHomeCategoryGuideDom() {
    if (!document.body || document.body.dataset.page !== 'home') return;
    var el = document.getElementById('categoryList');
    if (!el) return;
    var tree = el.querySelector('[data-home-category-tree="static"]');
    var branches = el.querySelectorAll('.category-home-branch');
    var hasLinks = el.querySelector('a.category-home-link');
    if (tree && branches.length && hasLinks) return;
    if (!tree || !branches.length || !hasLinks || el.textContent.replace(/\s/g, '').length < 20) {
      el.innerHTML = buildHomeCategoryTreeMarkup('all');
    }
  }

  /** Ana sayfadaki statik HTML kategori ağacında seçim görünümünü günceller (innerHTML dokunulmaz). */
  function updateHomeStaticCategoryTree(active) {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    const root = categoryList.querySelector('[data-home-category-tree="static"]');
    if (!root) return;
    const activeResolved = active;
    const allBtn = root.querySelector('.category-home-all');
    if (allBtn) {
      allBtn.classList.toggle('is-active', activeResolved === 'all');
      allBtn.classList.toggle('category-home-link--active', activeResolved === 'all');
    }
    root.querySelectorAll('a.category-home-group.category-home-link').forEach(function (el) {
      const cat = String(el.getAttribute('data-category') || '');
      const groupOnlyActive = activeResolved !== 'all' && activeResolved === cat;
      el.classList.toggle('is-active', groupOnlyActive);
      el.classList.toggle('category-home-link--active', groupOnlyActive);
    });
    HOME_CATEGORY_TREE.forEach(function (branch) {
      var shouldOpen = activeResolved !== 'all' && (activeResolved === branch.title || branch.items.some(function (it) { return it.name === activeResolved; }));
      var wrap = root.querySelector('.category-home-branch[data-branch-slug="' + branch.slug + '"]');
      if (wrap) {
        wrap.classList.toggle('is-open', Boolean(shouldOpen));
        var tb = wrap.querySelector('[data-action="toggle-branch"]');
        if (tb) tb.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      }
    });
    root.querySelectorAll('.category-home-sub').forEach(function (el) {
      const cat = String(el.getAttribute('data-category') || '');
      const subActive = cat === activeResolved;
      el.classList.toggle('is-active', subActive);
      el.classList.toggle('category-home-link--active', subActive);
    });
  }

  function renderCategories(active, activeFeatured) {
    ensureHomeCategoryGuideDom();
    const categoryList = document.getElementById('categoryList');
    const categoryFilter = document.getElementById('categoryFilter');
    const sidebarCategoryFilter = document.getElementById('sidebarCategoryFilter');
    const expandedAll = document.body.dataset.categoryExpandedAll === 'true';
    const openGroup = document.body.dataset.openCategoryGroup || '';

    function isGroupOpen(group) {
      if (expandedAll) return true;
      if (openGroup && openGroup === group.title) return true;
      if (group.title === active) return true;
      return group.items.some(function (item) { return item.name === active; });
    }

    if (categoryList) {
      if (document.body.dataset.page === 'home') {
        if (categoryList.querySelector('[data-home-category-tree="static"]')) {
          updateHomeStaticCategoryTree(active);
        } else {
          categoryList.innerHTML = buildHomeCategoryTreeMarkup(active);
        }
      } else {
        categoryList.innerHTML = '' +
          '<div class="category-special-block">' +
            '<div class="category-special-head">Seçtiklerimiz</div>' +
            JETLE.FEATURED_SECTIONS.map(function (item) {
              return '<button type="button" class="category-featured-item ' + (item.value === activeFeatured ? 'active' : '') + '" data-featured="' + item.value + '">' +
                '<span class="category-featured-name">' + item.name + '</span>' +
              '</button>';
            }).join('') +
          '</div>' +
          '<div class="category-special-block">' +
            '<div class="category-special-head">Kategoriler</div>' +
            '<button type="button" class="category-item category-item-all ' + (active === 'all' ? 'active' : '') + '" data-category="all">' +
              '<span class="category-item-main"><span class="category-icon"><i data-lucide="layout-grid"></i></span><span class="category-name-wrap"><strong>Tüm Kategoriler</strong><small>Tüm ilanları görüntüle</small></span></span>' +
            '</button>' +
            JETLE.CATEGORY_GROUPS.map(function (group) {
              const groupOpen = isGroupOpen(group);
              return '' +
                '<div class="category-group ' + (groupOpen ? 'open' : '') + '">' +
                  '<button type="button" class="category-item category-item-group ' + (group.title === active ? 'active' : '') + '" data-category="' + group.title + '" data-category-group="' + group.title + '">' +
                    '<span class="category-item-main"><span class="category-icon"><i data-lucide="' + group.icon + '"></i></span><span class="category-name-wrap"><strong>' + group.title + '</strong><small>Kategoriyi aç</small></span></span>' +
                    '<span class="category-chevron" aria-hidden="true">⌄</span>' +
                  '</button>' +
                  '<div class="category-sublist">' +
                    group.items.map(function (item) {
                      return '<button type="button" class="category-subitem ' + (item.name === active ? 'active' : '') + '" data-category="' + item.name + '"><span>' + item.name + '</span></button>';
                    }).join('') +
                  '</div>' +
                '</div>';
            }).join('') +
          '</div>';
      }
    }

    const categoryOptionsMarkup = '<option value="all">Tüm kategoriler</option>' + JETLE.CATEGORY_GROUPS.map(function (group) {
        const options = ['<option value="' + group.title + '">' + group.title + '</option>'].concat(group.items.map(function (category) {
          return '<option value="' + category.name + '">' + category.name + '</option>';
        })).join('');
        return '<optgroup label="' + group.title + '">' + options + '</optgroup>';
      }).join('');

    if (categoryFilter) {
      categoryFilter.innerHTML = categoryOptionsMarkup;
      categoryFilter.value = (JETLE.CATEGORIES.includes(active) || JETLE.CATEGORY_GROUPS.some(function (group) { return group.title === active; })) ? active : 'all';
    }

    if (sidebarCategoryFilter) {
      sidebarCategoryFilter.innerHTML = categoryOptionsMarkup;
      sidebarCategoryFilter.value = (JETLE.CATEGORIES.includes(active) || JETLE.CATEGORY_GROUPS.some(function (group) { return group.title === active; })) ? active : 'all';
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    const expandToggle = document.getElementById('categoryExpandToggle');
    if (expandToggle) {
      expandToggle.textContent = expandedAll ? 'Kapat' : 'Tümünü Göster';
    }
  }

  function applyHomeListingEmptyAndResults(visibleListings, publishedListings) {
    const emptyState = document.getElementById('listingEmptyState');
    const resultsInfo = document.getElementById('resultsInfo');
    if (!emptyState || !resultsInfo) return;

    const hasNoPublished = publishedListings.length === 0;
    const globalEmpty = visibleListings.length === 0 && hasNoPublished;
    const filterEmpty = visibleListings.length === 0 && !hasNoPublished;

    emptyState.classList.toggle('hidden', visibleListings.length > 0);
    emptyState.classList.toggle('empty-state--global', visibleListings.length === 0 && globalEmpty);
    emptyState.classList.toggle('empty-state--filter', visibleListings.length === 0 && filterEmpty);
    if (visibleListings.length > 0) {
      emptyState.classList.remove('empty-state--global', 'empty-state--filter');
    }

    const emptyTitle = document.getElementById('listingEmptyTitle') || emptyState.querySelector('h3');
    const emptyCopy = document.getElementById('listingEmptyCopy') || emptyState.querySelector('p');
    const emptyShortcuts = document.getElementById('listingEmptyShortcuts');
    const emptyReset = document.getElementById('listingEmptyResetFilters');

    if (visibleListings.length === 0) {
      if (globalEmpty) {
        if (emptyTitle) emptyTitle.textContent = 'Henüz yayında ilan bulunmuyor';
        if (emptyCopy) emptyCopy.textContent = 'İlk ilanlar onaylandığında burada görünecek.';
        if (emptyShortcuts) emptyShortcuts.classList.remove('hidden');
        if (emptyReset) emptyReset.classList.add('hidden');
      } else {
        var urlCatEmpty = new URLSearchParams(window.location.search || '').get('category');
        var hasCategoryUrl = urlCatEmpty && String(urlCatEmpty).trim() && String(urlCatEmpty).toLowerCase() !== 'all';
        if (hasCategoryUrl) {
          if (emptyTitle) emptyTitle.textContent = 'Bu kategoride ilan bulunamadı';
          if (emptyCopy) emptyCopy.textContent = 'Filtreleri güncelleyerek veya başka bir kategori seçerek yeniden deneyebilirsiniz.';
        } else {
          if (emptyTitle) emptyTitle.textContent = 'Seçtiğiniz kriterlere uygun ilan bulunamadı';
          if (emptyCopy) emptyCopy.textContent = 'Filtreleri güncelleyerek veya aramayı genişleterek yeniden deneyebilirsiniz.';
        }
        if (emptyShortcuts) emptyShortcuts.classList.add('hidden');
        if (emptyReset) emptyReset.classList.remove('hidden');
      }
    }

    resultsInfo.textContent = 'Toplam ' + visibleListings.length + ' ilan bulundu';
    if (typeof JETLE.renderSidebarAd === 'function') {
      JETLE.renderSidebarAd();
    }
  }

  function renderHomeListings() {
    const grid = document.getElementById('listingGrid');
    const emptyState = document.getElementById('listingEmptyState');
    const resultsInfo = document.getElementById('resultsInfo');
    if (!grid || !emptyState || !resultsInfo) return;

    const homePageSearchParams = new URLSearchParams(window.location.search || '');
    const urlCategoryParam = homePageSearchParams.get('category');
    const urlCategoryNormalized = normalizeCategorySlugParam(urlCategoryParam);
    const hasUrlCategoryFilter = Boolean(urlCategoryNormalized && urlCategoryNormalized !== 'all');

    const keywordInput = document.getElementById('sidebarKeywordFilter') || document.getElementById('searchInput');
    const query = String((keywordInput && keywordInput.value) || '').trim().toLowerCase();
    const category = document.getElementById('sidebarCategoryFilter') ? document.getElementById('sidebarCategoryFilter').value : ((document.getElementById('categoryFilter') || {}).value || 'all');
    const subcategory = document.getElementById('sidebarSubcategoryFilter') ? document.getElementById('sidebarSubcategoryFilter').value : 'all';
    const city = getActiveHomeCityFilterValue();
    const district = document.getElementById('sidebarDistrictFilter') ? document.getElementById('sidebarDistrictFilter').value : ((document.getElementById('estateDistrictFilter') || {}).value || 'all');
    const brand = document.getElementById('sidebarBrandFilter') ? document.getElementById('sidebarBrandFilter').value : ((document.getElementById('brandFilter') || {}).value || 'all');
    const series = document.getElementById('vehicleSeriesFilter') ? document.getElementById('vehicleSeriesFilter').value : 'all';
    const model = document.getElementById('sidebarModelFilter') ? document.getElementById('sidebarModelFilter').value : ((document.getElementById('modelFilter') || {}).value || 'all');
    const minPrice = Number((document.getElementById('minPriceFilter') || { value: '' }).value || 0);
    const maxPriceValue = (document.getElementById('maxPriceFilter') || { value: '' }).value;
    const maxPrice = maxPriceValue ? Number(maxPriceValue) : 0;
    const minKm = Number((document.getElementById('minKmFilter') || { value: '' }).value || 0);
    const maxKmValue = (document.getElementById('maxKmFilter') || { value: '' }).value;
    const maxKm = maxKmValue ? Number(maxKmValue) : 0;
    const minYear = Number((document.getElementById('minYearFilter') || { value: '' }).value || 0);
    const maxYearValue = (document.getElementById('maxYearFilter') || { value: '' }).value;
    const maxYear = maxYearValue ? Number(maxYearValue) : 0;
    const dateFilter = document.getElementById('dateFilter') ? document.getElementById('dateFilter').value : 'all';
    const fuel = document.getElementById('fuelFilter') ? document.getElementById('fuelFilter').value : 'all';
    const transmission = document.getElementById('transmissionFilter') ? document.getElementById('transmissionFilter').value : 'all';
    const bodyType = document.getElementById('bodyTypeFilter') ? document.getElementById('bodyTypeFilter').value : 'all';
    const traction = document.getElementById('tractionFilter') ? document.getElementById('tractionFilter').value : 'all';
    const color = document.getElementById('colorFilter') ? document.getElementById('colorFilter').value : 'all';
    const condition = document.getElementById('conditionFilter') ? document.getElementById('conditionFilter').value : 'all';
    const sellerType = document.getElementById('sellerTypeFilter') ? document.getElementById('sellerTypeFilter').value : 'all';
    const exchange = document.getElementById('exchangeFilter') ? document.getElementById('exchangeFilter').value : 'all';
    const heavyDamage = document.getElementById('heavyDamageFilter') ? document.getElementById('heavyDamageFilter').value : 'all';
    const estateListingType = document.getElementById('estateListingTypeFilter') ? document.getElementById('estateListingTypeFilter').value : 'all';
    const estateType = document.getElementById('estateTypeFilter') ? document.getElementById('estateTypeFilter').value : 'all';
    const minM2 = Number((document.getElementById('minM2Filter') || { value: '' }).value || 0);
    const maxM2Value = (document.getElementById('maxM2Filter') || { value: '' }).value;
    const maxM2 = maxM2Value ? Number(maxM2Value) : 0;
    const roomCount = document.getElementById('roomCountFilter') ? document.getElementById('roomCountFilter').value : 'all';
    const buildingAgeValue = (document.getElementById('buildingAgeFilter') || { value: '' }).value;
    const buildingAge = buildingAgeValue ? Number(buildingAgeValue) : 0;
    const floor = document.getElementById('estateFloorFilter') ? document.getElementById('estateFloorFilter').value : 'all';
    const heating = document.getElementById('heatingFilter') ? document.getElementById('heatingFilter').value : 'all';
    const furnished = document.getElementById('furnishedFilter') ? document.getElementById('furnishedFilter').value : 'all';
    const balcony = document.getElementById('balconyFilter') ? document.getElementById('balconyFilter').value : 'all';
    const siteInside = document.getElementById('siteInsideFilter') ? document.getElementById('siteInsideFilter').value : 'all';
    const shoppingBrand = document.getElementById('shoppingBrandFilter') ? document.getElementById('shoppingBrandFilter').value : 'all';
    const shoppingModel = document.getElementById('shoppingModelFilter') ? document.getElementById('shoppingModelFilter').value : 'all';
    const shoppingCondition = document.getElementById('shoppingConditionFilter') ? document.getElementById('shoppingConditionFilter').value : 'all';
    const shoppingWarranty = document.getElementById('shoppingWarrantyFilter') ? document.getElementById('shoppingWarrantyFilter').value : 'all';
    const shoppingColor = document.getElementById('shoppingColorFilter') ? document.getElementById('shoppingColorFilter').value : 'all';
    const sortMode = document.getElementById('sortFilter') ? document.getElementById('sortFilter').value : 'recommended';
    const featuredMode = document.body.dataset.featuredMode || 'all';
    const selectedCategoryGroup = JETLE.getCategoryGroupByName(category);
    const hasVehicleSpecificFilter = [brand, series, model, fuel, transmission, bodyType, traction, color, condition, sellerType, exchange, heavyDamage].some(function (value) {
      return value && value !== 'all';
    }) || Boolean(minKm || maxKm || minYear || maxYear);
    const hasEstateSpecificFilter = [estateListingType, estateType, roomCount, district, floor, heating, furnished, balcony, siteInside].some(function (value) {
      return value && value !== 'all';
    }) || Boolean(minM2 || maxM2 || buildingAge);
    const hasShoppingSpecificFilter = [shoppingBrand, shoppingModel, shoppingCondition, shoppingWarranty, shoppingColor].some(function (value) {
      return value && value !== 'all';
    });
    const publishedListings = JETLE.getListings().filter(isListingPublished);
    const listings = sortListings(publishedListings.filter(function (listing) {
      const listingCategory = String(listing.category || '').trim();
      const listingGroup = JETLE.getCategoryGroupByName(listing.categoryGroup || listingCategory || '');
      const vehicleListing = isVehicleListing(listing);
      const estateListing = isEstateListing(listing);
      const shoppingListing = listingGroup === 'Alışveriş';
      const searchableText = [
        String(listing.title || ''),
        String(listing.description || ''),
        String(listing.category || ''),
        String(listing.location || '')
      ].join(' ').toLowerCase();
      const listingBrand = getListingBrand(listing);
      const listingSeries = getListingDetailValue(listing, 'series');
      const listingModel = getListingModel(listing);
      const listingYear = getListingNumericDetail(listing, 'year');
      const listingKm = getListingNumericDetail(listing, 'km');
      const listingM2 = getListingNumericDetail(listing, 'm2');
      const listingBuildingAge = getListingNumericDetail(listing, 'buildingAge');
      const listingRoomCount = getListingDetailValue(listing, 'roomCount');
      const listingEstateListingType = getListingDetailValue(listing, 'listingType');
      const listingEstateType = getListingDetailValue(listing, 'estateType');
      const listingDistrict = getListingDistrict(listing);
      const listingFloor = getListingDetailValue(listing, 'floor');
      const listingHeating = getListingDetailValue(listing, 'heating');
      const listingFurnished = getListingDetailValue(listing, 'furnished');
      const listingBalcony = getListingDetailValue(listing, 'balcony');
      const listingSiteInside = getListingDetailValue(listing, 'siteInside');
      const listingFuel = getListingDetailValue(listing, 'fuel');
      const listingTransmission = getListingDetailValue(listing, 'transmission');
      const listingBodyType = getListingDetailValue(listing, 'bodyType');
      const listingTraction = getListingDetailValue(listing, 'traction');
      const listingColor = getListingDetailValue(listing, 'color');
      const listingCondition = getListingDetailValue(listing, 'condition');
      const listingSellerType = getListingDetailValue(listing, 'sellerType');
      const listingExchange = getListingDetailValue(listing, 'exchange');
      const listingHeavyDamage = getListingDetailValue(listing, 'heavyDamage');
      const listingWarranty = getListingDetailValue(listing, 'warranty');
      const price = Number(listing.price || 0);

      const matchesQuery = !query || searchableText.includes(query);
      const matchesCategory = !hasUrlCategoryFilter
        ? isCategoryMatch(listingCategory, category)
        : listingCategorySlugMatchesUrl(listing, urlCategoryNormalized);
      const matchesSubcategory = subcategory === 'all' || listingCategory === subcategory;
      const matchesCity = listingMatchesSelectedCity(listing, city);
      const matchesDistrict = district === 'all' || listingDistrict === district;
      const matchesBrand = brand === 'all' || listingBrand === brand;
      const matchesSeries = series === 'all' || listingSeries === series;
      const matchesModel = model === 'all' || listingModel === model;
      const matchesMinPrice = !minPrice || price >= minPrice;
      const matchesMaxPrice = !maxPrice || price <= maxPrice;
      const matchesMinKm = !minKm || listingKm >= minKm;
      const matchesMaxKm = !maxKm || listingKm <= maxKm;
      const matchesMinYear = !minYear || listingYear >= minYear;
      const matchesMaxYear = !maxYear || listingYear <= maxYear;
      const matchesDate = isDateMatch(listing, dateFilter);
      const matchesFuel = fuel === 'all' || listingFuel === fuel;
      const matchesTransmission = transmission === 'all' || listingTransmission === transmission;
      const matchesBodyType = bodyType === 'all' || listingBodyType === bodyType;
      const matchesTraction = traction === 'all' || listingTraction === traction;
      const matchesColor = color === 'all' || listingColor === color;
      const matchesCondition = condition === 'all' || listingCondition === condition;
      const matchesSellerType = sellerType === 'all' || listingSellerType === sellerType;
      const matchesExchange = exchange === 'all' || listingExchange === exchange;
      const matchesHeavyDamage = heavyDamage === 'all' || listingHeavyDamage === heavyDamage;
      const matchesEstateListingType = estateListingType === 'all' || listingEstateListingType === estateListingType;
      const matchesEstateType = estateType === 'all' || listingEstateType === estateType;
      const matchesMinM2 = !minM2 || listingM2 >= minM2;
      const matchesMaxM2 = !maxM2 || listingM2 <= maxM2;
      const matchesRoomCount = roomCount === 'all' || listingRoomCount === roomCount;
      const matchesBuildingAge = !buildingAge || (listingBuildingAge > 0 && listingBuildingAge <= buildingAge);
      const matchesFloor = floor === 'all' || listingFloor === floor;
      const matchesHeating = heating === 'all' || listingHeating === heating;
      const matchesFurnished = furnished === 'all' || listingFurnished === furnished;
      const matchesBalcony = balcony === 'all' || listingBalcony === balcony;
      const matchesSiteInside = siteInside === 'all' || listingSiteInside === siteInside;
      const matchesShoppingBrand = shoppingBrand === 'all' || listingBrand === shoppingBrand;
      const matchesShoppingModel = shoppingModel === 'all' || listingModel === shoppingModel;
      const matchesShoppingCondition = shoppingCondition === 'all' || listingCondition === shoppingCondition;
      const matchesShoppingWarranty = shoppingWarranty === 'all' || listingWarranty === shoppingWarranty;
      const matchesShoppingColor = shoppingColor === 'all' || listingColor === shoppingColor;
      const matchesFeatured = isFeaturedMatch(listing, featuredMode);
      const matchesVehicleOnly = !hasVehicleSpecificFilter || vehicleListing;
      const matchesEstateOnly = !hasEstateSpecificFilter || estateListing;
      const matchesShoppingOnly = !hasShoppingSpecificFilter || shoppingListing;
      const matchesGroupVisibility = selectedCategoryGroup === 'Araçlar' ? vehicleListing : (selectedCategoryGroup === 'Gayrimenkul' ? estateListing : (selectedCategoryGroup === 'Alışveriş' ? shoppingListing : true));

      return matchesQuery &&
        matchesCategory &&
        matchesSubcategory &&
        matchesCity &&
        matchesDistrict &&
        matchesBrand &&
        matchesSeries &&
        matchesModel &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinKm &&
        matchesMaxKm &&
        matchesMinYear &&
        matchesMaxYear &&
        matchesDate &&
        matchesFuel &&
        matchesTransmission &&
        matchesBodyType &&
        matchesTraction &&
        matchesColor &&
        matchesCondition &&
        matchesSellerType &&
        matchesExchange &&
        matchesHeavyDamage &&
        matchesEstateListingType &&
        matchesEstateType &&
        matchesMinM2 &&
        matchesMaxM2 &&
        matchesRoomCount &&
        matchesBuildingAge &&
        matchesFloor &&
        matchesHeating &&
        matchesFurnished &&
        matchesBalcony &&
        matchesSiteInside &&
        matchesShoppingBrand &&
        matchesShoppingModel &&
        matchesShoppingCondition &&
        matchesShoppingWarranty &&
        matchesShoppingColor &&
        matchesFeatured &&
        matchesVehicleOnly &&
        matchesEstateOnly &&
        matchesShoppingOnly &&
        matchesGroupVisibility;
    }), sortMode);

    renderListings(listings, category);
    applyHomeListingEmptyAndResults(listings, publishedListings);
  }

  function renderRecentViewedListings() {
    const panel = document.getElementById('recentViewedPanel');
    const grid = document.getElementById('recentViewedGrid');
    if (!panel || !grid || typeof JETLE.getRecentViews !== 'function') return;

    const recentViews = JETLE.getRecentViews();
    const listingsMap = {};
    JETLE.getListings().filter(isListingPublished).forEach(function (listing) {
      listingsMap[listing.id] = listing;
    });

    const recentListings = recentViews.map(function (item) {
      return listingsMap[item.id];
    }).filter(Boolean).slice(0, 4);

    panel.classList.remove('hidden');
    if (recentListings.length) {
      grid.innerHTML = recentListings.map(buildListingCard).join('') + buildShowcasePlaceholderCards(4 - recentListings.length, {
        badge: 'Son Aramaların',
        titlePrefix: 'Geçmiş aramalarına göre öneri',
        description: 'İlgini çekebilecek güncel ilanlar bu alanda görünür.',
        ctaText: 'Yeni İlanları Keşfet',
        meta: 'Kişisel vitrin akışı'
      });
      bindListingActions(grid);
      return;
    }

    grid.innerHTML = buildShowcasePlaceholderCards(4, {
      badge: 'Senin İçin',
      titlePrefix: 'İncelediğin ilanlar burada birikir',
      description: 'Araç, emlak ve alışveriş vitrinlerinde gezdikçe bu bölüm senin için kişiselleşir.',
      ctaText: 'Vitrini İncele',
      meta: 'Canlı öneri alanı'
    });
  }

  function buildShowcasePlaceholderCards(count, config) {
    const safeCount = Math.max(0, Number(count || 0));
    const titlePrefix = (config && config.titlePrefix) || 'Yeni vitrin kartı';
    const description = (config && config.description) || 'Güncel ilanlar geldikçe bu bölüm zenginleşir.';
    const badge = (config && config.badge) || 'Vitrin';
    const ctaText = (config && config.ctaText) || 'İlan Ver';
    const location = (config && config.location) || 'Türkiye Geneli';
    const meta = (config && config.meta) || 'Canlı vitrin akışı';
    const accent = (config && config.accent) || 'JETLE';
    const pendingBadge = (config && config.pendingBadge) || 'Yeni içerik geliyor';
    const priceLine = (config && config.priceLine) || 'Vitrin güncelleniyor';
    const extraClass = (config && config.marketplaceTone) ? ' listing-card-placeholder--marketplace' : '';

    return Array.from({ length: safeCount }).map(function (_, index) {
      return '' +
        '<article class="listing-card listing-card-placeholder' + extraClass + '">' +
          '<div class="listing-card-image listing-card-image-placeholder">' +
            '<div class="listing-card-placeholder-visual">' +
              '<span>' + JETLE.escapeHtml(accent) + '</span>' +
              '<strong>' + JETLE.escapeHtml(String(index + 1).padStart(2, '0')) + '</strong>' +
            '</div>' +
            '<div class="listing-card-image-badges"><span class="badge badge-premium">' + JETLE.escapeHtml(badge) + '</span></div>' +
          '</div>' +
          '<div class="listing-card-body">' +
            '<div class="listing-badges"><span class="badge badge-pending">' + JETLE.escapeHtml(pendingBadge) + '</span></div>' +
            '<div class="listing-card-price">' + JETLE.escapeHtml(priceLine) + '</div>' +
            '<h3 class="listing-card-title">' + JETLE.escapeHtml(titlePrefix) + ' ' + (index + 1) + '</h3>' +
            '<div class="listing-card-meta"><span>' + JETLE.escapeHtml(location) + '</span><span>' + JETLE.escapeHtml(meta) + '</span></div>' +
            '<div class="listing-card-placeholder-copy">' + JETLE.escapeHtml(description) + '</div>' +
            '<div class="listing-card-foot"><a class="btn btn-light" href="ilan-ver.html">' + JETLE.escapeHtml(ctaText) + '</a></div>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function buildStorePlaceholderCards(count) {
    return Array.from({ length: Math.max(0, Number(count || 0)) }).map(function (_, index) {
      return '' +
        '<article class="featured-store-card featured-store-card-placeholder">' +
          '<div class="featured-store-card-link">' +
            '<div class="featured-store-card-head">' +
              '<div class="featured-store-card-logo"><span>' + JETLE.escapeHtml(String.fromCharCode(65 + (index % 26))) + '</span></div>' +
              '<div class="featured-store-card-copy">' +
                '<h3>Vitrin Mağaza ' + (index + 1) + '</h3>' +
                '<div class="featured-store-card-badges"><span class="seller-trust-badge seller-trust-badge-verified featured-store-badge">Doğrulanıyor</span></div>' +
              '</div>' +
            '</div>' +
            '<p class="featured-store-card-description">Kurumsal mağazalar bu bölümde öne çıkar. Logo, açıklama ve ilan sayısı ile güçlü bir vitrin etkisi oluşturur.</p>' +
            '<div class="featured-store-card-meta"><strong>Yakında aktif</strong><span>Mağaza vitrini hazırlanıyor</span></div>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function initSearchSuggestions(inputs) {
    const listings = JETLE.getListings().filter(isListingPublished);

    inputs.filter(Boolean).forEach(function (input) {
      if (!input || input.dataset.suggestReady === 'true') return;
      input.dataset.suggestReady = 'true';

      const wrapper = document.createElement('div');
      wrapper.className = 'search-autocomplete-wrap';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      const dropdown = document.createElement('div');
      dropdown.className = 'search-suggestions';
      wrapper.appendChild(dropdown);

      function closeSuggestions() {
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
      }

      function syncInputs(value) {
        inputs.filter(Boolean).forEach(function (item) {
          item.value = value;
        });
      }

      input.addEventListener('input', function () {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
          closeSuggestions();
          return;
        }

        const matches = listings.filter(function (listing) {
          return String(listing.title || '').toLowerCase().includes(query);
        }).slice(0, 6);

        if (!matches.length) {
          closeSuggestions();
          return;
        }

        dropdown.innerHTML = matches.map(function (listing) {
          return '<button type="button" class="search-suggestion-item" data-listing-slug="' + JETLE.escapeHtml(getListingSlug(listing)) + '" data-title="' + JETLE.escapeHtml(listing.title) + '">' +
            '<strong>' + JETLE.escapeHtml(listing.title) + '</strong>' +
            '<span>' + JETLE.escapeHtml(listing.category) + ' · ' + JETLE.escapeHtml(listing.location) + '</span>' +
          '</button>';
        }).join('');
        dropdown.classList.add('open');
      });

      dropdown.addEventListener('click', function (event) {
        const item = event.target.closest('[data-listing-slug]');
        if (!item) return;
        const title = item.getAttribute('data-title') || '';
        const slug = item.getAttribute('data-listing-slug') || '';
        syncInputs(title);
        closeSuggestions();
        window.location.href = 'ilan-detay.html?slug=' + encodeURIComponent(slug);
      });

      input.addEventListener('blur', function () {
        setTimeout(closeSuggestions, 150);
      });

      input.addEventListener('focus', function () {
        if (dropdown.innerHTML.trim()) {
          dropdown.classList.add('open');
        }
      });
    });
  }

  function renderHomeShowcases() {
    injectHomePageDemoListingsIfEmpty();
    const allListings = JETLE.getListings().filter(isListingPublished);
    const featuredGrid = document.getElementById('featuredListingsGrid');
    const featuredStoresGrid = document.getElementById('featuredStoresGrid');
    const featuredStoresPanel = document.getElementById('featuredStoresPanel');
    const newGrid = document.getElementById('newListingsGrid');
    const popularGrid = document.getElementById('popularListingsGrid');
    const vehicleShowcasePanel = document.getElementById('vehicleShowcasePanel');
    const vehicleShowcaseGrid = document.getElementById('vehicleShowcaseGrid');
    const estateShowcasePanel = document.getElementById('estateShowcasePanel');
    const estateShowcaseGrid = document.getElementById('estateShowcaseGrid');
    const shoppingShowcasePanel = document.getElementById('shoppingShowcasePanel');
    const shoppingShowcaseGrid = document.getElementById('shoppingShowcaseGrid');
    const personalizedPanel = document.getElementById('personalizedListingsPanel');
    const personalizedGrid = document.getElementById('personalizedListingsGrid');
    const homeTopBanner = document.getElementById('homeTopBanner');
    const homeInlineBanner = document.getElementById('homeInlineBanner');

    function renderGrid(grid, items, fallbackConfig) {
      if (!grid) return;
      const desiredCount = (fallbackConfig && fallbackConfig.count) || 4;
      const safeItems = Array.isArray(items) ? items.slice(0, desiredCount) : [];
      grid.innerHTML = safeItems.map(buildListingCard).join('') + buildShowcasePlaceholderCards(desiredCount - safeItems.length, fallbackConfig);
      if (safeItems.length) bindListingActions(grid);
    }

    function renderHomeVitrinRowGrid(grid, items, emptyCopy) {
      if (!grid) return;
      var rows = Array.isArray(items) ? items.slice(0, 4) : [];
      if (!rows.length) {
        grid.innerHTML = '<div class="home-showcase-empty" role="status">' + JETLE.escapeHtml(emptyCopy || 'Henüz yayında ilan bulunmuyor') + '</div>';
        return;
      }
      grid.innerHTML = rows.map(buildHomeShowcaseListingCard).join('');
    }

    function renderShowcase(panel, grid, items) {
      if (!panel || !grid) return;
      panel.classList.remove('hidden');
      renderGrid(grid, items, {
        count: 4,
        badge: panel.querySelector('h2') ? panel.querySelector('h2').textContent : 'Vitrin',
        titlePrefix: panel.querySelector('h2') ? panel.querySelector('h2').textContent + ' seçkisi' : 'Vitrin seçkisi',
        description: 'Bu bölüm, yeni ilanlar geldikçe sürekli güncel ve dolu görünür.',
        ctaText: 'Tüm İlanları Gör',
        meta: 'Aktif vitrin alanı'
      });
    }

    function getGroupListings(groupName) {
      return allListings.filter(function (listing) {
        return JETLE.getCategoryGroupByName(listing.categoryGroup || listing.category || '') === groupName;
      });
    }

    function buildHomeBannerMarkup(ad, fallback) {
      const item = ad || fallback;
      if (!item) return '';
      if (ad && ad.id && typeof JETLE.trackAdImpression === 'function') {
        JETLE.trackAdImpression(ad.id);
      }

      return '' +
        '<span class="sponsored-tag">Sponsorlu</span>' +
        '<div class="sponsored-banner-copy">' +
          '<strong>' + JETLE.escapeHtml(item.title || 'Sponsorlu Alan') + '</strong>' +
          '<span>' + JETLE.escapeHtml(item.description || 'Markanızı JETLE vitrinde öne çıkarın.') + '</span>' +
        '</div>' +
        '<a href="' + JETLE.escapeHtml(item.ctaUrl || 'reklam-ver.html') + '" class="sponsored-banner-cta"' + (ad && ad.id ? ' data-home-ad-id="' + JETLE.escapeHtml(ad.id) + '"' : '') + '>' + JETLE.escapeHtml(item.ctaText || 'İncele') + '</a>';
    }

    const featuredListings = allListings.filter(function (item) {
      return item.premium || item.featured;
    }).slice(0, 4);

    const newListings = allListings.slice().sort(function (a, b) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, 4);

    const popularListings = allListings.slice().sort(function (a, b) {
      return getListingSocialProof(b).views - getListingSocialProof(a).views;
    }).slice(0, 4);
    const vehicleListings = getGroupListings('Araçlar').slice(0, 4);
    const estateListings = getGroupListings('Gayrimenkul').slice(0, 4);
    const shoppingListings = getGroupListings('Alışveriş').slice(0, 4);

    const featuredStores = JETLE.getUsers().filter(function (user) {
      return Boolean(user && user.store && user.store.active && user.store.name);
    }).map(function (user) {
      const storeListings = allListings.filter(function (item) {
        return item.ownerId === user.id;
      });
      return {
        owner: user,
        listingCount: storeListings.length,
        premiumScore: user.store && user.store.premium ? 1 : 0,
        verifiedScore: user.store && user.store.verified ? 1 : 0,
        freshness: new Date((user.store && user.store.purchasedAt) || user.createdAt || 0).getTime()
      };
    }).sort(function (a, b) {
      if (b.premiumScore !== a.premiumScore) return b.premiumScore - a.premiumScore;
      if (b.verifiedScore !== a.verifiedScore) return b.verifiedScore - a.verifiedScore;
      if (b.listingCount !== a.listingCount) return b.listingCount - a.listingCount;
      return b.freshness - a.freshness;
    }).slice(0, 4);

    const recentViews = typeof JETLE.getRecentViews === 'function' ? JETLE.getRecentViews() : [];
    const preferredGroups = recentViews.map(function (item) {
      return JETLE.getCategoryGroupByName(item.categoryGroup || item.category || '');
    }).filter(Boolean);
    const personalizedListings = allListings.filter(function (listing) {
      const listingGroup = JETLE.getCategoryGroupByName(listing.categoryGroup || listing.category || '');
      return preferredGroups.includes(listingGroup) || preferredGroups.includes(listing.category);
    }).filter(function (listing, index, array) {
      return array.findIndex(function (item) { return item.id === listing.id; }) === index;
    }).slice(0, 4);

    renderHomeVitrinRowGrid(featuredGrid, featuredListings, 'Henüz yayında ilan bulunmuyor');
    renderHomeVitrinRowGrid(newGrid, newListings, 'Henüz yayında ilan bulunmuyor');
    renderGrid(popularGrid, popularListings, {
      count: 4,
      badge: 'Popüler',
      titlePrefix: 'Yüksek ilgi gören ilan',
      description: 'Görüntülenme ve favori verilerine göre öne çıkan ilanlar burada görünür.',
      ctaText: 'Trend İlanları Aç',
      meta: 'Yüksek etkileşim'
    });
    renderShowcase(vehicleShowcasePanel, vehicleShowcaseGrid, vehicleListings);
    renderShowcase(estateShowcasePanel, estateShowcaseGrid, estateListings);
    renderShowcase(shoppingShowcasePanel, shoppingShowcaseGrid, shoppingListings);

    if (featuredStoresPanel && featuredStoresGrid) {
      featuredStoresPanel.classList.remove('hidden');
      featuredStoresGrid.innerHTML = featuredStores.map(function (item) {
        return buildFeaturedStoreCard(item.owner);
      }).join('') + buildStorePlaceholderCards(4 - featuredStores.length);
    }

    if (personalizedPanel && personalizedGrid) {
      personalizedPanel.classList.remove('hidden');
      renderGrid(personalizedGrid, personalizedListings, {
        count: 4,
        badge: 'Sana Özel',
        titlePrefix: 'İlgi alanına uygun seçki',
        description: 'Favorilerin ve gezdiğin vitrinlere göre bu alan otomatik olarak zenginleşir.',
        ctaText: 'Önerileri Keşfet',
        meta: 'Kişiselleştirilmiş akış'
      });
    }

    if (homeTopBanner) {
      const topBannerAd = typeof JETLE.getSmartAd === 'function' ? JETLE.getSmartAd('header', { category: 'all' }) : null;
      homeTopBanner.innerHTML = buildHomeBannerMarkup(topBannerAd, {
        title: 'Ana sayfa üst banner alanı',
        description: 'Kurumsal kampanyanızı JETLE vitrinin en görünür bölümünde tanıtın.',
        ctaText: 'Reklam ver',
        ctaUrl: 'reklam-ver.html'
      });
    }

    if (homeInlineBanner) {
      const inlineBannerAd = typeof JETLE.getSmartAd === 'function' ? JETLE.getSmartAd('inline', { category: 'all' }) : null;
      homeInlineBanner.innerHTML = buildHomeBannerMarkup(inlineBannerAd, {
        title: 'Sponsorlu vitrin alanı',
        description: 'Vitrin blokları arasında premium görünürlük ile daha fazla talep toplayın.',
        ctaText: 'Teklif Al',
        ctaUrl: 'reklam-ver.html'
      });
    }
  }

  async function initHomePage() {
    ensureHomeCategoryGuideDom();
    if (window.JETLE_API && typeof window.JETLE_API.refreshCollection === 'function') {
      try {
        await window.JETLE_API.refreshCollection('listings');
      } catch (error) {
        console.warn('İlan verileri yenilenemedi, mevcut veri ile devam ediliyor.', error);
      }
    }

    const searchInput = document.getElementById('searchInput');
    const heroSearchInput = document.getElementById('heroSearchInput');
    const headerSearchInput = document.getElementById('headerSearchInput');
    const sidebarKeywordFilter = document.getElementById('sidebarKeywordFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const heroCategoryFilter = document.getElementById('heroCategoryFilter');
    const sidebarCategoryFilter = document.getElementById('sidebarCategoryFilter');
    const sidebarSubcategoryFilter = document.getElementById('sidebarSubcategoryFilter');
    const cityFilter = document.getElementById('cityFilter');
    const heroCityFilter = document.getElementById('heroCityFilter');
    const citySelect = document.getElementById('citySelect');
    const sidebarDistrictFilter = document.getElementById('sidebarDistrictFilter');
    const brandFilter = document.getElementById('brandFilter');
    const sidebarBrandFilter = document.getElementById('sidebarBrandFilter');
    const vehicleSeriesFilter = document.getElementById('vehicleSeriesFilter');
    const modelFilter = document.getElementById('modelFilter');
    const sidebarModelFilter = document.getElementById('sidebarModelFilter');
    const sortFilter = document.getElementById('sortFilter');
    const minPriceFilter = document.getElementById('minPriceFilter');
    const maxPriceFilter = document.getElementById('maxPriceFilter');
    const minKmFilter = document.getElementById('minKmFilter');
    const maxKmFilter = document.getElementById('maxKmFilter');
    const minYearFilter = document.getElementById('minYearFilter');
    const maxYearFilter = document.getElementById('maxYearFilter');
    const dateFilter = document.getElementById('dateFilter');
    const estateListingTypeFilter = document.getElementById('estateListingTypeFilter');
    const estateTypeFilter = document.getElementById('estateTypeFilter');
    const minM2Filter = document.getElementById('minM2Filter');
    const maxM2Filter = document.getElementById('maxM2Filter');
    const roomCountFilter = document.getElementById('roomCountFilter');
    const buildingAgeFilter = document.getElementById('buildingAgeFilter');
    const estateDistrictFilter = document.getElementById('estateDistrictFilter');
    const estateFloorFilter = document.getElementById('estateFloorFilter');
    const heatingFilter = document.getElementById('heatingFilter');
    const furnishedFilter = document.getElementById('furnishedFilter');
    const balconyFilter = document.getElementById('balconyFilter');
    const siteInsideFilter = document.getElementById('siteInsideFilter');
    const fuelFilter = document.getElementById('fuelFilter');
    const transmissionFilter = document.getElementById('transmissionFilter');
    const bodyTypeFilter = document.getElementById('bodyTypeFilter');
    const tractionFilter = document.getElementById('tractionFilter');
    const colorFilter = document.getElementById('colorFilter');
    const conditionFilter = document.getElementById('conditionFilter');
    const sellerTypeFilter = document.getElementById('sellerTypeFilter');
    const exchangeFilter = document.getElementById('exchangeFilter');
    const heavyDamageFilter = document.getElementById('heavyDamageFilter');
    const shoppingBrandFilter = document.getElementById('shoppingBrandFilter');
    const shoppingModelFilter = document.getElementById('shoppingModelFilter');
    const shoppingConditionFilter = document.getElementById('shoppingConditionFilter');
    const shoppingWarrantyFilter = document.getElementById('shoppingWarrantyFilter');
    const shoppingColorFilter = document.getElementById('shoppingColorFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const heroSearchButton = document.getElementById('heroSearchButton');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const mobileSidebarClose = document.getElementById('mobileSidebarClose');
    const sidebarColumn = document.getElementById('sidebarColumn');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const categoryExpandToggle = document.getElementById('categoryExpandToggle');
    const filterCategoryGuide = document.getElementById('filterCategoryGuide');
    const heroQuickFilters = Array.prototype.slice.call(document.querySelectorAll('[data-hero-filter]'));
    const heroShortcutCards = Array.prototype.slice.call(document.querySelectorAll('[data-hero-category]'));
    const showcaseLinks = Array.prototype.slice.call(document.querySelectorAll('[data-showcase-target]'));
    const dynamicFilterSections = Array.prototype.slice.call(document.querySelectorAll('[data-filter-group]'));
    const homeListings = JETLE.getListings().filter(isListingPublished);
    const allSubcategories = homeListings.map(function (listing) {
      return String(listing.category || '').trim();
    }).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const vehicleListings = homeListings.filter(function (listing) {
      return isVehicleListing(listing);
    });
    const estateListings = homeListings.filter(function (listing) {
      return isEstateListing(listing);
    });
    const shoppingListings = homeListings.filter(function (listing) {
      return JETLE.getCategoryGroupByName(listing.categoryGroup || listing.category || '') === 'Alışveriş';
    });
    const brands = getVehicleBrands().concat(vehicleListings.map(getListingBrand).filter(Boolean)).filter(function (brand, index, items) {
      return items.indexOf(brand) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const estateDistricts = estateListings.map(getListingDistrict).filter(Boolean).filter(function (district, index, items) {
      return items.indexOf(district) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const estateTypes = estateListings.map(function (listing) {
      return getListingDetailValue(listing, 'estateType');
    }).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const estateFloors = estateListings.map(function (listing) {
      return getListingDetailValue(listing, 'floor');
    }).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const estateHeatings = estateListings.map(function (listing) {
      return getListingDetailValue(listing, 'heating');
    }).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const shoppingBrands = shoppingListings.map(getListingBrand).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const shoppingModels = shoppingListings.map(getListingModel).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const shoppingConditions = shoppingListings.map(function (listing) {
      return getListingDetailValue(listing, 'condition');
    }).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const shoppingWarranties = shoppingListings.map(function (listing) {
      return getListingDetailValue(listing, 'warranty');
    }).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });
    const shoppingColors = shoppingListings.map(function (listing) {
      return getListingDetailValue(listing, 'color');
    }).filter(Boolean).filter(function (item, index, items) {
      return items.indexOf(item) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, 'tr');
    });

    function syncCityOptions() {
      var preserve =
        (citySelect && citySelect.value) ||
        (cityFilter && cityFilter.value) ||
        (heroCityFilter && heroCityFilter.value) ||
        'all';
      var cityOptions = '<option value="all">Tüm şehirler</option>' + cities.map(function (city) {
        var e = JETLE.escapeHtml(city);
        return '<option value="' + e + '">' + e + '</option>';
      }).join('');
      function applyOptions(el) {
        if (!el) return;
        el.innerHTML = cityOptions;
        if (preserve === 'all' || cities.indexOf(preserve) !== -1) {
          el.value = preserve;
        } else {
          el.value = 'all';
        }
      }
      applyOptions(cityFilter);
      applyOptions(heroCityFilter);
      applyOptions(citySelect);
    }

    function syncCategoryValue(value) {
      if (categoryFilter) categoryFilter.value = value;
      if (heroCategoryFilter) heroCategoryFilter.value = value;
      if (sidebarCategoryFilter) sidebarCategoryFilter.value = value;
    }

    function syncCityValue(value) {
      if (cityFilter) cityFilter.value = value;
      if (heroCityFilter) heroCityFilter.value = value;
      if (citySelect) citySelect.value = value;
    }

    function syncDistrictValue(value) {
      if (sidebarDistrictFilter) sidebarDistrictFilter.value = value;
      if (estateDistrictFilter) estateDistrictFilter.value = value;
    }

    function buildSelectOptions(items, defaultLabel) {
      return '<option value="all">' + defaultLabel + '</option>' + items.map(function (item) {
        return '<option value="' + item + '">' + item + '</option>';
      }).join('');
    }

    function syncStaticVehicleOptions() {
      if (fuelFilter) fuelFilter.innerHTML = buildSelectOptions(vehicleMeta.fuels, 'Tüm yakıt tipleri');
      if (transmissionFilter) transmissionFilter.innerHTML = buildSelectOptions(vehicleMeta.transmissions, 'Tüm vitesler');
      if (bodyTypeFilter) bodyTypeFilter.innerHTML = buildSelectOptions(vehicleMeta.bodyTypes, 'Tüm kasa tipleri');
      if (tractionFilter) tractionFilter.innerHTML = buildSelectOptions(vehicleMeta.drivetrains, 'Tüm çekiş türleri');
      if (colorFilter) colorFilter.innerHTML = buildSelectOptions(vehicleMeta.colors, 'Tüm renkler');
      if (conditionFilter) conditionFilter.innerHTML = buildSelectOptions(vehicleMeta.conditions, 'Tüm durumlar');
      if (sellerTypeFilter) sellerTypeFilter.innerHTML = buildSelectOptions(vehicleMeta.sellerTypes, 'Tümü');
    }

    function syncStaticEstateOptions() {
      if (estateListingTypeFilter) estateListingTypeFilter.innerHTML = buildSelectOptions(estateMeta.listingTypes, 'Satılık / Kiralık');
      if (roomCountFilter) roomCountFilter.innerHTML = buildSelectOptions(estateMeta.roomCounts, 'Tüm oda tipleri');
      if (estateTypeFilter) estateTypeFilter.innerHTML = buildSelectOptions(estateTypes, 'Tüm emlak tipleri');
      if (estateFloorFilter) estateFloorFilter.innerHTML = buildSelectOptions(estateFloors, 'Tüm katlar');
      if (heatingFilter) heatingFilter.innerHTML = buildSelectOptions(estateHeatings, 'Tüm ısıtma tipleri');
    }

    function syncStaticShoppingOptions() {
      if (shoppingBrandFilter) shoppingBrandFilter.innerHTML = buildSelectOptions(shoppingBrands, 'Tüm markalar');
      if (shoppingModelFilter) shoppingModelFilter.innerHTML = buildSelectOptions(shoppingModels, 'Tüm modeller');
      if (shoppingConditionFilter) shoppingConditionFilter.innerHTML = buildSelectOptions(shoppingConditions, 'Tüm durumlar');
      if (shoppingWarrantyFilter) shoppingWarrantyFilter.innerHTML = buildSelectOptions(shoppingWarranties, 'Tüm garanti durumları');
      if (shoppingColorFilter) shoppingColorFilter.innerHTML = buildSelectOptions(shoppingColors, 'Tüm renkler');
    }

    function syncEstateDistrictOptions(selectedCity) {
      const districts = estateListings.filter(function (listing) {
        return !selectedCity || selectedCity === 'all' || getListingCity(listing) === selectedCity;
      }).map(getListingDistrict).filter(Boolean).filter(function (district, index, items) {
        return items.indexOf(district) === index;
      }).sort(function (a, b) {
        return a.localeCompare(b, 'tr');
      });
      const currentDistrictValue = sidebarDistrictFilter ? sidebarDistrictFilter.value : (estateDistrictFilter ? estateDistrictFilter.value : 'all');
      if (sidebarDistrictFilter) {
        sidebarDistrictFilter.innerHTML = buildSelectOptions(districts, 'Tüm ilçeler');
      }
      if (estateDistrictFilter) {
        estateDistrictFilter.innerHTML = buildSelectOptions(districts, 'Tüm ilçeler');
      }
      syncDistrictValue(districts.includes(currentDistrictValue) ? currentDistrictValue : 'all');
    }

    function syncBrandValue(value) {
      if (brandFilter) brandFilter.value = value;
      if (sidebarBrandFilter) sidebarBrandFilter.value = value;
    }

    function syncModelValue(value) {
      if (modelFilter) modelFilter.value = value;
      if (sidebarModelFilter) sidebarModelFilter.value = value;
    }

    function syncBrandOptions() {
      const brandOptions = buildSelectOptions(brands, 'Tüm markalar');
      if (brandFilter) {
        brandFilter.innerHTML = brandOptions;
        brandFilter.disabled = !brands.length;
      }
      if (sidebarBrandFilter) {
        sidebarBrandFilter.innerHTML = brandOptions;
        sidebarBrandFilter.disabled = !brands.length;
      }
    }

    function syncSeriesOptions(selectedBrand) {
      if (vehicleSeriesFilter) {
        const seriesOptions = getVehicleSeriesForBrand(selectedBrand);
        const currentSeriesValue = vehicleSeriesFilter.value;
        vehicleSeriesFilter.innerHTML = buildSelectOptions(seriesOptions, seriesOptions.length ? 'Tüm seriler' : 'Önce marka seçin');
        vehicleSeriesFilter.disabled = !seriesOptions.length;
        vehicleSeriesFilter.value = seriesOptions.includes(currentSeriesValue) ? currentSeriesValue : 'all';
      }
    }

    function syncSubcategoryOptions(selectedCategory) {
      if (!sidebarSubcategoryFilter) return;
      let items = allSubcategories.slice();
      const selectedGroup = JETLE.getCategoryGroupByName(selectedCategory || '');
      if (selectedCategory && selectedCategory !== 'all' && selectedGroup) {
        items = allSubcategories.filter(function (item) {
          return JETLE.getCategoryGroupByName(item) === selectedGroup;
        });
      }
      const currentValue = sidebarSubcategoryFilter.value;
      sidebarSubcategoryFilter.innerHTML = buildSelectOptions(items, 'Tüm alt kategoriler');
      sidebarSubcategoryFilter.value = items.includes(currentValue) ? currentValue : 'all';
    }

    function updateDynamicFilterSections(selectedCategory) {
      const selectedGroup = JETLE.getCategoryGroupByName(selectedCategory || '');
      if (filterCategoryGuide) {
        filterCategoryGuide.classList.toggle('hidden', Boolean(selectedGroup && selectedCategory !== 'all'));
      }
      dynamicFilterSections.forEach(function (section) {
        const sectionGroup = section.dataset.filterGroup || '';
        if (!sectionGroup) return;
        const hasConcreteCategory = Boolean(selectedGroup && selectedCategory !== 'all');
        const shouldShow = hasConcreteCategory && (
          (sectionGroup === 'vehicle' && selectedGroup === 'Araçlar') ||
          (sectionGroup === 'estate' && selectedGroup === 'Gayrimenkul') ||
          (sectionGroup === 'shopping' && selectedGroup === 'Alışveriş')
        );
        section.classList.toggle('hidden', !shouldShow);
      });
    }

    function syncModelOptions(selectedBrand, selectedSeries) {
      const seriesOptions = getVehicleSeriesForBrand(selectedBrand);
      const hasBrand = Boolean(selectedBrand && selectedBrand !== 'all');
      const hasSeries = Boolean(selectedSeries && selectedSeries !== 'all');
      const models = hasSeries ? getVehicleModelsForSeries(selectedBrand, selectedSeries) : getVehicleModelsForBrand(selectedBrand);
      const modelOptions = buildSelectOptions(models, hasBrand ? (hasSeries ? 'Tüm modeller' : 'Önce seri seçin') : 'Önce marka seçin');
      const currentModelValue = modelFilter ? modelFilter.value : 'all';

      if (modelFilter) {
        modelFilter.innerHTML = modelOptions;
        modelFilter.disabled = !hasBrand || !seriesOptions.length || !hasSeries;
      }
      if (sidebarModelFilter) {
        sidebarModelFilter.innerHTML = modelOptions;
        sidebarModelFilter.disabled = !hasBrand || !seriesOptions.length || !hasSeries;
      }

      if (hasBrand && hasSeries && models.includes(currentModelValue)) {
        syncModelValue(currentModelValue);
      } else {
        syncModelValue('all');
      }
    }

    syncCityOptions();
    syncBrandOptions();
    syncSeriesOptions('all');
    syncModelOptions('all', 'all');
    syncStaticVehicleOptions();
    syncStaticEstateOptions();
    syncStaticShoppingOptions();
    syncEstateDistrictOptions('all');
    syncSubcategoryOptions('all');
    updateDynamicFilterSections('all');
    initSearchSuggestions([searchInput, heroSearchInput, headerSearchInput]);

    function syncSearchValue(value) {
      if (searchInput) searchInput.value = value;
      if (heroSearchInput) heroSearchInput.value = value;
      if (headerSearchInput) headerSearchInput.value = value;
      if (sidebarKeywordFilter) sidebarKeywordFilter.value = value;
    }

    function closeMobileSidebar() {
      if (!sidebarColumn || !sidebarBackdrop) return;
      sidebarColumn.classList.remove('open');
      sidebarBackdrop.classList.remove('show');
      document.body.classList.remove('sidebar-open');
    }

    function syncUrlWithHomeFilters() {
      var u = new URL(window.location.href);
      var fv = (sidebarCategoryFilter && sidebarCategoryFilter.value) || 'all';
      var s = homeCategoryFilterToSlug(fv);
      if (!s) u.searchParams.delete('category');
      else u.searchParams.set('category', s);
      var q = searchInput ? String(searchInput.value || '').trim() : '';
      if (q) u.searchParams.set('q', q);
      else u.searchParams.delete('q');
      var cityFv = getActiveHomeCityFilterValue();
      if (!cityFv || cityFv === 'all') u.searchParams.delete('city');
      else u.searchParams.set('city', cityFv);
      history.replaceState({}, '', u.pathname + u.search);
    }

    function applyHomeStateFromUrlWithoutPush() {
      var u = new URL(window.location.href);
      var fv = homeSlugToCategoryFilter(u.searchParams.get('category'));
      syncCategoryValue(fv);
      syncSubcategoryOptions(fv);
      updateDynamicFilterSections(fv);
      renderCategories(fv, document.body.dataset.featuredMode || 'all');
      syncSearchValue(u.searchParams.get('q') || '');
      var cityFromUrl = resolveCityFilterValueFromQuery(u.searchParams.get('city'));
      syncCityValue(cityFromUrl);
      syncEstateDistrictOptions(cityFromUrl);
      renderHomeListings();
    }

    function navigateHomeBySlug(slug, q) {
      var u = new URL(window.location.href);
      if (slug !== undefined && slug !== null) {
        if (!slug || slug === 'all') u.searchParams.delete('category');
        else u.searchParams.set('category', slug);
      }
      if (q !== undefined) {
        if (q) u.searchParams.set('q', q);
        else u.searchParams.delete('q');
      }
      history.pushState({}, '', u.pathname + u.search);
      var curSlug = u.searchParams.get('category') || '';
      var fv = homeSlugToCategoryFilter(curSlug);
      syncCategoryValue(fv);
      syncSubcategoryOptions(fv);
      updateDynamicFilterSections(fv);
      renderCategories(fv, document.body.dataset.featuredMode || 'all');
      syncSearchValue(u.searchParams.get('q') || '');
      renderHomeListings();
      syncUrlWithHomeFilters();
      closeMobileSidebar();
      var gridEl = document.getElementById('listingGrid');
      if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.addEventListener('popstate', function () {
      if (document.body.dataset.page !== 'home') return;
      applyHomeStateFromUrlWithoutPush();
    });

    document.body.dataset.featuredMode = 'all';
    document.body.dataset.categoryExpandedAll = 'false';
    var urlSlugInit = JETLE.getQueryParam('category');
    var activeCategoryFromUrl = homeSlugToCategoryFilter(urlSlugInit);
    var urlQueryInit = JETLE.getQueryParam('q') || '';
    var urlCityInit = resolveCityFilterValueFromQuery(JETLE.getQueryParam('city'));
    syncCategoryValue(activeCategoryFromUrl);
    syncSubcategoryOptions(activeCategoryFromUrl);
    updateDynamicFilterSections(activeCategoryFromUrl);
    renderCategories(activeCategoryFromUrl, 'all');
    syncSearchValue(urlQueryInit);
    syncCityValue(urlCityInit);
    syncEstateDistrictOptions(urlCityInit);
    if (heroCategoryFilter && categoryFilter) heroCategoryFilter.innerHTML = categoryFilter.innerHTML;

    var homeSearchUrlTimer;
    if (searchInput) {
      searchInput.value = urlQueryInit;
      searchInput.addEventListener('input', function () {
        syncSearchValue(searchInput.value);
        renderHomeListings();
        clearTimeout(homeSearchUrlTimer);
        homeSearchUrlTimer = setTimeout(function () {
          syncUrlWithHomeFilters();
        }, 450);
      });
    }

    if (heroSearchInput) {
      heroSearchInput.value = urlQueryInit;
      heroSearchInput.addEventListener('input', function () {
        syncSearchValue(heroSearchInput.value);
        renderHomeListings();
      });
    }

    if (headerSearchInput && searchInput) {
      headerSearchInput.addEventListener('input', function () {
        syncSearchValue(headerSearchInput.value);
        renderHomeListings();
      });
    }

    if (sidebarKeywordFilter) {
      sidebarKeywordFilter.value = urlQueryInit;
      sidebarKeywordFilter.addEventListener('input', function () {
        syncSearchValue(sidebarKeywordFilter.value);
        renderHomeListings();
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', function () {
        syncCategoryValue(categoryFilter.value);
        syncSubcategoryOptions(categoryFilter.value);
        updateDynamicFilterSections(categoryFilter.value);
        renderCategories(categoryFilter.value, document.body.dataset.featuredMode || 'all');
        renderHomeListings();
        syncUrlWithHomeFilters();
      });
    }

    if (sidebarCategoryFilter) {
      sidebarCategoryFilter.addEventListener('change', function () {
        syncCategoryValue(sidebarCategoryFilter.value);
        syncSubcategoryOptions(sidebarCategoryFilter.value);
        updateDynamicFilterSections(sidebarCategoryFilter.value);
        renderCategories(sidebarCategoryFilter.value, document.body.dataset.featuredMode || 'all');
        renderHomeListings();
        syncUrlWithHomeFilters();
      });
    }

    if (heroCategoryFilter) {
      heroCategoryFilter.addEventListener('change', function () {
        syncCategoryValue(heroCategoryFilter.value);
        syncSubcategoryOptions(heroCategoryFilter.value);
        updateDynamicFilterSections(heroCategoryFilter.value);
        renderCategories(heroCategoryFilter.value, document.body.dataset.featuredMode || 'all');
        renderHomeListings();
        syncUrlWithHomeFilters();
      });
    }

    if (sidebarSubcategoryFilter) {
      sidebarSubcategoryFilter.addEventListener('change', renderHomeListings);
    }

    function onHomeCityFilterChange(event) {
      var selectedCity = event && event.target && event.target.value != null ? event.target.value : getActiveHomeCityFilterValue();
      syncCityValue(selectedCity);
      syncEstateDistrictOptions(selectedCity);
      syncUrlWithHomeFilters();
      renderHomeListings();
    }

    if (cityFilter) cityFilter.addEventListener('change', onHomeCityFilterChange);
    if (citySelect) citySelect.addEventListener('change', onHomeCityFilterChange);
    if (heroCityFilter) heroCityFilter.addEventListener('change', onHomeCityFilterChange);

    if (sidebarDistrictFilter) {
      sidebarDistrictFilter.addEventListener('change', function () {
        syncDistrictValue(sidebarDistrictFilter.value);
        renderHomeListings();
      });
    }

    if (estateDistrictFilter) {
      estateDistrictFilter.addEventListener('change', function () {
        syncDistrictValue(estateDistrictFilter.value);
        renderHomeListings();
      });
    }

    if (brandFilter) {
      brandFilter.addEventListener('change', function () {
        syncBrandValue(brandFilter.value);
        syncSeriesOptions(brandFilter.value);
        if (vehicleSeriesFilter) vehicleSeriesFilter.value = 'all';
        syncModelOptions(brandFilter.value, 'all');
        renderHomeListings();
      });
    }

    if (sidebarBrandFilter) {
      sidebarBrandFilter.addEventListener('change', function () {
        syncBrandValue(sidebarBrandFilter.value);
        syncSeriesOptions(sidebarBrandFilter.value);
        if (vehicleSeriesFilter) vehicleSeriesFilter.value = 'all';
        syncModelOptions(sidebarBrandFilter.value, 'all');
        renderHomeListings();
      });
    }

    if (vehicleSeriesFilter) {
      vehicleSeriesFilter.addEventListener('change', function () {
        syncModelOptions(sidebarBrandFilter ? sidebarBrandFilter.value : (brandFilter ? brandFilter.value : 'all'), vehicleSeriesFilter.value);
        renderHomeListings();
      });
    }

    if (modelFilter) {
      modelFilter.addEventListener('change', function () {
        syncModelValue(modelFilter.value);
        renderHomeListings();
      });
    }

    if (sidebarModelFilter) {
      sidebarModelFilter.addEventListener('change', function () {
        syncModelValue(sidebarModelFilter.value);
        renderHomeListings();
      });
    }

    [sortFilter, minPriceFilter, maxPriceFilter, vehicleSeriesFilter, minKmFilter, maxKmFilter, minYearFilter, maxYearFilter, dateFilter, estateListingTypeFilter, estateTypeFilter, minM2Filter, maxM2Filter, roomCountFilter, buildingAgeFilter, estateFloorFilter, heatingFilter, furnishedFilter, balconyFilter, siteInsideFilter, fuelFilter, transmissionFilter, bodyTypeFilter, tractionFilter, colorFilter, conditionFilter, sellerTypeFilter, exchangeFilter, heavyDamageFilter, shoppingBrandFilter, shoppingModelFilter, shoppingConditionFilter, shoppingWarrantyFilter, shoppingColorFilter].forEach(function (element) {
      if (!element) return;
      element.addEventListener('input', renderHomeListings);
      element.addEventListener('change', renderHomeListings);
    });

    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', renderHomeListings);
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function () {
        syncCategoryValue('all');
        syncCityValue('all');
        syncBrandValue('all');
        syncSeriesOptions('all');
        syncModelOptions('all', 'all');
        syncSearchValue('');
        syncDistrictValue('all');
        [minPriceFilter, maxPriceFilter, minKmFilter, maxKmFilter, minYearFilter, maxYearFilter, minM2Filter, maxM2Filter, buildingAgeFilter].forEach(function (element) {
          if (element) element.value = '';
        });
        [sidebarSubcategoryFilter, vehicleSeriesFilter, dateFilter, estateListingTypeFilter, estateTypeFilter, roomCountFilter, estateDistrictFilter, estateFloorFilter, heatingFilter, furnishedFilter, balconyFilter, siteInsideFilter, fuelFilter, transmissionFilter, bodyTypeFilter, tractionFilter, colorFilter, conditionFilter, sellerTypeFilter, exchangeFilter, heavyDamageFilter, shoppingBrandFilter, shoppingModelFilter, shoppingConditionFilter, shoppingWarrantyFilter, shoppingColorFilter, sortFilter].forEach(function (element) {
          if (!element) return;
          element.value = element === sortFilter ? 'recommended' : 'all';
        });
        heroQuickFilters.forEach(function (item) { item.classList.remove('active'); });
        document.body.dataset.featuredMode = 'all';
        renderCategories('all', 'all');
        syncEstateDistrictOptions('all');
        syncSubcategoryOptions('all');
        updateDynamicFilterSections('all');
        renderHomeListings();
      });
    }

    if (heroSearchButton) {
      heroSearchButton.addEventListener('click', function () {
        if (document.getElementById('listingGrid')) {
          document.getElementById('listingGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        renderHomeListings();
      });
    }

    heroQuickFilters.forEach(function (button) {
      button.addEventListener('click', function () {
        heroQuickFilters.forEach(function (item) { item.classList.remove('active'); });
        button.classList.add('active');

        if (button.dataset.heroFilter === 'estate-sale') {
          syncCategoryValue('Gayrimenkul');
          if (estateListingTypeFilter) estateListingTypeFilter.value = 'Satılık';
        } else if (button.dataset.heroFilter === 'estate-rent') {
          syncCategoryValue('Gayrimenkul');
          if (estateListingTypeFilter) estateListingTypeFilter.value = 'Kiralık';
        } else if (button.dataset.heroFilter === 'vehicles') {
          syncCategoryValue('Araçlar');
          if (estateListingTypeFilter) estateListingTypeFilter.value = 'all';
        } else if (button.dataset.heroFilter === 'estate') {
          syncCategoryValue('Gayrimenkul');
          if (estateListingTypeFilter) estateListingTypeFilter.value = 'all';
        } else if (button.dataset.heroFilter === 'shopping') {
          syncCategoryValue('Alışveriş');
          if (estateListingTypeFilter) estateListingTypeFilter.value = 'all';
        }

        syncSubcategoryOptions(categoryFilter ? categoryFilter.value : 'all');
        updateDynamicFilterSections(categoryFilter ? categoryFilter.value : 'all');
        renderCategories(categoryFilter ? categoryFilter.value : 'all', document.body.dataset.featuredMode || 'all');
        renderHomeListings();
        syncUrlWithHomeFilters();
      });
    });

    var GROUP_TITLE_TO_SLUG = { Araçlar: 'vasita', Gayrimenkul: 'emlak', Alışveriş: 'alisveris' };

    showcaseLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        const target = link.dataset.showcaseTarget;
        if (!target) return;
        event.preventDefault();
        var slug = GROUP_TITLE_TO_SLUG[target] || homeCategoryFilterToSlug(target);
        if (slug) navigateHomeBySlug(slug, undefined);
        else {
          syncCategoryValue(target);
          syncSubcategoryOptions(target);
          updateDynamicFilterSections(target);
          renderCategories(target, document.body.dataset.featuredMode || 'all');
          renderHomeListings();
          syncUrlWithHomeFilters();
        }
      });
    });

    heroShortcutCards.forEach(function (card) {
      card.addEventListener('click', function () {
        const target = card.dataset.heroCategory || 'all';
        heroQuickFilters.forEach(function (item) { item.classList.remove('active'); });
        if (estateListingTypeFilter) estateListingTypeFilter.value = 'all';
        var slug = GROUP_TITLE_TO_SLUG[target] || homeCategoryFilterToSlug(target);
        if (slug) navigateHomeBySlug(slug, undefined);
        else {
          syncCategoryValue(target);
          syncSubcategoryOptions(target);
          updateDynamicFilterSections(target);
          renderCategories(target, document.body.dataset.featuredMode || 'all');
          renderHomeListings();
          syncUrlWithHomeFilters();
        }
      });
    });

    document.addEventListener('click', function (event) {
      const adLink = event.target.closest('[data-home-ad-id]');
      if (!adLink || typeof JETLE.trackAdClick !== 'function') return;
      JETLE.trackAdClick(adLink.dataset.homeAdId);
    });

    const categoryList = document.getElementById('categoryList');
    if (categoryList) {
      categoryList.addEventListener('click', function (event) {
        const toggleBtn = event.target.closest('[data-action="toggle-branch"]');
        if (toggleBtn) {
          event.preventDefault();
          const branch = toggleBtn.closest('.category-home-branch');
          if (branch) {
            branch.classList.toggle('is-open');
            toggleBtn.setAttribute('aria-expanded', branch.classList.contains('is-open') ? 'true' : 'false');
          }
          return;
        }

        const treeLink = event.target.closest('a.category-home-link[data-home-category-slug]');
        if (treeLink) {
          event.preventDefault();
          const slug = treeLink.getAttribute('data-home-category-slug') || 'all';
          navigateHomeBySlug(slug === 'all' ? 'all' : slug, undefined);
          return;
        }

        const featuredButton = event.target.closest('[data-featured]');
        if (featuredButton) {
          document.body.dataset.featuredMode = featuredButton.dataset.featured;
          renderCategories(categoryFilter ? categoryFilter.value : 'all', featuredButton.dataset.featured);
          renderHomeListings();
          syncUrlWithHomeFilters();
          return;
        }

        const groupButton = event.target.closest('[data-category-group]');
        if (groupButton && event.target.closest('button')) {
          const groupName = groupButton.dataset.categoryGroup;
          document.body.dataset.categoryExpandedAll = 'false';
          document.body.dataset.openCategoryGroup = document.body.dataset.openCategoryGroup === groupName ? '' : groupName;
          syncCategoryValue(groupButton.dataset.category);
          syncSubcategoryOptions(groupButton.dataset.category);
          updateDynamicFilterSections(groupButton.dataset.category);
          renderCategories(groupButton.dataset.category, document.body.dataset.featuredMode || 'all');
          renderHomeListings();
          syncUrlWithHomeFilters();
          closeMobileSidebar();
          return;
        }

        const button = event.target.closest('button[data-category]');
        if (!button) return;
        syncCategoryValue(button.dataset.category);
        syncSubcategoryOptions(button.dataset.category);
        updateDynamicFilterSections(button.dataset.category);
        renderCategories(button.dataset.category, document.body.dataset.featuredMode || 'all');
        renderHomeListings();
        syncUrlWithHomeFilters();
        closeMobileSidebar();
      });
    }

    if (categoryExpandToggle) {
      categoryExpandToggle.addEventListener('click', function () {
        const nextState = document.body.dataset.categoryExpandedAll !== 'true';
        document.body.dataset.categoryExpandedAll = nextState ? 'true' : 'false';
        if (nextState) {
          document.body.dataset.openCategoryGroup = '';
        }
        renderCategories(categoryFilter ? categoryFilter.value : 'all', document.body.dataset.featuredMode || 'all');
      });
    }

    if (mobileSidebarToggle && sidebarColumn && sidebarBackdrop) {
      mobileSidebarToggle.addEventListener('click', function () {
        sidebarColumn.classList.add('open');
        sidebarBackdrop.classList.add('show');
        document.body.classList.add('sidebar-open');
      });
    }

    if (mobileSidebarClose) {
      mobileSidebarClose.addEventListener('click', closeMobileSidebar);
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', closeMobileSidebar);
    }

    function applyHomeCategoryPick(value) {
      const v = value || 'all';
      if (v === 'all') {
        navigateHomeBySlug('all', undefined);
        return;
      }
      const slug = homeCategoryFilterToSlug(v);
      if (slug) navigateHomeBySlug(slug, undefined);
      else {
        syncCategoryValue(v);
        syncSubcategoryOptions(v);
        updateDynamicFilterSections(v);
        renderCategories(v, document.body.dataset.featuredMode || 'all');
        renderHomeListings();
        syncUrlWithHomeFilters();
        closeMobileSidebar();
        const gridEl = document.getElementById('listingGrid');
        if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    document.querySelectorAll('[data-home-category-pick]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyHomeCategoryPick(btn.getAttribute('data-home-category-pick'));
      });
    });

    function resetHomeListingFilters() {
      syncCategoryValue('all');
      syncCityValue('all');
      syncSearchValue('');
      syncDistrictValue('all');
      if (dateFilter) dateFilter.value = 'all';
      if (minPriceFilter) minPriceFilter.value = '';
      if (maxPriceFilter) maxPriceFilter.value = '';
      document.body.dataset.featuredMode = 'all';
      heroQuickFilters.forEach(function (item) { item.classList.remove('active'); });
      renderCategories('all', 'all');
      syncEstateDistrictOptions('all');
      syncSubcategoryOptions('all');
      updateDynamicFilterSections('all');
      navigateHomeBySlug('all', '');
      syncUrlWithHomeFilters();
    }

    const listingEmptyResetFilters = document.getElementById('listingEmptyResetFilters');
    if (listingEmptyResetFilters) {
      listingEmptyResetFilters.addEventListener('click', resetHomeListingFilters);
    }

    document.querySelectorAll('[data-home-quick-search]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const q = chip.getAttribute('data-home-quick-search') || '';
        navigateHomeBySlug(undefined, q);
      });
    });

    renderListings(listings);
    renderHomeListings();
    renderRecentViewedListings();
    renderHomeShowcases();
  }

  function initListingFormPage() {
    const user = requireAuth();
    if (!user) return;

    const editListingId = JETLE.getQueryParam('editId') || '';
    const existingListing = editListingId ? JETLE.getListings().find(function (item) {
      return item.id === editListingId && item.ownerId === user.id;
    }) : null;
    const categorySelect = document.getElementById('listingCategory');
    const form = document.getElementById('listingForm');
    const imageInput = document.getElementById('listingImages');
    const videoInput = document.getElementById('listingVideo');
    const dropzone = document.getElementById('mediaDropzone');
    const videoDropzone = document.getElementById('videoDropzone');
    const imagePreviewGrid = document.getElementById('imagePreviewGrid');
    const videoPreviewBox = document.getElementById('videoPreviewBox');
    const dynamicFields = document.getElementById('categoryDynamicFields');
    const listingNumberPreview = document.getElementById('listingNumberPreview');
    let imageFiles = [];
    let videoFile = null;
    let draggedImageIndex = null;

    function ensureInlineFormErrorBox() {
      if (!form) return null;
      let el = document.getElementById('listingFormInlineError');
      if (el) return el;
      el = document.createElement('div');
      el.id = 'listingFormInlineError';
      el.className = 'form-inline-error';
      el.setAttribute('role', 'alert');
      el.style.display = 'none';
      el.style.marginBottom = '12px';
      el.style.padding = '10px 12px';
      el.style.border = '1px solid #fca5a5';
      el.style.background = '#fef2f2';
      el.style.color = '#991b1b';
      el.style.borderRadius = '8px';
      form.insertBefore(el, form.firstChild);
      return el;
    }

    function clearInlineFormError() {
      const el = ensureInlineFormErrorBox();
      if (!el) return;
      el.textContent = '';
      el.style.display = 'none';
    }

    function setInlineFormError(message, fieldId) {
      const el = ensureInlineFormErrorBox();
      if (!el) return;
      el.textContent = String(message || 'Formda eksik veya hatalı alanlar var.');
      el.style.display = 'block';
      if (fieldId) {
        const field = document.getElementById(fieldId);
        if (field && typeof field.focus === 'function') field.focus();
      }
    }

    if (categorySelect) {
      categorySelect.innerHTML += JETLE.CATEGORIES.map(function (category) {
        return '<option value="' + category + '">' + category + '</option>';
      }).join('');
    }

    function generateListingNumber() {
      const existingNumbers = JETLE.getListings().map(function (item) { return item.listingNumber; });
      let nextNumber = '';
      do {
        nextNumber = 'JET-' + String(Math.floor(100000 + Math.random() * 900000));
      } while (existingNumbers.includes(nextNumber));
      return nextNumber;
    }

    const listingNumber = existingListing && existingListing.listingNumber ? existingListing.listingNumber : generateListingNumber();
    if (listingNumberPreview) {
      listingNumberPreview.textContent = listingNumber;
    }

    if (existingListing) {
      const pageHeading = document.querySelector('.page-heading-panel h1');
      const pageLead = document.querySelector('.page-heading-panel p');
      const submitBtn = document.getElementById('listingSubmitBtn');
      if (pageHeading) pageHeading.textContent = 'İlanı Düzenle';
      if (pageLead) pageLead.textContent = 'İlanınızı güncelleyin, eksik bilgileri düzeltin ve yeniden moderasyona gönderin.';
      if (submitBtn) submitBtn.textContent = 'Düzenle ve Tekrar Gönder';
    }

    function readFileAsDataURL(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (event) { resolve(event.target.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function getCategoryGroup(category) {
      const selected = String(category || '').toLowerCase();
      const group = JETLE.CATEGORY_GROUPS.find(function (item) {
        return item.title.toLowerCase() === selected || item.items.some(function (sub) {
          return sub.name.toLowerCase() === selected;
        });
      });
      return group ? group.title : '';
    }

    function buildOptionMarkup(items) {
      return items.map(function (item) {
        return '<option>' + item + '</option>';
      }).join('');
    }

    function getDynamicFieldsMarkup(groupName) {
      if (groupName === 'Araçlar') {
        const brandOptions = Object.keys(allCars).map(function (brand) {
          return '<option value="' + brand + '">' + brand + '</option>';
        }).join('');
        const bodyTypeOptions = buildOptionMarkup(vehicleMeta.bodyTypes);
        const fuelOptions = buildOptionMarkup(vehicleMeta.fuels);
        const transmissionOptions = buildOptionMarkup(vehicleMeta.transmissions);
        const drivetrainOptions = buildOptionMarkup(vehicleMeta.drivetrains);
        const colorOptions = buildOptionMarkup(vehicleMeta.colors);
        const conditionOptions = buildOptionMarkup(vehicleMeta.conditions);
        const sellerTypeOptions = buildOptionMarkup(vehicleMeta.sellerTypes);
        const warrantyOptions = buildOptionMarkup(['Var', 'Yok', 'Süresi dolmuş', 'Belirsiz']);
        const damageOptions = buildOptionMarkup(['Hasarsız', 'Tramer kaydı var — hafif', 'Tramer kaydı var — orta', 'Ağır hasar kayıtlı', 'Belirsiz']);
        const equipmentOptions = VEHICLE_EQUIPMENT_OPTIONS.map(function (item, index) {
          return '' +
            '<label class="equipment-check-item" for="vehicleEquipment' + index + '">' +
              '<input type="checkbox" id="vehicleEquipment' + index + '" value="' + item + '" data-dynamic-checklist="equipment" />' +
              '<span>' + item + '</span>' +
            '</label>';
        }).join('');
        return '' +
          '<div class="listing-sahibinden-spec-banner full-span">' +
            '<strong>Araç ilanı</strong>' +
            '<span>Teknik alanların tamamı zorunludur; eksiksiz doldurulan ilanlar daha hızlı onaylanır.</span>' +
          '</div>' +
          '<div class="listing-subsection full-span">' +
            '<div class="listing-subsection-head"><h3>Temel Bilgiler</h3><p>Marka, model ve yıl bilgileri arama sonuçlarında doğru eşleşme sağlar.</p></div>' +
            '<div class="listing-subsection-grid listing-subsection-grid-vehicle">' +
              '<div class="form-group form-group-search-select"><label for="vehicleBrandSearch" class="label-required">Marka</label><input type="search" id="vehicleBrandSearch" class="searchable-select-input" placeholder="Marka ara" autocomplete="off" /><select id="vehicleBrand" data-dynamic-field="brand" required><option value="">Marka seçin</option>' + brandOptions + '</select></div>' +
              '<div class="form-group form-group-search-select"><label for="vehicleModelSearch" class="label-required">Model / Seri</label><input type="search" id="vehicleModelSearch" class="searchable-select-input" placeholder="Önce marka seçin" autocomplete="off" disabled /><select id="vehicleModel" data-dynamic-field="model" disabled required><option value="">Önce marka seçin</option></select></div>' +
              '<div class="form-group"><label for="vehicleYear" class="label-required">Model Yılı</label><input type="number" id="vehicleYear" data-dynamic-field="year" placeholder="2021" min="1950" max="2035" required /></div>' +
              '<div class="form-group"><label for="vehicleCondition">Durum</label><select id="vehicleCondition" data-dynamic-field="condition"><option value="">Durum seçin</option>' + conditionOptions + '</select></div>' +
              '<div class="form-group"><label for="vehicleSellerType">Kimden</label><select id="vehicleSellerType" data-dynamic-field="sellerType"><option value="">Seçin</option>' + sellerTypeOptions + '</select></div>' +
              '<div class="form-group"><label for="vehiclePlateOrigin">Plaka / Uyruk</label><input type="text" id="vehiclePlateOrigin" data-dynamic-field="plateOrigin" placeholder="Örnek: TR Plakalı" /></div>' +
            '</div>' +
          '</div>' +
          '<div class="listing-subsection full-span">' +
            '<div class="listing-subsection-head"><h3>Teknik Özellikler</h3><p>Motor, şanzıman ve kilometre bilgileri alıcı güveni için kritiktir.</p></div>' +
            '<div class="listing-subsection-grid listing-subsection-grid-vehicle">' +
              '<div class="form-group"><label for="vehicleBodyType" class="label-required">Kasa Tipi</label><select id="vehicleBodyType" data-dynamic-field="bodyType" required><option value="">Kasa tipi seçin</option>' + bodyTypeOptions + '</select><small class="field-note">Model seçildiğinde önerilen kasa tipi otomatik gelir; gerekirse değiştirebilirsiniz.</small></div>' +
              '<div class="form-group"><label for="vehicleFuel" class="label-required">Yakıt</label><select id="vehicleFuel" data-dynamic-field="fuel" required><option value="">Yakıt seçin</option>' + fuelOptions + '</select></div>' +
              '<div class="form-group"><label for="vehicleTransmission" class="label-required">Vites</label><select id="vehicleTransmission" data-dynamic-field="transmission" required><option value="">Vites seçin</option>' + transmissionOptions + '</select></div>' +
              '<div class="form-group"><label for="vehicleTraction" class="label-required">Çekiş</label><select id="vehicleTraction" data-dynamic-field="traction" required><option value="">Çekiş seçin</option>' + drivetrainOptions + '</select></div>' +
              '<div class="form-group"><label for="vehicleKm" class="label-required">Kilometre</label><input type="number" id="vehicleKm" data-dynamic-field="km" placeholder="125000" min="0" required /></div>' +
              '<div class="form-group"><label for="vehicleEngineVolume" class="label-required">Motor Hacmi</label><input type="text" id="vehicleEngineVolume" data-dynamic-field="engineVolume" placeholder="Örn. 1598 cc veya 1.6" required /></div>' +
              '<div class="form-group"><label for="vehicleEnginePower" class="label-required">Motor Gücü</label><input type="text" id="vehicleEnginePower" data-dynamic-field="enginePower" placeholder="Örn. 170 hp" required /></div>' +
              '<div class="form-group"><label for="vehicleSegment">Segment</label><input type="text" id="vehicleSegment" data-dynamic-field="segment" placeholder="Model seçildiğinde otomatik gelir" /></div>' +
            '</div>' +
          '</div>' +
          '<div class="listing-subsection full-span">' +
            '<div class="listing-subsection-head"><h3>Görünüm, garanti ve hasar</h3><p>Renk, garanti durumu ve hasar bilgisi şeffaflık sağlar.</p></div>' +
            '<div class="listing-subsection-grid listing-subsection-grid-vehicle">' +
              '<div class="form-group"><label for="vehicleColor" class="label-required">Renk</label><select id="vehicleColor" data-dynamic-field="color" required><option value="">Renk seçin</option>' + colorOptions + '</select></div>' +
              '<div class="form-group"><label for="vehicleWarranty" class="label-required">Garanti</label><select id="vehicleWarranty" data-dynamic-field="warranty" required><option value="">Seçin</option>' + warrantyOptions + '</select></div>' +
              '<div class="form-group"><label for="vehicleDamageRecord" class="label-required">Hasar / tramer kaydı</label><select id="vehicleDamageRecord" data-dynamic-field="damageRecord" required><option value="">Seçin</option>' + damageOptions + '</select></div>' +
              '<div class="form-group"><label for="vehicleExchange">Takas</label><select id="vehicleExchange" data-dynamic-field="exchange"><option value="">Seçin</option><option>Evet</option><option>Hayır</option></select></div>' +
            '</div>' +
            '<div class="form-group full-span">' +
              '<label>Opsiyonel donanımlar</label>' +
              '<div class="equipment-check-grid">' + equipmentOptions + '</div>' +
            '</div>' +
          '</div>';
      }

      if (groupName === 'Gayrimenkul') {
        const listingTypeOptions = buildOptionMarkup(estateMeta.listingTypes);
        const estateTypeOptions = buildOptionMarkup(estateMeta.estateTypes);
        const roomCountOptions = buildOptionMarkup(estateMeta.roomCounts);
        const heatingOptions = buildOptionMarkup(estateMeta.heatingTypes);
        const yesNoOptions = buildOptionMarkup(estateMeta.yesNo);
        return '' +
          '<div class="listing-sahibinden-spec-banner full-span">' +
            '<strong>Emlak ilanı</strong>' +
            '<span>İlan tipi, brüt metrekare ve oda sayısı zorunludur; konum bilgisini aşağıdaki emlak alanından veya genel konum bölümünden girebilirsiniz.</span>' +
          '</div>' +
          '<div class="listing-subsection full-span">' +
            '<div class="listing-subsection-head"><h3>Temel Bilgiler</h3><p>İlan tipi ve emlak türüne göre temel bilgileri eksiksiz girin.</p></div>' +
            '<div class="listing-subsection-grid">' +
              '<div class="form-group"><label for="estateListingType" class="label-required">İlan Tipi</label><select id="estateListingType" data-dynamic-field="listingType" required><option value="">Seçin</option>' + listingTypeOptions + '</select></div>' +
              '<div class="form-group"><label for="estateType" class="label-required">Emlak Türü</label><select id="estateType" data-dynamic-field="estateType" required><option value="">Seçin</option>' + estateTypeOptions + '</select></div>' +
              '<div class="form-group"><label for="estateRooms" class="label-required">Oda Sayısı</label><select id="estateRooms" data-dynamic-field="roomCount" required><option value="">Seçin</option>' + roomCountOptions + '</select></div>' +
              '<div class="form-group"><label for="estateM2" class="label-required">Metrekare (m²)</label><input type="number" id="estateM2" data-dynamic-field="m2" placeholder="120" min="1" required /></div>' +
              '<div class="form-group"><label for="estateAge">Bina Yaşı</label><input type="number" id="estateAge" data-dynamic-field="buildingAge" placeholder="5" min="0" /></div>' +
            '</div>' +
          '</div>' +
          '<div class="listing-subsection full-span">' +
            '<div class="listing-subsection-head"><h3>Özellikler</h3><p>Konut ve iş yeri ilanlarında öne çıkan özellikleri belirtin.</p></div>' +
            '<div class="listing-subsection-grid">' +
              '<div class="form-group"><label for="estateFloor">Kat</label><input type="number" id="estateFloor" data-dynamic-field="floor" placeholder="3" min="0" /></div>' +
              '<div class="form-group"><label for="estateTotalFloors">Toplam Kat</label><input type="number" id="estateTotalFloors" data-dynamic-field="totalFloors" placeholder="10" min="0" /></div>' +
              '<div class="form-group"><label for="estateHeating">Isıtma</label><select id="estateHeating" data-dynamic-field="heating"><option value="">Seçin</option>' + heatingOptions + '</select></div>' +
              '<div class="form-group"><label for="estateBalcony">Balkon</label><select id="estateBalcony" data-dynamic-field="balcony"><option value="">Seçin</option>' + yesNoOptions + '</select></div>' +
              '<div class="form-group"><label for="estateElevator">Asansör</label><select id="estateElevator" data-dynamic-field="elevator"><option value="">Seçin</option>' + yesNoOptions + '</select></div>' +
              '<div class="form-group"><label for="estateParking">Otopark</label><select id="estateParking" data-dynamic-field="parking"><option value="">Seçin</option>' + yesNoOptions + '</select></div>' +
              '<div class="form-group"><label for="estateFurnished">Eşyalı mı</label><select id="estateFurnished" data-dynamic-field="furnished"><option value="">Seçin</option>' + yesNoOptions + '</select></div>' +
            '</div>' +
          '</div>' +
          '<div class="listing-subsection full-span">' +
            '<div class="listing-subsection-head"><h3>Konum</h3><p>İl, ilçe ve mahalle bilgilerini girin. Harita alanı ileride etkileşimli olarak bağlanabilir.</p></div>' +
            '<div class="listing-subsection-grid">' +
              '<div class="form-group"><label for="estateCity" class="label-required">İl</label><input type="text" id="estateCity" data-dynamic-field="city" placeholder="İstanbul" required /></div>' +
              '<div class="form-group"><label for="estateDistrict" class="label-required">İlçe</label><input type="text" id="estateDistrict" data-dynamic-field="district" placeholder="Kadıköy" required /></div>' +
              '<div class="form-group full-span"><label for="estateNeighborhood">Mahalle</label><input type="text" id="estateNeighborhood" data-dynamic-field="neighborhood" placeholder="Kozyatağı Mahallesi" /></div>' +
              '<div class="form-group full-span">' +
                '<label>Harita</label>' +
                '<div class="estate-map-placeholder">Harita alanı burada gösterilecek</div>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      if (groupName === 'Alışveriş') {
        return '' +
          '<div class="listing-sahibinden-spec-banner full-span">' +
            '<strong>Ürün ilanı</strong>' +
            '<span>Marka ve garanti durumu zorunludur.</span>' +
          '</div>' +
          '<div class="form-group"><label for="shoppingBrand" class="label-required">Marka</label><input type="text" id="shoppingBrand" data-dynamic-field="brand" placeholder="Örnek: Apple" required /></div>' +
          '<div class="form-group"><label for="shoppingWarranty" class="label-required">Garanti Durumu</label><select id="shoppingWarranty" data-dynamic-field="warranty" required><option value="">Seçin</option><option>Var</option><option>Yok</option><option>Devam ediyor</option></select></div>';
      }

      return '<div class="empty-state compact-empty-state"><h3>Ek alan bulunmuyor</h3><p>Bu kategori için standart ilan bilgileri yeterlidir.</p></div>';
    }

    function bindVehicleFieldDependencies() {
      const brandSearch = document.getElementById('vehicleBrandSearch');
      const brandSelect = document.getElementById('vehicleBrand');
      const modelSearch = document.getElementById('vehicleModelSearch');
      const modelSelect = document.getElementById('vehicleModel');
      const bodyTypeSelect = document.getElementById('vehicleBodyType');
      const segmentInput = document.getElementById('vehicleSegment');
      if (!brandSearch || !brandSelect || !modelSearch || !modelSelect) return;

      const allBrandEntries = Object.keys(allCars).map(function (brand) {
        return { value: brand, label: brand };
      });
      let isApplyingVehicleSuggestion = false;

      function populateSelect(select, items, emptyText) {
        select.innerHTML = '<option value="">' + emptyText + '</option>' + items.map(function (item) {
          return '<option value="' + item.value + '">' + item.label + '</option>';
        }).join('');
      }

      function filterSelectOptions(searchInput, select, items, emptyText) {
        const query = String(searchInput.value || '').trim().toLowerCase();
        const filteredItems = !query ? items : items.filter(function (item) {
          return item.label.toLowerCase().includes(query);
        });
        const currentValue = select.value;
        populateSelect(select, filteredItems, emptyText);
        if (filteredItems.some(function (item) { return item.value === currentValue; })) {
          select.value = currentValue;
        }
      }

      function renderModelOptions() {
        const selectedBrand = String(brandSelect.value || '').trim();
        const models = getVehicleModelsForBrand(selectedBrand).map(function (model) {
          return { value: model, label: model };
        });
        modelSelect.disabled = !models.length;
        modelSearch.disabled = !models.length;
        modelSearch.placeholder = models.length ? 'Model ara' : 'Önce marka seçin';
        modelSearch.value = '';
        populateSelect(modelSelect, models, models.length ? 'Model seçin' : 'Önce marka seçin');
        if (!models.length) {
          if (bodyTypeSelect) {
            bodyTypeSelect.value = '';
            delete bodyTypeSelect.dataset.autoSuggestedValue;
          }
          if (segmentInput) {
            segmentInput.value = '';
            delete segmentInput.dataset.autoSuggestedValue;
          }
        }
      }

      function applyModelMeta() {
        const selectedModel = String(modelSelect.value || '').trim();
        const meta = VEHICLE_MODEL_META[selectedModel] || null;
        if (bodyTypeSelect) {
          if (meta && meta.bodyType) {
            const canAutofillBodyType = !bodyTypeSelect.value || bodyTypeSelect.value === bodyTypeSelect.dataset.autoSuggestedValue;
            if (canAutofillBodyType) {
              isApplyingVehicleSuggestion = true;
              bodyTypeSelect.value = meta.bodyType;
              bodyTypeSelect.dataset.autoSuggestedValue = meta.bodyType;
              isApplyingVehicleSuggestion = false;
            }
          } else if (bodyTypeSelect.value === bodyTypeSelect.dataset.autoSuggestedValue) {
            isApplyingVehicleSuggestion = true;
            bodyTypeSelect.value = '';
            delete bodyTypeSelect.dataset.autoSuggestedValue;
            isApplyingVehicleSuggestion = false;
          }
        }
        if (segmentInput) {
          const nextSegment = meta && meta.segment ? meta.segment : '';
          if (!segmentInput.value || segmentInput.value === segmentInput.dataset.autoSuggestedValue) {
            segmentInput.value = nextSegment;
            if (nextSegment) {
              segmentInput.dataset.autoSuggestedValue = nextSegment;
            } else {
              delete segmentInput.dataset.autoSuggestedValue;
            }
          }
        }
      }

      if (bodyTypeSelect) {
        bodyTypeSelect.addEventListener('change', function () {
          if (isApplyingVehicleSuggestion) return;
          if (bodyTypeSelect.value) {
            delete bodyTypeSelect.dataset.autoSuggestedValue;
          }
        });
      }

      if (segmentInput) {
        segmentInput.addEventListener('input', function () {
          delete segmentInput.dataset.autoSuggestedValue;
        });
      }

      brandSearch.addEventListener('input', function () {
        filterSelectOptions(brandSearch, brandSelect, allBrandEntries, 'Marka seçin');
      });

      brandSelect.addEventListener('change', function () {
        brandSearch.value = brandSelect.value;
        renderModelOptions();
        applyModelMeta();
      });

      modelSearch.addEventListener('input', function () {
        const selectedBrand = String(brandSelect.value || '').trim();
        const models = getVehicleModelsForBrand(selectedBrand).map(function (model) {
          return { value: model, label: model };
        });
        filterSelectOptions(modelSearch, modelSelect, models, 'Model seçin');
      });

      modelSelect.addEventListener('change', function () {
        modelSearch.value = modelSelect.value;
        applyModelMeta();
      });

      populateSelect(brandSelect, allBrandEntries, 'Marka seçin');
      renderModelOptions();
    }

    function bindEstateFieldDependencies() {
      const listingTypeSelect = document.getElementById('estateListingType');
      const cityInput = document.getElementById('estateCity');
      const districtInput = document.getElementById('estateDistrict');
      const neighborhoodInput = document.getElementById('estateNeighborhood');
      const priceLabel = document.querySelector('label[for="listingPrice"]');
      const priceInput = document.getElementById('listingPrice');
      const locationInput = document.getElementById('listingLocation');
      if (!listingTypeSelect && !cityInput && !districtInput && !neighborhoodInput) return;

      function syncEstatePriceLabel() {
        if (!priceLabel || !priceInput || !listingTypeSelect) return;
        if (listingTypeSelect.value === 'Kiralık') {
          priceLabel.textContent = 'Aylık Kira';
          priceInput.placeholder = '35000';
        } else {
          priceLabel.textContent = 'Toplam Fiyat';
          priceInput.placeholder = '3500000';
        }
      }

      function syncEstateLocation() {
        const mainCity = document.getElementById('listingCity');
        const mainDistrict = document.getElementById('listingDistrict');
        const mainNeighborhood = document.getElementById('listingNeighborhood');
        if (cityInput && mainCity && String(cityInput.value || '').trim()) {
          mainCity.value = String(cityInput.value).trim();
        }
        if (districtInput && mainDistrict && String(districtInput.value || '').trim()) {
          mainDistrict.value = String(districtInput.value).trim();
        }
        if (neighborhoodInput && mainNeighborhood && String(neighborhoodInput.value || '').trim()) {
          mainNeighborhood.value = String(neighborhoodInput.value).trim();
        }
        if (!locationInput) return;
        const parts = [cityInput && cityInput.value, districtInput && districtInput.value, neighborhoodInput && neighborhoodInput.value].filter(function (item) {
          return String(item || '').trim();
        }).map(function (item) {
          return String(item).trim();
        });
        if (parts.length) {
          locationInput.value = parts.join(' / ');
        }
      }

      if (listingTypeSelect) {
        listingTypeSelect.addEventListener('change', syncEstatePriceLabel);
        syncEstatePriceLabel();
      }

      [cityInput, districtInput, neighborhoodInput].forEach(function (input) {
        if (!input) return;
        input.addEventListener('input', syncEstateLocation);
        input.addEventListener('change', syncEstateLocation);
      });
    }

    function renderDynamicFields() {
      if (!dynamicFields || !categorySelect) return;
      dynamicFields.innerHTML = getDynamicFieldsMarkup(getCategoryGroup(categorySelect.value));
      bindVehicleFieldDependencies();
      bindEstateFieldDependencies();
    }

    function fillDynamicFields(details) {
      const data = Object.assign({}, details || {});
      if (!data.damageRecord && data.heavyDamage) {
        data.damageRecord = data.heavyDamage === 'Evet' ? 'Ağır hasar kayıtlı' : (data.heavyDamage === 'Hayır' ? 'Hasarsız' : data.heavyDamage);
      }
      Object.keys(data).forEach(function (key) {
        const value = data[key];
        const input = dynamicFields ? dynamicFields.querySelector('[data-dynamic-field="' + key + '"]') : null;
        if (input) {
          input.value = value == null ? '' : String(value);
        }
        const checklistInputs = dynamicFields ? dynamicFields.querySelectorAll('[data-dynamic-checklist="' + key + '"]') : [];
        if (checklistInputs.length && Array.isArray(value)) {
          checklistInputs.forEach(function (item) {
            item.checked = value.includes(item.value);
          });
        }
      });
    }

    function populateFormFromListing(listing) {
      if (!listing) return;
      const titleInput = document.getElementById('listingTitle');
      const priceInput = document.getElementById('listingPrice');
      const locationInput = document.getElementById('listingLocation');
      const descriptionInput = document.getElementById('listingDescription');
      const verificationInput = document.getElementById('listingVerification');

      if (titleInput) titleInput.value = listing.title || '';
      if (priceInput) priceInput.value = String(listing.price || '');
      if (locationInput) locationInput.value = listing.location || '';
      if (descriptionInput) descriptionInput.value = listing.description || '';
      if (categorySelect) categorySelect.value = listing.category || '';
      if (verificationInput) verificationInput.value = 'pending';

      renderDynamicFields();
      const mergedDetails = Object.assign({}, listing.details || {});
      ['brand', 'model', 'year', 'fuel', 'transmission', 'km', 'enginePower', 'engineVolume', 'traction', 'color', 'warranty', 'damageRecord'].forEach(function (k) {
        if (listing[k] != null && String(listing[k]).trim() !== '' && !String(mergedDetails[k] || '').trim()) {
          mergedDetails[k] = listing[k];
        }
      });
      fillDynamicFields(mergedDetails);

      imageFiles = (listing.images && listing.images.length ? listing.images : [listing.image]).filter(Boolean).slice(0, 20).map(function (src, index) {
        return {
          name: 'listing-image-' + index + '.jpg',
          dataUrl: src
        };
      });
      videoFile = listing.video ? { name: 'listing-video.mp4', dataUrl: listing.video } : null;
      renderMediaPreviews();
    }

    function optimizeImage(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const img = new Image();
          img.onload = function () {
            const maxDimension = 1800;
            let width = img.width;
            let height = img.height;
            if (width > maxDimension || height > maxDimension) {
              const ratio = Math.min(maxDimension / width, maxDimension / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          };
          img.onerror = reject;
          img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function getVideoDuration(file) {
      return new Promise(function (resolve, reject) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
          URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.onerror = reject;
        video.src = URL.createObjectURL(file);
      });
    }

    function renderMediaPreviews() {
      imagePreviewGrid.innerHTML = imageFiles.map(function (item, index) {
        return '' +
          '<article class="media-preview-item ' + (index === 0 ? 'featured' : '') + '" draggable="true" data-image-index="' + index + '">' +
            '<img src="' + item.dataUrl + '" alt="Fotoğraf önizleme" />' +
            '<button type="button" class="media-remove-btn" data-remove-image-index="' + index + '" aria-label="Fotoğrafı kaldır">✕</button>' +
            '<div class="media-item-footer">' +
              '<span class="media-item-note">' + (index === 0 ? 'Kapak fotoğrafı' : 'Fotoğraf ' + (index + 1)) + '</span>' +
              '<button type="button" class="btn btn-light btn-small media-cover-btn" data-cover-index="' + index + '">' + (index === 0 ? 'Kapak' : 'Kapak Yap') + '</button>' +
            '</div>' +
          '</article>';
      }).join('');

      videoPreviewBox.innerHTML = videoFile ? '' +
        '<article class="media-video-card">' +
          '<video src="' + videoFile.dataUrl + '" controls preload="metadata"></video>' +
          '<button type="button" class="media-remove-btn" data-remove-video="true" aria-label="Videoyu kaldır">✕</button>' +
          '<div class="video-preview-footer"><span class="video-preview-note">Yüklenen video</span></div>' +
        '</article>' : '';
    }

    function validateImage(file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        JETLE.showToast('Sadece JPG, PNG ve WEBP görseller yüklenebilir.');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        JETLE.showToast('Her görsel en fazla 10 MB olabilir.');
        return false;
      }
      return true;
    }

    async function validateVideo(file) {
      if (file.type !== 'video/mp4') {
        JETLE.showToast('Video formatı yalnızca MP4 olabilir.');
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        JETLE.showToast('Video en fazla 50 MB olabilir.');
        return false;
      }
      try {
        const duration = await getVideoDuration(file);
        if (duration < 10 || duration > 300) {
          JETLE.showToast('Video süresi 10 saniye ile 5 dakika arasında olmalıdır.');
          return false;
        }
      } catch (error) {
        JETLE.showToast('Video süresi okunamadı.');
        return false;
      }
      return true;
    }

    async function addImages(files) {
      const selectedFiles = Array.from(files || []);
      for (const file of selectedFiles) {
        if (!validateImage(file)) {
          continue;
        }
        if (imageFiles.length >= 20) {
          JETLE.showToast('En fazla 20 fotoğraf ekleyebilirsiniz.');
          break;
        }
        imageFiles.push({
          name: file.name,
          dataUrl: await optimizeImage(file)
        });
      }
      renderMediaPreviews();
      imageInput.value = '';
    }

    async function addVideo(file) {
      if (!file || !(await validateVideo(file))) {
        videoInput.value = '';
        return;
      }
      videoFile = {
        name: file.name,
        dataUrl: await readFileAsDataURL(file)
      };
      renderMediaPreviews();
      videoInput.value = '';
    }

    if (imageInput) {
      imageInput.addEventListener('change', async function () {
        await addImages(imageInput.files);
      });
    }

    if (videoInput) {
      videoInput.addEventListener('change', async function () {
        const file = videoInput.files && videoInput.files[0];
        await addVideo(file);
      });
    }

      if (dropzone) {
      ['dragenter', 'dragover'].forEach(function (eventName) {
        dropzone.addEventListener(eventName, function (event) {
          event.preventDefault();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(function (eventName) {
        dropzone.addEventListener(eventName, function (event) {
          event.preventDefault();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', async function (event) {
        const files = Array.from(event.dataTransfer.files || []);
        const imageCandidates = files.filter(function (file) { return file.type.startsWith('image/'); });
        const videoCandidate = files.find(function (file) { return file.type === 'video/mp4'; });
        if (imageCandidates.length) {
          await addImages(imageCandidates);
        }
        if (videoCandidate) {
          await addVideo(videoCandidate);
        }
      });
      }

      if (videoDropzone) {
        ['dragenter', 'dragover'].forEach(function (eventName) {
          videoDropzone.addEventListener(eventName, function (event) {
            event.preventDefault();
            videoDropzone.classList.add('dragover');
          });
        });

        ['dragleave', 'drop'].forEach(function (eventName) {
          videoDropzone.addEventListener(eventName, function (event) {
            event.preventDefault();
            videoDropzone.classList.remove('dragover');
          });
        });

        videoDropzone.addEventListener('drop', async function (event) {
          const file = Array.from(event.dataTransfer.files || []).find(function (item) {
            return item.type === 'video/mp4';
          });
          if (file) {
            await addVideo(file);
          }
        });
      }

      if (imagePreviewGrid) {
        imagePreviewGrid.addEventListener('click', function (event) {
          const button = event.target.closest('[data-remove-image-index]');
          const coverButton = event.target.closest('[data-cover-index]');

          if (button) {
            const index = Number(button.dataset.removeImageIndex);
            imageFiles = imageFiles.filter(function (_, itemIndex) { return itemIndex !== index; });
            renderMediaPreviews();
            return;
          }

          if (coverButton) {
            const index = Number(coverButton.dataset.coverIndex);
            const selected = imageFiles[index];
            imageFiles = [selected].concat(imageFiles.filter(function (_, itemIndex) { return itemIndex !== index; }));
            renderMediaPreviews();
          }
        });

        imagePreviewGrid.addEventListener('dragstart', function (event) {
          const item = event.target.closest('[data-image-index]');
          if (!item) return;
          draggedImageIndex = Number(item.dataset.imageIndex);
        });

        imagePreviewGrid.addEventListener('dragover', function (event) {
          event.preventDefault();
        });

        imagePreviewGrid.addEventListener('drop', function (event) {
          event.preventDefault();
          const targetItem = event.target.closest('[data-image-index]');
          if (!targetItem || draggedImageIndex === null) return;
          const targetIndex = Number(targetItem.dataset.imageIndex);
          if (draggedImageIndex === targetIndex) return;

          const moved = imageFiles[draggedImageIndex];
          const nextImages = imageFiles.slice();
          nextImages.splice(draggedImageIndex, 1);
          nextImages.splice(targetIndex, 0, moved);
          imageFiles = nextImages;
          draggedImageIndex = null;
          renderMediaPreviews();
        });
      }

    if (videoPreviewBox) {
      videoPreviewBox.addEventListener('click', function (event) {
        const button = event.target.closest('[data-remove-video]');
        if (!button) return;
        videoFile = null;
        renderMediaPreviews();
      });
    }

    function syncMainLocationToHidden() {
      const hidden = document.getElementById('listingLocation');
      const city = document.getElementById('listingCity');
      const district = document.getElementById('listingDistrict');
      const neighborhood = document.getElementById('listingNeighborhood');
      if (!hidden) return;
      const parts = [city && city.value, district && district.value, neighborhood && neighborhood.value]
        .map(function (s) { return String(s || '').trim(); })
        .filter(Boolean);
      hidden.value = parts.join(' / ');
    }

    ['listingCity', 'listingDistrict', 'listingNeighborhood'].forEach(function (fieldId) {
      const node = document.getElementById(fieldId);
      if (node) {
        node.addEventListener('input', syncMainLocationToHidden);
        node.addEventListener('change', syncMainLocationToHidden);
      }
    });
    syncMainLocationToHidden();

    function collectDynamicExtraFields() {
      const extraFields = {};
      const dynamicInputs = dynamicFields ? dynamicFields.querySelectorAll('[data-dynamic-field]') : [];
      dynamicInputs.forEach(function (field) {
        extraFields[field.dataset.dynamicField] = field.value;
      });
      const checklistGroups = dynamicFields ? dynamicFields.querySelectorAll('[data-dynamic-checklist]') : [];
      const checklistMap = {};
      checklistGroups.forEach(function (field) {
        const key = field.dataset.dynamicChecklist;
        if (!checklistMap[key]) checklistMap[key] = [];
        if (field.checked) {
          checklistMap[key].push(field.value);
        }
      });
      Object.keys(checklistMap).forEach(function (key) {
        extraFields[key] = checklistMap[key];
      });
      const dr = String(extraFields.damageRecord || '').trim();
      if (dr) {
        extraFields.heavyDamage = /ağır/i.test(dr) ? 'Evet' : 'Hayır';
      }
      return extraFields;
    }

    function buildTopLevelSpec(categoryGroupName, extraFields) {
      const empty = {
        brand: '',
        model: '',
        year: '',
        fuel: '',
        transmission: '',
        km: '',
        enginePower: '',
        engineVolume: '',
        traction: '',
        color: '',
        warranty: '',
        damageRecord: ''
      };
      if (categoryGroupName === 'Araçlar') {
        Object.keys(empty).forEach(function (k) {
          empty[k] = String(extraFields[k] || '').trim();
        });
        return empty;
      }
      if (categoryGroupName === 'Alışveriş') {
        return {
          brand: String(extraFields.brand || '').trim(),
          model: '',
          year: '',
          fuel: '',
          transmission: '',
          km: '',
          enginePower: '',
          engineVolume: '',
          traction: '',
          color: '',
          warranty: String(extraFields.warranty || '').trim(),
          damageRecord: ''
        };
      }
      return empty;
    }

    function validateCategoryDynamicFields(categoryGroupName, extraFields, reportError) {
      const emitError = typeof reportError === 'function' ? reportError : function (msg) { JETLE.showToast(msg); };
      if (categoryGroupName === 'Araçlar') {
        const req = ['brand', 'model', 'year', 'bodyType', 'fuel', 'transmission', 'traction', 'km', 'engineVolume', 'enginePower', 'color', 'warranty', 'damageRecord'];
        const labels = {
          brand: 'Marka',
          model: 'Model',
          year: 'Model yılı',
          bodyType: 'Kasa tipi',
          fuel: 'Yakıt',
          transmission: 'Vites',
          traction: 'Çekiş',
          km: 'Kilometre',
          engineVolume: 'Motor hacmi',
          enginePower: 'Motor gücü',
          color: 'Renk',
          warranty: 'Garanti',
          damageRecord: 'Hasar / tramer kaydı'
        };
        const missing = req.filter(function (k) { return !String(extraFields[k] || '').trim(); });
        if (missing.length) {
          emitError('Araç ilanı — zorunlu: ' + missing.map(function (k) { return labels[k] || k; }).join(', ') + '.');
          return false;
        }
        return true;
      }
      if (categoryGroupName === 'Gayrimenkul') {
        const req = ['listingType', 'estateType', 'roomCount', 'm2', 'city', 'district'];
        const labels = {
          listingType: 'İlan tipi',
          estateType: 'Emlak türü',
          roomCount: 'Oda sayısı',
          m2: 'Metrekare',
          city: 'İl',
          district: 'İlçe'
        };
        const missing = req.filter(function (k) { return !String(extraFields[k] || '').trim(); });
        if (missing.length) {
          emitError('Emlak ilanı — zorunlu: ' + missing.map(function (k) { return labels[k] || k; }).join(', ') + '.');
          return false;
        }
        return true;
      }
      if (categoryGroupName === 'Alışveriş') {
        if (!String(extraFields.brand || '').trim() || !String(extraFields.warranty || '').trim()) {
          emitError('Ürün ilanı için marka ve garanti durumu zorunludur.');
          return false;
        }
        return true;
      }
      return true;
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      clearInlineFormError();
      syncMainLocationToHidden();

      const titleValue = document.getElementById('listingTitle').value.trim();
      const priceValue = document.getElementById('listingPrice').value.trim();
      const categoryValue = document.getElementById('listingCategory').value.trim();
      const descriptionValue = document.getElementById('listingDescription').value.trim();
      const categoryGroupName = getCategoryGroup(categoryValue);

      if (categoryGroupName === 'Gayrimenkul') {
        const esCity = document.getElementById('estateCity');
        const esDist = document.getElementById('estateDistrict');
        const esNeigh = document.getElementById('estateNeighborhood');
        const lc = document.getElementById('listingCity');
        const ld = document.getElementById('listingDistrict');
        const ln = document.getElementById('listingNeighborhood');
        if (lc && esCity && String(esCity.value || '').trim() && !String(lc.value || '').trim()) {
          lc.value = String(esCity.value).trim();
        }
        if (ld && esDist && String(esDist.value || '').trim() && !String(ld.value || '').trim()) {
          ld.value = String(esDist.value).trim();
        }
        if (ln && esNeigh && String(esNeigh.value || '').trim() && !String(ln.value || '').trim()) {
          ln.value = String(esNeigh.value).trim();
        }
        syncMainLocationToHidden();
      }

      if (!titleValue) {
        setInlineFormError('Başlık zorunludur.', 'listingTitle');
        return;
      }
      if (!priceValue || !Number.isFinite(Number(priceValue)) || Number(priceValue) <= 0) {
        setInlineFormError('Geçerli bir fiyat girin.', 'listingPrice');
        return;
      }
      if (!categoryValue) {
        setInlineFormError('Kategori seçimi zorunludur.', 'listingCategory');
        return;
      }
      if (!descriptionValue) {
        setInlineFormError('Açıklama zorunludur.', 'listingDescription');
        return;
      }

      if (!imageFiles.length || imageFiles.length < 5) {
        setInlineFormError('En az 5 fotoğraf yüklemeniz gerekir.', 'listingImages');
        return;
      }

      const cityVal = document.getElementById('listingCity') && document.getElementById('listingCity').value.trim();
      const districtVal = document.getElementById('listingDistrict') && document.getElementById('listingDistrict').value.trim();
      if (!cityVal || !districtVal) {
        setInlineFormError('İl ve ilçe bilgisi zorunludur.', !cityVal ? 'listingCity' : 'listingDistrict');
        return;
      }

      const extraFields = collectDynamicExtraFields();
      if (!validateCategoryDynamicFields(categoryGroupName, extraFields, function (msg) { setInlineFormError(msg); })) {
        return;
      }

      const locationStr = String(document.getElementById('listingLocation').value || '').trim();
      if (!locationStr) {
        setInlineFormError('Konum bilgisi eksik.');
        return;
      }

      const specTop = buildTopLevelSpec(categoryGroupName, extraFields);
      const imagesArr = imageFiles.map(function (item) { return item.dataUrl; });

      const listings = JETLE.getListings();
      const ownerRecord = JETLE.getUsers().find(function (item) { return item.id === user.id; }) || user;
      const activeStore = ownerRecord.store && ownerRecord.store.active ? ownerRecord.store : null;
      const storePackage = activeStore ? getStorePackageById(activeStore.packageId) : null;
      if (storePackage && storePackage.limit !== 'Sınırsız') {
        const currentListingCount = listings.filter(function (item) {
          return item.ownerId === user.id;
        }).length;
        if (currentListingCount >= Number(storePackage.limit)) {
          JETLE.showToast('Mağaza paket limitin doldu. Yeni ilan için paketi yükselt.');
          return;
        }
      }

      const subcategoryVal = document.getElementById('listingSubcategory') ? document.getElementById('listingSubcategory').value.trim() : '';
      const ownerNameField = document.getElementById('listingOwnerName');
      const phoneField = document.getElementById('listingPhone');
      const nextListing = {
        id: existingListing ? existingListing.id : ('l' + Date.now()),
        listingNumber: listingNumber,
        slug: slugify(titleValue) || ('ilan-' + Date.now()),
        title: titleValue,
        price: Number(priceValue),
        category: categoryValue,
        categorySlug: getListingCategorySlug({ category: categoryValue }),
        categoryGroup: categoryGroupName,
        subcategory: subcategoryVal,
        description: descriptionValue,
        image: imageFiles[0].dataUrl,
        images: imagesArr,
        video: videoFile ? videoFile.dataUrl : '',
        location: locationStr,
        brand: specTop.brand,
        model: specTop.model,
        year: specTop.year,
        fuel: specTop.fuel,
        transmission: specTop.transmission,
        km: specTop.km,
        enginePower: specTop.enginePower,
        engineVolume: specTop.engineVolume,
        traction: specTop.traction,
        color: specTop.color,
        warranty: specTop.warranty,
        damageRecord: specTop.damageRecord,
        ownerId: user.id,
        userId: user.id,
        ownerName: ownerNameField && ownerNameField.value.trim() ? ownerNameField.value.trim() : user.name,
        ownerPhone: phoneField && phoneField.value.trim() ? phoneField.value.trim() : '',
        verification: 'pending',
        status: 'pending',
        moderationReason: '',
        details: extraFields,
        premium: existingListing ? Boolean(existingListing.premium) : false,
        views: existingListing ? Number(existingListing.views || 0) : 0,
        favoriteCount: existingListing ? Number(existingListing.favoriteCount || 0) : 0,
        storeSlug: activeStore ? activeStore.slug : '',
        storeName: activeStore ? activeStore.name : '',
        storePackageId: activeStore ? activeStore.packageId : '',
        createdAt: existingListing ? (existingListing.createdAt || new Date().toISOString()) : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        if (window.JETLE_API && typeof window.JETLE_API.whenReady === 'function') {
          await window.JETLE_API.whenReady();
        }

        if (existingListing) {
          if (!window.JETLE_API || typeof window.JETLE_API.updateListing !== 'function') {
            throw new Error('İlan güncelleme API işlemi kullanılamıyor.');
          }
          await window.JETLE_API.updateListing(existingListing.id, nextListing);
        } else {
          if (!window.JETLE_API || typeof window.JETLE_API.createListing !== 'function') {
            throw new Error('İlan oluşturma API işlemi kullanılamıyor.');
          }
          await window.JETLE_API.createListing(nextListing);
        }

        if (window.JETLE_API && typeof window.JETLE_API.refreshCollection === 'function') {
          await window.JETLE_API.refreshCollection('listings');
        }

        JETLE.showToast(existingListing ? 'İlan güncellendi ve tekrar moderasyona gönderildi.' : 'İlanınız incelemeye gönderildi.');
        setTimeout(function () { window.location.href = 'dashboard.html'; }, 450);
      } catch (error) {
        console.error('[JETLE][listing-form][submit]', error);
        JETLE.showToast('İlan kaydedilemedi. Lütfen tekrar deneyin.');
      }
    });

      if (categorySelect) {
        categorySelect.addEventListener('change', renderDynamicFields);
      }

      renderDynamicFields();
      if (existingListing) {
        populateFormFromListing(existingListing);
      }
    }

  function ensureConversation(listing, initialMessage) {
      const user = requireAuth();
      if (!user) return null;
      if (listing.ownerId === user.id) {
        JETLE.showToast('Kendi ilanınız için mesaj başlatamazsınız.');
        return null;
    }

    const conversations = JETLE.getConversations();
    let conversation = conversations.find(function (item) {
      return item.listingId === listing.id && item.participants.includes(user.id) && item.participants.includes(listing.ownerId);
    });

    if (!conversation) {
      conversation = {
        id: 'c' + Date.now(),
        listingId: listing.id,
        listingTitle: listing.title,
        participants: [user.id, listing.ownerId],
        participantNames: {},
        updatedAt: new Date().toISOString()
      };
        conversation.participantNames[user.id] = user.name;
        conversation.participantNames[listing.ownerId] = listing.ownerName;
        conversations.unshift(conversation);
        JETLE.saveConversations(conversations);
      }

      const messages = JETLE.getMessagesMap();
      const conversationMessages = messages[conversation.id] || [];

      if (initialMessage) {
        conversationMessages.push({
          id: 'm' + Date.now(),
          senderId: user.id,
          text: initialMessage,
          createdAt: new Date().toISOString()
        });
        if (typeof JETLE.addNotification === 'function') {
          JETLE.addNotification(listing.ownerId, {
            type: 'message',
            title: 'Yeni mesaj aldınız',
            text: '"' + listing.title + '" ilanınız için yeni bir mesaj aldınız.',
            conversationId: conversation.id,
            listingId: listing.id,
            href: 'mesajlar.html?conversation=' + encodeURIComponent(conversation.id)
          });
          if (typeof JETLE.getTrackedListingFollowers === 'function') {
            JETLE.getTrackedListingFollowers(listing.id).forEach(function (followerId) {
              if (followerId === user.id || followerId === listing.ownerId) return;
              JETLE.addNotification(followerId, {
                type: 'listing-follow-message',
                title: 'Takip ettiğiniz ilana yeni mesaj geldi',
                text: '"' + listing.title + '" ilanında yeni mesaj hareketi var.',
                conversationId: conversation.id,
                listingId: listing.id,
                href: 'mesajlar.html?conversation=' + encodeURIComponent(conversation.id)
              });
            });
          }
        }
      } else if (!conversationMessages.length) {
        conversationMessages.push({
          id: 'm' + Date.now(),
          senderId: user.id,
          text: 'Merhaba, ilanınızla ilgileniyorum.',
          createdAt: new Date().toISOString()
        });
        if (typeof JETLE.addNotification === 'function') {
          JETLE.addNotification(listing.ownerId, {
            type: 'message',
            title: 'Yeni mesaj aldınız',
            text: '"' + listing.title + '" ilanınız için yeni bir mesaj aldınız.',
            conversationId: conversation.id,
            listingId: listing.id,
            href: 'mesajlar.html?conversation=' + encodeURIComponent(conversation.id)
          });
          if (typeof JETLE.getTrackedListingFollowers === 'function') {
            JETLE.getTrackedListingFollowers(listing.id).forEach(function (followerId) {
              if (followerId === user.id || followerId === listing.ownerId) return;
              JETLE.addNotification(followerId, {
                type: 'listing-follow-message',
                title: 'Takip ettiğiniz ilana yeni mesaj geldi',
                text: '"' + listing.title + '" ilanında yeni mesaj hareketi var.',
                conversationId: conversation.id,
                listingId: listing.id,
                href: 'mesajlar.html?conversation=' + encodeURIComponent(conversation.id)
              });
            });
          }
        }
      }

      messages[conversation.id] = conversationMessages;
      JETLE.saveMessagesMap(messages);

      JETLE.saveConversations(JETLE.getConversations().map(function (item) {
        if (item.id === conversation.id) item.updatedAt = new Date().toISOString();
        return item;
      }));

      return conversation;
    }

  function renderListingDetailPage() {
    const container = document.getElementById('detailContainer');
    if (!container) return;

    ensureListingSlugs();
    const listingId = JETLE.getQueryParam('id');
    const listingSlug = JETLE.getQueryParam('slug');
    const listing = JETLE.getListings().find(function (item) {
      return item.id === listingId || getListingSlug(item) === listingSlug;
    });
    const user = JETLE.getCurrentUser();

    if (!listing) {
      container.innerHTML = '<div class="empty-state"><h3>İlan bulunamadı</h3><p>İlgili ilan yayından kaldırılmış olabilir.</p></div>';
      return;
    }

      const metaTitle = listing.title + ' - ' + (getListingModerationStatus(listing) === 'yayında' ? 'Güvenilir İlan' : getModerationStatusLabel(getListingModerationStatus(listing))) + ' | JETLE';
      const metaDescription = (
        (listing.title || 'İlan') + '. ' +
        JETLE.formatCurrency(listing.price) + ' fiyatla ' +
        (listing.location || 'Türkiye genelinde') + ' konumunda yayında. ' +
        ((listing.description || (listing.category + ' kategorisinde yayınlanan ilan')).trim())
      ).slice(0, 155);
      document.title = metaTitle;
      upsertMetaTag('description', metaDescription);
      upsertMetaTag('og:title', metaTitle, 'property');
      upsertMetaTag('og:description', metaDescription, 'property');
      upsertMetaTag('og:type', 'article', 'property');

      const ownListing = user && user.id === listing.ownerId;
      const socialProof = getListingSocialProof(listing);
      const momentum = getListingMomentum(listing);
      const galleryItems = (listing.images && listing.images.length ? listing.images.map(function (image, index) {
        return { type: 'image', src: image, key: 'img-' + index };
      }) : (listing.image ? [{ type: 'image', src: listing.image, key: 'img-0' }] : []));
    if (listing.video) {
      galleryItems.push({ type: 'video', src: listing.video, key: 'video-0' });
    }
      const featured = galleryItems[0];
      JETLE.recordViewedListing(listing);
      const detailInlineAd = JETLE.getSmartAd('detail-inline', { category: listing.categoryGroup || listing.category });
      const detailSideAd = JETLE.getSmartAd('detail-side', { category: listing.categoryGroup || listing.category });
      if (detailInlineAd && detailInlineAd.id) JETLE.trackAdImpression(detailInlineAd.id);
      if (detailSideAd && detailSideAd.id) JETLE.trackAdImpression(detailSideAd.id);
      const isEstate = getCategoryGroup(listing.category) === 'Gayrimenkul';
      const similarListings = JETLE.getListings().filter(function (item) {
        return item.id !== listing.id && (item.category === listing.category || item.categoryGroup === listing.categoryGroup);
      }).slice(0, isEstate ? 4 : 6);
      const seller = getOwnerProfile(listing);
      const sellerStore = getListingStore(seller, listing);
      const sellerStoreListings = JETLE.getListings().filter(function (item) { return item.ownerId === seller.id; });
      const sellerStats = getSellerProfileMeta(seller, sellerStore, sellerStoreListings);
      const sellerProfileUrl = seller.username ? getProfileUrl(seller) : '';
      const sellerPrimaryUrl = getSellerPrimaryUrl(seller, sellerStore);
      const sellerBadges = getSellerBadgesMarkup(seller, sellerStore);
      const maskedPhone = seller.phone || listing.ownerPhone || '05xx xxx xx xx';
      const sellerPhoneLabel = maskedPhone.replace(/\d(?=\d{2})/g, 'x');
      const locationLabel = listing.location || 'Konum bilgisi girilmedi';
      const detailBrand = getListingDetailValue(listing, 'brand');
      const detailModel = getListingDetailValue(listing, 'model');
      const breadcrumbCategory = getCategoryGroup(listing.category) === 'Araçlar' ? 'Araçlar' : listing.category;
      const attentionBadges = getAttentionBadgeMarkup(listing);
      const estateTopSummary = isEstate ? '' +
        '<section class="panel detail-estate-hero">' +
          '<div class="detail-estate-hero-copy">' +
            '<div class="listing-badges detail-badges">' +
              (listing.premium ? '<span class="badge badge-premium">ÖNE ÇIKAN</span>' : '') +
              attentionBadges +
              getVerificationBadgeMarkup(listing.verification) +
            '</div>' +
            '<h1 class="detail-title">' + JETLE.escapeHtml(listing.title) + '</h1>' +
            '<div class="detail-price detail-estate-price">' + JETLE.formatCurrency(listing.price) + '</div>' +
            '<div class="detail-submeta detail-estate-submeta"><span>İlan No: ' + JETLE.escapeHtml(listing.listingNumber || '-') + '</span><span>' + JETLE.escapeHtml(locationLabel) + '</span><span>' + JETLE.formatDate(listing.createdAt) + '</span></div>' +
          '</div>' +
        '</section>'
        : '';
      container.innerHTML = '' +
        '<nav class="detail-breadcrumb" aria-label="Breadcrumb">' +
          '<a href="index.html">Ana Sayfa</a>' +
          '<span>></span>' +
          '<span>' + JETLE.escapeHtml(breadcrumbCategory) + '</span>' +
          (detailBrand ? '<span>></span><span>' + JETLE.escapeHtml(detailBrand) + '</span>' : '') +
          (detailModel ? '<span>></span><span>' + JETLE.escapeHtml(detailModel) + '</span>' : '') +
        '</nav>' +
        '<div class="detail-layout">' +
          '<section class="detail-main panel detail-panel">' +
            estateTopSummary +
            '<div class="detail-main-media-wrap">' +
              (featured && featured.type === 'video'
                ? '<video class="detail-main-image" id="detailMainMedia" src="' + featured.src + '" controls preload="metadata"></video>'
                : '<img class="detail-main-image" id="detailMainMedia" src="' + (featured ? featured.src : listing.image) + '" alt="' + JETLE.escapeHtml(listing.title) + '" />') +
            '</div>' +
            '<div class="detail-gallery-thumbs">' +
              galleryItems.map(function (item, index) {
                return '<button type="button" class="detail-thumb ' + (index === 0 ? 'active' : '') + '" data-media-type="' + item.type + '" data-media-src="' + item.src + '">' +
                  (item.type === 'video'
                  ? '<video src="' + item.src + '" muted preload="metadata"></video>'
                  : '<img src="' + item.src + '" alt="Galeri öğesi" />') +
                '</button>';
              }).join('') +
            '</div>' +
            '<section class="panel detail-specs-panel">' +
              '<div class="panel-head compact"><h2>' + (isEstate ? 'Emlak Özellikleri' : 'Araç Özellikleri') + '</h2></div>' +
              getDetailSpecsMarkup(listing) +
            '</section>' +
            '<section class="detail-description panel detail-description-panel">' +
              '<h2>İlan Açıklaması</h2>' +
              '<p>' + JETLE.escapeHtml(listing.description).replace(/\n/g, '<br />') + '</p>' +
            '</section>' +
            (getCategoryGroup(listing.category) === 'Araçlar' ? getVehicleEquipmentMarkup(listing) : '') +
            '<section class="panel detail-location-panel">' +
              '<div class="panel-head compact"><h2>Konum</h2></div>' +
              '<div class="detail-location-box">' +
                '<div class="detail-location-copy"><strong>' + JETLE.escapeHtml(locationLabel) + '</strong><span>' + (isEstate ? 'Yaşam alanını keşfetmek için konumu inceleyin' : 'İlan sahibinin belirttiği bölge bilgisi') + '</span></div>' +
                '<div class="detail-map-placeholder">' + (isEstate ? 'Harita alanı burada gösterilecek' : 'Harita Alanı') + '</div>' +
              '</div>' +
            '</section>' +
            (similarListings.length ? '<section class="panel detail-similar-panel"><div class="panel-head compact"><h2>Benzer İlanlar</h2></div><div class="detail-similar-grid" id="similarListingsGrid">' + similarListings.map(buildListingCard).join('') + '</div></section>' : '') +
            '<div class="detail-description">' +
              '<div class="detail-inline-ad">' +
                '<a href="' + JETLE.escapeHtml((detailInlineAd && detailInlineAd.ctaUrl) || 'reklam-ver.html') + '" class="sponsored-banner sponsored-banner-inline" data-ad-click-id="' + JETLE.escapeHtml((detailInlineAd && detailInlineAd.id) || '') + '">' +
                  '<span class="sponsored-tag">Sponsorlu</span>' +
                '<div class="sponsored-banner-copy"><strong>' + JETLE.escapeHtml((detailInlineAd && detailInlineAd.title) || 'Anasayfa ve kategori vitriniyle daha fazla görünürlük') + '</strong><span>' + JETLE.escapeHtml((detailInlineAd && detailInlineAd.description) || 'İlanınızı öne çıkarmak için premium çözümleri şimdi inceleyin') + '</span></div>' +
                '<span class="sponsored-banner-cta">' + JETLE.escapeHtml((detailInlineAd && detailInlineAd.ctaText) || 'Dopingleri Gör') + '</span>' +
              '</a>' +
              '</div>' +
            '</div>' +
          '</section>' +
            '<aside class="detail-side">' +
              '<section class="panel detail-summary detail-summary-main">' +
              '<div class="listing-badges detail-badges">' +
                (listing.premium ? '<span class="badge badge-premium">ÖNE ÇIKAN</span>' : '') +
                attentionBadges +
                getVerificationBadgeMarkup(listing.verification) +
              '</div>' +
              '<div class="detail-top-meta">' +
                '<span>İlan No: ' + JETLE.escapeHtml(listing.listingNumber || '-') + '</span>' +
                '<span>Son güncelleme: ' + getRelativeUpdateText(listing) + '</span>' +
              '</div>' +
              (isEstate ? '<h2 class="detail-side-title">Satıcı ve İletişim</h2>' : '<h1 class="detail-title">' + JETLE.escapeHtml(listing.title) + '</h1><div class="detail-price">' + JETLE.formatCurrency(listing.price) + '</div><div class="detail-submeta"><span>' + JETLE.escapeHtml(listing.listingNumber || '-') + '</span><span>' + JETLE.escapeHtml(listing.location) + '</span><span>' + JETLE.formatDate(listing.createdAt) + '</span></div>') +
            '<div class="detail-social-proof">' +
              '<strong>Bu ilanı ' + socialProof.views + ' kişi görüntüledi</strong>' +
              '<span>Son 24 saatte ' + momentum.todayViews + ' kişi baktı</span>' +
              '<span>' + socialProof.favorites + ' kişi favorilere ekledi</span>' +
            '</div>' +
            '<div class="detail-urgency-badge">' +
              '<strong>Bu ilan çok popüler!</strong>' +
              '<span>Son 3 kişi bu ilanı inceledi</span>' +
            '</div>' +
            '<div class="detail-actions">' +
              (ownListing ? '<button type="button" class="btn btn-danger" data-delete-id="' + listing.id + '">İlanı Sil</button>' : '<button type="button" class="btn btn-light" id="startConversationBtn">Mesaj Gönder</button>') +
              '<button type="button" class="btn btn-primary" data-favorite-id="' + listing.id + '">' + (isFavorite(listing.id) ? 'Favoriden Çıkar' : 'Favorilere Ekle') + '</button>' +
              (getComparableGroup(listing) ? '<button type="button" class="btn btn-light" data-compare-id="' + listing.id + '">' + (isComparedListing(listing.id) ? 'Karşılaştırmada' : 'Karşılaştır') + '</button>' : '') +
              (!ownListing ? '<button type="button" class="btn btn-light" data-follow-listing-id="' + listing.id + '">' + (isListingFollowed(listing.id) ? 'Takibi Bırak' : 'Takip Et') + '</button>' : '') +
              '<a href="doping.html?listingId=' + listing.id + '" class="btn btn-primary btn-boost">Öne Çıkar</a>' +
            '</div>' +
              '<div class="detail-meta-grid detail-summary-grid">' +
                '<div class="detail-meta-item"><strong>İlan Numarası</strong><span>' + JETLE.escapeHtml(listing.listingNumber || '-') + '</span></div>' +
                '<div class="detail-meta-item"><strong>Kategori</strong><span>' + JETLE.escapeHtml(listing.category) + '</span></div>' +
                '<div class="detail-meta-item"><strong>Durum</strong><span>' + getModerationStatusLabel(getListingModerationStatus(listing)) + '</span></div>' +
                '<div class="detail-meta-item"><strong>Premium</strong><span>' + (listing.premium ? 'Aktif' : 'Standart') + '</span></div>' +
                '<div class="detail-meta-item"><strong>Favori Sayısı</strong><span>' + socialProof.favorites + '</span></div>' +
              '</div>' +
              '</section>' +
              '<section class="panel detail-seller-panel">' +
                '<div class="panel-head compact"><h2>Satıcı Bilgileri</h2></div>' +
                '<div class="detail-seller-hero-card">' +
                  '<div class="detail-store-logo">' + ((sellerStore && sellerStore.logo) ? '<img src="' + JETLE.escapeHtml(sellerStore.logo) + '" alt="' + JETLE.escapeHtml(sellerStore.name || listing.ownerName || 'Satici') + '" />' : (seller.avatar ? '<img src="' + JETLE.escapeHtml(seller.avatar) + '" alt="' + JETLE.escapeHtml(seller.name || listing.ownerName || 'Satici') + '" />' : '<span>' + JETLE.escapeHtml(String(((sellerStore && sellerStore.name) || seller.name || listing.ownerName || 'S').charAt(0)).toUpperCase()) + '</span>')) + '</div>' +
                  '<div class="detail-store-copy">' +
                    '<strong>' + JETLE.escapeHtml((sellerStore && sellerStore.name) || seller.name || listing.ownerName || 'Satici Profili') + '</strong>' +
                    '<span>' + sellerStats.publishedCount + ' yayindaki ilan • ' + sellerStats.totals.views + ' goruntulenme</span>' +
                    (sellerBadges ? '<div class="detail-seller-badges">' + sellerBadges + '</div>' : '') +
                  '</div>' +
                '</div>' +
                '<div class="detail-seller-row"><strong>Kullanıcı</strong><span>' + (sellerProfileUrl ? '<a href="' + sellerProfileUrl + '" class="detail-seller-link">' + JETLE.escapeHtml(listing.ownerName) + '</a>' : JETLE.escapeHtml(listing.ownerName)) + '</span></div>' +
                '<div class="detail-seller-row"><strong>Telefon</strong><span id="sellerPhoneValue">' + JETLE.escapeHtml(sellerPhoneLabel) + '</span></div>' +
                '<div class="detail-seller-row"><strong>Toplam ilan</strong><span>' + sellerStats.listingCount + '</span></div>' +
                '<div class="detail-seller-row"><strong>Favori sayisi</strong><span>' + sellerStats.totals.favorites + '</span></div>' +
                '<div class="detail-seller-row"><strong>Son aktif</strong><span>' + JETLE.formatDate(sellerStats.lastActive) + '</span></div>' +
                (sellerStore ? '<div class="detail-seller-row"><strong>Mağaza</strong><span>' + JETLE.escapeHtml(sellerStore.name || '-') + '</span></div>' : '') +
                (sellerBadges && !sellerStore ? '<div class="detail-seller-badges">' + sellerBadges + '</div>' : '') +
                '<div class="detail-seller-actions">' +
                  (!ownListing ? '<button type="button" class="btn btn-light" id="startConversationBtnAside">Mesaj Gonder</button>' : '') +
                  '<button type="button" class="btn btn-primary" data-favorite-id="' + listing.id + '">' + (isFavorite(listing.id) ? 'Favoriden Çıkar' : 'Favorilere Ekle') + '</button>' +
                  (getComparableGroup(listing) ? '<button type="button" class="btn btn-light" data-compare-id="' + listing.id + '">' + (isComparedListing(listing.id) ? 'Karşılaştırmada' : 'Karşılaştır') + '</button>' : '') +
                  (!ownListing ? '<button type="button" class="btn btn-light" data-follow-listing-id="' + listing.id + '">' + (isListingFollowed(listing.id) ? 'Takibi Bırak' : 'Takip Et') + '</button>' : '') +
                  '<button type="button" class="btn btn-light full-width" id="showSellerPhoneBtn" data-phone="' + JETLE.escapeHtml(maskedPhone) + '">Telefonu Goster</button>' +
                '</div>' +
                buildSellerContactActions(seller, sellerStore, sellerStats, listing, { mode: 'detail' }) +
                '<a href="' + sellerPrimaryUrl + '" class="btn btn-light full-width detail-store-link">Profili Gor</a>' +
                (sellerStore ? '<a href="' + getStoreUrl(sellerStore) + '" class="btn btn-light full-width detail-store-link">Mağazaya Git</a>' : '') +
                (!ownListing ? '<form class="detail-message-form hidden" id="detailMessageForm"><textarea id="detailMessageInput" rows="4" placeholder="Satıcıya mesajınızı yazın"></textarea><button type="submit" class="btn btn-primary full-width">Gönder</button></form>' : '') +
                '<div class="detail-social-proof detail-social-proof-side">' +
                  '<strong>Bu ilanı ' + socialProof.views + ' kişi görüntüledi</strong>' +
                  '<span>Son 24 saatte ' + momentum.todayViews + ' kişi baktı</span>' +
                  '<span>' + socialProof.favorites + ' kişi favorilere ekledi</span>' +
                '</div>' +
              '</section>' +
              '<section class="panel detail-trust-panel">' +
                '<div class="panel-head compact"><h2>Güvenli Alışveriş</h2></div>' +
                '<ul class="detail-trust-list">' +
                  '<li>Güvenli alışveriş için site dışına çıkmayın</li>' +
                  '<li>Ödemeleri sistem üzerinden yapın</li>' +
                '</ul>' +
                (!ownListing ? '<button type="button" class="detail-report-trigger" id="openListingReportModal">İlanı Şikayet Et</button>' : '') +
              '</section>' +
              '<section class="detail-side-ad panel">' +
              '<span class="sponsored-tag">Sponsorlu</span>' +
              '<div class="detail-side-ad-box">' +
                ((detailSideAd && detailSideAd.image) ? '<a href="' + JETLE.escapeHtml(detailSideAd.ctaUrl || 'reklam-ver.html') + '" class="detail-side-ad-media" data-ad-click-id="' + JETLE.escapeHtml((detailSideAd && detailSideAd.id) || '') + '"><img src="' + JETLE.escapeHtml(detailSideAd.image) + '" alt="' + JETLE.escapeHtml(detailSideAd.title || 'Sponsorlu reklam') + '" /></a>' : '') +
                '<strong>' + JETLE.escapeHtml((detailSideAd && detailSideAd.title) || 'Kurumsal reklam alanı') + '</strong>' +
                '<p>' + JETLE.escapeHtml((detailSideAd && detailSideAd.description) || 'Bu alan marka iş birlikleri ve premium vitrinde öne çıkan kampanyalar için ayrılmıştır.') + '</p>' +
                '<a href="' + JETLE.escapeHtml((detailSideAd && detailSideAd.ctaUrl) || 'reklam-ver.html') + '" class="btn btn-light" data-ad-click-id="' + JETLE.escapeHtml((detailSideAd && detailSideAd.id) || '') + '">' + JETLE.escapeHtml((detailSideAd && detailSideAd.ctaText) || 'Reklam paketleri') + '</a>' +
              '</div>' +
              '</section>' +
              (!ownListing ? '<div class="listing-report-modal hidden" id="listingReportModal"><div class="listing-report-backdrop" data-report-close="true"></div><div class="listing-report-dialog panel"><div class="listing-report-head"><div><h2>İlanı Şikayet Et</h2><p>Şikayetinizi moderasyon ekibine iletelim.</p></div><button type="button" class="listing-report-close" data-report-close="true" aria-label="Şikayet penceresini kapat">×</button></div><form id="listingReportForm" class="listing-report-form"><div class="form-group"><label for="listingReportReason">Şikayet Nedeni</label><select id="listingReportReason" required>' + getListingReportReasonOptions().map(function (item) { return '<option value="' + item.value + '">' + item.label + '</option>'; }).join('') + '</select></div><div class="form-group"><label for="listingReportNote">Açıklama</label><textarea id="listingReportNote" rows="5" placeholder="Kısa bir açıklama yazabilirsiniz."></textarea></div><div class="listing-report-actions"><button type="button" class="btn btn-light" data-report-close="true">Vazgeç</button><button type="submit" class="btn btn-primary">Şikayeti Gönder</button></div></form></div></div>' : '') +
            '</aside>' +
          '</div>';

      bindListingActions(container);
      const similarGrid = document.getElementById('similarListingsGrid');
      if (similarGrid) bindListingActions(similarGrid);

    const thumbContainer = container.querySelector('.detail-gallery-thumbs');
    if (thumbContainer) {
      thumbContainer.addEventListener('click', function (event) {
        const button = event.target.closest('.detail-thumb');
        if (!button) return;
        const mediaType = button.dataset.mediaType;
        const mediaSrc = button.dataset.mediaSrc;
        const current = document.getElementById('detailMainMedia');
        const replacement = mediaType === 'video'
          ? '<video class="detail-main-image" id="detailMainMedia" src="' + mediaSrc + '" controls preload="metadata"></video>'
          : '<img class="detail-main-image" id="detailMainMedia" src="' + mediaSrc + '" alt="' + JETLE.escapeHtml(listing.title) + '" />';
        current.outerHTML = replacement;
        thumbContainer.querySelectorAll('.detail-thumb').forEach(function (thumb) {
          thumb.classList.toggle('active', thumb === button);
        });
      });
    }

      ['startConversationBtn', 'startConversationBtnAside'].forEach(function (buttonId) {
        const startConversationBtn = document.getElementById(buttonId);
        if (!startConversationBtn) return;
        startConversationBtn.addEventListener('click', function () {
          const messageForm = document.getElementById('detailMessageForm');
          const messageInput = document.getElementById('detailMessageInput');
          if (messageForm) {
            messageForm.classList.remove('hidden');
            if (messageInput) messageInput.focus();
            return;
          }
          const conversation = ensureConversation(listing);
          if (conversation) window.location.href = 'mesajlar.html?conversation=' + conversation.id;
        });
      });

      const detailMessageForm = document.getElementById('detailMessageForm');
      const detailMessageInput = document.getElementById('detailMessageInput');
      if (detailMessageForm && detailMessageInput) {
        detailMessageForm.addEventListener('submit', function (event) {
          event.preventDefault();
          const text = detailMessageInput.value.trim();
          if (!text) {
            JETLE.showToast('Lütfen mesajınızı yazın.');
            return;
          }
          const conversation = ensureConversation(listing, text);
          if (conversation) {
            JETLE.showToast('Mesajınız gönderildi.');
            window.location.href = 'mesajlar.html?conversation=' + conversation.id;
          }
        });
      }

      const listingReportModal = document.getElementById('listingReportModal');
      const openListingReportModalBtn = document.getElementById('openListingReportModal');
      const listingReportForm = document.getElementById('listingReportForm');
      const listingReportReason = document.getElementById('listingReportReason');
      const listingReportNote = document.getElementById('listingReportNote');

      function closeListingReportModal() {
        if (!listingReportModal) return;
        listingReportModal.classList.add('hidden');
      }

      function openListingReportModal() {
        if (!listingReportModal) return;
        const user = requireAuth();
        if (!user) return;
        listingReportModal.classList.remove('hidden');
        if (listingReportReason) listingReportReason.focus();
      }

      if (openListingReportModalBtn) {
        openListingReportModalBtn.addEventListener('click', openListingReportModal);
      }

      if (listingReportModal) {
        listingReportModal.addEventListener('click', function (event) {
          if (event.target.closest('[data-report-close="true"]')) {
            closeListingReportModal();
          }
        });
      }

      if (listingReportForm) {
        listingReportForm.addEventListener('submit', function (event) {
          event.preventDefault();
          const user = requireAuth();
          if (!user) return;

          const reports = JETLE.getReports ? JETLE.getReports() : [];
          const selectedReason = listingReportReason ? String(listingReportReason.value || '').trim() : '';
          const note = listingReportNote ? String(listingReportNote.value || '').trim() : '';

          reports.unshift({
            id: 'report-' + Date.now(),
            listingId: listing.id,
            listingTitle: listing.title,
            listingCategory: listing.category,
            ownerId: listing.ownerId,
            reporterId: user.id,
            reporterName: user.name,
            reporterEmail: user.email || '',
            reason: selectedReason,
            reasonLabel: getListingReportReasonLabel(selectedReason),
            note: note,
            status: 'beklemede',
            createdAt: new Date().toISOString()
          });

          if (JETLE.saveReports) {
            JETLE.saveReports(reports);
          }

          listingReportForm.reset();
          closeListingReportModal();
          JETLE.showToast('Şikayetiniz alındı. Moderasyon ekibi inceleyecek.');
        });
      }

        const showSellerPhoneBtn = document.getElementById('showSellerPhoneBtn');
        const sellerPhoneValue = document.getElementById('sellerPhoneValue');
      if (showSellerPhoneBtn && sellerPhoneValue) {
        showSellerPhoneBtn.addEventListener('click', function () {
          sellerPhoneValue.textContent = showSellerPhoneBtn.dataset.phone || maskedPhone;
          showSellerPhoneBtn.textContent = 'Telefon Goruntulendi';
          showSellerPhoneBtn.disabled = true;
        });
      }

      bindSellerActions(container, seller, sellerStore, listing);
    }

  function getFavoriteListingCard(listing, options) {
    const image = (listing.images && listing.images[0]) || listing.image || '';
    const location = listing.location || 'Konum belirtilmedi';
    const socialProof = getListingSocialProof(listing);
    const settings = options || {};
    return '' +
      '<article class="favorite-listing-card panel" data-listing-id="' + listing.id + '">' +
        '<a href="' + getDetailUrl(listing) + '" class="favorite-listing-media">' +
          (image
            ? '<img src="' + JETLE.escapeHtml(image) + '" alt="' + JETLE.escapeHtml(listing.title) + '" />'
            : '<div class="favorite-listing-placeholder"><strong>JETLE</strong><span>Favori ilan</span></div>') +
        '</a>' +
        '<div class="favorite-listing-content">' +
          '<div class="favorite-listing-head">' +
            '<div class="favorite-listing-price">' + JETLE.formatCurrency(listing.price || 0) + '</div>' +
          '</div>' +
          '<h3 class="favorite-listing-title"><a href="' + getDetailUrl(listing) + '">' + JETLE.escapeHtml(listing.title) + '</a></h3>' +
          '<div class="favorite-listing-location">' + JETLE.escapeHtml(location) + '</div>' +
          '<div class="favorite-listing-meta">' +
            '<span>' + JETLE.escapeHtml(listing.category || 'Kategori') + '</span>' +
            '<span>' + JETLE.formatDate(listing.createdAt) + '</span>' +
            '<span>' + socialProof.favorites + ' favori</span>' +
            (settings.extraMetaHtml || '') +
          '</div>' +
          '<div class="favorite-listing-actions">' +
            '<a href="' + getDetailUrl(listing) + '" class="btn btn-primary btn-small">İlana Git</a>' +
            (settings.showRemove === false ? '' : '<button type="button" class="btn btn-light btn-small" data-favorite-id="' + listing.id + '">Favoriden Kaldır</button>') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderDashboardFavorites(targetId, listings) {
    const container = document.getElementById(targetId);
    if (!container) return;

    if (!listings.length) {
      container.innerHTML = '<div class="empty-state"><h3>Favori ilanınız bulunmuyor</h3><p>İlgilendiğiniz ilanları kalp ikonuyla kaydedebilir, burada tekrar hızlıca ulaşabilirsiniz.</p></div>';
      return;
    }

    container.innerHTML = listings.map(getFavoriteListingCard).join('');
    bindListingActions(container);
  }

  function renderDashboardRecentListings(targetId) {
    const container = document.getElementById(targetId);
    if (!container || typeof JETLE.getRecentViews !== 'function') return;

    const recentViews = JETLE.getRecentViews();
    const listingsMap = {};
    JETLE.getListings().filter(isListingPublished).forEach(function (listing) {
      listingsMap[listing.id] = listing;
    });

    const recentListings = recentViews.map(function (item) {
      const listing = listingsMap[item.id];
      if (!listing) return null;
      return Object.assign({}, listing, { viewedAt: item.viewedAt });
    }).filter(Boolean).slice(0, 6);

    if (!recentListings.length) {
      container.innerHTML = '<div class="empty-state"><h3>Henüz baktığınız ilan yok</h3><p>İlan detaylarına girdikçe son görüntüledikleriniz burada birikir ve kolayca geri dönebilirsiniz.</p></div>';
      return;
    }

    container.innerHTML = recentListings.map(function (listing) {
      return getFavoriteListingCard(listing, {
        showRemove: false,
        extraMetaHtml: '<span>Son görüntüleme: ' + JETLE.formatDate(listing.viewedAt || listing.createdAt) + '</span>'
      });
    }).join('');
    bindListingActions(container);
  }

  function renderComparePage() {
    const wrap = document.getElementById('comparePageContent');
    if (!wrap) return;

    const selectedIds = getCompareSelection();
    const listings = JETLE.getListings().filter(function (item) {
      return selectedIds.includes(item.id);
    }).sort(function (a, b) {
      return selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id);
    });

    if (!listings.length) {
      wrap.innerHTML = '<div class="empty-state"><h3>Karşılaştırma listeniz boş</h3><p>İlan kartlarındaki veya detay sayfasındaki Karşılaştır butonuyla en fazla 3 ilan seçebilirsiniz.</p></div>';
      return;
    }

    const comparableGroup = getComparableGroup(listings[0]);
    const fieldConfig = comparableGroup === 'Araçlar'
      ? [
          { key: 'price', label: 'Fiyat', getter: function (item) { return JETLE.formatCurrency(item.price || 0); } },
          { key: 'brand', label: 'Marka', getter: function (item) { return getListingDetailValue(item, 'brand') || '-'; } },
          { key: 'model', label: 'Model', getter: function (item) { return getListingDetailValue(item, 'model') || '-'; } },
          { key: 'year', label: 'Yıl', getter: function (item) { return getListingDetailValue(item, 'year') || '-'; } },
          { key: 'km', label: 'KM', getter: function (item) { var km = getListingNumericDetail(item, 'km'); return km ? JETLE.formatNumber(km) + ' km' : '-'; } },
          { key: 'fuel', label: 'Yakıt', getter: function (item) { return getListingDetailValue(item, 'fuel') || '-'; } },
          { key: 'transmission', label: 'Vites', getter: function (item) { return getListingDetailValue(item, 'transmission') || '-'; } },
          { key: 'bodyType', label: 'Kasa Tipi', getter: function (item) { return getListingDetailValue(item, 'bodyType') || '-'; } },
          { key: 'color', label: 'Renk', getter: function (item) { return getListingDetailValue(item, 'color') || '-'; } },
          { key: 'location', label: 'Konum', getter: function (item) { return item.location || '-'; } }
        ]
      : [
          { key: 'price', label: 'Fiyat', getter: function (item) { return JETLE.formatCurrency(item.price || 0); } },
          { key: 'm2', label: 'm²', getter: function (item) { return getListingDetailValue(item, 'm2') || '-'; } },
          { key: 'roomCount', label: 'Oda Sayısı', getter: function (item) { return getListingDetailValue(item, 'roomCount') || '-'; } },
          { key: 'buildingAge', label: 'Bina Yaşı', getter: function (item) { return getListingDetailValue(item, 'buildingAge') || '-'; } },
          { key: 'floor', label: 'Kat', getter: function (item) { return getListingDetailValue(item, 'floor') || '-'; } },
          { key: 'heating', label: 'Isıtma', getter: function (item) { return getListingDetailValue(item, 'heating') || '-'; } },
          { key: 'location', label: 'Konum', getter: function (item) { return item.location || '-'; } }
        ];

    const headCells = listings.map(function (listing) {
      const image = (listing.images && listing.images[0]) || listing.image || 'https://placehold.co/800x600?text=JETLE';
      return '' +
        '<th class="compare-column-head">' +
          '<div class="compare-card-head">' +
            '<img src="' + JETLE.escapeHtml(image) + '" alt="' + JETLE.escapeHtml(listing.title) + '" />' +
            '<strong>' + JETLE.escapeHtml(listing.title) + '</strong>' +
            '<span>' + JETLE.escapeHtml(listing.location || 'Konum belirtilmedi') + '</span>' +
            '<div class="compare-card-head-actions">' +
              '<a href="' + getDetailUrl(listing) + '" class="btn btn-light btn-small">İlana Git</a>' +
              '<button type="button" class="btn btn-primary btn-small" data-compare-id="' + listing.id + '">Çıkar</button>' +
            '</div>' +
          '</div>' +
        '</th>';
    }).join('');

    const rows = fieldConfig.map(function (field) {
      const values = listings.map(function (listing) { return field.getter(listing); });
      const normalized = values.map(function (value) { return String(value || '-').trim().toLowerCase(); });
      const isDifferent = normalized.some(function (value) { return value !== normalized[0]; });
      return '' +
        '<tr>' +
          '<th>' + JETLE.escapeHtml(field.label) + '</th>' +
          values.map(function (value) {
            return '<td class="' + (isDifferent ? 'compare-diff-cell' : '') + '">' + JETLE.escapeHtml(String(value || '-')) + '</td>';
          }).join('') +
        '</tr>';
    }).join('');

    wrap.innerHTML = '' +
      '<section class="panel compare-summary-panel">' +
        '<div class="compare-summary-head">' +
          '<div><h2>' + JETLE.escapeHtml(comparableGroup) + ' Karşılaştırması</h2><p>' + listings.length + ' ilan yan yana gösteriliyor. Farklı özellikler hafif vurguyla işaretlenir.</p></div>' +
          '<div class="compare-summary-actions"><a href="index.html" class="btn btn-light">Yeni İlan Ekle</a><button type="button" class="btn btn-primary" id="clearCompareBtn">Karşılaştırmayı Temizle</button></div>' +
        '</div>' +
      '</section>' +
      '<section class="panel compare-table-panel">' +
        '<div class="compare-table-wrap">' +
          '<table class="compare-table">' +
            '<thead><tr><th>Özellik</th>' + headCells + '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</section>';

    bindListingActions(wrap);
    const clearButton = document.getElementById('clearCompareBtn');
    if (clearButton) {
      clearButton.addEventListener('click', function () {
        saveCompareSelection([]);
        renderComparePage();
        JETLE.showToast('Karşılaştırma listesi temizlendi.');
      });
    }
  }

  function renderFavoritesPage() {
    const user = requireAuth();
    const grid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('favoritesEmptyState');
    if (!user || !grid || !emptyState) return;

    const favoriteIds = getUserFavorites(user.id);
    const listings = JETLE.getListings().filter(function (item) { return favoriteIds.includes(item.id); }).sort(function (a, b) {
      return favoriteIds.indexOf(a.id) - favoriteIds.indexOf(b.id);
    });
    grid.innerHTML = listings.map(getFavoriteListingCard).join('');
    emptyState.classList.toggle('hidden', listings.length > 0);
    bindListingActions(grid);
  }

  function renderMessagesPage() {
      const user = requireAuth();
      const listEl = document.getElementById('conversationList');
      const streamEl = document.getElementById('messageStream');
      const panelHead = document.getElementById('messagePanelHead');
      const listingContextEl = document.getElementById('messageListingContext');
      const form = document.getElementById('messageForm');
      const input = document.getElementById('messageInput');
      const quickRepliesEl = document.getElementById('messageQuickReplies');
      const openOfferModalBtn = document.getElementById('openOfferModalBtn');
      const offerModal = document.getElementById('messageOfferModal');
      const offerForm = document.getElementById('messageOfferForm');
      const offerAmountInput = document.getElementById('messageOfferAmount');
      const offerNoteInput = document.getElementById('messageOfferNote');
      const incomingCountEl = document.getElementById('incomingMessageCount');
      const outgoingCountEl = document.getElementById('outgoingMessageCount');
      if (!user || !listEl || !streamEl || !panelHead || !listingContextEl || !form || !input || !quickRepliesEl || !openOfferModalBtn || !offerModal || !offerForm || !offerAmountInput || !offerNoteInput) return;

    let activeId = JETLE.getQueryParam('conversation');

    function formatConversationTime(value) {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      const now = new Date();
      const sameDay = date.toDateString() === now.toDateString();
      return sameDay
        ? date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
    }

    function getConversationListing(conversation) {
      return JETLE.getListings().find(function (item) {
        return item.id === conversation.listingId;
      }) || null;
    }

    function getConversationById(conversationId) {
      return getUserConversations().find(function (item) {
        return item.id === conversationId;
      }) || null;
    }

    function getConversationParty(conversation) {
      const otherId = conversation.participants.find(function (id) { return id !== user.id; });
      const otherUser = JETLE.getUsers().find(function (item) { return item.id === otherId; }) || null;
      const store = otherUser && otherUser.store && otherUser.store.active ? otherUser.store : null;
      return {
        id: otherId,
        user: otherUser,
        store: store,
        name: (store && store.name) || (conversation.participantNames && conversation.participantNames[otherId]) || (otherUser && otherUser.name) || 'Kullanıcı',
        avatar: (store && store.logo) || (otherUser && otherUser.avatar) || '',
        initials: String((((store && store.name) || (otherUser && otherUser.name) || 'K').charAt(0) || 'K')).toUpperCase()
      };
    }

    function getMessagePreviewText(message) {
      if (!message) return 'Mesaj geçmişi burada görüntülenir.';
      if (message.type === 'offer') {
        return 'Teklif: ' + JETLE.formatCurrency(Number(message.offerAmount || 0)) + ' • ' + getOfferStatusLabel(message.offerStatus || 'bekliyor');
      }
      if (message.type === 'system') {
        return message.text || 'Sistem mesajı';
      }
      return message.text || 'Mesaj geçmişi burada görüntülenir.';
    }

    function getOfferStatusLabel(status) {
      const map = {
        bekliyor: 'Bekliyor',
        'kabul edildi': 'Kabul Edildi',
        reddedildi: 'Reddedildi'
      };
      return map[status] || 'Bekliyor';
    }

    function getOfferStatusClass(status) {
      const map = {
        bekliyor: 'pending',
        'kabul edildi': 'accepted',
        reddedildi: 'rejected'
      };
      return map[status] || 'pending';
    }

    function saveConversationMessages(conversationId, messages) {
      const messagesMap = JETLE.getMessagesMap();
      messagesMap[conversationId] = messages;
      JETLE.saveMessagesMap(messagesMap);
    }

    function bumpConversation(conversationId) {
      const nowIso = new Date().toISOString();
      const conversations = JETLE.getConversations().map(function (item) {
        if (item.id === conversationId) item.updatedAt = nowIso;
        return item;
      });
      JETLE.saveConversations(conversations);
      return conversations.find(function (item) { return item.id === conversationId; }) || null;
    }

  function notifyConversationPeer(conversation, payload) {
    if (!conversation || typeof JETLE.addNotification !== 'function') return;
    const receiverId = conversation.participants.find(function (id) { return id !== user.id; });
    if (!receiverId) return;
    JETLE.addNotification(receiverId, Object.assign({}, payload, {
      conversationId: conversation.id,
      listingId: conversation.listingId,
      href: 'mesajlar.html?conversation=' + encodeURIComponent(conversation.id)
    }));
  }

    function openOfferModal() {
      if (!activeId) {
        JETLE.showToast('Önce bir konuşma seçin.');
        return;
      }
      offerModal.classList.remove('hidden');
      setTimeout(function () {
        offerAmountInput.focus();
      }, 20);
    }

    function closeOfferModal() {
      offerModal.classList.add('hidden');
      offerForm.reset();
    }

    function getConversationUnreadCount(conversation) {
      const messages = JETLE.getMessagesMap()[conversation.id] || [];
      return messages.filter(function (message) {
        return message.senderId !== user.id && !(message.readBy || []).includes(user.id);
      }).length;
    }

    function markConversationAsRead(conversation) {
      const messagesMap = JETLE.getMessagesMap();
      const messages = messagesMap[conversation.id] || [];
      let changed = false;
      messages.forEach(function (message) {
        if (message.senderId === user.id) return;
        if (!Array.isArray(message.readBy)) message.readBy = [];
        if (!message.readBy.includes(user.id)) {
          message.readBy.push(user.id);
          changed = true;
        }
      });
      if (changed) {
        messagesMap[conversation.id] = messages;
        JETLE.saveMessagesMap(messagesMap);
      }
      return changed;
    }

    function getUserConversations() {
      return JETLE.getConversations().filter(function (item) {
        return item.participants.includes(user.id);
      }).sort(function (a, b) {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    }

    function renderConversationList() {
      const conversations = getUserConversations();
      if (!activeId && conversations[0]) activeId = conversations[0].id;
      listEl.innerHTML = conversations.length ? conversations.map(function (conversation) {
        const party = getConversationParty(conversation);
        const messages = JETLE.getMessagesMap()[conversation.id] || [];
        const lastMessage = messages[messages.length - 1];
        const unreadCount = getConversationUnreadCount(conversation);
        const listing = getConversationListing(conversation);
        return '' +
          '<button type="button" class="conversation-item ' + (conversation.id === activeId ? 'active' : '') + '" data-conversation-id="' + conversation.id + '">' +
            '<div class="conversation-avatar">' +
              (party.avatar ? '<img src="' + JETLE.escapeHtml(party.avatar) + '" alt="' + JETLE.escapeHtml(party.name) + '" />' : '<span>' + JETLE.escapeHtml(party.initials) + '</span>') +
            '</div>' +
            '<div class="conversation-copy">' +
              '<div class="conversation-topline">' +
                '<strong>' + JETLE.escapeHtml(party.name) + '</strong>' +
                '<span>' + JETLE.escapeHtml(formatConversationTime((lastMessage && lastMessage.createdAt) || conversation.updatedAt)) + '</span>' +
              '</div>' +
              '<div class="conversation-listing-title">' + JETLE.escapeHtml(conversation.listingTitle || (listing && listing.title) || 'İlan görüşmesi') + '</div>' +
              '<div class="conversation-bottomline">' +
                '<p>' + JETLE.escapeHtml(getMessagePreviewText(lastMessage)) + '</p>' +
                (unreadCount ? '<span class="conversation-unread-badge">' + unreadCount + '</span>' : '') +
              '</div>' +
            '</div>' +
          '</button>';
      }).join('') : '<div class="message-empty message-empty-rich"><strong>Henüz aktif bir görüşmeniz yok</strong><span>Bir ilana mesaj gönderdiğinizde konuşmalarınız burada düzenli şekilde listelenecek.</span></div>';
    }

      function renderActiveConversation() {
      const conversations = getUserConversations();
      const conversation = conversations.find(function (item) { return item.id === activeId; });
      if (!conversation) {
        openOfferModalBtn.disabled = true;
        quickRepliesEl.classList.add('is-disabled');
        panelHead.innerHTML = '<h2>Konuşma seçin</h2><p>Bir ilan detayından mesaj başlatabilirsiniz.</p>';
        listingContextEl.innerHTML = '<div class="message-empty message-empty-rich"><strong>İlan bağlantısı burada görünecek</strong><span>Bir konuşma seçtiğinizde ilgili ilan kartı ve hızlı erişim butonu aktif olur.</span></div>';
        streamEl.innerHTML = '<div class="message-empty message-empty-rich"><strong>Mesaj bulunmuyor</strong><span>Sol panelden bir konuşma seçerek devam edebilirsiniz.</span></div>';
        return;
      }

      if (markConversationAsRead(conversation)) {
        renderConversationList();
      }

      const party = getConversationParty(conversation);
      const listing = getConversationListing(conversation);
      const listingImage = (listing && ((listing.images && listing.images[0]) || listing.image)) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
      const listingHref = listing ? ('ilan-detay.html?id=' + listing.id) : '#';
      openOfferModalBtn.disabled = false;
      quickRepliesEl.classList.remove('is-disabled');
      panelHead.innerHTML = '' +
        '<div class="message-chat-head">' +
          '<div class="message-chat-head-main">' +
            '<div class="message-chat-avatar">' +
              (party.avatar ? '<img src="' + JETLE.escapeHtml(party.avatar) + '" alt="' + JETLE.escapeHtml(party.name) + '" />' : '<span>' + JETLE.escapeHtml(party.initials) + '</span>') +
            '</div>' +
            '<div class="message-chat-copy">' +
              '<h2>' + JETLE.escapeHtml(party.name) + '</h2>' +
              '<p>' + JETLE.escapeHtml(conversation.listingTitle || 'İlan görüşmesi') + '</p>' +
            '</div>' +
          '</div>' +
          '<span class="message-chat-status">Sohbet açık</span>' +
        '</div>';
      listingContextEl.innerHTML = '' +
        '<article class="message-listing-card">' +
          '<div class="message-listing-thumb">' +
            '<img src="' + JETLE.escapeHtml(listingImage) + '" alt="' + JETLE.escapeHtml(conversation.listingTitle || 'İlan görseli') + '" />' +
          '</div>' +
          '<div class="message-listing-copy">' +
            '<span>İlan Bağlantısı</span>' +
            '<strong>' + JETLE.escapeHtml(conversation.listingTitle || (listing && listing.title) || 'İlan') + '</strong>' +
            '<p>' + JETLE.escapeHtml((listing && listing.location) || 'Konum bilgisi yakında görüntülenecek') + '</p>' +
          '</div>' +
          '<a href="' + listingHref + '" class="btn btn-light message-listing-link">İlana Git</a>' +
        '</article>';

      const messages = JETLE.getMessagesMap()[conversation.id] || [];
      streamEl.innerHTML = messages.map(function (message) {
        const own = message.senderId === user.id;
        if (message.type === 'offer') {
          const status = message.offerStatus || 'bekliyor';
          const canRespond = !own && status === 'bekliyor';
          return '' +
            '<div class="message-row ' + (own ? 'self' : 'other') + '">' +
              '<div class="message-bubble message-offer-bubble ' + (own ? 'self' : '') + '">' +
                '<div class="message-offer-kicker">Fiyat Teklifi</div>' +
                '<strong class="message-offer-amount">' + JETLE.escapeHtml(JETLE.formatCurrency(Number(message.offerAmount || 0))) + '</strong>' +
                (message.text ? '<div class="message-offer-note">' + JETLE.escapeHtml(message.text).replace(/\n/g, '<br />') + '</div>' : '') +
                '<div class="message-offer-footer">' +
                  '<span class="message-offer-status ' + getOfferStatusClass(status) + '">' + JETLE.escapeHtml(getOfferStatusLabel(status)) + '</span>' +
                  '<span class="message-time">' + JETLE.escapeHtml(JETLE.formatDateTime(message.createdAt)) + '</span>' +
                '</div>' +
                (canRespond ? '<div class="message-offer-actions"><button type="button" class="btn btn-primary" data-offer-action="accept" data-message-id="' + message.id + '">Kabul Et</button><button type="button" class="btn btn-light" data-offer-action="reject" data-message-id="' + message.id + '">Reddet</button></div>' : '') +
              '</div>' +
            '</div>';
        }
        if (message.type === 'system') {
          return '' +
            '<div class="message-system-row">' +
              '<div class="message-system-badge">' + JETLE.escapeHtml(message.text || 'Sistem bildirimi') + '</div>' +
            '</div>';
        }
        return '' +
          '<div class="message-row ' + (own ? 'self' : 'other') + '">' +
            '<div class="message-bubble ' + (own ? 'self' : '') + '">' +
              '<div class="message-bubble-text">' + JETLE.escapeHtml(message.text).replace(/\n/g, '<br />') + '</div>' +
              '<span class="message-time">' + JETLE.escapeHtml(JETLE.formatDateTime(message.createdAt)) + '</span>' +
            '</div>' +
          '</div>';
      }).join('');
      if (!messages.length) {
        streamEl.innerHTML = '<div class="message-empty message-empty-rich"><strong>Henüz mesaj bulunmuyor</strong><span>İlk mesajı göndererek görüşmeyi başlatabilirsiniz.</span></div>';
      }
        streamEl.scrollTop = streamEl.scrollHeight;
      }

      function renderMessageSummary() {
        if (!incomingCountEl || !outgoingCountEl) return;
        const conversations = getUserConversations();
        const messagesMap = JETLE.getMessagesMap();
        let incoming = 0;
        let outgoing = 0;

        conversations.forEach(function (conversation) {
          const messages = messagesMap[conversation.id] || [];
          messages.forEach(function (message) {
            if (message.type === 'system') return;
            if (message.senderId === user.id) outgoing += 1;
            else incoming += 1;
          });
        });

        incomingCountEl.textContent = String(incoming);
        outgoingCountEl.textContent = String(outgoing);
      }

      listEl.addEventListener('click', function (event) {
      const button = event.target.closest('[data-conversation-id]');
      if (!button) return;
      activeId = button.dataset.conversationId;
      renderConversationList();
      renderActiveConversation();
    });

    streamEl.addEventListener('click', function (event) {
      const actionButton = event.target.closest('[data-offer-action]');
      if (!actionButton || !activeId) return;
      const action = actionButton.dataset.offerAction;
      const messageId = actionButton.dataset.messageId;
      const conversation = getConversationById(activeId);
      if (!conversation) return;
      let respondedOffer = null;
      const messages = (JETLE.getMessagesMap()[activeId] || []).map(function (message) {
        if (message.id !== messageId || message.type !== 'offer' || message.senderId === user.id || (message.offerStatus || 'bekliyor') !== 'bekliyor') {
          return message;
        }
        respondedOffer = Object.assign({}, message, {
          offerStatus: action === 'accept' ? 'kabul edildi' : 'reddedildi',
          respondedAt: new Date().toISOString()
        });
        return respondedOffer;
      });
      if (action === 'accept') {
        messages.push({
          id: 'm' + Date.now(),
          type: 'system',
          senderId: user.id,
          text: 'Anlaşma sağlandı',
          createdAt: new Date().toISOString(),
          readBy: conversation.participants.slice()
        });
      }
      saveConversationMessages(activeId, messages);
      bumpConversation(activeId);
      if (typeof JETLE.addNotification === 'function') {
        const receiverId = conversation.participants.find(function (id) { return id !== user.id; });
        if (receiverId) {
          JETLE.addNotification(receiverId, {
            type: 'offer',
            title: action === 'accept' ? 'Teklif kabul edildi' : 'Teklif reddedildi',
            text: '"' + conversation.listingTitle + '" ilanı için verdiğiniz ' + JETLE.formatCurrency(Number((respondedOffer && respondedOffer.offerAmount) || 0)) + ' teklif ' + (action === 'accept' ? 'kabul edildi.' : 'reddedildi.')
          });
        }
      }
      JETLE.showToast(action === 'accept' ? 'Teklif kabul edildi.' : 'Teklif reddedildi.');
      renderConversationList();
      renderMessageSummary();
      renderActiveConversation();
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const text = input.value.trim();
      if (!text || !activeId) return;

      const conversationMessages = JETLE.getMessagesMap()[activeId] || [];
      conversationMessages.push({ id: 'm' + Date.now(), senderId: user.id, text: text, createdAt: new Date().toISOString(), readBy: [user.id] });
      saveConversationMessages(activeId, conversationMessages);
      const activeConversation = bumpConversation(activeId);
      notifyConversationPeer(activeConversation, {
        type: 'message',
        title: 'Yeni mesaj aldınız',
        text: '"' + activeConversation.listingTitle + '" ilanı için size yeni bir mesaj gönderildi.'
      });
      if (activeConversation && typeof JETLE.getTrackedListingFollowers === 'function' && typeof JETLE.addNotification === 'function') {
        JETLE.getTrackedListingFollowers(activeConversation.listingId).forEach(function (followerId) {
          if (followerId === user.id || activeConversation.participants.includes(followerId)) return;
          JETLE.addNotification(followerId, {
            type: 'listing-follow-message',
            title: 'Takip ettiğiniz ilana yeni mesaj geldi',
            text: '"' + activeConversation.listingTitle + '" ilanında yeni mesaj hareketi var.'
          });
        });
      }

      input.value = '';
      renderConversationList();
      renderMessageSummary();
      renderActiveConversation();
    });

    quickRepliesEl.addEventListener('click', function (event) {
      const button = event.target.closest('[data-quick-message]');
      if (!button || !activeId) return;
      input.value = button.dataset.quickMessage || '';
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });

    openOfferModalBtn.addEventListener('click', openOfferModal);

    offerModal.addEventListener('click', function (event) {
      if (event.target.closest('[data-close-offer-modal]')) {
        closeOfferModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !offerModal.classList.contains('hidden')) {
        closeOfferModal();
      }
    });

    offerForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!activeId) {
        JETLE.showToast('Önce bir konuşma seçin.');
        return;
      }
      const amount = Number(offerAmountInput.value);
      const note = offerNoteInput.value.trim();
      if (!amount || amount <= 0) {
        JETLE.showToast('Lütfen geçerli bir teklif tutarı girin.');
        return;
      }
      const conversation = getConversationById(activeId);
      if (!conversation) return;
      const messages = JETLE.getMessagesMap()[activeId] || [];
      messages.push({
        id: 'm' + Date.now(),
        type: 'offer',
        senderId: user.id,
        text: note,
        offerAmount: amount,
        offerStatus: 'bekliyor',
        createdAt: new Date().toISOString(),
        readBy: [user.id]
      });
      saveConversationMessages(activeId, messages);
      bumpConversation(activeId);
      notifyConversationPeer(conversation, {
        type: 'offer',
        title: 'Teklif geldi',
        text: '"' + conversation.listingTitle + '" ilanı için size ' + JETLE.formatCurrency(amount) + ' teklif gönderildi.'
      });
      if (typeof JETLE.getTrackedListingFollowers === 'function' && typeof JETLE.addNotification === 'function') {
        JETLE.getTrackedListingFollowers(conversation.listingId).forEach(function (followerId) {
          if (followerId === user.id || conversation.participants.includes(followerId)) return;
          JETLE.addNotification(followerId, {
            type: 'listing-follow-message',
            title: 'Takip ettiğiniz ilana yeni mesaj geldi',
            text: '"' + conversation.listingTitle + '" ilanında yeni bir teklif / mesaj hareketi var.'
          });
        });
      }
      closeOfferModal();
      JETLE.showToast('Teklifiniz gönderildi.');
      renderConversationList();
      renderMessageSummary();
      renderActiveConversation();
    });

    renderConversationList();
    renderMessageSummary();
    renderActiveConversation();
    openOfferModalBtn.disabled = !activeId;
    if (!activeId) quickRepliesEl.classList.add('is-disabled');
  }

  function initStorePage() {
    const wrap = document.getElementById('storePageContainer');
    if (!wrap) return;

    function getRequestedStoreSlug() {
      const querySlug = JETLE.getQueryParam('slug');
      if (querySlug) return querySlug;
      const segments = window.location.pathname.split('/').filter(Boolean);
      const magazaIndex = segments.indexOf('magaza');
      if (magazaIndex !== -1 && segments[magazaIndex + 1]) return decodeURIComponent(segments[magazaIndex + 1]);
      return '';
    }

    const requestedSlug = getRequestedStoreSlug();
    const allUsers = JETLE.getUsers();

    if (requestedSlug) {
      const owner = allUsers.find(function (item) {
        return item.store && item.store.slug === requestedSlug;
      });

      if (!owner || !owner.store) {
        wrap.innerHTML += '<div class="panel empty-state"><h3>Mağaza bulunamadı</h3><p>Aradığınız mağaza şu anda yayında değil.</p></div>';
        return;
      }

      const store = owner.store;
      const storeListings = JETLE.getListings().filter(function (item) {
        return item.ownerId === owner.id;
      });
      wrap.innerHTML += buildSellerProfileMarkup(owner, store, storeListings, {
        kicker: 'Kurumsal Magaza',
        coverLabel: 'JETLE Magaza Vitrini'
      });
      bindListingActions(wrap);
      bindSellerActions(wrap, owner, store, storeListings[0] || null);
      if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
      return;
    }

    const user = requireAuth();
    if (!user) return;

    const owner = allUsers.find(function (item) { return item.id === user.id; }) || user;
    const store = owner.store || {};
    const packageInfo = getStorePackageById(store.packageId);
    const myListings = JETLE.getListings().filter(function (item) { return item.ownerId === user.id; });
    const usageLabel = packageInfo ? (packageInfo.limit === 'Sınırsız' ? (myListings.length + ' / Sınırsız') : (myListings.length + ' / ' + packageInfo.limit)) : 'Paket seçilmedi';

    wrap.innerHTML += '' +
      '<div class="store-manage-layout">' +
        '<section class="store-manage-main">' +
          '<section class="panel store-overview-panel">' +
            '<div class="store-overview-head">' +
              '<div>' +
                '<div class="storefront-kicker">Kurumsal Profil Yönetimi</div>' +
                '<h2>Mağazanı JETLE üzerinde profesyonelce konumlandır</h2>' +
                '<p>Galerici, emlak ofisi veya kurumsal satıcı olarak mağaza vitrini oluştur ve tüm ilanlarını tek çatı altında yayınla.</p>' +
              '</div>' +
              '<div class="store-status-box">' +
                '<span>Aktif Paket</span>' +
                '<strong>' + JETLE.escapeHtml((packageInfo && packageInfo.name) || 'Henüz paket alınmadı') + '</strong>' +
                '<small>' + usageLabel + '</small>' +
              '</div>' +
            '</div>' +
          '</section>' +
          '<section class="panel store-form-panel">' +
            '<div class="panel-head"><h3>Mağaza Bilgileri</h3></div>' +
            '<form id="storeForm" class="listing-form-grid">' +
              '<div class="form-group"><label for="profileType">Profil Tipi</label><select id="profileType"><option value="individual"' + ((owner.profileType || 'individual') === 'individual' ? ' selected' : '') + '>Bireysel Kullanıcı</option><option value="store"' + ((owner.profileType || '') === 'store' ? ' selected' : '') + '>Kurumsal Mağaza</option></select></div>' +
              '<div class="form-group"><label for="storeName">Mağaza Adı</label><input type="text" id="storeName" value="' + JETLE.escapeHtml(store.name || '') + '" placeholder="Örnek: Jetle Auto" required /></div>' +
              '<div class="form-group full-span"><label for="storeDescription">Açıklama</label><textarea id="storeDescription" rows="5" placeholder="Mağazanız hakkında güven veren kısa bir açıklama yazın.">' + JETLE.escapeHtml(store.description || '') + '</textarea></div>' +
              '<div class="form-group full-span"><label for="storeLogoInput">Logo</label><div class="store-logo-upload"><div id="storeLogoPreview" class="store-logo-preview">' + (store.logo ? '<img src="' + JETLE.escapeHtml(store.logo) + '" alt="' + JETLE.escapeHtml(store.name || 'Mağaza logosu') + '" />' : '<span>' + JETLE.escapeHtml(((store.name || owner.name || 'M').charAt(0)).toUpperCase()) + '</span>') + '</div><div class="store-logo-copy"><input type="file" id="storeLogoInput" accept="image/png,image/jpeg,image/webp" /><small>PNG, JPG veya WEBP yükleyebilirsiniz.</small></div></div></div>' +
              '<div class="form-group full-span"><label for="storeCoverInput">Kapak Görseli</label><div class="store-cover-upload"><div id="storeCoverPreview" class="store-cover-preview">' + (store.cover ? '<img src="' + JETLE.escapeHtml(store.cover) + '" alt="' + JETLE.escapeHtml(store.name || 'Kapak görseli') + '" />' : '<span>Kapak görseli önizlemesi</span>') + '</div><div class="store-logo-copy"><input type="file" id="storeCoverInput" accept="image/png,image/jpeg,image/webp" /><small>Mağaza vitrininizde öne çıkan geniş görsel.</small></div></div></div>' +
              '<div class="form-group"><label for="storePhone">Telefon</label><input type="text" id="storePhone" value="' + JETLE.escapeHtml(store.phone || owner.phone || '') + '" placeholder="05xx xxx xx xx" /></div>' +
              '<div class="form-group"><label for="storeEmail">E-posta</label><input type="email" id="storeEmail" value="' + JETLE.escapeHtml(store.email || owner.email || '') + '" placeholder="magaza@jetle.com" /></div>' +
              '<div class="form-group"><label for="storeCity">İl</label><input type="text" id="storeCity" value="' + JETLE.escapeHtml(store.city || '') + '" placeholder="İstanbul" /></div>' +
              '<div class="form-group"><label for="storeDistrict">İlçe</label><input type="text" id="storeDistrict" value="' + JETLE.escapeHtml(store.district || '') + '" placeholder="Kadıköy" /></div>' +
              '<div class="form-group"><label for="storeWebsite">Web Sitesi</label><input type="url" id="storeWebsite" value="' + JETLE.escapeHtml(store.website || '') + '" placeholder="https://ornek.com" /></div>' +
              '<div class="form-group"><label for="storeHours">Çalışma Saatleri</label><input type="text" id="storeHours" value="' + JETLE.escapeHtml(store.workingHours || '') + '" placeholder="Hafta içi 09:00 - 18:00" /></div>' +
              '<div class="form-group"><label for="sellerServiceRegion">Hizmet Bölgesi</label><input type="text" id="sellerServiceRegion" value="' + JETLE.escapeHtml(((owner.sellerProfile && owner.sellerProfile.serviceRegion) || '') ) + '" placeholder="İstanbul Anadolu Yakası / Türkiye Geneli" /></div>' +
              '<div class="form-group"><label for="sellerExpertise">Uzmanlık Alanı</label><input type="text" id="sellerExpertise" value="' + JETLE.escapeHtml(((owner.sellerProfile && owner.sellerProfile.expertise) || '') ) + '" placeholder="Premium otomobil, konut danışmanlığı, elektronik" /></div>' +
              '<div class="form-group"><label for="sellerResponseMinutes">Ortalama Yanıt Süresi (dk)</label><input type="number" id="sellerResponseMinutes" value="' + JETLE.escapeHtml(String((owner.sellerProfile && owner.sellerProfile.responseMinutes) || '')) + '" placeholder="15" min="1" /></div>' +
              '<div class="form-group"><label for="sellerWhatsapp">WhatsApp</label><input type="text" id="sellerWhatsapp" value="' + JETLE.escapeHtml(((owner.sellerProfile && owner.sellerProfile.whatsapp) || store.phone || owner.phone || '')) + '" placeholder="90 5xx xxx xx xx" /></div>' +
              '<div class="form-group full-span"><label for="sellerAbout">Hakkında</label><textarea id="sellerAbout" rows="5" placeholder="Kendinizi, çalışma disiplininizi, hizmet bölgenizi ve uzmanlık alanınızı detaylı anlatın.">' + JETLE.escapeHtml(((owner.sellerProfile && owner.sellerProfile.about) || store.description || '')) + '</textarea></div>' +
              '<div class="form-actions-row full-span">' +
                '<button type="submit" class="btn btn-primary">Mağazayı Güncelle</button>' +
                (store.slug ? '<a href="' + getStoreUrl(store) + '" class="btn btn-light">Mağazayı Gör</a>' : '') +
              '</div>' +
            '</form>' +
          '</section>' +
          '<section class="panel store-package-panel">' +
            '<div class="panel-head"><h3>Mağaza Paketleri</h3></div>' +
            '<div class="store-package-grid">' +
              STORE_PACKAGES.map(function (item) {
                return '' +
                  '<article class="store-package-card ' + (item.featured ? 'featured' : '') + '">' +
                    (item.featured ? '<span class="store-package-badge">Önerilen</span>' : '') +
                    '<h4>' + item.name + '</h4>' +
                    '<div class="store-package-price">' + JETLE.formatCurrency(item.price) + '<span>/ ay</span></div>' +
                    '<p>' + item.subtitle + '</p>' +
                    '<ul>' + item.perks.map(function (perk) { return '<li>' + perk + '</li>'; }).join('') + '</ul>' +
                    '<div class="store-package-limit">İlan limiti: <strong>' + item.limit + '</strong></div>' +
                    '<button type="button" class="btn btn-primary" data-store-package="' + item.id + '">Paketi Satın Al</button>' +
                  '</article>';
              }).join('') +
            '</div>' +
          '</section>' +
        '</section>' +
        '<aside class="store-manage-side">' +
          '<section class="panel store-side-card">' +
            '<h3>Abonelik Özeti</h3>' +
            '<div class="store-side-stat"><span>Profil Tipi</span><strong>' + ((owner.profileType || 'individual') === 'store' ? 'Kurumsal Mağaza' : 'Bireysel Kullanıcı') + '</strong></div>' +
            '<div class="store-side-stat"><span>Aktif ilan</span><strong>' + myListings.length + '</strong></div>' +
            '<div class="store-side-stat"><span>Paket</span><strong>' + JETLE.escapeHtml((packageInfo && packageInfo.name) || 'Standart kullanıcı') + '</strong></div>' +
            '<div class="store-side-stat"><span>Mağaza URL</span><strong>' + (store.slug ? ('/magaza/' + JETLE.escapeHtml(store.slug)) : 'Henüz oluşmadı') + '</strong></div>' +
          '</section>' +
          '<section class="panel store-side-card">' +
            '<h3>Rozetler</h3>' +
            '<div class="store-side-badges">' +
              (getSellerBadgesMarkup(owner, store) || '<span class="seller-trust-badge">Standart Mağaza</span>') +
            '</div>' +
          '</section>' +
        '</aside>' +
      '</div>';

    const storeForm = document.getElementById('storeForm');
    const storeLogoInput = document.getElementById('storeLogoInput');
    const storeCoverInput = document.getElementById('storeCoverInput');
    const storeLogoPreview = document.getElementById('storeLogoPreview');
    const storeCoverPreview = document.getElementById('storeCoverPreview');
    let storeLogoData = store.logo || '';
    let storeCoverData = store.cover || '';

    function renderStoreLogo(name) {
      if (!storeLogoPreview) return;
      if (storeLogoData) {
        storeLogoPreview.innerHTML = '<img src="' + storeLogoData + '" alt="' + JETLE.escapeHtml(name || 'Mağaza logosu') + '" />';
        return;
      }
      storeLogoPreview.innerHTML = '<span>' + JETLE.escapeHtml(((name || owner.name || 'M').charAt(0)).toUpperCase()) + '</span>';
    }

    function renderStoreCover(name) {
      if (!storeCoverPreview) return;
      if (storeCoverData) {
        storeCoverPreview.innerHTML = '<img src="' + storeCoverData + '" alt="' + JETLE.escapeHtml(name || 'Kapak görseli') + '" />';
        return;
      }
      storeCoverPreview.innerHTML = '<span>' + JETLE.escapeHtml((name || 'Kapak görseli önizlemesi')) + '</span>';
    }

    [storeLogoInput, storeCoverInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('change', function (event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
          JETLE.showToast('Görsel için PNG, JPG veya WEBP seçin.');
          return;
        }
        const reader = new FileReader();
        reader.onload = function (loadEvent) {
          if (input.id === 'storeLogoInput') {
            storeLogoData = String(loadEvent.target.result || '');
            renderStoreLogo(document.getElementById('storeName').value.trim());
          } else {
            storeCoverData = String(loadEvent.target.result || '');
            renderStoreCover(document.getElementById('storeName').value.trim());
          }
        };
        reader.readAsDataURL(file);
      });
    });

    if (storeForm) {
      storeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const profileType = document.getElementById('profileType').value;
        const storeName = document.getElementById('storeName').value.trim();
        const storeDescription = document.getElementById('storeDescription').value.trim();
        if (!storeName) {
          JETLE.showToast('Lütfen mağaza adını girin.');
          return;
        }

        owner.profileType = profileType;
        const nextStore = Object.assign({}, owner.store || {}, {
          name: storeName,
          description: storeDescription,
          logo: storeLogoData,
          cover: storeCoverData,
          phone: document.getElementById('storePhone').value.trim(),
          email: document.getElementById('storeEmail').value.trim(),
          city: document.getElementById('storeCity').value.trim(),
          district: document.getElementById('storeDistrict').value.trim(),
          website: document.getElementById('storeWebsite').value.trim(),
          workingHours: document.getElementById('storeHours').value.trim(),
          slug: slugify(storeName) || ('magaza-' + owner.id),
          active: profileType === 'store',
          verified: owner.store ? Boolean(owner.store.verified) : true,
          premium: owner.store ? Boolean(owner.store.premium) : false,
          packageId: owner.store ? owner.store.packageId : ''
        });
        owner.sellerProfile = Object.assign({}, owner.sellerProfile || {}, {
          serviceRegion: document.getElementById('sellerServiceRegion').value.trim(),
          expertise: document.getElementById('sellerExpertise').value.trim(),
          responseMinutes: Number(document.getElementById('sellerResponseMinutes').value || 0),
          whatsapp: document.getElementById('sellerWhatsapp').value.trim(),
          about: document.getElementById('sellerAbout').value.trim(),
          shortDescription: storeDescription || storeName,
          lastActive: new Date().toISOString()
        });
        owner.store = nextStore;
        updateCurrentUserRecord(owner);
        renderStoreLogo(storeName);
        renderStoreCover(storeName);
        JETLE.showToast('Mağaza bilgileri güncellendi.');
      });
    }

    Array.from(document.querySelectorAll('[data-store-package]')).forEach(function (button) {
      button.addEventListener('click', function () {
        const selectedPackage = getStorePackageById(button.dataset.storePackage);
        if (!selectedPackage) return;

        const storeName = (document.getElementById('storeName') && document.getElementById('storeName').value.trim()) || (owner.store && owner.store.name) || '';
        const storeDescription = (document.getElementById('storeDescription') && document.getElementById('storeDescription').value.trim()) || (owner.store && owner.store.description) || '';

        if (!storeName) {
          JETLE.showToast('Önce mağaza adınızı girin.');
          return;
        }

        JETLE.savePendingPayment({
          type: 'store-package',
          packageId: selectedPackage.id,
          items: [{ name: selectedPackage.name + ' Aboneliği', price: selectedPackage.price }],
          total: selectedPackage.price,
          createdAt: new Date().toISOString(),
          returnUrl: 'magaza.html',
          storeDraft: {
            name: storeName,
            description: storeDescription,
            logo: storeLogoData,
            cover: storeCoverData,
            phone: (document.getElementById('storePhone') && document.getElementById('storePhone').value.trim()) || '',
            email: (document.getElementById('storeEmail') && document.getElementById('storeEmail').value.trim()) || '',
            city: (document.getElementById('storeCity') && document.getElementById('storeCity').value.trim()) || '',
            district: (document.getElementById('storeDistrict') && document.getElementById('storeDistrict').value.trim()) || '',
            website: (document.getElementById('storeWebsite') && document.getElementById('storeWebsite').value.trim()) || '',
            workingHours: (document.getElementById('storeHours') && document.getElementById('storeHours').value.trim()) || '',
            slug: slugify(storeName) || ('magaza-' + owner.id)
          }
        });
        window.location.href = 'odeme.html';
      });
    });
  }

  function initUserProfilePage() {
    const container = document.getElementById('userProfileContainer');
    if (!container) return;

    const username = JETLE.getQueryParam('username');
    const users = JETLE.getUsers();
    const user = users.find(function (item) {
      return String(item.username || '').toLowerCase() === String(username || '').toLowerCase();
    });

    if (!user) {
      container.innerHTML = '<div class="panel empty-state"><h3>Kullanıcı bulunamadı</h3><p>Aradığınız profil şu anda görüntülenemiyor.</p></div>';
      return;
    }

    const listings = JETLE.getListings().filter(function (item) {
      return item.ownerId === user.id;
    });
    container.innerHTML = buildSellerProfileMarkup(user, user.store || null, listings, {
      kicker: ((user.profileType || 'individual') === 'store' ? 'Kurumsal Hesap' : 'Bireysel Satici'),
      coverLabel: 'JETLE Satici Profili'
    });

    bindListingActions(container);
    bindSellerActions(container, user, user.store || null, listings[0] || null);
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  function initDopingPage() {
    const cards = Array.from(document.querySelectorAll('[data-doping-name]'));
    const totalPriceEl = document.getElementById('dopingTotalPrice');
    const selectionTextEl = document.getElementById('dopingSelectionText');
    const gotoPaymentBtn = document.getElementById('gotoPaymentBtn');
    if (!cards.length || !totalPriceEl || !selectionTextEl || !gotoPaymentBtn) return;

    const listingId = JETLE.getQueryParam('listingId') || '';

    function renderTotal() {
      const selectedCards = cards.filter(function (card) {
        return card.classList.contains('selected');
      });

      const total = selectedCards.reduce(function (sum, card) {
        return sum + Number(card.dataset.dopingPrice || 0);
      }, 0);

      totalPriceEl.textContent = JETLE.formatCurrency(total);
      selectionTextEl.textContent = selectedCards.length
        ? selectedCards.map(function (card) { return card.dataset.dopingName; }).join(', ')
        : 'Henüz doping seçilmedi.';
    }

    cards.forEach(function (card) {
      const button = card.querySelector('[data-doping-select]');
      if (!button) return;
      button.addEventListener('click', function () {
        card.classList.toggle('selected');
        button.textContent = card.classList.contains('selected') ? 'Seçildi' : 'Seç';
        button.classList.toggle('btn-light', card.classList.contains('selected'));
        button.classList.toggle('btn-primary', !card.classList.contains('selected'));
        renderTotal();
      });
    });

    gotoPaymentBtn.addEventListener('click', function () {
      const selectedCards = cards.filter(function (card) {
        return card.classList.contains('selected');
      });

      if (!selectedCards.length) {
        JETLE.showToast('Önce en az 1 doping seçmelisiniz.');
        return;
      }

      const total = selectedCards.reduce(function (sum, card) {
        return sum + Number(card.dataset.dopingPrice || 0);
      }, 0);

      JETLE.savePendingPayment({
        listingId: listingId,
        dopings: selectedCards.map(function (card) {
          return {
            name: card.dataset.dopingName,
            price: Number(card.dataset.dopingPrice || 0)
          };
        }),
        total: total,
        createdAt: new Date().toISOString()
      });

      window.location.href = 'odeme.html';
    });

    renderTotal();
  }

  function initPaymentPage() {
    const user = requireAuth();
    if (!user) return;

    const form = document.getElementById('paymentForm');
    const totalPriceEl = document.getElementById('paymentTotalPrice');
    const summaryEl = document.getElementById('paymentSummaryList');
    const statusBox = document.getElementById('paymentStatusBox');
    const submitBtn = document.getElementById('paymentSubmitBtn');
    const pendingPayment = JETLE.getPendingPayment();

    if (!form || !totalPriceEl || !summaryEl || !statusBox || !submitBtn) return;

    if (!pendingPayment || !pendingPayment.total) {
      statusBox.innerHTML = '<div class="empty-state"><h3>Ödeme özeti bulunamadı</h3><p>Önce bir paket veya doping seçimi yapmalısınız.</p></div>';
      form.classList.add('hidden');
      return;
    }

    totalPriceEl.textContent = JETLE.formatCurrency(pendingPayment.total);
    const paymentItems = pendingPayment.items || pendingPayment.dopings || [];
    summaryEl.innerHTML = paymentItems.map(function (item) {
      return '<li><span>' + JETLE.escapeHtml(item.name) + '</span><strong>' + JETLE.formatCurrency(item.price) + '</strong></li>';
    }).join('');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const cardNumber = document.getElementById('cardNumber').value.trim();
      const cardName = document.getElementById('cardName').value.trim();
      const cardExpiry = document.getElementById('cardExpiry').value.trim();
      const cardCvv = document.getElementById('cardCvv').value.trim();

      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        JETLE.showToast('Lütfen kart bilgilerini eksiksiz girin.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Ödeme İşleniyor...';
      statusBox.innerHTML = '<div class="payment-loading">Ödeme işleniyor, lütfen bekleyin...</div>';

      setTimeout(function () {
        if (pendingPayment.type === 'store-package') {
          const users = JETLE.getUsers();
          const owner = users.find(function (item) { return item.id === user.id; });
          const packageInfo = getStorePackageById(pendingPayment.packageId);

          if (owner && packageInfo) {
            owner.profileType = 'store';
            owner.store = Object.assign({}, owner.store || {}, pendingPayment.storeDraft || {}, {
              packageId: packageInfo.id,
              packageName: packageInfo.name,
              limit: packageInfo.limit,
              perks: packageInfo.perks,
              active: true,
              verified: true,
              premium: packageInfo.id === 'premium-store' || packageInfo.id === 'corporate',
              featured: Boolean(packageInfo.featured),
              purchasedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
            });
            updateCurrentUserRecord(owner);
          }

          JETLE.clearPendingPayment();
          statusBox.innerHTML = '<div class="payment-success">Ödeme Başarılı. Mağaza aboneliğiniz aktif edildi.</div>';
          JETLE.showToast('Mağaza paketi aktif edildi.');
          setTimeout(function () {
            window.location.href = 'magaza.html';
          }, 1400);
          return;
        }

        const listings = JETLE.getListings();
        const targetListingId = pendingPayment.listingId || '';
        const ownedListing = listings.find(function (item) {
          return item.id === targetListingId && item.ownerId === user.id;
        }) || listings.find(function (item) {
          return item.ownerId === user.id;
        });

        if (ownedListing) {
          const updatedListings = listings.map(function (item) {
            if (item.id === ownedListing.id) {
              item.premium = true;
              item.dopingSelections = pendingPayment.dopings || [];
            }
            return item;
          });
          JETLE.saveListings(updatedListings);
        }

        JETLE.clearPendingPayment();
        statusBox.innerHTML = '<div class="payment-success">Ödeme Başarılı. İlanınız premium olarak güncellendi.</div>';
        JETLE.showToast('Ödeme başarılı.');
        setTimeout(function () {
          window.location.href = 'index.html';
        }, 1400);
      }, 2000);
    });
  }

  function getDashboardListingCard(listing) {
    const moderationStatus = getListingModerationStatus(listing);
    const isSample = Boolean(listing.isSample);
    const socialProof = getListingSocialProof(listing);
    const statusClass = listing.premium && moderationStatus === 'yayında' ? 'premium' : moderationStatus;
    const statusText = listing.premium && moderationStatus === 'yayında' ? 'Premium' : getModerationStatusLabel(moderationStatus);
    const moderationReason = String(listing.moderationReason || '').trim();
    const canResubmit = !isSample && (moderationStatus === 'reddedildi' || moderationStatus === 'pasif' || moderationStatus === 'beklemede');
    const primaryActionLabel = canResubmit ? 'Düzenle ve Tekrar Gönder' : (isSample ? 'İncele' : 'Düzenle');
    const primaryActionHref = isSample ? 'ilan-ver.html' : ('ilan-ver.html?editId=' + encodeURIComponent(listing.id));

    return '' +
      '<article class="dashboard-listing-card ' + (listing.premium ? 'dashboard-listing-card-featured' : '') + ' ' + (isSample ? 'dashboard-listing-card-sample' : '') + '" data-listing-id="' + listing.id + '">' +
        '<div class="dashboard-listing-main">' +
          (listing.premium ? '<span class="dashboard-featured-badge">Öne Çıkan</span>' : '') +
          '<div class="dashboard-listing-head-row">' +
            '<h3>' + JETLE.escapeHtml(listing.title) + '</h3>' +
            '<span class="dashboard-listing-status status-' + statusClass + '">' + statusText + '</span>' +
          '</div>' +
          '<div class="dashboard-listing-price">' + JETLE.formatCurrency(listing.price || 0) + '</div>' +
          '<div class="dashboard-listing-meta">' + JETLE.escapeHtml(listing.category || 'Kategori belirtilmedi') + ' · ' + JETLE.escapeHtml(listing.location || 'Konum belirtilmedi') + '</div>' +
          '<div class="dashboard-listing-proof"><span>' + socialProof.views + ' görüntülenme</span><span>' + socialProof.favorites + ' kişi favorilere ekledi</span></div>' +
          (moderationReason ? '<div class="dashboard-listing-note"><strong>Red nedeni</strong><span>' + JETLE.escapeHtml(moderationReason) + '</span></div>' : '') +
        '</div>' +
        '<div class="dashboard-listing-side">' +
          '<div class="dashboard-listing-actions">' +
            '<a href="' + primaryActionHref + '" class="btn ' + (canResubmit ? 'btn-primary' : 'btn-light') + ' btn-small">' + primaryActionLabel + '</a>' +
            (isSample
              ? '<button type="button" class="btn btn-light btn-small" disabled>Sil</button>'
              : '<button type="button" class="btn btn-light btn-small" data-delete-listing="' + listing.id + '">Sil</button>') +
            (moderationStatus === 'yayında' ? '<a href="doping.html' + (isSample ? '' : '?listingId=' + listing.id) + '" class="btn btn-primary btn-small btn-boost">Öne Çıkar</a>' : '') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderDashboardSection(targetId, listings, emptyText, options) {
    const container = document.getElementById(targetId);
    if (!container) return;
    const settings = options || {};
    const renderItems = listings.length ? listings : (settings.sampleListings || []);

    if (!renderItems.length) {
      container.innerHTML = '<div class="empty-state"><h3>' + JETLE.escapeHtml(emptyText) + '</h3><p>Yeni ilan ekleyerek panelinizi doldurabilirsiniz.</p></div>';
      return;
    }

    container.innerHTML = renderItems.map(getDashboardListingCard).join('');

    if (listings.length) {
      bindListingActions(container);
    }
  }

  function renderDashboardNotifications(targetId, notifications) {
    const container = document.getElementById(targetId);
    if (!container) return;

    if (!notifications.length) {
      container.innerHTML = '<div class="empty-state"><h3>Bildiriminiz bulunmuyor</h3><p>Yeni moderasyon ve hesap hareketleri burada listelenecek.</p></div>';
      return;
    }

    container.innerHTML = notifications.map(function (item) {
      return '' +
        '<article class="dashboard-notification-card ' + (item.read ? '' : 'unread') + '">' +
          '<div class="dashboard-notification-head">' +
            '<strong>' + JETLE.escapeHtml(item.title || 'Bildirim') + '</strong>' +
            '<span>' + JETLE.formatDate(item.createdAt) + '</span>' +
          '</div>' +
          '<p>' + JETLE.escapeHtml(item.text || '') + '</p>' +
        '</article>';
    }).join('');
  }

  function renderDashboardFollowedSellers(targetId, currentUser) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const followedKeys = getCurrentFollowedSellerKeys();
    if (!followedKeys.length) {
      container.innerHTML = '<div class="empty-state"><h3>Takip ettiginiz satici yok</h3><p>Begendiginiz bireysel veya kurumsal profilleri takip ederek burada listeleyebilirsiniz.</p></div>';
      return;
    }

    const users = JETLE.getUsers();
    const followedUsers = followedKeys.map(function (key) {
      return users.find(function (user) {
        return getSellerFollowKey(user, user.store && user.store.active ? user.store : null) === key;
      });
    }).filter(Boolean);

    const cards = followedUsers.map(function (seller) {
      const store = seller.store && seller.store.active ? seller.store : null;
      const listings = JETLE.getListings().filter(function (item) { return item.ownerId === seller.id; });
      const stats = getSellerProfileMeta(seller, store, listings);
      const url = getSellerPrimaryUrl(seller, store);
      return '' +
        '<article class="dashboard-follow-card">' +
          '<div class="dashboard-follow-card-head">' +
            '<div class="dashboard-follow-avatar">' + ((store && store.logo) ? '<img src="' + JETLE.escapeHtml(store.logo) + '" alt="' + JETLE.escapeHtml((store && store.name) || seller.name || 'Satici') + '" />' : (seller.avatar ? '<img src="' + JETLE.escapeHtml(seller.avatar) + '" alt="' + JETLE.escapeHtml(seller.name || 'Satici') + '" />' : '<span>' + JETLE.escapeHtml(String((((store && store.name) || seller.name || 'S').charAt(0))).toUpperCase()) + '</span>')) + '</div>' +
            '<div class="dashboard-follow-copy">' +
              '<strong>' + JETLE.escapeHtml((store && store.name) || seller.name || seller.username || 'JETLE Saticisi') + '</strong>' +
              '<span>' + JETLE.escapeHtml(stats.shortDescription) + '</span>' +
              (getSellerBadgesMarkup(seller, store) ? '<div class="detail-seller-badges">' + getSellerBadgesMarkup(seller, store) + '</div>' : '') +
            '</div>' +
          '</div>' +
          '<div class="dashboard-follow-stats">' +
            '<span>' + stats.publishedCount + ' yayinda</span>' +
            '<span>' + stats.totals.views + ' goruntulenme</span>' +
            '<span>' + stats.totals.favorites + ' favori</span>' +
          '</div>' +
          '<div class="dashboard-follow-actions">' +
            '<a href="' + url + '" class="btn btn-light">Profili Gor</a>' +
            '<button type="button" class="btn btn-primary" data-follow-seller="' + JETLE.escapeHtml(getSellerFollowKey(seller, store)) + '">Takibi Birak</button>' +
          '</div>' +
        '</article>';
    });

    container.innerHTML = cards.join('');
    Array.from(container.querySelectorAll('[data-follow-seller]')).forEach(function (button) {
      button.addEventListener('click', function () {
        const followKey = button.dataset.followSeller;
        const seller = followedUsers.find(function (item) {
          return getSellerFollowKey(item, item.store && item.store.active ? item.store : null) === followKey;
        });
        if (!seller) return;
        toggleSellerFollow(seller, seller.store && seller.store.active ? seller.store : null);
        renderDashboardFollowedSellers(targetId, currentUser);
      });
    });
  }

  function initDashboardPage() {
    const user = requireAuth();
    if (!user) return;

    const currentUser = JETLE.getUsers().find(function (item) { return item.id === user.id; }) || user;
    const listings = JETLE.getListings().filter(function (item) {
      return item.ownerId === user.id;
    });
    const notifications = typeof JETLE.ensureUserNotifications === 'function'
      ? JETLE.ensureUserNotifications(currentUser).slice().sort(function (a, b) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }).slice(0, 6)
      : [];
    const store = currentUser.store || {};
    const favoriteIds = JETLE.getFavorites(user.id);
    const allListings = JETLE.getListings();
    const favorites = allListings.filter(function (item) {
      return favoriteIds.includes(item.id);
    });
    const activeListings = listings.filter(function (item) {
      return getListingModerationStatus(item) === 'yayında' && !item.premium;
    });
    const pendingListings = listings.filter(function (item) {
      return getListingModerationStatus(item) !== 'yayında';
    });
    const premiumListings = listings.filter(function (item) {
      return item.premium && getListingModerationStatus(item) === 'yayında';
    });

    const sampleListings = [
      {
        id: 'sample-dashboard-1',
        title: '2024 Model Elektrikli Scooter',
        category: 'Alışveriş',
        location: 'İstanbul / Kadıköy',
        price: 28500,
        status: 'yayında',
        premium: false,
        isSample: true
      },
      {
        id: 'sample-dashboard-2',
        title: '2+1 Kiralık Daire - Metroya Yakın',
        category: 'Gayrimenkul',
        location: 'Ankara / Çankaya',
        price: 24500,
        status: 'yayında',
        premium: true,
        isSample: true
      },
      {
        id: 'sample-dashboard-3',
        title: 'Temiz Kullanılmış MacBook Pro M2',
        category: 'Bilgisayar',
        location: 'İzmir / Karşıyaka',
        price: 48900,
        status: 'yayında',
        premium: false,
        isSample: true
      }
    ];

    renderDashboardSection('dashboardActiveListings', activeListings, 'Yayında ilanınız bulunmuyor', {
      sampleListings: sampleListings
    });
    renderDashboardSection('dashboardPendingListings', pendingListings, 'Bekleyen ilanınız bulunmuyor');
    renderDashboardSection('dashboardPremiumListings', premiumListings, 'Premium ilanınız bulunmuyor');
    renderDashboardFavorites('dashboardFavorites', favorites);
    renderDashboardRecentListings('dashboardRecentListings');
    renderDashboardFollowedSellers('dashboardFollowingSellers', currentUser);
    renderDashboardNotifications('dashboardNotifications', notifications);
    renderDashboardSection('dashboardStoreListings', listings.filter(function (item) { return Boolean(item.storeSlug || (store && store.active)); }), 'Mağazanıza bağlı ilan bulunmuyor');

    const userInfo = document.getElementById('dashboardUserInfo');
    if (userInfo) {
      userInfo.textContent = user.name + ' · ' + user.email;
    }

    const dashboardStoreSummary = document.getElementById('dashboardStoreSummary');
    if (dashboardStoreSummary) {
      dashboardStoreSummary.innerHTML = '' +
        '<div class="dashboard-setting-card">' +
          '<h3>Profil Tipi</h3>' +
          '<p>' + ((currentUser.profileType || 'individual') === 'store' ? 'Kurumsal Mağaza' : 'Bireysel Kullanıcı') + '</p>' +
        '</div>' +
        '<div class="dashboard-setting-card">' +
          '<h3>Mağaza Adı</h3>' +
          '<p>' + JETLE.escapeHtml(store.name || 'Henüz mağaza adı girilmedi') + '</p>' +
        '</div>' +
        '<div class="dashboard-setting-card">' +
          '<h3>Toplam İlan</h3>' +
          '<p>' + listings.length + ' ilan</p>' +
        '</div>' +
        '<div class="dashboard-setting-card">' +
          '<h3>Rozetler</h3>' +
          '<p>' + (getSellerTrustSummary(currentUser, store) || 'Standart Mağaza') + '</p>' +
        '</div>';
    }

    const dashboardStoreSettingsSummary = document.getElementById('dashboardStoreSettingsSummary');
    if (dashboardStoreSettingsSummary) {
      dashboardStoreSettingsSummary.innerHTML = '' +
        '<div class="dashboard-setting-card">' +
          '<h3>Mağaza URL</h3>' +
          '<p>' + (store.slug ? ('/magaza/' + JETLE.escapeHtml(store.slug)) : 'Henüz oluşmadı') + '</p>' +
        '</div>' +
        '<div class="dashboard-setting-card">' +
          '<h3>İletişim</h3>' +
          '<p>' + JETLE.escapeHtml(store.phone || currentUser.phone || '-') + '<br />' + JETLE.escapeHtml(store.email || currentUser.email || '-') + '</p>' +
        '</div>' +
        '<div class="dashboard-setting-card">' +
          '<h3>Konum</h3>' +
          '<p>' + JETLE.escapeHtml([store.city, store.district].filter(Boolean).join(' / ') || 'Belirtilmedi') + '</p>' +
        '</div>' +
        '<div class="dashboard-setting-card">' +
          '<h3>Çalışma Saatleri</h3>' +
          '<p>' + JETLE.escapeHtml(store.workingHours || 'Belirtilmedi') + '</p>' +
        '</div>';
    }

    const navItems = Array.from(document.querySelectorAll('[data-dashboard-tab]'));
    const listingsPanel = document.getElementById('dashboardListingsPanel');
    const pendingPanel = document.getElementById('dashboardPendingPanel');
    const premiumPanel = document.getElementById('dashboardPremiumPanel');
    const favoritesPanel = document.getElementById('dashboardFavoritesPanel');
    const recentPanel = document.getElementById('dashboardRecentPanel');
    const followingPanel = document.getElementById('dashboardFollowingPanel');
    const storePanel = document.getElementById('dashboardStorePanel');
    const storeSettingsPanel = document.getElementById('dashboardStoreSettingsPanel');
    const storeListingsPanel = document.getElementById('dashboardStoreListingsPanel');
    const settingsPanel = document.getElementById('dashboardSettingsPanel');

    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        navItems.forEach(function (nav) { nav.classList.remove('active'); });
        item.classList.add('active');

        if (listingsPanel) listingsPanel.classList.remove('hidden');
        if (pendingPanel) pendingPanel.classList.remove('hidden');
        if (premiumPanel) premiumPanel.classList.remove('hidden');
        if (favoritesPanel) favoritesPanel.classList.remove('hidden');
        if (recentPanel) recentPanel.classList.remove('hidden');
        if (followingPanel) followingPanel.classList.remove('hidden');
        if (storePanel) storePanel.classList.add('hidden');
        if (storeSettingsPanel) storeSettingsPanel.classList.add('hidden');
        if (storeListingsPanel) storeListingsPanel.classList.add('hidden');
        if (settingsPanel) settingsPanel.classList.add('hidden');

        if (item.dataset.dashboardTab === 'favorites' && favoritesPanel) {
          favoritesPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (item.dataset.dashboardTab === 'recent' && recentPanel) {
          recentPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (item.dataset.dashboardTab === 'following' && followingPanel) {
          followingPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (item.dataset.dashboardTab === 'store' && storePanel) {
          if (listingsPanel) listingsPanel.classList.add('hidden');
          if (pendingPanel) pendingPanel.classList.add('hidden');
          if (premiumPanel) premiumPanel.classList.add('hidden');
          if (favoritesPanel) favoritesPanel.classList.add('hidden');
          if (recentPanel) recentPanel.classList.add('hidden');
          if (followingPanel) followingPanel.classList.add('hidden');
          storePanel.classList.remove('hidden');
        }

        if (item.dataset.dashboardTab === 'store-settings' && storeSettingsPanel) {
          if (listingsPanel) listingsPanel.classList.add('hidden');
          if (pendingPanel) pendingPanel.classList.add('hidden');
          if (premiumPanel) premiumPanel.classList.add('hidden');
          if (favoritesPanel) favoritesPanel.classList.add('hidden');
          if (recentPanel) recentPanel.classList.add('hidden');
          if (followingPanel) followingPanel.classList.add('hidden');
          storeSettingsPanel.classList.remove('hidden');
        }

        if (item.dataset.dashboardTab === 'store-listings' && storeListingsPanel) {
          if (listingsPanel) listingsPanel.classList.add('hidden');
          if (pendingPanel) pendingPanel.classList.add('hidden');
          if (premiumPanel) premiumPanel.classList.add('hidden');
          if (favoritesPanel) favoritesPanel.classList.add('hidden');
          if (recentPanel) recentPanel.classList.add('hidden');
          if (followingPanel) followingPanel.classList.add('hidden');
          storeListingsPanel.classList.remove('hidden');
        }

        if (item.dataset.dashboardTab === 'settings' && settingsPanel) {
          settingsPanel.classList.remove('hidden');
          if (listingsPanel) listingsPanel.classList.add('hidden');
          if (pendingPanel) pendingPanel.classList.add('hidden');
          if (premiumPanel) premiumPanel.classList.add('hidden');
          if (favoritesPanel) favoritesPanel.classList.add('hidden');
          if (recentPanel) recentPanel.classList.add('hidden');
          if (followingPanel) followingPanel.classList.add('hidden');
        }
      });
    });
  }

  function initUserDashboardPage() {
    const user = requireAuth();
    if (!user) return;

    const users = JETLE.getUsers();
    const currentUser = users.find(function (item) { return item.id === user.id; }) || user;
    let allListings = JETLE.getListings();
    let myListings = allListings.filter(function (item) {
      return item.ownerId === user.id || item.userId === user.id;
    }).sort(function (a, b) {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    let favoriteIds = getUserFavorites(user.id);
    let favoriteListings = allListings.filter(function (item) {
      return favoriteIds.includes(item.id);
    });
    const conversations = JETLE.getConversations().filter(function (item) {
      return Array.isArray(item.participants) && item.participants.includes(user.id);
    }).sort(function (a, b) {
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });

    const stats = {
      total: 0,
      active: 0,
      pending: 0,
      favorites: favoriteListings.length
    };

    const greetingName = document.getElementById('dashboardGreetingName');
    const avatarEl = document.getElementById('dashboardAvatar');
    const profileSummaryName = document.getElementById('dashboardProfileSummaryName');
    const profileName = document.getElementById('dashboardProfileName');
    const profileEmail = document.getElementById('dashboardProfileEmail');
    const profilePhone = document.getElementById('dashboardProfilePhone');
    const profileMemberSince = document.getElementById('dashboardProfileMemberSince');
    const totalListingsEl = document.getElementById('dashboardStatTotal');
    const activeListingsEl = document.getElementById('dashboardStatActive');
    const pendingListingsEl = document.getElementById('dashboardStatPending');
    const favoriteCountEl = document.getElementById('dashboardStatFavorites');
    const listingsContainer = document.getElementById('userDashboardListings');
    const favoritesContainer = document.getElementById('userDashboardFavorites');
    const messagesContainer = document.getElementById('userDashboardMessages');
    const profileForm = document.getElementById('dashboardProfileForm');
    const logoutButtons = Array.from(document.querySelectorAll('[data-dashboard-logout]'));

    if (greetingName) greetingName.textContent = currentUser.name || 'Kullanıcı';
    if (avatarEl) avatarEl.textContent = String((currentUser.name || 'K').charAt(0) || 'K').toUpperCase();
    if (profileSummaryName) profileSummaryName.textContent = currentUser.name || 'Aktif kullanıcı';
    if (profileName) profileName.value = currentUser.name || '';
    if (profileEmail) profileEmail.value = currentUser.email || '';
    if (profilePhone) profilePhone.value = currentUser.phone || '';
    if (profileMemberSince) {
      profileMemberSince.textContent = currentUser.createdAt
        ? JETLE.formatDate(currentUser.createdAt)
        : 'Üyelik tarihi belirtilmedi';
    }
    if (totalListingsEl) totalListingsEl.textContent = String(stats.total);
    if (activeListingsEl) activeListingsEl.textContent = String(stats.active);
    if (pendingListingsEl) pendingListingsEl.textContent = String(stats.pending);
    if (favoriteCountEl) favoriteCountEl.textContent = String(stats.favorites);

    function refreshDashboardStats() {
      stats.total = myListings.length;
      stats.active = myListings.filter(function (item) { return getListingModerationStatus(item) === 'yayında'; }).length;
      stats.pending = myListings.filter(function (item) { return getListingModerationStatus(item) === 'beklemede'; }).length;
      stats.favorites = favoriteListings.length;

      if (totalListingsEl) totalListingsEl.textContent = String(stats.total);
      if (activeListingsEl) activeListingsEl.textContent = String(stats.active);
      if (pendingListingsEl) pendingListingsEl.textContent = String(stats.pending);
      if (favoriteCountEl) favoriteCountEl.textContent = String(stats.favorites);
    }

    function refreshFavoriteCollections() {
      favoriteIds = getUserFavorites(user.id);
      favoriteListings = allListings.filter(function (item) {
        return favoriteIds.includes(item.id);
      });
    }

    function getDashboardListingMedia(listing) {
      return (listing.images && listing.images[0]) || listing.image || '';
    }

    function getDashboardListingSummary(listing) {
      const parts = [];
      if (listing.category) parts.push(listing.category);
      if (listing.location) parts.push(listing.location);
      return parts.join(' · ') || 'İlan bilgisi eklenmedi';
    }

    function getDashboardListingCardHtml(listing) {
      const image = getDashboardListingMedia(listing);
      const moderationStatus = getListingModerationStatus(listing);
      const moderationLabel = getModerationStatusLabel(moderationStatus);
      const moderationReason = String(listing.moderationReason || '').trim();
      const createdAtLabel = listing.createdAt ? JETLE.formatDate(listing.createdAt) : '-';
      const favoriteActive = favoriteIds.includes(listing.id);
      return '' +
        '<article class="user-dashboard-listing-card panel">' +
          '<a href="' + getDetailUrl(listing) + '" class="user-dashboard-listing-media">' +
            (image
              ? '<img src="' + JETLE.escapeHtml(image) + '" alt="' + JETLE.escapeHtml(listing.title || 'İlan görseli') + '" />'
              : '<div class="user-dashboard-media-placeholder"><strong>JETLE</strong><span>İlan görseli</span></div>') +
          '</a>' +
          '<div class="user-dashboard-listing-body">' +
            '<div class="user-dashboard-listing-head">' +
              '<div>' +
                '<h3><a href="' + getDetailUrl(listing) + '">' + JETLE.escapeHtml(listing.title || 'Başlıksız ilan') + '</a></h3>' +
                '<p>' + JETLE.escapeHtml(getDashboardListingSummary(listing)) + '</p>' +
              '</div>' +
              '<span class="dashboard-listing-status status-' + moderationStatus + '">' + moderationLabel + '</span>' +
            '</div>' +
            '<div class="user-dashboard-listing-price">' + JETLE.formatCurrency(listing.price || 0) + '</div>' +
            '<div class="user-dashboard-listing-meta-row">' +
              '<span><strong>Tarih:</strong> ' + JETLE.escapeHtml(createdAtLabel) + '</span>' +
              '<span><strong>Durum:</strong> ' + JETLE.escapeHtml(moderationLabel) + '</span>' +
            '</div>' +
            (moderationReason ? '<div class="user-dashboard-inline-note"><strong>Not:</strong> ' + JETLE.escapeHtml(moderationReason) + '</div>' : '') +
            '<div class="user-dashboard-listing-actions">' +
              '<button type="button" class="btn btn-light btn-small user-dashboard-favorite-btn ' + (favoriteActive ? 'is-active' : '') + '" data-favorite-id="' + listing.id + '">' + (favoriteActive ? 'Favoriden Kaldır' : 'Favorilere Ekle') + '</button>' +
              '<a href="ilan-ver.html?editId=' + encodeURIComponent(listing.id) + '" class="btn btn-primary btn-small">Düzenle</a>' +
              '<button type="button" class="btn btn-light btn-small" data-user-dashboard-delete="' + listing.id + '">Sil</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }

    function renderMyListings() {
      if (!listingsContainer) return;
      if (!myListings.length) {
        listingsContainer.innerHTML = '<div class="empty-state"><h3>Henüz ilan eklemediniz</h3><p>İlk ilanınızı eklediğinizde başlık, fiyat, tarih ve durum bilgileri burada düzenli şekilde listelenecek.</p></div>';
        return;
      }
      listingsContainer.innerHTML = myListings.map(getDashboardListingCardHtml).join('');
    }

    async function loadUserListingsFromApi() {
      if (!listingsContainer) return;
      listingsContainer.innerHTML = '<div class="empty-state"><h3>İlanlar yükleniyor</h3><p>Hesabınıza ait ilanlar API üzerinden getiriliyor.</p></div>';

      try {
        if (window.JETLE_API && typeof window.JETLE_API.whenReady === 'function') {
          await window.JETLE_API.whenReady();
        }

        const remoteListings = window.JETLE_API && typeof window.JETLE_API.getListings === 'function'
          ? await window.JETLE_API.getListings()
          : JETLE.getListings();

        allListings = Array.isArray(remoteListings) ? remoteListings.slice() : [];
        myListings = allListings.filter(function (item) {
          return String(item.ownerId || item.userId || '') === String(user.id);
        }).sort(function (a, b) {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        refreshFavoriteCollections();
        refreshDashboardStats();
        renderMyListings();
        renderFavoritesSection();
      } catch (error) {
        console.error('Dashboard ilanları API üzerinden yüklenemedi.', error);
        myListings = [];
        refreshFavoriteCollections();
        refreshDashboardStats();
        listingsContainer.innerHTML = '<div class="empty-state"><h3>Henüz ilan eklemediniz</h3><p>İlanlar şu anda alınamadı. Biraz sonra tekrar deneyebilirsiniz.</p></div>';
      }
    }

    function renderFavoritesSection() {
      if (!favoritesContainer) return;
      if (!favoriteListings.length) {
        favoritesContainer.innerHTML = '<div class="empty-state"><h3>Favori ilanınız bulunmuyor</h3><p>Beğendiğiniz ilanları favorilere eklediğinizde burada tekrar hızlıca erişebilirsiniz.</p></div>';
        return;
      }
      favoritesContainer.innerHTML = favoriteListings.map(function (listing) {
        return getFavoriteListingCard(listing, { showRemove: true });
      }).join('');
      bindListingActions(favoritesContainer);
    }

    function renderMessagesSection() {
      if (!messagesContainer) return;
      if (!conversations.length) {
        messagesContainer.innerHTML = '<div class="empty-state"><h3>Henüz mesajınız bulunmuyor</h3><p>İlan detay sayfasından satıcıyla iletişime geçtiğinizde konuşmalarınız burada listelenecek.</p></div>';
        return;
      }

      const messagesMap = JETLE.getMessagesMap();
      messagesContainer.innerHTML = conversations.map(function (conversation) {
        const otherId = (conversation.participants || []).find(function (participantId) {
          return participantId !== user.id;
        });
        const otherUser = users.find(function (item) { return item.id === otherId; }) || {};
        const store = otherUser.store && otherUser.store.active ? otherUser.store : null;
        const listing = allListings.find(function (item) { return item.id === conversation.listingId; });
        const listingImage = listing ? getDashboardListingMedia(listing) : '';
        const conversationMessages = messagesMap[conversation.id] || [];
        const lastMessage = conversationMessages[conversationMessages.length - 1];
        const unreadCount = conversationMessages.filter(function (message) {
          return message.senderId !== user.id && !(message.readBy || []).includes(user.id);
        }).length;
        const previewText = lastMessage
          ? (lastMessage.type === 'offer'
              ? 'Teklif: ' + JETLE.formatCurrency(lastMessage.offerAmount || 0)
              : (lastMessage.text || 'Mesaj detayı yok'))
          : 'Henüz mesaj yok';

        return '' +
          '<article class="user-dashboard-message-card panel">' +
            '<div class="user-dashboard-message-media">' +
              (listingImage
                ? '<img src="' + JETLE.escapeHtml(listingImage) + '" alt="' + JETLE.escapeHtml((listing && listing.title) || 'İlan') + '" />'
                : '<div class="user-dashboard-media-placeholder"><strong>JETLE</strong><span>Mesaj</span></div>') +
            '</div>' +
            '<div class="user-dashboard-message-body">' +
              '<div class="user-dashboard-message-top">' +
                '<strong>' + JETLE.escapeHtml((store && store.name) || otherUser.name || 'Kullanıcı') + '</strong>' +
                '<span>' + JETLE.escapeHtml(JETLE.formatDate((lastMessage && lastMessage.createdAt) || conversation.updatedAt)) + '</span>' +
              '</div>' +
              '<h3>' + JETLE.escapeHtml(conversation.listingTitle || (listing && listing.title) || 'İlan görüşmesi') + '</h3>' +
              '<p>' + JETLE.escapeHtml(previewText) + '</p>' +
            '</div>' +
            '<div class="user-dashboard-message-side">' +
              (unreadCount ? '<span class="conversation-unread-badge">' + unreadCount + '</span>' : '<span class="user-dashboard-message-read">Okundu</span>') +
              '<a href="mesajlar.html?conversation=' + encodeURIComponent(conversation.id) + '" class="btn btn-light btn-small">Mesaja Git</a>' +
            '</div>' +
          '</article>';
      }).join('');
    }

    function bindDashboardActions() {
      if (listingsContainer) {
        listingsContainer.addEventListener('click', async function (event) {
          const favoriteButton = event.target.closest('[data-favorite-id]');
          if (favoriteButton) {
            toggleFavorite(favoriteButton.dataset.favoriteId);
            refreshFavoriteCollections();
            refreshDashboardStats();
            renderMyListings();
            renderFavoritesSection();
            JETLE.showToast(favoriteIds.includes(favoriteButton.dataset.favoriteId) ? 'İlan favorilere eklendi.' : 'İlan favorilerden kaldırıldı.');
            return;
          }

          const deleteButton = event.target.closest('[data-user-dashboard-delete]');
          if (!deleteButton) return;
          const listingId = deleteButton.dataset.userDashboardDelete;
          const targetListing = allListings.find(function (item) { return item.id === listingId; });
          if (!targetListing || (targetListing.ownerId !== user.id && targetListing.userId !== user.id)) {
            JETLE.showToast('Bu ilanı silme yetkiniz yok.');
            return;
          }
          if (!window.confirm('İlanı silmek istediğinize emin misiniz?')) {
            return;
          }

          try {
            if (window.JETLE_API && typeof window.JETLE_API.deleteListing === 'function') {
              await window.JETLE_API.deleteListing(listingId);
            } else {
              JETLE.saveListings(allListings.filter(function (item) { return item.id !== listingId; }));
            }

            allListings = allListings.filter(function (item) { return item.id !== listingId; });
            myListings = myListings.filter(function (item) { return item.id !== listingId; });
            refreshFavoriteCollections();
            refreshDashboardStats();
            renderMyListings();
            renderFavoritesSection();
            JETLE.showToast('İlan silindi.');
          } catch (error) {
            console.error('İlan silinemedi.', error);
            JETLE.showToast('İlan silinirken bir hata oluştu.');
          }
        });
      }

      logoutButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          JETLE.clearCurrentUser();
          JETLE.showToast('Çıkış yapıldı.');
          setTimeout(function () {
            window.location.href = 'index.html';
          }, 350);
        });
      });

      if (profileForm) {
        profileForm.addEventListener('submit', function (event) {
          event.preventDefault();
          const formData = new FormData(profileForm);
          const fullName = String(formData.get('name') || '').trim();
          const email = String(formData.get('email') || '').trim();
          const phone = String(formData.get('phone') || '').trim();
          const newPassword = String(formData.get('password') || '').trim();

          if (!fullName || !email) {
            JETLE.showToast('Ad soyad ve e-posta alanlarını doldurun.');
            return;
          }

          const nextUser = Object.assign({}, currentUser, {
            name: fullName,
            email: email,
            phone: phone
          });

          if (newPassword) {
            nextUser.password = newPassword;
          }

          updateCurrentUserRecord(nextUser);
          JETLE.showToast('Profil bilgileriniz güncellendi.');
          setTimeout(function () {
            window.location.reload();
          }, 220);
        });
      }
    }

    function setActiveDashboardTab(tabName) {
      const navItems = Array.from(document.querySelectorAll('[data-user-dashboard-tab]'));
      const panels = Array.from(document.querySelectorAll('[data-user-dashboard-panel]'));
      navItems.forEach(function (item) {
        item.classList.toggle('active', item.dataset.userDashboardTab === tabName);
      });
      panels.forEach(function (panel) {
        panel.classList.toggle('hidden', panel.dataset.userDashboardPanel !== tabName);
      });
    }

    refreshDashboardStats();
    renderMyListings();
    renderFavoritesSection();
    renderMessagesSection();
    bindDashboardActions();
    setActiveDashboardTab('overview');
    loadUserListingsFromApi();

    Array.from(document.querySelectorAll('[data-user-dashboard-tab]')).forEach(function (item) {
      item.addEventListener('click', function () {
        const tabName = item.dataset.userDashboardTab;
        if (tabName === 'logout') {
          JETLE.clearCurrentUser();
          JETLE.showToast('Çıkış yapıldı.');
          setTimeout(function () {
            window.location.href = 'index.html';
          }, 350);
          return;
        }
        setActiveDashboardTab(tabName);
      });
    });
  }

  /** Test/demo ilan dizisi (8 kayıt); depoya yazılan kaynakla aynı — konsol: JETLE_TEST_LISTINGS */
  window.JETLE_TEST_LISTINGS = HOME_PAGE_VITRIN_SEED_LISTINGS;
  window.renderListings = renderListings;

  window.initHomePage = initHomePage;
  window.initListingFormPage = initListingFormPage;
  window.initListingDetailPage = renderListingDetailPage;
  window.initFavoritesPage = renderFavoritesPage;
  window.initMessagesPage = renderMessagesPage;
  window.initComparePage = renderComparePage;

  document.addEventListener('DOMContentLoaded', function () {
    const page = document.body.dataset.page;
    if (page === 'home') {
      ensureHomeCategoryGuideDom();
      initHomePage().catch(function (error) {
        console.error('Ana sayfa başlatılamadı.', error);
        ensureHomeCategoryGuideDom();
      });
    }
    if (page === 'listing-form') initListingFormPage();
    if (page === 'listing-detail') renderListingDetailPage();
    if (page === 'favorites') renderFavoritesPage();
    if (page === 'messages') renderMessagesPage();
    if (page === 'compare') renderComparePage();
    if (page === 'dashboard') initDashboardPage();
    if (page === 'user-dashboard') initUserDashboardPage();
    if (page === 'store') initStorePage();
    if (page === 'user-profile') initUserProfilePage();
    if (page === 'premium' && document.getElementById('dopingTotalPanel')) initDopingPage();
    if (page === 'payment') initPaymentPage();
  });

  forcePopulateCitySelect();
}
})();
