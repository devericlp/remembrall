import { usePage } from "@inertiajs/react";
import { AlertTriangle, LayoutDashboard, User } from "lucide-react";
import { useLang } from "../../hooks/useLang";
import BottomNavigatorItem from "./BottomNavigatorItem";



export default function BottomNavigator() {
    const { props: { overdueTasksCount }, url } = usePage<{ overdueTasksCount: number }>();
    const { __ } = useLang();

    const links = [
        { to: '/home', icon: LayoutDashboard, label: __('messages.home') },
        { to: '/tasks/overdue', icon: AlertTriangle, label: __('messages.overdue'), badge: overdueTasksCount },
        { to: '/profile', icon: User, label: __('messages.profile') },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card/80 backdrop-blur-md border-t border-border flex items-stretch">
            {links.map(({ to, icon: Icon, label, badge }) => {
                const active = url === to;
                return (
                    <BottomNavigatorItem
                        key={to}
                        to={to}
                        icon={Icon}
                        label={label}
                        badge={badge}
                        active={active}
                    />
                );
            })}
        </nav>
    );
}