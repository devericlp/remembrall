import { useCallback, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RemembrallOrbProps {
    state: string
    size?: number
    className?: string
}

// ─── Particle ─────────────────────────────────────────────────────────────────

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    rot: number
    rotSpeed: number
}

type RGB = [number, number, number]

const SMOKE_COLORS: Record<OrbState, RGB | null> = {
    clear: null,
    warning: [200, 200, 230],  // branco-azulado
    danger: [255, 20, 20],   // vermelho vivo e intenso
}

// Quantidade de partículas por estado — danger usa muito mais para densidade
const PARTICLE_COUNT: Record<OrbState, number> = {
    clear: 0,
    warning: 28,
    danger: 55,
}

// Opacidade máxima de cada partícula por estado
const PARTICLE_OPACITY: Record<OrbState, number> = {
    clear: 0,
    warning: 0.50,
    danger: 0.90,
}

// Tamanho das partículas por estado
const PARTICLE_SIZE: Record<OrbState, { min: number; range: number }> = {
    clear: { min: 0, range: 0 },
    warning: { min: 16, range: 20 },
    danger: { min: 20, range: 24 },
}

function createParticle(cw: number, ch: number, state: OrbState): Particle {
    const angle = Math.random() * Math.PI * 2
    const spread = state === 'danger' ? 12 : 18
    const r = Math.random() * spread
    const { min, range } = PARTICLE_SIZE[state]
    const ml = (state === 'danger' ? 80 : 130) + Math.random() * 80

    return {
        x: cw / 2 + Math.cos(angle) * r,
        y: ch / 2 + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.55,
        vy: -(Math.random() * (state === 'danger' ? 0.65 : 0.9) + 0.15),
        life: Math.floor(Math.random() * ml),
        maxLife: ml,
        size: min + Math.random() * range,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
    }
}

function updateParticle(p: Particle, cw: number, ch: number, state: OrbState): void {
    p.x += p.vx
    p.y += p.vy
    p.vx += (Math.random() - 0.5) * 0.05
    p.rot += p.rotSpeed
    p.life++
    if (p.life > p.maxLife) {
        Object.assign(p, createParticle(cw, ch, state))
    }
}

function drawParticle(
    ctx: CanvasRenderingContext2D,
    p: Particle,
    color: RGB,
    maxOpacity: number,
): void {
    const progress = p.life / p.maxLife
    const opacity =
        progress < 0.2
            ? (progress / 0.2) * maxOpacity
            : progress > 0.72
                ? ((1 - progress) / 0.28) * maxOpacity
                : maxOpacity

    const [r, g, b] = color
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.globalAlpha = opacity

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
    grad.addColorStop(0, `rgb(${r},${g},${b})`)
    grad.addColorStop(0.4, `rgba(${r},${g},${b},0.6)`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(0, 0, p.size, p.size * 0.76, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
}


function drawDangerGlowBase(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    orbRadius: number,
    color: RGB,
): void {
    const [r, g, b] = color
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbRadius)
    grad.addColorStop(0, `rgba(${r},${g},${b},0.38)`)
    grad.addColorStop(0.5, `rgba(${r},${g},${b},0.18)`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, cx * 2, cy * 2 + orbRadius)
}

const ORB_IMAGES: Record<OrbState, string> = {
    clear: '/images/orb-clear.png',
    warning: '/images/orb-warning.png',
    danger: '/images/orb-danger.png',
}

export function RemembrallOrb({
    state,
    size = 160,
    className = '',
}: RemembrallOrbProps) {
    const orbImageSrc = ORB_IMAGES[state]
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rafRef = useRef<number>(0)
    const particles = useRef<Particle[]>([])
    const stateRef = useRef<OrbState>(state)

    // Mantém stateRef sempre atualizado sem reiniciar o loop
    useEffect(() => {
        stateRef.current = state
    }, [state])

    const initParticles = useCallback((s: OrbState) => {
        const count = PARTICLE_COUNT[s]
        particles.current = Array.from({ length: count }, () =>
            createParticle(size, size, s)
        )
    }, [size])

    // Reinicia partículas quando o estado muda
    useEffect(() => {
        initParticles(state)
    }, [state, initParticles])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const orbRadius = size * 0.46
        const cx = size / 2
        const cy = size / 2 - size * 0.03

        function loop() {
            ctx!.clearRect(0, 0, size, size)

            const currentState = stateRef.current
            const color = SMOKE_COLORS[currentState]

            if (color) {
                ctx!.save()
                ctx!.beginPath()
                ctx!.arc(cx, cy, orbRadius, 0, Math.PI * 2)
                ctx!.clip()

                // Glow de base só no danger
                if (currentState === 'danger') {
                    drawDangerGlowBase(ctx!, cx, cy, orbRadius, color)
                }

                const maxOp = PARTICLE_OPACITY[currentState]
                particles.current.forEach(p => {
                    updateParticle(p, size, size, currentState)
                    drawParticle(ctx!, p, color, maxOp)
                })

                ctx!.restore()
            }

            rafRef.current = requestAnimationFrame(loop)
        }

        rafRef.current = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(rafRef.current)
    }, [size])

    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width: size,
                height: size,
                flexShrink: 0,
            }}
        >
            {/* Imagem base da esfera — fundo preto some via mix-blend-mode: screen */}
            <img
                src={orbImageSrc}
                alt="Remembrall"
                draggable={false}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 1,
                    userSelect: 'none',
                }}
            />

            {/* Canvas da fumaça — sobreposto com screen blend */}
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    mixBlendMode: 'screen',  // fundo preto da imagem some, só a fumaça aparece
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }}
            />
        </div>
    )
}

// ─── Hook auxiliar ────────────────────────────────────────────────────────────

/**
 * Deriva o estado da esfera a partir dos dados de tarefas.
 *
 * @example
 * const orbState = useOrbState({ overdueCount: 3, upcomingCount: 2 })
 * // → 'danger'
 */
export function useOrbState({
    overdueCount,
    upcomingCount,
}: {
    overdueCount: number
    upcomingCount: number
}): OrbState {
    if (overdueCount > 0) return 'danger'
    if (upcomingCount > 0) return 'warning'
    return 'clear'
}