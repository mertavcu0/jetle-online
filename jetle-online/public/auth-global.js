(function () {
  const raw = localStorage.getItem("user");

  let user = null;
  try {
    user = JSON.parse(raw);
  } catch {
    user = null;
  }

  const authArea = document.getElementById("authArea");

  if (!authArea) return;

  if (user && user.email) {
    authArea.innerHTML = `
      <div class="auth-user">
        <span class="user-name">${user.name || user.email}</span>
        <a class="panel-link" href="/dashboard.html">Profilim</a>
        <button class="logout-btn" onclick="logout()">Çıkış</button>
      </div>
    `;
  } else {
    authArea.innerHTML = `
      <a href="/login.html">Giriş Yap</a>
      <a href="/register.html">Kayıt Ol</a>
    `;
  }

  window.logout = function () {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    location.reload();
  };

  window.addFavorite = function (id) {
    const token = String(localStorage.getItem("token") || "").trim();
    if (!token) {
      window.location.href = "/login.html";
      return;
    }

    fetch(`/api/listings/${id}/favorite`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then((res) => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login.html";
      }
      return res;
    })
    .then(() => alert("Favori işlemi tamamlandı"));
  };
})();
