import { useCompleteTask } from "@/hooks/useCompleteTask";
import { useLang } from "@/hooks/useLang";
import { Category } from "@/types/enums/category";
import { GlobalProps } from "@/types/global";
import { Paginated } from "@/types/paginated";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { InfiniteScroll, router, usePage } from "@inertiajs/react";
import { format, type Locale } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import TaskCompletedSheet from "../task/TaskCompletedSheet";
import TaskItem from "../task/TaskItem";
import { Card, CardContent } from "../ui/card";

type PageProps = {
    tasks: Paginated<TaskRecurrence>,
    categories: Category[],
    overdueCount: number,
};

const localeMap: Record<string, Locale> = { pt_br: ptBR, en: enUS };

export default function DayView({ tasks, categories, overdueCount }: PageProps) {
    const { __ } = useLang();
    const { currentLanguage } = usePage<GlobalProps>().props;
    const locale = localeMap[currentLanguage] ?? enUS;
    const { completedSheetOpen, newAchievement, completeTask, closeSheet } = useCompleteTask();

    const pendingCount = tasks.data.filter(t => t.completed_at === null).length;
    const completedCount = tasks.data.filter(t => t.completed_at !== null).length;

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

    return <>
        <TaskCompletedSheet
            open={completedSheetOpen}
            achievement={newAchievement}
            onClose={closeSheet}
        />

        <div className="grid grid-cols-3 gap-2 mt-4">
            <Card className="border-gold-primary/10 rounded-xl">
                <CardContent className="flex flex-col items-center justify-center py-2.5 gap-0.5">
                    <span className="text-xl font-bold text-gold-primary leading-none">{pendingCount}</span>
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{__('messages.pending')}</span>
                </CardContent>
            </Card>
            <Card className="border-gold-primary/10 rounded-xl">
                <CardContent className="flex flex-col items-center justify-center py-2.5 gap-0.5">
                    <span className="text-xl font-bold text-gold-primary leading-none">{completedCount}</span>
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{__('messages.completed')}</span>
                </CardContent>
            </Card>
            <Card className="border-gold-primary/10 rounded-xl">
                <CardContent className="flex flex-col items-center justify-center py-2.5 gap-0.5">
                    <span className="text-xl font-bold text-gold-primary leading-none">{overdueCount}</span>
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{__('messages.overdue')}</span>
                </CardContent>
            </Card>
        </div>

        <div className="flex items-center gap-2 mt-3">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-body text-sm text-muted-foreground">
                {format(new Date(), "EEEE, d 'de' MMMM", { locale })}
            </span>
        </div>

        {
            tasks.total > 0 ? (
                <InfiniteScroll data="tasks" className="mt-3">
                    <div className="flex flex-col space-y-1">
                        {tasks.data.map((taskRecurrence: TaskRecurrence) => (
                            <TaskItem
                                key={taskRecurrence.id}
                                taskRecurrence={taskRecurrence}
                                onComplete={handleCompleteTask}
                                onPending={handlePendingTask}
                                category={categories.find(c => c.id === taskRecurrence.category)!}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <img src="/images/empty-state.png" alt="" className="w-36 h-w-36 object-contain opacity-90" />
                    <p className="font-heading text-base mt-2 font-semibold text-gold-primary">{__('messages.no_tasks_this_day')}</p>
                    <p className="text-sm text-muted-foreground">{__('messages.enjoy_the_day')}</p>
                </div>
            )
        }
    </>
}
