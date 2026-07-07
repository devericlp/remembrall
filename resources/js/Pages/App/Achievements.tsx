import AchievementItem from "@/components/achievement/AchievementItem";
import PageHeader from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLang } from "@/hooks/useLang";
import { Achievement } from "@/types/models/achievement";
import { Paginated } from "@/types/paginated";
import { Head, InfiniteScroll, router } from "@inertiajs/react";
import { Lock, Star, Trophy } from "lucide-react";
import type { FC, ReactNode } from "react";
import AppLayout from "../../Layouts/AppLayout";

type AchievementsPageProps = {
    tab: string;
    achievements: Paginated<Achievement>;
};

const Achievements: FC<AchievementsPageProps> & { layout?: (page: ReactNode) => ReactNode } = function Achievements({ tab, achievements }) {
    const { __ } = useLang();

    return (
        <>
            <Head title={__('messages.achievements')} />
            <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
                <PageHeader
                    title={__('messages.achievements')}
                    subtitle={__('messages.achievements_subtitle')}
                />

                <Tabs value={tab} onValueChange={(value) => router.visit(`/achievements/${value}`, { viewTransition: true })}>
                    <TabsList className="w-full">
                        <TabsTrigger value="all" className="uppercase tracking-wider">
                            <Trophy className="w-4 h-4" />
                            {__('messages.all')}
                        </TabsTrigger>
                        <TabsTrigger value="achieved" className="uppercase tracking-wider">
                            <Star className="w-4 h-4" />
                            {__('messages.achieved')}
                        </TabsTrigger>
                        <TabsTrigger value="locked" className="uppercase tracking-wider">
                            <Lock className="w-4 h-4" />
                            {__('messages.locked')}
                        </TabsTrigger>
                    </TabsList>

                    {(['all', 'achieved', 'locked'] as const).map((tabValue) => (
                        <TabsContent key={tabValue} value={tabValue}>
                            {achievements.total > 0 ? (
                                <InfiniteScroll data="achievements" loading={() => null}>
                                    <div className="flex flex-col mt-2">
                                        {achievements.data.map((achievement) => (
                                            <AchievementItem key={achievement.id} achievement={achievement} />
                                        ))}
                                    </div>
                                </InfiniteScroll>
                            ) : tabValue === 'achieved' ? (
                                <div className="w-full min-h-[55vh] flex flex-col items-center justify-center text-center gap-3 border border-gold-primary/35 rounded-xl px-6 py-8 mt-4">
                                    <img src="/images/empty-achieviments.png" alt="empty-achieviments" className="w-32 h-32 object-contain opacity-80" />
                                    <p className="font-heading text-base font-semibold text-page-header">{__('messages.no_achievements_yet')}</p>
                                    <p className="text-sm text-hint-foreground">{__('messages.keep_completing_tasks_to_unlock')}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Trophy className="w-12 h-12 text-gold-primary/30 mb-4" />
                                    <p className="font-heading text-base font-semibold text-gold-primary">{__('messages.achievements')}</p>
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </>
    );
};

Achievements.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default Achievements;
