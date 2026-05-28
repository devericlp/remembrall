<?php

namespace App\Http\Middleware;

use App\Actions\Tasks\GetCountOverdueTasks;
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
        return [
            'appName' => config('app.name'),
            'translations' => getTranslations(),
            'overdueTasksCount' => $request->user() ? app(GetCountOverdueTasks::class)->handle($request->user()->id) : 0,
            'currentLanguage' => app()->getLocale(),
            'auth.user' => fn () => app(GetAuthUser::class)->handle(),
            ...parent::share($request),
            //
        ];
    }
}
