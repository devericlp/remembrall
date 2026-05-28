import BottomNavigator from '@/components/layout/BottomNavigator';
import { Toaster } from "@/components/ui/sonner";
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function AppLayout({ children }: { children: ReactNode }) {

    const { flash } = usePage<{ flash: { message: string; type: 'success' | 'error' | 'info' } }>().props;

    useEffect(() => {
        if (!flash?.message) return;

        switch (flash.type) {
            case 'success':
                toast.success(flash.message);
                break;
            case 'error':
                toast.error(flash.message);
                break;
            default:
                toast.info(flash.message);
        }
    }, [flash]);

    return (
        <main className="min-h-screen relative">
            <div className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg-default.png')" }}>
                <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]" />
            </div>
            <div className="relative z-10">
                {children}
                <BottomNavigator />
            </div>
            <Toaster />
        </main>
    );
}