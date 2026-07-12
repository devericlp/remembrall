<?php

namespace App\Http\Middleware;

use App\Actions\Tasks\GetOrbState;
use App\Actions\Users\GetAuthUser;
use Illuminate\Http\Request;
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

        return [
            'appName' => config('app.name'),
            'overdueTasksCount' => $orbData['overdue_count'],
            'orbState' => $orbData['orb_state'],
            'currentLanguage' => app()->getLocale(),
            'auth.user' => fn () => app(GetAuthUser::class)->handle(),
            ...parent::share($request),
        ];
    }

    public function shareOnce(Request $request): array
    {
        return array_merge(parent::shareOnce($request), [
            'translations' => fn () => getTranslations(),
        ]);
    }
}
