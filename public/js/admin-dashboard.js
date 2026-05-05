const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin.html";
}

fetch("http://localhost:3000/api/admin/dashboard", {
  headers: {
    Authorization: token,
  },
})
  .then((res) => {
    if (res.status === 401) {
      window.location.href = "/admin.html";
      return null;
    }
    return res.json();
  })
  .then((data) => {
    if (!data) return;
    const status = document.getElementById("dashboardStatus");
    if (status) status.textContent = data.message || "Admin paneli OK";
  })
  .catch(() => {
    window.location.href = "/admin.html";
  });

document.getElementById("adminLogout")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/admin.html";
});
