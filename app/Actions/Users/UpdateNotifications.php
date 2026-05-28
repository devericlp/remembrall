<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UpdateNotifications
{
    /**
     * Update the user's notification settings.
     */
    public function handle(string $type, bool $enabled): void
    {
        $user = Auth::user();

        if ($type === 'receive_notifications' && ! $enabled) {
            $user->update([
                'receive_notifications' => false,
                'notify_overdue' => false,
                'notify_due_soon' => false,
            ]);
        } else {
            match ($type) {
                'receive_notifications' => $user->update([
                    'receive_notifications' => $enabled,
                ]),
                'notify_overdue' => $user->update([
                    'notify_overdue' => $enabled,
                ]),
                'notify_due_soon' => $user->update([
                    'notify_due_soon' => $enabled,
                ]),
                default => null
            };
        }
    }
}
