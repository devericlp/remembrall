import DayView from "@/components/home/DayView";
import MonthView from "@/components/home/MonthView";
import OrbStatusCard from "@/components/home/OrbStatusCard";
import WeekView from "@/components/home/WeekView";
import { Button } from "@/components/ui/button";
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
    tasks: Paginated<TaskRecurrence>,
    categories: Category[],
    overdueCount: number,
    dueSoonCount: number,
    totalPending: number,
}

const Home: FC<HomePageProps> & { layout?: (page: ReactNode) => ReactNode } = function Home({ tasks, tab, categories, overdueCount, dueSoonCount, totalPending }: HomePageProps) {
    const { __ } = useLang();
    const { appName } = usePage<GlobalProps>().props;

    function openTaskCreate() {
        router.visit(`/tasks/create`, { viewTransition: true });
    }

    return (
        <>
            <Head title={__('messages.home')} />
            <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
                <div className="text-center mb-2">
                    <h1 className="font-heading text-2xl md:text-3xl text-foreground font-bold tracking-wide">
                        {appName}
                    </h1>
                    <p className="font-medieval text-muted-foreground text-sm mt-1 italic">
                        {__('messages.your_tasks_your_magical_memories')}
                    </p>
                </div>

                <OrbStatusCard
                    overdueCount={overdueCount}
                    dueSoonCount={dueSoonCount}
                    totalPending={totalPending}
                />

                <Tabs value={tab} onValueChange={(value) => router.visit(`/home/${value}`, { viewTransition: true })}>
                    <TabsList className="w-full bg-card/60 backdrop-blur-sm border border-border">
                        <TabsTrigger value="day" className="flex-1 gap-2 font-heading text-xs uppercase tracking-wider">
                            <Sun />
                            {__('messages.day')}
                        </TabsTrigger>
                        <TabsTrigger value="week" className="flex-1 gap-2 font-heading text-xs uppercase tracking-wider">
                            <CalendarDays className="w-4 h-4" />
                            {__('messages.week')}
                        </TabsTrigger>
                        <TabsTrigger value="month" className="flex-1 gap-2 font-heading text-xs uppercase tracking-wider">
                            <CalendarIcon className="w-4 h-4" />
                            {__('messages.month')}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="day">
                        <DayView tasks={tasks} categories={categories} />
                    </TabsContent>
                    <TabsContent value="week">
                        <WeekView tasks={tasks.data} categories={categories} />
                    </TabsContent>
                    <TabsContent value="month">
                        <MonthView tasks={tasks.data} categories={categories} />
                    </TabsContent>
                </Tabs>

                <Button
                    onClick={openTaskCreate}
                    className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-xl bg-[#6D2E32] hover:bg-[#7C373C] shadow-primary/30 font-heading text-xl z-20"
                    size="icon"
                >
                    <Plus className="w-6 h-6" />
                </Button>

            </div>
        </>
    );
}

Home.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>

export default Home;