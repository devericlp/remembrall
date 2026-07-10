import PageHeader from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/hooks/useLang";
import AppLayout from "@/Layouts/AppLayout";
import { getInitials } from "@/lib/utils";
import { GlobalProps } from "@/types/global";
import { useForm, usePage } from "@inertiajs/react";
import { Camera, Eye, EyeOff } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

function EditProfile() {
    const { __ } = useLang();
    const { auth } = usePage<GlobalProps>().props;
    const user = auth.user;
    const isSocialAccount = Boolean(user.provider_id);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,
        new_password: "",
        confirm_new_password: "",
        _method: "put",
    });

    function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setData("avatar", file);
        setAvatarPreview(URL.createObjectURL(file));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post("/profile/update", {
            forceFormData: true,
            onSuccess: () => reset("new_password", "confirm_new_password"),
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    }

    return (
        <div className="px-4 pt-5 pb-24">
            <PageHeader title={__("messages.edit_profile")} backHref="/profile" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="avatar" className="relative cursor-pointer">
                        <Avatar className="size-20 ring-2 ring-gold-primary">
                            <AvatarImage src={avatarPreview ?? user.avatar ?? undefined} />
                            <AvatarFallback className="bg-background text-gold-primary/90 text-3xl font-heading">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="absolute -right-1 -bottom-1 flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                            <Camera className="size-3.5" />
                        </span>
                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleAvatarChange}
                        />
                    </label>
                    {errors.avatar && <span className="text-destructive text-xs">{errors.avatar}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="name">{__("messages.name")}</Label>
                    <Input
                        id="name"
                        type="text"
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
                        disabled={isSocialAccount}
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="bg-surface-secondary border border-gold-primary/55 focus-visible:border-gold-primary/80 text-sm h-auto py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    {errors.email && <span className="text-destructive text-xs">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-3 pt-3 border-t border-border">
                    <div>
                        <h2 className="text-sm font-semibold text-label-foreground">{__("messages.change_password")}</h2>
                        <p className="text-xs text-hint-foreground mt-0.5">{__("messages.change_password_subtitle")}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="new_password">{__("messages.new_password")}</Label>
                        <div className="relative">
                            <Input
                                id="new_password"
                                type={showNewPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={data.new_password}
                                onChange={(e) => setData("new_password", e.target.value)}
                                className="bg-surface-secondary border border-gold-primary/55 focus-visible:border-gold-primary/80 text-sm h-auto py-2 pr-9 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-hint-foreground hover:text-gold-primary transition-colors"
                                aria-label={showNewPassword ? __("messages.hide_password") : __("messages.show_password")}
                            >
                                {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        {errors.new_password && <span className="text-destructive text-xs">{errors.new_password}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="confirm_new_password">{__("messages.confirm_new_password")}</Label>
                        <div className="relative">
                            <Input
                                id="confirm_new_password"
                                type={showConfirmNewPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={data.confirm_new_password}
                                onChange={(e) => setData("confirm_new_password", e.target.value)}
                                className="bg-surface-secondary border border-gold-primary/55 focus-visible:border-gold-primary/80 text-sm h-auto py-2 pr-9 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-hint-foreground hover:text-gold-primary transition-colors"
                                aria-label={showConfirmNewPassword ? __("messages.hide_password") : __("messages.show_password")}
                            >
                                {showConfirmNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        {errors.confirm_new_password && (
                            <span className="text-destructive text-xs">{errors.confirm_new_password}</span>
                        )}
                    </div>
                </div>

                <Button type="submit" disabled={processing} className="w-full h-10 cursor-pointer mt-2">
                    {__("messages.save_changes")}
                </Button>
            </form>
        </div>
    );
}

EditProfile.layout = (page: ReactNode) => <AppLayout children={page} />;

export default EditProfile;
