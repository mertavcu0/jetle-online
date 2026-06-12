const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginMessage = document.getElementById("adminLoginMessage");
const ADMIN_AUTH_KEYS = ["token", "user", "userId", "userEmail", "userRole", "admin"];

function setAdminMessage(message, type = "") {
  if (!adminLoginMessage) return;
  adminLoginMessage.textContent = message;
  adminLoginMessage.className = ["muted", type].filter(Boolean).join(" ");
}

function clearAdminSession() {
  ADMIN_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
}

function persistAdminSession(payload) {
  const token = payload?.token ? String(payload.token) : "";
  const user = payload?.user && typeof payload.user === "object" ? payload.user : null;

  if (!token || !user) return;

  const userId = user._id || user.id || "";
  const userEmail = user.email || "";
  const userRole = user.role || "";
  const normalizedUser = {
    ...user,
    _id: userId || user._id || user.id || "",
    id: userId || user.id || user._id || "",
    email: userEmail
  };

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(normalizedUser));
  if (userId) localStorage.setItem("userId", String(userId));
  if (userEmail) localStorage.setItem("userEmail", String(userEmail));
  if (userRole) localStorage.setItem("userRole", String(userRole));
  if (String(userRole).trim().toLowerCase() === "admin") {
    localStorage.setItem("admin", JSON.stringify(normalizedUser));
  } else {
    localStorage.removeItem("admin");
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
      clearAdminSession();
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
