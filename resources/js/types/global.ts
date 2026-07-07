import { Priority } from "./enums/priority";
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
    priorities: Priority[];
    overdueTasksCount: number;
    orbState: OrbState;
    flash: {
        error: string | null;
        newAchievements: NewAchievement[] | null;
    };
}