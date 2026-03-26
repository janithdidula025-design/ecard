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
// 6.Notification පෙන්වන පොදු Function එක
async function sendInstituteNotification() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.getHours() + (now.getMinutes() / 60);

    const weeklySchedule = {
        0: { open: 8.0, close: 17.0 }, // ඉරිදා
        1: { open: 8.5, close: 17.0 }, // සඳුදා
        2: { open: 8.5, close: 17.0 },
        3: { open: 8.5, close: 17.0 },
        4: { open: 8.5, close: 17.0 },
        5: { open: 8.5, close: 17.0 },
        6: { open: 8.0, close: 18.0 }  // සෙනසුරාදා
    };

    const today = weeklySchedule[dayOfWeek];
    let title = "ADM Higher Education";
    let body = "";

    if (isFullMoon(now)) {
        // පෝය දින පණිවිඩය - භාෂා 3 කින්
        body = "අද පෝය දිනය බැවින් ආයතනය වසා ඇත.\n" +
               "Today is Poya Day. Institute is closed.\n" +
               "இன்று பௌர்ணமி தினம். நிறுவனம் மூடப்பட்டுள்ளது.";
    } else if (currentTime >= today.open && currentTime < today.close) {
        // විවෘත පණිවිඩය - භාෂා 3 කින්
        body = "ආයතනය දැන් විවෘතයි. (පැමිණෙන්න හෝ අමතන්න)\n" +
               "The Institute is now open. (Visit or Call)\n" +
               "நிலையம் இப்போது திறக்கப்பட்டுள்ளது. (வருகை தரவும்)";
    } else {
        // වසා ඇති පණිවිඩය - භාෂා 3 කින්
        body = "ආයතනය දැනට වසා ඇත. නැවත විවෘත වෙලාව පරීක්ෂා කරන්න.\n" +
               "The Institute is currently closed. Check opening times.\n" +
               "நிலையம் தற்போது மூடப்பட்டுள்ளது. நேரத்தை சரிபார்க்கவும்.";
    }

    return self.registration.showNotification(title, {
        body: body,
        icon: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
        badge: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.jpeg',
        vibrate: [200, 100, 200],
        tag: 'adm-status-update', // පරණ notification එක replace කරන්න
        renotify: true, // අලුතින් notification එකක් ආ බව දැනුම් දෙන්න
        data: { url: './index.html' }
    });
}
