<?php

namespace App\Providers;

use App\Actions\Tasks\GetOrbState;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use NotificationChannels\WebPush\Events\NotificationFailed;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(function (NotificationFailed $event) {
            Log::warning('WebPush notification failed', [
                'endpoint' => $event->report->getEndpoint(),
                'reason' => $event->report->getReason(),
                'status' => $event->report->getResponse()?->getStatusCode(),
                'response' => $event->report->getResponseContent(),
            ]);
        });
    }
}
