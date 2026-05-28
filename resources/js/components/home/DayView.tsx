import { useLang } from "@/hooks/useLang";
import { Category } from "@/types/enums/category";
import { GlobalProps } from "@/types/global";
import { Paginated } from "@/types/paginated";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { InfiniteScroll, router, usePage } from "@inertiajs/react";
import { format, Locale } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import Taskitem from "../task/TaskItem";
import { Card, CardContent } from "../ui/card";
import { Empty, EmptyHeader, EmptyTitle } from "../ui/empty";

type PageProps = {
    tasks: Paginated<TaskRecurrence>,
    categories: Category[],
};

const localeMap: Record<string, Locale> = {
    pt_br: ptBR,
    en: enUS,
};

export default function DayView({ tasks, categories }: PageProps) {
    const { currentLanguage } = usePage<GlobalProps>().props;
    const locale: Locale = localeMap[currentLanguage] ?? enUS;
    const { __ } = useLang();

    function handleCompleteTask(taskRecurrence: TaskRecurrence) {
        router.put(`/tasks/${taskRecurrence.id}/complete`, {}, {
            preserveScroll: true,
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    return <>
        <Card className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/60">
            <CardContent className="p-2 md:p-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <h3 className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
                            {format(new Date(), "EEEE, d 'de' MMMM", { locale: locale })}
                        </h3>
                    </div>

                    {tasks.total > 0 ? (
                        <InfiniteScroll data="tasks" loading={() => "Loading more tasks..."}>
                            <div className="flex flex-col gap-2">
                                {tasks.data.map((taskRecurrence: TaskRecurrence, index) => (
                                    <Taskitem
                                        key={taskRecurrence.id}
                                        taskRecurrence={taskRecurrence}
                                        onComplete={handleCompleteTask}
                                        category={categories.find(c => c.id === taskRecurrence.category)!}
                                    />
                                ))}
                            </div>
                        </InfiniteScroll>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                            <Empty>
                                <EmptyHeader>
                                    <Sparkles className="text-orange-500" />
                                    <EmptyTitle>{__('messages.no_tasks_for_today_enjoy_your_day')}! ✨</EmptyTitle>
                                </EmptyHeader>
                            </Empty>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </>
}