// sw.js - Version 2.0
const CACHE_NAME = 'adm-cache-v2.0';
const ASSETS = [
  './index.html',
  './index.html?v=2.0',
  './admin.html' // admin page එකක් ඇත්නම් පමණක් මෙය තබන්න
];

// 1. Install Event - අලුත් Assets Cache කිරීම
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); 
});

// 2. Activate Event - පරණ Cache (v1.8, v4, v1.3 ආදී සියල්ල) මැකීම
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

// 3. Fetch Event - Offline ඇති විට Cache එකෙන් පෙන්වීම
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 4. Push Notification - දැනුම්දීම පෙන්වීම
self.addEventListener('push', event => {
    let message = 'ADM New Update!';
    if (event.data) {
        message = event.data.text();
    }

    const options = {
        body: message,
        icon: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png',
        badge: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png',
        vibrate: [200, 100, 200],
        tag: 'adm-notif',
        data: { url: './index.html' } // Notification එක එබූ විට යා යුතු ලිපිනය
    };

    event.waitUntil(
        self.registration.showNotification('ADM Higher Education', options)
    );
});

// 5. Notification Click - Notification එක එබූ විට App එක Open කිරීම
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // දැනටමත් app එක open නම් ඒ window එකට යන්න
            for (let client of windowClients) {
                if (client.url.includes(event.notification.data.url) && 'focus' in client) {
                    return client.focus();
                }
            }
            // නැත්නම් අලුත් window එකක open කරන්න
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js') // sw.js ෆයිල් එක ඔයාගේ index.html එක ගාවම තියෙන්න ඕනේ
    .then(() => console.log("Service Worker Registered"));
}
<link rel="stylesheet" href="style.css?v=1.2">
<script src="script.js?v=1.2"></script>
