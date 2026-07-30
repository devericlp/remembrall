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
            $context = [
                'device_id' => $device->device_id,
                'user_id' => $device->user_id,
                'notification' => $notification::class,
            ];

            $message = CloudMessage::new()
                ->withData($payload)
                ->withToken($device->token);

            try {
                $this->messaging->send($message);

                $device->update(['last_success_at' => now()]);

                Log::info('fcm.send.success', $context);
            } catch (NotFound|InvalidArgument $e) {
                $device->update([
                    'enabled' => false,
                    'last_failure_at' => now(),
                    'last_error_code' => class_basename($e),
                    'last_error_message' => $e->getMessage(),
                ]);

                Log::warning('fcm.send.invalid_token', [
                    ...$context,
                    'error' => $e->getMessage(),
                ]);
            } catch (MessagingException $e) {
                $device->update([
                    'last_failure_at' => now(),
                    'last_error_code' => class_basename($e),
                    'last_error_message' => $e->getMessage(),
                ]);

                Log::error('fcm.send.failed', [
                    ...$context,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
