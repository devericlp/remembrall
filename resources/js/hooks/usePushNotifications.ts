import { GlobalProps } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

export type PushSubscriptionData = {
    endpoint: string;
    keys: { p256dh: string; auth: string };
};

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
    const { vapidPublicKey } = usePage<GlobalProps>().props;
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

        navigator.serviceWorker.ready.then((reg) => {
            reg.pushManager.getSubscription().then((sub) => {
                setIsSubscribed(sub !== null);
            });
        });
    }, []);

    const subscribe = useCallback(async (): Promise<PushSubscriptionData | null> => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

        setIsLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') return null;

            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            const json = sub.toJSON();
            setIsSubscribed(true);
            return {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: json.keys?.p256dh ?? '',
                    auth: json.keys?.auth ?? '',
                },
            };
        } catch {
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [vapidPublicKey]);

    const unsubscribe = useCallback(async (): Promise<void> => {
        if (!('serviceWorker' in navigator)) return;

        setIsLoading(true);
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (!sub) return;

            await sub.unsubscribe();
            setIsSubscribed(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

    return { isSubscribed, isLoading, isSupported, subscribe, unsubscribe };
}
