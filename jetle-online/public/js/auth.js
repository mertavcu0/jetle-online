(function () {
  console.log("AUTH_JS_LOADED");
  const AUTH_EVENT = "jetle:auth-state-changed";
  const AUTH_KEYS = ["token", "user", "userId", "userEmail", "userRole", "admin"];

  function dispatchAuthState(user) {
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, {
      detail: {
        user: user || null,
        loggedIn: Boolean(user)
      }
    }));
  }

  function clearAuthState() {
    AUTH_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    console.log("AUTH_STATE_CLEAN");
    dispatchAuthState(null);
  }

  function readUser() {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (_) {
      return null;
    }
  }

  function persistUserSession(data, fallbackEmail) {
    const user = data?.user || {};
    const token = String(data?.token || "").trim();
    const userId = user._id || user.id || "";
    const userEmail = user.email || fallbackEmail || "";
    const userRole = user.role || "";
    const normalizedUser = {
      ...user,
      email: userEmail
    };

    if (token) localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    if (userId) localStorage.setItem("userId", String(userId));
    if (userEmail) localStorage.setItem("userEmail", String(userEmail));
    if (userRole) localStorage.setItem("userRole", String(userRole));
    if (String(userRole).trim().toLowerCase() === "admin") {
      localStorage.setItem("admin", JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem("admin");
    }
    dispatchAuthState(normalizedUser);
  }

  function decodeBase64Url(value) {
    try {
      const normalized = String(value || "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const padding = (4 - (normalized.length % 4 || 4)) % 4;
      return atob(normalized + "=".repeat(padding));
    } catch (_) {
      return "";
    }
  }

  function initLoginPage() {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("authMessage");
    const forgotLink = document.getElementById("forgotPasswordLink");
    const forgotModal = document.getElementById("forgotPasswordModal");
    const forgotForm = document.getElementById("forgotPasswordForm");
    const forgotMessage = document.getElementById("forgotPasswordMessage");
    const forgotCancel = document.getElementById("forgotPasswordCancel");
    const forgotEmailInput = document.getElementById("forgotPasswordEmail");
    const loginEmailInput = document.getElementById("login-email");
    const submitButton = form?.querySelector('button[type="submit"]');
    const forgotSubmitButton = forgotForm?.querySelector('button[type="submit"]');

    if (!form) return;

    const hashParams = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
    const googleToken = String(hashParams.get("google_token") || "").trim();
    const googleUserRaw = String(hashParams.get("google_user") || "").trim();
    const googleError = String(hashParams.get("google_error") || "").trim();
    const googleNext = String(hashParams.get("next") || "/").trim() || "/";

    if (googleToken && googleUserRaw) {
      try {
        const decodedUser = JSON.parse(decodeBase64Url(googleUserRaw) || "{}");
        persistUserSession({
          token: googleToken,
          user: decodedUser
        }, decodedUser?.email || "");
        console.log("GOOGLE_LOGIN_UI_OK", {
          email: decodedUser?.email || ""
        });
        window.history.replaceState({}, document.title, "/login.html");
        window.location.href = googleNext.startsWith("/") ? googleNext : "/";
        return;
      } catch (error) {
        console.error("GOOGLE_LOGIN_PARSE_ERROR", error);
      }
    }

    if (googleError && message) {
      message.textContent = "Google ile giriş tamamlanamadı. Lütfen tekrar deneyin.";
      message.style.color = "#b91c1c";
      window.history.replaceState({}, document.title, "/login.html");
    }

    console.log("FORGOT_LINK_FOUND", {
      found: Boolean(forgotLink)
    });
    console.log("FORGOT_MODAL_RENDER_OK", {
      found: Boolean(forgotModal)
    });

    const params = new URLSearchParams(window.location.search);
    const registeredEmail = params.get("email") || "";
    if (params.get("registered") === "1" && message) {
      message.textContent = "Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.";
      message.style.color = "#047857";
      if (registeredEmail && loginEmailInput) {
        loginEmailInput.value = registeredEmail;
      }
    }
    if (params.get("reset") === "success" && message) {
      message.textContent = "Şifreniz güncellendi. Yeni şifrenizle giriş yapabilirsiniz.";
      message.style.color = "#047857";
    }

    function closeForgotModal() {
      if (!forgotModal) return;
      forgotModal.hidden = true;
      if (forgotMessage) {
        forgotMessage.textContent = "";
        forgotMessage.style.color = "";
        forgotMessage.className = "auth-message";
      }
    }

    function openForgotModal() {
      if (!forgotModal) return;
      forgotModal.hidden = false;
      if (forgotEmailInput && loginEmailInput && loginEmailInput.value.trim()) {
        forgotEmailInput.value = loginEmailInput.value.trim();
      }
      console.log("FORGOT_MODAL_OPEN");
      console.log("FORGOT_MODAL_OPEN_OK");
      console.log("FORGOT_PASSWORD_OPEN");
      forgotEmailInput?.focus();
    }

    console.log("AUTH_MODAL_BIND_OK", {
      forgotLinkFound: Boolean(forgotLink),
      forgotModalFound: Boolean(forgotModal),
      forgotFormFound: Boolean(forgotForm)
    });

    if (forgotLink) {
      forgotLink.onclick = function (event) {
        event.preventDefault();
        console.log("FORGOT_CLICK_OK");
        openForgotModal();
      };
      console.log("FORGOT_BIND_OK");
    }

    forgotCancel?.addEventListener("click", closeForgotModal);

    forgotModal?.addEventListener("click", (event) => {
      if (event.target === forgotModal) {
        closeForgotModal();
      }
    });

    forgotForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = String(forgotEmailInput?.value || "").trim();
      console.log("PASSWORD_RESET_REQUEST", { hasEmail: Boolean(email) });

      if (!email) {
        if (forgotMessage) {
          forgotMessage.textContent = "Lütfen e-posta adresinizi girin.";
          forgotMessage.style.color = "#b91c1c";
          forgotMessage.className = "auth-message is-error";
        }
        return;
      }

      try {
        if (forgotSubmitButton) {
          forgotSubmitButton.disabled = true;
          forgotSubmitButton.classList.add("is-loading");
          forgotSubmitButton.textContent = "Gönderiliyor";
        }
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.success === false) {
          throw new Error(data.message || "forgot_password_failed");
        }

        if (forgotMessage) {
          forgotMessage.textContent = "Şifre sıfırlama bağlantısı gönderildi. Lütfen e-posta kutunuzu kontrol edin.";
          forgotMessage.style.color = "#047857";
          forgotMessage.className = "auth-message is-success";
        }
        console.log("FORGOT_SUCCESS_UI_OK");
      } catch (error) {
        if (forgotMessage) {
          forgotMessage.textContent = "Şifre sıfırlama isteği gönderilemedi. Lütfen tekrar deneyin.";
          forgotMessage.style.color = "#b91c1c";
          forgotMessage.className = "auth-message is-error";
        }
        console.error(error);
      } finally {
        if (forgotSubmitButton) {
          forgotSubmitButton.disabled = false;
          forgotSubmitButton.classList.remove("is-loading");
          forgotSubmitButton.textContent = "Bağlantı Gönder";
        }
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = String(form.elements.email?.value || "").trim();
      const password = String(form.elements.password?.value || "");

      if (message) {
        message.textContent = "Giriş yapılıyor...";
        message.style.color = "";
      }

      if (submitButton) submitButton.disabled = true;
      submitButton?.classList.add("is-loading");
      if (submitButton) submitButton.textContent = "Giriş Yapılıyor";

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
          throw new Error(data.message || data.error || "login_failed");
        }

        persistUserSession(data, email);
        window.location.href = "/";
      } catch (error) {
        if (message) {
          message.textContent = "Giriş yapılamadı. E-posta veya şifrenizi kontrol edin.";
          message.style.color = "#b91c1c";
        }
        console.error(error);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove("is-loading");
          submitButton.textContent = "Giriş Yap";
        }
      }
    });

    console.log("FORGOT_UI_POLISH_OK");
    console.log("AUTH_MODAL_SYSTEM_OK");
    console.log("LOGIN_RENDER_OK", {
      formFound: true,
      forgotFound: Boolean(forgotLink),
      modalFound: Boolean(forgotModal)
    });
  }

  function initRegisterPage() {
    const form = document.getElementById("registerForm");
    const message = document.getElementById("authMessage");
    if (!form) return;

    clearAuthState();
    form.reset();
    console.log("REGISTER_UI_READY", {
      formFound: true,
      messageFound: Boolean(message)
    });
    console.log("REGISTER_SCREEN_OPEN");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = String(form.elements.username?.value || "").trim();
      const email = String(form.elements.email?.value || "").trim();
      const password = String(form.elements.password?.value || "");
      const password2 = String(form.elements.password2?.value || "");
      const submitButton = form.querySelector('button[type="submit"]');

      if (message) {
        message.textContent = "";
        message.style.color = "";
      }

      if (!username || !email || !password || !password2) {
        if (message) {
          message.textContent = "Lütfen tüm alanları doldurun.";
          message.style.color = "#b91c1c";
        }
        return;
      }

      if (password !== password2) {
        if (message) {
          message.textContent = "Şifreler aynı olmalı.";
          message.style.color = "#b91c1c";
        }
        return;
      }

      if (submitButton) submitButton.disabled = true;
      submitButton?.classList.add("is-loading");
      if (submitButton) submitButton.textContent = "Hesap Oluşturuluyor";

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: username,
            username,
            email,
            password
          })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || data.error || data.msg || "register_failed");
        }

        window.location.href = `/login.html?registered=1&email=${encodeURIComponent(email)}`;
      } catch (error) {
        if (message) {
          message.textContent = error.message || "Kayıt oluşturulamadı.";
          message.style.color = "#b91c1c";
        }
        console.error(error);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove("is-loading");
          submitButton.textContent = "Hesap Oluştur";
        }
      }
    });

    console.log("REGISTER_RENDER_OK", {
      formFound: true,
      fieldCount: form.querySelectorAll("input").length
    });
  }

  function initResetPasswordPage() {
    const form = document.getElementById("resetPasswordForm");
    const message = document.getElementById("authMessage");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const token = String(params.get("token") || "").trim();
    const submitButton = form.querySelector('button[type="submit"]');

    if (!token) {
      if (message) {
        message.textContent = "Şifre sıfırlama bağlantısı geçersiz görünüyor.";
        message.style.color = "#b91c1c";
      }
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const password = String(form.elements.password?.value || "");
      const password2 = String(form.elements.password2?.value || "");

      if (message) {
        message.textContent = "";
        message.style.color = "";
      }

      if (password.length < 6) {
        if (message) {
          message.textContent = "Şifre en az 6 karakter olmalı.";
          message.style.color = "#b91c1c";
        }
        return;
      }

      if (password !== password2) {
        if (message) {
          message.textContent = "Şifreler aynı olmalı.";
          message.style.color = "#b91c1c";
        }
        return;
      }

      if (submitButton) submitButton.disabled = true;
      submitButton?.classList.add("is-loading");
      if (submitButton) submitButton.textContent = "Şifre Güncelleniyor";

      try {
        const response = await fetch(`/api/auth/reset-password/${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, password2 })
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
          if (data.error === "invalid_reset_token") {
            console.log("RESET_PASSWORD_INVALID_TOKEN");
          }
          throw new Error(data.message || data.error || "reset_password_failed");
        }

        console.log("RESET_PASSWORD_SUCCESS");
        window.location.href = "/login.html?reset=success";
      } catch (error) {
        if (message) {
          message.textContent = error.message || "Şifre güncellenemedi.";
          message.style.color = "#b91c1c";
        }
        console.error(error);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove("is-loading");
          submitButton.textContent = "Şifreyi Değiştir";
        }
      }
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("loginForm")) {
      initLoginPage();
    }

    if (document.getElementById("registerForm")) {
      initRegisterPage();
    }

    if (document.getElementById("resetPasswordForm")) {
      initResetPasswordPage();
    }

    const currentUser = readUser();
    dispatchAuthState(currentUser);
  });
})();
