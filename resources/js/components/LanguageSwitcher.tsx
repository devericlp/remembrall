import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useLang } from "@/hooks/useLang";
import { GlobalProps } from "@/types/global";
import { router, usePage } from "@inertiajs/react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className }: { className?: string }) {
    const { __ } = useLang();
    const { currentLanguage } = usePage<GlobalProps>().props;

    const languages = [
        { key: "en", title: __("messages.english") },
        { key: "pt_BR", title: __("messages.portuguese") },
    ];

    function updateLanguage(language: string) {
        router.put("/language/update", { language }, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["translations"] }),
        });
    }

    return (
        <Select value={currentLanguage} onValueChange={updateLanguage}>
            <SelectTrigger
                className={`w-9 h-9 p-0 justify-center border-0 shadow-none bg-transparent hover:bg-nav-icon/10 rounded-full transition-colors focus-visible:ring-0 focus-visible:border-transparent [&>svg:last-child]:hidden ${className ?? ""}`}
            >
                <Globe className="nav-icon size-4" />
            </SelectTrigger>
            <SelectContent position="popper" align="end" sideOffset={8}>
                {languages.map((lang) => (
                    <SelectItem key={lang.key} value={lang.key}>
                        {lang.title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
