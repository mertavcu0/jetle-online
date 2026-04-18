(function () {
  function ensureDevelopmentAdminSession() {
    const currentUser = JETLE.getCurrentUser ? JETLE.getCurrentUser() : null;
    if (currentUser) return;

    const devAdminUser = {
      id: 'u1',
      name: 'Admin',
      role: 'admin',
      status: 'active'
    };

    localStorage.setItem('currentUser', JSON.stringify(devAdminUser));
    localStorage.setItem('admin', 'true');

    if (JETLE.setCurrentUser) {
      JETLE.setCurrentUser(devAdminUser, true);
    }
  }

  function getActiveAdminUser() {
    ensureDevelopmentAdminSession();

    const currentUser = JETLE.getCurrentUser ? JETLE.getCurrentUser() : null;
    const legacyAdminAllowed = JETLE.canAccessAdmin ? JETLE.canAccessAdmin(currentUser) : (localStorage.getItem('admin') === 'true');
    if (!currentUser || !currentUser.id) {
      return legacyAdminAllowed ? { id: 'legacy-admin', role: 'admin', name: 'Admin' } : null;
    }

    const fullUser = (JETLE.getUsers ? JETLE.getUsers() : []).find(function (item) {
      return item.id === currentUser.id;
    }) || null;

    if (!fullUser) {
      return legacyAdminAllowed ? Object.assign({ role: 'admin' }, currentUser) : null;
    }
    return (JETLE.canAccessAdmin ? JETLE.canAccessAdmin(fullUser) : fullUser.role === 'admin') ? fullUser : null;
  }

  function getListingStatus(listing) {
    const raw = String((listing && listing.status) || '').toLowerCase();
    if (raw === 'pending' || raw === 'beklemede' || raw === 'bekliyor') return 'pending';
    if (raw === 'approved' || raw === 'active' || raw === 'verified' || raw === 'yayinda') return 'approved';
    if (raw === 'rejected' || raw === 'reddedildi') return 'rejected';
    if (raw === 'passive' || raw === 'pasif') return 'passive';
    return raw || 'pending';
  }

  function getListingStatusClass(status) {
    if (status === 'approved') return 'yayinda';
    if (status === 'pending') return 'beklemede';
    if (status === 'rejected') return 'reddedildi';
    if (status === 'passive') return 'pasif';
    return 'beklemede';
  }

  function getListingStatusLabel(status) {
    if (status === 'approved') return 'Yayinda';
    if (status === 'pending') return 'Beklemede';
    if (status === 'rejected') return 'Reddedildi';
    if (status === 'passive') return 'Pasif';
    return 'Beklemede';
  }

  function getAdRowStatus(ad) {
    const raw = String((ad && ad.status) || '').toLowerCase();
    if (raw === 'active' || raw === 'approved') return 'onaylandi';
    if (raw === 'rejected' || raw === 'expired') return 'reddedildi';
    return 'bekliyor';
  }

  function getRequestStatusLabel(status) {
    const labels = {
      bekliyor: 'Bekliyor',
      onaylandi: 'Onaylandı',
      reddedildi: 'Reddedildi'
    };
    return labels[status] || 'Bekliyor';
  }

  function getReportStatus(report) {
    const raw = String((report && report.status) || '').toLowerCase();
    if (raw === 'reviewed' || raw === 'incelendi') return 'reviewed';
    if (raw === 'removed' || raw === 'kaldirildi') return 'removed';
    if (raw === 'closed' || raw === 'kapatildi') return 'closed';
    return 'pending';
  }

  function getReportStatusClass(status) {
    if (status === 'reviewed') return 'pending';
    if (status === 'removed') return 'rejected';
    if (status === 'closed') return 'passive';
    return 'pending';
  }

  function getReportStatusLabel(status) {
    if (status === 'reviewed') return 'Incelendi';
    if (status === 'removed') return 'Kaldirildi';
    if (status === 'closed') return 'Kapatildi';
    return 'Beklemede';
  }

  function getAdManagementStatus(ad) {
    const raw = String((ad && ad.status) || '').toLowerCase();
    if (raw === 'active') return 'active';
    if (raw === 'approved') return 'approved';
    if (raw === 'rejected') return 'rejected';
    return 'pending';
  }

  function getAdManagementStatusClass(status) {
    if (status === 'active') return 'approved';
    if (status === 'approved') return 'pending';
    if (status === 'rejected') return 'rejected';
    return 'pending';
  }

  function getAdManagementStatusLabel(status) {
    if (status === 'active') return 'Yayinda';
    if (status === 'approved') return 'Onaylandi';
    if (status === 'rejected') return 'Reddedildi';
    return 'Beklemede';
  }

  function getUserStatus(user) {
    const raw = String((user && user.status) || '').toLowerCase();
    if (raw === 'blocked' || raw === 'engelli') return 'blocked';
    if (raw === 'passive' || raw === 'pasif' || raw === 'donduruldu') return 'passive';
    return 'active';
  }

  function getUserStatusClass(status) {
    if (status === 'active') return 'approved';
    if (status === 'passive') return 'passive';
    if (status === 'blocked') return 'rejected';
    return 'approved';
  }

  function getUserStatusLabel(status) {
    if (status === 'active') return 'Aktif';
    if (status === 'passive') return 'Pasif';
    if (status === 'blocked') return 'Engelli';
    return 'Aktif';
  }

  function getRoleLabel(role) {
    if (role === 'admin') return 'Admin';
    if (role === 'store') return 'Store';
    return 'User';
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
      '<button type="button" class="btn btn-light btn-small" data-admin-action="save-user-profile" data-id="' + id + '">Rol� Kaydet</button>' +
      '<button type="button" class="btn btn-light btn-small" data-admin-action="passive-user" data-id="' + id + '">Pasife Al</button>' +
      '<button type="button" class="btn btn-light btn-small" data-admin-action="block-user" data-id="' + id + '">Engelle</button>' +
      '<button type="button" class="btn btn-danger btn-small" data-admin-action="delete-user" data-id="' + id + '">Sil</button>' +
    '</div>';
  }

  async function updateListingModeration(id, updater) {
    if (!window.JETLE_API || typeof window.JETLE_API.updateListing !== 'function') {
      throw new Error('İlan moderasyon API işlemi kullanılamıyor.');
    }

    await window.JETLE_API.refreshCollection('listings');
    const listings = JETLE.getListings();
    const targetListing = listings.find(function (item) {
      return item.id === id;
    });

    if (!targetListing) {
      throw new Error('İlan bulunamadı.');
    }

    const nextListing = updater(targetListing);
    await window.JETLE_API.updateListing(id, nextListing);
    await window.JETLE_API.refreshCollection('listings');

    return {
      previous: targetListing,
      current: nextListing
    };
  }

  function buildAdminListingsTable(listings) {
    if (!listings.length) {
      return '<div class="empty-state"><h3>Kayıtlı ilan bulunmuyor</h3><p>Yeni ilanlar burada listelenecek.</p></div>';
    }

    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>İlan Başlığı</th><th>Kullanıcı</th><th>Durum</th><th>Red Sebebi</th><th>İşlem</th></tr></thead><tbody>' +
      listings.map(function (listing) {
        const status = getListingStatus(listing);
        return '<tr>' +
          '<td><strong>' + JETLE.escapeHtml(listing.title || 'İlan') + '</strong><span class="table-subline">' + JETLE.formatCurrency(Number(listing.price || 0)) + '</span></td>' +
          '<td>' + JETLE.escapeHtml(listing.storeName || listing.ownerName || 'Kullanıcı') + '</td>' +
          '<td><span class="admin-status-chip status-' + getListingStatusClass(status) + '">' + JETLE.escapeHtml(getListingStatusLabel(status)) + '</span></td>' +
          '<td>' + JETLE.escapeHtml(listing.moderationReason || '-') + '</td>' +
          '<td>' + buildAdminTableRowActions('listing', listing.id) + '<select class="admin-reason-select" data-admin-reason="' + listing.id + '"><option value="">Red sebebi se�in</option><option value="Yanlis kategori">Yanlis kategori</option><option value="Eksik bilgi">Eksik bilgi</option><option value="Uygunsuz i�erik">Uygunsuz i�erik</option><option value="Sahte ilan">Sahte ilan</option><option value="Diger">Diger</option></select></td>' +
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
          '<div class="admin-pending-card-media">' + (coverImage ? '<img src="' + JETLE.escapeHtml(coverImage) + '" alt="' + JETLE.escapeHtml(listing.title || 'İlan') + '" />' : '') + '</div>' +
          '<div class="admin-pending-card-body">' +
            '<span class="admin-status-chip status-beklemede">Beklemede</span>' +
            '<h4>' + JETLE.escapeHtml(listing.title || 'İlan') + '</h4>' +
            '<div class="admin-pending-card-meta"><span>' + JETLE.escapeHtml(listing.category || 'Kategori belirtilmedi') + '</span><span>' + JETLE.escapeHtml(sellerName) + '</span><span>' + JETLE.formatDate(listing.createdAt || new Date().toISOString()) + '</span></div>' +
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

  function buildAdminAdsTable(ads) {
    if (!ads.length) {
      return '<div class="empty-state"><h3>Reklam kaydı bulunmuyor</h3><p>Reklam kayıtları burada listelenecek.</p></div>';
    }

    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Firma Adi</th><th>Baslik</th><th>Reklam T�r�</th><th>B�t�e</th><th>Tarih</th><th>Durum</th><th>Islem</th></tr></thead><tbody>' +
      ads.map(function (ad) {
        const status = getAdManagementStatus(ad);
        const adType = ad.adType || ad.packageType || ad.placement || 'Reklam';
        const budget = Number(ad.budget || ad.price || 0);
        const createdAt = ad.createdAt || ad.startAt || new Date().toISOString();
        return '<tr>' +
          '<td>' + JETLE.escapeHtml(ad.advertiser || 'Firma') + '</td>' +
          '<td><strong>' + JETLE.escapeHtml(ad.title || 'Reklam Basvurusu') + '</strong><span class="table-subline">' + JETLE.escapeHtml(ad.contact || '-') + '</span></td>' +
          '<td>' + JETLE.escapeHtml(adType) + '</td>' +
          '<td>' + JETLE.formatCurrency(budget) + '</td>' +
          '<td>' + JETLE.formatDate(createdAt) + '</td>' +
          '<td><span class="admin-status-chip status-' + getAdManagementStatusClass(status) + '">' + getAdManagementStatusLabel(status) + '</span></td>' +
          '<td><div class="admin-table-actions"><button type="button" class="btn btn-light btn-small" data-admin-action="approve-ad" data-id="' + ad.id + '">Onayla</button><button type="button" class="btn btn-primary btn-small" data-admin-action="publish-ad" data-id="' + ad.id + '">Yayina Al</button><button type="button" class="btn btn-danger btn-small" data-admin-action="reject-ad" data-id="' + ad.id + '">Reddet</button></div></td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  function buildAdminUsersTable(users) {
    if (!users.length) {
      return '<div class="empty-state"><h3>Kullanıcı bulunmuyor</h3><p>Kayıt olan kullanıcılar burada listelenecek.</p></div>';
    }

    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Ad</th><th>E-posta</th><th>Rol</th><th>Kayit Tarihi</th><th>Durum</th><th>Admin Notu</th><th>Islem</th></tr></thead><tbody>' +
      users.map(function (user) {
        const status = getUserStatus(user);
        return '<tr>' +
          '<td><strong>' + JETLE.escapeHtml(user.name || 'Kullanici') + '</strong><span class="table-subline">' + JETLE.escapeHtml(user.phone || '-') + '</span></td>' +
          '<td>' + JETLE.escapeHtml(user.email || '-') + '</td>' +
          '<td><label class="admin-inline-field"><select data-admin-user-role="' + user.id + '"><option value="user"' + (user.role === 'user' ? ' selected' : '') + '>User</option><option value="store"' + (user.role === 'store' ? ' selected' : '') + '>Store</option><option value="admin"' + (user.role === 'admin' ? ' selected' : '') + '>Admin</option></select><small>' + JETLE.escapeHtml(getRoleLabel(user.role)) + '</small></label></td>' +
          '<td>' + JETLE.formatDate(user.createdAt) + '</td>' +
          '<td><span class="admin-status-chip status-' + getUserStatusClass(status) + '">' + getUserStatusLabel(status) + '</span></td>' +
          '<td><label class="admin-inline-field"><textarea rows="2" data-admin-user-note="' + user.id + '" placeholder="Opsiyonel admin notu">' + JETLE.escapeHtml(user.adminNote || '') + '</textarea></label></td>' +
          '<td>' + buildAdminTableRowActions('user', user.id) + '</td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  function buildAdminReportsTable(reports, listings, users) {
    if (!reports.length) {
      return '<div class="empty-state"><h3>�?ikayet bulunmuyor</h3><p>İlan detay sayfasından gönderilen şikayetler burada listelenecek.</p></div>';
    }

    const listingMap = {};
    const userMap = {};
    listings.forEach(function (item) { listingMap[item.id] = item; });
    users.forEach(function (item) { userMap[item.id] = item; });

    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Ilan Basligi</th><th>Sikayet T�r�</th><th>A�iklama</th><th>Tarih</th><th>Durum</th><th>Islem</th></tr></thead><tbody>' +
      reports.slice().sort(function (a, b) {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }).map(function (report) {
        const listing = listingMap[report.listingId] || null;
        const reporter = userMap[report.reporterId] || null;
        const listingTitle = report.listingTitle || (listing && listing.title) || 'İlan bulunamadı';
        const reporterName = report.reporterName || (reporter && reporter.name) || 'Misafir kullanıcı';
        const note = report.note ? JETLE.escapeHtml(report.note) : 'Ek açıklama girilmedi.';
        const status = getReportStatus(report);
        return '<tr>' +
          '<td><strong>' + JETLE.escapeHtml(listingTitle) + '</strong><span class="table-subline">' + JETLE.escapeHtml(reporterName) + '</span>' + (report.listingId ? '<span class="table-subline"><a href="ilan-detay.html?id=' + encodeURIComponent(report.listingId) + '">Ilani a�</a></span>' : '') + '</td>' +
          '<td><span class="admin-status-chip status-pending">' + JETLE.escapeHtml(report.reasonLabel || report.reason || 'Sikayet') + '</span></td>' +
          '<td><div class="admin-report-detail"><p>' + note + '</p></div></td>' +
          '<td>' + JETLE.formatDate(report.createdAt) + '</td>' +
          '<td><span class="admin-status-chip status-' + getReportStatusClass(status) + '">' + getReportStatusLabel(status) + '</span></td>' +
          '<td><div class="admin-table-actions"><button type="button" class="btn btn-light btn-small" data-admin-action="review-report" data-id="' + report.id + '">Incelendi</button><button type="button" class="btn btn-light btn-small" data-admin-action="remove-report" data-id="' + report.id + '">Kaldirildi</button><button type="button" class="btn btn-danger btn-small" data-admin-action="close-report" data-id="' + report.id + '">Kapatildi</button></div></td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  function normalizeAdsForAdmin(ads) {
    const now = Date.now();
    let changed = false;
    const nextAds = ads.map(function (item) {
      const ad = Object.assign({}, item);
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
    if (changed) JETLE.saveAds(nextAds);
    return nextAds;
  }

  function initAdminDashboardPage() {
    const adminUser = getActiveAdminUser();
    if (!adminUser) {
      window.location.href = 'index.html';
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

    function getData() {
      const listings = JETLE.getListings();
      const users = JETLE.getUsers();
      const reports = JETLE.getReports ? JETLE.getReports() : [];
      const ads = normalizeAdsForAdmin(JETLE.getAds());
      const messagesMap = JETLE.getMessagesMap ? JETLE.getMessagesMap() : {};
      return {
        listings: listings,
        users: users,
        reports: reports,
        ads: ads,
        messagesMap: messagesMap
      };
    }

    async function render() {
      try {
        if (window.JETLE_API && typeof window.JETLE_API.refreshCollection === 'function') {
          await Promise.all([
            window.JETLE_API.refreshCollection('listings'),
            window.JETLE_API.refreshCollection('users')
          ]);
        }

        const data = getData();
        const pendingListings = data.listings.filter(function (item) {
          return getListingStatus(item) === 'pending';
        });
        const totalAdImpressions = data.ads.reduce(function (sum, item) { return sum + Number(item.impressions || 0); }, 0);
        const totalAdClicks = data.ads.reduce(function (sum, item) { return sum + Number(item.clicks || 0); }, 0);
        const totalMessageThreads = Object.keys(data.messagesMap || {}).length;

        totalListingsEl.textContent = JETLE.formatNumber(data.listings.length);
        premiumListingsEl.textContent = JETLE.formatNumber(data.listings.filter(function (item) { return item.premium; }).length);
        totalUsersEl.textContent = JETLE.formatNumber(data.users.length);
        if (totalAdImpressionsEl) totalAdImpressionsEl.textContent = JETLE.formatNumber(totalAdImpressions);
        if (totalAdClicksEl) totalAdClicksEl.textContent = JETLE.formatNumber(totalAdClicks);
        if (document.getElementById('adminDataSourceNote')) {
          document.getElementById('adminDataSourceNote').textContent = 'Veri kaynagi: API · ' + JETLE.formatNumber(totalMessageThreads) + ' mesaj basligi yüklendi';
        }

        pendingListingsWrap.innerHTML = buildAdminPendingListingsCards(pendingListings);
        listingsWrap.innerHTML = buildAdminListingsTable(data.listings);
        reportsWrap.innerHTML = buildAdminReportsTable(data.reports, data.listings, data.users);
        adsWrap.innerHTML = buildAdminAdsTable(data.ads);
        usersWrap.innerHTML = buildAdminUsersTable(data.users);
      } catch (error) {
        if (window.console && typeof window.console.warn === 'function') {
          console.warn('[JETLE][admin][render]', error);
        }
        pendingListingsWrap.innerHTML = '<div class="empty-state"><h3>Bekleyen ilanlar y�klenemedi</h3><p>Sayfayi yenileyerek tekrar deneyin.</p></div>';
        listingsWrap.innerHTML = '<div class="empty-state"><h3>Ilan listesi y�klenemedi</h3><p>Veri akisi ge�ici olarak erisilemedi.</p></div>';
        reportsWrap.innerHTML = '<div class="empty-state"><h3>Sikayetler y�klenemedi</h3><p>Tekrar deneyin.</p></div>';
        adsWrap.innerHTML = '<div class="empty-state"><h3>Reklam verileri y�klenemedi</h3><p>Tekrar deneyin.</p></div>';
        usersWrap.innerHTML = '<div class="empty-state"><h3>Kullanici listesi y�klenemedi</h3><p>Tekrar deneyin.</p></div>';
      }
    }

    if (adminAdForm) {
      adminAdForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const imageInput = document.getElementById('adminAdImage');
        const file = imageInput && imageInput.files && imageInput.files[0];
        if (!file) {
          JETLE.showToast('Lütfen reklam görseli yükleyin.');
          return;
        }

        const startDate = document.getElementById('adminAdStart').value;
        const endDate = document.getElementById('adminAdEnd').value;
        if (!startDate || !endDate || new Date(endDate).getTime() < new Date(startDate).getTime()) {
          JETLE.showToast('Başlangıç ve bitiş tarihini doğru girin.');
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
          JETLE.saveAds(JETLE.getAds().concat(newAd));
          adminAdForm.reset();
          JETLE.showToast('Reklam kaydedildi. Tarihi geldiğinde otomatik yayınlanacak.');
          render();
        };
        reader.readAsDataURL(file);
      });
    }

    document.addEventListener('click', async function (event) {
      const button = event.target.closest('[data-admin-action]');
      if (!button) return;
      const action = button.dataset.adminAction;
      const id = button.dataset.id;

      if (action === 'approve-listing') {
        try {
          const moderationResult = await updateListingModeration(id, function (listing) {
            return Object.assign({}, listing, {
              status: 'approved',
              verification: 'verified',
              moderationReason: ''
            });
          });
          const listing = moderationResult.previous;
          JETLE.addNotification(listing.ownerId, {
            type: 'listing-approved',
            title: 'Ilaniniz yayina alindi',
            text: '"' + (listing.title || 'Ilaniniz') + '" artik yayinda.',
            listingId: listing.id,
            href: 'ilan-detay.html?id=' + encodeURIComponent(listing.id)
          });
          JETLE.showToast('İlan onaylandı.');
          await render();
        } catch (error) {
          console.error('[JETLE][admin][approve-listing]', error);
          JETLE.showToast('Ilan g�ncellenemedi.');
        }
        return;
      }

      if (action === 'passive-listing') {
        try {
          await updateListingModeration(id, function (listing) {
            return Object.assign({}, listing, {
              status: 'passive',
              verification: 'pending',
              moderationReason: ''
            });
          });
          JETLE.showToast('İlan pasife alındı.');
          await render();
        } catch (error) {
          console.error('[JETLE][admin][passive-listing]', error);
          JETLE.showToast('Ilan g�ncellenemedi.');
        }
        return;
      }

      if (action === 'reject-listing') {
        const reasonSelect = document.querySelector('[data-admin-reason="' + id + '"]');
        const reason = reasonSelect ? String(reasonSelect.value || '').trim() : '';
        try {
          const moderationResult = await updateListingModeration(id, function (listing) {
            return Object.assign({}, listing, {
              status: 'rejected',
              verification: 'rejected',
              moderationReason: reason || 'Eksik bilgi'
            });
          });
          const listing = moderationResult.previous;
          JETLE.addNotification(listing.ownerId, {
            type: 'listing-rejected',
            title: 'Ilaniniz reddedildi',
            text: '"' + (listing.title || 'Ilaniniz') + '" i�in neden: ' + (reason || 'Eksik bilgi')
          });
          JETLE.showToast('İlan reddedildi.');
          await render();
        } catch (error) {
          console.error('[JETLE][admin][reject-listing]', error);
          JETLE.showToast('Ilan g�ncellenemedi.');
        }
        return;
      }

      if (action === 'delete-listing') {
        try {
          if (!window.JETLE_API || typeof window.JETLE_API.deleteListing !== 'function') {
            throw new Error('İlan silme API işlemi kullanılamıyor.');
          }
          await window.JETLE_API.deleteListing(id);
          JETLE.showToast('Ilan silindi.');
          await render();
        } catch (error) {
          console.error('[JETLE][admin][delete-listing]', error);
          JETLE.showToast('Ilan silinemedi.');
        }
        return;
      }

      if (action === 'approve-ad') {
        JETLE.saveAds(JETLE.getAds().map(function (item) {
          if (item.id === id) item.status = 'approved';
          return item;
        }));
        JETLE.showToast('Reklam onaylandı.');
        await render();
        return;
      }

      if (action === 'publish-ad') {
        JETLE.saveAds(JETLE.getAds().map(function (item) {
          if (item.id === id) item.status = 'active';
          return item;
        }));
        JETLE.showToast('Reklam yayina alindi.');
        await render();
        return;
      }

      if (action === 'reject-ad') {
        JETLE.saveAds(JETLE.getAds().map(function (item) {
          if (item.id === id) item.status = 'rejected';
          return item;
        }));
        JETLE.showToast('Reklam reddedildi.');
        await render();
        return;
      }

      if (action === 'review-report') {
        JETLE.saveReports((JETLE.getReports ? JETLE.getReports() : []).map(function (item) {
          if (item.id === id) item.status = 'reviewed';
          return item;
        }));
        JETLE.showToast('Sikayet incelendi olarak isaretlendi.');
        await render();
        return;
      }

      if (action === 'remove-report') {
        JETLE.saveReports((JETLE.getReports ? JETLE.getReports() : []).map(function (item) {
          if (item.id === id) item.status = 'removed';
          return item;
        }));
        JETLE.showToast('Sikayet kaldirildi olarak isaretlendi.');
        await render();
        return;
      }

      if (action === 'close-report') {
        JETLE.saveReports((JETLE.getReports ? JETLE.getReports() : []).map(function (item) {
          if (item.id === id) item.status = 'closed';
          return item;
        }));
        JETLE.showToast('Sikayet kapatildi.');
        await render();
        return;
      }

      if (action === 'delete-user') {
        JETLE.saveUsers(JETLE.getUsers().filter(function (item) { return item.id !== id; }));
        JETLE.saveListings(JETLE.getListings().filter(function (item) { return item.ownerId !== id; }));
        JETLE.showToast('Kullanıcı ve ilgili ilanları silindi.');
        await render();
        return;
      }

      if (action === 'save-user-profile') {
        const roleSelect = document.querySelector('[data-admin-user-role="' + id + '"]');
        const noteInput = document.querySelector('[data-admin-user-note="' + id + '"]');
        const nextRole = roleSelect ? String(roleSelect.value || 'user').trim() : 'user';
        const nextNote = noteInput ? String(noteInput.value || '').trim() : '';
        JETLE.saveUsers(JETLE.getUsers().map(function (item) {
          if (item.id === id) {
            item.role = nextRole;
            item.profileType = nextRole === 'store' ? 'store' : 'individual';
            item.adminNote = nextNote;
          }
          return item;
        }));
        JETLE.showToast('Kullanici rol� ve admin notu g�ncellendi.');
        render();
        return;
      }

      if (action === 'passive-user') {
        const noteInput = document.querySelector('[data-admin-user-note="' + id + '"]');
        const nextNote = noteInput ? String(noteInput.value || '').trim() : '';
        JETLE.saveUsers(JETLE.getUsers().map(function (item) {
          if (item.id === id) {
            item.status = 'passive';
            item.adminNote = nextNote;
          }
          return item;
        }));
        JETLE.showToast('Kullanici pasif duruma alindi.');
        render();
        return;
      }

      if (action === 'block-user') {
        const noteInput = document.querySelector('[data-admin-user-note="' + id + '"]');
        const nextNote = noteInput ? String(noteInput.value || '').trim() : '';
        JETLE.saveUsers(JETLE.getUsers().map(function (item) {
          if (item.id === id) {
            item.status = 'blocked';
            item.adminNote = nextNote;
          }
          return item;
        }));
        JETLE.showToast('Kullanici engellendi.');
        render();
      }
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const ready = window.JETLE && window.JETLE.ready ? window.JETLE.ready : Promise.resolve();
    ready.then(function () {
      try {
        if (document.body.dataset.page === 'admin-dashboard') {
          initAdminDashboardPage();
        }
      } catch (error) {
        if (window.console && typeof window.console.warn === 'function') {
          console.warn('[JETLE][admin][bootstrap]', error);
        }
      }
    });
  });
})();
