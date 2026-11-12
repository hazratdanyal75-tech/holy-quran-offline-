
const CACHE_NAME = "holy-quran-ultimate-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

// Install: save the main app files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        APP_FILES.map((file) => cache.add(file))
      );
    })
  );

  self.skipWaiting();
});

// Activate: remove old app versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );

  self.clients.claim();
});

// Fetch: show cached app when offline
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Only handle files from this app
  if (url.origin !== self.location.origin) return;

  // Do not automatically cache large audio or video files
  if (/\.(mp3|m4a|ogg|wav|mp4)$/i.test(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put("./index.html", copy)
          );
          return response;
        })
        .catch(async () => {
          return (
            await caches.match("./index.html")
          ) || Response.error();
        })
    );

    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(request, copy)
          );
        }

        return response;
      });
    })
  );
});
