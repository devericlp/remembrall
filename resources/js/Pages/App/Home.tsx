import DayView from "@/components/home/DayView";
import MonthView from "@/components/home/MonthView";
import WeekView from "@/components/home/WeekView";
import PageHeader from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLang } from "@/hooks/useLang";
import { Category } from "@/types/enums/category";
import { GlobalProps } from "@/types/global";
import { Paginated } from "@/types/paginated";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { Head, router, usePage } from "@inertiajs/react";
import { CalendarDays, Calendar as CalendarIcon, Plus, Sun } from "lucide-react";
import type { FC, ReactNode } from "react";
import AppLayout from "../../Layouts/AppLayout";

type HomePageProps = {
    tab: string,
    tasks: Paginated<TaskRecurrence> | TaskRecurrence[],
    categories: Category[],
    overdueCount: number,
    dueSoonCount: number,
    totalPending: number,
}

const Home: FC<HomePageProps> & { layout?: (page: ReactNode) => ReactNode } = function Home({ tasks, tab, categories, overdueCount }: HomePageProps) {
    const { __ } = useLang();
    const { appName } = usePage<GlobalProps>().props;

    const taskArray: TaskRecurrence[] = Array.isArray(tasks) ? tasks : (tasks.data ?? []);

    return (
        <>
            <Head title={__('messages.home')} />
            <div className="px-4 py-6 pb-24">
                <PageHeader
                    title={appName}
                    action={
                        <button
                            onClick={() => router.visit('/tasks/create', { viewTransition: true })}
                            className="flex items-center justify-center size-6 rounded-full bg-gold-primary text-background hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            <Plus className="size-4" />
                        </button>
                    }
                />

                <Tabs value={tab} onValueChange={(value) => router.visit(`/home/${value}`, { viewTransition: true })}>
                    <TabsList className="w-full">
                        <TabsTrigger value="day" className="uppercase tracking-wider">
                            <Sun className="w-4 h-4" />
                            {__('messages.day')}
                        </TabsTrigger>
                        <TabsTrigger value="week" className="uppercase tracking-wider">
                            <CalendarDays className="w-4 h-4" />
                            {__('messages.week')}
                        </TabsTrigger>
                        <TabsTrigger value="month" className="uppercase tracking-wider">
                            <CalendarIcon className="w-4 h-4" />
                            {__('messages.month')}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="day">
                        <DayView tasks={tasks as Paginated<TaskRecurrence>} categories={categories} overdueCount={overdueCount} />
                    </TabsContent>
                    <TabsContent value="week">
                        <WeekView tasks={taskArray} categories={categories} />
                    </TabsContent>
                    <TabsContent value="month">
                        <MonthView tasks={taskArray} categories={categories} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

Home.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>

export default Home;