<?php

namespace App\Actions\Users;

use App\Models\User;

class GetPushDeviceStatus
{
    public function handle(User $user, string $deviceId): bool
    {
        return $user->pushDevices()
            ->where('device_id', $deviceId)
            ->where('enabled', true)
            ->exists();
    }
}
