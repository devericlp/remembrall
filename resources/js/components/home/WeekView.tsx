import { useLang } from "@/hooks/useLang";
import { Category } from "@/types/enums/category";
import { GlobalProps } from "@/types/global";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { router, usePage } from "@inertiajs/react";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import TaskItem from "../task/TaskItem";
import { Card, CardContent } from "../ui/card";
import { Empty, EmptyHeader, EmptyTitle } from "../ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type PageProps = {
    tasks: TaskRecurrence[];
    categories: Category[],
};

export default function WeekView({ tasks, categories }: PageProps) {
    const today = new Date();
    const { __ } = useLang();
    const { currentLanguage } = usePage<GlobalProps>().props;
    const locale = currentLanguage.replace('_', '-');
    const weekDays = useWeekDates(locale);
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

    function handleCompleteTask(taskRecurrence: TaskRecurrence) {
        router.put(`/tasks/${taskRecurrence.id}/complete`, {}, {
            preserveScroll: true,
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    const tasksByDay = useMemo(() => {
        return tasks.reduce<Record<number, TaskRecurrence[]>>((acc, task) => {
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
            }
        })
    }

    return (
        <Card className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/60">
            <CardContent>
                <Tabs defaultValue={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
                    <TabsList className="w-full bg-card/60">
                        {weekDays.map((day) => (
                            <TabsTrigger
                                key={day.number.toString()}
                                value={day.number.toString()}
                                className="flex-1 gap-2 font-heading text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <div className="flex flex-col space-y-1 items-center">
                                    {day.label}
                                    <small>
                                        {day.number}
                                    </small>
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {weekDays.map((day) => (
                        <TabsContent key={day.number.toString()} value={day.number.toString()}>
                            {!tasksByDay[day.number]?.length ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center mt-4">
                                    <Empty>
                                        <EmptyHeader>
                                            <Sparkles className="text-orange-500" />
                                            <EmptyTitle>
                                                {__('messages.no_tasks_for_today_enjoy_your_day')}! ✨
                                            </EmptyTitle>
                                        </EmptyHeader>
                                    </Empty>
                                </div>

                            ) : (
                                <>
                                    <div className="flex flex-col gap-2">
                                        {tasksByDay[day.number].map((taskRecurrence: TaskRecurrence, index) => (
                                            <TaskItem
                                                key={taskRecurrence.id}
                                                taskRecurrence={taskRecurrence}
                                                onComplete={handleCompleteTask}
                                                category={categories.find(c => c.id === taskRecurrence.category)!}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>


            </CardContent>
        </Card>
    );
}