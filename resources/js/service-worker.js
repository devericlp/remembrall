import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

const buildScopedManifest = self.__WB_MANIFEST.map((entry) => {
    if (/^(?:https?:)?\/\//.test(entry.url) || entry.url.startsWith('/')) {
        return entry;
    }

    return {
        ...entry,
        url: `/build/${entry.url}`,
    };
});

precacheAndRoute(buildScopedManifest);

registerRoute(
    ({ url }) => url.hostname === 'fonts.googleapis.com',
    new CacheFirst({
        cacheName: 'google-fonts-cache',
        plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 })],
    }),
);

self.addEventListener('push', (event) => {
    console.log('[SW] Push recebido.');

    event.waitUntil(
        self.registration.showNotification('Remembrall', {
            body: 'Teste fixo de notificação.',
            badge: '/images/logo/icon-72.png',
            data: {
                url: '/home',
            },
        }),
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true,
        }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.navigate('/home');

                    return client.focus();
                }
            }

            return self.clients.openWindow('/home');
        }),
    );
});
