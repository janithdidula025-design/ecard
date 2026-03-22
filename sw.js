const CACHE_NAME = 'adm-vcard-v3';
const assets = ['./', './index.html', './admin.html', './manifest-card.json', './manifest-admin.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(assets)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
