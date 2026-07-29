<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\PushDevice;
use Illuminate\Http\JsonResponse;

class PushNotificationStatusController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $deviceId = request()->string('device_id')->toString();

        $enabled = $deviceId !== '' && PushDevice::query()
            ->where('user_id', request()->user()->id)
            ->where('device_id', $deviceId)
            ->where('enabled', true)
            ->exists();

        return response()->json(['enabled' => $enabled]);
    }
}
