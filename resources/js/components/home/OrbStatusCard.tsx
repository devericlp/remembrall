import { useLang } from "@/hooks/useLang";
import { RemembrallOrb } from "./RemembrallOrb";


interface OrbStatusCardProps {
    overdueCount: number;
    dueSoonCount: number;
    totalPending: number;
}

export default function OrbStatusCard({ overdueCount, dueSoonCount, totalPending }: OrbStatusCardProps) {
    const { __ } = useLang();
    let status = 'clear';
    let message = '✨ ' + __('messages.everything_in_order_no_tasks_pending');
    let submessage = __('messages.your_orb_is_tranquil');

    if (overdueCount > 0) {
        status = 'danger';
        message = `⚠️ ${overdueCount} ${__('messages.task')}${overdueCount > 1 ? 's' : ''} ${__('messages.overdue')}${overdueCount > 1 ? 's' : ''}!`;
        submessage = __('messages.red_smoke_indicates_forgotten_reminders');
    } else if (dueSoonCount > 0) {
        status = 'warning';
        message = `🔔 ${dueSoonCount} ${__('messages.task')}${dueSoonCount > 1 ? 's' : ''} ${__('messages.due_soon')}`;
        submessage = __('messages.white_smoke_alerts_upcoming_deadlines');
    } else if (totalPending > 0) {
        message = `📋 ${totalPending} ${__('messages.task')}${totalPending > 1 ? 's' : ''} ${__('messages.pending')}`;
        submessage = __('messages.everything_under_control_no_emergencies');
    } else {
        message = '✨ ' + __('messages.everything_in_order_no_tasks_pending');
        submessage = __('messages.your_orb_is_tranquil');
    }

    return (
        <div className="flex flex-col items-center gap-4 py-6">
            <RemembrallOrb state={status} size={200} />
            <div className="text-center">
                <p className="font-heading text-2xl font-semibold text-foreground">{message}</p>
                <p className="font-body text-sm text-muted-foreground mt-1">{submessage}</p>
            </div>
        </div>
    );
}