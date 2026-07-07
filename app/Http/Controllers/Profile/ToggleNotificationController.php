<?php

namespace App\Http\Controllers\Profile;

use App\Actions\Users\UpdateNotifications;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ToggleNotificationController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        $enabled = request()->boolean('enabled');

        app(UpdateNotifications::class)->handle($enabled);

        if ($enabled && request()->has('subscription.endpoint')) {
            request()->user()->updatePushSubscription(
                request()->input('subscription.endpoint'),
                request()->input('subscription.keys.p256dh'),
                request()->input('subscription.keys.auth'),
            );
        } elseif (! $enabled) {
            request()->user()->pushSubscriptions()->delete();
        }

        Inertia::flash('message', __('messages.notifications_updated_successfully'));

        return back();
    }
}
