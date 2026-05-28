import type { ReactNode } from "react";

export default function GuestLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/bg-login.png')" }}>
            {children}
        </main>
    );
}