const phoneBtn = document.getElementById("showPhoneBtn");

let phoneShown = false;
let currentIndex = 0;
let images = [];

function resolveImage(src) {
  if (!src || String(src).trim() === "") {
    return "https://picsum.photos/600/400";
  }
  return src;
}

function getImage(listing) {
  if (listing.image && listing.image.trim() !== "") {
    return listing.image;
  }

  if (Array.isArray(listing.images) && listing.images.length > 0) {
    return listing.images[0];
  }

  return "https://picsum.photos/600/400";
}

function renderGallery(listing) {
  const main = document.getElementById("mainImage");
  const thumbs = document.getElementById("thumbnails");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  images = Array.isArray(listing.images) && listing.images.length
    ? listing.images
    : listing.image && listing.image.trim() !== ""
      ? [listing.image]
      : ["https://picsum.photos/600/400"];

  currentIndex = 0;

  function showImage(index) {
    if (!main) return;
    main.onload = () => {
      main.parentElement.querySelector(".no-image-text")?.remove();
    };
    main.onerror = () => {
      main.src = "https://picsum.photos/600/400";
    };
    main.src = resolveImage(images[index]);

    document.querySelectorAll("#thumbnails img").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  showImage(currentIndex);

  if (!thumbs) return;

  thumbs.innerHTML = "";

  images.forEach((img, index) => {
    const el = document.createElement("img");
    el.src = resolveImage(img);
    el.className = index === 0 ? "active" : "";

    el.onclick = () => {
      currentIndex = index;
      showImage(currentIndex);
    };

    thumbs.appendChild(el);
  });

  if (next) {
    next.onclick = () => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    };
  }

  if (prev) {
    prev.onclick = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    };
  }
}

async function loadListing() {
  const id = new URLSearchParams(window.location.search).get("id");

  try {
    const res = await fetch(`/api/listings/${id}`);
    if (!res.ok) throw new Error("not found");

    const data = await res.json();
    console.log("DATA:", data);
    window.listingData = data;

    document.getElementById("title").innerText = data.title || "";
    document.getElementById("price").innerText = (data.price || 0) + " TL";
    document.getElementById("city").innerText = data.city || "";
    document.getElementById("category").innerText = data.category || "";

    const descEl = document.getElementById("desc");
    const descTextEl = document.getElementById("descText");
    if (descEl && !descTextEl) descEl.innerText = data.desc || data.description || "";
    if (descTextEl) descTextEl.innerText = data.desc || data.description || "";

    const sellerName = document.getElementById("sellerName");
    const sellerCity = document.getElementById("sellerCity");
    if (sellerName) sellerName.innerText = data.sellerName || "Jetle Kullanıcı";
    if (sellerCity) sellerCity.innerText = data.city || "";

    renderGallery(data);
  } catch (err) {
    document.querySelector(".detail-container").innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2>İlan bulunamadı</h2>
        <p>Bu ilan silinmiş veya mevcut değil.</p>
        <a href="index.html">Ana sayfaya dön</a>
      </div>
    `;
  }
}

loadListing();

document.querySelectorAll(".tab").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

if (phoneBtn) {
  phoneBtn.addEventListener("click", () => {
    if (!phoneShown) {
      const phone = window.listingData?.phone || "05xx xxx xx xx";

      phoneBtn.innerText = phone;
      phoneBtn.style.background = "#16a34a";
      phoneShown = true;
    }
  });
}

