// sw.js - Version 2.0 (ADM E-Card)
const CACHE_NAME = 'adm-cache-v2.0';
const ASSETS = [
  './',
  './index.html',
  './index.html?v=2.0',
  'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png'
];

// 1. Install Event - Assets Cache කිරීම
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event - පරණ Cache මැකීම
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event - Offline වැඩ කිරීමට
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});

// 4. Push Notification
self.addEventListener('push', event => {
    let message = event.data ? event.data.text() : 'ADM New Update!';
    const options = {
        body: message,
        icon: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png',
        badge: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png',
        vibrate: [200, 100, 200],
        tag: 'adm-notif',
        data: { url: './index.html' }
    };
    event.waitUntil(self.registration.showNotification('ADM Higher Education', options));
});

// 5. Notification Click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (let client of windowClients) {
                if (client.url.includes(event.notification.data.url) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(event.notification.data.url);
        })
    );
});
