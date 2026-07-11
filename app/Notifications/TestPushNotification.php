<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class TestPushNotification extends Notification
{
    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush(object $_notifiable, mixed $_notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title('Remembrall')
            ->body('🔔 Esta é uma notificação de teste.')
            ->icon('/icon.png')
            ->badge('/icon.png')
            ->data(['url' => '/profile']);
    }
}
