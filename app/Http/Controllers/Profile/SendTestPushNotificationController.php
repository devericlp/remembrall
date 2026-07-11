<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Notifications\TestPushNotification;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class SendTestPushNotificationController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        $user = request()->user();

        if (! $user->receive_notifications || $user->pushSubscriptions()->doesntExist()) {
            Inertia::flash('message', __('messages.push_not_supported'));

            return back();
        }

        $user->notify(new TestPushNotification);

        Inertia::flash('message', __('messages.test_notification_sent'));

        return back();
    }
}
