import DefaultLayout from '@/Layouts/DefaultLayout';
import { GlobalProps } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';

const TITLE = 'Remembrall';
const SPLASH_DURATION = 10000;

const SplashScreen: React.FC & { layout?: (page: ReactNode) => ReactNode } = function SplashScreen() {
    const { auth } = usePage<GlobalProps>().props;

    useEffect(() => {
        if (auth?.user) {
            router.visit('/home');
            return;
        }

        const timer = setTimeout(() => router.visit('/login'), SPLASH_DURATION);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative h-dvh overflow-hidden bg-surface-base">
            <div className="splash-iris absolute inset-0 flex flex-col items-center justify-center bg-[#14151C]">
                <div className="splash-dim flex flex-col items-center gap-12">
                    <video
                        src="/videos/orb_video.mp4"
                        autoPlay
                        muted
                        playsInline
                        className="w-64 object-contain"
                    />
                    <h1
                        className="flex text-4xl font-semibold tracking-[0.18em] text-[#B89B6A]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {[...TITLE].map((letter, index) => (
                            <span
                                key={index}
                                className="splash-letter"
                                style={{ animationDelay: `${1.4 + index * 0.09}s` }}
                            >
                                {letter}
                            </span>
                        ))}
                    </h1>
                </div>
            </div>

            <style>{`
                .splash-iris {
                    clip-path: circle(141% at 50% 50%);
                    animation: splash-iris-close 1.5s cubic-bezier(0.65, 0, 0.35, 1) 8.5s forwards;
                }

                .splash-dim {
                    animation: splash-content-dim 1.2s ease-in 7.9s forwards;
                }

                .splash-letter {
                    opacity: 0;
                    filter: blur(8px);
                    transform: translateY(10px);
                    text-shadow: 0 0 24px rgba(184, 155, 106, 0.35);
                    animation: splash-letter-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }

                @keyframes splash-letter-in {
                    to {
                        opacity: 1;
                        filter: blur(0);
                        transform: translateY(0);
                    }
                }

                @keyframes splash-content-dim {
                    to {
                        opacity: 0.15;
                        transform: scale(0.96);
                    }
                }

                @keyframes splash-iris-close {
                    to {
                        clip-path: circle(0% at 50% 50%);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .splash-letter {
                        animation-duration: 0.01s;
                        animation-delay: 0s;
                    }

                    .splash-dim {
                        animation: none;
                    }

                    .splash-iris {
                        animation-duration: 0.3s;
                    }
                }
            `}</style>
        </div>
    );
};

SplashScreen.layout = (page: ReactNode) => <DefaultLayout>{page}</DefaultLayout>;

export default SplashScreen;