import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/useLang';
import { Category } from '@/types/enums/category';
import { GlobalProps } from '@/types/global';
import { TaskRecurrence } from '@/types/TaskRecurrence';
import { router, usePage } from '@inertiajs/react';
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
    type Locale,
} from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import TaskItem from '../task/TaskItem';
import { Card, CardContent } from '../ui/card';
import { Empty, EmptyHeader, EmptyTitle } from '../ui/empty';

const localeMap: Record<string, Locale> = {
    pt_br: ptBR,
    en: enUS,
};

type MonthViewProps = {
    tasks: TaskRecurrence[];
    categories: Category[],
};

export default function MonthView({ tasks, categories }: MonthViewProps) {
    const { currentLanguage } = usePage<GlobalProps>().props;
    const locale: Locale = localeMap[currentLanguage] ?? enUS;
    const { __ } = useLang();

    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const today = new Date();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day: Date = calStart;

    function handleCompleteTask(taskRecurrence: TaskRecurrence) {
        router.put(`/tasks/${taskRecurrence.id}/complete`, {}, {
            preserveScroll: true,
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    while (day <= calEnd) {
        days.push(day);
        day = addDays(day, 1);
    }

    const getTasksForDay = (d: Date): TaskRecurrence[] => {
        const dayStr = format(d, 'yyyy-MM-dd');
        return tasks.filter(
            (t) => format(new Date(t.end_date), 'yyyy-MM-dd') === dayStr
        );
    };

    const getDayStatus = (d: Date): 'none' | 'danger' | 'warning' | 'clear' => {
        const dayTasks = getTasksForDay(d);
        if (dayTasks.length === 0) return 'none';

        const now = new Date();

        const hasOverdue = dayTasks.some(
            (t) =>
                t.completed_at === null && new Date(t.end_date) < now
        );
        if (hasOverdue) return 'danger';

        const hasDueSoon = dayTasks.some((t) => {
            const h =
                (new Date(t.end_date).getTime() - now.getTime()) /
                (1000 * 60 * 60);
            return t.completed_at === null && h > 0 && h <= 4;
        });

        if (hasDueSoon) return 'warning';

        return 'clear';
    };

    const weekDayHeaders: string[] = Array.from({ length: 7 }, (_, i) =>
        format(
            addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i),
            'EEEEE',
            { locale }
        ).toUpperCase()
    );

    const selectedDayTasks = selectedDay
        ? getTasksForDay(selectedDay).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        : [];

    return (
        <Card className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/60 p-4 md:p-6">
            <CardContent>
                <div className="space-y-4">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        <h3 className="font-heading text-lg font-semibold capitalize">
                            {format(currentMonth, 'MMMM yyyy', { locale })}
                        </h3>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1">
                        {weekDayHeaders.map((wd, i) => (
                            <div
                                key={i}
                                className="text-center text-xs font-heading tracking-wider text-muted-foreground py-2"
                            >
                                {wd}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((d) => {
                            const inMonth = isSameMonth(d, currentMonth);
                            const isToday = isSameDay(d, today);
                            const isSelected = isSameDay(d, selectedDay);
                            const status = getDayStatus(d);
                            const taskCount = getTasksForDay(d).length;

                            return (
                                <button
                                    key={d.toISOString()}
                                    onClick={() => setSelectedDay(d)}
                                    className={`relative flex flex-col items-center justify-center p-1 rounded-lg min-h-15 transition-all duration-200
                                        ${!inMonth ? 'opacity-30' : 'hover:bg-card/80'}
                                        ${isSelected ? 'ring-2 ring-primary/70 bg-card/70' : ''}
                                        ${isToday && !isSelected ? 'ring-2 ring-primary/40 bg-card/60' : ''}
                                    `}
                                >
                                    <span
                                        className={`text-sm font-body ${isToday
                                            ? 'font-bold text-primary'
                                            : 'text-foreground'
                                            }`}
                                    >
                                        {format(d, 'd')}
                                    </span>

                                    {status !== 'none' && (
                                        <div className="mt-0.5">
                                            {/* <RemembrallOrb status={status} size="xs" /> */}
                                        </div>
                                    )}

                                    {taskCount > 0 && (
                                        <span className="text-[10px] font-body text-muted-foreground mt-0.5">
                                            {taskCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected day task list */}
                    <div className="mt-2 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <h4 className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
                                {format(selectedDay, "d 'de' MMMM", { locale: ptBR })}
                            </h4>
                        </div>
                        {selectedDayTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                                <Empty>
                                    <EmptyHeader>
                                        <Sparkles className="text-orange-500" />
                                        <EmptyTitle>{__('messages.no_tasks_for_today_enjoy_your_day')}! ✨</EmptyTitle>
                                    </EmptyHeader>
                                </Empty>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedDayTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        taskRecurrence={task}
                                        onComplete={handleCompleteTask}
                                        category={categories.find(c => c.id === task.category)!}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}