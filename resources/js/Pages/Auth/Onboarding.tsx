import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { useLang } from "@/hooks/useLang";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import RemembrallOrb, { type OrbState } from "../../components/home/RemembrallOrb";

const Onboarding: React.FC & { layout?: (page: ReactNode) => ReactNode } =
    function Onboarding() {
        const { __ } = useLang();

        const slides: { state: OrbState; title: string; description: string }[] = [
            {
                state: "clear",
                title: __("messages.everything_in_order"),
                description: __("messages.when_there_are_no_pending_tasks_the_sphere_remains_clear"),
            },
            {
                state: "warning",
                title: __("messages.something_is_coming"),
                description: __("messages.smoke_appears_when_there_are_tasks_nearby"),
            },
            {
                state: "danger",
                title: __("messages.dont_forget"),
                description: __("messages.when_a_task_is_missed_the_sphere_turns_red_to_draw_your_attention"),
            },
        ];

        const [api, setApi] = useState<CarouselApi>();
        const [current, setCurrent] = useState(0);

        const onSelect = useCallback(() => {
            if (!api) return;
            setCurrent(api.selectedScrollSnap());
        }, [api]);

        useEffect(() => {
            if (!api) return;
            onSelect();
            api.on("select", onSelect);
            return () => {
                api.off("select", onSelect);
            };
        }, [api, onSelect]);

        const isLastSlide = current === slides.length - 1;

        return (
            <div className="w-full h-full flex flex-col px-5">
                <div className="flex justify-end pt-2 pb-0">
                    <Link
                        href="/login"
                        className={`text-sm font-normal text-primary hover:text-accent transition-colors ${isLastSlide ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    >
                        {__("messages.skip")}
                    </Link>
                </div>

                <div className="flex-1 min-h-0 flex flex-col items-center justify-center pb-10">
                    <img src="/images/title.png" alt="Remembrall" className="w-40 object-contain mb-4" />

                    <Carousel setApi={setApi} className="w-full" opts={{ loop: false }}>
                        <CarouselContent>
                            {slides.map((slide, index) => (
                                <CarouselItem key={index}>
                                    <div className="flex flex-col items-center gap-2">
                                        <RemembrallOrb state={slide.state} size="40vh" />
                                        <img
                                            src="/images/divider.png"
                                            alt=""
                                            className="w-32 object-contain"
                                        />
                                        <div className="text-center space-y-2 px-4 pt-1">
                                            <h2 className="text-2xl font-heading font-semibold text-page-header">
                                                {slide.title}
                                            </h2>
                                            <p className="text-hint-foreground text-base leading-relaxed max-w-64 mx-auto">
                                                {slide.description}
                                            </p>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                    <div className="flex gap-3 mt-4">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`rounded-full transition-all duration-300 size-2.5 ${current === index ? "bg-primary" : "bg-primary/30"}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative flex justify-end items-center pb-10">
                    <Link
                        href="/login"
                        className={`absolute inset-x-0 bottom-10 btn-primary font-medium text-base h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isLastSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    >
                        {__("messages.get_started")}
                    </Link>
                    <button
                        onClick={() => api?.scrollTo(current + 1)}
                        className={`flex items-center gap-1 cursor-pointer border border-gold-primary/35 text-gold-primary hover:border-gold-primary/60 hover:text-gold-light font-normal text-sm h-10 px-4 rounded-lg transition-all duration-300 ${isLastSlide ? "opacity-0 pointer-events-none translate-x-2" : "opacity-100 translate-x-0"}`}
                    >
                        {__("messages.next")}
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        );
    };

Onboarding.layout = (page: ReactNode) => <AuthLayout background="" padded={false}>{page}</AuthLayout>;

export default Onboarding;
