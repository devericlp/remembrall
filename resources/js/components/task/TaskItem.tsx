import { useLang } from "@/hooks/useLang";
import { formatDate } from "@/lib/utils";
import { Category } from "@/types/enums/category";
import { GlobalProps } from "@/types/global";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { router, usePage } from "@inertiajs/react";
import { animated, useSpring, useSprings } from "@react-spring/web";
import {
    Calendar,
    Check,
    Clock,
    Crown,
    Diamond,
    Gem,
    Hourglass,
    Sparkles,
    TriangleAlert,
} from "lucide-react";
import { useCallback, useRef } from "react";

type ComponentProps = {
    taskRecurrence: TaskRecurrence;
    onComplete: (taskRecurrence: TaskRecurrence) => void;
    category: Category;
};

const HOLD_DURATION = 800;
const R = 22;
const CIRC = 2 * Math.PI * R;

// Partículas: círculos pequenos que explodem ao redor do botão
const PARTICLE_COUNT = 10;
const PARTICLE_SPREAD = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
    const dist = 22 + Math.random() * 16;
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
});

const priorityConfig = {
    low: {
        icon: Diamond,
        iconClass: "size-[11px] fill-stone-400 text-stone-400",
        textClass: "text-stone-500",
    },
    medium: {
        icon: Gem,
        iconClass: "size-[11px] fill-yellow-400 text-yellow-400",
        textClass: "text-yellow-600",
    },
    high: {
        icon: Crown,
        iconClass: "size-[11px] fill-red-400 text-red-400",
        textClass: "text-red-500",
    },
} as const;

