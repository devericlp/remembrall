import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/hooks/useLang";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

const Register: React.FC & { layout?: (page: ReactNode) => ReactNode } = function Register() {
    const { __ } = useLang();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/register", {
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    };

    return (
        <div className="w-full flex flex-col items-center h-full relative">
            <Link
                href="/login"
                className="absolute left-0 top-0 flex items-center justify-center size-9 rounded-full hover:bg-nav-icon/10 transition-colors"
            >
                <ChevronLeft className="nav-icon" />
            </Link>

            <LanguageSwitcher className="absolute right-0 top-0" />

            <img src="/images/login_header.png" alt="Remembrall" className="w-40 shrink-0" />

            <div className="w-full text-center mt-6">
                <h1 className="text-xl font-bold text-page-header">{__("messages.create_your_account")}</h1>
                <p className="text-sm text-hint-foreground mt-2 px-8">{__("messages.start_your_journey_with_remembrall")}</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-6">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="name">{__("messages.name")}</Label>
                    <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="bg-surface-secondary border border-gold-primary/55 focus-visible:border-gold-primary/80 text-sm h-auto py-2 rounded-lg"
                    />
                    {errors.name && <span className="text-destructive text-xs">{errors.name}</span>}
                </div>

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
                            autoComplete="new-password"
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

                <div className="flex flex-col gap-1">
                    <Label htmlFor="confirm_password">{__("messages.confirm_password")}</Label>
                    <div className="relative">
                        <Input
                            id="confirm_password"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={data.confirm_password}
                            onChange={(e) => setData("confirm_password", e.target.value)}
                            className="bg-surface-secondary border border-gold-primary/55 focus-visible:border-gold-primary/80 text-sm h-auto py-2 pr-9 rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-hint-foreground hover:text-gold-primary transition-colors"
                            aria-label={showConfirmPassword ? __("messages.hide_password") : __("messages.show_password")}
                        >
                            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.confirm_password && <span className="text-destructive text-xs">{errors.confirm_password}</span>}
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full h-auto py-2.5 gap-2 rounded-lg font-medium text-sm mt-1"
                >
                    {__("messages.create_account")}
                </Button>
            </form>

            <img src="/images/divider.png" alt="" className="w-32 mt-auto mb-8" />
        </div>
    );
};

Register.layout = (page: ReactNode) => <AuthLayout background="">{page}</AuthLayout>;

export default Register;
