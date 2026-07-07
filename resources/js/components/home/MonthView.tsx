import { Button } from '@/components/ui/button';
import { useCompleteTask } from '@/hooks/useCompleteTask';
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
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import TaskCompletedSheet from '../task/TaskCompletedSheet';
import TaskItem from '../task/TaskItem';

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
    const { completedSheetOpen, newAchievement, completeTask, closeSheet } = useCompleteTask();
    const today = new Date();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day: Date = calStart;

    function handleCompleteTask(taskRecurrence: TaskRecurrence) {
        completeTask(taskRecurrence.id);
    }

    function handlePendingTask(taskRecurrence: TaskRecurrence) {
        router.put(`/tasks/${taskRecurrence.id}/pending`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(__('messages.task_updated_successfully')),
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
        <div className="space-y-1">
            <TaskCompletedSheet
                open={completedSheetOpen}
                achievement={newAchievement}
                onClose={closeSheet}
            />
            {/* Month navigation */}
            <div className="flex items-center justify-between px-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <h3 className="font-heading text-sm font-semibold capitalize text-gold-primary">
                    {format(currentMonth, 'MMMM yyyy', { locale })}
                </h3>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7">
                {weekDayHeaders.map((wd, i) => (
                    <div
                        key={i}
                        className="text-center text-[10px] font-heading tracking-wider text-muted-foreground py-1"
                    >
                        {wd}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
                {days.map((d) => {
                    const inMonth = isSameMonth(d, currentMonth);
                    const isToday = isSameDay(d, today);
                    const isSelected = isSameDay(d, selectedDay);
                    const taskCount = getTasksForDay(d).length;

                    return (
                        <button
                            key={d.toISOString()}
                            onClick={() => setSelectedDay(d)}
                            className={`relative flex flex-col items-center justify-center rounded-lg min-h-8 transition-all duration-200 border
                                ${!inMonth ? 'opacity-30 border-transparent' : 'hover:bg-surface-secondary hover:border-transparent border-transparent'}
                                ${isSelected ? 'bg-[#151410] border-gold-primary/55!' : ''}
                                ${isToday && !isSelected ? 'border-gold-primary/30!' : ''}
                            `}
                        >
                            <span
                                className={`text-xs font-body leading-none ${isSelected || isToday
                                    ? 'font-bold text-gold-primary'
                                    : 'text-foreground'
                                    }`}
                            >
                                {format(d, 'd')}
                            </span>

                            {taskCount > 0 && (
                                <span className="text-[9px] font-body text-muted-foreground leading-none mt-0.5">
                                    {taskCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected day task list */}
            <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="font-body text-sm text-muted-foreground">
                        {format(selectedDay, "EEEE, d 'de' MMMM", { locale })}
                    </span>
                </div>
                {selectedDayTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <img src="/images/empty-state.png" alt="" className="w-28 h-28 object-contain opacity-90" />
                        <p className="font-heading text-sm mt-2 font-semibold text-gold-primary">{__('messages.no_tasks_this_month')}</p>
                        <p className="text-xs text-muted-foreground">{__('messages.how_about_planning_something_new')}</p>
                    </div>
                ) : (
                    <div className="">
                        {selectedDayTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                taskRecurrence={task}
                                onComplete={handleCompleteTask}
                                onPending={handlePendingTask}
                                category={categories.find(c => c.id === task.category)!}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
