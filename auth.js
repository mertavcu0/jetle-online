(function () {
  const API_BASE = "https://jetle-online-production.up.railway.app";
  const ME_ENDPOINT = "/api/auth/me";
  function apiEndpoint(path) {
    return API_BASE + "/" + String(path || "").replace(/^\/+/, "");
  }

  function redirectIfLoggedIn() {
    if (JETLE.getCurrentUser()) {
      window.location.href = 'index.html';
      return true;
    }
    return false;
  }

  function initLoginPage() {
    if (redirectIfLoggedIn()) return;

    const form = document.getElementById('loginForm');
    const googleBtn = document.getElementById('googleLoginBtn');
    const appleBtn = document.getElementById('appleLoginBtn');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const remember = document.getElementById('rememberMe').checked;

      try {
        console.log("LOGIN FETCH URL:", API_BASE + "/api/auth/login");
        const loginUrl = apiEndpoint("/api/auth/login");
        const res = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });
        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);
        if (!res.ok) {
          alert((data && data.message) || "Giriş başarısız");
          return;
        }

        const payload = data.data || data;
        const user = payload.user;
        if (payload.token) {
          localStorage.setItem("token", String(payload.token));
        } else if (payload.accessToken) {
          localStorage.setItem("token", String(payload.accessToken));
        }
        console.log("SAVED TOKEN:", localStorage.getItem("token"));

        localStorage.setItem("user", JSON.stringify(user != null ? user : null));

        if (window.JETLE && user) {
          JETLE.setCurrentUser(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar || '',
              role: user.role || 'user'
            },
            remember
          );
        }

        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") || "index.html";
        window.setTimeout(function () {
          window.location.href = next;
        }, 200);
        return;
      } catch (error) {
        if (window.console && typeof window.console.warn === 'function') {
          console.warn('[JETLE][login][api]', error);
        }
        alert("Sunucuya bağlanılamadı.");
        return;
      }
    });

    if (googleBtn) {
      googleBtn.addEventListener('click', function () {
        JETLE.showToast('Google ile giriş yakında aktif olacak.');
      });
    }

    if (appleBtn) {
      appleBtn.addEventListener('click', function () {
        JETLE.showToast('Apple ile giriş yakında aktif olacak.');
      });
    }
  }

  function initRegisterPage() {
    if (redirectIfLoggedIn()) return;

    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const fullNameInput = document.getElementById('registerName');
      const emailInput = document.getElementById('registerEmail');
      const passwordInput = document.getElementById('registerPassword');
      const termsInput = document.getElementById('terms');
      const name = fullNameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim();
      const termsAccepted = Boolean(termsInput && termsInput.checked);
      const users = JETLE.getUsers();
      if (!termsAccepted) {
        JETLE.showToast('Kullanım şartlarını kabul etmelisiniz.');
        return;
      }

      if (users.some(function (item) { return item.email.toLowerCase() === email; })) {
        JETLE.showToast('Bu e-posta ile kayıtlı bir hesap zaten mevcut.');
        return;
      }

      const newUser = {
        id: 'u' + Date.now(),
        name: name,
        username: email.split('@')[0],
        email: email,
        phone: '',
        password: password,
        avatar: '',
        createdAt: new Date().toISOString(),
        verifiedUser: false,
        phoneVerified: false,
        trustedSeller: false,
        role: 'user',
        status: 'active',
        notifications: {
          email: true,
          messages: true,
          campaigns: false
        },
        lastLogin: 'İstanbul / Chrome'
      };

      try {
        const registerUrl = apiEndpoint("/api/auth/register");
        const response = await fetch(registerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName: fullNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            termsAccepted: document.getElementById('terms').checked
          })
        });
        const payload = await response.json().catch(function () { return {}; });
        if (!response.ok) {
          throw new Error((payload && payload.message) || 'Kayıt başarısız');
        }

        JETLE.setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email, avatar: '', role: newUser.role }, true);
        JETLE.showToast('Hesabınız oluşturuldu.');
        setTimeout(function () { window.location.href = 'index.html'; }, 400);
      } catch (error) {
        if (window.console && typeof window.console.error === 'function') {
          console.error('[JETLE][register]', error);
        }
        JETLE.showToast('Kayıt oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    });
  }

  function getRememberPreference() {
    return Boolean(localStorage.getItem(JETLE.STORE.remember));
  }

  function getFullCurrentUser() {
    const current = JETLE.getCurrentUser();
    if (!current) return null;
    return JETLE.getUsers().find(function (item) { return item.id === current.id; }) || null;
  }

  function refreshSessionUser(user) {
    JETLE.setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      role: user.role || 'user'
    }, getRememberPreference());
    JETLE.renderNavAuth();
  }

  function renderAvatar(previewEl, user) {
    if (!previewEl || !user) return;
    if (user.avatar) {
      previewEl.innerHTML = '<img src="' + user.avatar + '" alt="' + JETLE.escapeHtml(user.name) + '" />';
      return;
    }
    previewEl.textContent = (user.name || 'J').charAt(0).toUpperCase();
  }

  function initSettingsPage() {
    const current = JETLE.getCurrentUser();
    if (!current) {
      window.location.href = 'login.html';
      return;
    }

    let user = getFullCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const notificationForm = document.getElementById('notificationForm');
    const avatarPreview = document.getElementById('settingsAvatarPreview');
    const avatarInput = document.getElementById('profilePhotoInput');
    const lastLoginInfo = document.getElementById('lastLoginInfo');
    const accountStatusInfo = document.getElementById('accountStatusInfo');
    const logoutAllBtn = document.getElementById('logoutAllSessionsBtn');
    const freezeBtn = document.getElementById('freezeAccountBtn');
    const deleteBtn = document.getElementById('deleteAccountBtn');
    const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');
    const verifyProfileBtn = document.getElementById('verifyProfileBtn');
    const verifiedUserInfo = document.getElementById('verifiedUserInfo');
    const verifiedPhoneInfo = document.getElementById('verifiedPhoneInfo');
    const trustedSellerInfo = document.getElementById('trustedSellerInfo');

    function fillForms() {
      document.getElementById('settingsName').value = user.name || '';
      document.getElementById('settingsUsername').value = user.username || (user.email || '').split('@')[0] || '';
      document.getElementById('settingsEmail').value = user.email || '';
      document.getElementById('settingsPhone').value = user.phone || '';
      document.getElementById('notifyEmail').checked = !user.notifications || Boolean(user.notifications.email);
      document.getElementById('notifyMessages').checked = !user.notifications || Boolean(user.notifications.messages);
      document.getElementById('notifyCampaigns').checked = Boolean(user.notifications && user.notifications.campaigns);
      if (lastLoginInfo) lastLoginInfo.textContent = user.lastLogin || 'İstanbul / Chrome';
      if (accountStatusInfo) accountStatusInfo.textContent = user.status === 'donduruldu' ? 'Donduruldu' : 'Aktif';
      if (verifiedUserInfo) verifiedUserInfo.textContent = user.verifiedUser ? 'Onaylı kullanıcı' : 'Onay bekliyor';
      if (verifiedPhoneInfo) verifiedPhoneInfo.textContent = user.phoneVerified ? 'Telefon doğrulandı' : 'Telefon doğrulanmadı';
      if (trustedSellerInfo) trustedSellerInfo.textContent = user.trustedSeller ? 'Güvenilir satıcı' : 'Standart satıcı';
      renderAvatar(avatarPreview, user);
    }

    function saveUser(nextUser) {
      const users = JETLE.getUsers().map(function (item) {
        return item.id === nextUser.id ? nextUser : item;
      });
      JETLE.saveUsers(users);
      user = nextUser;
      refreshSessionUser(user);
      fillForms();
    }

    fillForms();

    if (avatarInput) {
      avatarInput.addEventListener('change', function (event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
          JETLE.showToast('Lütfen PNG, JPG veya WEBP dosyası seçin.');
          return;
        }
        const reader = new FileReader();
        reader.onload = function (loadEvent) {
          user.avatar = String(loadEvent.target.result || '');
          saveUser(user);
          JETLE.showToast('Profil fotoğrafı güncellendi.');
        };
        reader.readAsDataURL(file);
      });
    }

    if (profileForm) {
      profileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('settingsName').value.trim();
        const username = document.getElementById('settingsUsername').value.trim();
        const email = document.getElementById('settingsEmail').value.trim().toLowerCase();
        const phone = document.getElementById('settingsPhone').value.trim();

        const duplicate = JETLE.getUsers().find(function (item) {
          return item.id !== user.id && item.email.toLowerCase() === email;
        });

        if (duplicate) {
          JETLE.showToast('Bu e-posta başka bir hesap tarafından kullanılıyor.');
          return;
        }

        user.name = name;
        user.username = username;
        user.email = email;
        user.phone = phone;
        if (!phone) {
          user.phoneVerified = false;
        }
        user.trustedSeller = Boolean(user.verifiedUser && user.phoneVerified);
        saveUser(user);
        JETLE.showToast('Profil bilgileriniz güncellendi.');
      });
    }

    if (verifyPhoneBtn) {
      verifyPhoneBtn.addEventListener('click', function () {
        if (!user.phone) {
          JETLE.showToast('Önce telefon numaranızı kaydedin.');
          return;
        }
        user.phoneVerified = true;
        user.trustedSeller = Boolean(user.verifiedUser && user.phoneVerified);
        saveUser(user);
        JETLE.showToast('Telefon doğrulaması tamamlandı.');
      });
    }

    if (verifyProfileBtn) {
      verifyProfileBtn.addEventListener('click', function () {
        user.verifiedUser = true;
        user.trustedSeller = Boolean(user.verifiedUser && user.phoneVerified);
        saveUser(user);
        JETLE.showToast('Kullanıcı doğrulaması tamamlandı.');
      });
    }

    if (passwordForm) {
      passwordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const repeatPassword = document.getElementById('repeatPassword').value;

        if (currentPassword !== user.password) {
          JETLE.showToast('Mevcut şifre hatalı.');
          return;
        }

        if (newPassword.length < 6) {
          JETLE.showToast('Yeni şifre en az 6 karakter olmalı.');
          return;
        }

        if (newPassword !== repeatPassword) {
          JETLE.showToast('Yeni şifreler birbiriyle uyuşmuyor.');
          return;
        }

        user.password = newPassword;
        saveUser(user);
        passwordForm.reset();
        JETLE.showToast('Şifreniz güncellendi.');
      });
    }

    if (notificationForm) {
      notificationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        user.notifications = {
          email: document.getElementById('notifyEmail').checked,
          messages: document.getElementById('notifyMessages').checked,
          campaigns: document.getElementById('notifyCampaigns').checked
        };
        saveUser(user);
        JETLE.showToast('Bildirim ayarlarınız kaydedildi.');
      });
    }

    if (logoutAllBtn) {
      logoutAllBtn.addEventListener('click', function () {
        JETLE.clearCurrentUser();
        JETLE.showToast('Tüm oturumlar kapatıldı.');
        setTimeout(function () {
          window.location.href = 'login.html';
        }, 500);
      });
    }

    if (freezeBtn) {
      freezeBtn.addEventListener('click', function () {
        if (!window.confirm('Hesabınızı dondurmak istediğinize emin misiniz?')) return;
        user.status = 'passive';
        saveUser(user);
        JETLE.clearCurrentUser();
        JETLE.showToast('Hesabınız donduruldu.');
        setTimeout(function () {
          window.location.href = 'login.html';
        }, 500);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', function () {
        if (!window.confirm('Hesabınızı kalıcı olarak silmek istediğinize emin misiniz?')) return;

        JETLE.saveUsers(JETLE.getUsers().filter(function (item) {
          return item.id !== user.id;
        }));
        JETLE.saveListings(JETLE.getListings().filter(function (item) {
          return item.ownerId !== user.id;
        }));
        JETLE.clearCurrentUser();
        JETLE.showToast('Hesabınız silindi.');
        setTimeout(function () {
          window.location.href = 'index.html';
        }, 500);
      });
    }
  }

  window.initLoginPage = initLoginPage;
  window.initRegisterPage = initRegisterPage;
  window.initSettingsPage = initSettingsPage;

  /** Konsol: `JETLE.fetchMeConsole()` — `fetch(API_BASE + ME_ENDPOINT)` + Bearer `token` + `console.log` JSON. */
  window.JETLE = window.JETLE || {};
  window.JETLE.fetchMeConsole = function () {
    console.log("CALLING:", API_BASE + ME_ENDPOINT);
    return fetch(API_BASE + ME_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + String(localStorage.getItem("token") || "")
      }
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        console.log(data);
        return data;
      });
  };

  /** Eski token temizliği: `localStorage.clear()` + `sessionStorage.clear()` + yenileme. Sonra tekrar giriş + `API_BASE + ME_ENDPOINT`. */
  window.JETLE.forceHardLogoutClear = function (opts) {
    opts = opts || {};
    var reload = opts.reload !== false;
    try {
      localStorage.clear();
    } catch (e1) {}
    try {
      sessionStorage.clear();
    } catch (e2) {}
    if (reload) {
      try {
        location.reload();
      } catch (e3) {}
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    const ready = window.JETLE && window.JETLE.ready ? window.JETLE.ready : Promise.resolve();
    ready.then(function () {
      const page = document.body.dataset.page;
      if (page === 'login') initLoginPage();
      if (page === 'register') initRegisterPage();
      if (page === 'settings') initSettingsPage();
    });
  });
})();
