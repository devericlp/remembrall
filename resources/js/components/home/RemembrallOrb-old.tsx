import { motion } from 'framer-motion';

export default function RemembrallOrbOld({ status = "clear", size = "lg" }) {
    const sizeMap = { xs: 24, sm: 40, md: 100, lg: 160 };
    const s = sizeMap[size] || 160;

    const smokeColors = {
        clear: { inner: 'rgba(255,255,255,0.15)', outer: 'rgba(200,180,150,0.1)' },
        warning: { inner: 'rgba(255,255,255,0.7)', outer: 'rgba(255,255,255,0.4)' },
        danger: {
            inner: 'rgba(160,10,10,0.9)',
            mid: 'rgba(30,5,5,0.85)',
            outer: 'rgba(80,0,0,0.8)',
            dark: 'rgba(10,0,0,0.95)'
        }
    };

    const glowClass = {
        clear: 'orb-glow',
        warning: 'orb-glow-warning',
        danger: 'orb-glow-danger'
    };

    const colors = smokeColors[status];
    const orbBorder = status === 'danger' ? 'border-red-900/70' : 'border-amber-700/30';

    return (
        <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
            {/* Pulse ring for danger */}
            {status === 'danger' && (
                <div
                    className="absolute rounded-full border-2 border-red-500/40 pulse-ring-anim"
                    style={{ width: s * 1.2, height: s * 1.2 }}
                />
            )}

            {/* Glass orb */}
            <div
                className={`relative rounded-full ${orbBorder} border-2 overflow-hidden ${glowClass[status]}`}
                style={{
                    width: s,
                    height: s,
                    background: status === 'danger'
                        ? `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.15), transparent 40%),
               radial-gradient(ellipse at 60% 60%, rgba(10,0,0,0.7), transparent 70%),
               linear-gradient(135deg, rgba(60,5,5,0.6), rgba(10,0,0,0.85))`
                        : `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4), transparent 60%),
               radial-gradient(ellipse at 70% 70%, rgba(139,100,70,0.15), transparent 50%),
               linear-gradient(135deg, rgba(244,232,193,0.6), rgba(200,180,150,0.4))`
                }}
            >
                {status === 'danger' ? (
                    /* ── DANGER: dense dark red-black smoke ── */
                    <>
                        {/* Dark base fill */}
                        <div className="absolute inset-0" style={{
                            background: 'radial-gradient(ellipse at 50% 60%, rgba(15,0,0,0.95), rgba(5,0,0,0.7) 70%)'
                        }} />

                        {/* Smoke blob 1 — slow heavy roll */}
                        <motion.div className="absolute" style={{
                            width: s * 0.7, height: s * 0.7,
                            bottom: '-10%', left: '-10%',
                            borderRadius: '50% 60% 50% 40%',
                            background: 'radial-gradient(circle, rgba(120,5,5,0.9) 0%, rgba(20,0,0,0.95) 60%, transparent 100%)',
                            filter: `blur(${s * 0.09}px)`
                        }}
                            animate={{ x: [0, 8, -6, 4, 0], y: [0, -10, -5, -12, 0], rotate: [0, 15, -10, 8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Smoke blob 2 — dark nucleus */}
                        <motion.div className="absolute" style={{
                            width: s * 0.55, height: s * 0.55,
                            top: '10%', right: '-5%',
                            borderRadius: '40% 60% 55% 45%',
                            background: 'radial-gradient(circle, rgba(5,0,0,0.98) 0%, rgba(80,5,5,0.8) 50%, transparent 100%)',
                            filter: `blur(${s * 0.07}px)`
                        }}
                            animate={{ x: [0, -7, 5, -3, 0], y: [0, 8, 14, 6, 0], rotate: [0, -12, 8, -6, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                        />

                        {/* Smoke blob 3 — mid wisp */}
                        <motion.div className="absolute" style={{
                            width: s * 0.45, height: s * 0.5,
                            top: '25%', left: '20%',
                            borderRadius: '55% 45% 60% 40%',
                            background: 'radial-gradient(ellipse, rgba(180,10,10,0.6) 0%, rgba(10,0,0,0.9) 55%, transparent 100%)',
                            filter: `blur(${s * 0.1}px)`
                        }}
                            animate={{ x: [0, 6, -8, 3, 0], y: [0, -6, 4, -9, 0], scale: [1, 1.1, 0.95, 1.05, 1] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                        />

                        {/* Smoke blob 4 — ember glow */}
                        <motion.div className="absolute" style={{
                            width: s * 0.4, height: s * 0.4,
                            bottom: '20%', right: '15%',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(200,20,20,0.5) 0%, rgba(80,0,0,0.7) 40%, transparent 100%)',
                            filter: `blur(${s * 0.12}px)`
                        }}
                            animate={{ scale: [1, 1.3, 0.9, 1.2, 1], opacity: [0.7, 1, 0.6, 0.9, 0.7] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        />

                        {/* Thin rising wisp */}
                        <motion.div className="absolute" style={{
                            width: s * 0.15, height: s * 0.6,
                            bottom: '5%', left: '42%',
                            borderRadius: '50% 50% 30% 30%',
                            background: 'linear-gradient(to top, rgba(150,5,5,0.5), rgba(5,0,0,0.8) 40%, transparent)',
                            filter: `blur(${s * 0.06}px)`
                        }}
                            animate={{ x: [0, 4, -3, 5, 0], scaleY: [1, 1.1, 0.95, 1.05, 1] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                        />
                    </>
                ) : (
                    /* ── CLEAR / WARNING: magical milky white swirling smoke ── */
                    <>
                        {/* Soft ambient base glow */}
                        <div className="absolute inset-0" style={{
                            background: status === 'warning'
                                ? 'radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.25), transparent 75%)'
                                : 'radial-gradient(ellipse at 50% 55%, rgba(255,248,220,0.12), transparent 80%)'
                        }} />

                        {/* Large slow spiral cloud */}
                        <motion.div className="absolute" style={{
                            width: s * 0.75, height: s * 0.75,
                            top: '10%', left: '5%',
                            borderRadius: '60% 40% 55% 45%',
                            background: `radial-gradient(ellipse at 40% 50%, ${status === 'warning' ? 'rgba(255,255,255,0.75)' : 'rgba(255,252,230,0.25)'} 0%, transparent 70%)`,
                            filter: `blur(${s * 0.1}px)`
                        }}
                            animate={{ rotate: [0, 12, -8, 15, 0], x: [0, 6, -4, 3, 0], y: [0, -5, 8, -3, 0], scale: [1, 1.08, 0.96, 1.04, 1] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Medium wisp — bottom right, rising */}
                        <motion.div className="absolute" style={{
                            width: s * 0.55, height: s * 0.6,
                            bottom: '5%', right: '5%',
                            borderRadius: '45% 55% 40% 60%',
                            background: `radial-gradient(ellipse at 55% 45%, ${status === 'warning' ? 'rgba(255,255,255,0.65)' : 'rgba(240,235,210,0.2)'} 0%, transparent 70%)`,
                            filter: `blur(${s * 0.09}px)`
                        }}
                            animate={{ rotate: [0, -10, 6, -12, 0], x: [0, -5, 7, -2, 0], y: [0, -8, 3, -6, 0], scale: [1, 1.1, 0.92, 1.06, 1] }}
                            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        />

                        {/* Thin ethereal veil — center swirl */}
                        <motion.div className="absolute" style={{
                            width: s * 0.5, height: s * 0.45,
                            top: '30%', left: '25%',
                            borderRadius: '50% 60% 45% 55%',
                            background: `radial-gradient(ellipse at 50% 50%, ${status === 'warning' ? 'rgba(255,255,255,0.5)' : 'rgba(255,250,220,0.18)'} 0%, transparent 65%)`,
                            filter: `blur(${s * 0.07}px)`
                        }}
                            animate={{ rotate: [0, 20, -15, 18, 0], scale: [1, 1.15, 0.88, 1.1, 1], opacity: [0.7, 1, 0.6, 0.9, 0.7] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        />

                        {/* Small delicate wisp — top right */}
                        <motion.div className="absolute" style={{
                            width: s * 0.35, height: s * 0.4,
                            top: '8%', right: '10%',
                            borderRadius: '55% 45% 60% 40%',
                            background: `radial-gradient(ellipse at 45% 55%, ${status === 'warning' ? 'rgba(255,255,255,0.55)' : 'rgba(255,248,215,0.2)'} 0%, transparent 70%)`,
                            filter: `blur(${s * 0.08}px)`
                        }}
                            animate={{ x: [0, 4, -6, 2, 0], y: [0, 7, -4, 9, 0], rotate: [0, -8, 12, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        />

                        {/* Rising column wisp */}
                        <motion.div className="absolute" style={{
                            width: s * 0.2, height: s * 0.65,
                            bottom: '0%', left: '38%',
                            borderRadius: '50% 50% 30% 30%',
                            background: `linear-gradient(to top, ${status === 'warning' ? 'rgba(255,255,255,0.5)' : 'rgba(255,250,220,0.15)'}, transparent 100%)`,
                            filter: `blur(${s * 0.07}px)`
                        }}
                            animate={{ x: [0, 5, -4, 6, 0], scaleX: [1, 1.2, 0.85, 1.1, 1], opacity: [0.6, 0.9, 0.5, 0.8, 0.6] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                        />

                        {/* Volumetric light beam */}
                        <motion.div className="absolute" style={{
                            width: s * 0.6, height: s * 0.6,
                            top: '-10%', left: '20%',
                            borderRadius: '50%',
                            background: status === 'warning'
                                ? 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 65%)'
                                : 'radial-gradient(ellipse at 50% 30%, rgba(255,252,230,0.1) 0%, transparent 65%)',
                            filter: `blur(${s * 0.06}px)`
                        }}
                            animate={{ opacity: [0.5, 0.9, 0.4, 0.8, 0.5], scale: [1, 1.05, 0.97, 1.03, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                        />
                    </>
                )}

                {/* Glass highlight — always on top */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        width: s * 0.25,
                        height: s * 0.15,
                        top: '12%',
                        left: '20%',
                        borderRadius: '50%',
                        background: status === 'danger' ? 'rgba(255,200,200,0.25)' : 'rgba(255,255,255,0.5)',
                        filter: `blur(${s * 0.03}px)`,
                        transform: 'rotate(-25deg)'
                    }}
                />
            </div>

            {/* Sparkles */}
            {(status === 'warning' || status === 'danger') && (
                <>
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute sparkle-anim"
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                background: status === 'danger' ? '#ef4444' : '#fff',
                                top: `${15 + Math.random() * 70}%`,
                                left: `${15 + Math.random() * 70}%`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
}