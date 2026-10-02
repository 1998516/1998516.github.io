const CACHE_NAME = 'jizhang-pwa-0.6.0';
const APP_ASSETS = [
  "/",
  "/_expo/static/js/web/index-31701cae0bfbdd29c5aadba799d22aff.js",
  "/favicon.ico",
  "/icon-180.png",
  "/icon-512.png",
  "/icon.svg",
  "/index.html",
  "/manifest.webmanifest",
  "/metadata.json"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith('jizhang-pwa-') && key !== CACHE_NAME).map((key) => caches.delete(key)),
  )));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
