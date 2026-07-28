import { initializeApp } from 'firebase/app';
import {
    getMessaging,
    onBackgroundMessage,
} from 'firebase/messaging/sw';
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

const firebaseApp = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const messaging = getMessaging(firebaseApp);

// Notifications are sent as data-only FCM messages so this handler has full
// control over how they're displayed (icon/badge/click), instead of relying
// on the browser's automatic display of a top-level `notification` payload.
onBackgroundMessage(messaging, async (payload) => {
    await self.registration.showNotification(
        payload.data?.title ?? 'Remembrall',
        {
            body: payload.data?.body,
            icon: '/images/logo/icon-192.png',
            badge: '/images/logo/icon-192.png',
            vibrate: [200, 100, 200],
            data: {
                url: payload.data?.url ?? '/home',
            },
        },
    );
});

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({ url }) => url.hostname === 'fonts.googleapis.com',
    new CacheFirst({
        cacheName: 'google-fonts-cache',
        plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 })],
    }),
);

// Imagens estáticas em public/images (ícones, conquistas, ilustrações) não
// passam pelo build do Vite, então não entram no precache do __WB_MANIFEST.
// Cacheamos em runtime, na primeira requisição.
registerRoute(
    ({ url, request }) => request.destination === 'image' && url.pathname.startsWith('/images/'),
    new CacheFirst({
        cacheName: 'static-images-cache',
        plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 })],
    }),
);

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url ?? '/home';

    event.waitUntil(
        self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true,
        }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.navigate(url);

                    return client.focus();
                }
            }

            return self.clients.openWindow(url);
        }),
    );
});
