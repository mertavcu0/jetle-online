(function () {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.email) {
    window.location = "/login.html";
    return;
  }

  const grid = document.getElementById("myListingsGrid");
  const listingsPanel = document.getElementById("listingsPanel");
  const messagesPanel = document.getElementById("messagesPanel");

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function listingImage(listing) {
    if (listing.image && String(listing.image).trim()) return listing.image;
    if (Array.isArray(listing.images) && listing.images[0]) return listing.images[0];
    return "https://picsum.photos/400/225";
  }

  function formatPrice(price) {
    const number = Number(price || 0);
    return new Intl.NumberFormat("tr-TR").format(number) + " TL";
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();

    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Bugün";
    if (diff === 1) return "Dün";
    if (diff < 7) return diff + " gün önce";

    return date.toLocaleDateString("tr-TR");
  }

  function listingHref(listing) {
    const id = listing._id || listing.id || "";
    return "/listing-detail.html?id=" + encodeURIComponent(id);
  }

  function renderListings(listings) {
    if (!Array.isArray(listings) || !listings.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          Henüz ilanınız yok. İlk ilanınızı yayınlayarak başlayın.
        </div>
      `;
      return;
    }

    grid.innerHTML = listings.map((listing) => `
      <article class="card" onclick="window.location.href='${listingHref(listing)}'">
        <img src="${escapeHtml(listingImage(listing))}" alt="${escapeHtml(listing.title || "İlan")}" loading="lazy">
        <div class="card-body">
          <h3>${escapeHtml(listing.title || "Başlıksız ilan")}</h3>
          <p class="price">${formatPrice(listing.price)}</p>
          <p class="muted">${escapeHtml(listing.city || "Şehir yok")} / ${escapeHtml(listing.category || "Kategori yok")}</p>
          <p class="muted">${formatDate(listing.createdAt)}</p>
          <div class="actions" onclick="event.stopPropagation()">
            <button onclick="viewListing('${listing._id}')">Görüntüle</button>
            <button onclick="editListing('${listing._id}')">Düzenle</button>
            <button onclick="deleteListing('${listing._id}')">Sil</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  async function loadListings() {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">İlanlar yükleniyor...</div>
    `;

    try {
      const res = await fetch(`/api/listings/my-listings?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "İlanlar alınamadı");
      }

      renderListings(data);
    } catch (error) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          İlanlar yüklenemedi. Lütfen tekrar deneyin.
        </div>
      `;
    }
  }

  document.querySelectorAll("[data-panel]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-panel]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const isMessages = button.dataset.panel === "messages";
      listingsPanel.style.display = isMessages ? "none" : "block";
      messagesPanel.style.display = isMessages ? "block" : "none";
    });
  });

  loadListings();
})();

function deleteListing(id) {
  if (!confirm("Silmek istediğine emin misin?")) return;

  fetch(`/api/listings/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(() => location.reload());
}

function editListing(id) {
  window.location.href = `/create-listing.html?edit=${id}`;
}

function viewListing(id) {
  window.location.href = `/listing-detail.html?id=${id}`;
}

function dashboardContent() {
  return document.querySelector(".content") || document.getElementById("listingsPanel");
}

function escapeMessageHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function loadSection(type) {
  const content = dashboardContent();
  if (!content) return;

  if (type === "messages") {
    const user = JSON.parse(localStorage.getItem("user"));
    const userKey = user.id || user._id || user.email;

    content.innerHTML = `
      <h2>Mesajlarım</h2>
      <div class="chat-list">Mesajlar yükleniyor...</div>
    `;

    fetch(`/api/messages/${encodeURIComponent(userKey)}`)
      .then(res => res.json())
      .then(data => {
        const list = document.querySelector(".chat-list");

        list.innerHTML = Array.isArray(data) && data.length
          ? data.map(m => `
            <div class="msg-card ${m.sender === userKey ? "mine" : "theirs"}">
              <div>
                <b>${escapeMessageHtml(m.sender === userKey ? m.receiver : m.sender)}</b>
                <small>${m.listingId?.title ? escapeMessageHtml(m.listingId.title) : "İlan mesajı"}</small>
              </div>
              <p>${escapeMessageHtml(m.message || "")}</p>
              <span>${new Date(m.createdAt).toLocaleString("tr-TR")}</span>
            </div>
          `).join("")
          : `<div class="empty-state">Henüz mesajınız yok.</div>`;
      });
  }

  if (type === "favorites") {
    content.innerHTML = `
      <h2>Favorilerim</h2>
      <div id="favList"></div>
    `;

    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`/api/listings/favorites?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("favList").innerHTML =
          data.map(l => `
            <div class="listing-card">
              <img src="${l.image}">
              <h3>${l.title}</h3>
              <p>${l.price} TL</p>
            </div>
          `).join("");
      });
  }
}

const dashboardStyle = document.createElement("style");
dashboardStyle.textContent = `
  .card {
    border-radius: 12px;
    overflow: hidden;
    transition: 0.2s;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }

  .chat-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 14px;
  }

  .msg-card {
    max-width: 72%;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 12px;
    box-shadow: 0 6px 18px rgba(15,23,42,0.06);
  }

  .msg-card.mine {
    align-self: flex-end;
    background: #2563eb;
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  .msg-card.theirs {
    align-self: flex-start;
    background: #fff;
    color: #111827;
    border-bottom-left-radius: 4px;
  }

  .msg-card div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .msg-card small,
  .msg-card span {
    color: #6b7280;
    font-size: 12px;
  }

  .msg-card.mine small,
  .msg-card.mine span {
    color: rgba(255,255,255,0.78);
  }

  .msg-card p {
    margin: 8px 0 0;
  }
`;
document.head.appendChild(dashboardStyle);

document.querySelectorAll('.menu-item[href="/messages.html"], .menu-item[href="/favorites.html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    document.querySelectorAll(".menu-item").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    if (link.getAttribute("href") === "/messages.html") loadSection("messages");
    if (link.getAttribute("href") === "/favorites.html") loadSection("favorites");
  });
});
