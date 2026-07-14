import { getFirebaseMessaging } from '@/lib/firebase';
import { deleteToken, getToken } from 'firebase/messaging';

const DEVICE_ID_STORAGE_KEY = 'push_device_id';

export function getPushDeviceId(): string {
    let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
    }

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

    const serviceWorkerRegistration =
        await navigator.serviceWorker.ready;

    return getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration,
    });
}

export async function deletePushToken(): Promise<void> {
    const messaging = await getFirebaseMessaging();

    if (!messaging) {
        return;
    }

    await deleteToken(messaging);
}