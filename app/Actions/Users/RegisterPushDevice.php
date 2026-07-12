<?php

namespace App\Actions\Users;

use App\Models\PushDevice;
use App\Models\User;

class RegisterPushDevice
{
    public function handle(
        User $user,
        string $deviceId,
        string $token,
        ?string $platform = null,
    ): PushDevice {
        $tokenHash = hash('sha256', $token);

        PushDevice::where('token_hash', $tokenHash)
            ->where(function ($query) use ($user, $deviceId) {
                $query->where('user_id', '!=', $user->id)
                    ->orWhere('device_id', '!=', $deviceId);
            })
            ->delete();

        return PushDevice::updateOrCreate(
            ['user_id' => $user->id, 'device_id' => $deviceId],
            [
                'token' => $token,
                'token_hash' => $tokenHash,
                'platform' => $platform,
                'enabled' => true,
                'token_refreshed_at' => now(),
                'last_seen_at' => now(),
            ],
        );
    }
}
