(function () {
  console.log('script.js gerçekten yüklendi');
  const impressionCache = {};
  const STORE = {
    users: 'jetle_users_v3',
    listings: 'jetle_listings_v3',
    favorites: 'jetle_favorites_v3',
    listingFollows: 'jetle_listing_follows_v1',
    savedSearches: 'jetle_saved_searches_v1',
    reports: 'jetle_reports_v1',
    conversations: 'jetle_conversations_v3',
    messages: 'jetle_messages_v3',
    notifications: 'jetle_notifications_v1',
    ads: 'jetle_ads_v1',
    pendingPayment: 'jetle_pending_payment_v1',
    recentViews: 'jetle_recent_views_v1',
    remember: 'jetle_remember_user_v3',
    session: 'jetle_session_user_v3'
  };

  const CATEGORY_GROUPS = [
    {
      title: 'Gayrimenkul',
      icon: 'home',
      aliases: ['Emlak'],
      items: [
        { name: 'Konut' },
        { name: 'İş Yeri' },
        { name: 'Arsa' },
        { name: 'Konut Projeleri' },
        { name: 'Bina' },
        { name: 'Devre Mülk' },
        { name: 'Turistik Tesis' }
      ]
    },
    {
      title: 'Araçlar',
      icon: 'car',
      aliases: ['Vasıta'],
      items: [
        { name: 'Otomobil' },
        { name: 'SUV & Pickup' },
        { name: 'Elektrikli Araçlar' },
        { name: 'Motosiklet' },
        { name: 'Minivan & Panelvan' },
        { name: 'Ticari Araçlar' },
        { name: 'Kiralık Araçlar' },
        { name: 'Deniz Araçları' },
        { name: 'Hasarlı Araçlar' },
        { name: 'Karavan' },
        { name: 'Klasik Araçlar' },
        { name: 'Hava Araçları' },
        { name: 'ATV' },
        { name: 'UTV' },
        { name: 'Engelli Araçları' }
      ]
    },
    {
      title: 'Yedek Parça & Donanım',
      icon: 'settings',
      aliases: ['Yedek Parça', 'Yedek Parça & Aksesuar'],
      items: [
        { name: 'Otomotiv Ekipmanları' },
        { name: 'Motosiklet Ekipmanları' },
        { name: 'Deniz Aracı Ekipmanları' }
      ]
    },
    {
      title: 'Alışveriş',
      icon: 'shopping-bag',
      aliases: ['Elektronik', 'Ev Eşyaları', 'Moda', 'Anne & Bebek', 'Hobi & Oyun'],
      items: [
        { name: 'Bilgisayar' },
        { name: 'Telefon & Aksesuar' },
        { name: 'Fotoğraf & Kamera' },
        { name: 'Ev Dekorasyon' },
        { name: 'Ev Elektroniği' },
        { name: 'Elektrikli Ev Aletleri' },
        { name: 'Giyim & Aksesuar' },
        { name: 'Saat' },
        { name: 'Anne & Bebek' },
        { name: 'Kişisel Bakım' },
        { name: 'Hobi & Oyuncak' },
        { name: 'Oyunculara Özel' },
        { name: 'Kitap, Dergi & Film' },
        { name: 'Müzik' },
        { name: 'Spor' },
        { name: 'Takı & Mücevher' },
        { name: 'Koleksiyon' },
        { name: 'Antika' },
        { name: 'Bahçe & Yapı Market' }
      ]
    },
    {
      title: 'İş & Sanayi',
      icon: 'briefcase',
      aliases: ['İş Makineleri'],
      items: [
        { name: 'İş Makineleri' },
        { name: 'Tarım Makineleri' },
        { name: 'Sanayi Ekipmanları' },
        { name: 'Yedek Parça' },
        { name: 'Elektrik & Enerji' }
      ]
    },
    {
      title: 'Hizmetler',
      icon: 'wrench',
      items: [
        { name: 'Ev Tadilat' },
        { name: 'Nakliye' },
        { name: 'Servis & Bakım' },
        { name: 'Temizlik Hizmetleri' }
      ]
    },
    {
      title: 'Özel Ders',
      icon: 'book-open',
      aliases: ['Eğitim'],
      items: [
        { name: 'İlkokul & Ortaokul' },
        { name: 'Lise & Üniversite' },
        { name: 'Yabancı Dil' }
      ]
    },
    {
      title: 'İş İlanları',
      icon: 'users',
      items: [
        { name: 'Eğitim' },
        { name: 'Sağlık' },
        { name: 'IT & Yazılım' },
        { name: 'Satış & Pazarlama' }
      ]
    },
    {
      title: 'Hayvanlar',
      icon: 'paw-print',
      items: [
        { name: 'Evcil Hayvanlar' },
        { name: 'Akvaryum' },
        { name: 'Kuşlar' },
        { name: 'Üreticiler' }
      ]
    },
    {
      title: 'Yardımcı Arayanlar',
      icon: 'user-check',
      items: [
        { name: 'Bebek Bakıcı' },
        { name: 'Yaşlı Bakıcı' },
        { name: 'Temizlik Personeli' }
      ]
    }
  ];

  const FEATURED_SECTIONS = [
    { name: 'Öne Çıkan İlanlar', value: 'featured' },
    { name: 'Trend İlanlar', value: 'trend' },
    { name: 'Yeni Eklenenler', value: 'new' }
  ];

  const CATEGORIES = CATEGORY_GROUPS.reduce(function (acc, group) {
    return acc.concat(group.items.map(function (item) { return item.name; }));
  }, []);
  const AD_PACKAGE_MAP = {
    header: { label: 'Premium - Header', placement: 'header', packageType: 'Premium', price: 5000, size: '728x90' },
    sidebar: { label: 'Küçük - Sidebar', placement: 'sidebar', packageType: 'Küçük', price: 1500, size: '300x600' },
    inline: { label: 'Orta - İlan Arası', placement: 'inline', packageType: 'Orta', price: 3000, size: 'Native Kart' }
  };

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAGnoD0_t4nHAtbMm1biO3yXeg80sHwycE",
    authDomain: "jetle-app-f83d2.firebaseapp.com",
    projectId: "jetle-app-f83d2",
    storageBucket: "jetle-app-f83d2.firebasestorage.app",
    messagingSenderId: "480349498649",
    appId: "1:480349498649:web:a42def047ca8eecf31e988",
    measurementId: "G-P957G5999P"
  };

  function readJson(key, fallback) {
    if (window.JETLE_API && typeof window.JETLE_API.readSync === 'function') {
      return window.JETLE_API.readSync(key, fallback);
    }

    if (key === STORE.users || key === STORE.listings) {
      return Array.isArray(fallback) ? [] : null;
    }

    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    if (window.JETLE_API && typeof window.JETLE_API.writeSync === 'function') {
      window.JETLE_API.writeSync(key, value);
      return;
    }

    if (key === STORE.users || key === STORE.listings) {
      if (window.console && typeof window.console.warn === 'function') {
        console.warn('[JETLE][data]', key + ' sadece API uzerinden yazilabilir.');
      }
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  function getFirestoreInstance() {
    if (!window.firebase || !window.firebase.firestore) {
      return null;
    }

    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(FIREBASE_CONFIG);
    }

    return window.firebase.firestore();
  }

  function addDays(dateValue, days) {
    const date = new Date(dateValue);
    date.setDate(date.getDate() + Number(days || 0));
    return date.toISOString();
  }

  function normalizeListingModeration(listing) {
    const nextListing = Object.assign({}, listing || {});
    const rawStatus = String(nextListing.status || '').toLowerCase();
    const verification = String(nextListing.verification || '').toLowerCase();
    let status = rawStatus;

    if (status === 'beklemede' || status === 'bekliyor') status = 'pending';
    if (status === 'active' || status === 'verified' || status === 'yayında') status = 'approved';
    if (status === 'reddedildi') status = 'rejected';
    if (status === 'pasif') status = 'passive';

    if (!status) {
      if (verification === 'verified') status = 'approved';
      else if (verification === 'rejected') status = 'rejected';
      else status = 'pending';
    }

    nextListing.status = status;
    nextListing.moderationReason = String(nextListing.moderationReason || nextListing.rejectionReason || '').trim();
    nextListing.verification = status === 'approved' ? 'verified' : (status === 'rejected' ? 'rejected' : 'pending');
    return nextListing;
  }

  function normalizeUserRecord(user) {
    const nextUser = Object.assign({}, user || {});
    const rawRole = String(nextUser.role || '').toLowerCase();
    const rawStatus = String(nextUser.status || '').toLowerCase();

    if (rawRole === 'admin' || rawRole === 'store' || rawRole === 'user') {
      nextUser.role = rawRole;
    } else if (nextUser.profileType === 'store') {
      nextUser.role = 'store';
    } else {
      nextUser.role = 'user';
    }

    if (rawStatus === 'aktif') nextUser.status = 'active';
    else if (rawStatus === 'pasif' || rawStatus === 'donduruldu') nextUser.status = 'passive';
    else if (rawStatus === 'engelli') nextUser.status = 'blocked';
    else if (rawStatus === 'active' || rawStatus === 'passive' || rawStatus === 'blocked') nextUser.status = rawStatus;
    else nextUser.status = 'active';

    nextUser.adminNote = String(nextUser.adminNote || '').trim();
    nextUser.createdAt = nextUser.createdAt || new Date().toISOString();
    return nextUser;
  }


  // Base users, listings and ads are loaded from /data/*.json via api.js.

  function getUsers() { return readJson(STORE.users, []).map(normalizeUserRecord); }
  function saveUsers(users) { writeJson(STORE.users, (Array.isArray(users) ? users : []).map(normalizeUserRecord)); }

  function getListings() {
    return readJson(STORE.listings, []).map(normalizeListingModeration).sort(function (a, b) {
      if (Number(b.premium) !== Number(a.premium)) {
        return Number(b.premium) - Number(a.premium);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  function saveListings(listings) {
    listings = (Array.isArray(listings) ? listings : []).map(normalizeListingModeration);
    const previousListings = readJson(STORE.listings, []);
    const previousMap = {};
    const nextMap = {};
    const favoritesMap = getFavoritesMap();
    const listingFollowsMap = getListingFollowsMap();

    previousListings.forEach(function (item) {
      previousMap[item.id] = item;
    });

    listings.forEach(function (item) {
      nextMap[item.id] = item;
    });

    Object.keys(nextMap).forEach(function (listingId) {
      const previous = previousMap[listingId];
      const current = nextMap[listingId];
      if (!previous || !current) return;

      const previousPrice = Number(previous.price || 0);
      const currentPrice = Number(current.price || 0);
      if (currentPrice < previousPrice) {
        current.previousPrice = previousPrice;
        current.priceDroppedAt = new Date().toISOString();
        Object.keys(favoritesMap).forEach(function (userId) {
          const favoriteIds = Array.isArray(favoritesMap[userId]) ? favoritesMap[userId] : [];
          if (!favoriteIds.includes(listingId)) return;
          addNotification(userId, {
            type: 'price',
            title: 'Favori ilanınızın fiyatı düştü',
            text: '"' + (current.title || previous.title || 'İlan') + '" için fiyat ' + formatCurrency(previousPrice) + ' seviyesinden ' + formatCurrency(currentPrice) + ' seviyesine düştü.',
            listingId: listingId,
            href: 'ilan-detay.html?id=' + encodeURIComponent(listingId)
          });
        });
        Object.keys(listingFollowsMap).forEach(function (userId) {
          const followedIds = Array.isArray(listingFollowsMap[userId]) ? listingFollowsMap[userId] : [];
          if (!followedIds.includes(listingId)) return;
          addNotification(userId, {
            type: 'listing-follow-price',
            title: 'Takip ettiğiniz ilanın fiyatı değişti',
            text: '"' + (current.title || previous.title || 'İlan') + '" için fiyat ' + formatCurrency(previousPrice) + ' seviyesinden ' + formatCurrency(currentPrice) + ' seviyesine düştü.',
            listingId: listingId,
            href: 'ilan-detay.html?id=' + encodeURIComponent(listingId)
          });
        });
      } else if (currentPrice > previousPrice && current.previousPrice && Number(current.previousPrice) >= currentPrice) {
        delete current.previousPrice;
        delete current.priceDroppedAt;
      }

      const previousSnapshot = JSON.stringify({
        title: previous.title,
        description: previous.description,
        location: previous.location,
        category: previous.category,
        image: previous.image,
        images: previous.images,
        details: previous.details,
        verification: previous.verification,
        status: previous.status,
        moderationReason: previous.moderationReason
      });
      const currentSnapshot = JSON.stringify({
        title: current.title,
        description: current.description,
        location: current.location,
        category: current.category,
        image: current.image,
        images: current.images,
        details: current.details,
        verification: current.verification,
        status: current.status,
        moderationReason: current.moderationReason
      });
      if (previousSnapshot !== currentSnapshot) {
        Object.keys(listingFollowsMap).forEach(function (userId) {
          const followedIds = Array.isArray(listingFollowsMap[userId]) ? listingFollowsMap[userId] : [];
          if (!followedIds.includes(listingId)) return;
          addNotification(userId, {
            type: 'listing-follow-update',
            title: 'Takip ettiğiniz ilan güncellendi',
            text: '"' + (current.title || previous.title || 'İlan') + '" ilanında yeni bir güncelleme yapıldı.',
            listingId: listingId,
            href: 'ilan-detay.html?id=' + encodeURIComponent(listingId)
          });
        });
      }
    });

    Object.keys(previousMap).forEach(function (listingId) {
      if (nextMap[listingId]) return;
      const removedListing = previousMap[listingId];
      Object.keys(favoritesMap).forEach(function (userId) {
        const favoriteIds = Array.isArray(favoritesMap[userId]) ? favoritesMap[userId] : [];
        if (!favoriteIds.includes(listingId)) return;
        addNotification(userId, {
          type: 'removed',
          title: 'Favori ilan yayından kaldırıldı',
          text: '"' + (removedListing.title || 'İlan') + '" artık yayında değil.'
        });
      });
    });

    writeJson(STORE.listings, listings);
  }
  function getFavoritesMap() { return readJson(STORE.favorites, {}); }
  function saveFavoritesMap(data) { writeJson(STORE.favorites, data); }
  function getListingFollowsMap() { return readJson(STORE.listingFollows, {}); }
  function saveListingFollowsMap(data) { writeJson(STORE.listingFollows, data); }
  function getSavedSearchesMap() { return readJson(STORE.savedSearches, {}); }
  function saveSavedSearchesMap(data) { writeJson(STORE.savedSearches, data); }
  function getReports() { return readJson(STORE.reports, []); }
  function saveReports(data) { writeJson(STORE.reports, data); }
  function getConversations() { return readJson(STORE.conversations, []); }
  function saveConversations(data) { writeJson(STORE.conversations, data); }
  function getMessagesMap() { return readJson(STORE.messages, {}); }
  function saveMessagesMap(data) { writeJson(STORE.messages, data); }
  function getNotificationsMap() { return readJson(STORE.notifications, {}); }
  function saveNotificationsMap(data) { writeJson(STORE.notifications, data); }
  function getAds() { return readJson(STORE.ads, []); }
  function saveAds(data) { writeJson(STORE.ads, data); }
  function getPendingPayment() { return readJson(STORE.pendingPayment, null); }
  function savePendingPayment(data) { writeJson(STORE.pendingPayment, data); }
  function clearPendingPayment() {
    if (window.JETLE_API && typeof window.JETLE_API.removeSync === 'function') {
      window.JETLE_API.removeSync(STORE.pendingPayment);
      return;
    }
    localStorage.removeItem(STORE.pendingPayment);
  }
  function getRecentViews() { return readJson(STORE.recentViews, []); }
  function saveRecentViews(data) { writeJson(STORE.recentViews, data); }

  function getCategoryGroupByName(categoryName) {
    const selected = String(categoryName || '').toLowerCase().trim();
    if (!selected || selected === 'all') return 'all';

    const groupMatch = CATEGORY_GROUPS.find(function (group) {
      return String(group.title || '').toLowerCase() === selected ||
        (Array.isArray(group.aliases) && group.aliases.some(function (alias) { return String(alias).toLowerCase() === selected; }));
    });
    if (groupMatch) return groupMatch.title;

    const subCategoryMatch = CATEGORY_GROUPS.find(function (group) {
      return Array.isArray(group.items) && group.items.some(function (item) {
        return String(item.name || '').toLowerCase() === selected;
      });
    });

    return subCategoryMatch ? subCategoryMatch.title : categoryName;
  }

  function getCurrentUser() {
    const remembered = localStorage.getItem(STORE.remember);
    const session = sessionStorage.getItem(STORE.session);
    const legacy = localStorage.getItem('currentUser');
    const raw = remembered || session || legacy;
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function hasLegacyAdminAccess() {
    return localStorage.getItem('admin') === 'true';
  }

  function canAccessAdmin(user) {
    if (hasLegacyAdminAccess()) return true;
    return Boolean(user && user.role === 'admin');
  }

  function setCurrentUser(user, remember) {
    clearCurrentUser();
    const raw = JSON.stringify(user);
    localStorage.setItem('currentUser', raw);
    if (user && user.role === 'admin') {
      localStorage.setItem('admin', 'true');
    } else {
      localStorage.removeItem('admin');
    }
    if (remember) {
      localStorage.setItem(STORE.remember, raw);
    } else {
      sessionStorage.setItem(STORE.session, raw);
    }
  }

  function clearCurrentUser() {
    localStorage.removeItem(STORE.remember);
    sessionStorage.removeItem(STORE.session);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('admin');
  }

  function getUserNotifications(userId) {
    const map = getNotificationsMap();
    return Array.isArray(map[userId]) ? map[userId] : [];
  }

  function saveUserNotifications(userId, notifications) {
    const map = getNotificationsMap();
    map[userId] = notifications;
    saveNotificationsMap(map);
  }

  function addNotification(userId, notification) {
    if (!userId || !notification) return;
    const current = getUserNotifications(userId);
    current.unshift({
      id: notification.id || ('notif-' + Date.now() + '-' + Math.random().toString(16).slice(2, 6)),
      type: notification.type || 'info',
      title: notification.title || 'Yeni bildirim',
      text: notification.text || '',
      createdAt: notification.createdAt || new Date().toISOString(),
      read: false,
      href: notification.href || '',
      listingId: notification.listingId || '',
      conversationId: notification.conversationId || ''
    });
    saveUserNotifications(userId, current.slice(0, 50));
  }

  function getTrackedListingFollowers(listingId) {
    const followsMap = getListingFollowsMap();
    return Object.keys(followsMap).filter(function (userId) {
      const items = Array.isArray(followsMap[userId]) ? followsMap[userId] : [];
      return items.includes(listingId);
    });
  }

  function ensureUserNotifications(user) {
    if (!user || !user.id) return [];
    const existing = getUserNotifications(user.id);
    if (existing.length) return existing;

    const listings = getListings().filter(function (item) { return item.ownerId === user.id; });
    const conversations = getConversations().filter(function (item) {
      return Array.isArray(item.participants) && item.participants.includes(user.id);
    });
    const favoritesMap = getFavoritesMap();
    const totalFavoriteHits = Object.keys(favoritesMap).reduce(function (sum, key) {
      const items = Array.isArray(favoritesMap[key]) ? favoritesMap[key] : [];
      return sum + items.filter(function (listingId) {
        return listings.some(function (listing) { return listing.id === listingId; });
      }).length;
    }, 0);

    const baseNotifications = [
      {
        id: 'notif-views-' + user.id,
        type: 'views',
        title: 'İlanınız ilgi görüyor',
        text: 'İlanınız 10 kişi tarafından görüntülendi',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        read: false
      },
      {
        id: 'notif-message-' + user.id,
        type: 'message',
        title: 'Yeni mesaj aldınız',
        text: conversations.length ? 'İlanınız için yeni bir mesaj aldınız' : 'Yeni mesajlarınız için mesaj kutunuzu kontrol edin',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        read: false
      },
      {
        id: 'notif-favorite-' + user.id,
        type: 'favorite',
        title: 'Favori hareketi',
        text: (totalFavoriteHits || listings.length) ? 'Favori ilanınıza teklif geldi' : 'İlanınıza ilgi duyan kullanıcılar artıyor',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        read: false
      }
    ];

    saveUserNotifications(user.id, baseNotifications);
    return baseNotifications;
  }

  function getUnreadNotificationCount(userId) {
    return getUserNotifications(userId).filter(function (item) { return !item.read; }).length;
  }

  function markAllNotificationsRead(userId) {
    saveUserNotifications(userId, getUserNotifications(userId).map(function (item) {
      item.read = true;
      return item;
    }));
  }

  function getNotificationTypeLabel(type) {
    const map = {
      message: 'Yeni Mesaj',
      offer: 'Teklif',
      'listing-follow-message': 'Takip',
      price: 'Fiyat Düştü',
      'listing-follow-price': 'Fiyat Düştü',
      'listing-follow-update': 'İlan Güncellendi',
      'listing-approved': 'İlan Onayı'
    };
    return map[type] || 'Bildirim';
  }

  function getNotificationTypeClass(type) {
    const map = {
      message: 'message',
      offer: 'offer',
      'listing-follow-message': 'message',
      price: 'price',
      'listing-follow-price': 'price',
      'listing-follow-update': 'update',
      'listing-approved': 'approved'
    };
    return map[type] || 'default';
  }

  function getNotificationHref(item) {
    if (item && item.href) return item.href;
    if (item && item.conversationId) return 'mesajlar.html?conversation=' + encodeURIComponent(item.conversationId);
    if (item && item.listingId && (item.type === 'price' || item.type === 'listing-follow-price')) return 'ilan-detay.html?id=' + encodeURIComponent(item.listingId);
    if (item && item.listingId && (item.type === 'listing-approved' || item.type === 'listing-follow-update')) return 'ilan-detay.html?id=' + encodeURIComponent(item.listingId);
    if (item && item.type === 'message') return 'mesajlar.html';
    if (item && item.type === 'offer') return 'mesajlar.html';
    return 'bildirimler.html';
  }

  function buildNotificationDropdown(user) {
    const notifications = ensureUserNotifications(user).slice().sort(function (a, b) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, 3);
    const unreadCount = getUnreadNotificationCount(user.id);

    return '' +
      '<div class="notification-menu">' +
        '<button type="button" class="notification-toggle" id="notificationToggle" aria-label="Bildirimler">' +
          '<span class="notification-icon">🔔</span>' +
          (unreadCount ? '<span class="notification-count">' + unreadCount + '</span>' : '') +
        '</button>' +
        '<div class="notification-dropdown" id="notificationDropdown">' +
          '<div class="notification-head"><strong>Bildirimler</strong><a href="bildirimler.html" class="notification-link">Tümünü Gör</a></div>' +
          '<div class="notification-list">' +
            notifications.map(function (item) {
              return '<a href="' + escapeHtml(getNotificationHref(item)) + '" class="notification-item ' + (item.read ? '' : 'unread') + '">' +
                '<div class="notification-item-head"><strong>' + escapeHtml(item.title) + '</strong><span class="notification-item-time">' + escapeHtml(formatDateTime(item.createdAt)) + '</span></div>' +
                '<div class="notification-item-meta"><span class="notification-type-badge notification-type-' + escapeHtml(getNotificationTypeClass(item.type)) + '">' + escapeHtml(getNotificationTypeLabel(item.type)) + '</span>' + (item.read ? '' : '<span class="notification-unread-badge">Okunmadı</span>') + '</div>' +
                '<span>' + escapeHtml(item.text) + '</span>' +
              '</a>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderNotificationsPage() {
    const wrap = document.getElementById('notificationsList');
    const countEl = document.getElementById('notificationsCount');
    if (!wrap) return;

    const user = getCurrentUser();
    if (!user) {
      showToast('Bildirimler için giriş yapmalısınız.');
      setTimeout(function () { window.location.href = 'login.html'; }, 500);
      return;
    }

    const notifications = ensureUserNotifications(user).slice().sort(function (a, b) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (countEl) countEl.textContent = String(notifications.length);
    wrap.innerHTML = notifications.length ? notifications.map(function (item) {
      return '<a href="' + escapeHtml(getNotificationHref(item)) + '" class="panel notification-page-card ' + (item.read ? '' : 'unread') + '">' +
        '<div class="notification-page-card-head"><strong>' + escapeHtml(item.title) + '</strong><span>' + formatDateTime(item.createdAt) + '</span></div>' +
        '<div class="notification-page-card-meta"><span class="notification-type-badge notification-type-' + escapeHtml(getNotificationTypeClass(item.type)) + '">' + escapeHtml(getNotificationTypeLabel(item.type)) + '</span>' + (item.read ? '' : '<span class="notification-unread-badge">Okunmadı</span>') + '</div>' +
        '<p>' + escapeHtml(item.text) + '</p>' +
      '</a>';
    }).join('') : '<div class="empty-state"><h3>Bildiriminiz bulunmuyor</h3><p>Yeni hareketler olduğunda burada göreceksiniz.</p></div>';

    markAllNotificationsRead(user.id);
  }

  function getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function formatNumber(value) {
    const num = Number(value || 0);
    return num.toLocaleString('tr-TR');
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(value));
  }

  function formatDateTime(value) {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(value));
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2600);
  }

  function getAdStatusLabel(status, endAt) {
    if (status === 'passive') return 'Pasif';
    if (status === 'pending') return 'Onay bekliyor';
    if (new Date(endAt).getTime() < Date.now()) return 'Süresi doldu';
    return 'Aktif';
  }

  function isAdRenderable(ad) {
    if (!ad) return false;
    const now = Date.now();
    const startAt = ad.startAt ? new Date(ad.startAt).getTime() : 0;
    const endAt = ad.endAt ? new Date(ad.endAt).getTime() : Number.MAX_SAFE_INTEGER;
    return ad.status === 'active' && startAt <= now && endAt >= now;
  }

  function normalizeAdsPublication() {
    const now = Date.now();
    let changed = false;
    const nextAds = getAds().map(function (ad) {
      if (!ad.category) {
        ad.category = 'all';
        changed = true;
      }
      if (!ad.startAt || !ad.endAt) return ad;
      const startAt = new Date(ad.startAt).getTime();
      const endAt = new Date(ad.endAt).getTime();

      if ((ad.status === 'approved' || ad.status === 'scheduled') && startAt <= now && endAt >= now) {
        ad.status = 'active';
        changed = true;
      } else if (ad.status === 'active' && endAt < now) {
        ad.status = 'expired';
        changed = true;
      } else if ((ad.status === 'approved' || ad.status === 'active') && startAt > now) {
        ad.status = 'scheduled';
        changed = true;
      }
      return ad;
    });
    if (changed) saveAds(nextAds);
  }

  function getActiveAdsByPlacement(placement) {
    normalizeAdsPublication();
    return getAds().filter(function (ad) {
      return ad.placement === placement && isAdRenderable(ad);
    }).sort(function (a, b) {
      return new Date(a.endAt).getTime() - new Date(b.endAt).getTime();
    });
  }

  function getPrimaryAd(placement) {
    return getActiveAdsByPlacement(placement)[0] || null;
  }

  function trackAdImpression(adId) {
    if (!adId || impressionCache[adId]) return;
    impressionCache[adId] = true;
    saveAds(getAds().map(function (ad) {
      if (ad.id === adId) {
        ad.impressions = Number(ad.impressions || 0) + 1;
      }
      return ad;
    }));
  }

  function trackAdClick(adId) {
    if (!adId) return;
    saveAds(getAds().map(function (ad) {
      if (ad.id === adId) {
        ad.clicks = Number(ad.clicks || 0) + 1;
      }
      return ad;
    }));
  }

  function getAdContextCategories(context) {
    const categories = [];
    if (context && context.category && context.category !== 'all') {
      categories.push(context.category);
      categories.push(getCategoryGroupByName(context.category));
    }

    getRecentViews().forEach(function (item) {
      if (item.category) categories.push(item.category);
      if (item.categoryGroup) categories.push(item.categoryGroup);
    });

    return categories
      .map(function (item) { return String(item || '').trim(); })
      .filter(Boolean)
      .filter(function (item, index, array) { return array.indexOf(item) === index; });
  }

  function getContextualAdsByPlacement(placement, context) {
    const ads = getActiveAdsByPlacement(placement);
    const targets = getAdContextCategories(context).map(function (item) {
      return String(item || '').toLowerCase();
    });

    if (!targets.length) return ads;

    const matched = ads.filter(function (ad) {
      const category = String(ad.category || 'all').toLowerCase();
      const normalizedGroup = String(getCategoryGroupByName(ad.category || 'all') || 'all').toLowerCase();
      return category === 'all' || targets.includes(category) || targets.includes(normalizedGroup);
    });

    if (!matched.length) return ads;

    const specific = matched.filter(function (ad) {
      return String(ad.category || 'all').toLowerCase() !== 'all';
    });

    return specific.length ? specific : matched;
  }

  function pickRandomAd(ads) {
    if (!ads || !ads.length) return null;
    return ads[Math.floor(Math.random() * ads.length)];
  }

  function getSmartAd(placement, context) {
    return pickRandomAd(getContextualAdsByPlacement(placement, context));
  }

  function recordViewedListing(listing) {
    if (!listing || !listing.id) return;
    const nextViews = getRecentViews().filter(function (item) {
      return item && item.id !== listing.id;
    });
    nextViews.unshift({
      id: listing.id,
      category: listing.category || '',
      categoryGroup: getCategoryGroupByName(listing.categoryGroup || listing.category || ''),
      viewedAt: new Date().toISOString()
    });
    saveRecentViews(nextViews.slice(0, 12));
  }

  function buildSponsoredBanner(ad, fallback) {
    const item = ad || fallback;
    if (ad && ad.id) trackAdImpression(ad.id);
    return '' +
      (item.image ? '<span class="sponsored-banner-thumb"><img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" /></span>' : '') +
      '<span class="sponsored-tag">Sponsorlu</span>' +
      '<div class="sponsored-banner-copy"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.description) + '</span></div>' +
      '<span class="sponsored-banner-cta">' + escapeHtml(item.ctaText || 'İncele') + '</span>';
  }

  function buildHeader() {
    const headerAd = getSmartAd('header');
    return '' +
      '<div class="site-header-wrap">' +
        '<header class="site-header">' +
          '<div class="container header-inner header-inner--marketplace">' +
            '<a class="brand" href="index.html" aria-label="JETLE.COM Anasayfa">' +
              '<span class="brand-mark" aria-hidden="true">' +
                '<span class="brand-icon-lines"><span></span><span></span><span></span></span>' +
                '<span class="brand-icon-grid"><span></span><span></span><span></span><span></span></span>' +
              '</span>' +
              '<span class="brand-text"><strong>JETLE.COM</strong></span>' +
            '</a>' +
            '<form class="header-search header-search--wide" action="index.html" method="get">' +
              '<input type="search" id="headerSearchInput" name="q" placeholder="Kelime, ilan no veya mağaza adı ile ara" />' +
              '<button type="submit" class="btn btn-primary">Ara</button>' +
            '</form>' +
            '<button class="menu-toggle" id="menuToggle" type="button" aria-label="Menüyü aç">☰</button>' +
            '<div class="header-actions" id="headerActions">' +
              '<div class="auth-actions" id="navAuthArea"></div>' +
            '</div>' +
          '</div>' +
        '</header>' +
        '<div class="header-ad-band">' +
          '<div class="container">' +
            '<a href="' + escapeHtml((headerAd && headerAd.ctaUrl) || 'reklam-ver.html') + '" class="sponsored-banner sponsored-banner-top" data-ad-click-id="' + escapeHtml((headerAd && headerAd.id) || '') + '">' +
              buildSponsoredBanner(headerAd, { title: '728x90 Google Ads ve Premium Banner Alanı', description: 'Header altında yüksek görünürlüklü reklam alanında markanızı öne çıkarın.', ctaText: 'Reklam ver' }) +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function buildFooter() {
    return '' +
      '<footer class="footer">' +
        '<div class="footer-container">' +
          '<div class="footer-col">' +
            '<h4>Kurumsal</h4>' +
            '<a href="hakkimizda.html">Hakkımızda</a>' +
            '<a href="index.html">Sürdürülebilirlik</a>' +
            '<a href="index.html">İnsan Kaynakları</a>' +
            '<a href="index.html">Haberler</a>' +
            '<a href="index.html">Site Haritası</a>' +
            '<a href="index.html">İletişim</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Hizmetlerimiz</h4>' +
            '<a href="doping.html">Doping</a>' +
            '<a href="premium.html">Premium</a>' +
            '<a href="reklam.html">Reklam</a>' +
            '<a href="premium.html">Güvenli Ödeme</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Mağazalar</h4>' +
            '<a href="index.html">Neden Mağaza?</a>' +
            '<a href="index.html">Mağaza Açmak İstiyorum</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Gizlilik ve Kullanım</h4>' +
            '<a href="kvkk.html">KVKK Aydınlatma Metni</a>' +
            '<a href="gizlilik.html">Gizlilik Politikası</a>' +
            '<a href="sozlesme.html#kullanici">Kullanım Koşulları</a>' +
            '<a href="sozlesme.html#mesafeli">Mesafeli Satış Sözleşmesi</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Bizi Takip Edin</h4>' +
            '<a href="index.html">Instagram</a>' +
            '<a href="index.html">X</a>' +
            '<a href="index.html">YouTube</a>' +
            '<a href="index.html">LinkedIn</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>© 2026 JETLE.COM - Tüm hakları saklıdır.</p>' +
          '<div class="footer-security-line"><span>SSL Güvenli Ödeme</span><span> | 3D Secure</span></div>' +
        '</div>' +
      '</footer>';
  }

  function renderHeaderAndFooter() {
    const appHeader = document.getElementById('appHeader');
    const appFooter = document.getElementById('appFooter');
    if (appHeader) appHeader.innerHTML = buildHeader();
    if (appFooter) appFooter.innerHTML = buildFooter();
  }

  function renderNavAuth() {
    const area = document.getElementById('navAuthArea');
    if (!area) return;
    const user = getCurrentUser();
    const linkMesaj = '<a href="mesajlar.html" class="header-link">Mesajlar</a>';
    const linkFav = '<a href="favoriler.html" class="header-link">Favoriler</a>';
    if (user) {
      area.innerHTML = linkMesaj + linkFav + buildNotificationDropdown(user) +
        '<a href="panel.html" class="header-link header-link-profile" title="Hesabım">' + escapeHtml(user.name || 'Profil') + '</a>' +
        '<a href="ilan-ver.html" class="btn btn-primary btn-ilan-ver">İlan Ver</a>' +
        '<button type="button" class="header-link header-link-logout" id="logoutBtn">Çıkış</button>';
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          clearCurrentUser();
          showToast('Çıkış yapıldı.');
          setTimeout(function () { window.location.href = 'index.html'; }, 400);
        });
      }
    } else {
      area.innerHTML = linkMesaj + linkFav +
        '<a href="login.html" class="header-link">Giriş</a>' +
        '<a href="register.html" class="header-link">Kayıt Ol</a>' +
        '<a href="ilan-ver.html" class="btn btn-primary btn-ilan-ver">İlan Ver</a>';
    }
  }

  function safeRun(label, task) {
    try {
      return task();
    } catch (error) {
      if (window.console && typeof window.console.warn === 'function') {
        console.warn('[JETLE][' + label + ']', error);
      }
      return null;
    }
  }

  function bindHeaderState() {
    const headerSearchInput = document.getElementById('headerSearchInput');
    const menuToggle = document.getElementById('menuToggle');
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationDropdown = document.getElementById('notificationDropdown');
    if (headerSearchInput) {
      headerSearchInput.value = getQueryParam('q') || '';
    }
    const headerActions = document.getElementById('headerActions');
    if (menuToggle && headerActions) {
      menuToggle.addEventListener('click', function () {
        headerActions.classList.toggle('open');
      });
    }
    if (notificationToggle && notificationDropdown) {
      notificationToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        notificationDropdown.classList.toggle('open');
      });
      document.addEventListener('click', function (event) {
        if (!event.target.closest('.notification-menu')) {
          notificationDropdown.classList.remove('open');
        }
      });
    }
  }

  function buildSidebarAdCard(ad) {
    const item = ad || { title: 'Sidebar reklam alanı', description: 'Scroll boyunca görünür sponsorlu reklam alanında markanızı öne çıkarın.', ctaText: 'Reklam ver' };
    if (ad && ad.id) trackAdImpression(ad.id);
    return '' +
      '<article class="panel sponsored-card sponsored-card-sticky">' +
        '<span class="sponsored-tag">Sponsorlu</span>' +
        (item.image
          ? '<a href="' + escapeHtml(item.ctaUrl || 'reklam-ver.html') + '" class="sponsored-card-media" data-ad-click-id="' + escapeHtml(item.id || '') + '"><img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" /></a>'
          : '<a href="' + escapeHtml(item.ctaUrl || 'reklam-ver.html') + '" class="sponsored-card-icon" data-ad-click-id="' + escapeHtml(item.id || '') + '">ADS</a>') +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p>' + escapeHtml(item.description) + '</p>' +
        '<a href="' + escapeHtml(item.ctaUrl || 'reklam-ver.html') + '" class="btn btn-light" data-ad-click-id="' + escapeHtml(item.id || '') + '">' + escapeHtml(item.ctaText || 'İncele') + '</a>' +
      '</article>';
  }

  function renderSidebarAd() {
    const container = document.getElementById('homeSidebarAd');
    if (!container) return;
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    container.innerHTML = buildSidebarAdCard(getSmartAd('sidebar', { category: selectedCategory }));
  }

  function getPlacementLabel(placement) {
    const labels = {
      header: 'Header Altı',
      sidebar: 'Sidebar',
      inline: 'İlan Arası Native',
      footer: 'Footer Üstü',
      'detail-side': 'Detay Sağ Alan',
      'detail-inline': 'Detay İçerik Altı'
    };
    return labels[placement] || placement;
  }

  function getRequestStatusLabel(status) {
    const labels = {
      bekliyor: 'Bekliyor',
      onaylandi: 'Onaylandı',
      reddedildi: 'Reddedildi'
    };
    return labels[status] || 'Bekliyor';
  }

  function getNextRequestStatus(status) {
    if (status === 'bekliyor') return 'onaylandi';
    if (status === 'onaylandi') return 'reddedildi';
    return 'bekliyor';
  }

  function formatFirestoreDate(value) {
    if (!value) return '-';
    if (value.toDate) return formatDate(value.toDate());
    return formatDate(value);
  }

  function buildAdminRequestsTable(requests) {
    if (!requests.length) {
      return '<div class="empty-state"><h3>Kayıtlı reklam talebi bulunmuyor</h3><p>Formdan gelen başvurular burada listelenecek.</p></div>';
    }

    return '' +
      '<div class="table-wrap">' +
        '<table class="admin-table">' +
          '<thead><tr><th>Ad Soyad</th><th>Email</th><th>Telefon</th><th>Firma</th><th>Reklam Türü</th><th>Tarih</th><th>Durum</th><th>İşlem</th></tr></thead>' +
          '<tbody>' +
            requests.map(function (request) {
              return '<tr>' +
                '<td><strong>' + escapeHtml(request.ad_soyad || request.ad || '-') + '</strong></td>' +
                '<td>' + escapeHtml(request.email || '-') + '</td>' +
                '<td>' + escapeHtml(request.telefon || '-') + '</td>' +
                '<td>' + escapeHtml(request.firma_adi || '-') + '</td>' +
                '<td>' + escapeHtml(request.reklam_turu || request.paket || '-') + '</td>' +
                '<td>' + formatFirestoreDate(request.tarih) + '</td>' +
                '<td><span class="table-status table-status-' + (request.durum || 'bekliyor') + '">' + getRequestStatusLabel(request.durum) + '</span></td>' +
                '<td class="table-actions"><button type="button" class="btn btn-light" data-request-id="' + request.id + '" data-request-status="' + (request.durum || 'bekliyor') + '">İşaretle</button></td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>';
  }

  function initAdFormPage() {
    const form = document.getElementById('adRequestForm');
    if (!form) return;
    const typeInput = document.getElementById('adType');
    const db = getFirestoreInstance();

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const payload = {
        id: 'lead' + Date.now(),
        ad_soyad: document.getElementById('adContactName').value.trim(),
        email: document.getElementById('adEmail').value.trim(),
        telefon: document.getElementById('adPhone').value.trim(),
        firma_adi: document.getElementById('adCompany').value.trim(),
        reklam_turu: typeInput.value.trim(),
        aciklama: (document.getElementById('adNote') || { value: '' }).value.trim(),
        tarih: new Date(),
        durum: 'bekliyor'
      };

      if (!payload.ad_soyad || !payload.email || !payload.telefon || !payload.firma_adi || !payload.reklam_turu || !payload.aciklama) {
        showToast('Lütfen zorunlu alanları doldurun.');
        return;
      }

      const nextAds = getAds().concat({
        id: payload.id,
        advertiser: payload.firma_adi,
        contact: payload.ad_soyad,
        email: payload.email,
        phone: payload.telefon,
        adType: payload.reklam_turu,
        title: payload.reklam_turu + ' Talebi',
        description: payload.aciklama,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      saveAds(nextAds);

      if (db) {
        try {
          await db.collection('reklam_talepleri').add(payload);
        } catch (error) {
          // Firestore başarısız olsa da yerel reklam talebi saklanır.
        }
      }

      showToast('Reklam talebiniz kaydedildi. En kısa sürede size dönüş yapacağız.');
      form.reset();
    });
  }

  function initAdminAdsPage() {
    const wrap = document.getElementById('adminAdsTableWrap');
    if (!wrap) return;

    const user = getCurrentUser();
    const currentAdmin = user ? getUsers().find(function (item) { return item.id === user.id; }) : null;
    if (!canAccessAdmin(currentAdmin || user)) {
      showToast('Admin paneli için giriş yapmalısınız.');
      setTimeout(function () { window.location.href = 'login.html'; }, 500);
      return;
    }

    const db = getFirestoreInstance();
    if (!db) {
      wrap.innerHTML = '<div class="empty-state"><h3>Firestore bağlantısı kurulamadı</h3><p>Admin verileri şu anda yüklenemiyor.</p></div>';
      return;
    }

    db.collection('reklam_talepleri').orderBy('tarih', 'desc').onSnapshot(function (snapshot) {
      const requests = snapshot.docs.map(function (doc) {
        return Object.assign({ id: doc.id }, doc.data());
      });
      wrap.innerHTML = buildAdminRequestsTable(requests);
    }, function () {
      wrap.innerHTML = '<div class="empty-state"><h3>Reklam talepleri yüklenemedi</h3><p>Lütfen Firestore bağlantınızı ve güvenlik kurallarınızı kontrol edin.</p></div>';
    });

      wrap.addEventListener('click', async function (event) {
        const button = event.target.closest('[data-request-id]');
        if (!button) return;

      const requestId = button.dataset.requestId;
      const currentStatus = button.dataset.requestStatus || 'bekliyor';
      const nextStatus = getNextRequestStatus(currentStatus);

      try {
        await db.collection('reklam_talepleri').doc(requestId).update({ durum: nextStatus });
        showToast('Talep durumu güncellendi.');
        } catch (error) {
          showToast('Durum güncellenirken hata oluştu.');
        }
      });
  }

  function buildAdminTableRowActions(type, id) {
    if (type === 'listing') {
      return '<div class="admin-table-actions">' +
        '<button type="button" class="btn btn-light btn-small" data-admin-action="approve-listing" data-id="' + id + '">Onayla</button>' +
        '<button type="button" class="btn btn-light btn-small" data-admin-action="passive-listing" data-id="' + id + '">Pasife Al</button>' +
        '<button type="button" class="btn btn-light btn-small" data-admin-action="reject-listing" data-id="' + id + '">Reddet</button>' +
        '<button type="button" class="btn btn-danger btn-small" data-admin-action="delete-listing" data-id="' + id + '">Sil</button>' +
      '</div>';
    }

    if (type === 'ad') {
      return '<div class="admin-table-actions">' +
        '<button type="button" class="btn btn-light btn-small" data-admin-action="approve-ad" data-id="' + id + '">Onayla</button>' +
        '<button type="button" class="btn btn-danger btn-small" data-admin-action="reject-ad" data-id="' + id + '">Reddet</button>' +
      '</div>';
    }

    return '<div class="admin-table-actions">' +
      '<button type="button" class="btn btn-danger btn-small" data-admin-action="delete-user" data-id="' + id + '">Kullanıcı Sil</button>' +
    '</div>';
  }

  function buildAdminListingsTable(listings) {
    if (!listings.length) {
      return '<div class="empty-state"><h3>Kayıtlı ilan bulunmuyor</h3><p>Yeni ilanlar burada listelenecek.</p></div>';
    }

    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>İlan Başlığı</th><th>Kullanıcı</th><th>Durum</th><th>Red Sebebi</th><th>İşlem</th></tr></thead><tbody>' +
      listings.map(function (listing) {
        const status = String(listing.status || '').toLowerCase() === 'pending' || String(listing.status || '').toLowerCase() === 'bekliyor'
          ? 'beklemede'
          : (String(listing.status || '').toLowerCase() || 'yayında');
        const statusLabel = status === 'beklemede'
          ? 'Beklemede'
          : status === 'reddedildi'
            ? 'Reddedildi'
            : status === 'pasif'
              ? 'Pasif'
              : 'Yayında';
        return '<tr>' +
          '<td>' + escapeHtml(listing.title) + '</td>' +
          '<td>' + escapeHtml(listing.ownerName || 'Kullanıcı') + '</td>' +
          '<td><span class="admin-status-chip status-' + status + '">' + statusLabel + '</span></td>' +
          '<td><div class="admin-reason-field"><select data-admin-reason="' + listing.id + '"><option value=\"\">Sebep seçin</option><option value=\"Eksik bilgi\"' + ((listing.moderationReason || '') === 'Eksik bilgi' ? ' selected' : '') + '>Eksik bilgi</option><option value=\"Yanlış kategori\"' + ((listing.moderationReason || '') === 'Yanlış kategori' ? ' selected' : '') + '>Yanlış kategori</option><option value=\"Uygunsuz içerik\"' + ((listing.moderationReason || '') === 'Uygunsuz içerik' ? ' selected' : '') + '>Uygunsuz içerik</option></select>' + (listing.moderationReason ? '<small>' + escapeHtml(listing.moderationReason) + '</small>' : '') + '</div></td>' +
          '<td>' + buildAdminTableRowActions('listing', listing.id) + '</td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  function buildAdminPendingListingsCards(listings) {
    if (!listings.length) {
      return '<div class="empty-state compact-empty-state"><h3>Bekleyen ilan yok</h3><p>İnceleme bekleyen yeni ilanlar burada görünecek.</p></div>';
    }

    return '<section class="admin-pending-review"><div class="admin-section-head"><div><h3>Bekleyen İlanlar</h3><p>Sadece moderasyon bekleyen ilanlar listelenir. Hızlı aksiyonlarla karar verebilirsiniz.</p></div></div><div class="admin-pending-grid">' +
      listings.map(function (listing) {
        const coverImage = (listing.images && listing.images[0]) || listing.image || 'https://placehold.co/800x600?text=JETLE';
        const sellerName = listing.storeName || listing.ownerName || 'Kullanıcı';
        const detailUrl = 'ilan-detay.html?' + (listing.slug ? ('slug=' + encodeURIComponent(listing.slug)) : ('id=' + encodeURIComponent(listing.id)));
        return '<article class="admin-pending-card">' +
          '<div class="admin-pending-card-media">' + (coverImage ? '<img src="' + escapeHtml(coverImage) + '" alt="' + escapeHtml(listing.title || 'İlan') + '" />' : '') + '</div>' +
          '<div class="admin-pending-card-body">' +
            '<span class="admin-status-chip status-beklemede">Beklemede</span>' +
            '<h4>' + escapeHtml(listing.title || 'İlan') + '</h4>' +
            '<div class="admin-pending-card-meta"><span>' + escapeHtml(listing.category || 'Kategori belirtilmedi') + '</span><span>' + escapeHtml(sellerName) + '</span><span>' + formatDate(listing.createdAt || new Date().toISOString()) + '</span></div>' +
            '<div class="admin-pending-card-actions">' +
              '<button type="button" class="btn btn-primary btn-small" data-admin-action="approve-listing" data-id="' + listing.id + '">Onayla</button>' +
              '<button type="button" class="btn btn-light btn-small" data-admin-action="reject-listing" data-id="' + listing.id + '">Reddet</button>' +
              '<a href="' + detailUrl + '" class="btn btn-light btn-small">Detayı Aç</a>' +
            '</div>' +
          '</div>' +
        '</article>';
      }).join('') +
    '</div></section>';
  }

  function buildAdminAdsLocalTable(ads) {
    if (!ads.length) {
      return '<div class="empty-state"><h3>Reklam talebi bulunmuyor</h3><p>Reklam kayıtları burada listelenecek.</p></div>';
    }

    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Ad Soyad</th><th>Email</th><th>Telefon</th><th>Firma Adı</th><th>Reklam Türü</th><th>Gösterim</th><th>Tıklama</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>' +
      ads.map(function (ad) {
        const status = ad.status === 'active'
          ? 'onaylandi'
          : ad.status === 'approved'
            ? 'onaylandi'
            : ad.status === 'rejected'
              ? 'reddedildi'
              : ad.status === 'expired'
                ? 'reddedildi'
                : 'bekliyor';
        return '<tr>' +
          '<td>' + escapeHtml(ad.contact || '-') + '</td>' +
          '<td>' + escapeHtml(ad.email || '-') + '</td>' +
          '<td>' + escapeHtml(ad.phone || '-') + '</td>' +
          '<td>' + escapeHtml(ad.advertiser || 'Firma') + '</td>' +
          '<td>' + escapeHtml(ad.adType || 'Reklam Talebi') + '</td>' +
          '<td>' + Number(ad.impressions || 0) + '</td>' +
          '<td>' + Number(ad.clicks || 0) + '</td>' +
          '<td><span class="admin-status-chip status-' + status + '">' + getRequestStatusLabel(status) + '</span></td>' +
          '<td>' + buildAdminTableRowActions('ad', ad.id) + '</td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  function buildAdminUsersTable(users) {
    if (!users.length) {
      return '<div class="empty-state"><h3>Kullanıcı bulunmuyor</h3><p>Kayıt olan kullanıcılar burada listelenecek.</p></div>';
    }

    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Kullanıcı</th><th>E-posta</th><th>Telefon</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>' +
      users.map(function (user) {
        const status = user.status === 'donduruldu' ? 'bekliyor' : 'yayında';
        return '<tr>' +
          '<td>' + escapeHtml(user.name || 'Kullanıcı') + '</td>' +
          '<td>' + escapeHtml(user.email || '-') + '</td>' +
          '<td>' + escapeHtml(user.phone || '-') + '</td>' +
          '<td><span class="admin-status-chip status-' + status + '">' + (status === 'bekliyor' ? 'Pasif' : 'Aktif') + '</span></td>' +
          '<td>' + buildAdminTableRowActions('user', user.id) + '</td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  function buildAdminReportsTable(reports, listings, users) {
    if (!reports.length) {
      return '<div class="empty-state"><h3>Şikayet bulunmuyor</h3><p>İlan detay sayfasından gönderilen şikayetler burada listelenecek.</p></div>';
    }

    const listingMap = {};
    const userMap = {};

    listings.forEach(function (item) {
      listingMap[item.id] = item;
    });

    users.forEach(function (item) {
      userMap[item.id] = item;
    });

    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>İlan</th><th>Sebep</th><th>Şikayet Eden</th><th>Durum</th><th>Tarih</th><th>Not</th></tr></thead><tbody>' +
      reports.slice().sort(function (a, b) {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }).map(function (report) {
        const listing = listingMap[report.listingId] || null;
        const reporter = userMap[report.reporterId] || null;
        const listingTitle = report.listingTitle || (listing && listing.title) || 'İlan bulunamadı';
        const listingCategory = report.listingCategory || (listing && listing.category) || '-';
        const reporterName = report.reporterName || (reporter && reporter.name) || 'Misafir kullanıcı';
        const reporterEmail = report.reporterEmail || (reporter && reporter.email) || '-';
        const note = report.note ? JETLE.escapeHtml(report.note) : 'Ek açıklama girilmedi.';

        return '<tr>' +
          '<td><strong>' + JETLE.escapeHtml(listingTitle) + '</strong><span class="table-subline">' + JETLE.escapeHtml(listingCategory) + '</span>' + (report.listingId ? '<span class="table-subline"><a href="ilan-detay.html?id=' + encodeURIComponent(report.listingId) + '">İlanı aç</a></span>' : '') + '</td>' +
          '<td><span class="admin-status-chip status-beklemede">' + JETLE.escapeHtml(report.reasonLabel || report.reason || 'Şikayet') + '</span></td>' +
          '<td><strong>' + JETLE.escapeHtml(reporterName) + '</strong><span class="table-subline">' + JETLE.escapeHtml(reporterEmail) + '</span></td>' +
          '<td><span class="admin-status-chip status-beklemede">' + JETLE.escapeHtml(report.status || 'beklemede') + '</span></td>' +
          '<td>' + formatDate(report.createdAt) + '</td>' +
          '<td><div class="admin-report-detail"><p>' + note + '</p></div></td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  function initAdminDashboardPage() {
    const currentUser = getCurrentUser();
    const currentAdmin = currentUser ? getUsers().find(function (item) { return item.id === currentUser.id; }) : null;
    if (!canAccessAdmin(currentAdmin || currentUser)) {
      window.location.href = "index.html";
      return;
    }

    const totalListingsEl = document.getElementById('adminTotalListings');
    const premiumListingsEl = document.getElementById('adminPremiumListings');
    const totalUsersEl = document.getElementById('adminTotalUsers');
    const totalAdImpressionsEl = document.getElementById('adminTotalAdImpressions');
    const totalAdClicksEl = document.getElementById('adminTotalAdClicks');
    const pendingListingsWrap = document.getElementById('adminPendingListingsWrap');
    const listingsWrap = document.getElementById('adminListingsWrap');
    const reportsWrap = document.getElementById('adminReportsWrap');
    const adsWrap = document.getElementById('adminAdsWrap');
    const usersWrap = document.getElementById('adminUsersWrap');
    const adminAdForm = document.getElementById('adminAdForm');

    if (!totalListingsEl || !premiumListingsEl || !totalUsersEl || !pendingListingsWrap || !listingsWrap || !reportsWrap || !adsWrap || !usersWrap) return;

    function render() {
      normalizeAdsPublication();
      const listings = getListings();
      const pendingListings = listings.filter(function (item) {
        const status = String(item.status || '').toLowerCase();
        return status === 'beklemede' || status === 'pending' || status === 'bekliyor';
      });
      const ads = getAds();
      const users = getUsers();
      const reports = getReports();
      const totalAdImpressions = ads.reduce(function (sum, item) { return sum + Number(item.impressions || 0); }, 0);
      const totalAdClicks = ads.reduce(function (sum, item) { return sum + Number(item.clicks || 0); }, 0);

      totalListingsEl.textContent = String(listings.length);
      premiumListingsEl.textContent = String(listings.filter(function (item) { return item.premium; }).length);
      totalUsersEl.textContent = String(users.length);
      if (totalAdImpressionsEl) totalAdImpressionsEl.textContent = String(totalAdImpressions);
      if (totalAdClicksEl) totalAdClicksEl.textContent = String(totalAdClicks);

      pendingListingsWrap.innerHTML = buildAdminPendingListingsCards(pendingListings);
      listingsWrap.innerHTML = buildAdminListingsTable(listings);
      reportsWrap.innerHTML = buildAdminReportsTable(reports, listings, users);
      adsWrap.innerHTML = buildAdminAdsLocalTable(ads);
      usersWrap.innerHTML = buildAdminUsersTable(users);
    }

    if (adminAdForm) {
      adminAdForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const imageInput = document.getElementById('adminAdImage');
        const file = imageInput && imageInput.files && imageInput.files[0];
        if (!file) {
          showToast('Lütfen reklam görseli yükleyin.');
          return;
        }

        const startDate = document.getElementById('adminAdStart').value;
        const endDate = document.getElementById('adminAdEnd').value;
        if (!startDate || !endDate || new Date(endDate).getTime() < new Date(startDate).getTime()) {
          showToast('Başlangıç ve bitiş tarihini doğru girin.');
          return;
        }

        const reader = new FileReader();
        reader.onload = function (loadEvent) {
          const placement = document.getElementById('adminAdPlacement').value;
          const newAd = {
            id: 'admin-ad-' + Date.now(),
            advertiser: 'JETLE Admin',
            contact: 'Admin',
            email: 'admin@jetle.com',
            phone: '-',
            adType: placement === 'inline' ? 'Sponsorlu ilan' : 'Banner',
            title: document.getElementById('adminAdTitle').value.trim(),
            description: document.getElementById('adminAdDescription').value.trim(),
            image: String(loadEvent.target.result || ''),
            ctaText: 'İncele',
            ctaUrl: document.getElementById('adminAdLink').value.trim(),
            placement: placement,
            category: 'all',
            packageType: placement === 'inline' ? 'Liste Üstü / Sponsorlu' : 'Banner',
            price: 0,
            impressions: 0,
            clicks: 0,
            durationDays: Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1),
            startAt: new Date(startDate + 'T00:00:00').toISOString(),
            endAt: new Date(endDate + 'T23:59:59').toISOString(),
            status: 'scheduled',
            createdAt: new Date().toISOString()
          };

          saveAds(getAds().concat(newAd));
          normalizeAdsPublication();
          adminAdForm.reset();
          showToast('Reklam kaydedildi. Tarihi geldiğinde otomatik yayınlanacak.');
          render();
        };
        reader.readAsDataURL(file);
      });
    }

    document.addEventListener('click', function (event) {
      const button = event.target.closest('[data-admin-action]');
      if (!button) return;

      const action = button.dataset.adminAction;
      const id = button.dataset.id;

      if (action === 'approve-listing') {
        saveListings(getListings().map(function (item) {
          if (item.id === id) {
            addNotification(item.ownerId, {
              type: 'listing-approved',
              title: 'İlanınız yayına alındı',
              text: '"' + (item.title || 'İlanınız') + '" artık yayında.',
              listingId: item.id,
              href: 'ilan-detay.html?id=' + encodeURIComponent(item.id)
            });
            item.status = 'yayında';
            item.verification = 'verified';
            item.moderationReason = '';
          }
          return item;
        }));
        showToast('İlan onaylandı.');
      }

      if (action === 'passive-listing') {
        saveListings(getListings().map(function (item) {
          if (item.id === id) {
            item.status = 'pasif';
            item.verification = 'pending';
          }
          return item;
        }));
        showToast('İlan pasife alındı.');
      }

      if (action === 'reject-listing') {
        const reasonSelect = document.querySelector('[data-admin-reason="' + id + '"]');
        const reason = reasonSelect ? String(reasonSelect.value || '').trim() : '';
        saveListings(getListings().map(function (item) {
          if (item.id === id) {
            addNotification(item.ownerId, {
              type: 'listing-rejected',
              title: 'İlanınız reddedildi',
              text: '"' + (item.title || 'İlanınız') + '" için neden: ' + (reason || 'Eksik bilgi')
            });
            item.status = 'reddedildi';
            item.verification = 'rejected';
            item.moderationReason = reason || 'Eksik bilgi';
          }
          return item;
        }));
        showToast('İlan reddedildi.');
      }

      if (action === 'delete-listing') {
        saveListings(getListings().filter(function (item) {
          return item.id !== id;
        }));
        showToast('İlan silindi.');
      }

      if (action === 'approve-ad') {
        saveAds(getAds().map(function (item) {
          if (item.id === id) {
            item.status = 'approved';
          }
          return item;
        }));
        normalizeAdsPublication();
        showToast('Reklam talebi onaylandı.');
      }

      if (action === 'reject-ad') {
        saveAds(getAds().map(function (item) {
          if (item.id === id) item.status = 'rejected';
          return item;
        }));
        showToast('Reklam talebi reddedildi.');
      }

      if (action === 'delete-user') {
        saveUsers(getUsers().filter(function (item) {
          return item.id !== id;
        }));
        saveListings(getListings().filter(function (item) {
          return item.ownerId !== id;
        }));
        showToast('Kullanıcı silindi.');
      }

      render();
    });

    render();
  }

  const jetleReady = window.JETLE_API && window.JETLE_API.ready
    ? window.JETLE_API.ready
    : Promise.resolve();

  window.JETLE = {
    STORE: STORE,
    CATEGORIES: CATEGORIES,
    CATEGORY_GROUPS: CATEGORY_GROUPS,
    FEATURED_SECTIONS: FEATURED_SECTIONS,
    AD_PACKAGE_MAP: AD_PACKAGE_MAP,
    getUsers: getUsers,
    saveUsers: saveUsers,
    getListings: getListings,
    saveListings: saveListings,
    getFavoritesMap: getFavoritesMap,
    saveFavoritesMap: saveFavoritesMap,
    getListingFollowsMap: getListingFollowsMap,
    saveListingFollowsMap: saveListingFollowsMap,
    getSavedSearchesMap: getSavedSearchesMap,
    saveSavedSearchesMap: saveSavedSearchesMap,
    getReports: getReports,
    saveReports: saveReports,
    getConversations: getConversations,
    saveConversations: saveConversations,
    getMessagesMap: getMessagesMap,
    saveMessagesMap: saveMessagesMap,
    getNotificationsMap: getNotificationsMap,
    saveNotificationsMap: saveNotificationsMap,
    getAds: getAds,
    saveAds: saveAds,
    getPendingPayment: getPendingPayment,
    savePendingPayment: savePendingPayment,
    clearPendingPayment: clearPendingPayment,
    getRecentViews: getRecentViews,
    getActiveAdsByPlacement: getActiveAdsByPlacement,
    getContextualAdsByPlacement: getContextualAdsByPlacement,
    getPrimaryAd: getPrimaryAd,
    getSmartAd: getSmartAd,
    getAdStatusLabel: getAdStatusLabel,
    getPlacementLabel: getPlacementLabel,
    getCategoryGroupByName: getCategoryGroupByName,
    recordViewedListing: recordViewedListing,
    ensureUserNotifications: ensureUserNotifications,
    addNotification: addNotification,
    getTrackedListingFollowers: getTrackedListingFollowers,
    renderNotificationsPage: renderNotificationsPage,
    trackAdImpression: trackAdImpression,
    trackAdClick: trackAdClick,
    getCurrentUser: getCurrentUser,
    canAccessAdmin: canAccessAdmin,
    setCurrentUser: setCurrentUser,
    clearCurrentUser: clearCurrentUser,
    ready: jetleReady,
    whenReady: function () { return jetleReady; },
    getQueryParam: getQueryParam,
    formatCurrency: formatCurrency,
    formatNumber: formatNumber,
    formatDate: formatDate,
    formatDateTime: formatDateTime,
    escapeHtml: escapeHtml,
    showToast: showToast,
    renderNavAuth: renderNavAuth,
    renderSidebarAd: renderSidebarAd
  };

  document.addEventListener('DOMContentLoaded', function () {
    jetleReady.then(function () {
      safeRun('render-header-footer', renderHeaderAndFooter);
      safeRun('render-nav-auth', renderNavAuth);
      safeRun('bind-header-state', bindHeaderState);
      safeRun('render-sidebar-ad', renderSidebarAd);

      document.addEventListener('click', function (event) {
        const adLink = event.target.closest('[data-ad-click-id]');
        if (!adLink) return;
        const adId = adLink.getAttribute('data-ad-click-id');
        if (adId) trackAdClick(adId);
      });

      const page = document.body.dataset.page;
      if (page === 'notifications') safeRun('notifications-page', renderNotificationsPage);
      if (page === 'ad-form') safeRun('ad-form-page', initAdFormPage);
    });
  });
})();



