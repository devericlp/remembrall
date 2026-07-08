import { GlobalProps } from "@/types/global";
import { Link, usePage } from "@inertiajs/react";
import { Home, Hourglass, Trophy, User } from "lucide-react";
import { useLang } from "../../hooks/useLang";
import RemembrallOrb from "../home/RemembrallOrb";
import BottomNavigatorItem from "./BottomNavigatorItem";

export default function BottomNavigator() {
    const { props: { overdueTasksCount, orbState }, url } = usePage<GlobalProps>();
    const pathname = url.split('?')[0];
    const { __ } = useLang();

    const leftLinks = [
        { to: '/home', icon: Home, label: __('messages.home') },
        { to: '/tasks/overdue', icon: Hourglass, label: __('messages.overdue'), badge: overdueTasksCount },
    ];

    const rightLinks = [
        { to: '/achievements', icon: Trophy, label: __('messages.achievements') },
        { to: '/profile', icon: User, label: __('messages.profile') },
    ];

    return (
        <nav className="fixed bottom-0 left-1/2 w-full max-w-120 -translate-x-1/2 z-30 bg-background border-t border-gold-primary/20 flex items-stretch">
            {leftLinks.map(({ to, icon: Icon, label, badge }) => (
                <BottomNavigatorItem
                    key={to}
                    to={to}
                    icon={Icon}
                    label={label}
                    badge={badge}
                    active={pathname.startsWith(to)}
                />
            ))}

            <Link href="/orb" className="flex-1 flex items-center justify-center">
                <RemembrallOrb state={orbState} size={56} className="-translate-y-3" />
            </Link>

            {rightLinks.map(({ to, icon: Icon, label }) => (
                <BottomNavigatorItem
                    key={to}
                    to={to}
                    icon={Icon}
                    label={label}
                    active={pathname.startsWith(to)}
                />
            ))}
        </nav>
    );
}
