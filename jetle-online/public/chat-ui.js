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
    return Boolean(store.token && ChatState.getUserId(store.currentUser));
  }

  function isMobileInputMode() {
    return window.matchMedia("(hover: none), (pointer: coarse), (max-width: 820px)").matches;
  }

  function autoResizeTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 168);
    textarea.style.height = `${Math.max(nextHeight, 52)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 168 ? "auto" : "hidden";
  }

  function resetTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = "";
    textarea.style.overflowY = "";
  }

  function keepComposerVisible() {
    if (!isMobileInputMode()) return;
    window.requestAnimationFrame(() => {
      document.getElementById("composerForm")?.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
    });
  }

  function getConversationIdentity(conversation) {
    return String(conversation?.conversationId || conversation?.id || conversation?.conversationKey || "");
  }

  function getActiveConversation(store) {
    return store.conversations.find((item) => getConversationIdentity(item) === store.activeConversationId) || null;
  }

  function syncActiveConversation(store) {
    store.activeConversation = getActiveConversation(store);
    return store.activeConversation;
  }

  function dedupeConversations(conversations) {
    const map = new Map();
    for (const conversation of conversations) {
      const identity = getConversationIdentity(conversation);
      const dedupeKey = identity || conversation.conversationKey;
      if (!dedupeKey) continue;
      const existing = map.get(dedupeKey);
      if (!existing) {
        map.set(dedupeKey, conversation);
        continue;
      }
      const existingUpdated = new Date(existing.updatedAt || 0).getTime();
      const incomingUpdated = new Date(conversation.updatedAt || 0).getTime();
      map.set(dedupeKey, incomingUpdated >= existingUpdated ? conversation : existing);
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  }

  function upsertConversation(store, rawConversation) {
    const summary = ChatState.buildConversationSummary(rawConversation, {
      currentUser: store.currentUser,
      listing: store.listing
    });
    const identity = getConversationIdentity(summary);
    const next = store.conversations.filter((item) => getConversationIdentity(item) !== identity);
    next.unshift(summary);
    store.conversations = dedupeConversations(next);
    return summary;
  }

  function updateConversationPreviewFromMessages(store) {
    const active = syncActiveConversation(store);
    if (!active) return;
    const lastMessage = store.activeMessages[store.activeMessages.length - 1] || null;
    if (!lastMessage) return;
    const identity = getConversationIdentity(active);
    store.conversations = store.conversations.map((item) => (
      getConversationIdentity(item) === identity
        ? {
            ...item,
            lastMessage,
            updatedAt: lastMessage.updatedAt || lastMessage.createdAt || item.updatedAt
          }
        : item
    ));
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
      const identity = getConversationIdentity(conversation);
      const preview = conversation.lastMessage?.text || "Henüz mesaj bulunmuyor.";
      const timestamp = conversation.lastMessage?.createdAt || conversation.updatedAt;
      return `
        <button class="conversation-item ${identity === store.activeConversationId ? "active" : ""}" type="button" data-action="select-conversation" data-conversation-id="${ChatState.escapeHtml(identity)}">
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

    if (!active && !listing) {
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
        <img class="chat-listing-thumb" src="${ChatState.escapeHtml(relativeImage(listing || {}))}" alt="${ChatState.escapeHtml(listing?.title || "İlan")}">
        <div class="chat-header-copy">
          <h2>${ChatState.escapeHtml(active?.otherUserName || owner?.name || owner?.email || "İlan sahibi")}</h2>
          <p>${ChatState.escapeHtml(listing?.title || "İlan")}</p>
        </div>
      </div>
      ${active ? `
        <div class="chat-header-actions">
          <button class="chat-header-btn" type="button" data-action="delete-conversation">Konuşmayı Sil</button>
        </div>
      ` : ""}
    `;
  }

  function renderChatFeed(store) {
    const feed = document.getElementById("chatFeed");
    if (!feed) return;

    if (!store.activeConversationId || !store.activeMessages.length) {
      feed.innerHTML = `<div class="chat-empty">Henüz mesaj bulunmuyor.</div>`;
      return;
    }

    feed.innerHTML = store.activeMessages.map((message) => `
      <div class="message-row ${message.mine ? "mine" : "theirs"}">
        <div class="message-bubble">${ChatState.escapeHtml(message.text)}</div>
        <div class="message-meta">${ChatState.escapeHtml(formatDateTime(message.createdAt))}${message.mine && message.isRead ? " • Görüldü" : ""}</div>
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
          <h3>İlan Özeti</h3>
          <p>Konuştuğunuz ilanı hızlıca gözden geçirin.</p>
        </div>
        <div class="empty-panel">Bir ilan seçildiğinde özeti burada gösterilecek.</div>
      `;
      return;
    }

    panel.innerHTML = `
      <div class="listing-summary-header">
        <h3>İlan Özeti</h3>
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
      autoResizeTextarea(input);
      return;
    }

    input.disabled = false;
    sendButton.disabled = false;

    if (!store.editingMessageId) {
      input.placeholder = "Mesaj yaz...";
      sendButton.textContent = "Gönder";
      cancelButton.classList.remove("show");
      autoResizeTextarea(input);
      return;
    }

    const editing = store.activeMessages.find((item) => item.id === store.editingMessageId);
    if (!editing) {
      store.editingMessageId = "";
      input.placeholder = "Mesaj yaz...";
      sendButton.textContent = "Gönder";
      cancelButton.classList.remove("show");
      autoResizeTextarea(input);
      return;
    }

    input.value = editing.text;
    input.placeholder = "Mesajı düzenleyin...";
    sendButton.textContent = "Kaydet";
    cancelButton.classList.add("show");
    autoResizeTextarea(input);
  }

  function renderAll(store) {
    renderConversationList(store);
    renderChatHeader(store);
    renderChatFeed(store);
    renderListingSummary(store);
    syncComposer(store);
  }

  function applyConversationDetail(store, detail, fallbackConversationId = "") {
    const listing = ChatState.normalizeListing(detail?.listing || store.listing || {});
    const summary = upsertConversation(store, {
      id: detail?.conversation?.id || detail?.id || fallbackConversationId,
      conversationId: detail?.conversation?.conversationId || detail?.id || fallbackConversationId,
      listing,
      sellerId: listing?.user?.id || detail?.conversation?.otherUserId || "",
      otherUser: detail?.otherUser || detail?.conversation?.otherUser || null,
      otherUserId: detail?.conversation?.otherUserId || detail?.otherUser?.id || listing?.user?.id || "",
      otherUserEmail: detail?.conversation?.otherUserEmail || detail?.otherUser?.email || listing?.user?.email || "",
      otherUserName: detail?.conversation?.otherUserName || detail?.otherUser?.name || listing?.user?.name || listing?.user?.email || "",
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: ChatState.pickListingImage(listing),
      listingPrice: listing.price,
      listingCity: listing.city,
      updatedAt: detail?.conversation?.updatedAt || detail?.id || "",
      lastMessage: Array.isArray(detail?.messages) && detail.messages.length
        ? ChatState.normalizeMessage(detail.messages[detail.messages.length - 1], store.currentUser)
        : null,
      unreadCount: 0
    });

    store.listing = listing.id ? listing : store.listing;
    store.listingOwner = ChatState.normalizeListingOwner(store.listing || listing);
    store.activeConversationId = getConversationIdentity(summary);
    store.activeMessages = Array.isArray(detail?.messages)
      ? detail.messages.map((message) => ChatState.normalizeMessage(message, store.currentUser))
      : [];
    syncActiveConversation(store);
    updateConversationPreviewFromMessages(store);
    return summary;
  }

  async function loadConversationDetail(store, conversationId) {
    if (!conversationId) return null;
    store.isLoadingConversation = true;
    try {
      const detail = await ChatApi.fetchConversation(conversationId);
      applyConversationDetail(store, detail, conversationId);
      return detail;
    } finally {
      store.isLoadingConversation = false;
    }
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
    store.conversations = dedupeConversations(
      rawConversations.map((conversation) => ChatState.buildConversationSummary(conversation, {
        currentUser: store.currentUser,
        listing: store.listing && String(conversation.listingId || "") === String(store.listing.id || "")
          ? store.listing
          : null
      }))
    );

    if (store.query.conversationId) {
      await loadConversationDetail(store, store.query.conversationId);
      return;
    }

    if (store.query.listingId) {
      const byListing = await ChatApi.fetchConversationByListing(store.query.listingId);
      if (byListing?.success && byListing?.conversation?.conversationId) {
        applyConversationDetail(store, byListing, byListing.conversation.conversationId);
        return;
      }
    }

    if (store.conversations.length) {
      const firstConversationId = store.conversations[0].conversationId || store.conversations[0].id;
      if (firstConversationId) {
        await loadConversationDetail(store, firstConversationId);
      }
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

    const listingId = String(store.listing?.id || store.listing?._id || "").trim();
    if (!listingId) {
      setComposerStatus("İlan bilgisi bulunamadı.");
      return;
    }

    store.isSending = true;

    try {
      setComposerStatus("");

      if (store.editingMessageId) {
        const response = await ChatApi.updateMessage(store.editingMessageId, text);
        store.activeMessages = store.activeMessages.map((item) => (
          item.id === response.message.id
            ? ChatState.normalizeMessage(response.message, store.currentUser)
            : item
        ));
        store.editingMessageId = "";
      } else {
        const conversationId = String(store.activeConversationId || "").trim();
        const usersPart = conversationId.split("users:")[1] || "";
        const parsedUsers = usersPart
          .split("_")
          .map((id) => String(id).trim())
          .filter(Boolean);
        const currentUserId = String(store.currentUser?._id || store.currentUser?.id || "").trim();
        const receiverId = parsedUsers.find(
          (id) => id !== currentUserId
        ) || String(store.listingOwner?.id || "").trim();
        const lockedReceiverId = receiverId;
        console.log("FRONTEND_USER_PARSE", {
          conversationId,
          parsedUsers,
          currentUserId,
          receiverId,
          lockedReceiverId
        });
        const messagePayload = {
          listingId,
          text,
          message: text,
          content: text,
          conversationId,
          senderId: String(store.currentUser?.id || store.currentUser?._id || ""),
          receiverId: lockedReceiverId,
          receiverEmail: store.listingOwner?.email || ""
        };
        console.log("FINAL_MESSAGE_PAYLOAD", messagePayload);
        const response = await ChatApi.sendMessage(messagePayload);
        const message = ChatState.normalizeMessage(response.message, store.currentUser);
        const responseConversationId = String(response.conversationId || message.conversationId || "").trim();
        const summary = upsertConversation(store, {
          id: responseConversationId,
          conversationId: responseConversationId,
          listing: store.listing,
          sellerId: store.listingOwner?.id || "",
          otherUser: store.listing?.user || null,
          otherUserId: store.listingOwner?.id || "",
          otherUserEmail: store.listingOwner?.email || "",
          otherUserName: store.listingOwner?.name || store.listingOwner?.email || "İlan sahibi",
          lastMessage: message,
          updatedAt: message.updatedAt || message.createdAt,
          unreadCount: 0
        });
        store.activeConversationId = getConversationIdentity(summary);
        store.activeMessages = [...store.activeMessages, message];
        updateConversationPreviewFromMessages(store);
        console.log("MESSAGE_SEND_SUCCESS", {
          conversationId: responseConversationId,
          listingId,
          messageId: message.id || message._id || ""
        });
      }

      syncActiveConversation(store);
      input.value = "";
      resetTextarea(input);
      renderAll(store);
    } catch (error) {
      console.error("MESSAGE_SEND_ERROR_RESPONSE", {
        status: error?.status || null,
        errorData: error?.payload || null
      });
      setComposerStatus("Mesaj gönderilemedi.");
    } finally {
      store.isSending = false;
    }
  }

  async function handleConversationSelect(store, button) {
    const conversationId = String(button.dataset.conversationId || "").trim();
    if (!conversationId || conversationId === store.activeConversationId) {
      closeMobileSidebar();
      return;
    }
    store.activeConversationId = conversationId;
    syncActiveConversation(store);
    renderConversationList(store);
    renderChatHeader(store);
    renderChatFeed(store);
    renderListingSummary(store);
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
    if (!active?.conversationId) return;
    if (!window.confirm("Bu konuşmayı silmek istediğinize emin misiniz?")) return;

    try {
      await ChatApi.deleteConversation(active.conversationId);
      store.conversations = store.conversations.filter((item) => getConversationIdentity(item) !== getConversationIdentity(active));
      store.activeConversationId = "";
      store.activeMessages = [];
      store.editingMessageId = "";
      syncActiveConversation(store);

      if (store.conversations.length) {
        await loadConversationDetail(store, store.conversations[0].conversationId || store.conversations[0].id);
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
    if (input) {
      input.value = "";
      resetTextarea(input);
    }
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
      if (event.key === "Enter" && !event.shiftKey && !isMobileInputMode()) {
        void handleSend(store, event);
      }
    });

    document.getElementById("messageInput")?.addEventListener("input", (event) => {
      autoResizeTextarea(event.currentTarget);
    });

    document.getElementById("messageInput")?.addEventListener("focus", () => {
      keepComposerVisible();
    });

    if (window.visualViewport) {
      const viewportHandler = () => {
        document.documentElement.style.setProperty("--viewport-offset-bottom", `${Math.max(0, window.innerHeight - window.visualViewport.height)}px`);
        keepComposerVisible();
      };
      window.visualViewport.addEventListener("resize", viewportHandler);
      window.visualViewport.addEventListener("scroll", viewportHandler);
    }

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

    document.getElementById("mobileConversationToggle")?.addEventListener("click", openMobileSidebar);
    document.getElementById("mobileOverlay")?.addEventListener("click", closeMobileSidebar);
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    });
  }

  async function initMessagesPage() {
    if (document.body.dataset.page !== "messages") return;

    const store = ChatState.createStore();
    bindEvents(store);
    autoResizeTextarea(document.getElementById("messageInput"));

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
