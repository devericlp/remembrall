import PageHeader from "@/components/layout/PageHeader";
import { GlobalProps, OrbState } from "@/types/global";
import { Head, router, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import RemembrallOrb from "../../components/home/RemembrallOrb";
import { useLang } from "../../hooks/useLang";
import AppLayout from "../../Layouts/AppLayout";

const orbContent: Record<OrbState, { title: string; description: string }> = {
    clear: {
        title: 'messages.everything_in_order',
        description: 'messages.when_there_are_no_pending_tasks_the_sphere_remains_clear',
    },
    warning: {
        title: 'messages.something_is_coming',
        description: 'messages.smoke_appears_when_there_are_tasks_nearby',
    },
    danger: {
        title: 'messages.dont_forget',
        description: 'messages.when_a_task_is_missed_the_sphere_turns_red_to_draw_your_attention',
    },
};

function OrbView() {
    const { __ } = useLang();
    const { orbState } = usePage<GlobalProps>().props;
    const content = orbContent[orbState];

    return (
        <>
            <Head title={__('messages.orb')} />
            <div className="px-4 pt-5 pb-24">
                <PageHeader onBack={() => router.visit('/home', { viewTransition: true })} className="mb-8" />

                <div className="flex flex-col items-center text-center gap-3 mt-8">
                    <h2 className="text-2xl font-heading font-semibold text-page-header">
                        {__(content.title)}
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-64">
                        {__(content.description)}
                    </p>
                    <RemembrallOrb state={orbState} size={256} className="mt-6" />
                </div>
            </div>
        </>
    );
}

OrbView.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default OrbView;
