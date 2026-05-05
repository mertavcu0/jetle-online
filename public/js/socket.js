const socket = window.io ? io(window.location.origin) : null;
const socketUser = JSON.parse(localStorage.getItem("user") || "null");
const socketUserId = socketUser?.id || socketUser?._id;

window.onlineUsers = [];

if (socket && socketUserId) {
  socket.emit("join", socketUserId);

  socket.on("onlineUsers", (users) => {
    window.onlineUsers = users.map(String);
    document.dispatchEvent(new CustomEvent("onlineUsers:update", { detail: window.onlineUsers }));
  });

  socket.on("newMessage", (msg) => {
    document.dispatchEvent(new CustomEvent("socket:newMessage", { detail: msg }));
    loadUnread();
  });

  socket.on("typing", (senderId) => {
    document.dispatchEvent(new CustomEvent("socket:typing", { detail: senderId }));
  });

  socket.on("seen", (listingId) => {
    document.dispatchEvent(new CustomEvent("socket:seen", { detail: listingId }));
    document.querySelectorAll(".msg.my, .chat-message.mine").forEach((el) => {
      el.classList.add("seen");
    });
    loadUnread();
  });

  socket.on("notification", (data) => {
    showNotification(data.text || "Yeni bildirim");
    loadUnread();
  });

  socket.on("messageDeleted", (id) => {
    document.dispatchEvent(new CustomEvent("socket:messageDeleted", { detail: id }));
    document.getElementById(`msg-${id}`)?.remove();
  });

  loadUnread();
}

function emitSocketMessage({ sender, receiver, text, listing, createdAt }) {
  if (!socket || !sender || !receiver || !text || !listing) return;

  socket.emit("sendMessage", {
    sender,
    receiver,
    text,
    listing,
    createdAt: createdAt || new Date(),
  });
}

function emitTyping(receiver) {
  if (!socket || !socketUserId || !receiver) return;
  socket.emit("typing", { sender: socketUserId, receiver });
}

function emitSeen({ listingId, userId }) {
  if (!socket || !listingId || !userId) return;
  socket.emit("markSeen", { listingId, userId });
}

function emitDeleteMessage({ messageId, to }) {
  if (!socket || !messageId || !to) return;
  socket.emit("deleteMessage", { messageId, to });
}

function showNotification(text) {
  const div = document.createElement("div");
  div.className = "notif";
  div.textContent = text;

  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

async function loadUnread() {
  const badge = document.getElementById("badge");
  const token = localStorage.getItem("token");
  if (!badge || !token || !socketUserId) return;

  try {
    const res = await fetch(`/api/messages/unread/${socketUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Okunmayan mesaj sayısı alınamadı");

    badge.textContent = data.count;
    badge.hidden = Number(data.count) === 0;
  } catch {
    badge.textContent = "0";
    badge.hidden = true;
  }
}

function setChatPresence(userId) {
  const status = document.getElementById("status");
  if (!status || !userId) return;

  const isOnline = window.onlineUsers.includes(String(userId));
  status.textContent = isOnline ? "Online" : "Offline";
  status.className = isOnline ? "chat-status online" : "chat-status offline";
}

function showTyping() {
  const typing = document.getElementById("typing");
  if (!typing) return;

  typing.textContent = "Yazıyor...";
  clearTimeout(window.__jetleTypingTimeout);
  window.__jetleTypingTimeout = setTimeout(() => {
    typing.textContent = "";
  }, 2000);
}

window.emitSocketMessage = emitSocketMessage;
window.emitTyping = emitTyping;
window.emitSeen = emitSeen;
window.emitDeleteMessage = emitDeleteMessage;
window.setChatPresence = setChatPresence;
window.showTyping = showTyping;
window.showNotification = showNotification;
window.loadUnread = loadUnread;
