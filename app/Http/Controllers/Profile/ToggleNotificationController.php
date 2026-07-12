<?php

namespace App\Http\Controllers\Profile;

use App\Actions\Users\DisablePushDevice;
use App\Actions\Users\RegisterPushDevice;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ToggleNotificationController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        $enabled = request()->boolean('enabled');
        $deviceId = request()->string('device_id')->toString();

        if ($enabled && $deviceId !== '' && request()->filled('token')) {
            app(RegisterPushDevice::class)->handle(
                request()->user(),
                $deviceId,
                request()->string('token')->toString(),
                request()->string('platform')->toString() ?: null,
            );
        } elseif (! $enabled && $deviceId !== '') {
            app(DisablePushDevice::class)->handle(request()->user(), $deviceId);
        }

        Inertia::flash('message', __('messages.notifications_updated_successfully'));

        return back();
    }
}
