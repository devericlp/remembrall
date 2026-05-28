import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle, } from "@/components/ui/item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getInitials } from "@/lib/utils";
import { GlobalProps } from "@/types/global";
import { User } from "@/types/models/user";
import { router, useHttp, usePage } from "@inertiajs/react";
import { Bell, LogOut, Mail, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "../../Layouts/AppLayout";
import { useLang } from "../../hooks/useLang";

type language = {
    key: string,
    title: string,
}

type ProfilePageProps = {
    languages: language[]
}

type NotificationProps = {
    language: string;
    receive_notifications: boolean;
    notify_overdue: boolean;
    notify_due_soon: boolean;
};

function Profile({ languages }: ProfilePageProps) {
    const { appName, auth, currentLanguage } = usePage<GlobalProps>().props;

    const { __ } = useLang();

    const user: User = auth.user;

    const { data, setData } = useHttp<NotificationProps>({
        language: currentLanguage,
        receive_notifications: Boolean(user.receive_notifications),
        notify_overdue: Boolean(user.notify_overdue),
        notify_due_soon: Boolean(user.notify_due_soon),
    });

    function updateLanguage(language: string) {
        setData('language', language);
        router.put('/profile/language/update', {
            language
        }, {
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    function updateNotifications(type: keyof NotificationProps, enabled: boolean) {
        setData(type, enabled);

        if (type == 'receive_notifications' && !enabled) {
            setData('notify_overdue', false);
            setData('notify_due_soon', false);
        }

        router.put('/profile/notifications/update', {
            type,
            enabled
        }, {
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    const logout = () => {
        router.post("/auth/logout");
    }

    return (
        <div className="max-w-2xl mx-auto px-4 pt-12 pb-24">
            <div className="flex flex-col items-center space-y-3">
                <Avatar className="size-24">
                    <AvatarImage src="https://github.com/shadcn.pnaag" />
                    <AvatarFallback className="bg-[#7B1F2D] text-[#B8963B] text-3xl font-medieval">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <h1 className="font-heading text-xl font-bold text-foreground">
                    {user.name}
                </h1>
                <div className="flex items-center gap-1.5 justify-center text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="font-body text-sm">{user.email}</span>
                </div>
            </div>

            <Card className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/60 mt-4">
                <CardHeader>
                    <CardTitle className="flex space-x-3 items-center font-heading text-sm uppercase tracking-widest text-foreground">
                        <SlidersHorizontal className="w-4 h-4" /> <span>{__('messages.preferences')}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Item className=" rounded-none border-l-[#7B1F2D]">
                        <ItemContent>
                            <ItemTitle>{__('messages.language')}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Select value={data.language} onValueChange={(value) => updateLanguage(value)}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder={__('messages.language')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map(lang => (
                                        <SelectItem key={lang.key} value={lang.key}>{lang.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </ItemActions>
                    </Item>
                </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/60 mt-4">
                <CardHeader>
                    <CardTitle className="flex space-x-3 items-center font-heading text-sm uppercase tracking-widest text-foreground">
                        <Bell className="w-4 h-4" /> <span>{__('messages.notifications')}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Item>
                        <ItemContent>
                            <ItemTitle>{__('messages.activate_notifications')}</ItemTitle>
                            <ItemDescription>{__('messages.receive_notifications_from', { name: appName })}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Switch
                                checked={data.receive_notifications}
                                onCheckedChange={(value) => updateNotifications('receive_notifications', value)} />
                        </ItemActions>
                    </Item>
                    <Item className=" rounded-none border-l-[#7B1F2D]">
                        <ItemContent>
                            <ItemTitle>{__('messages.overdue_tasks')}</ItemTitle>
                            <ItemDescription>{__('messages.alert_when_a_task_is_due')}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Switch
                                checked={data.notify_overdue}
                                onCheckedChange={(value) => updateNotifications('notify_overdue', value)}
                                disabled={!data.receive_notifications}
                            />
                        </ItemActions>
                    </Item>
                    <Item className=" rounded-none border-l-[#7B1F2D]">
                        <ItemContent>
                            <ItemTitle>{__('messages.winning_soon_tasks')}</ItemTitle>
                            <ItemDescription>{__('messages.alert_when_a_task_is_winning_soon')}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Switch
                                checked={data.notify_due_soon}
                                onCheckedChange={(value) => updateNotifications('notify_due_soon', value)}
                                disabled={!data.receive_notifications}
                            />
                        </ItemActions>
                    </Item>
                </CardContent>
            </Card>

            <div className="flex justify-center mt-8">
                <Button
                    className="w-full cursor-pointer bg-[#F0E7D5] border-destructive/40 font-heading h-12 hover:bg-destructive/10"
                    variant="outline"
                    onClick={logout}
                >
                    <><LogOut className="w-4 h-4" /> {__('messages.logout_account')}</>
                </Button>
            </div>
        </div>
    );
}

Profile.layout = (page: React.ReactNode) => <AppLayout children={page} />

export default Profile;