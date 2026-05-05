let activeConversation = null;
let messagesLoadedOnce = false;

function messageToken() {
  return localStorage.getItem("token");
}

function messageUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function messageHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${messageToken()}`,
  };
}

function messageUserId() {
  const user = messageUser();
  return user?._id || user?.id || user?.userId || "";
}

function messageDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function conversationTitle(conversation) {
  return conversation?.listing?.title || "İlan konuşması";
}

function conversationUserName(conversation) {
  const user = conversation?.user;
  return user?.name || user?.username || user?.email || "Jetle kullanıcısı";
}

function setMessageForm(enabled) {
  const form = document.getElementById("messageForm");
  if (!form) return;
  form.text.disabled = !enabled;
  form.querySelector("button").disabled = !enabled;
}

function emptyConversation(text) {
  return `<div class="account-empty-state">${text}</div>`;
}

async function loadAccountMessages(force = false) {
  const list = document.getElementById("conversationList");
  if (!list) return;
  if (messagesLoadedOnce && !force) return;

  list.innerHTML = `<div class="spinner"></div>`;

  try {
    const res = await fetch("/api/messages/conversations", {
      headers: messageHeaders(),
    });
    const conversations = await res.json();
    if (!res.ok) throw new Error(conversations.message || "Konuşmalar alınamadı");

    messagesLoadedOnce = true;

    if (!Array.isArray(conversations) || !conversations.length) {
      list.innerHTML = emptyConversation("Henüz mesajınız yok.");
      setMessageForm(false);
      return;
    }

    list.innerHTML = conversations.map((conversation, index) => {
      const listingId = conversation.listing?._id || conversation.listing;
      const userId = conversation.user?._id || conversation.user;
      return `
        <button class="conversation-item ${index === 0 ? "active" : ""}" type="button"
          data-listing-id="${listingId || ""}" data-user-id="${userId || ""}">
          <strong>${conversationTitle(conversation)}</strong>
          <span>${conversationUserName(conversation)}</span>
          <small>${conversation.lastMessage || ""}</small>
        </button>
      `;
    }).join("");

    const preferredListing = new URLSearchParams(window.location.search).get("listing");
    const first = preferredListing
      ? list.querySelector(`[data-listing-id="${preferredListing}"]`)
      : list.querySelector(".conversation-item");
    first?.click();
  } catch (error) {
    list.innerHTML = emptyConversation(error.message);
  }
}

async function openConversation(button) {
  const listingId = button.dataset.listingId;
  const userId = button.dataset.userId;
  if (!listingId || !userId) return;

  activeConversation = { listingId, userId };
  document.querySelectorAll(".conversation-item").forEach((item) => {
    item.classList.toggle("active", item === button);
  });

  const header = document.getElementById("messageHeader");
  const thread = document.getElementById("messageThread");
  if (header) {
    header.innerHTML = `
      <strong>${button.querySelector("strong")?.textContent || "Konuşma"}</strong>
      <span>${button.querySelector("span")?.textContent || ""}</span>
    `;
  }
  if (thread) thread.innerHTML = `<div class="spinner"></div>`;

  try {
    const res = await fetch(`/api/messages/${listingId}/${userId}`, {
      headers: messageHeaders(),
    });
    const messages = await res.json();
    if (!res.ok) throw new Error(messages.message || "Mesajlar alınamadı");
    renderMessages(messages);
    setMessageForm(true);
  } catch (error) {
    if (thread) thread.innerHTML = emptyConversation(error.message);
    setMessageForm(false);
  }
}

function renderMessages(messages) {
  const thread = document.getElementById("messageThread");
  if (!thread) return;

  if (!Array.isArray(messages) || !messages.length) {
    thread.innerHTML = emptyConversation("Bu konuşmada henüz mesaj yok.");
    return;
  }

  const currentId = messageUserId();
  const currentEmail = messageUser()?.email;
  thread.innerHTML = messages.map((message) => {
    const senderId = message.sender?._id || message.sender;
    const mine = currentId
      ? String(senderId) === String(currentId)
      : currentEmail && message.sender?.email === currentEmail;
    return `
      <div class="message-bubble ${mine ? "mine" : "other"}">
        <p>${message.text || ""}</p>
        <span>${messageDate(message.createdAt)}</span>
      </div>
    `;
  }).join("");
  thread.scrollTop = thread.scrollHeight;
}

async function sendAccountMessage(event) {
  event.preventDefault();
  if (!activeConversation) return;

  const form = event.currentTarget;
  const text = form.text.value.trim();
  if (!text) return;

  const button = form.querySelector("button");
  button.disabled = true;

  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: messageHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        receiver: activeConversation.userId,
        listing: activeConversation.listingId,
        text,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Mesaj gönderilemedi");

    form.reset();
    const activeButton = document.querySelector(".conversation-item.active");
    if (activeButton) await openConversation(activeButton);
    messagesLoadedOnce = false;
    await loadAccountMessages(true);
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("conversationList");
  const form = document.getElementById("messageForm");

  list?.addEventListener("click", (event) => {
    const button = event.target.closest(".conversation-item");
    if (button) openConversation(button);
  });

  form?.addEventListener("submit", sendAccountMessage);

  const tab = new URLSearchParams(window.location.search).get("tab") || window.location.hash.replace("#", "");
  if (tab === "messages") loadAccountMessages(true);
});

document.addEventListener("account:tab", (event) => {
  if (event.detail === "messages") loadAccountMessages();
});

window.loadAccountMessages = loadAccountMessages;
