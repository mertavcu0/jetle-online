let activeConversation = null;
let inboxTimer = null;

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function currentUserId() {
  const user = currentUser();
  return user.id || user._id;
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

function renderProfileInfo() {
  const user = currentUser();
  const info = document.getElementById("profileInfo");
  if (!info) return;

  info.textContent = `${user.username || "Jetle Kullanıcı"} - ${user.email || "E-posta bilgisi yok"}`;
}

async function loadMyListings() {
  const token = localStorage.getItem("token");
  const container = document.getElementById("myListings");
  if (!container) return;

  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  container.innerHTML = `<div class="spinner"></div>`;

  try {
    const res = await fetch("/api/my-listings", {
      headers: authHeaders(),
    });
    const listings = await res.json();
    if (!res.ok) throw new Error(listings.message || "İlanlar alınamadı");

    container.innerHTML = listings.map((item) => `
      <div class="admin-row">
        <img src="${imageOf(item)}" alt="${item.title}">
        <div>
          <a href="${listingUrl(item)}"><strong>${item.title}</strong></a>
          <div class="muted">
            ${money(item.price)} - ${item.city}
            ${item.isBoosted ? ` - Öne çıkarıldı (${shortTime(item.boostUntil)})` : ""}
          </div>
        </div>
        <div class="row-actions">
          <button class="boost-btn" data-boost-id="${item._id}" type="button">${item.isBoosted ? "Süre uzat" : "Öne çıkar"}</button>
          <button class="admin-delete" data-id="${item._id}">Sil</button>
        </div>
      </div>
    `).join("") || `<div class="message">Henüz ilanınız yok.</div>`;
  } catch (error) {
    container.innerHTML = `<div class="message">${error.message}</div>`;
  }
}

async function boostListing(id) {
  const res = await fetch(`/api/boost/${id}`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "İlan öne çıkarılamadı");
    return;
  }

  loadMyListings();
}

async function loadFavoriteListings() {
  const container = document.getElementById("favoriteListings");
  if (!container) return;

  container.innerHTML = `<div class="spinner"></div>`;

  try {
    const res = await fetch("/api/favorites", {
      headers: authHeaders(),
    });
    const favorites = await res.json();
    if (!res.ok) throw new Error(favorites.message || "Favoriler alınamadı");

    container.innerHTML = favorites.map((item) => `
      <div class="admin-row favorite-row">
        <img src="${imageOf(item)}" alt="${item.title}">
        <div>
          <a href="${listingUrl(item)}"><strong>${item.title}</strong></a>
          <div class="muted">${money(item.price)} - ${item.city}</div>
        </div>
        <button class="favorite-remove" data-favorite-id="${item._id}" type="button">♥</button>
      </div>
    `).join("") || `<div class="message">Henüz favori ilanınız yok.</div>`;
  } catch (error) {
    container.innerHTML = `<div class="message">${error.message}</div>`;
  }
}

function renderConversationMessages(messages) {
  const userId = currentUserId();

  return messages.map((msg) => `
    <div class="chat-message ${String(msg.sender?._id || msg.sender) === String(userId) ? "mine" : ""} ${msg.seen ? "seen" : ""}" id="msg-${msg._id}">
      <p>${msg.text}</p>
      <small>${shortTime(msg.createdAt)}</small>
      ${String(msg.sender?._id || msg.sender) === String(userId) ? `<button class="msg-delete" type="button" onclick="deleteMsg('${msg._id}')">Sil</button>` : ""}
    </div>
  `).join("") || `<div class="muted">Henüz mesaj yok.</div>`;
}

async function markConversationSeen(conversation) {
  const token = localStorage.getItem("token");
  const userId = currentUserId();
  if (!token || !userId || !conversation?.listing?._id || !conversation?.user?._id) return;

  try {
    await fetch(`/api/messages/seen/${conversation.listing._id}/${userId}`, {
      method: "PUT",
      headers: authHeaders(),
    });
    emitSeen?.({ listingId: conversation.listing._id, userId: conversation.user._id });
    loadUnread?.();
  } catch {
    // Seen state is non-critical; keep the inbox usable.
  }
}

