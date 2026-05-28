import TaskItem from "@/components/task/TaskItem";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle
} from "@/components/ui/empty";
import { Category } from "@/types/enums/category";
import { Paginated } from "@/types/paginated";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { InfiniteScroll, router } from "@inertiajs/react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { AnimatePresence } from "motion/react";
import type { FC, ReactNode } from "react";
import { toast } from "sonner";
import { useLang } from "../../../hooks/useLang";
import AppLayout from "../../../Layouts/AppLayout";

type ListOverduePageProps = {
    tasks: Paginated<TaskRecurrence>
    categories: Category[],
}

const ListOverdue: FC<ListOverduePageProps> & { layout?: (page: ReactNode) => ReactNode } = function ListOverdue({ tasks, categories }: ListOverduePageProps) {
    const { __ } = useLang();

    function handleCompleteTask(taskRecurrence: TaskRecurrence) {
        router.put(`/tasks/${taskRecurrence.id}/complete`, {}, {
            preserveScroll: true,
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    return (
        <div className="max-w-2xl mx-auto px-4 pt-12 pb-24">
            <h1 className="font-heading text-3xl font-bold text-foreground tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                {__('messages.overdue_tasks')}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-0.5 italic">
                {tasks.total === 0
                    ? __('messages.no_overdue_tasks')
                    : __('messages.tasks_needing_attention', { count: String(tasks.total) })}
            </p>

            {tasks.total > 0 ? (
                <InfiniteScroll data="tasks">
                    <AnimatePresence>
                        {tasks.data.map((taskRecurrence: TaskRecurrence) => (
                            <TaskItem
                                key={taskRecurrence.id}
                                taskRecurrence={taskRecurrence}
                                onComplete={handleCompleteTask}
                                category={categories.find(c => c.id === taskRecurrence.category)!}
                            />
                        ))}
                    </AnimatePresence>
                </InfiniteScroll>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                    <Empty>
                        <EmptyHeader>
                            <Sparkles className="text-orange-500" />
                            <EmptyTitle>{__('messages.everything_up_to_date')}!</EmptyTitle>
                            <EmptyDescription>
                                {__('messages.your_remembrall_is_all_clear_no_missed_reminders')}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            )}

        </div>
    );
}

ListOverdue.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>

export default ListOverdue;