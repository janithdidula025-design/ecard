// sw.js - Version 2.0 (ADM E-Card with Auto-Update & Push)

const CACHE_NAME = 'adm-ecard-v' + Date.now(); // හැමවෙලේම අලුත් ID එකක් හැදේ
const ASSETS = [
  './',
  './index.html',
  'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
  'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png'
];

// 1. Install Event - අලුත් ෆයිල්ස් Cache කිරීම
self.addEventListener('install', (e) => {
  self.skipWaiting(); // පරණ එක යනකන් ඉන්න එපා, කෙලින්ම Update වෙන්න
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('ADM: Caching new assets...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate Event - පරණ අනවශ්‍ය Cache ඔක්කොම මකා දැමීම
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // අලුත් SW එක වහාම පාලනය අතට ගනී
});

// 3. Fetch Event - Network First Strategy (සුපිරියටම Update වෙන්න හේතුව මේකයි)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // අලුත් Response එකක් ආවොත් ඒකත් Cache එකට දාගන්නවා
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request)) // ඉන්ටර්නෙට් නැතිනම් පමණක් Cache එක පෙන්වයි
  );
});

// 4. Push Notification - පණිවිඩ පෙන්වීමට
self.addEventListener('push', (e) => {
  let message = e.data ? e.data.text() : 'ADM New Update!';
  const options = {
    body: message,
    icon: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
    badge: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
    vibrate: [200, 100, 200],
    tag: 'adm-notif',
    data: { url: './index.html' }
  };
  e.waitUntil(self.registration.showNotification('ADM Higher Education', options));
});

// 5. Notification Click - Notification එක එබූ විට App එක Open කිරීමට
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(e.notification.data.url) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(e.notification.data.url);
    })
  );
});
