import { Head } from "@inertiajs/react";
import Guestlayout from '../Layouts/GuestLayout'
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { router } from "@inertiajs/react";

const SplashScreen = () => {

    const { appName } = usePage().props;

    useEffect(() => {
        const timer = setTimeout(() => {
            router.visit("/login", { viewTransition: true });
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Splash" />
            <div className="bg-red-500 flex items-center justify-center h-screen">
                <h1 className="font-bold text-3xl text-white">{appName}</h1>
            </div>
        </>
    )
}

SplashScreen.layout = Guestlayout

export default SplashScreen