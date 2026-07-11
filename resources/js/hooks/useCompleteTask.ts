import { NewAchievement } from "@/types/global";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLang } from "./useLang";

export function useCompleteTask() {
    const { __ } = useLang();
    const [completedSheetOpen, setCompletedSheetOpen] = useState(false);
    const [newAchievement, setNewAchievement] = useState<NewAchievement | null>(null);

    function completeTask(id: number, callbacks?: { onError?: () => void }) {
        router.put(`/tasks/${id}/complete`, {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                const achievements = page.flash?.newAchievements;
                if (achievements?.length) {
                    setNewAchievement(achievements[0]);
                    setCompletedSheetOpen(true);
                }
            },
            onError: callbacks?.onError ?? (() => toast.error(__('messages.oops_something_went_wrong_please_try_again'))),
        });
    }

    return {
        completedSheetOpen,
        newAchievement,
        completeTask,
        closeSheet: () => setCompletedSheetOpen(false),
    };
}
