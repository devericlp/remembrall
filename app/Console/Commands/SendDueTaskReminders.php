<?php

namespace App\Console\Commands;

use App\Models\Recurrence;
use App\Notifications\TaskDueReminderNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendDueTaskReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:send-due';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send push notifications for task reminders that are due';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $recurrences = Recurrence::query()
            ->reminderDue()
            ->with(['task.user'])
            ->get();

        if ($recurrences->isEmpty()) {
            return self::SUCCESS;
        }

        Log::channel('reminders')->info('reminders.batch.start', [
            'count' => $recurrences->count(),
        ]);

        $sent = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($recurrences as $recurrence) {
            match ($this->sendReminder($recurrence)) {
                'sent' => $sent++,
                'skipped' => $skipped++,
                'failed' => $failed++,
            };
        }

        Log::channel('reminders')->info('reminders.batch.finish', [
            'total' => $recurrences->count(),
            'sent' => $sent,
            'skipped' => $skipped,
            'failed' => $failed,
        ]);

        return self::SUCCESS;
    }

    /**
     * @return 'sent'|'skipped'|'failed'
     */
    private function sendReminder(Recurrence $recurrence): string
    {
        $user = $recurrence->task->user;

        $context = [
            'recurrence_id' => $recurrence->id,
            'task_id' => $recurrence->task_id,
            'user_id' => $user->id,
            'reminder_at' => Carbon::parse($recurrence->reminder_at)->toDateTimeString(),
        ];

        if (! $user->pushDevices()->where('enabled', true)->exists()) {
            $recurrence->update(['reminder_sent_at' => now()]);

            Log::channel('reminders')->info('reminders.skipped.no_enabled_device', $context);

            return 'skipped';
        }

        try {
            $user->notify(new TaskDueReminderNotification($recurrence));

            $recurrence->update(['reminder_sent_at' => now()]);

            Log::channel('reminders')->info('reminders.sent', $context);

            return 'sent';
        } catch (Throwable $e) {
            Log::channel('reminders')->error('reminders.failed', [
                ...$context,
                'error' => $e->getMessage(),
                'exception' => $e::class,
            ]);

            return 'failed';
        }
    }
}
