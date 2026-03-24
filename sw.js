const CACHE_NAME = 'adm-v4';
const assets = [
  './index.html',
  './admin.html',
  './sw.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
// sw.js - Background Service Worker
const CACHE_NAME = 'adm-cache-v1.3';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Push Notification ලැබුණු විට ක්‍රියාත්මක වන කොටස
self.addEventListener('push', event => {
    const data = event.data ? event.data.text() : 'අලුත් දැනුම්දීමක් තිබේ!';
    const options = {
        body: data,
        icon: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png',
        badge: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png',
        vibrate: [100, 50, 100],
        data: { url: 'index.html' }
    };

    event.waitUntil(
        self.registration.showNotification('ADM Higher Education', options)
    );
});

// Notification එක touch කළ විට App එක open කිරීම
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
