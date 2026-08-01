<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\PushDevice;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ViewProfileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $deviceId = request()->cookie('push_device_id', '');

        $pushNotificationsEnabled = $deviceId !== '' && PushDevice::query()
            ->where('user_id', request()->user()->id)
            ->where('device_id', $deviceId)
            ->where('enabled', true)
            ->exists();

        return Inertia::render('App/Profile', [
            'languages' => [
                ['key' => 'en', 'title' => __('messages.english')],
                ['key' => 'pt_BR', 'title' => __('messages.portuguese')],
            ],
            'systemTime' => Carbon::now()->toIso8601String(),
            'pushNotificationsEnabled' => $pushNotificationsEnabled,
        ]);
    }
}
