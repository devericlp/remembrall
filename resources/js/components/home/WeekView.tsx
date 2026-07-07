import { useCompleteTask } from "@/hooks/useCompleteTask";
import { useLang } from "@/hooks/useLang";
import { Category } from "@/types/enums/category";
import { GlobalProps } from "@/types/global";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { router, usePage } from "@inertiajs/react";
import { format, type Locale } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import TaskCompletedSheet from "../task/TaskCompletedSheet";
import TaskItem from "../task/TaskItem";
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

type PageProps = {
    tasks: TaskRecurrence[];
    categories: Category[],
};

const localeMap: Record<string, Locale> = { pt_br: ptBR, en: enUS };

export default function WeekView({ tasks, categories }: PageProps) {
    const today = new Date();
    const { __ } = useLang();
    const { currentLanguage } = usePage<GlobalProps>().props;
    const locale = localeMap[currentLanguage] ?? enUS;
    const weekDays = useWeekDates(currentLanguage.replace('_', '-'));
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
    const { completedSheetOpen, newAchievement, completeTask, closeSheet } = useCompleteTask();

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

    const tasksByDay = useMemo(() => {
        return (tasks ?? []).reduce<Record<number, TaskRecurrence[]>>((acc, task) => {
            const dayNumber = parseInt(task.start_date.substring(8, 10), 10);
            (acc[dayNumber] ??= []).push(task);
            return acc;
        }, {});
    }, [tasks]);

    function useWeekDates(locale = 'pt-BR') {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const monday = new Date(today)

        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        monday.setDate(today.getDate() + diff)
        monday.setHours(0, 0, 0, 0)

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday)
            date.setDate(monday.getDate() + i)
            return {
                number: date.getDate(),
                label: date.toLocaleDateString(locale, { weekday: 'short' }),
                date,
            }
        })
    }

    const weekTaskCount = weekDays.reduce((sum, d) => sum + (tasksByDay[d.number]?.length ?? 0), 0)
    const selectedDayDate = weekDays.find(d => d.number === selectedDay)?.date ?? new Date()
    const selectedDayTasks = tasksByDay[selectedDay] ?? []

    return (
        <>
            <TaskCompletedSheet
                open={completedSheetOpen}
                achievement={newAchievement}
                onClose={closeSheet}
            />
            {/* Week days row */}
            <Tabs value={String(selectedDay)} onValueChange={(v) => setSelectedDay(Number(v))} className="mb-3">
                <TabsList className="w-full h-auto">
                    {weekDays.map((day) => (
                        <TabsTrigger
                            key={day.number}
                            value={String(day.number)}
                            className="flex-1 flex-col py-2 gap-0 font-heading text-[8px] uppercase tracking-wider"
                        >
                            <span>{day.label}</span>
                            <small className="text-[10px]">{day.number}</small>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="font-body text-sm text-muted-foreground">
                    {format(selectedDayDate, "EEEE, d 'de' MMMM", { locale })}
                </span>
            </div>

            {/* Content */}
            {weekTaskCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <img src="/images/empty-state.png" alt="" className="w-36 h-w-36 object-contain opacity-90" />
                    <p className="font-heading text-base mt-2 font-semibold text-gold-primary">{__('messages.no_tasks_this_week')}</p>
                    <p className="text-sm text-muted-foreground">{__('messages.how_about_planning_something_new')}</p>
                </div>
            ) : (
                <div className="flex flex-col space-y-1">
                    {selectedDayTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <img src="/images/empty-state.png" alt="" className="w-36 h-w-36 object-contain opacity-90" />
                            <p className="font-heading text-base mt-2 font-semibold text-gold-primary">{__('messages.no_tasks_this_day')}</p>
                            <p className="text-sm text-muted-foreground">{__('messages.enjoy_the_day')}</p>
                        </div>
                    ) : (
                        selectedDayTasks.map((taskRecurrence: TaskRecurrence) => (
                            <TaskItem
                                key={taskRecurrence.id}
                                taskRecurrence={taskRecurrence}
                                onComplete={handleCompleteTask}
                                onPending={handlePendingTask}
                                category={categories.find(c => c.id === taskRecurrence.category)!}
                            />
                        ))
                    )}
                </div>
            )}
        </>
    )
}
