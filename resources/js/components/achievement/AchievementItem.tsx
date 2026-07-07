import { formatDate } from "@/lib/utils";
import { Achievement } from "@/types/models/achievement";
import { Check, Lock } from "lucide-react";

type Props = {
    achievement: Achievement;
};

export default function AchievementItem({ achievement }: Props) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-gold-primary/12 hover:border-gold-primary/25 bg-[#060910] p-4 my-2 transition-colors">

            {/* Badge */}
            <img
                src={`/images/achievements/${achievement.slug}.png`}
                alt={achievement.title}
                className="shrink-0 size-14"
            />

            {/* Content */}
            <div className="flex flex-1 flex-col min-w-0 gap-1">
                <span className="font-heading font-semibold text-lg text-foreground leading-snug truncate">
                    {achievement.title}
                </span>
                {achievement.description && (
                    <span className="text-sm text-muted-foreground leading-snug line-clamp-1">
                        {achievement.description}
                    </span>
                )}
                {achievement.is_earned && achievement.earned_at && (
                    <span className="text-[11px] text-gold-primary">
                        {formatDate(achievement.earned_at, "d/m/Y")}
                    </span>
                )}
            </div>

            {/* Right: lock or check */}
            <div className="shrink-0 flex flex-col items-center justify-center gap-1">
                {achievement.is_earned ? (
                    <div className="size-8 rounded-full bg-gold-primary flex items-center justify-center">
                        <Check className="size-4 text-background" strokeWidth={2.5} />
                    </div>
                ) : (
                    <>
                        <div className="size-8 rounded-full bg-gold-primary/8 border border-gold-primary/20 flex items-center justify-center">
                            <Lock className="size-4 text-gold-dark" />
                        </div>
                        <span className="text-xs whitespace-nowrap mt-1">
                            <span className="text-gold-primary">{achievement.progress}</span>
                            <span className="text-muted-foreground">/{achievement.condition.total}</span>
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