async function loadConversation(conversation = activeConversation) {
  const panel = document.getElementById("conversationPanel");
  if (!panel || !conversation?.listing?._id || !conversation?.user?._id) return;

  activeConversation = conversation;
  window.currentChatUser = conversation.user._id;
  window.currentListingId = conversation.listing._id;

  try {
    const res = await fetch(`/api/messages/${conversation.listing._id}/${conversation.user._id}`, {
      headers: authHeaders(),
    });
    const messages = await res.json();
    if (!res.ok) throw new Error(messages.message || "Mesajlar alınamadı");

    panel.innerHTML = `
      <div class="conversation-head">
        <div>
          <strong>${conversation.listing.title}</strong>
          <div class="muted">${conversation.user.username || "Jetle Kullanıcı"} <span id="status" class="chat-status offline">Offline</span></div>
          <div class="typing-line" id="typing"></div>
        </div>
      </div>
      <div class="chat-messages profile-chat" id="profileChatMessages">
        ${renderConversationMessages(messages)}
      </div>
      <form class="chat-form" id="profileChatForm">
        <input name="text" placeholder="Mesaj yaz">
        <button class="btn-primary" type="submit">Gönder</button>
      </form>
    `;

    const chatBox = document.getElementById("profileChatMessages");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    if (messages.some((msg) => String(msg.receiver?._id || msg.receiver) === String(currentUserId()) && !msg.seen)) {
      markConversationSeen(conversation);
    }

    document.getElementById("profileChatForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const text = event.currentTarget.text.value.trim();
      if (!text) return;

      const sendRes = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          receiver: conversation.user._id,
          listing: conversation.listing._id,
          text,
        }),
      });

      if (!sendRes.ok) {
        const data = await sendRes.json();
        alert(data.message || "Mesaj gönderilemedi");
        return;
      }

      event.currentTarget.reset();
      emitSocketMessage?.({
        sender: currentUserId(),
        receiver: conversation.user._id,
        listing: conversation.listing._id,
        text,
        createdAt: new Date(),
      });
      loadConversation(conversation);
      loadConversations(false);
      loadUnread?.();
    });

    document.getElementById("profileChatForm")?.text?.addEventListener("input", () => {
      emitTyping?.(conversation.user._id);
    });

    setChatPresence?.(conversation.user._id);
  } catch (error) {
    panel.innerHTML = `<div class="message">${error.message}</div>`;
  }
}

async function loadConversations(renderFirst = true) {
  const list = document.getElementById("conversationList");
  if (!list) return;

  try {
    const res = await fetch("/api/messages/conversations", {
      headers: authHeaders(),
    });
    const conversations = await res.json();
    if (!res.ok) throw new Error(conversations.message || "Konuşmalar alınamadı");

    list.innerHTML = conversations.map((item, index) => `
      <button class="conversation-item ${activeConversation?.listing?._id === item.listing?._id && activeConversation?.user?._id === item.user?._id ? "active" : ""}"
        data-index="${index}" type="button">
        <img src="${imageOf(item.listing || {})}" alt="${item.listing?.title || "İlan"}">
        <span>
          <strong>${item.listing?.title || "İlan"}</strong>
          <small>${item.user?.username || "Jetle Kullanıcı"} - ${item.lastMessage}</small>
        </span>
      </button>
    `).join("") || `<div class="message">Henüz mesajınız yok.</div>`;

    list.querySelectorAll("[data-index]").forEach((button) => {
      button.addEventListener("click", () => {
        loadConversation(conversations[Number(button.dataset.index)]);
      });
    });

    if (renderFirst && !activeConversation && conversations[0]) {
      loadConversation(conversations[0]);
    }
  } catch (error) {
    list.innerHTML = `<div class="message">${error.message}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
    return;
  }

  renderProfileInfo();
  loadUnread?.();
  loadMyListings();
  loadFavoriteListings();
  loadConversations();

  if (inboxTimer) clearInterval(inboxTimer);
  inboxTimer = setInterval(() => {
    loadConversations(false);
    if (activeConversation) loadConversation(activeConversation);
  }, 3000);

  document.addEventListener("onlineUsers:update", () => {
    if (activeConversation?.user?._id) setChatPresence?.(activeConversation.user._id);
  });
  document.addEventListener("socket:newMessage", (event) => {
    const msg = event.detail;
    if (
      activeConversation &&
      String(msg.listing) === String(activeConversation.listing._id)
    ) {
      loadConversation(activeConversation);
      loadConversations(false);
    } else {
      loadConversations(false);
    }
  });
  document.addEventListener("socket:typing", (event) => {
    if (activeConversation?.user?._id && String(event.detail) === String(activeConversation.user._id)) {
      showTyping?.(event.detail);
    }
  });
  document.addEventListener("socket:seen", (event) => {
    if (activeConversation?.listing?._id && String(event.detail) === String(activeConversation.listing._id)) {
      document.querySelectorAll("#profileChatMessages .chat-message.mine").forEach((el) => {
        el.classList.add("seen");
      });
    }
  });

  document.getElementById("myListings")?.addEventListener("click", (event) => {
    const boostButton = event.target.closest("[data-boost-id]");
    if (boostButton) {
      boostListing(boostButton.dataset.boostId);
      return;
    }

    const button = event.target.closest("[data-id]");
    if (button) deleteListing(button.dataset.id, loadMyListings);
  });

  document.getElementById("favoriteListings")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-favorite-id]");
    if (!button) return;

    const res = await fetch(`/api/favorites/${button.dataset.favoriteId}`, {
      method: "POST",
      headers: authHeaders(),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Favori kaldırılamadı");
      return;
    }

    loadFavoriteListings();
  });
});
