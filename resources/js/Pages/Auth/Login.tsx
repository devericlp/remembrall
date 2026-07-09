import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/hooks/useLang";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

const Login: React.FC & { layout?: (page: ReactNode) => ReactNode } = function Login() {
    const { __ } = useLang();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleProviderLogin = (provider: "github" | "google") => {
        if (loading) return;
        setLoading(true);
        window.location.href = `/auth/${provider}/redirect`;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/login", {
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    };

    return (
        <div className="w-full flex flex-col items-center h-full relative">
            <LanguageSwitcher className="absolute right-0 top-0" />

            <img src="/images/login_header.png" alt="Remembrall" className="w-40 shrink-0" />

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-6">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="email">{__("messages.email")}</Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="bg-surface-secondary border border-gold-primary/55 focus-visible:border-gold-primary/80 text-sm h-auto py-2 rounded-lg"
                    />
                    {errors.email && <span className="text-destructive text-xs">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="password">{__("messages.password")}</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="bg-surface-secondary border border-gold-primary/55 focus-visible:border-gold-primary/80 text-sm h-auto py-2 pr-9 rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-hint-foreground hover:text-gold-primary transition-colors"
                            aria-label={showPassword ? __("messages.hide_password") : __("messages.show_password")}
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.password && <span className="text-destructive text-xs">{errors.password}</span>}
                </div>

                <Link
                    href="/forgot-password"
                    className="self-end text-xs text-primary hover:text-accent transition-colors -mt-1"
                >
                    {__("messages.forgot_password")}
                </Link>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full h-auto py-2.5 gap-2 rounded-lg font-medium text-sm"
                >
                    {__("messages.login")}
                </Button>
            </form>

            <div className="flex items-center gap-3 w-full mt-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-hint-foreground uppercase">{__("messages.or")}</span>
                <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
                <Button
                    className="bg-surface-secondary hover:bg-surface-tertiary border border-gold-primary/55 hover:border-gold-primary/80 text-gold-primary cursor-pointer font-medium text-xs w-full h-auto py-2 gap-2 rounded-lg transition-colors"
                    onClick={() => handleProviderLogin("github")}
                    disabled={loading}
                >
                    <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" className="fill-gold-primary size-4 shrink-0">
                        <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
                    </svg>
                    GitHub
                </Button>

                <Button
                    className="bg-surface-secondary hover:bg-surface-tertiary border border-gold-primary/55 hover:border-gold-primary/80 text-gold-primary cursor-pointer font-medium text-xs w-full h-auto py-2 gap-2 rounded-lg transition-colors"
                    onClick={() => handleProviderLogin("google")}
                    disabled={loading}
                >
                    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    Google
                </Button>
            </div>

            <p className="text-sm text-hint-foreground text-center mt-7">
                {__("messages.dont_have_an_account")}{" "}
                <Link href="/register" viewTransition className="text-primary hover:text-accent font-medium transition-colors">
                    {__("messages.create_one")}
                </Link>
            </p>

            <Link
                href="/onboarding"
                viewTransition
                className="flex mt-7 items-center gap-1 text-primary hover:text-accent text-sm font-normal transition-colors"
            >
                {__("messages.how_the_orb_works")}
                <ChevronRight className="size-4" />
            </Link>

            <img src="/images/divider.png" alt="" className="w-32 mt-auto mb-8" />
        </div>
    );
};

Login.layout = (page: ReactNode) => <AuthLayout background="">{page}</AuthLayout>;

export default Login;
