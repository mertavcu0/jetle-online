document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  if (!name || !email || !password || !passwordConfirm) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  if (password !== passwordConfirm) {
    alert("Şifreler aynı olmalı.");
    return;
  }

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Kayıt başarılı");
      window.location.href = "login.html";
    } else {
      alert(data.error || data.msg || "Hata oluştu");
    }
  } catch (err) {
    console.error(err);
    alert("Sunucuya bağlanılamadı");
  }
});

