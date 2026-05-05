window.API_BASE = window.API_BASE || "http://localhost:3000";

function currentToken() {
  return localStorage.getItem("token");
}

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}

function updateNavbar() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;
  const nav = authArea.closest(".nav");

  if (nav && !nav.querySelector(".search")) {
    const search = document.createElement("form");
    search.className = "search";
    search.action = "/ilanlar.html";
    search.innerHTML = `
      <input name="q" placeholder="İlan, marka, model veya şehir ara">
      <button type="submit">Ara</button>
    `;
    nav.insertBefore(search, authArea);
  }

  const user = currentUser();

  if (currentToken() && user) {
    const displayName = user.name || user.username || user.email || "Kullanıcı";
    authArea.innerHTML = `
      <div class="user-menu">
        <span id="navUserName">${displayName}</span>
        <div class="dropdown">
          <a href="/hesabim.html#profile">Profil</a>
          <a href="/hesabim.html?tab=messages">Mesajlar</a>
          <a href="#" onclick="logout(); return false;">Çıkış</a>
        </div>
      </div>
      <a class="post-link" href="/ilan-ver.html">İlan Ver</a>
    `;
    document.getElementById("navUserName").innerText = displayName;
  } else {
    authArea.innerHTML = `
      <a href="/login.html">Giriş Yap</a>
      <a href="/register.html">Kayıt Ol</a>
      <a class="post-link" href="/ilan-ver.html">İlan Ver</a>
    `;
  }
}

async function authRequest(path, body) {
  const res = await fetch(`${window.API_BASE}/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "İşlem başarısız");
  return data;
}

function bindProfilePage() {
  const card = document.querySelector(".profile-card");
  if (!card) return;

  const user = currentUser();
  if (!currentToken() || !user) {
    window.location.href = "/login.html";
    return;
  }

  const displayName = user.name || user.username || "Kullanıcı";
  document.getElementById("profileName").innerText = displayName;
  document.getElementById("profileEmail").innerText = user.email || "";
}

function changePassword() {
  const input = document.getElementById("newPassword");
  if (!input) return;

  const value = input.value.trim();
  if (value.length < 6) {
    alert("Yeni şifre en az 6 karakter olmalı");
    return;
  }

  input.value = "";
  alert("Şifre güncelleme sistemi hazır.");
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  bindProfilePage();

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = document.getElementById("authMessage");
      try {
        const data = await authRequest("login", {
          email: loginForm.email.value,
          password: loginForm.password.value,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } catch (error) {
        message.textContent = error.message;
      }
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = document.getElementById("authMessage");
      const name = registerForm.username.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value;
      const password2 = registerForm.password2.value;

      if (password !== password2) {
        alert("Şifreler aynı değil");
        return;
      }

      try {
        await authRequest("register", { username: name, name, email, password });
        window.location.href = "/login.html";
      } catch (error) {
        alert("Kayıt başarısız");
        message.textContent = error.message;
      }
    });
  }
});

window.logout = logout;
window.changePassword = changePassword;
