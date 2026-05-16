(function () {
  const ChatState = window.JetleChatState;

  function buildHeaders(includeJson) {
    const headers = {};
    const token = ChatState.getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  }

  async function request(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        ...buildHeaders(Boolean(options.body)),
        ...(options.headers || {})
      }
    });

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }

    if (!response.ok) {
      const error = new Error(data?.error || data?.message || "request_failed");
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    return data;
  }

  async function fetchListing(listingId) {
    if (!listingId) return null;
    const response = await fetch(`/api/listings/${encodeURIComponent(listingId)}`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  }

  async function fetchConversations() {
    const data = await request("/api/messages/conversations");
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.conversations)
        ? data.conversations
        : [];
  }

  async function fetchConversation(conversationId, limit = 100) {
    if (!conversationId) return null;
    return request(`/api/messages/${encodeURIComponent(conversationId)}?limit=${encodeURIComponent(String(limit))}`);
  }

  async function sendMessage(payload) {
    return request("/api/messages", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async function updateMessage(messageId, text) {
    return request(`/api/messages/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      body: JSON.stringify({ text })
    });
  }

  async function deleteMessage(messageId) {
    return request(`/api/messages/${encodeURIComponent(messageId)}`, {
      method: "DELETE"
    });
  }

  async function deleteConversation(conversationId) {
    return request(`/api/messages/${encodeURIComponent(conversationId)}?scope=conversation`, {
      method: "DELETE"
    });
  }

  window.JetleChatApi = {
    request,
    fetchListing,
    fetchConversations,
    fetchConversation,
    sendMessage,
    updateMessage,
    deleteMessage,
    deleteConversation
  };
})();
