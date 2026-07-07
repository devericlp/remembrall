<?php

namespace App\Actions\Tasks;

use App\Enums\ReminderIntervals;
use App\Jobs\SendTaskReminderNotification;
use App\Models\Recurrence;
use Illuminate\Support\Carbon;

class CheckDueTaskReminders
{
    public function handle(): void
    {
        $now = Carbon::now();

        Recurrence::query()
            ->with(['task.user'])
            ->whereNull('completed_at')
            ->whereDate('end_date', today())
            ->whereNotNull('reminder_at')
            ->where('reminder_at', '>', $now)
            ->whereHas('task', fn ($q) => $q->where('reminder', '!=', ReminderIntervals::NO_REMINDER->value))
            ->get()
            ->each(function (Recurrence $recurrence) use ($now) {
                $fireAt = Carbon::parse($recurrence->reminder_at)->subMinute();
                $delaySeconds = max(0, $fireAt->getTimestamp() - $now->getTimestamp());

                SendTaskReminderNotification::dispatch($recurrence)
                    ->delay($delaySeconds);
            });
    }
}
