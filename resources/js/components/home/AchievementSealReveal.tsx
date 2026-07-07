import { CSSProperties, useEffect, useMemo } from 'react';
import { animated, easings, useSpring } from '@react-spring/web';

/**
 * AchievementSealReveal — celebração de conquista, tema "selo e pergaminho"
 *
 * Paleta do Remembrall: borgonha (#7A2030 / #8a2436), dourado (#e9c46a,
 * #c9a45c) e pergaminho (#F0E6C8) sobre fundo escuro quente.
 *
 * Coreografia (~3s até o estado final):
 *  1. Brasas douradas sobem continuamente ao fundo
 *     + insígnia entra com giro 3D de moeda (rotateY 540° → 0°)
 *  2. Brilho dourado varre a insígnia (one-shot)
 *  3. Faixa borgonha (banner de pontas entalhadas) desenrola do centro
 *  4. Título revelado como tinta escrevendo (clip-path wipe)
 *  5. Subtítulo com fade + slide
 *  6. Selo de cera borgonha carimba (squash) + fagulhas + label desliza
 *  7. Botões sobem
 *
 * Idle: insígnia oscila levemente em 3D (rotateY ±6°), brasas continuam.
 *
 * Uso:
 *   <AchievementSealReveal
 *     insigniaSrc="/images/achievements/mente-curiosa.png"
 *     title="Mente Curiosa"
 *     subtitle="Você fez 10 anotações incríveis!"
 *     stamp={{ initial: 'R', label: '+10 anotações' }}
 *     onContinue={() => router.visit(route('dashboard'))}
 *     onViewAll={() => router.visit(route('achievements.index'))}
 *   />
 *
 * Para repetir, remonte com uma `key` diferente.
 */

export interface AchievementSealRevealProps {
    /** PNG da insígnia da conquista. */
    insigniaSrc: string;
    title: string;
    subtitle: string;
    /** Selo de cera com inicial + label da estatística (opcional). */
    stamp?: { initial: string; label: string };
    eyebrow?: string;
    continueLabel?: string;
    viewAllLabel?: string;
    onContinue: () => void;
    onViewAll?: () => void;
    onAnimationComplete?: () => void;
}

/* ------------------------------------------------------------------ */
/* Timeline (ms)                                                        */
/* ------------------------------------------------------------------ */
const T = {
    flip: 80,
    shine: 1050,
    ribbon: 1300,
    titleWipe: 1550,
    subtitle: 2150,
    stamp: 2450,
    actions: 2950,
} as const;

/* ------------------------------------------------------------------ */
/* Geometria                                                            */
/* ------------------------------------------------------------------ */
const MEDAL_CENTER_Y = 228;
const MEDAL_SIZE = 156;
const RIBBON_TOP = 340;
const RIBBON_W = 280;
const RIBBON_H = 58;
const EMBER_COUNT = 18;
const SPECK_COUNT = 6;

const KEYFRAMES = `
@keyframes sr-ember { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: .9; } 100% { transform: translate(var(--sx), -640px); opacity: 0; } }
@keyframes sr-wobble { 0%, 100% { transform: rotateY(-6deg); } 50% { transform: rotateY(6deg); } }
`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const smooth = { tension: 120, friction: 22 };

interface Ember {
    x: number;
    size: number;
    sway: number;
    dur: number;
    delay: number;
}

interface Speck {
    px: number;
    py: number;
}