export default function TaskItem({ taskRecurrence, onComplete, category }: ComponentProps) {
    const { __ } = useLang();
    const { currentLanguage } = usePage<GlobalProps>().props;
    const completedRef = useRef(false);
    const holdStartRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    const getStatus = (): "danger" | "warning" | "pending" | "success" => {
        if (taskRecurrence.completed_at !== null) return "success";
        const now = new Date();
        const endDate = new Date(taskRecurrence.end_date);
        if (endDate < now) return "danger";
        const hoursUntilDue = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilDue <= 5) return "warning";
        return "pending";
    };

    const status = getStatus();
    const isCompleted = status === "success";

    const [{ progress, btnScale, btnOpacity }, holdApi] = useSpring(() => ({
        progress: 0,
        btnScale: 1,
        btnOpacity: 1,
        config: { tension: 260, friction: 24 },
    }));

    // Partículas: cada uma tem posição, opacidade, escala e tamanho aleatório
    const [particles, particleApi] = useSprings(PARTICLE_COUNT, (i) => ({
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0,
        config: { tension: 220, friction: 16 },
    }));

    const tickHold = useCallback(() => {
        if (!holdStartRef.current) return;
        const elapsed = Date.now() - holdStartRef.current;
        const pct = Math.min(elapsed / HOLD_DURATION, 1);
        holdApi.set({ progress: pct });

        if (pct < 1) {
            rafRef.current = requestAnimationFrame(tickHold);
        } else {
            completedRef.current = true;

            // 1. Dispara as partículas para fora
            particleApi.start((i) => ({
                x: PARTICLE_SPREAD[i].x,
                y: PARTICLE_SPREAD[i].y,
                opacity: 1,
                scale: 0.6 + Math.random() * 0.8,
                config: { tension: 280, friction: 14 },
                onRest: () =>
                    particleApi.start((j) =>
                        j === i
                            ? {
                                opacity: 0,
                                scale: 0,
                                config: { tension: 180, friction: 22 },
                            }
                            : {}
                    ),
            }));

            // 2. Botão cresce levemente, depois some
            holdApi.start({
                btnScale: 1.2,
                config: { tension: 400, friction: 10 },
                onRest: () =>
                    holdApi.start({
                        btnScale: 0,
                        btnOpacity: 0,
                        config: { tension: 320, friction: 22 },
                        onRest: () => onComplete(taskRecurrence),
                    }),
            });
        }
    }, [holdApi, particleApi, onComplete, taskRecurrence]);

    const startHold = useCallback(
        (e: React.PointerEvent) => {
            if (isCompleted || completedRef.current) return;
            e.preventDefault();
            e.stopPropagation();
            holdStartRef.current = Date.now();
            rafRef.current = requestAnimationFrame(tickHold);
        },
        [isCompleted, tickHold]
    );

    const cancelHold = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        holdStartRef.current = null;
        if (!completedRef.current) {
            holdApi.start({
                progress: 0,
                btnScale: 1,
                btnOpacity: 1,
                config: { tension: 360, friction: 18 },
            });
        }
    }, [holdApi]);

    function handleCardClick() {
        router.visit(`/tasks/${taskRecurrence.id}`, { viewTransition: true });
    }

    const statusConfig = {
        success: {
            icon: <Check className="size-3" />,
            label: __("messages.completed"),
            className: "bg-emerald-100 border-emerald-300 text-emerald-800",
        },
        warning: {
            icon: <Hourglass className="size-3" />,
            label: __("messages.in_time"),
            className: "bg-amber-100 border-amber-300 text-amber-800",
        },
        danger: {
            icon: <TriangleAlert className="size-3" />,
            label: __("messages.overdue"),
            className: "bg-red-100 border-red-300 text-red-800",
        },
        pending: {
            icon: <Sparkles className="size-3" />,
            label: __("messages.soon"),
            className: "bg-sky-100 border-sky-300 text-sky-800",
        },
    } as const;

    const s = statusConfig[status];
    const prio =
        priorityConfig[taskRecurrence.priority as keyof typeof priorityConfig] ??
        priorityConfig.low;
    const PriorityIcon = prio.icon;

    return (
        <div
            onClick={handleCardClick}
            className="relative flex items-center overflow-hidden my-1 rounded-2xl bg-card/60 shadow-[0_1px_6px_rgba(120,60,80,0.07)] transition-shadow hover:shadow-[0_2px_10px_rgba(120,60,80,0.12)] cursor-pointer select-none"
        >
            <div className="flex flex-col items-center justify-center gap-1 self-stretch px-3 py-3 min-w-17">
                <img
                    src={category.seal}
                    alt={category.title}
                    className="size-11 object-contain"
                    draggable={false}
                />
                <span
                    className="text-[10px] font-semibold text-stone-400"
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    {__("messages." + category.id)}
                </span>
            </div>

            <div className="self-center h-11 w-px bg-rose-200/60 shrink-0" />

            <div className="flex flex-1 flex-col justify-center min-w-0 px-2.5 py-2.5 gap-1">
                <p
                    className="text-[15px] font-bold leading-snug text-stone-800 line-clamp-2"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                    {taskRecurrence.title}
                </p>

                <div className="flex flex-col sm:flex-row sm:gap-3">
                    <span className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="size-2.75 shrink-0" />
                        {formatDate(
                            taskRecurrence.end_date,
                            currentLanguage === "pt-BR" ? "d/m/Y" : "m/d/Y"
                        )}
                    </span>

                    <span className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="size-2.75 shrink-0" />
                        {formatDate(taskRecurrence.start_date, "H:i")}
                        {" – "}
                        {formatDate(taskRecurrence.end_date, "H:i")}
                    </span>
                </div>

                <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${prio.textClass}`}>
                    <PriorityIcon className={prio.iconClass} />
                    {__("messages.priority")} {__("messages." + taskRecurrence.priority)}
                </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 py-3 pr-3 min-w-19">
                <span
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${s.className}`}
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    {s.icon}
                    {s.label}
                </span>

                {!isCompleted && (
                    <div
                        className="relative flex items-center justify-center"
                        style={{ width: 56, height: 56 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Partículas — círculos verdes que explodem e somem */}
                        {particles.map((pStyle, i) => (
                            <animated.span
                                key={i}
                                style={{
                                    position: "absolute",
                                    width: 5 + (i % 3) * 2,
                                    height: 5 + (i % 3) * 2,
                                    borderRadius: "50%",
                                    background: i % 2 === 0
                                        ? "rgba(52,211,153,0.9)"
                                        : "rgba(16,185,129,0.7)",
                                    pointerEvents: "none",
                                    x: pStyle.x,
                                    y: pStyle.y,
                                    opacity: pStyle.opacity,
                                    scale: pStyle.scale,
                                }}
                            />
                        ))}

                        {/* Anel de progresso — aparece só ao segurar */}
                        <animated.svg
                            width="56"
                            height="56"
                            viewBox="0 0 56 56"
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                transform: "rotate(-90deg)",
                                opacity: progress.to((p) => p > 0 ? 1 : 0),
                                scale: btnScale,
                            }}
                        >
                            {/* Trilha de fundo */}
                            <circle
                                cx="28"
                                cy="28"
                                r={R}
                                fill="none"
                                stroke="rgba(52,211,153,0.15)"
                                strokeWidth="3"
                            />
                            {/* Arco de progresso */}
                            <animated.circle
                                cx="28"
                                cy="28"
                                r={R}
                                fill="none"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={CIRC}
                                style={{
                                    strokeDashoffset: progress.to((p) => CIRC * (1 - p)),
                                    stroke: progress.to(
                                        (p) => `rgba(52,211,153,${0.5 + p * 0.5})`
                                    ),
                                }}
                            />
                        </animated.svg>

                        {/* Botão */}
                        <animated.button
                            onPointerDown={startHold}
                            onPointerUp={cancelHold}
                            onPointerLeave={cancelHold}
                            onPointerCancel={cancelHold}
                            className="absolute inset-[6px] flex items-center justify-center rounded-full touch-none cursor-pointer border-0 p-0"
                            style={{
                                background: progress.to(
                                    (p) =>
                                        p === 0
                                            ? "rgba(0,0,0,0.06)"
                                            : `rgba(29,158,117,${p * 0.85 + 0.1})`
                                ),
                                scale: btnScale,
                                opacity: btnOpacity,
                            }}
                        >
                            <animated.span
                                style={{
                                    display: "flex",
                                    color: progress.to((p) =>
                                        p === 0
                                            ? "rgba(120,113,108,0.6)"
                                            : `rgba(255,255,255,${0.6 + p * 0.4})`
                                    ),
                                }}
                            >
                                <Check className="size-3.5" strokeWidth={2.5} />
                            </animated.span>
                        </animated.button>
                    </div>
                )}
            </div>
        </div>
    );
}