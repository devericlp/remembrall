import { getFirebaseMessaging } from '@/lib/firebase';
import { deleteToken, getToken } from 'firebase/messaging';

const DEVICE_ID_COOKIE_NAME = 'push_device_id';
const DEVICE_ID_LEGACY_STORAGE_KEY = 'push_device_id';
const DEVICE_ID_COOKIE_MAX_AGE_DAYS = 400; // Safari's hard cap on cookie lifetime

function readCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeDays: number): void {
    const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
    const secure = location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax${secure}`;
}

export function getPushDeviceId(): string {
    const existingCookie = readCookie(DEVICE_ID_COOKIE_NAME);

    if (existingCookie) {
        return existingCookie;
    }

    // Migrate a device id previously generated before the switch to cookies,
    // so already-registered devices don't have to re-enable push.
    const legacyDeviceId = localStorage.getItem(DEVICE_ID_LEGACY_STORAGE_KEY);
    const deviceId = legacyDeviceId ?? crypto.randomUUID();

    writeCookie(DEVICE_ID_COOKIE_NAME, deviceId, DEVICE_ID_COOKIE_MAX_AGE_DAYS);
    localStorage.removeItem(DEVICE_ID_LEGACY_STORAGE_KEY);

    return deviceId;
}

export async function requestPushToken(): Promise<string | null> {
    if (
        !('Notification' in window) ||
        !('serviceWorker' in navigator)
    ) {
        console.warn('[Push] Notification API or serviceWorker not available in this browser.');
        return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        console.warn(`[Push] Notification permission is "${permission}" (not granted). If it's "denied", the user must reset it in the browser's site settings.`);
        return null;
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
        console.warn('[Push] getFirebaseMessaging() returned null — firebase/messaging isSupported() reported this browser/context as unsupported.');
        return null;
    }

    const serviceWorkerRegistration = await navigator.serviceWorker.ready;

    try {
        return await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration,
        });
    } catch (error) {
        console.warn('[Push] getToken() failed.', error);
        return null;
    }
}

export async function deletePushToken(): Promise<void> {
    const messaging = await getFirebaseMessaging();

    if (!messaging) {
        return;
    }

    await deleteToken(messaging);
}

export async function showLocalPushNotification(title: string, body: string): Promise<void> {
    if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') {
        return;
    }

    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification(title, {
        body,
        badge: '/images/logo/icon-192.png',
        vibrate: [200, 100, 200],
    });
}