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
        <main className="min-h-dvh md:flex md:justify-center md:bg-surface-secondary">
            <div className="relative z-10 min-h-dvh w-full md:max-w-120 md:bg-background md:shadow-2xl">
                {children}
                <BottomNavigator />
            </div>
            <Toaster />
        </main>
    );
}