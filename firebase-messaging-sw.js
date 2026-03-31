importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-sw.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-sw.js');

firebase.initializeApp({
    apiKey: "AIzaSyCZRZecMIMxOO9SmnaJctRf1x-DxFId340",
    projectId: "ecard-c8f61",
    messagingSenderId: "204555084801",
    appId: "1:204555084801:web:906ad95ddf279c4a6e0c00"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://raw.githubusercontent.com/janithdidula025-design/ecard/main/logo.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
