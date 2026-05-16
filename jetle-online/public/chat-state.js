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
    return String(user?._id || user?.id || "").trim();
  }

  function getUserEmail(user) {
    return String(user?.email || "").trim().toLowerCase();
  }

  function buildConversationId(listingId, firstUserId, secondUserId) {
    const sorted = [String(firstUserId || ""), String(secondUserId || "")].sort();
    return `listing:${String(listingId || "")}:users:${sorted.join("__")}`;
  }

  function buildConversationKey(listingId, buyerId, sellerId) {
    return [
      String(listingId || "").trim(),
      String(buyerId || "").trim(),
      String(sellerId || "").trim()
    ].join("|");
  }

  function normalizeUser(user) {
    if (!user) return null;
    return {
      id: String(user._id || user.id || "").trim(),
      name: String(user.name || user.username || user.email || "").trim(),
      email: String(user.email || "").trim().toLowerCase(),
      username: String(user.username || "").trim()
    };
  }

  function normalizeListing(listing) {
    const safeListing = listing || {};
    return {
      _id: String(safeListing._id || safeListing.id || "").trim(),
      id: String(safeListing.id || safeListing._id || "").trim(),
      title: String(safeListing.title || "İlan"),
      price: Number(safeListing.price || 0),
      city: String(safeListing.city || ""),
      image: String(safeListing.image || ""),
      mainImage: String(safeListing.mainImage || ""),
      coverImage: String(safeListing.coverImage || ""),
      images: Array.isArray(safeListing.images) ? safeListing.images.filter(Boolean) : [],
      photos: Array.isArray(safeListing.photos) ? safeListing.photos.filter(Boolean) : [],
      user: normalizeUser(safeListing.user),
      userEmail: String(safeListing.userEmail || "").trim().toLowerCase(),
      ownerEmail: String(safeListing.ownerEmail || "").trim().toLowerCase()
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

  function normalizeListingOwner(listing) {
    const safeListing = normalizeListing(listing);
    const owner = safeListing.user || null;
    return {
      id: String(owner?.id || "").trim(),
      email: String(owner?.email || safeListing.userEmail || safeListing.ownerEmail || "").trim().toLowerCase(),
      name: String(owner?.name || owner?.username || owner?.email || "").trim()
    };
  }

  function normalizeMessage(message, currentUser) {
    const safeMessage = message || {};
    const sender = normalizeUser(safeMessage.sender);
    const currentUserId = getUserId(currentUser);
    const currentUserEmail = getUserEmail(currentUser);
    const senderId = String(safeMessage.senderId || sender?.id || "").trim();
    const senderEmail = String(sender?.email || safeMessage.senderEmail || "").trim().toLowerCase();

    return {
      id: String(safeMessage.id || safeMessage._id || "").trim(),
      conversationId: String(safeMessage.conversationId || "").trim(),
      senderId,
      senderEmail,
      senderName: String(sender?.name || safeMessage.senderName || senderEmail || "Kullanıcı").trim(),
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

  function buildConversationSummary(rawConversation, context) {
    const currentUser = context.currentUser || {};
    const listing = normalizeListing(rawConversation?.listing || context.listing || {});
    const listingOwner = normalizeListingOwner(listing);
    const rawOtherUser = normalizeUser(rawConversation?.otherUser);

    const otherUserId = String(
      rawConversation?.otherUserId ||
      rawOtherUser?.id ||
      listingOwner.id ||
      ""
    ).trim();
    const otherUserEmail = String(
      rawConversation?.otherUserEmail ||
      rawOtherUser?.email ||
      listingOwner.email ||
      ""
    ).trim().toLowerCase();
    const otherUserName = String(
      rawConversation?.otherUserName ||
      rawOtherUser?.name ||
      listingOwner.name ||
      otherUserEmail ||
      "İlan sahibi"
    ).trim();

    const currentUserId = getUserId(currentUser);
    const sellerId = String(rawConversation?.sellerId || listingOwner.id || "").trim();
    const buyerId = String(
      rawConversation?.buyerId ||
      (sellerId && currentUserId !== sellerId ? currentUserId : otherUserId) ||
      ""
    ).trim();
    const listingId = String(rawConversation?.listingId || listing.id || "").trim();
    const canonicalConversationId = String(
      rawConversation?.conversationId ||
      rawConversation?.id ||
      (listingId && otherUserId && currentUserId
        ? buildConversationId(listingId, currentUserId, otherUserId)
        : "")
    ).trim();
    const identity = canonicalConversationId || `draft:${buildConversationKey(listingId, buyerId, sellerId)}`;

    const lastMessage = rawConversation?.lastMessage
      ? normalizeMessage(rawConversation.lastMessage, currentUser)
      : null;

    return {
      id: identity,
      conversationId: canonicalConversationId,
      conversationKey: buildConversationKey(listingId, buyerId, sellerId),
      listingId,
      buyerId,
      sellerId,
      listing,
      listingOwner,
      otherUser: {
        id: otherUserId,
        email: otherUserEmail,
        name: otherUserName
      },
      otherUserId,
      otherUserEmail,
      otherUserName,
      listingTitle: String(rawConversation?.listingTitle || listing.title || "İlan"),
      listingImage: pickListingImage(listing),
      listingPrice: Number(
        rawConversation?.listingPrice !== undefined
          ? rawConversation.listingPrice
          : listing.price || 0
      ),
      listingCity: String(rawConversation?.listingCity || listing.city || ""),
      listingUrl: `/listing-detail.html?id=${encodeURIComponent(String(listingId || ""))}`,
      lastMessage,
      updatedAt: rawConversation?.updatedAt || lastMessage?.updatedAt || lastMessage?.createdAt || "",
      unreadCount: Number(rawConversation?.unreadCount || 0)
    };
  }

  function createStore() {
    const params = new URLSearchParams(window.location.search);
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
      isLoadingConversation: false,
      query: {
        listingId: String(params.get("listingId") || params.get("id") || "").trim(),
        conversationId: String(params.get("conversationId") || "").trim()
      }
    };
  }

  window.JetleChatState = {
    escapeHtml,
    getStoredUser,
    getStoredToken,
    getUserId,
    getUserEmail,
    normalizeUser,
    normalizeListing,
    normalizeListingOwner,
    normalizeMessage,
    buildConversationId,
    buildConversationKey,
    buildConversationSummary,
    pickListingImage,
    createStore
  };
})();
