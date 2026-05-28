import DefaultLayout from '@/Layouts/DefaultLayout';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const steps = [15, 35, 55, 75, 90, 100];
        let i = 0;

        const interval = setInterval(() => {
            if (i < steps.length) {
                setProgress(steps[i++]);
            } else {
                clearInterval(interval);
                // Redireciona para o app quando terminar
                setTimeout(() => router.visit('/login'), 600);
            }
        }, 420);

        return () => clearInterval(interval);
    }, []);

    return (
        <DefaultLayout>
            <AnimatePresence>
                <motion.div
                    exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5 } }}
                    style={{
                        width: '100vw',
                        height: '100vh',
                        background: '#6D2E32',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <motion.img
                        src='/images/orb-clear.png'
                        alt="Remembrall"
                        style={{ width: 260, height: 260, objectFit: 'contain', mixBlendMode: 'lighten' }}
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: [20, 0, -8, 0, -8, 0] }}
                        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            margin: '8px 0 4px',
                            color: '#e8c4b0',
                            fontSize: 34,
                            fontWeight: 700,
                            fontFamily: 'Georgia, serif',
                            letterSpacing: '0.06em',
                            textShadow: `0 0 ${8 + progress * 0.2}px rgba(220,150,130,${0.3 + progress * 0.004})`,
                        }}
                    >
                        Remembrall
                    </motion.p>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.85 }}
                        style={{
                            margin: '0 0 28px',
                            color: 'rgba(232,196,176,0.55)',
                            fontSize: 13,
                            fontFamily: 'Georgia, serif',
                            fontStyle: 'italic',
                            letterSpacing: '0.08em',
                        }}
                    >
                        nunca mais esqueça
                    </motion.p>

                    {/* Barra de progresso */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        style={{
                            width: 180,
                            height: 6,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: 99,
                            overflow: 'hidden',
                            border: '0.5px solid rgba(255,200,180,0.18)',
                        }}
                    >
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: 'easeOut', duration: 0.45 }}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, rgba(200,120,100,0.8), rgba(255,200,160,1))',
                                borderRadius: 99,
                            }}
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </DefaultLayout>
    );
}