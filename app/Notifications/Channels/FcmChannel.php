<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Exception\Messaging\InvalidArgument;
use Kreait\Firebase\Exception\Messaging\NotFound;
use Kreait\Firebase\Exception\MessagingException;
use Kreait\Firebase\Messaging\CloudMessage;

class FcmChannel
{
    public function __construct(private readonly Messaging $messaging) {}

    public function send(object $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toFcm')) {
            return;
        }

        $payload = $notification->toFcm($notifiable);

        $devices = $notifiable->pushDevices()->where('enabled', true)->get();

        foreach ($devices as $device) {
            $message = CloudMessage::new()
                ->withData($payload)
                ->withToken($device->token);

            try {
                $this->messaging->send($message);

                $device->update(['last_success_at' => now()]);
            } catch (NotFound|InvalidArgument $e) {
                $device->update([
                    'enabled' => false,
                    'last_failure_at' => now(),
                    'last_error_code' => class_basename($e),
                    'last_error_message' => $e->getMessage(),
                ]);
            } catch (MessagingException $e) {
                Log::warning('FCM notification failed', [
                    'device_id' => $device->device_id,
                    'user_id' => $device->user_id,
                    'error' => $e->getMessage(),
                ]);

                $device->update([
                    'last_failure_at' => now(),
                    'last_error_code' => class_basename($e),
                    'last_error_message' => $e->getMessage(),
                ]);
            }
        }
    }
}
