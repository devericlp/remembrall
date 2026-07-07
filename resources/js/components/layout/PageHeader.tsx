import { Link } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    backHref?: string;
    onBack?: () => void;
    action?: ReactNode;
    className?: string;
}

export default function PageHeader({ title, subtitle, backHref, onBack, action, className }: PageHeaderProps) {
    const showBack = backHref !== undefined || onBack !== undefined;

    return (
        <div className={`mb-4 ${className ?? ''}`}>
            <div className="relative flex items-center justify-center">
                {showBack && (
                    <div className="absolute left-0 top-0">
                        {backHref ? (
                            <Link
                                href={backHref}
                                className="flex items-center justify-center size-9 rounded-full hover:bg-nav-icon/10 transition-colors"
                            >
                                <ChevronLeft className="nav-icon" />
                            </Link>
                        ) : (
                            <button
                                onClick={onBack}
                                className="flex items-center justify-center size-9 rounded-full hover:bg-nav-icon/10 transition-colors"
                            >
                                <ChevronLeft className="nav-icon" />
                            </button>
                        )}
                    </div>
                )}

                {title && (
                    <h1 className="text-2xl font-heading font-bold text-page-header">
                        {title}
                    </h1>
                )}

                {action && (
                    <div className="absolute right-0">
                        {action}
                    </div>
                )}
            </div>

            {subtitle && (
                <p className="font-body text-sm text-muted-foreground text-center italic mt-1">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
