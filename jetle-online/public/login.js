document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector("input[type=email]").value.trim();
  const password = document.querySelector("input[type=password]").value;

  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        localStorage.setItem("user", JSON.stringify(data.user || { email }));
        window.location.href = "/";
        return;
      }

      alert("Hatalı giriş");
    })
    .catch((err) => {
      console.error(err);
      alert("Sunucu hatası");
    });
});
