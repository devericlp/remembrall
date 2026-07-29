import { deletePushToken, getPushDeviceId, requestPushToken } from '@/lib/push-notifications';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

export type PushPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';
export type ToggleFailureReason = 'unsupported' | 'denied' | 'error';
export type ToggleResult = { ok: true } | { ok: false; reason: ToggleFailureReason };

function putNotificationsUpdate(payload: {
    enabled: boolean;
    device_id: string;
    token?: string;
    platform?: string;
}): Promise<boolean> {
    return new Promise((resolve) => {
        router.put('/profile/notifications/update', payload, {
            onSuccess: () => resolve(true),
            onError: () => resolve(false),
        });
    });
}

export function usePushNotifications() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState<PushPermissionState>('unsupported');
    const isBusyRef = useRef(false);

    const isSupported = 'serviceWorker' in navigator && 'Notification' in window;

    useEffect(() => {
        if (!isSupported) {
            setPermission('unsupported');
            setIsSubscribed(false);
            return;
        }

        const currentPermission = Notification.permission;
        setPermission(currentPermission);

        let cancelled = false;

        axios
            .get<{ enabled: boolean }>('/profile/notifications/status', {
                params: { device_id: getPushDeviceId() },
            })
            .then(({ data }) => {
                if (!cancelled) {
                    setIsSubscribed(data.enabled && currentPermission === 'granted');
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setIsSubscribed(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [isSupported]);

    const toggle = useCallback(async (enabled: boolean): Promise<ToggleResult> => {
        if (isBusyRef.current) {
            return { ok: false, reason: 'error' };
        }

        if (!isSupported) {
            return { ok: false, reason: 'unsupported' };
        }

        isBusyRef.current = true;
        setIsLoading(true);

        try {
            if (enabled) {
                const token = await requestPushToken();
                const permissionAfterRequest: NotificationPermission = Notification.permission;
                setPermission(permissionAfterRequest);

                if (!token) {
                    return { ok: false, reason: permissionAfterRequest === 'denied' ? 'denied' : 'error' };
                }

                const success = await putNotificationsUpdate({
                    enabled: true,
                    device_id: getPushDeviceId(),
                    token,
                    platform: 'web',
                });

                if (!success) {
                    return { ok: false, reason: 'error' };
                }

                setIsSubscribed(true);
                return { ok: true };
            }

            await deletePushToken().catch(() => {});

            const success = await putNotificationsUpdate({
                enabled: false,
                device_id: getPushDeviceId(),
            });

            if (!success) {
                return { ok: false, reason: 'error' };
            }

            setIsSubscribed(false);
            return { ok: true };
        } catch (error) {
            console.warn('[Push] toggle() failed.', error);
            return { ok: false, reason: 'error' };
        } finally {
            setIsLoading(false);
            isBusyRef.current = false;
        }
    }, [isSupported]);

    return { isLoading, isSubscribed, isSupported, permission, toggle };
}
