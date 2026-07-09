import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/hooks/useLang";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

const ForgotPassword: React.FC & { layout?: (page: ReactNode) => ReactNode } = function ForgotPassword() {
    const { __ } = useLang();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/forgot-password", {
            onSuccess: () => {
                toast.success(__("messages.reset_link_sent"));
                reset();
            },
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
                <h1 className="text-xl font-bold text-page-header">{__("messages.forgot_your_password")}</h1>
                <p className="text-sm text-hint-foreground mt-2 px-8">{__("messages.forgot_password_subtitle")}</p>
            </div>

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

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full h-auto py-2.5 gap-2 rounded-lg font-medium text-sm mt-1"
                >
                    {__("messages.send_reset_link")}
                </Button>
            </form>

            <img src="/images/divider.png" alt="" className="w-32 mt-auto mb-8" />
        </div>
    );
};

ForgotPassword.layout = (page: ReactNode) => <AuthLayout background="">{page}</AuthLayout>;

export default ForgotPassword;
