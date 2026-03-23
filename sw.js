const CACHE_NAME = 'adm-v1';
const ASSETS = [
  './admin.html',
  './index.html'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Active Service Worker
self.addEventListener('activate', (e) => {
  console.log('ADM Service Worker Active');
});

// Fetch events
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
