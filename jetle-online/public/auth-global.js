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
    location.reload();
  };

  window.addFavorite = function (id) {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`/api/listings/${id}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        userId: user.id || user._id
      })
    })
    .then(() => alert("Favori işlemi tamamlandı"));
  };
})();
