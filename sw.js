const CACHE_NAME = 'adm-admin-v2';
// මෙහි ඔබගේ ප්‍රධාන HTML ගොනුවේ නම නිවැරදි දැයි බලන්න (e.g. admin.html)
const assets = [
  './admin.html',
  'https://raw.githubusercontent.com/janithdidula025-design/adm-vcard/main/logo.jpg'
];

// Service Worker එක Install වන විට අවශ්‍ය දේවල් Cache කිරීම
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// පැරණි Cache දත්ත ඉවත් කර අලුත් Version එක Activate කිරීම
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Offline අවස්ථාවකදී පවා App එක වැඩ කිරීමට අවශ්‍ය දත්ත ලබා දීම
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
