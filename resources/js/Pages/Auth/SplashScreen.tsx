import DefaultLayout from '@/Layouts/DefaultLayout';
import { GlobalProps } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, type ReactNode } from 'react';

const TITLE = 'Remembrall';
const SPLASH_DURATION = 6000;
const VIDEO_PLAYBACK_RATE = 1.6;

const SplashScreen: React.FC & { layout?: (page: ReactNode) => ReactNode } = function SplashScreen() {
    const { auth } = usePage<GlobalProps>().props;
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.visit(auth?.user ? '/home' : '/login', { replace: true });
        }, SPLASH_DURATION);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.playbackRate = VIDEO_PLAYBACK_RATE;

        const handleLoadedMetadata = () => {
            video.playbackRate = VIDEO_PLAYBACK_RATE;
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }, []);

    return (
        <div className="relative h-dvh overflow-hidden bg-surface-base">
            <div className="splash-iris absolute inset-0 flex flex-col items-center justify-center bg-[#14151C]">
                <div className="splash-dim flex flex-col items-center gap-12">
                    <video
                        ref={videoRef}
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
                                style={{ animationDelay: `${0.85 + index * 0.055}s` }}
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
                    animation: splash-iris-close 0.9s cubic-bezier(0.65, 0, 0.35, 1) 5.1s forwards;
                }

                .splash-dim {
                    animation: splash-content-dim 0.72s ease-in 4.74s forwards;
                }

                .splash-letter {
                    opacity: 0;
                    filter: blur(8px);
                    transform: translateY(10px);
                    text-shadow: 0 0 24px rgba(184, 155, 106, 0.35);
                    animation: splash-letter-in 0.66s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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