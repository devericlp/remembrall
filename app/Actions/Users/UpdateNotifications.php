<?php

namespace App\Actions\Users;

use Illuminate\Support\Facades\Auth;

class UpdateNotifications
{
    public function handle(bool $enabled): void
    {
        Auth::user()->update([
            'receive_notifications' => $enabled,
        ]);
    }
}
