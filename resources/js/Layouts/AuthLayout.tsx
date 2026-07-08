import { Toaster } from "@/components/ui/sonner";
import { GlobalProps } from "@/types/global";
import { usePage } from "@inertiajs/react";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

export default function AuthLayout({
    children,
    background = "/images/bg.png",
    centered = false,
    padded = true,
}: {
    children: ReactNode;
    background?: string;
    centered?: boolean;
    padded?: boolean;
}) {
    const { flash } = usePage<GlobalProps>().props;

    useEffect(() => {
        if (flash?.error) toast.error(flash.error);
    }, [flash?.error]);

    return (
        <div className="w-dvw h-dvh relative overflow-hidden md:flex md:items-center md:justify-center md:bg-surface-secondary">
            <div className="relative w-full max-w-120 h-dvh overflow-hidden md:shadow-2xl">
                {background && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${background}')` }}
                    />
                )}
                <main className={`relative z-10 w-full h-full flex flex-col ${
                    centered ? "items-center justify-center" : padded ? "px-5 pt-10" : ""
                }`}>
                    {children}
                </main>
                <Toaster />
            </div>
        </div>
    );
}
