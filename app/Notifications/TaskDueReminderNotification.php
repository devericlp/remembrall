<?php

namespace App\Notifications;

use App\Models\Recurrence;
use App\Notifications\Channels\FcmChannel;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class TaskDueReminderNotification extends Notification
{
    public function __construct(private readonly Recurrence $recurrence) {}

    public function via(object $notifiable): array
    {
        return ['database', FcmChannel::class];
    }

    public function toFcm(object $_notifiable): array
    {
        return [
            'title' => $this->recurrence->task->title,
            'body' => '⏰ ' . Carbon::parse($this->recurrence->end_date)->format('H:i'),
            'url' => '/tasks/' . $this->recurrence->id,
        ];
    }

    public function toArray(object $_notifiable): array
    {
        return [
            'task_id'       => $this->recurrence->task_id,
            'recurrence_id' => $this->recurrence->id,
            'title'         => $this->recurrence->task->title,
            'end_date'      => $this->recurrence->end_date,
            'reminder'      => $this->recurrence->task->reminder,
        ];
    }
}
