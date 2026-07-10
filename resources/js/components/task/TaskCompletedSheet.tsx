import { Button } from "@/components/ui/button";
import { useLang } from "@/hooks/useLang";
import { NewAchievement } from "@/types/global";
import { router } from "@inertiajs/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CSSProperties, useMemo } from "react";

type Props = {
    open: boolean;
    achievement: NewAchievement | null;
    onClose: () => void;
};

/**
 * Coreografia da revelação (em segundos, a partir da abertura do sheet):
 *  1. Brasas douradas sobem continuamente ao fundo
 *     + insígnia entra com giro 3D de moeda (rotateY 540° → 0°)
 *  2. Brilho dourado varre a insígnia (one-shot)
 *  3. Faixa borgonha (banner de pontas entalhadas) desenrola do centro
 *  4. Título revelado como tinta escrevendo (clip-path wipe)
 *  5. Subtítulo com fade + slide
 *  6. Botão e link sobem
 *
 * Idle: insígnia oscila levemente em 3D (rotateY ±6°), brasas continuam.
 */
const T = {
    flip: 0.08,
    shine: 1.05,
    ribbon: 1.3,
    titleWipe: 1.55,
    subtitle: 2.15,
    actions: 2.95,
};

const MEDAL_SIZE = 156;
const EMBER_COUNT = 18;

interface Ember {
    x: number;
    size: number;
    sway: number;
    dur: number;
    delay: number;
}

function buildEmbers(count: number): Ember[] {
    return Array.from({ length: count }, () => ({
        x: Math.random() * 92 + 4,
        size: 2 + Math.random() * 2.5,
        sway: Math.random() * 70 - 35,
        dur: 5 + Math.random() * 4,
        delay: Math.random() * 6,
    }));
}

export default function TaskCompletedSheet({ open, achievement, onClose }: Props) {
    const { __ } = useLang();
    const reduced = useReducedMotion();
    const d = (s: number) => (reduced ? 0 : s);
    const embers = useMemo(() => buildEmbers(EMBER_COUNT), []);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col overflow-hidden"
                    style={{
                        background:
                            "radial-gradient(130% 95% at 50% 20%, #1a1310 0%, #100a08 55%, #070504 100%)",
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {achievement && (
                        <>
                            <style>{`
                                @keyframes tcs-ember { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: .9; } 100% { transform: translate(var(--sx), -640px); opacity: 0; } }
                                @keyframes tcs-wobble { 0%, 100% { transform: rotateY(-6deg); } 50% { transform: rotateY(6deg); } }
                            `}</style>

                            {/* brasas subindo */}
                            {!reduced && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {embers.map((e, i) => (
                                        <span
                                            key={i}
                                            className="absolute rounded-full bg-[#e9c46a]"
                                            style={{
                                                bottom: -8,
                                                left: `${e.x}%`,
                                                width: e.size,
                                                height: e.size,
                                                boxShadow: "0 0 6px 1px rgba(233,196,106,.6)",
                                                opacity: 0,
                                                animation: `tcs-ember ${e.dur}s ${e.delay}s linear infinite`,
                                                ["--sx" as string]: `${e.sway}px`,
                                            } as CSSProperties}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 gap-2">
                                {/* insígnia com giro 3D + brilho */}
                                <div
                                    className="relative shrink-0"
                                    style={{ width: MEDAL_SIZE, height: MEDAL_SIZE, perspective: 700 }}
                                >
                                    <motion.div
                                        className="relative w-full h-full rounded-full overflow-hidden"
                                        style={{
                                            filter: "drop-shadow(0 0 20px rgba(233,196,106,.4))",
                                            animation: reduced
                                                ? undefined
                                                : `tcs-wobble 5.5s ease-in-out ${T.shine + 0.9}s infinite`,
                                        }}
                                        initial={{ opacity: 0, rotateY: 540, scale: 0.35 }}
                                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                        transition={{
                                            delay: d(T.flip),
                                            duration: d(1),
                                            ease: [0.215, 0.61, 0.355, 1],
                                        }}
                                    >
                                        <img
                                            src={`/${achievement.image}`}
                                            alt={achievement.title}
                                            draggable={false}
                                            className="w-full h-full object-contain select-none"
                                        />
                                        <motion.span
                                            className="absolute top-0 h-full pointer-events-none"
                                            style={{
                                                width: "55%",
                                                background:
                                                    "linear-gradient(105deg, transparent, rgba(255,240,200,.55), transparent)",
                                                transform: "skewX(-16deg)",
                                            }}
                                            initial={{ left: "-90%" }}
                                            animate={{ left: "130%" }}
                                            transition={{
                                                delay: d(T.shine),
                                                duration: d(0.8),
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </motion.div>
                                </div>

                                {/* faixa borgonha + título com wipe de tinta */}
                                <motion.div
                                    className="relative flex items-center justify-center mt-4"
                                    style={{
                                        width: 280,
                                        height: 58,
                                        background: "linear-gradient(#8a2436, #5e1622)",
                                        boxShadow:
                                            "inset 0 1px 0 rgba(233,196,106,.55), inset 0 -1px 0 rgba(233,196,106,.35), 0 4px 14px rgba(0,0,0,.5)",
                                        clipPath:
                                            "polygon(0% 0%, 100% 0%, calc(100% - 14px) 50%, 100% 100%, 0% 100%, 14px 50%)",
                                    }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: d(T.ribbon), duration: d(0.5), ease: "easeOut" }}
                                >
                                    <motion.span
                                        className="font-heading font-semibold text-[23px] tracking-wide whitespace-nowrap"
                                        style={{ color: "#F0E6C8" }}
                                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                                        transition={{
                                            delay: d(T.titleWipe),
                                            duration: d(0.9),
                                            ease: "easeInOut",
                                        }}
                                    >
                                        {achievement.title}
                                    </motion.span>
                                </motion.div>

                                {/* subtítulo */}
                                <motion.p
                                    className="text-center px-9 max-w-xs"
                                    style={{
                                        color: "#b9a77e",
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontStyle: "italic",
                                        fontSize: 17,
                                    }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: d(T.subtitle), duration: d(0.5) }}
                                >
                                    {achievement.subtitle}
                                </motion.p>
                            </div>

                            <motion.div
                                className="relative z-10 flex flex-col gap-3 px-6 pb-10"
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: d(T.actions), duration: d(0.5) }}
                            >
                                <Button
                                    className="w-full h-10 cursor-pointer btn-celebrate"
                                    onClick={onClose}
                                >
                                    Continuar
                                </Button>
                                <button
                                    onClick={() => router.visit('/achievements', { viewTransition: true })}
                                    className="text-sm text-muted-foreground hover:text-gold-primary transition-colors cursor-pointer text-center"
                                >
                                    {__('messages.achievements')}
                                </button>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
