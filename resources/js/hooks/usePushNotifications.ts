import { deletePushToken, getPushDeviceId, requestPushToken } from '@/lib/push-notifications';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export type PushTokenData = {
    device_id: string;
    token: string;
    platform: string;
};

export function usePushNotifications() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const isSupported = 'serviceWorker' in navigator && 'Notification' in window;

    const refreshStatus = useCallback(async () => {
        if (!isSupported) return;

        try {
            const { data } = await axios.get('/profile/notifications/status', {
                params: { device_id: getPushDeviceId() },
            });
            setIsSubscribed(Boolean(data.enabled));
        } catch {
            // keep last known state
        }
    }, [isSupported]);

    useEffect(() => {
        refreshStatus();
    }, [refreshStatus]);

    const subscribe = useCallback(async (): Promise<PushTokenData | null> => {
        setIsLoading(true);
        try {
            const token = await requestPushToken();

            if (!token) return null;

            return {
                device_id: getPushDeviceId(),
                token,
                platform: 'web',
            };
        } catch {
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const unsubscribe = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            await deletePushToken();
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { isLoading, isSubscribed, setIsSubscribed, isSupported, subscribe, unsubscribe };
}
