const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginMessage = document.getElementById("adminLoginMessage");

function setAdminMessage(message, type = "") {
  if (!adminLoginMessage) return;
  adminLoginMessage.textContent = message;
  adminLoginMessage.className = ["muted", type].filter(Boolean).join(" ");
}

function persistAdminSession(payload) {
  if (payload?.token) {
    localStorage.setItem("token", payload.token);
  }
  if (payload?.user) {
    localStorage.setItem("user", JSON.stringify(payload.user));
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();

  const username = String(document.querySelector("input[type='text']")?.value || "").trim();
  const password = String(document.querySelector("input[type='password']")?.value || "");

  setAdminMessage("Giriş yapılıyor...");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: username,
        password
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.success || !data?.token) {
      console.log("Admin redirect reason:", "login_failed");
      setAdminMessage(data?.message || "Giriş başarısız", "error");
      return;
    }

    if (String(data?.user?.role || "").trim().toLowerCase() !== "admin") {
      console.log("Admin redirect reason:", "non_admin_user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAdminMessage("Bu panel sadece admin hesabına açıktır.", "error");
      return;
    }

    persistAdminSession(data);
    console.log("Admin auth success");
    window.location.href = "/jetle-v2/admin-dashboard.html";
  } catch (error) {
    console.error("Admin login error:", error);
    setAdminMessage("Bağlantı hatası oluştu", "error");
  }
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", handleAdminLogin);
}