export default function AchievementSealReveal({
    insigniaSrc,
    title,
    subtitle,
    stamp,
    eyebrow = 'Conquista desbloqueada',
    continueLabel = 'Continuar',
    viewAllLabel = 'Ver todas as conquistas',
    onContinue,
    onViewAll,
    onAnimationComplete,
}: AchievementSealRevealProps) {
    const reduced = useMemo(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        [],
    );
    const d = (ms: number) => (reduced ? 0 : ms);

    const embers = useMemo<Ember[]>(
        () =>
            Array.from({ length: EMBER_COUNT }, () => ({
                x: Math.random() * 92 + 4,
                size: 2 + Math.random() * 2.5,
                sway: Math.random() * 70 - 35,
                dur: 5 + Math.random() * 4,
                delay: Math.random() * 6,
            })),
        [],
    );

    const specks = useMemo<Speck[]>(
        () =>
            Array.from({ length: SPECK_COUNT }, (_, i) => {
                const angle = (i / SPECK_COUNT) * Math.PI * 2;
                const dist = 18 + Math.random() * 14;
                return { px: Math.cos(angle) * dist, py: Math.sin(angle) * dist };
            }),
        [],
    );

    /* -------- 1. giro 3D de moeda -------- */
    const flip = useSpring({
        from: { opacity: 0, rotY: 540, scale: 0.35 },
        to: { opacity: 1, rotY: 0, scale: 1 },
        delay: d(T.flip),
        config: { duration: d(1000), easing: easings.easeOutCubic },
    });

    /* -------- 2. brilho varrendo a insígnia -------- */
    const shine = useSpring({
        from: { x: -90 },
        to: { x: 130 },
        delay: d(T.shine),
        config: { duration: d(800), easing: easings.easeInOutCubic },
    });

    /* -------- 3. faixa desenrola -------- */
    const ribbon = useSpring({
        from: { scaleX: 0 },
        to: { scaleX: 1 },
        delay: d(T.ribbon),
        config: reduced ? { duration: 0 } : { tension: 210, friction: 22 },
    });

    const eyebrowSpring = useSpring({
        from: { opacity: 0, y: 8 },
        to: { opacity: 1, y: 0 },
        delay: d(T.ribbon),
        config: smooth,
    });

    /* -------- 4. título como tinta (clip-path wipe) -------- */
    const titleWipe = useSpring({
        from: { clip: 100 },
        to: { clip: 0 },
        delay: d(T.titleWipe),
        config: { duration: d(900), easing: easings.easeInOutSine },
    });

    /* -------- 5. subtítulo -------- */
    const subtitleSpring = useSpring({
        from: { opacity: 0, y: 10 },
        to: { opacity: 1, y: 0 },
        delay: d(T.subtitle),
        config: smooth,
    });

    /* -------- 6. carimbo do selo de cera -------- */
    const seal = useSpring({
        from: { opacity: 0, scale: 2.2, rot: -14 },
        to: async (next) => {
            await sleep(d(T.stamp));
            await next({
                opacity: 1,
                scale: 0.92,
                rot: 2,
                config: { duration: d(230), easing: easings.easeInCubic },
            });
            await next({
                scale: 1,
                rot: 0,
                config: reduced ? { duration: 0 } : { tension: 320, friction: 14 },
            });
        },
    });

    /* fagulhas do carimbo: 1 spring de progresso, N interpolações */
    const speckBurst = useSpring({
        from: { t: 0 },
        to: { t: 1 },
        delay: d(T.stamp + 200),
        config: { duration: d(550), easing: easings.easeOutCubic },
    });

    const stampLabel = useSpring({
        from: { opacity: 0, x: -8 },
        to: { opacity: 1, x: 0 },
        delay: d(T.stamp + 300),
        config: smooth,
    });

    /* -------- 7. ações -------- */
    const actionsSpring = useSpring({
        from: { opacity: 0, y: 18 },
        to: { opacity: 1, y: 0 },
        delay: d(T.actions),
        config: smooth,
    });

    useEffect(() => {
        if (!onAnimationComplete) return;
        const id = setTimeout(onAnimationComplete, d(T.actions + 700));
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={styles.screen}>
            <style>{KEYFRAMES}</style>

            <div style={styles.stage}>
                {/* brasas subindo */}
                {!reduced && (
                    <div style={styles.emberLayer}>
                        {embers.map((e, i) => (
                            <span
                                key={i}
                                style={
                                    {
                                        position: 'absolute',
                                        bottom: -8,
                                        left: `${e.x}%`,
                                        width: e.size,
                                        height: e.size,
                                        borderRadius: '50%',
                                        background: '#e9c46a',
                                        boxShadow: '0 0 6px 1px rgba(233,196,106,.6)',
                                        opacity: 0,
                                        '--sx': `${e.sway}px`,
                                        animation: `sr-ember ${e.dur}s ${e.delay}s linear infinite`,
                                    } as CSSProperties
                                }
                            />
                        ))}
                    </div>
                )}

                <div style={styles.header}>REMEMBRALL</div>

                {/* insígnia com giro 3D + brilho */}
                <div style={styles.medalPerspective}>
                    <animated.div
                        style={{
                            ...styles.medalFlip,
                            opacity: flip.opacity,
                            transform: flip.rotY.to((r) => `rotateY(${r}deg)`),
                            scale: flip.scale,
                            animation:
                                !reduced && `sr-wobble 5.5s ease-in-out ${T.shine + 900}ms infinite`,
                        }}
                    >
                        <img
                            src={insigniaSrc}
                            alt={title}
                            draggable={false}
                            style={styles.medalImg}
                        />
                        <animated.span
                            style={{
                                ...styles.shine,
                                left: shine.x.to((x) => `${x}%`),
                            }}
                        />
                    </animated.div>
                </div>

                {/* selo pequeno acima da faixa */}
                <animated.p
                    style={{
                        ...styles.eyebrow,
                        opacity: eyebrowSpring.opacity,
                        transform: eyebrowSpring.y.to((y) => `translateY(${y}px)`),
                    }}
                >
                    {eyebrow.toUpperCase()}
                </animated.p>

                {/* faixa borgonha + título com wipe de tinta */}
                <animated.div style={{ ...styles.ribbon, scaleX: ribbon.scaleX }}>
                    <animated.span
                        style={{
                            ...styles.title,
                            clipPath: titleWipe.clip.to((c) => `inset(0 ${c}% 0 0)`),
                        }}
                    >
                        {title}
                    </animated.span>
                </animated.div>

                {/* subtítulo */}
                <animated.p
                    style={{
                        ...styles.subtitle,
                        opacity: subtitleSpring.opacity,
                        transform: subtitleSpring.y.to((y) => `translateY(${y}px)`),
                    }}
                >
                    {subtitle}
                </animated.p>

                {/* selo de cera + estatística */}
                {stamp && (
                    <div style={styles.sealRow}>
                        <animated.div
                            style={{
                                ...styles.seal,
                                opacity: seal.opacity,
                                transform: seal.rot.to((r) => `rotate(${r}deg)`),
                                scale: seal.scale,
                            }}
                        >
                            <span style={styles.sealInitial}>{stamp.initial}</span>
                            {specks.map((s, i) => (
                                <animated.span
                                    key={i}
                                    style={{
                                        ...styles.speck,
                                        opacity: speckBurst.t.to((t) => 1 - t),
                                        transform: speckBurst.t.to(
                                            (t) =>
                                                `translate(${s.px * t}px, ${s.py * t}px)`,
                                        ),
                                    }}
                                />
                            ))}
                        </animated.div>
                        <animated.span
                            style={{
                                ...styles.stampLabel,
                                opacity: stampLabel.opacity,
                                transform: stampLabel.x.to((x) => `translateX(${x}px)`),
                            }}
                        >
                            {stamp.label}
                        </animated.span>
                    </div>
                )}

                {/* ações */}
                <animated.div
                    style={{
                        ...styles.actions,
                        opacity: actionsSpring.opacity,
                        transform: actionsSpring.y.to((y) => `translateY(${y}px)`),
                    }}
                >
                    <button type="button" style={styles.cta} onClick={onContinue}>
                        ✦&nbsp;&nbsp;{continueLabel}&nbsp;&nbsp;✦
                    </button>
                    {onViewAll && (
                        <button type="button" style={styles.link} onClick={onViewAll}>
                            {viewAllLabel}
                        </button>
                    )}
                </animated.div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Estilos                                                              */
/* ------------------------------------------------------------------ */
const styles: Record<string, CSSProperties> = {
    screen: {
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        background:
            'radial-gradient(130% 95% at 50% 20%, #1a1310 0%, #100a08 55%, #070504 100%)',
        overflow: 'hidden',
    },
    stage: {
        position: 'relative',
        width: '100%',
        maxWidth: 420,
        minHeight: 660,
    },
    emberLayer: { position: 'absolute', inset: 0, pointerEvents: 'none' },
    header: {
        position: 'absolute',
        top: 28,
        width: '100%',
        textAlign: 'center',
        color: '#c9a45c',
        fontFamily: "'Cinzel', serif",
        fontSize: 13,
        letterSpacing: 6,
        zIndex: 5,
    },
    medalPerspective: {
        position: 'absolute',
        left: '50%',
        top: MEDAL_CENTER_Y,
        width: MEDAL_SIZE,
        height: MEDAL_SIZE,
        marginLeft: -MEDAL_SIZE / 2,
        marginTop: -MEDAL_SIZE / 2,
        perspective: 700,
        filter: 'drop-shadow(0 0 20px rgba(233,196,106,.4))',
    },
    medalFlip: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '50%',
    },
    medalImg: {
        width: '100%',
        height: '100%',
        display: 'block',
        objectFit: 'contain',
        userSelect: 'none',
    },
    shine: {
        position: 'absolute',
        top: 0,
        width: '55%',
        height: '100%',
        background:
            'linear-gradient(105deg, transparent, rgba(255,240,200,.55), transparent)',
        transform: 'skewX(-16deg)',
        pointerEvents: 'none',
    },
    eyebrow: {
        position: 'absolute',
        top: RIBBON_TOP - 24,
        width: '100%',
        margin: 0,
        textAlign: 'center',
        color: '#a08050',
        fontFamily: "'Cinzel', serif",
        fontSize: 10,
        letterSpacing: 4,
    },
    ribbon: {
        position: 'absolute',
        top: RIBBON_TOP,
        left: '50%',
        width: RIBBON_W,
        height: RIBBON_H,
        marginLeft: -RIBBON_W / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(#8a2436, #5e1622)',
        boxShadow:
            'inset 0 1px 0 rgba(233,196,106,.55), inset 0 -1px 0 rgba(233,196,106,.35), 0 4px 14px rgba(0,0,0,.5)',
        clipPath:
            'polygon(0% 0%, 100% 0%, calc(100% - 14px) 50%, 100% 100%, 0% 100%, 14px 50%)',
    },
    title: {
        color: '#F0E6C8',
        fontFamily: "'Cinzel', serif",
        fontWeight: 600,
        fontSize: 23,
        letterSpacing: 2,
        whiteSpace: 'nowrap',
    },
    subtitle: {
        position: 'absolute',
        top: RIBBON_TOP + RIBBON_H + 18,
        width: '100%',
        margin: 0,
        padding: '0 36px',
        boxSizing: 'border-box',
        textAlign: 'center',
        color: '#b9a77e',
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        fontSize: 17,
    },
    sealRow: {
        position: 'absolute',
        top: RIBBON_TOP + RIBBON_H + 62,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    seal: {
        position: 'relative',
        width: 48,
        height: 48,
        borderRadius: '46% 54% 52% 48% / 52% 46% 54% 48%',
        background:
            'radial-gradient(circle at 35% 30%, #a03248, #6e1626 60%, #4a0e19)',
        boxShadow:
            'inset 0 2px 4px rgba(255,255,255,.15), inset 0 -3px 5px rgba(0,0,0,.45), 0 3px 10px rgba(0,0,0,.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sealInitial: {
        color: '#e6c15c',
        fontFamily: "'Cinzel', serif",
        fontSize: 20,
        textShadow: '0 1px 2px rgba(0,0,0,.6)',
    },
    speck: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 3,
        height: 3,
        borderRadius: '50%',
        background: '#e9c46a',
        pointerEvents: 'none',
    },
    stampLabel: {
        color: '#d8c391',
        fontFamily: "'Cinzel', serif",
        fontSize: 14,
        letterSpacing: 1,
    },
    actions: {
        position: 'absolute',
        top: RIBBON_TOP + RIBBON_H + 130,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
    },
    cta: {
        fontFamily: "'Cinzel', serif",
        background: 'linear-gradient(#ecc966, #b8912f)',
        color: '#2a1f08',
        border: '1px solid #8a6a1c',
        borderRadius: 999,
        padding: '13px 44px',
        fontSize: 15,
        letterSpacing: 1,
        boxShadow: '0 0 20px rgba(233,196,106,.3)',
        cursor: 'pointer',
    },
    link: {
        background: 'none',
        border: 'none',
        color: '#c9a45c',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 15,
        textDecoration: 'underline',
        textUnderlineOffset: 4,
        cursor: 'pointer',
    },
};
