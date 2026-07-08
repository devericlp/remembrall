

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh md:flex md:items-center md:justify-center md:bg-surface-secondary">
            <div className="relative w-full max-w-120 h-dvh overflow-hidden md:shadow-2xl">
                {children}
            </div>
        </div>
    );
}