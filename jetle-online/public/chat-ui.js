(function () {
  const ChatState = window.JetleChatState;
  const ChatApi = window.JetleChatApi;

  function formatPrice(price) {
    const value = Number(price || 0);
    if (Number.isNaN(value)) return "-";
    return `${new Intl.NumberFormat("tr-TR").format(value)} TL`;
  }

  function formatTime(dateValue) {
    if (!dateValue) return "";
    return new Date(dateValue).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatDateTime(dateValue) {
    if (!dateValue) return "";
    return new Date(dateValue).toLocaleString("tr-TR");
  }

  function relativeImage(listing) {
    const source = ChatState.pickListingImage(listing);
    if (!source) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23eef2f7'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%236b7280' font-family='Arial,sans-serif' font-size='24'%3EFoto%C4%9Fraf%20yok%3C/text%3E%3C/svg%3E";
    }
    if (String(source).startsWith("http") || String(source).startsWith("data:")) {
      return source;
    }
    return `/${String(source).replace(/^\/+/, "")}`;
  }

  function setComposerStatus(message, isError = true) {
    const statusEl = document.getElementById("composerStatus");
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.style.color = isError ? "#b91c1c" : "#166534";
    statusEl.classList.toggle("show", Boolean(message));
  }

  function hasSession(store) {
    return Boolean(
      store.token &&
      ChatState.getUserId(store.currentUser) &&
      ChatState.getUserEmail(store.currentUser)
    );
  }

  function getActiveConversation(store) {
    return store.conversations.find((item) => item.id === store.activeConversationId) || null;
  }

  function syncActiveConversation(store) {
    store.activeConversation = getActiveConversation(store);
    return store.activeConversation;
  }

  function upsertConversation(store, conversation) {
    const summary = ChatState.buildConversationSummary(conversation, {
      currentUser: store.currentUser,
      listing: store.listing
    });
    const index = store.conversations.findIndex((item) => item.id === summary.id);
    if (index === -1) {
      store.conversations.unshift(summary);
    } else {
      store.conversations[index] = summary;
    }
    store.conversations.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    if (!store.activeConversationId) {
      store.activeConversationId = summary.id;
    }
    syncActiveConversation(store);
    return summary;
  }

  function updateConversationPreviewFromMessages(store) {
    const active = syncActiveConversation(store);
    if (!active) return;
    const lastMessage = store.activeMessages[store.activeMessages.length - 1] || null;
    const index = store.conversations.findIndex((item) => item.id === active.id);
    if (index === -1) return;
    store.conversations[index] = {
      ...store.conversations[index],
      lastMessage,
      updatedAt: lastMessage?.updatedAt || lastMessage?.createdAt || store.conversations[index].updatedAt
    };
    syncActiveConversation(store);
  }

  function renderConversationList(store) {
    const list = document.getElementById("conversationList");
    if (!list) return;

    if (!store.conversations.length) {
      list.innerHTML = `<div class="empty-panel">Henüz mesaj bulunmuyor.</div>`;
      return;
    }

    list.innerHTML = store.conversations.map((conversation) => {
      const preview = conversation.lastMessage?.text || "Henüz mesaj bulunmuyor.";
      const timestamp = conversation.lastMessage?.createdAt || conversation.updatedAt;
      return `
        <button class="conversation-item ${conversation.id === store.activeConversationId ? "active" : ""}" type="button" data-action="select-conversation" data-conversation-id="${ChatState.escapeHtml(conversation.id)}">
          <div class="conversation-top">
            <span class="conversation-name">${ChatState.escapeHtml(conversation.otherUserName || "İlan sahibi")}</span>
            <span class="conversation-time">${ChatState.escapeHtml(formatTime(timestamp))}</span>
          </div>
          <div class="conversation-preview">${ChatState.escapeHtml(preview)}</div>
          <div class="conversation-bottom">
            <span class="conversation-listing">${ChatState.escapeHtml(conversation.listingTitle || "İlan")}</span>
            <span class="conversation-status">${conversation.unreadCount > 0 ? `<span class="unread-badge">${conversation.unreadCount}</span>` : ""}</span>
          </div>
        </button>
      `;
    }).join("");
  }

  function renderChatHeader(store) {
    const header = document.getElementById("chatHeader");
    if (!header) return;

    const active = syncActiveConversation(store);
    const listing = active?.listing || store.listing;
    const owner = active?.listingOwner || store.listingOwner;

    if (!active) {
      if (!listing) {
        header.innerHTML = `
          <div class="chat-header-copy">
            <h2>Mesajlar</h2>
            <p>Bir konuşma seçildiğinde detaylar burada görünecek.</p>
          </div>
        `;
        return;
      }

      header.innerHTML = `
        <div class="chat-header-main">
          <img class="chat-listing-thumb" src="${ChatState.escapeHtml(relativeImage(listing))}" alt="${ChatState.escapeHtml(listing.title || "İlan")}">
          <div class="chat-header-copy">
            <h2>${ChatState.escapeHtml(owner?.name || owner?.email || "İlan sahibi")}</h2>
            <p>${ChatState.escapeHtml(listing.title || "İlan")}</p>
          </div>
        </div>
      `;
      return;
    }

    header.innerHTML = `
      <div class="chat-header-main">
        <img class="chat-listing-thumb" src="${ChatState.escapeHtml(relativeImage(listing))}" alt="${ChatState.escapeHtml(active.listingTitle || "İlan")}">
        <div class="chat-header-copy">
          <h2>${ChatState.escapeHtml(active.otherUserName || owner?.name || owner?.email || "İlan sahibi")}</h2>
          <p>${ChatState.escapeHtml(active.listingTitle || "İlan")}</p>
        </div>
      </div>
      <div class="chat-header-actions">
        <button class="chat-header-btn" type="button" data-action="delete-conversation">Konuşmayı Sil</button>
      </div>
    `;
  }

  function renderChatFeed(store) {
    const feed = document.getElementById("chatFeed");
    if (!feed) return;

    if (!store.activeConversationId) {
      feed.innerHTML = `<div class="chat-empty">Henüz mesaj bulunmuyor.</div>`;
      return;
    }

    if (!store.activeMessages.length) {
      feed.innerHTML = `<div class="chat-empty">Henüz mesaj bulunmuyor.</div>`;
      return;
    }

    feed.innerHTML = store.activeMessages.map((message) => `
      <div class="message-row ${message.mine ? "mine" : "theirs"}">
        <div class="message-bubble">${ChatState.escapeHtml(message.text)}</div>
        <div class="message-meta">${ChatState.escapeHtml(formatDateTime(message.createdAt))}${message.mine && message.isRead ? " â€¢ Görüldü" : ""}</div>
        ${message.mine ? `
          <div class="message-tools">
            ${message.edited ? `<span class="edited-badge">düzenlendi</span>` : ""}
            <button class="message-tool" type="button" data-action="edit-message" data-message-id="${ChatState.escapeHtml(message.id)}">Düzenle</button>
            <button class="message-tool" type="button" data-action="delete-message" data-message-id="${ChatState.escapeHtml(message.id)}">Sil</button>
          </div>
        ` : ""}
      </div>
    `).join("");

    feed.scrollTop = feed.scrollHeight;
  }

  function renderListingSummary(store) {
    const panel = document.getElementById("listingSummary");
    if (!panel) return;

    const active = syncActiveConversation(store);
    const listing = active?.listing || store.listing;
    const owner = active?.listingOwner || store.listingOwner;

    if (!listing) {
      panel.innerHTML = `
        <div class="listing-summary-header">
          <h3>İlan Ã–zeti</h3>
          <p>Konuştuğunuz ilanı hızlıca gözden geçirin.</p>
        </div>
        <div class="empty-panel">Bir ilan seçildiğinde özeti burada gösterilecek.</div>
      `;
      return;
    }

    panel.innerHTML = `
      <div class="listing-summary-header">
        <h3>İlan Ã–zeti</h3>
        <p>Konuştuğunuz ilanı hızlıca gözden geçirin.</p>
      </div>
      <div class="listing-summary-body">
        <img class="listing-summary-image" src="${ChatState.escapeHtml(relativeImage(listing))}" alt="${ChatState.escapeHtml(listing.title || "İlan")}">
        <div>
          <h4 class="listing-summary-title">${ChatState.escapeHtml(listing.title || "İlan")}</h4>
        </div>
        <div class="listing-summary-price">${ChatState.escapeHtml(formatPrice(listing.price))}</div>
        <div class="listing-summary-meta">
          ${listing.city ? `<span>${ChatState.escapeHtml(listing.city)}</span>` : ""}
          <span>İlan sahibi: ${ChatState.escapeHtml(owner?.name || owner?.email || "Bilinmiyor")}</span>
        </div>
        <a class="listing-summary-link" href="/listing-detail.html?id=${encodeURIComponent(String(listing._id || listing.id || ""))}">İlana Git</a>
      </div>
    `;
  }

  function syncComposer(store) {
    const input = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendMessageBtn");
    const cancelButton = document.getElementById("cancelEditBtn");
    if (!input || !sendButton || !cancelButton) return;

    if (!hasSession(store)) {
      input.disabled = true;
      sendButton.disabled = true;
      cancelButton.classList.remove("show");
      return;
    }

    input.disabled = false;
    sendButton.disabled = false;

    if (!store.editingMessageId) {
      input.placeholder = "Mesaj yaz...";
      sendButton.textContent = "Gönder";
      cancelButton.classList.remove("show");
      return;
    }

    const editing = store.activeMessages.find((item) => item.id === store.editingMessageId);
    if (!editing) {
      store.editingMessageId = "";
      input.placeholder = "Mesaj yaz...";
      sendButton.textContent = "Gönder";
      cancelButton.classList.remove("show");
      return;
    }

    input.value = editing.text;
    input.placeholder = "Mesajı düzenleyin.";
    sendButton.textContent = "Kaydet";
    cancelButton.classList.add("show");
  }

  function renderAll(store) {
    renderConversationList(store);
    renderChatHeader(store);
    renderChatFeed(store);
    renderListingSummary(store);
    syncComposer(store);
  }

  async function loadConversationDetail(store, conversationId) {
    const detail = await ChatApi.fetchConversation(conversationId);
    if (!detail) return null;

    const listing = ChatState.normalizeListing(detail.listing || store.listing || {});
    const listingOwner = ChatState.normalizeListingOwner(listing);
    const summary = upsertConversation(store, {
      id: detail.id || conversationId,
      conversationId: detail.id || conversationId,
      listing,
      otherUser: detail.otherUser || null,
      otherUserId: detail.otherUser?._id || detail.otherUser?.id || listingOwner.id,
      otherUserEmail: detail.otherUser?.email || listingOwner.email,
      otherUserName: detail.otherUser?.name || detail.otherUser?.email || listingOwner.name || listingOwner.email,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: ChatState.pickListingImage(listing),
      listingPrice: listing.price,
      listingCity: listing.city,
      lastMessage: Array.isArray(detail.messages) && detail.messages.length
        ? ChatState.normalizeMessage(detail.messages[detail.messages.length - 1], store.currentUser)
        : null,
      updatedAt: Array.isArray(detail.messages) && detail.messages.length
        ? detail.messages[detail.messages.length - 1].updatedAt || detail.messages[detail.messages.length - 1].createdAt
        : "",
      unreadCount: 0
    });

    store.listing = listing.id ? listing : store.listing;
    store.listingOwner = listingOwner.id || listingOwner.email || listingOwner.name ? listingOwner : store.listingOwner;
    store.activeConversationId = summary.id;
    store.activeMessages = Array.isArray(detail.messages)
      ? detail.messages.map((message) => ChatState.normalizeMessage(message, store.currentUser))
      : [];
    syncActiveConversation(store);
    updateConversationPreviewFromMessages(store);
    return detail;
  }

  async function loadInitialData(store) {
    if (store.query.listingId) {
      const listing = await ChatApi.fetchListing(store.query.listingId);
      if (listing) {
        store.listing = ChatState.normalizeListing(listing);
        store.listingOwner = ChatState.normalizeListingOwner(store.listing);
      }
    }

    const rawConversations = hasSession(store) ? await ChatApi.fetchConversations() : [];
    store.conversations = rawConversations.map((conversation) =>
      ChatState.buildConversationSummary(conversation, {
        currentUser: store.currentUser,
        listing: store.listing && String(conversation.listingId || "") === String(store.listing.id || "")
          ? store.listing
          : null
      })
    );

    if (store.query.conversationId) {
      await loadConversationDetail(store, store.query.conversationId);
      return;
    }

    if (store.query.listingId && store.listing && store.listingOwner?.id) {
      const derivedConversationId = ChatState.buildConversationId(
        store.listing.id,
        ChatState.getUserId(store.currentUser),
        store.listingOwner.id
      );
      const matchingSummary = store.conversations.find((item) => item.id === derivedConversationId || item.conversationId === derivedConversationId);
      if (matchingSummary) {
        await loadConversationDetail(store, matchingSummary.conversationId || matchingSummary.id);
        return;
      }

      try {
        await loadConversationDetail(store, derivedConversationId);
        return;
      } catch (_) {
      }
    }

    if (store.conversations.length) {
      await loadConversationDetail(store, store.conversations[0].conversationId || store.conversations[0].id);
    }
  }

  async function handleSend(store, event) {
    event.preventDefault();
    event.stopPropagation();

    if (store.isSending) return;

    const input = document.getElementById("messageInput");
    const text = String(input?.value || "").trim();
    if (!text) return;
    if (!hasSession(store)) {
      setComposerStatus("Mesaj göndermek için giriş yapın.");
      return;
    }

    const listingId = String(store.listing?.id || store.listing?._id || store.activeConversation?.listingId || "").trim();
    if (!listingId) {
      setComposerStatus("İlan bilgisi bulunamadÄ±.");
      return;
    }

    store.isSending = true;

    try {
      setComposerStatus("");
      if (store.editingMessageId) {
        const response = await ChatApi.updateMessage(store.editingMessageId, text);
        store.activeMessages = store.activeMessages.map((item) =>
          item.id === response.message.id
            ? ChatState.normalizeMessage(response.message, store.currentUser)
            : item
        );
        store.editingMessageId = "";
      } else {
        const response = await ChatApi.sendMessage({
          listingId,
          text,
          receiverEmail: store.listingOwner?.email || ""
        });
        const message = ChatState.normalizeMessage(response.message, store.currentUser);
        const conversationId = String(response.conversationId || message.conversationId || "");
        let summary = store.conversations.find((item) => item.id === conversationId || item.conversationId === conversationId);
        if (!summary) {
          summary = upsertConversation(store, {
            id: conversationId,
            conversationId,
            listing: store.listing,
            otherUserId: store.listingOwner?.id || "",
            otherUserEmail: store.listingOwner?.email || "",
            otherUserName: store.listingOwner?.name || store.listingOwner?.email || "İlan sahibi",
            lastMessage: message,
            updatedAt: message.updatedAt || message.createdAt,
            unreadCount: 0
          });
        }
        store.activeConversationId = summary.id;
        store.activeMessages = [...store.activeMessages, message];
        updateConversationPreviewFromMessages(store);
      }

      syncActiveConversation(store);
      input.value = "";
      renderAll(store);
    } catch (error) {
      console.error("MESSAGE SEND ERROR", error);
      setComposerStatus("Mesaj gönderilemedi.");
    } finally {
      store.isSending = false;
    }
  }

  async function handleConversationSelect(store, button) {
    const conversationId = String(button.dataset.conversationId || "").trim();
    if (!conversationId) return;
    await loadConversationDetail(store, conversationId);
    renderAll(store);
    closeMobileSidebar();
  }

  async function handleDeleteMessage(store, button) {
    const messageId = String(button.dataset.messageId || "").trim();
    if (!messageId) return;

    try {
      await ChatApi.deleteMessage(messageId);
      store.activeMessages = store.activeMessages.filter((item) => item.id !== messageId);
      if (store.editingMessageId === messageId) {
        store.editingMessageId = "";
      }
      updateConversationPreviewFromMessages(store);
      renderAll(store);
    } catch (error) {
      console.error("MESSAGE DELETE ERROR", error);
      setComposerStatus("Mesaj silinemedi.");
    }
  }

  async function handleDeleteConversation(store) {
    const active = syncActiveConversation(store);
    if (!active) return;
    if (!window.confirm("Bu konuşmayı silmek istediğinize emin misiniz?")) return;

    try {
      await ChatApi.deleteConversation(active.id);
      store.conversations = store.conversations.filter((item) => item.id !== active.id);
      store.activeConversationId = "";
      store.activeMessages = [];
      store.editingMessageId = "";

      if (store.conversations.length) {
        await loadConversationDetail(store, store.conversations[0].conversationId || store.conversations[0].id);
      } else {
        syncActiveConversation(store);
      }
      renderAll(store);
    } catch (error) {
      console.error("CONVERSATION DELETE ERROR", error);
      setComposerStatus("Konuşma silinemedi.");
    }
  }

  function startEditing(store, button) {
    const messageId = String(button.dataset.messageId || "").trim();
    if (!messageId) return;
    const message = store.activeMessages.find((item) => item.id === messageId);
    if (!message) return;
    store.editingMessageId = messageId;
    renderAll(store);
  }

  function cancelEditing(store) {
    store.editingMessageId = "";
    const input = document.getElementById("messageInput");
    if (input) input.value = "";
    renderAll(store);
  }

  function closeMobileSidebar() {
    document.getElementById("conversationSidebar")?.classList.remove("open");
    document.getElementById("mobileOverlay")?.classList.remove("open");
  }

  function openMobileSidebar() {
    document.getElementById("conversationSidebar")?.classList.add("open");
    document.getElementById("mobileOverlay")?.classList.add("open");
  }

  function bindEvents(store) {
    document.getElementById("composerForm")?.addEventListener("submit", (event) => {
      void handleSend(store, event);
    });

    document.getElementById("sendMessageBtn")?.addEventListener("click", (event) => {
      void handleSend(store, event);
    });

    document.getElementById("cancelEditBtn")?.addEventListener("click", () => {
      cancelEditing(store);
    });

    document.getElementById("messageInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        void handleSend(store, event);
      }
    });

    document.getElementById("conversationList")?.addEventListener("click", (event) => {
      const button = event.target.closest('[data-action="select-conversation"]');
      if (!button) return;
      event.preventDefault();
      void handleConversationSelect(store, button);
    });

    document.getElementById("chatFeed")?.addEventListener("click", (event) => {
      const editButton = event.target.closest('[data-action="edit-message"]');
      if (editButton) {
        event.preventDefault();
        startEditing(store, editButton);
        return;
      }

      const deleteButton = event.target.closest('[data-action="delete-message"]');
      if (deleteButton) {
        event.preventDefault();
        void handleDeleteMessage(store, deleteButton);
      }
    });

    document.getElementById("chatHeader")?.addEventListener("click", (event) => {
      const deleteButton = event.target.closest('[data-action="delete-conversation"]');
      if (!deleteButton) return;
      event.preventDefault();
      void handleDeleteConversation(store);
    });

    document.getElementById("mobileConversationToggle")?.addEventListener("click", () => {
      openMobileSidebar();
    });

    document.getElementById("mobileOverlay")?.addEventListener("click", () => {
      closeMobileSidebar();
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    });
  }

  async function initMessagesPage() {
    if (!document.body.dataset.page || document.body.dataset.page !== "messages") {
      return;
    }

    const store = ChatState.createStore();
    bindEvents(store);

    try {
      if (!hasSession(store)) {
        setComposerStatus("Mesaj göndermek için giriş yapın.");
        renderAll(store);
        return;
      }

      await loadInitialData(store);
      renderAll(store);
    } catch (error) {
      console.error("MESSAGES INIT ERROR", error);
      setComposerStatus("Mesajlar yüklenemedi.");
      renderAll(store);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    void initMessagesPage();
  });
})();
