(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (_) {
      return {};
    }
  }

  function getStoredToken() {
    return String(localStorage.getItem("token") || "");
  }

  function getUserId(user) {
    return String(user?._id || user?.id || "");
  }

  function getUserEmail(user) {
    return String(user?.email || "").trim().toLowerCase();
  }

  function buildConversationId(listingId, firstUserId, secondUserId) {
    const sorted = [String(firstUserId || ""), String(secondUserId || "")].sort();
    return `listing:${String(listingId || "")}:users:${sorted.join("__")}`;
  }

  function normalizeListing(listing) {
    const safeListing = listing || {};
    return {
      _id: String(safeListing._id || safeListing.id || ""),
      id: String(safeListing.id || safeListing._id || ""),
      title: String(safeListing.title || "İlan"),
      price: Number(safeListing.price || 0),
      city: String(safeListing.city || ""),
      image: safeListing.image || "",
      mainImage: safeListing.mainImage || "",
      coverImage: safeListing.coverImage || "",
      images: Array.isArray(safeListing.images) ? safeListing.images : [],
      photos: Array.isArray(safeListing.photos) ? safeListing.photos : [],
      user: safeListing.user || null,
      userEmail: safeListing.userEmail || "",
      ownerEmail: safeListing.ownerEmail || ""
    };
  }

  function normalizeListingOwner(listing) {
    const safeListing = normalizeListing(listing);
    const owner = safeListing.user || {};
    return {
      id: String(owner._id || owner.id || ""),
      email: String(owner.email || safeListing.userEmail || safeListing.ownerEmail || "").trim().toLowerCase(),
      name: String(owner.name || owner.username || owner.email || "").trim()
    };
  }

  function normalizeMessage(message, currentUser) {
    const safeMessage = message || {};
    const sender = safeMessage.sender || {};
    const currentUserId = getUserId(currentUser);
    const currentUserEmail = getUserEmail(currentUser);
    const senderId = String(safeMessage.senderId || sender._id || sender.id || "");
    const senderEmail = String(sender.email || safeMessage.senderEmail || "").trim().toLowerCase();

    return {
      id: String(safeMessage.id || safeMessage._id || ""),
      conversationId: String(safeMessage.conversationId || ""),
      senderId,
      senderEmail,
      senderName: String(sender.name || safeMessage.senderName || senderEmail || "Kullanıcı"),
      text: String(safeMessage.text || ""),
      createdAt: safeMessage.createdAt || new Date().toISOString(),
      updatedAt: safeMessage.updatedAt || safeMessage.createdAt || new Date().toISOString(),
      isRead: Boolean(safeMessage.isRead),
      edited: Boolean(safeMessage.edited),
      mine: Boolean(
        (currentUserId && senderId === currentUserId) ||
        (currentUserEmail && senderEmail === currentUserEmail)
      )
    };
  }

  function pickListingImage(listing) {
    const safeListing = normalizeListing(listing);
    return (
      safeListing.coverImage ||
      safeListing.mainImage ||
      safeListing.images[0] ||
      safeListing.photos[0] ||
      safeListing.image ||
      ""
    );
  }

  function buildConversationSummary(rawConversation, context) {
    const currentUser = context.currentUser || {};
    const listingOverride = context.listing || null;
    const safeConversation = rawConversation || {};
    const listing = normalizeListing(safeConversation.listing || listingOverride || {});
    const listingOwner = normalizeListingOwner(listing);
    const derivedConversationId =
      safeConversation.conversationId ||
      safeConversation.id ||
      (listing.id && listingOwner.id && getUserId(currentUser)
        ? buildConversationId(listing.id, getUserId(currentUser), listingOwner.id)
        : "");

    const otherUserId = String(
      listingOwner.id ||
      safeConversation.otherUserId ||
      safeConversation.sellerId ||
      ""
    );
    const otherUserEmail = String(
      listingOwner.email ||
      safeConversation.otherUserEmail ||
      ""
    ).trim().toLowerCase();
    const otherUserName = String(
      listingOwner.name ||
      safeConversation.otherUserName ||
      safeConversation.otherUser?.name ||
      safeConversation.otherUser?.email ||
      otherUserEmail ||
      "İlan sahibi"
    );

    const rawLastMessage = safeConversation.lastMessage;
    const lastMessage = rawLastMessage && typeof rawLastMessage === "object"
      ? normalizeMessage(rawLastMessage, currentUser)
      : rawLastMessage
        ? {
            id: "",
            conversationId: derivedConversationId,
            senderId: "",
            senderEmail: "",
            senderName: "",
            text: String(rawLastMessage),
            createdAt: safeConversation.updatedAt || new Date().toISOString(),
            updatedAt: safeConversation.updatedAt || new Date().toISOString(),
            isRead: true,
            edited: false,
            mine: false
          }
        : null;

    return {
      id: String(safeConversation.id || derivedConversationId),
      conversationId: String(derivedConversationId),
      listingId: String(safeConversation.listingId || listing.id || ""),
      buyerId: String(safeConversation.buyerId || getUserId(currentUser) || ""),
      sellerId: String(safeConversation.sellerId || listingOwner.id || ""),
      otherUserId,
      otherUserEmail,
      otherUserName,
      listingOwner,
      listing,
      listingTitle: String(safeConversation.listingTitle || listing.title || "İlan"),
      listingImage: pickListingImage(listing),
      listingPrice: Number(
        safeConversation.listingPrice !== undefined
          ? safeConversation.listingPrice
          : listing.price || 0
      ),
      listingCity: String(safeConversation.listingCity || listing.city || ""),
      listingUrl: `/listing-detail.html?id=${encodeURIComponent(String(safeConversation.listingId || listing.id || ""))}`,
      lastMessage,
      updatedAt: safeConversation.updatedAt || lastMessage?.updatedAt || lastMessage?.createdAt || "",
      unreadCount: Number(safeConversation.unreadCount || 0)
    };
  }

  function createStore() {
    return {
      currentUser: getStoredUser(),
      token: getStoredToken(),
      listing: null,
      listingOwner: null,
      conversations: [],
      activeConversationId: "",
      activeMessages: [],
      activeConversation: null,
      editingMessageId: "",
      isSending: false,
      isLoading: false,
      query: {
        listingId: String(new URLSearchParams(window.location.search).get("listingId") || new URLSearchParams(window.location.search).get("id") || "").trim(),
        conversationId: String(new URLSearchParams(window.location.search).get("conversationId") || "").trim()
      }
    };
  }

  window.JetleChatState = {
    escapeHtml,
    getStoredUser,
    getStoredToken,
    getUserId,
    getUserEmail,
    buildConversationId,
    normalizeListing,
    normalizeListingOwner,
    normalizeMessage,
    buildConversationSummary,
    pickListingImage,
    createStore
  };
})();
