const CACHE_NAME = 'adm-vcard-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/admin.html',
    '/manifest-card.json',
    '/manifest-admin.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
        ))
    );
});

self.addEventListener('fetch', event => {
    // Cache-First strategy for application assets
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});
