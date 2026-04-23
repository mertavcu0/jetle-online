(function () {
  const API_BASE = "https://jetle-online-production.up.railway.app";
  const COLLECTION_FILES = {
    ads: 'data/ads.json',
    reports: 'data/reports.json',
    messages: 'data/messages.json'
  };

  const COLLECTION_ENDPOINTS = {
    users: API_BASE + '/api/users',
    listings: API_BASE + '/api/listings'
  };

  const COLLECTION_KEYS = {
    jetle_users_v3: 'users',
    jetle_listings_v3: 'listings',
    jetle_ads_v1: 'ads',
    jetle_reports_v1: 'reports',
    jetle_messages_v3: 'messages'
  };

  const state = {
    users: [],
    listings: [],
    ads: [],
    reports: [],
    messages: {},
    ready: false,
    errors: []
  };

  function clone(value) {
    if (value === undefined || value === null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function recordError(collection, error, action) {
    const message = error && error.message ? error.message : 'Bilinmeyen hata';
    state.errors.push({
      collection: collection,
      action: action || 'load',
      message: message
    });

    if (window.console && typeof window.console.error === 'function') {
      console.error('[JETLE_API][' + collection + '][' + (action || 'load') + ']', error);
    }
  }

  function normalizeCollectionPayload(payload, fallback) {
    if (Array.isArray(payload)) return payload;
    if (fallback && typeof fallback === 'object' && !Array.isArray(fallback) && payload && typeof payload === 'object') {
      return payload;
    }
    if (payload && Array.isArray(payload.items)) return payload.items;
    return clone(fallback);
  }

  function getCollectionName(storageKey) {
    return COLLECTION_KEYS[storageKey] || null;
  }

  function isRemoteCollection(name) {
    return Boolean(COLLECTION_ENDPOINTS[name]);
  }

  function getApiBearerToken() {
    try {
      const t = localStorage.getItem('token');
      return t ? String(t).trim() : '';
    } catch (e) {
      return '';
    }
  }

  async function requestJson(url, options) {
    const nextOptions = Object.assign({}, options || {});
    const headers = Object.assign({
      Accept: 'application/json'
    }, nextOptions.headers || {});

    const bearer = getApiBearerToken();
    if (bearer && !headers.Authorization) {
      headers.Authorization = 'Bearer ' + bearer;
    }

    if (Object.prototype.hasOwnProperty.call(nextOptions, 'data')) {
      headers['Content-Type'] = 'application/json';
      nextOptions.body = JSON.stringify(nextOptions.data);
      delete nextOptions.data;
    }

    nextOptions.headers = headers;

    const response = await fetch(url, nextOptions);
    const contentType = response.headers.get('content-type') || '';
    let payload;

    try {
      payload = contentType.indexOf('application/json') > -1
        ? await response.json()
        : { message: await response.text() };
    } catch (error) {
      payload = { message: 'Sunucu cevabi okunamadi.' };
    }

    if (!response.ok) {
      throw new Error((payload && (payload.error || payload.message)) || ('Istek basarisiz: ' + response.status));
    }

    return payload;
  }

  async function fetchLocalCollection(name, fallback) {
    if (window.location && window.location.protocol === 'file:') {
      state[name] = clone(fallback);
      return state[name];
    }

    const response = await fetch(COLLECTION_FILES[name], {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(name + ' yuklenemedi: ' + response.status);
    }

    const payload = await response.json();
    const normalized = normalizeCollectionPayload(payload, fallback);
    state[name] = clone(normalized);
    return state[name];
  }

  async function fetchRemoteCollection(name, fallback) {
    const payload = await requestJson(COLLECTION_ENDPOINTS[name], {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const normalized = normalizeCollectionPayload(payload, fallback);
    state[name] = clone(normalized);
    return state[name];
  }

  async function fetchCollection(name, fallback) {
    try {
      if (isRemoteCollection(name)) {
        return await fetchRemoteCollection(name, fallback);
      }
      return await fetchLocalCollection(name, fallback);
    } catch (error) {
      recordError(name, error, 'load');
      state[name] = clone(fallback);
      return state[name];
    }
  }

  async function persistRemoteCollection(name, value) {
    const payload = await requestJson(COLLECTION_ENDPOINTS[name], {
      method: 'PUT',
      data: value
    });

    const normalized = normalizeCollectionPayload(payload, Array.isArray(value) ? value : []);
    state[name] = clone(normalized);
    return state[name];
  }

  async function createRemoteItem(name, value) {
    const payload = await requestJson(COLLECTION_ENDPOINTS[name], {
      method: 'POST',
      data: value
    });

    const nextItem = clone(payload);
    const current = Array.isArray(state[name]) ? state[name].slice() : [];
    current.push(nextItem);
    state[name] = current;
    return nextItem;
  }

  async function updateRemoteItem(name, id, value) {
    const payload = await requestJson(COLLECTION_ENDPOINTS[name] + '/' + encodeURIComponent(id), {
      method: 'PUT',
      data: value
    });

    const updatedItem = clone(payload);
    const current = Array.isArray(state[name]) ? state[name].slice() : [];
    let replaced = false;
    const mapped = current.map(function (item) {
      if (String(item.id) === String(id)) {
        replaced = true;
        return updatedItem;
      }
      return item;
    });
    state[name] = replaced ? mapped : mapped.concat([updatedItem]);
    return updatedItem;
  }

  async function deleteRemoteItem(name, id) {
    await requestJson(COLLECTION_ENDPOINTS[name] + '/' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    state[name] = (Array.isArray(state[name]) ? state[name] : []).filter(function (item) {
      return String(item.id) !== String(id);
    });
    return true;
  }

  async function replaceRemoteCollection(name, value) {
    try {
      return await persistRemoteCollection(name, Array.isArray(value) ? value : []);
    } catch (error) {
      recordError(name, error, 'replace');
      throw error;
    }
  }

  function readCollection(storageKey, fallback) {
    const collectionName = getCollectionName(storageKey);
    if (!collectionName) {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : clone(fallback);
      } catch (error) {
        return clone(fallback);
      }
    }

    return clone(state[collectionName] || fallback);
  }

  function writeCollection(storageKey, value) {
    const collectionName = getCollectionName(storageKey);
    if (!collectionName) {
      localStorage.setItem(storageKey, JSON.stringify(value));
      return clone(value);
    }

    const previousValue = clone(state[collectionName]);
    state[collectionName] = clone(value);

    if (isRemoteCollection(collectionName)) {
      persistRemoteCollection(collectionName, state[collectionName]).catch(function (error) {
        state[collectionName] = previousValue;
        recordError(collectionName, error, 'sync');
      });
    }

    return clone(state[collectionName]);
  }

  function removeCollection(storageKey) {
    const collectionName = getCollectionName(storageKey);
    if (!collectionName) {
      localStorage.removeItem(storageKey);
      return;
    }

    state[collectionName] = Array.isArray(state[collectionName]) ? [] : {};
  }

  const ready = Promise.all([
    fetchCollection('users', []),
    fetchCollection('listings', []),
    fetchCollection('ads', []),
    fetchCollection('reports', []),
    fetchCollection('messages', {})
  ]).then(function () {
    state.ready = true;
    document.dispatchEvent(new CustomEvent('jetle:data-ready', {
      detail: {
        users: state.users.length,
        listings: state.listings.length,
        ads: state.ads.length,
        reports: state.reports.length,
        messages: Object.keys(state.messages || {}).length,
        errors: state.errors.slice()
      }
    }));
    return state;
  });

  window.JETLE_API = {
    state: state,
    ready: ready,
    whenReady: async function () {
      return ready;
    },
    readSync: function (storageKey, fallback) {
      return readCollection(storageKey, fallback);
    },
    writeSync: function (storageKey, value) {
      return writeCollection(storageKey, value);
    },
    removeSync: function (storageKey) {
      removeCollection(storageKey);
    },
    getBaseCollection: function (name) {
      return clone(state[name] || []);
    },
    refreshCollection: async function (name) {
      var prev = state[name];
      var fallback;
      if (Array.isArray(prev)) {
        fallback = prev.slice();
      } else if (prev && typeof prev === 'object') {
        fallback = clone(prev);
      } else {
        fallback = name === 'messages' ? {} : [];
      }
      return fetchCollection(name, fallback);
    },
    getListings: async function () {
      var prev = state.listings;
      var fb = Array.isArray(prev) ? prev.slice() : [];
      return fetchCollection('listings', fb);
    },
    getUsers: async function () {
      var prev = state.users;
      var fb = Array.isArray(prev) ? prev.slice() : [];
      return fetchCollection('users', fb);
    },
    createListing: async function (listing) {
      try {
        return await createRemoteItem('listings', listing);
      } catch (error) {
        recordError('listings', error, 'create');
        throw error;
      }
    },
    updateListing: async function (id, listing) {
      try {
        return await updateRemoteItem('listings', id, listing);
      } catch (error) {
        recordError('listings', error, 'update');
        throw error;
      }
    },
    deleteListing: async function (id) {
      try {
        return await deleteRemoteItem('listings', id);
      } catch (error) {
        recordError('listings', error, 'delete');
        throw error;
      }
    },
    replaceListings: async function (listings) {
      return replaceRemoteCollection('listings', listings);
    },
    createUser: async function (user) {
      try {
        return await createRemoteItem('users', user);
      } catch (error) {
        recordError('users', error, 'create');
        throw error;
      }
    },
    updateUser: async function (id, user) {
      try {
        return await updateRemoteItem('users', id, user);
      } catch (error) {
        recordError('users', error, 'update');
        throw error;
      }
    },
    deleteUser: async function (id) {
      try {
        return await deleteRemoteItem('users', id);
      } catch (error) {
        recordError('users', error, 'delete');
        throw error;
      }
    }
  };
})();
