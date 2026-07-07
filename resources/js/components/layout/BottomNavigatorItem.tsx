import { Link } from "@inertiajs/react";
import { type ComponentType, type SVGProps } from "react";

interface BottomNavigatorItemProps {
    to: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    badge?: number;
    active?: boolean;
}

export default function BottomNavigatorItem({ to, icon: Icon, label, badge = 0, active = false }: BottomNavigatorItemProps) {
    return (
        <Link
            href={to}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors relative"
        >
            <div className="relative">
                <Icon
                    className={`size-6 transition-colors ${active ? 'text-nav-item-active' : 'text-nav-item-inactive'}`}
                    fill="none"
                    stroke="currentColor"
                />
                {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                        {badge > 9 ? '9+' : badge}
                    </span>
                )}
            </div>
            <span className={`text-[10px] font-heading tracking-wider transition-colors ${active ? 'text-nav-item-active' : 'text-nav-item-inactive'}`}>
                {label}
            </span>
        </Link>
    );
}
