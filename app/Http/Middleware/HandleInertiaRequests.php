<?php

namespace App\Http\Middleware;

use App\Actions\Tasks\GetOrbState;
use App\Actions\Users\GetAuthUser;
use App\Enums\Priorities;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $orbData = $request->user()
            ? app(GetOrbState::class)->handle($request->user()->id)
            : ['overdue_count' => 0, 'orb_state' => 'clear'];

        $flash = Inertia::getFlashed($request);

        return [
            'appName' => config('app.name'),
            'translations' => getTranslations(),
            'overdueTasksCount' => $orbData['overdue_count'],
            'orbState' => $orbData['orb_state'],
            'currentLanguage' => app()->getLocale(),
            'auth.user' => fn () => app(GetAuthUser::class)->handle(),
            'vapidPublicKey' => config('webpush.vapid.public_key'),
            'priorities' => Priorities::options(),
            'flash' => [
                'error' => $flash['error'] ?? null,
                'newAchievements' => $flash['newAchievements'] ?? null,
            ],
            ...parent::share($request),
        ];
    }
}
