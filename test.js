// LOGIN
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "pablo@test.com",
    password: "123456"
  })
})
.then(res => res.json())
.then(loginData => {

  console.log("LOGIN:", loginData);

  const token = loginData.token;

  // İLAN EKLE
  return fetch("http://localhost:5000/api/listings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      title: "BMW Satilik",
      description: "Temiz arac",
      price: 500000,
      location: "Adana"
    })
  });
})
.then(res => res.json())
.then(data => console.log("ILAN:", data))
.catch(err => console.log(err));
