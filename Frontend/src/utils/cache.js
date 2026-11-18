// Lightweight memory + sessionStorage cache with TTL support for instant UI rendering
const memoryCache = new Map();

export const getCache = (key, fallback = null) => {
  // 1. Check memory cache first (fastest)
  if (memoryCache.has(key)) {
    const entry = memoryCache.get(key);
    if (!entry.expiry || entry.expiry > Date.now()) {
      return entry.data;
    }
    memoryCache.delete(key);
  }

  // 2. Check sessionStorage
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.expiry || parsed.expiry > Date.now()) {
        memoryCache.set(key, parsed);
        return parsed.data;
      }
      sessionStorage.removeItem(key);
    }
  } catch (e) {
    // sessionStorage might be restricted in some environments
  }

  return fallback;
};

export const setCache = (key, data, ttlSeconds = 60) => {
  const entry = {
    data,
    expiry: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
  };

  memoryCache.set(key, entry);

  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {}
};

export const clearCache = (prefix = 'asnad_') => {
  for (const k of memoryCache.keys()) {
    if (k.startsWith(prefix)) {
      memoryCache.delete(k);
    }
  }

  try {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(prefix)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (e) {}
};
