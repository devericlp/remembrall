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
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors relative
              ${active ? 'text-[#6D2E32]' : 'text-muted-foreground hover:text-foreground'}`}
        >
            <div className="relative">
                <Icon className={`w-8 h-8 ${active ? 'stroke-[2.5]' : ''}`} />
                {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {badge > 9 ? '9+' : badge}
                    </span>
                )}
            </div>
            <span className={`text-[10px] font-heading uppercase tracking-wider ${active ? 'text-[#6D2E32]' : ''}`}>
                {label}
            </span>
            {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#6D2E32] rounded-full" />
            )}
        </Link>
    );
}