document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("input[type='text']").value;
  const password = document.querySelector("input[type='password']").value;

  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await res.json();

  if (data.success && data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "/jetle-v2/admin-dashboard.html";
  } else {
    alert("Hatalı giriş");
  }
});

