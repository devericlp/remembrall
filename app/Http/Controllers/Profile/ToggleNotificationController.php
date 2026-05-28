<?php

namespace App\Http\Controllers\Profile;

use App\Actions\Users\UpdateNotifications;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ToggleNotificationController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): RedirectResponse
    {
        $type = request()->input('type');
        $enabled = request()->boolean('enabled');

        app(UpdateNotifications::class)->handle(type: $type, enabled: $enabled);

        Inertia::flash('message', __('messages.notifications_updated_successfully'));

        return back();
    }
}
