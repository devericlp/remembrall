<?php

namespace App\Http\Controllers\Profile;

use App\Actions\Users\GetPushDeviceStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ShowPushDeviceStatusController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $deviceId = request()->string('device_id')->toString();

        $enabled = $deviceId !== ''
            ? app(GetPushDeviceStatus::class)->handle(request()->user(), $deviceId)
            : false;

        return response()->json(['enabled' => $enabled]);
    }
}
