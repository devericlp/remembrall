<?php

namespace App\Actions\Users;

use App\Models\User;

class DisablePushDevice
{
    public function handle(User $user, string $deviceId): void
    {
        $user->pushDevices()->where('device_id', $deviceId)->update(['enabled' => false]);
    }
}
