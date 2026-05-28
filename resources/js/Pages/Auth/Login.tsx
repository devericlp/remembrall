import { Button } from "@/components/ui/button";
import { useLang } from "@/hooks/useLang";
import { GlobalProps } from "@/types/global";
import { usePage } from "@inertiajs/react";
import { Sparkle, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import GuestLayout from '../../Layouts/GuestLayout';

const Login: React.FC & { layout?: (page: ReactNode) => ReactNode } = function Login() {

    const { appName } = usePage<GlobalProps>().props;

    const { __ } = useLang();

    const handleLogin = () => {
        window.location.href = "/auth/github/redirect";
    };

    return (
        <div className="min-h-screen flex flex-col justify-between items-center px-4 py-20">

            <div className="flex flex-col justify-center items-center space-y-2">
                <Sparkles className="text-[#B89B6A] animate-pulse size-8" />
                <h1 className="text-5xl font-bold text-center">{appName}</h1>
                <p className="semi-bold text-xl text-[#B89B6A]">{__("messages.your_tasks_your_magical_memories")}</p>

            </div>

            <div className="flex flex-col justify-center items-center space-y-4 w-full">
                <p className="text-2xl text-[#6D2E32] text-center">{__("messages.organize_your_tasks_and_save_your_magical_memories")}</p>
                <div className="flex space-x-4 mby-10">
                    <Sparkle className="animate-pulse" />
                    <Sparkle className="animate-pulse" />
                    <Sparkle className="animate-pulse" />
                </div>

                <Button className="bg-[#6D2E32] hover:bg-[#7C373C] cursor-pointer text-[#EFD5B3] font-bold text-lg w-full h-12" onClick={handleLogin}>
                    <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" className="fill-[#EFD5B3] size-6 mr-2">
                        <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
                    </svg>
                    {__("messages.continue_with_github")}
                </Button>
            </div>
        </div>
    );
}

Login.layout = (page: ReactNode) => <GuestLayout>{page}</GuestLayout>

export default Login;