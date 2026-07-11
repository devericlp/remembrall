import '@inertiajs/core';
import { Achievement } from "./models/achievement";
import { User } from "./models/user";

export type OrbState = 'clear' | 'warning' | 'danger';

export type NewAchievement = Pick<Achievement, 'title' | 'image' | 'subtitle'>;

export type GlobalProps = {
    appName: string;
    auth: {
        user: User;
    };
    currentLanguage: string;
    vapidPublicKey: string;
    overdueTasksCount: number;
    orbState: OrbState;
}

export type FlashData = {
    error: string | null;
    message: string | null;
    type: 'success' | 'error' | 'info' | null;
    newAchievements: NewAchievement[] | null;
};

declare module '@inertiajs/core' {
    interface InertiaConfig {
        flashDataType: FlashData;
    }
}