import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

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

registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 5 })],
    }),
);

self.addEventListener('push', (event) => {
    if (!event.data) {
        console.log('[SW] Push recebido sem dados.');
        return;
    }

    const payload = event.data.json();
    console.log('[SW] Push recebido:', payload);

    const title = payload.title ?? 'Remembrall';
    const options = {
        body: payload.body ?? '',
        icon: payload.icon ?? '/icon.png',
        badge: payload.badge ?? '/icon.png',
        data: payload.data ?? {},
        vibrate: [200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url ?? '/home';
    console.log('[SW] Notificação clicada, navegando para:', url);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        }),
    );
});
