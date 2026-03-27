const CACHE_NAME = 'adm-ecard-v' + Date.now();
const ASSETS = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
  'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo%2001.png'
];

// 1. Install Event
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('ADM: Caching new assets...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event (Network First)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// 4. Notification Logic (Sync & Time Schedule)
self.addEventListener('sync', (e) => {
  if (e.tag === 'data-on-check') {
    e.waitUntil(checkScheduleAndNotify());
  }
});

async function checkScheduleAndNotify() {
  const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  if (clientList.length > 0) return; // App එක open නම් notification යවන්නේ නැත

  const now = new Date();
  const hour = now.getHours();
  let title = "ADM Higher Education 🎓";
  let message = "";
  let uniqueTag = "";

  // පෝය දින පරීක්ෂාව
  if (isFullMoon(now)) {
    message = "අද පෝය දිනය බැවින් ආයතනය වසා ඇත. | Poya Day - Closed | இன்று பௌர்ணமி - மூடப்பட்டுள்ளது";
    uniqueTag = "poya-closed";
  } 
  // සාමාන්‍ය වේලාවන් (භාෂා 3ම ඇතුළත් කර ඇත)
  else if (hour >= 8 && hour < 10) {
    message = "ආයතනය විවෘතයි | Institute is Open | நிறுவனம் திறக்கப்பட்டுள்ளது";
    uniqueTag = "morning-open";
  } else if (hour >= 12 && hour < 14) {
    message = "පන්ති පැවැත්වේ | Classes are On | வகுப்புகள் நடைபெறுகின்றன";
    uniqueTag = "midday-classes";
  } else if (hour >= 20 && hour < 22) {
    message = "ආයතනය වසා ඇත | Institute is Closed | நிறுவனம் மூடப்பட்டுள்ளது";
    uniqueTag = "night-closed";
  }

  if (message !== "") {
    return self.registration.showNotification(title, {
      body: message,
      icon: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
      badge: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
      vibrate: [500, 110, 500],
      tag: uniqueTag,
      renotify: true,
      requireInteraction: true,
      data: { url: './index.html' }
    });
  }
}

// පෝය දින ගණනය
function isFullMoon(date) {
  const baseDate = new Date(1900, 0, 1);
  const diffDays = (date - baseDate) / (1000 * 60 * 60 * 24);
  const lunarCycle = 29.530588853;
  const daysSinceNewMoon = (diffDays - 0.2) % lunarCycle;
  return (daysSinceNewMoon >= 14.2 && daysSinceNewMoon <= 15.8);
}

// 5. Notification Click
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow('./index.html');
    })
  );
});

// 6. Push Notification (Manual Push)
self.addEventListener('push', (e) => {
  let message = e.data ? e.data.text() : 'ADM New Update!';
  e.waitUntil(
    self.registration.showNotification('ADM Higher Education', {
      body: message,
      icon: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
      tag: 'adm-push'
    })
  );
});
