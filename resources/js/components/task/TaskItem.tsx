import { useLang } from "@/hooks/useLang";
import { formatDate } from "@/lib/utils";
import { Category } from "@/types/enums/category";
import { GlobalProps } from "@/types/global";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { router, usePage } from "@inertiajs/react";
import { Baby, BookOpen, Briefcase, Check, CheckSquare, Heart, House, LayoutGrid, type LucideIcon, TrendingUp, User, Users, Wallet } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    LayoutGrid, Briefcase, User, Users, BookOpen, Heart, House, TrendingUp, Baby, Wallet,
};

type ComponentProps = {
    taskRecurrence: TaskRecurrence;
    onComplete: (taskRecurrence: TaskRecurrence) => void;
    onPending: (taskRecurrence: TaskRecurrence) => void;
    category: Category;
    relativeTime?: boolean;
    forceCompleted?: boolean;
};

function getRelativeTime(dateStr: string, currentLanguage: string): string {
    const locale = currentLanguage === 'pt_br' ? 'pt-BR' : 'en-US';
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const diffMs = new Date(dateStr).getTime() - Date.now();
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    if (Math.abs(diffDays) >= 1) return capitalize(rtf.format(diffDays, 'day'));
    if (Math.abs(diffHours) >= 1) return capitalize(rtf.format(diffHours, 'hour'));
    if (Math.abs(diffMinutes) >= 1) return capitalize(rtf.format(diffMinutes, 'minute'));
    return capitalize(rtf.format(diffSeconds, 'second'));
}

export default function TaskItem({ taskRecurrence, onComplete, onPending, category, relativeTime = false, forceCompleted = false }: ComponentProps) {
    const { priorities, currentLanguage } = usePage<GlobalProps>().props;
    const { __ } = useLang();
    const isCompleted = taskRecurrence.completed_at !== null || forceCompleted;
    const hasChecklist = taskRecurrence.checklist_total_count > 0;
    const checklistProgress = hasChecklist
        ? taskRecurrence.checklist_completed_count / taskRecurrence.checklist_total_count
        : 0;

    const priority = priorities.find(p => p.id === taskRecurrence.priority);

    function handleCheckbox() {
        if (isCompleted) {
            onPending(taskRecurrence);
        } else {
            onComplete(taskRecurrence);
        }
    }

    const CategoryIcon = category?.icon ? CATEGORY_ICONS[category.icon] : null;

    return (
        <div
            className="flex flex-col gap-2 px-4 py-3 bg-card rounded-xl cursor-pointer"
            onClick={() => router.visit(`/tasks/${taskRecurrence.id}`, { viewTransition: true })}
        >
            <div className="flex items-stretch gap-2">
                {/* Left: all content */}
                <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCheckbox(); }}
                            className={`shrink-0 mt-0.5 size-5 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted
                                ? "bg-primary border-primary"
                                : "border-primary/60 hover:bg-primary/10"
                                }`}
                        >
                            {isCompleted && <Check className="size-3 text-background" strokeWidth={2.5} />}
                        </button>

                        <div className="flex flex-1 flex-col min-w-0 gap-1.5">
                            <p className={`text-[15px] font-medium leading-snug line-clamp-2 text-foreground ${isCompleted ? "line-through opacity-50" : ""}`}>
                                {taskRecurrence.title}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {category && (
                                    <Badge className={`${category.color}`}>
                                        {CategoryIcon && <CategoryIcon className="size-3 shrink-0" />}
                                        {category.title}
                                    </Badge>
                                )}
                                {priority && (
                                    <Badge className={`${priority.color}`}>
                                        {priority.title}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: time */}
                <div className="flex items-center shrink-0 self-center">
                    <span className="text-[10px] text-[#E5A24E] whitespace-nowrap">
                        {relativeTime
                            ? getRelativeTime(taskRecurrence.start_date, currentLanguage)
                            : `${formatDate(taskRecurrence.start_date, "H:i")} → ${formatDate(taskRecurrence.end_date, "H:i")}`
                        }
                    </span>
                </div>
            </div>

            {hasChecklist && (
                <div className="flex items-center gap-2 pl-8">
                    <CheckSquare className="size-3 shrink-0 text-gold-primary" />
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                        {taskRecurrence.checklist_completed_count}/{taskRecurrence.checklist_total_count} {__("messages.checklist_items_completed")}
                    </span>
                    <Progress
                        value={checklistProgress * 100}
                        className="flex-1 min-w-0 h-2"
                    />
                </div>
            )}
        </div>
    );
}
