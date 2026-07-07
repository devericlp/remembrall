import PageHeader from "@/components/layout/PageHeader";
import TaskCompletedSheet from "@/components/task/TaskCompletedSheet";
import TaskItem from "@/components/task/TaskItem";
import { Card, CardContent } from "@/components/ui/card";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import { Category } from "@/types/enums/category";
import { GlobalProps } from "@/types/global";
import { Paginated } from "@/types/paginated";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { Head, InfiniteScroll, usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useLang } from "../../../hooks/useLang";
import AppLayout from "../../../Layouts/AppLayout";

type ListOverduePageProps = {
    tasks: Paginated<TaskRecurrence>
    categories: Category[],
    oldestDate: string | null,
    highPriorityCount: number,
}

const ListOverdue: FC<ListOverduePageProps> & { layout?: (page: ReactNode) => ReactNode } = function ListOverdue({ tasks, categories, oldestDate, highPriorityCount }: ListOverduePageProps) {
    const { __ } = useLang();
    const { currentLanguage } = usePage<GlobalProps>().props;
    const [completingIds, setCompletingIds] = useState<Set<number>>(new Set());
    const { completedSheetOpen, newAchievement, completeTask, closeSheet } = useCompleteTask();

    const formatShortDate = (dateStr: string) => {
        const locale = currentLanguage === 'pt_br' ? 'pt-BR' : 'en-US';
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleDateString(locale, { month: 'short' }).replace('.', '');
        return currentLanguage === 'pt_br'
            ? `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`
            : `${month} ${day}`;
    };

    function handleCompleteTask(taskRecurrence: TaskRecurrence) {
        setCompletingIds(prev => new Set(prev).add(taskRecurrence.id));

        setTimeout(() => {
            completeTask(taskRecurrence.id, {
                onError: () => {
                    setCompletingIds(prev => {
                        const next = new Set(prev);
                        next.delete(taskRecurrence.id);
                        return next;
                    });
                    toast.error(__('messages.oops_something_went_wrong_please_try_again'));
                },
            });
        }, 700);
    }

    return (
        <>
            <TaskCompletedSheet
                open={completedSheetOpen}
                achievement={newAchievement}
                onClose={closeSheet}
            />
            <Head title={__('messages.overdue_tasks')} />
            <div className="px-4 pt-5 pb-24">

                <PageHeader title={__('messages.overdue_tasks')} subtitle={__('messages.overdue_tasks_subtitle')} />

                {tasks.total > 0 ? (
                    <>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <Card className="border-gold-primary/10 rounded-xl">
                                <CardContent className="flex flex-col items-center justify-center py-2.5 gap-0.5">
                                    <span className="text-lg font-bold text-gold-primary leading-none">{tasks.total}</span>
                                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{__('messages.total_overdue')}</span>
                                </CardContent>
                            </Card>
                            <Card className="border-gold-primary/10 rounded-xl">
                                <CardContent className="flex flex-col items-center justify-center py-2.5 gap-0.5">
                                    <span className="text-lg font-bold text-gold-primary leading-none">{oldestDate ? formatShortDate(oldestDate) : '—'}</span>
                                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{__('messages.oldest_overdue')}</span>
                                </CardContent>
                            </Card>
                            <Card className="border-gold-primary/10 rounded-xl">
                                <CardContent className="flex flex-col items-center justify-center py-2.5 gap-0.5">
                                    <span className="text-lg font-bold text-gold-primary leading-none">{highPriorityCount}</span>
                                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{__('messages.high_priority_tasks')}</span>
                                </CardContent>
                            </Card>
                        </div>

                        <p className="text-xs tracking-widest uppercase font-body text-muted-foreground mb-1.5">{__('messages.overdue_tasks')}</p>
                        <InfiniteScroll data="tasks">
                            <AnimatePresence>
                                {tasks.data.map((taskRecurrence: TaskRecurrence) => (
                                    <motion.div
                                        key={taskRecurrence.id}
                                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                        transition={{ duration: 0.35, ease: 'easeOut' }}
                                    >
                                        <TaskItem
                                            taskRecurrence={taskRecurrence}
                                            onComplete={handleCompleteTask}
                                            onPending={() => { }}
                                            category={categories.find(c => c.id === taskRecurrence.category)!}
                                            relativeTime
                                            forceCompleted={completingIds.has(taskRecurrence.id)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </InfiniteScroll>
                    </>
                ) : (
                    <div className="w-full min-h-[55vh] flex flex-col items-center justify-center text-center gap-3 border border-gold-primary/35 rounded-xl px-6 py-8">
                        <img src="/images/empty-state.png" alt="" className="w-36 h-36 object-contain opacity-80" />
                        <p className="font-heading text-base font-semibold text-page-header">{__('messages.everything_in_order')}</p>
                        <p className="text-sm text-hint-foreground">{__('messages.great_youre_all_caught_up')}</p>
                        <img src="/images/divider.png" alt="" className="w-32 object-contain opacity-60" />
                        <p className="text-xs text-subtle-foreground leading-relaxed max-w-48">{__('messages.no_overdue_tasks_found')}</p>
                    </div>
                )}

            </div>
        </>
    );
}

ListOverdue.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>

export default ListOverdue;
