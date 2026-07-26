const CACHE_NAME = "supreme-sanitary-v2";

self.addEventListener("install", (e) => {
  // We only cache the bare minimum offline fallback shell.
  // We explicitly do NOT cache API requests, Firebase, or live data.
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/shop"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Only handle GET requests
  if (e.request.method !== "GET") return;

  // Do not intercept Firestore, Firebase Auth, or external API requests
  const url = new URL(e.request.url);
  if (
    url.hostname.includes("firestore") ||
    url.hostname.includes("firebase") ||
    url.hostname.includes("googleapis.com") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Stale-while-revalidate strategy for the app shell and static assets
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        // Cache successful responses for our domain
        if (networkResponse.ok && url.origin === location.origin) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      });

      // Return cached immediately if available, while fetching in background to update cache
      return cachedResponse || fetchPromise;
    })
  );
});
