import { User } from "./models/user";

export type GlobalProps = {
    appName: string;
    auth: {
        user: User;
    };
    currentLanguage: string;
}