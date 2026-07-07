<?php

namespace App\Jobs;

use App\Models\Recurrence;
use App\Notifications\TaskDueReminderNotification;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendTaskReminderNotification implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $uniqueFor = 86400;

    public function __construct(private readonly Recurrence $recurrence) {}

    public function uniqueId(): string
    {
        return (string) $this->recurrence->id;
    }

    public function handle(): void
    {
        $this->recurrence->loadMissing('task.user');

        $user = $this->recurrence->task->user;

        if ($user->receive_notifications && $user->notify_due_soon) {
            $user->notify(new TaskDueReminderNotification($this->recurrence));
        }
    }
}
