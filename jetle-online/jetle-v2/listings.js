async function loadListings() {
  const res = await fetch("/api/listings");
  const data = await res.json();

  const container = document.getElementById("listingContainer");
  container.innerHTML = "";

  data.forEach(listing => {
    const img = (listing.image && listing.image.trim() !== "")
      ? listing.image
      : (listing.images && listing.images[0])
      ? listing.images[0]
      : "https://picsum.photos/300/200";
    const image = img;
    const src = image.startsWith("http") ? image : "" + image;
    const card = `
      <div class="listing-card" onclick="goDetail('${listing._id}')">
        <img src="${src}" />
        <h3>${listing.title || ""}</h3>
        <p>${listing.price || 0} TL</p>
        <span>${listing.city || ""}</span>
        ${renderBadges(listing)}
      </div>
    `;
    container.innerHTML += card;
  });
}

function getListingBadges(listing) {
  const badges = Array.isArray(listing.user?.badges) ? listing.user.badges : [];
  const legacyBadge = listing.user?.badge && listing.user.badge !== "none"
    ? [listing.user.badge]
    : [];

  return [...new Set([...badges, ...legacyBadge])].filter((badge) =>
    ["verified", "premium", "corporate"].includes(badge)
  );
}

function renderBadges(listing) {
  const labels = {
    verified: "✔ Onaylı",
    premium: "⭐ Premium",
    corporate: "🏢 Kurumsal"
  };
  const badges = getListingBadges(listing);

  if (!badges.length) return "";

  return `
    <div class="badge-row">
      ${badges.map((badge) => `<span class="seller-badge ${badge}">${labels[badge]}</span>`).join("")}
    </div>
  `;
}

function goDetail(id) {
  window.location.href = `listing.html?id=${id}`;
}

loadListings();

