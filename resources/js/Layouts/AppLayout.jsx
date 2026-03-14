export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <a href="/">
                    <h1 className="text-3xl font-bold text-gray-900">Remembrall</h1>
                </a>
            </div>
            {children}
        </div>
    );
}