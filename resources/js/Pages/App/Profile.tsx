import PageHeader from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { getInitials } from "@/lib/utils";
import { GlobalProps } from "@/types/global";
import { User } from "@/types/models/user";
import { router, useHttp, usePage } from "@inertiajs/react";
import { format, type Locale } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { BarChart2, Bell, ChevronRight, Clock, Globe, LogOut, Mail, UserPen } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import AppLayout from "../../Layouts/AppLayout";
import { useLang } from "../../hooks/useLang";
import { PushSubscriptionData, usePushNotifications } from "../../hooks/usePushNotifications";

type language = {
    key: string,
    title: string,
}

type ProfilePageProps = {
    languages: language[]
    systemTime: string
}

const localeMap: Record<string, Locale> = { pt_br: ptBR, en: enUS };

type NotificationProps = {
    language: string;
    receive_notifications: boolean;
};

function Profile({ languages, systemTime }: ProfilePageProps) {
    const { appName, auth, currentLanguage } = usePage<GlobalProps>().props;
    const { __ } = useLang();
    const { isLoading: isPushLoading, isSupported, subscribe, unsubscribe } = usePushNotifications();

    const user: User = auth.user;
    const locale = localeMap[currentLanguage] ?? enUS;

    const { data, setData } = useHttp<NotificationProps>({
        language: currentLanguage,
        receive_notifications: Boolean(user.receive_notifications),
    });

    function updateLanguage(language: string) {
        setData('language', language);
        router.put('/profile/language/update', { language }, {
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        });
    }

    function updateNotifications(
        enabled: boolean,
        pushData?: { subscription: PushSubscriptionData },
    ) {
        const previous = data.receive_notifications;

        setData('receive_notifications', enabled);

        router.put('/profile/notifications/update', { enabled, ...pushData }, {
            onError: () => {
                setData('receive_notifications', previous);
                toast.error(__('messages.oops_something_went_wrong_please_try_again'));
            },
        });
    }

    const logout = () => {
        router.post("/auth/logout");
    };

    return (
        <div className="px-4 pt-5 pb-24">
            <PageHeader title={__('messages.profile')} />

            {/* Avatar + info */}
            <div className="flex flex-col items-center gap-2 mb-6">
                <Avatar className="size-20 ring-2 ring-gold-primary">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-background text-gold-primary/90 text-3xl font-heading">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <p className="font-heading text-xl font-semibold text-foreground">{user.name}</p>
                <div className="flex items-center gap-1.5 text-hint-foreground">
                    <Mail className="size-3.5" />
                    <span className="text-sm">{user.email}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {/* Settings */}
                <Card>
                    <CardContent className="flex flex-col gap-0 py-1">
                        <div className="flex items-center justify-between py-2">
                            <span className="flex items-center gap-2 text-sm text-label-foreground">
                                <Globe className="size-4 text-gold-primary" />
                                {__('messages.language')}
                            </span>
                            <Select value={data.language} onValueChange={updateLanguage}>
                                <SelectTrigger className="w-fit h-auto border-0 shadow-none focus-visible:ring-0 focus-visible:border-transparent bg-transparent hover:bg-transparent px-0 gap-1 text-sm text-primary">
                                    <SelectValue placeholder={__('messages.language')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map(lang => (
                                        <SelectItem key={lang.key} value={lang.key}>{lang.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="opacity-50" />
                        <div className="flex items-center justify-between py-2">
                            <div className="flex flex-col gap-0.5">
                                <span className="flex items-center gap-2 text-sm text-label-foreground">
                                    <Bell className="size-4 text-gold-primary" />
                                    {__('messages.activate_notifications')}
                                </span>
                                <span className="text-xs text-hint-foreground pl-6">
                                    {__('messages.receive_notifications_from', { name: appName })}
                                </span>
                                {!isSupported && (
                                    <span className="text-xs text-destructive pl-6">
                                        {__('messages.push_not_supported')}
                                    </span>
                                )}
                            </div>
                            <Switch
                                checked={data.receive_notifications}
                                disabled={!isSupported || isPushLoading}
                                onCheckedChange={async (value) => {
                                    if (value) {
                                        try {
                                            const subscription = await subscribe();
                                            if (!subscription) {
                                                toast.error(__('messages.oops_something_went_wrong_please_try_again'));
                                                return;
                                            }
                                            updateNotifications(true, { subscription });
                                        } catch {
                                            toast.error(__('messages.oops_something_went_wrong_please_try_again'));
                                        }
                                    } else {
                                        try {
                                            await unsubscribe();
                                        } catch {
                                            // unsubscribe failure is non-blocking — server handles cleanup
                                        }
                                        updateNotifications(false);
                                    }
                                }}
                            />
                        </div>

                        <Separator className="opacity-50" />

                        <button
                            onClick={() => router.visit('/profile/statistics')}
                            className="flex items-center justify-between w-full py-2 text-sm text-label-foreground cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <BarChart2 className="size-4 text-gold-primary" />
                                {__('messages.statistics')}
                            </span>
                            <ChevronRight className="size-4 text-hint-foreground" />
                        </button>

                        <Separator className="opacity-50" />

                        <button
                            onClick={() => router.visit('/profile/edit')}
                            className="flex items-center justify-between w-full py-2 text-sm text-label-foreground cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <UserPen className="size-4 text-gold-primary" />
                                {__('messages.edit_profile')}
                            </span>
                            <ChevronRight className="size-4 text-hint-foreground" />
                        </button>

                        <Separator className="opacity-50" />

                        <button
                            onClick={logout}
                            className="flex items-center justify-between w-full py-3 mt-1 text-sm text-label-foreground hover:text-destructive transition-colors cursor-pointer group"
                        >
                            <span className="flex items-center gap-2">
                                <LogOut className="size-4 text-nav-icon group-hover:text-destructive transition-colors" />
                                {__('messages.logout_account')}
                            </span>
                            <ChevronRight className="size-4 text-hint-foreground" />
                        </button>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-1.5 text-xs text-hint-foreground">
                    <Clock className="size-3.5" />
                    <span>{format(new Date(systemTime), "d 'de' MMMM, HH:mm", { locale })}</span>
                </div>
            </div>
        </div>
    );
}

Profile.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Profile;
