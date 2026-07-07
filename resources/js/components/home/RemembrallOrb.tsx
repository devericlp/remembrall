import { useEffect, useRef, type CSSProperties } from "react";

export type OrbState = "clear" | "warning" | "danger";

export interface PlumeConfig {
    count: number;
    baseY: number;
    riseH: number;
    speed: number;
    spread: number;
    density: number;
    scale: number;
    maxOpacity: number;
}

export interface OrbLens {
    left: number;
    top: number;
    size: number;
}

export interface RemembrallOrbProps {
    state: OrbState;
    size?: number | string;
    lens?: Partial<OrbLens>;
    plume?: Partial<PlumeConfig>;
    glow?: boolean;
    className?: string;
    style?: CSSProperties;
}

type RGB = [number, number, number];

interface StateStyle {
    rgb: RGB;
    intensity: number;
    glow: string;
}

const STATE_STYLES: Record<OrbState, StateStyle> = {
    clear: { rgb: [220, 214, 198], intensity: 0, glow: "0,0,0" },
    warning: { rgb: [240, 234, 214], intensity: 1, glow: "238,231,210" },
    danger: { rgb: [221, 58, 46], intensity: 1, glow: "210,40,34" },
};

const DEFAULT_LENS: OrbLens = { left: 0.167, top: 0.073, size: 0.67 };
const DEFAULT_PLUME: PlumeConfig = {
    count: 24,
    baseY: 0.92,
    riseH: 0.5,
    speed: 0.9,
    spread: 0.26,
    density: 1.15,
    scale: 1.15,
    maxOpacity: 1,
};

interface Particle {
    offset: number;
    life: number;
    max: number;
    r0: number;
    seed: number;
}

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const rnd = (a: number, b: number): number => a + Math.random() * (b - a);

export default function RemembrallOrb({
    state,
    size = 320,
    lens,
    plume,
    glow = true,
    className,
    style,
}: RemembrallOrbProps) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const currentRef = useRef<{ intensity: number; rgb: RGB }>({
        intensity: 0,
        rgb: [220, 214, 198],
    });

    const cfg: PlumeConfig = { ...DEFAULT_PLUME, ...plume };
    const lensCfg: OrbLens = { ...DEFAULT_LENS, ...lens };

    const stateRef = useRef(state);
    stateRef.current = state;
    const cfgRef = useRef(cfg);
    cfgRef.current = cfg;

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const off = document.createElement("canvas");
        const octx = off.getContext("2d");
        if (!octx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let side = 0;

        const fit = () => {
            const w = wrap.clientWidth || 1;
            side = w;
            const px = Math.round(w * dpr);
            canvas.width = px;
            canvas.height = px;
            off.width = px;
            off.height = px;
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(wrap);

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        particlesRef.current = Array.from({ length: cfgRef.current.count }, () => ({
            offset: rnd(-cfgRef.current.spread, cfgRef.current.spread),
            life: Math.random(),
            max: rnd(2.4, 4.2),
            r0: rnd(0.1, 0.2),
            seed: rnd(0, Math.PI * 2),
        }));

        let last = performance.now();
        let animT = 0;

        const drawBlob = (
            g2d: CanvasRenderingContext2D,
            x: number,
            y: number,
            r: number,
            c: RGB,
            a: number,
        ) => {
            if (a <= 0.001 || r <= 0) return;
            const g = g2d.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${a})`);
            g.addColorStop(0.6, `rgba(${c[0]},${c[1]},${c[2]},${a * 0.45})`);
            g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
            g2d.fillStyle = g;
            g2d.beginPath();
            g2d.arc(x, y, r, 0, Math.PI * 2);
            g2d.fill();
        };

        const loop = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            if (!reduce) animT += dt;

            const target = STATE_STYLES[stateRef.current];
            const cur = currentRef.current;
            cur.intensity = lerp(cur.intensity, target.intensity, 0.06);
            cur.rgb = cur.rgb.map((v, i) => lerp(v, target.rgb[i], 0.06)) as RGB;

            const c = cfgRef.current;

            octx.setTransform(dpr, 0, 0, dpr, 0, 0);
            octx.clearRect(0, 0, side, side);
            octx.globalCompositeOperation = "source-over";
            for (const p of particlesRef.current) {
                if (!reduce) {
                    p.life += (dt * c.speed) / p.max;
                    if (p.life >= 1) {
                        p.life = 0;
                        p.offset = rnd(-c.spread, c.spread);
                        p.r0 = rnd(0.1, 0.2);
                        p.seed = rnd(0, Math.PI * 2);
                    }
                }
                const rise = p.life * c.riseH;
                const sway = Math.sin(animT * 0.8 + p.seed) * 0.05 * p.life;
                const x = (0.5 + p.offset + sway) * side;
                const y = (c.baseY - rise) * side;
                const r = (p.r0 + p.life * 0.22) * c.scale * side;
                const fade = Math.sin(p.life * Math.PI);
                drawBlob(octx, x, y, r, cur.rgb, 0.16 * c.density * fade * cur.intensity);
            }

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = c.maxOpacity;
            ctx.drawImage(off, 0, 0);
            ctx.globalAlpha = 1;

            const stable = Math.abs(cur.intensity - target.intensity) < 0.002;
            if (reduce && stable) {
                rafRef.current = 0;
                return;
            }
            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
    }, [state, cfg.count, cfg.spread]);

    const widthCss = typeof size === "number" ? `${size}px` : size;
    const gl = STATE_STYLES[state].glow;
    const filter =
        glow && state !== "clear"
            ? `drop-shadow(0 0 38px rgba(${gl},0.5)) drop-shadow(0 0 12px rgba(${gl},0.38))`
            : "none";

    const maskImg =
        "radial-gradient(circle at 50% 50%, #000 55%, rgba(0,0,0,0.55) 70%, transparent 82%)";

    return (
        <div
            className={className}
            style={{
                position: "relative",
                width: widthCss,
                filter,
                transition: "filter .5s ease",
                ...style,
            }}
        >
            <img
                src="/images/orb-clear.png"
                alt=""
                draggable={false}
                style={{
                    width: "100%",
                    display: "block",
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            />
            <div
                ref={wrapRef}
                style={{
                    position: "absolute",
                    left: `${lensCfg.left * 100}%`,
                    top: `${lensCfg.top * 100}%`,
                    width: `${lensCfg.size * 100}%`,
                    aspectRatio: "1 / 1",
                    pointerEvents: "none",
                    WebkitMaskImage: maskImg,
                    maskImage: maskImg,
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        mixBlendMode: "screen",
                    }}
                />
            </div>
        </div>
    );
}
