<?php

namespace App\Notifications;

use App\Models\Recurrence;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class TaskDueReminderNotification extends Notification
{
    public function __construct(private readonly Recurrence $recurrence) {}

    public function via(object $notifiable): array
    {
        return ['database', WebPushChannel::class];
    }

    public function toWebPush(object $_notifiable, mixed $_notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title($this->recurrence->task->title)
            ->body('⏰ ' . Carbon::parse($this->recurrence->end_date)->format('H:i'))
            ->icon('/icon.png')
            ->badge('/icon.png')
            ->data(['url' => '/tasks/' . $this->recurrence->id]);
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
